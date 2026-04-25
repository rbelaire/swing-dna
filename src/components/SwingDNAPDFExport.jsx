import { useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import { DNA_CATEGORIES } from '../data/swingDNA'

const COLORS = {
  page: [10, 12, 15],
  panel: [17, 24, 39],
  border: [37, 99, 235],
  heading: [248, 250, 252],
  body: [148, 163, 184],
  accent: [29, 185, 84],
  warning: [248, 113, 113],
  gold: [212, 168, 67],
}

const PAGE_MARGIN = 14
const BASE_LINE_HEIGHT = 6

function toTitleCase(text) {
  return text
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function drawPageFrame(doc) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFillColor(...COLORS.page)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.35)
  doc.rect(PAGE_MARGIN - 4, PAGE_MARGIN - 4, pageWidth - (PAGE_MARGIN - 4) * 2, pageHeight - (PAGE_MARGIN - 4) * 2)

  doc.setDrawColor(29, 185, 84)
  doc.setLineWidth(0.7)
  doc.line(PAGE_MARGIN, PAGE_MARGIN, pageWidth - PAGE_MARGIN, PAGE_MARGIN)
}

function createWriter(doc) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PAGE_MARGIN * 2
  let y = PAGE_MARGIN + 10

  const ensureSpace = requiredHeight => {
    const lowerLimit = pageHeight - PAGE_MARGIN
    if (y + requiredHeight > lowerLimit) {
      doc.addPage()
      drawPageFrame(doc)
      y = PAGE_MARGIN + 10
    }
  }

  const addSpacer = (height = 4) => {
    y += height
  }

  const addWrappedText = ({ text, fontSize = 11, color = COLORS.body, indent = 0, lineHeight = BASE_LINE_HEIGHT, style = 'normal' }) => {
    if (!text) return

    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)

    const width = contentWidth - indent
    const lines = doc.splitTextToSize(text, width)
    const blockHeight = lines.length * lineHeight

    ensureSpace(blockHeight + 1)
    doc.text(lines, PAGE_MARGIN + indent, y)
    y += blockHeight
  }

  const addPill = label => {
    const text = label.toUpperCase()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)

    const paddingX = 3
    const paddingY = 1.8
    const textWidth = doc.getTextWidth(text)
    const pillHeight = 6
    const pillWidth = textWidth + paddingX * 2

    ensureSpace(pillHeight + 4)

    doc.setFillColor(24, 36, 54)
    doc.setDrawColor(...COLORS.border)
    doc.roundedRect(PAGE_MARGIN, y - 4.3, pillWidth, pillHeight, 1.2, 1.2, 'FD')

    doc.setTextColor(...COLORS.accent)
    doc.text(text, PAGE_MARGIN + paddingX, y)

    y += paddingY + 3.2
  }

  const addPanel = ({ title, body, color = COLORS.accent, bodyColor = COLORS.body }) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)

    const titleLines = doc.splitTextToSize(title, contentWidth - 10)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10.5)
    const bodyLines = doc.splitTextToSize(body, contentWidth - 10)

    const panelHeight = 10 + titleLines.length * 5 + bodyLines.length * 5
    ensureSpace(panelHeight + 4)

    doc.setFillColor(...COLORS.panel)
    doc.setDrawColor(51, 65, 85)
    doc.roundedRect(PAGE_MARGIN, y - 4.5, contentWidth, panelHeight, 1.5, 1.5, 'FD')

    doc.setFillColor(...color)
    doc.rect(PAGE_MARGIN, y - 4.5, 1.5, panelHeight, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...COLORS.heading)
    doc.text(titleLines, PAGE_MARGIN + 4, y)

    const titleHeight = titleLines.length * 5 + 1
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10.5)
    doc.setTextColor(...bodyColor)
    doc.text(bodyLines, PAGE_MARGIN + 4, y + titleHeight)

    y += panelHeight + 2
  }

  const addList = ({ heading, items, bullet = '•', color = COLORS.body }) => {
    if (!items?.length) return

    addWrappedText({ text: heading, fontSize: 10, color: COLORS.heading, style: 'bold' })
    addSpacer(1)

    items.forEach(item => {
      addWrappedText({ text: `${bullet} ${item}`, fontSize: 10, color, indent: 3, lineHeight: 5.2 })
      addSpacer(0.2)
    })

    addSpacer(1)
  }

  return {
    addSpacer,
    addWrappedText,
    addPill,
    addPanel,
    addList,
    ensureSpace,
  }
}

function addCategoryToPdf(doc, category, isSingleCategory = false) {
  if (!isSingleCategory) {
    doc.addPage()
  }

  drawPageFrame(doc)
  const writer = createWriter(doc)

  writer.addWrappedText({
    text: `${category.section} · ${category.index}`,
    fontSize: 9,
    color: COLORS.body,
    style: 'bold',
    lineHeight: 4.8,
  })

  writer.addWrappedText({
    text: `${category.title}${category.titleEm ? ` ${category.titleEm}` : ''}`,
    fontSize: 26,
    color: COLORS.heading,
    style: 'bold',
    lineHeight: 10,
  })

  writer.addSpacer(2)
  writer.addPanel({
    title: 'Category Overview',
    body: category.intro,
    color: COLORS.accent,
  })

  if (category.definition) {
    writer.addPanel({
      title: 'Definition',
      body: category.definition,
      color: [77, 166, 255],
    })
  }

  category.options.forEach((option, optionIndex) => {
    const tone = option.color === 'gold' ? COLORS.gold : COLORS.accent

    writer.ensureSpace(20)
    writer.addPill(`Option ${optionIndex + 1}`)

    const optionTitle = option.sublabel ? `${option.label} — ${option.sublabel}` : option.label
    writer.addPanel({
      title: optionTitle,
      body: option.summary,
      color: tone,
      bodyColor: COLORS.heading,
    })

    writer.addWrappedText({
      text: option.content,
      fontSize: 10.5,
      color: COLORS.body,
      lineHeight: 5.2,
    })

    writer.addSpacer(2)

    if (option.drills?.length) {
      writer.addWrappedText({ text: 'Recommended Drills', fontSize: 10, color: COLORS.heading, style: 'bold' })
      writer.addSpacer(1)
      option.drills.forEach((drill, idx) => {
        writer.addPanel({
          title: `${idx + 1}. ${drill.title}`,
          body: drill.body,
          color: [59, 130, 246],
        })
      })
    }

    if (option.pros?.length) {
      writer.addList({
        heading: 'Tour Players — Same Profile',
        items: option.pros,
        bullet: '•',
        color: COLORS.body,
      })
    }

    if (option.warnings?.length) {
      option.warnings.forEach(warning => {
        writer.addPanel({
          title: 'Coaching Warning',
          body: warning,
          color: COLORS.warning,
          bodyColor: [252, 165, 165],
        })
      })
    }

    writer.addSpacer(2)
  })

  if (category.instructorNote) {
    writer.addPanel({
      title: 'Instructor Note',
      body: category.instructorNote,
      color: [77, 166, 255],
      bodyColor: COLORS.body,
    })
  }
}

function generateSwingDnaPDF(selectedId) {
  const isAll = selectedId === 'all'
  const categories = isAll
    ? DNA_CATEGORIES
    : DNA_CATEGORIES.filter(category => category.id === selectedId)

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  addCategoryToPdf(doc, categories[0], !isAll)
  for (let i = 1; i < categories.length; i += 1) {
    addCategoryToPdf(doc, categories[i], false)
  }

  if (isAll) {
    const pageCount = doc.getNumberOfPages()
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page)
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...COLORS.body)
      doc.text(`Swing DNA Master Reference · Page ${page} of ${pageCount}`, pageWidth - PAGE_MARGIN, pageHeight - 6, { align: 'right' })
    }
  }

  return doc
}

export default function SwingDNAPDFExport() {
  const [selectedId, setSelectedId] = useState('all')

  const options = useMemo(
    () => [
      { value: 'all', label: 'Entire Swing DNA Document' },
      ...DNA_CATEGORIES.map(category => ({
        value: category.id,
        label: `${category.index}. ${category.title}${category.titleEm ? ` ${category.titleEm}` : ''}`,
      })),
    ],
    []
  )

  const handleDownload = () => {
    const doc = generateSwingDnaPDF(selectedId)
    const fileName =
      selectedId === 'all'
        ? 'Swing_DNA_Master_Reference.pdf'
        : `Swing_DNA_${toTitleCase(selectedId).replace(/\s+/g, '_')}.pdf`

    doc.save(fileName)
  }

  return (
    <div className="pdf-export-card">
      <h3>Swing DNA PDF Export</h3>
      <p>Export one biometric category or the complete Swing DNA playbook. In full export mode, every category starts on its own page.</p>

      <label htmlFor="swing-dna-export-select">Choose export scope</label>
      <select
        id="swing-dna-export-select"
        value={selectedId}
        onChange={event => setSelectedId(event.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button onClick={handleDownload} className="btn-pdf-download" type="button">
        Download Swing DNA PDF
      </button>
    </div>
  )
}

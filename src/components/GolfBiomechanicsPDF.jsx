import { jsPDF } from 'jspdf'

export function generateGolfBiomechanicsPDF() {
  const doc = new jsPDF()
  let y = 10
  const pageHeight = doc.internal.pageSize.height
  const margin = 10
  const contentWidth = doc.internal.pageSize.width - 2 * margin

  function addText(text, fontSize = 10, isBold = false) {
    doc.setFontSize(fontSize)
    if (isBold) doc.setFont(undefined, 'bold')
    const splitText = doc.splitTextToSize(text, contentWidth)
    doc.text(splitText, margin, y)
    y += (splitText.length * fontSize) / 2.5 + 2
    if (isBold) doc.setFont(undefined, 'normal')
    if (y > pageHeight - 15) {
      doc.addPage()
      y = 10
    }
  }

  function addHeading(text, fontSize = 14) {
    addText(text, fontSize, true)
  }

  function addSection(title) {
    if (y > pageHeight - 25) {
      doc.addPage()
      y = 10
    }
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(title, margin, y)
    y += 8
    doc.setFont(undefined, 'normal')
  }

  // Title
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('GOLF BIOMECHANICS', margin, y)
  y += 6
  doc.text('INTAKE & VIDEO SUBMISSION', margin, y)
  y += 12
  doc.setFont(undefined, 'normal')

  // Purpose
  addHeading('Purpose', 12)
  addText(
    'This process identifies how your body is built to move so your swing can match it.\nFollow instructions exactly to ensure accurate results.'
  )

  // Section 1
  addSection('SECTION 1 — BODY MEASUREMENTS')
  addText('Use a tape measure. All measurements in inches.', 10)
  y += 4

  addText('Required:', 10, true)
  addText('Height: _________________', 10)
  addText('Wingspan (fingertip to fingertip): _________________', 10)
  y += 4

  addText('Trail Arm Measurements (Right arm for right-handed golfers)', 10, true)
  addText('Knuckle → Elbow: _________________', 10)
  addText('Collarbone → Elbow: _________________', 10)

  // Section 2
  addSection('SECTION 2 — MOVEMENT TESTS')
  addText('Perform these slowly. No compensations.', 10)
  y += 4

  addText('A. Trail Hand Rotation (No Shoulder Movement)', 10, true)
  addText('Instructions:', 9, true)
  addText(
    '• Stand tall\n• Keep shoulders completely still\n• Rotate ONLY your trail hand',
    9
  )
  addText('Select one:', 9, true)
  addText('☐ Palm Up    ☐ Palm Down    ☐ Sideways', 9)
  y += 2

  addText('B. Hip Rotation Toward Target', 10, true)
  addText('Instructions:', 9, true)
  addText(
    '• Stand in golf posture\n• Rotate hips toward target\n• Keep upper body quiet',
    9
  )
  addText('Select one:', 9, true)
  addText('☐ Less than 45°    ☐ About 45°    ☐ More than 45°', 9)
  y += 2

  addText('C. Hip Rotation Away From Target (Load Test)', 10, true)
  addText('Instructions:', 9, true)
  addText(
    '• Rotate hips away from target\n• Notice where pressure naturally shifts',
    9
  )
  addText('Select one:', 9, true)
  addText(
    '☐ Lead side (front foot)    ☐ Trail side (back foot)    ☐ Balanced',
    9
  )

  // Section 3
  if (y > pageHeight - 40) {
    doc.addPage()
    y = 10
  }
  addSection('SECTION 3 — SWING VIDEO REQUIREMENTS')
  addText('Submit BOTH angles.', 10)
  y += 4

  addText('1. Down-the-Line (DTL)', 10, true)
  addText('Camera Setup:', 9, true)
  addText(
    '• Height: Hand height\n• Position: Directly behind hands\n• Alignment: On target line',
    9
  )
  addText('Requirements:', 9, true)
  addText('• Full body visible (feet to head)\n• Camera stable (no handheld)\n• 5 swings minimum', 9)
  y += 3

  addText('2. Face-On (FO)', 10, true)
  addText('Camera Setup:', 9, true)
  addText(
    '• Height: Chest height\n• Position: Directly facing chest\n• Centered on sternum',
    9
  )
  addText('Requirements:', 9, true)
  addText('• Full body visible\n• 5 swings minimum', 9)

  // Section 4
  addSection('SECTION 4 — COMMON MISTAKES (AVOID THESE)')
  addText(
    '• Camera too low or too high\n• Camera not aligned with target line\n• Feet cut out of frame\n• Poor lighting\n• Only sending 1 swing',
    10
  )

  // Section 5
  addSection('SECTION 5 — WHAT YOU WILL RECEIVE')
  addText('Your report will include:', 10, true)
  addText(
    '• Your swing DNA profile\n• Setup recommendations\n• Motion pattern (how YOU should move)\n• Key swing rules\n• Miss patterns and fixes\n• Practice plan',
    10
  )

  // Final Checklist
  if (y > pageHeight - 40) {
    doc.addPage()
    y = 10
  }
  addSection('FINAL CHECKLIST')
  addText('Before submitting:', 10)
  addText(
    '☐ All measurements completed\n☐ Movement tests selected\n☐ 5 DTL swings recorded\n☐ 5 Face-on swings recorded\n☐ Videos are clear and stable',
    10
  )
  y += 4
  addText('Submit all materials to your coach for analysis.', 10, true)

  return doc
}

export default function GolfBiomechanicsPDF() {
  function handleDownloadPDF() {
    const doc = generateGolfBiomechanicsPDF()
    doc.save('Golf_Biomechanics_Intake.pdf')
  }

  return (
    <button onClick={handleDownloadPDF} className="btn-pdf-download">
      Download Intake Form
    </button>
  )
}

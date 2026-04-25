import { DNA_CATEGORIES } from './swingDNA';

export type SwingDnaCategoryGroup =
  | 'Physical DNA'
  | 'Setup'
  | 'Motions'
  | 'Power Source';

export type SwingDnaDrill = {
  name: string;
  description: string;
};

export type SwingDnaOption = {
  id: string;
  label: string;
  shortDescription: string;
  details: string;
  coachingWarning?: string;
  instructorNote?: string;
  recommendedDrills?: SwingDnaDrill[];
  tourPlayers?: string[];
};

export type SwingDnaSection = {
  id: string;
  group: SwingDnaCategoryGroup;
  title: string;
  categoryOverview: string;
  definition?: string;
  instructorNote?: string;
  options: SwingDnaOption[];
};

const BROKEN_TEXT_FIXES: Array<[RegExp, string]> = [
  [/!’/g, "!'"],
  [/“|”/g, '"'],
  [/‘|’/g, "'"],
  [/\s+/g, ' '],
];

const cleanText = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = BROKEN_TEXT_FIXES.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  ).trim();

  return normalized.length > 0 ? normalized : undefined;
};

const mergeWarnings = (warnings?: string[]): string | undefined => {
  if (!warnings || warnings.length === 0) {
    return undefined;
  }

  return warnings
    .map((warning) => cleanText(warning))
    .filter(Boolean)
    .join(' ');
};

export const SWING_DNA_SECTIONS: SwingDnaSection[] = DNA_CATEGORIES.map((category) => ({
  id: category.id,
  group: category.section as SwingDnaCategoryGroup,
  title: [category.title, category.titleEm].filter(Boolean).join(' '),
  categoryOverview: cleanText(category.intro) ?? '',
  definition: cleanText(category.definition),
  instructorNote: cleanText(category.instructorNote),
  options: category.options.map((option) => ({
    id: option.id,
    label: [option.label, option.sublabel].filter(Boolean).join(' — '),
    shortDescription: cleanText(option.summary) ?? '',
    details: cleanText(option.content) ?? '',
    coachingWarning: mergeWarnings(option.warnings),
    recommendedDrills: option.drills?.length
      ? option.drills.map((drill) => ({
          name: cleanText(drill.title) ?? '',
          description: cleanText(drill.body) ?? '',
        }))
      : undefined,
    tourPlayers: option.pros?.length ? option.pros.map((pro) => cleanText(pro) ?? pro) : undefined,
  })),
}));

export const getSwingDnaSectionById = (id: string): SwingDnaSection | undefined =>
  SWING_DNA_SECTIONS.find((section) => section.id === id);

export const getSwingDnaSectionsByGroup = (
  group: SwingDnaCategoryGroup,
): SwingDnaSection[] => SWING_DNA_SECTIONS.filter((section) => section.group === group);

export const getSwingDnaGroups = (): SwingDnaCategoryGroup[] =>
  [...new Set(SWING_DNA_SECTIONS.map((section) => section.group))] as SwingDnaCategoryGroup[];

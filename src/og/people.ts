// Copied from the web repo's src/lib/people.ts; keep the two in sync.
/**
 * Trophy Daylight's cast: the outlines every person is drawn from. Shared by
 * the on-page data portrait (components/Person.tsx) and the OG image renderer
 * (og/person-dots.ts), so a person looks the same everywhere.
 */

export const W = 120
export const H = 140

export const BUST =
  'M2 140 C4 122 14 112 34 108 C44 106 50 104 54 100 L78 100 C82 104 90 107 100 110 C112 114 118 124 119 140 Z'
export const HEAD =
  'M54 102 L54 94 C49.5 94 45 92.6 42 90.2 C39.6 88.4 38.8 86.4 39.4 84.6 C38 83.8 37.2 82.8 37.6 82 C38.2 81.2 38.2 80.6 37.2 79.8 C36.6 79.2 37 78.2 38.2 77.6 C38.6 76.6 38.4 75.8 37.4 75.2 C36 74.6 34.4 74 33.6 73 C33 72 33.6 71.2 34.8 70.4 L39.2 66.4 C40 63.6 40.6 61 41 58.8 C41.5 50 47 41 58 39 C70 37 81 44 83 56 C84.5 65 83 72 80 78 C78.5 82 77.8 86 78 92 L78 102 Z'
export const SHORT =
  'M41.5 57 C42 46 49 39 59 38 C71 37 82 44 83.5 56 C84 62 83 67 81 71 C79 66 76 63 72 62 C71 58 69 55 66 54 C60 53 52 54 46 53 C44 53.5 42.5 55 41.5 57 Z'

export type Shape = { d: string } | { cx: number; cy: number; r: number }

export const HAIR: Record<string, Shape[]> = {
  short: [{ d: SHORT }],
  long: [
    {
      d: 'M42 56 C43 45 50 38 60 37.5 C72 37 82.5 44 84 56 C85.5 70 86 86 92 104 C96 112 100 116 104 118 C94 120 84 118 78 112 C77 100 78 90 79 80 C78 70 76 63 72 61 C69 56 64 53 57 53 C51 53 46 54 42 56 Z',
    },
  ],
  bun: [{ d: SHORT }, { cx: 80, cy: 43, r: 9 }],
  curls: [
    {
      d: 'M38 58 C34 50 38 40 46 36 C50 30 60 28 66 31 C72 28 82 31 85 38 C92 41 94 50 91 56 C95 62 93 72 87 75 C86 80 82 82 79 80 C78 72 76 64 71 61 C68 55 62 53 55 54 C50 54 44 55 41 59 C40 59.5 39 59 38 58 Z',
    },
  ],
  cap: [
    {
      d: 'M40.5 55 C41 46 48 39 59 38 C71 37 81 43 83 53 L84 58 C76 56 62 55 52 56 C44 55.6 35 56.2 27.5 58.6 C26.4 60.2 27.6 61.4 31 61 C38 60.2 45 59.8 52 59.8 L84 60 Z',
    },
  ],
  hood: [
    {
      d: 'M37 68 C33 50 42 32 62 30 C82 28 94 44 93 62 C92 74 88 84 88 94 L92 104 L70 104 C74 96 78 86 79 78 C81 70 81 62 78 55 C74 46 66 43 58 44 C51 45 46 48 43.5 54 C42 58 41.5 62 41.5 66 Z',
    },
  ],
  scarf: [
    {
      d: 'M39.5 62 C39 46 48 35 61 34 C75 33 86 43 88 57 C89.5 70 90 82 94 92 C97 99 102 104 108 108 L60 108 C54 104 50 99 47 93.5 C52 94 56 93 59 91 C66 88 73 82 76 74 C79 64 78 56 73 51 C67 46 58 45 51 48 C47 50 44 54 42 60 Z',
    },
  ],
  bob: [
    {
      d: 'M41.5 57 C42 46 49 39 59 38 C71 37 82 44 84 56 C85 66 85.5 76 84 86 C80 88 76 87 74 84 C77 76 76 66 72 61 C69 56 64 53 57 53 C51 53 46 54 41.5 57 Z',
    },
  ],
}

/**
 * The cast: illustrative personas from Trophy's journey write-ups. First
 * names only, no faces, no ages, never a real end user's data. `hair` picks
 * the outline, `tilt` nods the head (degrees, + looks down), `wide` sets the
 * shoulders.
 */
export const PEOPLE = {
  tom: { name: 'Tom', hair: 'short', tilt: 0, wide: 1.04 },
  joe: { name: 'Joe', hair: 'cap', tilt: -2, wide: 1.03 },
  priya: { name: 'Priya', hair: 'long', tilt: 3, wide: 0.96 },
  sam: { name: 'Sam', hair: 'hood', tilt: 4, wide: 1.0 },
  mei: { name: 'Mei', hair: 'bun', tilt: -3, wide: 0.95 },
  leo: { name: 'Leo', hair: 'curls', tilt: 2, wide: 1.0 },
  ellie: { name: 'Ellie', hair: 'bob', tilt: -2, wide: 0.96 },
  aisha: { name: 'Aisha', hair: 'scarf', tilt: 1, wide: 0.97 },
} as const

export type PersonKey = keyof typeof PEOPLE

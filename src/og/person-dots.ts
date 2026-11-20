// Copied from the web repo's src/og/person-dots.ts; keep the two in sync.
/**
 * The data portrait's points for the OG image, measured on the server.
 *
 * components/Person.tsx measures each person on a browser canvas; there is no
 * canvas here, so this rasterises the same outlines (lib/people.ts) with a
 * small scanline filler and then runs the same grid, coverage and seed, so a
 * person's points match the ones on the site.
 */

import { BUST, H, HAIR, HEAD, PEOPLE, type PersonKey, W } from './people'

export type Dot = { x: number; y: number; r: number; o: number }

type Point = [number, number]

/** Samples per unit, as Person.tsx's canvas */
const Q = 4
/** Minimum share of a grid cell the figure must cover for its point to show */
const COVERAGE_MIN = 0.22
/** Line segments per cubic curve */
const CURVE_STEPS = 24

/** Flatten an absolute M/L/C/Z path into closed polygons */
function pathToPolygons(d: string): Point[][] {
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+/g) ?? []
  const polygons: Point[][] = []
  let current: Point[] = []
  let command = ''
  let i = 0
  const num = () => Number(tokens[i++])

  while (i < tokens.length) {
    if (/[MLCZ]/.test(tokens[i])) command = tokens[i++]
    if (command === 'M') {
      if (current.length) polygons.push(current)
      current = [[num(), num()]]
      command = 'L'
    } else if (command === 'L') {
      current.push([num(), num()])
    } else if (command === 'C') {
      const [x0, y0] = current[current.length - 1]
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x3 = num(), y3 = num()
      for (let s = 1; s <= CURVE_STEPS; s++) {
        const t = s / CURVE_STEPS
        const u = 1 - t
        current.push([
          u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
          u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
        ])
      }
    } else if (command === 'Z') {
      if (current.length) polygons.push(current)
      current = []
    }
  }
  if (current.length) polygons.push(current)
  return polygons
}

function circleToPolygon(cx: number, cy: number, r: number): Point[] {
  const points: Point[] = []
  for (let s = 0; s < 64; s++) {
    const a = (s / 64) * Math.PI * 2
    points.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return points
}

/** Fill one shape's polygons (nonzero winding) into the mask */
function fill(mask: Uint8Array, polygons: Point[][]) {
  const cols = W * Q
  const rows = H * Q
  for (let row = 0; row < rows; row++) {
    const y = (row + 0.5) / Q
    const crossings: { x: number; dir: number }[] = []
    for (const polygon of polygons) {
      for (let k = 0; k < polygon.length; k++) {
        const [ax, ay] = polygon[k]
        const [bx, by] = polygon[(k + 1) % polygon.length]
        if (ay <= y === by <= y) continue
        crossings.push({
          x: ax + ((y - ay) / (by - ay)) * (bx - ax),
          dir: by > ay ? 1 : -1,
        })
      }
    }
    crossings.sort((a, b) => a.x - b.x)
    let winding = 0
    for (let k = 0; k < crossings.length - 1; k++) {
      winding += crossings[k].dir
      if (winding === 0) continue
      const from = Math.max(0, Math.ceil(crossings[k].x * Q - 0.5))
      const to = Math.min(cols - 1, Math.floor(crossings[k + 1].x * Q - 0.5))
      for (let col = from; col <= to; col++) mask[row * cols + col] = 1
    }
  }
}

const transform = (polygons: Point[][], fn: (p: Point) => Point) =>
  polygons.map((polygon) => polygon.map(fn))

function maskFor(who: PersonKey): Uint8Array {
  const person = PEOPLE[who]
  const mask = new Uint8Array(W * Q * H * Q)

  // Bust, with the shoulders scaled around the neck line
  fill(
    mask,
    transform(pathToPolygons(BUST), ([x, y]) => [66 + (x - 66) * person.wide, y]),
  )

  // Head and hair, nodded by the person's tilt
  const a = (person.tilt * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  const nod = ([x, y]: Point): Point => [
    66 + (x - 66) * cos - (y - 100) * sin,
    100 + (x - 66) * sin + (y - 100) * cos,
  ]
  fill(mask, transform(pathToPolygons(HEAD), nod))
  for (const shape of HAIR[person.hair]) {
    const polygons =
      'd' in shape
        ? pathToPolygons(shape.d)
        : [circleToPolygon(shape.cx, shape.cy, shape.r)]
    fill(mask, transform(polygons, nod))
  }
  return mask
}

const cache = new Map<PersonKey, Dot[]>()

/** The person's points, on the same 120 × 140 grid as Person.tsx */
export function personDots(who: PersonKey): Dot[] {
  const cached = cache.get(who)
  if (cached) return cached

  const mask = maskFor(who)
  const cols = W * Q
  const coverage = (cx: number, cy: number, half: number) => {
    const x0 = Math.max(0, Math.floor((cx - half) * Q))
    const x1 = Math.min(W * Q, Math.ceil((cx + half) * Q))
    const y0 = Math.max(0, Math.floor((cy - half) * Q))
    const y1 = Math.min(H * Q, Math.ceil((cy + half) * Q))
    let inside = 0
    let total = 0
    for (let yy = y0; yy < y1; yy++) {
      for (let xx = x0; xx < x1; xx++) {
        total++
        inside += mask[yy * cols + xx]
      }
    }
    return total ? inside / total : 0
  }

  let seed = 0
  for (let k = 0; k < who.length; k++) seed += who.charCodeAt(k) * (k + 3)
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  const dots: Dot[] = []
  const step = 5.2
  for (let y = 3; y < H; y += step) {
    for (let x = 3; x < W; x += step) {
      const covered = coverage(x, y, step / 2)
      if (covered >= COVERAGE_MIN) {
        const v = rnd()
        const edge = 0.55 + 0.45 * Math.min(1, covered / 0.8)
        dots.push({
          x: +x.toFixed(1),
          y: +y.toFixed(1),
          r: +((v < 0.25 ? 1.1 : v < 0.7 ? 1.6 : 2.1) * edge).toFixed(2),
          o: v < 0.25 ? 0.45 : 0.85,
        })
      }
    }
  }
  cache.set(who, dots)
  return dots
}

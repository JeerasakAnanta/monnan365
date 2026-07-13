import type { Attraction } from "@/lib/types";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SECONDARY_QUOTA = 0.35;

export function selectAttractions(
  attractions: Attraction[],
  styles: string[],
  days: number
): Attraction[] {
  const styleMatches = attractions.filter((a) =>
    a.category.some((c) => styles.includes(c))
  );
  const pool = styleMatches.length >= days * 3 ? styleMatches : attractions;

  const secondaryPool = shuffle(pool.filter((a) => a.is_secondary || a.is_community));
  const mainPool = shuffle(pool.filter((a) => !a.is_secondary && !a.is_community));

  const target = Math.min(pool.length, Math.max(days * 4, 12));
  const secondaryTarget = Math.ceil(target * SECONDARY_QUOTA);

  const secondaryPicks = secondaryPool.slice(0, secondaryTarget);
  const leftoverSecondary = secondaryPool.slice(secondaryTarget);
  const remaining = Math.max(target - secondaryPicks.length, 0);
  const mainPicks = shuffle([...mainPool, ...leftoverSecondary]).slice(0, remaining);

  return shuffle([...secondaryPicks, ...mainPicks]);
}

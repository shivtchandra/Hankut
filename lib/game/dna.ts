import type { KoreanCultureDNA } from "@/types/game";

export function getInitialDNA(): KoreanCultureDNA {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("kdrama_culture_dna");
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }

  return {
    drama: 78,
    music: 65,
    people: 72,
    culture: 58,
    hangul: 85,
    place: 62,
    food: 70,
  };
}

export function saveDNA(dna: KoreanCultureDNA): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kdrama_culture_dna", JSON.stringify(dna));
    } catch {
      // ignore
    }
  }
}

export function updateDNAOnSolve(category: keyof KoreanCultureDNA, points = 3): KoreanCultureDNA {
  const current = getInitialDNA();
  const updated = {
    ...current,
    [category]: Math.min(99, (current[category] || 50) + points),
  };
  saveDNA(updated);
  return updated;
}

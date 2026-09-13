import type { ConnectionGroup, ConnectionItem, ConnectionsPayload } from "@/types/game";

export type ConnectionsValidationResult = {
  isValid: boolean;
  errors: string[];
};

export function validateConnectionsPuzzle(puzzle: Partial<ConnectionsPayload>): ConnectionsValidationResult {
  const errors: string[] = [];

  if (!puzzle.groups || puzzle.groups.length !== 4) {
    errors.push("퍼즐에는 정확히 4개의 그룹이 있어야 합니다.");
  }

  const allItems: ConnectionItem[] = [];
  const seenTexts = new Set<string>();

  puzzle.groups?.forEach((group, index) => {
    if (!group.label?.trim()) {
      errors.push(`그룹 ${index + 1}의 제목이 누락되었습니다.`);
    }
    if (!group.items || group.items.length !== 4) {
      errors.push(`그룹 "${group.label || index + 1}"에는 정확히 4개의 항목이 있어야 합니다.`);
    } else {
      group.items.forEach((item) => {
        const textClean = item.text?.trim().toLowerCase();
        if (!textClean) {
          errors.push(`그룹 "${group.label}"에 빈 항목이 존재합니다.`);
        } else if (seenTexts.has(textClean)) {
          errors.push(`중복된 항목이 발견되었습니다: "${item.text}"`);
        }
        seenTexts.add(textClean);
        allItems.push(item);
      });
    }
  });

  if (allItems.length !== 16) {
    errors.push(`전체 카드는 16개여야 합니다. (현재 ${allItems.length}개)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function shuffleItems<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

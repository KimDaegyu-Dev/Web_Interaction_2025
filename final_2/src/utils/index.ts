import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 안전하게 병합합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UUID 생성
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

/**
 * 텍스트 길이 제한 (건물 외벽 텍스트용 - 최대 50자)
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}

/**
 * 텍스트 유효성 검사 (50자 이하)
 */
export function isValidBuildingText(
  text: string,
  maxLength: number = 50
): boolean {
  return text.length <= maxLength;
}

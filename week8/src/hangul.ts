import { World } from "wasm-game-of-life";

const ALL_INITIAL_CONSONANTS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const ALL_MEDIAL_VOWELS = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const ALL_FINAL_CONSONANTS = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

export const updateHangulSetOnWasm = (world: World, text: string) => {
  if (!text.trim()) {
    (world.update_char_sets as any)([], [], []);
    return;
  }

  const HANGUL_BASE_CODE = 44032;
  const HANGUL_END_CODE = 55203;
  const INITIAL_MULTIPLIER = 588;
  const MEDIAL_MULTIPLIER = 28;

  const initialConsonants = new Set<string>();
  const medialVowels = new Set<string>();
  const finalConsonants = new Set<string>();

  for (const char of text) {
    const code = char.charCodeAt(0);

    if (code >= HANGUL_BASE_CODE && code <= HANGUL_END_CODE) {
      const relativeCode = code - HANGUL_BASE_CODE;

      const initialIndex = Math.floor(relativeCode / INITIAL_MULTIPLIER);
      initialConsonants.add(ALL_INITIAL_CONSONANTS[initialIndex]);

      const medialIndex = Math.floor(
        (relativeCode % INITIAL_MULTIPLIER) / MEDIAL_MULTIPLIER
      );
      medialVowels.add(ALL_MEDIAL_VOWELS[medialIndex]);

      const finalIndex = relativeCode % MEDIAL_MULTIPLIER;
      if (finalIndex > 0) {
        const finalConsonant = ALL_FINAL_CONSONANTS[finalIndex];
        // Handle complex final consonants
        switch (finalConsonant) {
          case "ㄳ":
            finalConsonants.add("ㄱ");
            finalConsonants.add("ㅅ");
            break;
          case "ㄵ":
            finalConsonants.add("ㄴ");
            finalConsonants.add("ㅈ");
            break;
          case "ㄶ":
            finalConsonants.add("ㄴ");
            finalConsonants.add("ㅎ");
            break;
          case "ㄺ":
            finalConsonants.add("ㄹ");
            finalConsonants.add("ㄱ");
            break;
          case "ㄻ":
            finalConsonants.add("ㄹ");
            finalConsonants.add("ㅁ");
            break;
          case "ㄼ":
            finalConsonants.add("ㄹ");
            finalConsonants.add("ㅂ");
            break;
          case "ㄽ":
            finalConsonants.add("ㄹ");
            finalConsonants.add("ㅅ");
            break;
          case "ㄾ":
            finalConsonants.add("ㄹ");
            finalConsonants.add("ㅌ");
            break;
          case "ㄿ":
            finalConsonants.add("ㄹ");
            finalConsonants.add("ㅍ");
            break;
          case "ㅀ":
            finalConsonants.add("ㄹ");
            finalConsonants.add("ㅎ");
            break;
          case "ㅄ":
            finalConsonants.add("ㅂ");
            finalConsonants.add("ㅅ");
            break;
          default:
            finalConsonants.add(finalConsonant);
        }
      }
    } else if (ALL_INITIAL_CONSONANTS.includes(char)) {
      initialConsonants.add(char);
    } else if (ALL_MEDIAL_VOWELS.includes(char)) {
      medialVowels.add(char);
    } else if (ALL_FINAL_CONSONANTS.includes(char)) {
      finalConsonants.add(char);
    }
  }

  (world.update_char_sets as any)(
    Array.from(initialConsonants),
    Array.from(medialVowels),
    Array.from(finalConsonants)
  );
};

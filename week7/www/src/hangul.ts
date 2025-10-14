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
const FINAL_CONSONANTS_ARRAY = [
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
    world.update_char_sets([], []);
    return;
  }

  const HANGUL_BASE_CODE = 44032;
  const HANGUL_END_CODE = 55203;
  const INITIAL_CONSONANT_MULTIPLIER = 588;
  const MEDIAL_VOWEL_MULTIPLIER = 28;

  const foundConsonants = new Set<string>();
  const foundVowels = new Set<string>();

  for (const char of text) {
    const code = char.charCodeAt(0);

    if (code >= HANGUL_BASE_CODE && code <= HANGUL_END_CODE) {
      const relativeCode = code - HANGUL_BASE_CODE;

      const initialIndex = Math.floor(
        relativeCode / INITIAL_CONSONANT_MULTIPLIER
      );
      foundConsonants.add(ALL_INITIAL_CONSONANTS[initialIndex]);

      const medialIndex = Math.floor(
        (relativeCode % INITIAL_CONSONANT_MULTIPLIER) / MEDIAL_VOWEL_MULTIPLIER
      );
      foundVowels.add(ALL_MEDIAL_VOWELS[medialIndex]);

      const finalIndex = relativeCode % MEDIAL_VOWEL_MULTIPLIER;
      if (finalIndex > 0) {
        const finalConsonant = FINAL_CONSONANTS_ARRAY[finalIndex];
        switch (finalConsonant) {
          case "ㄳ":
            foundConsonants.add("ㄱ");
            foundConsonants.add("ㅅ");
            break;
          case "ㄵ":
            foundConsonants.add("ㄴ");
            foundConsonants.add("ㅈ");
            break;
          case "ㄶ":
            foundConsonants.add("ㄴ");
            foundConsonants.add("ㅎ");
            break;
          case "ㄺ":
            foundConsonants.add("ㄹ");
            foundConsonants.add("ㄱ");
            break;
          case "ㄻ":
            foundConsonants.add("ㄹ");
            foundConsonants.add("ㅁ");
            break;
          case "ㄼ":
            foundConsonants.add("ㄹ");
            foundConsonants.add("ㅂ");
            break;
          case "ㄽ":
            foundConsonants.add("ㄹ");
            foundConsonants.add("ㅅ");
            break;
          case "ㄾ":
            foundConsonants.add("ㄹ");
            foundConsonants.add("ㅌ");
            break;
          case "ㄿ":
            foundConsonants.add("ㄹ");
            foundConsonants.add("ㅍ");
            break;
          case "ㅀ":
            foundConsonants.add("ㄹ");
            foundConsonants.add("ㅎ");
            break;
          case "ㅄ":
            foundConsonants.add("ㅂ");
            foundConsonants.add("ㅅ");
            break;
          default:
            foundConsonants.add(finalConsonant);
        }
      }
    } else if (ALL_INITIAL_CONSONANTS.includes(char)) {
      foundConsonants.add(char);
    } else if (ALL_MEDIAL_VOWELS.includes(char)) {
      foundVowels.add(char);
    }
  }

  world.update_char_sets(Array.from(foundConsonants), Array.from(foundVowels));
};

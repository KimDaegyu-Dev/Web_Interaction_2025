/* tslint:disable */
/* eslint-disable */
export class World {
  free(): void;
  [Symbol.dispose](): void;
  constructor(width: number, height: number);
  update_char_sets(consonants: Array<any>, vowels: Array<any>): void;
  tick(silhouette: Uint8Array): void;
  alive_cell(row: number, col: number, cell_type: string): void;
  kill_cell(row: number, col: number): void;
  width(): number;
  height(): number;
  get_consonant_grid_ptr(): number;
  get_vowel_grid_ptr(): number;
  get_syllable_grid_ptr(): number;
}

mod utils;

use fixedbitset::FixedBitSet;
use wasm_bindgen::prelude::*;
use js_sys::{Array, JsString};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = Math)]
    fn random() -> f64;
}

// --- HANGUL CONSTANTS ---
const HANGUL_BASE_CODE: u32 = 44032;
const INITIAL_CONSONANT_MULTIPLIER: u32 = 588;
const MEDIAL_VOWEL_MULTIPLIER: u32 = 28;

const ALL_INITIAL_CONSONANTS: [char; 19] = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const ALL_MEDIAL_VOWELS: [char; 21] = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];

fn get_initial_consonant_code(c: char) -> Option<u32> {
    ALL_INITIAL_CONSONANTS.iter().position(|&x| x == c).map(|i| i as u32)
}

fn get_medial_vowel_code(c: char) -> Option<u32> {
    ALL_MEDIAL_VOWELS.iter().position(|&x| x == c).map(|i| i as u32)
}

fn get_final_consonant_code(c: char) -> Option<u32> {
    match c {
        'ㄱ' => Some(1), 'ㄲ' => Some(2), 'ㄳ' => Some(3), 'ㄴ' => Some(4), 'ㄵ' => Some(5), 'ㄶ' => Some(6), 'ㄷ' => Some(7),
        'ㄹ' => Some(8), 'ㄺ' => Some(9), 'ㄻ' => Some(10), 'ㄼ' => Some(11), 'ㄽ' => Some(12), 'ㄾ' => Some(13), 'ㄿ' => Some(14),
        'ㅀ' => Some(15), 'ㅁ' => Some(16), 'ㅂ' => Some(17), 'ㅄ' => Some(18), 'ㅅ' => Some(19), 'ㅆ' => Some(20), 'ㅇ' => Some(21),
        'ㅈ' => Some(22), 'ㅊ' => Some(23), 'ㅋ' => Some(24), 'ㅌ' => Some(25), 'ㅍ' => Some(26), 'ㅎ' => Some(27),
        _ => None,
    }
}

fn combine(initial: char, medial: char, final_char: Option<char>) -> char {
    let initial_code = get_initial_consonant_code(initial).unwrap_or(0);
    let medial_code = get_medial_vowel_code(medial).unwrap_or(0);
    let final_code = final_char.and_then(get_final_consonant_code).unwrap_or(0);

    let syllable_code = HANGUL_BASE_CODE + initial_code * INITIAL_CONSONANT_MULTIPLIER + medial_code * MEDIAL_VOWEL_MULTIPLIER + final_code;
    std::char::from_u32(syllable_code).unwrap_or(' ')
}


#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

impl From<bool> for Cell {
    fn from(b: bool) -> Self {
        if b { Cell::Alive } else { Cell::Dead }
    }
}

#[wasm_bindgen]
pub struct World {
    width: u32,
    height: u32,
    consonants: FixedBitSet,
    vowels: FixedBitSet,
    prev_consonants: FixedBitSet,
    prev_vowels: FixedBitSet,
    consonant_grid: Vec<u16>,
    vowel_grid: Vec<u16>,
    syllable_grid: Vec<u16>,
    prev_consonant_grid: Vec<u16>,
    prev_vowel_grid: Vec<u16>,
    prev_syllable_grid: Vec<u16>,
    active_consonants: Vec<char>,
    active_vowels: Vec<char>,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> World {
        utils::set_panic_hook();
        let size = (width * height) as usize;
        World {
            width,
            height,
            consonants: FixedBitSet::with_capacity(size),
            vowels: FixedBitSet::with_capacity(size),
            prev_consonants: FixedBitSet::with_capacity(size),
            prev_vowels: FixedBitSet::with_capacity(size),
            consonant_grid: vec![0; size],
            vowel_grid: vec![0; size],
            syllable_grid: vec![0; size],
            prev_consonant_grid: vec![0; size],
            prev_vowel_grid: vec![0; size],
            prev_syllable_grid: vec![0; size],
            active_consonants: ALL_INITIAL_CONSONANTS.to_vec(),
            active_vowels: ALL_MEDIAL_VOWELS.to_vec(),
        }
    }
    
    pub fn update_char_sets(&mut self, consonants: Array, vowels: Array) {
        self.active_consonants = consonants.iter().map(|c| c.as_string().unwrap_or_default().chars().next().unwrap_or(' ')).collect();
        self.active_vowels = vowels.iter().map(|c| c.as_string().unwrap_or_default().chars().next().unwrap_or(' ')).collect();
        if self.active_consonants.is_empty() {
            self.active_consonants = ALL_INITIAL_CONSONANTS.to_vec();
        }
        if self.active_vowels.is_empty() {
            self.active_vowels = ALL_MEDIAL_VOWELS.to_vec();
        }
    }
    
    fn get_random_consonant(&self) -> char {
        let idx = (random() * self.active_consonants.len() as f64).floor() as usize;
        self.active_consonants[idx]
    }

    fn get_random_vowel(&self) -> char {
        let idx = (random() * self.active_vowels.len() as f64).floor() as usize;
        self.active_vowels[idx]
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    pub fn tick(&mut self, speech_mode: JsString) -> Array {
        // Save previous state
        self.prev_consonants = self.consonants.clone();
        self.prev_vowels = self.vowels.clone();
        self.prev_consonant_grid = self.consonant_grid.clone();
        self.prev_vowel_grid = self.vowel_grid.clone();
        self.prev_syllable_grid = self.syllable_grid.clone();

        // --- 1. Calculate next liveness state ---
        let mut next_consonants = self.consonants.clone();
        let mut next_vowels = self.vowels.clone();
        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let (consonant_neighbors, vowel_neighbors, unique_live_neighbors) = self.count_neighbors(row, col);

                let current_consonant_cell = Cell::from(self.consonants[idx]);
                let current_vowel_cell = Cell::from(self.vowels[idx]);
                let is_syllable = current_consonant_cell == Cell::Alive && current_vowel_cell == Cell::Alive;

                // Determine next state for the consonant cell
                let next_consonant_is_alive = match (current_consonant_cell, unique_live_neighbors) {
                    (Cell::Alive, n) => {
                        if is_syllable {
                            n == 4 // Syllables only survive with exactly 3 neighbors
                        } else {
                            n == 2 || n == 3 // Lone consonants survive with 2 or 3
                        }
                    },
                    (Cell::Dead, 3) => consonant_neighbors > 0 || vowel_neighbors == 0, // Birth rule
                    _ => false,
                };
                next_consonants.set(idx, next_consonant_is_alive);

                // Determine next state for the vowel cell
                let next_vowel_is_alive = match (current_vowel_cell, unique_live_neighbors) {
                     (Cell::Alive, n) => {
                        if is_syllable {
                            n == 4 // Syllables only survive with exactly 3 neighbors
                        } else {
                            n == 2 || n == 3 // Lone vowels survive with 2 or 3
                        }
                    },
                    (Cell::Dead, 3) => vowel_neighbors > 0 || consonant_neighbors == 0, // Birth rule
                    _ => false,
                };
                next_vowels.set(idx, next_vowel_is_alive);
            }
        }
        self.consonants = next_consonants;
        self.vowels = next_vowels;

        // --- 2. Sync Grids & Handle Combinations ---
        let mut newly_formed_syllables: Vec<(usize, char, char)> = Vec::new();

        for idx in 0..self.consonant_grid.len() {
            let is_consonant_alive = self.consonants[idx];
            let was_consonant_alive = self.prev_consonants[idx];
            let is_vowel_alive = self.vowels[idx];
            let was_vowel_alive = self.prev_vowels[idx];

            if (!is_consonant_alive || !is_vowel_alive) && self.syllable_grid[idx] != 0 {
                self.syllable_grid[idx] = 0;
            }

            if !was_consonant_alive && is_consonant_alive {
                self.consonant_grid[idx] = self.get_random_consonant() as u16;
            } else if was_consonant_alive && !is_consonant_alive {
                self.consonant_grid[idx] = 0;
            }

            if !was_vowel_alive && is_vowel_alive {
                self.vowel_grid[idx] = self.get_random_vowel() as u16;
            } else if was_vowel_alive && !is_vowel_alive {
                self.vowel_grid[idx] = 0;
            }

            let consonant_char_code = self.consonant_grid[idx];
            let vowel_char_code = self.vowel_grid[idx];

            if consonant_char_code != 0 && vowel_char_code != 0 {
                let was_combined = was_consonant_alive && was_vowel_alive;
                if !was_combined {
                    let consonant_char = std::char::from_u32(consonant_char_code as u32).unwrap_or_default();
                    let vowel_char = std::char::from_u32(vowel_char_code as u32).unwrap_or_default();
                    newly_formed_syllables.push((idx, consonant_char, vowel_char));
                    self.syllable_grid[idx] = combine(consonant_char, vowel_char, None) as u16;
                    self.consonant_grid[idx] = 0;
                    self.vowel_grid[idx] = 0;
                }
            }
        }
        
        // --- 3. Attach Jongseong ---
        let mut final_syllables: Vec<String> = Vec::new();
        for (idx, initial, medial) in newly_formed_syllables {
            let row = (idx as u32) / self.width;
            let col = (idx as u32) % self.width;
            let final_consonant_row = (row + 1) % self.height;
            let final_idx = self.get_index(final_consonant_row, col);
            
            let mut final_syllable_char = combine(initial, medial, None);

            let potential_final_char_code = self.consonant_grid[final_idx];
            if potential_final_char_code != 0 {
                let potential_final = std::char::from_u32(potential_final_char_code as u32).unwrap_or_default();
                if get_final_consonant_code(potential_final).is_some() {
                    final_syllable_char = combine(initial, medial, Some(potential_final));
                    self.consonant_grid[final_idx] = 0;
                    self.consonants.set(final_idx, false);
                }
            }
            self.syllable_grid[idx] = final_syllable_char as u16;
            final_syllables.push(final_syllable_char.to_string());
        }

        // --- 4. Prepare speech list ---
        let speech_mode_str = speech_mode.as_string().unwrap_or_default();
        let syllables_to_speak: Vec<String>;

        if speech_mode_str == "new" {
            syllables_to_speak = final_syllables;
        } else { // "all"
            syllables_to_speak = self.syllable_grid.iter().filter_map(|&code| {
                if code == 0 { None } 
                else { Some(std::char::from_u32(code as u32).unwrap_or_default().to_string()) }
            }).collect();
        }
        
        syllables_to_speak.into_iter().map(JsValue::from).collect()
    }

    fn count_neighbors(&self, row: u32, col: u32) -> (u8, u8, u8) {
        let mut consonant_neighbors = 0;
        let mut vowel_neighbors = 0;
        let mut unique_live_neighbors = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 { continue; }
                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (col + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                
                let is_consonant = self.consonants[idx];
                let is_vowel = self.vowels[idx];

                if is_consonant { consonant_neighbors += 1; }
                if is_vowel { vowel_neighbors += 1; }
                if is_consonant || is_vowel { unique_live_neighbors += 1; }
            }
        }
        (consonant_neighbors, vowel_neighbors, unique_live_neighbors)
    }

    pub fn width(&self) -> u32 { self.width }
    pub fn height(&self) -> u32 { self.height }
    pub fn get_consonant_grid_ptr(&self) -> *const u16 { self.consonant_grid.as_ptr() }
    pub fn get_vowel_grid_ptr(&self) -> *const u16 { self.vowel_grid.as_ptr() }
    pub fn get_syllable_grid_ptr(&self) -> *const u16 { self.syllable_grid.as_ptr() }
    pub fn get_prev_consonant_grid_ptr(&self) -> *const u16 { self.prev_consonant_grid.as_ptr() }
    pub fn get_prev_vowel_grid_ptr(&self) -> *const u16 { self.prev_vowel_grid.as_ptr() }
    pub fn get_prev_syllable_grid_ptr(&self) -> *const u16 { self.prev_syllable_grid.as_ptr() }

    pub fn toggle_cell(&mut self, row: u32, col: u32, cell_type: JsString) {
        let idx = self.get_index(row, col);
        
        let type_str = cell_type.as_string().unwrap_or_default();
        let is_consonant = match type_str.as_str() {
            "consonant" => true,
            "vowel" => false,
            _ => random() > 0.5,
        };

        if is_consonant {
            self.consonants.toggle(idx);
            if self.consonants[idx] {
                self.consonant_grid[idx] = self.get_random_consonant() as u16;
            } else {
                self.consonant_grid[idx] = 0;
            }
        } else {
            self.vowels.toggle(idx);
            if self.vowels[idx] {
                self.vowel_grid[idx] = self.get_random_vowel() as u16;
            } else {
                self.vowel_grid[idx] = 0;
            }
        }

        if !self.consonants[idx] || !self.vowels[idx] {
            self.syllable_grid[idx] = 0;
        }
    }

    pub fn alive_cell(&mut self, row: u32, col: u32, cell_type: JsString) {
        let idx = self.get_index(row, col);
        
        let type_str = cell_type.as_string().unwrap_or_default();
        let is_consonant = match type_str.as_str() {
            "consonant" => true,
            "vowel" => false,
            _ => random() > 0.5,
        };

        if is_consonant {
            self.consonants.set(idx, true);
            self.consonant_grid[idx] = self.get_random_consonant() as u16;
        } else {
            self.vowels.set(idx, true);
            self.vowel_grid[idx] = self.get_random_vowel() as u16;
        }
    }

    pub fn dead_cell(&mut self, row: u32, col: u32, cell_type: JsString) {
        let idx = self.get_index(row, col);
        
        let type_str = cell_type.as_string().unwrap_or_default();
        match type_str.as_str() {
            "consonant" => {
                self.consonants.set(idx, false);
                self.consonant_grid[idx] = 0;
            },
            "vowel" => {
                self.vowels.set(idx, false);
                self.vowel_grid[idx] = 0;
            },
            _ => {
                // "syllable" 또는 기본값인 경우 둘 다 죽이기
                self.consonants.set(idx, false);
                self.vowels.set(idx, false);
                self.consonant_grid[idx] = 0;
                self.vowel_grid[idx] = 0;
            }
        }

        // 음절이 있었다면 제거
        self.syllable_grid[idx] = 0;
    }
}

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
pub struct World {
    width: u32,
    height: u32,
    consonants: FixedBitSet,
    vowels: FixedBitSet,
    syllables: FixedBitSet,
    prev_consonants: FixedBitSet,
    prev_vowels: FixedBitSet,
    consonant_grid: Vec<u16>,
    vowel_grid: Vec<u16>,
    syllable_grid: Vec<u16>,
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
            width, height,
            consonants: FixedBitSet::with_capacity(size),
            vowels: FixedBitSet::with_capacity(size),
            syllables: FixedBitSet::with_capacity(size),
            prev_consonants: FixedBitSet::with_capacity(size),
            prev_vowels: FixedBitSet::with_capacity(size),
            consonant_grid: vec![0; size],
            vowel_grid: vec![0; size],
            syllable_grid: vec![0; size],
            active_consonants: ALL_INITIAL_CONSONANTS.to_vec(),
            active_vowels: ALL_MEDIAL_VOWELS.to_vec(),
        }
    }
    
    pub fn update_char_sets(&mut self, consonants: Array, vowels: Array) {
        self.active_consonants = consonants.iter().map(|c| c.as_string().unwrap_or_default().chars().next().unwrap_or(' ')).collect();
        self.active_vowels = vowels.iter().map(|c| c.as_string().unwrap_or_default().chars().next().unwrap_or(' ')).collect();
        if self.active_consonants.is_empty() { self.active_consonants = ALL_INITIAL_CONSONANTS.to_vec(); }
        if self.active_vowels.is_empty() { self.active_vowels = ALL_MEDIAL_VOWELS.to_vec(); }
    }
    
    fn get_random_consonant(&self) -> char {
        if self.active_consonants.is_empty() { return ' '; }
        self.active_consonants[(random() * self.active_consonants.len() as f64).floor() as usize]
    }

    fn get_random_vowel(&self) -> char {
        if self.active_vowels.is_empty() { return ' '; }
        self.active_vowels[(random() * self.active_vowels.len() as f64).floor() as usize]
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    pub fn tick(&mut self, silhouette: &[u8]) {
        // 1. Save previous state
        self.prev_consonants = self.consonants.clone();
        self.prev_vowels = self.vowels.clone();

        // 2. Evolve cells based on Game of Life rules
        let mut next_consonants = self.consonants.clone();
        let mut next_vowels = self.vowels.clone();
        let mut next_syllables = self.syllables.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let (consonant_n, vowel_n, total_n) = self.count_neighbors(row, col);
                let is_in_silhouette = silhouette.get(idx).cloned().unwrap_or(0) == 1;

                if self.syllables[idx] { // Rule for existing syllables
                    let survives = if is_in_silhouette { total_n >= 2 } else { total_n == 2 || total_n == 3 };
                    next_syllables.set(idx, survives);
                } else { // Rule for components
                    let survives = if is_in_silhouette { total_n >= 2 } else { total_n == 2 || total_n == 3 };
                    let can_be_born = total_n == 3;
                    let consonant_is_born = can_be_born && !self.consonants[idx] && (consonant_n > 0 || vowel_n == 0);
                    next_consonants.set(idx, (self.consonants[idx] && survives) || consonant_is_born);
                    let vowel_is_born = can_be_born && !self.vowels[idx] && (vowel_n > 0 || consonant_n == 0);
                    next_vowels.set(idx, (self.vowels[idx] && survives) || vowel_is_born);
                }
            }
        }
        
        self.consonants = next_consonants;
        self.vowels = next_vowels;
        self.syllables = next_syllables;

        // 3. Sync character grids
        for idx in 0..self.consonant_grid.len() {
            let is_in_silhouette = silhouette.get(idx).cloned().unwrap_or(0) == 1;
            if !self.syllables[idx] { self.syllable_grid[idx] = 0; }
            else if is_in_silhouette { self.syllable_grid[idx] = combine(self.get_random_consonant(), self.get_random_vowel(), None) as u16; }

            if self.consonants[idx] {
                }
            } else {
                self.consonant_grid[idx] = 0;
            }

            // Sync Vowels
            if self.vowels[idx] {
                    self.vowel_grid[idx] = self.get_random_vowel() as u16;
                if !self.prev_vowels[idx] || is_in_silhouette { self.vowel_grid[idx] = self.get_random_vowel() as u16; }
            } else { self.vowel_grid[idx] = 0; }
        }
        
        // 4. Combine & Attach Jongseong
        let consonant_grid_copy = self.consonant_grid.clone();
        let mut newly_formed_syllables: Vec<(usize, char, char)> = Vec::new();

        for idx in 0..self.consonant_grid.len() {
            if self.consonant_grid[idx] > 0 && self.vowel_grid[idx] > 0 {
                let consonant_char = std::char::from_u32(self.consonant_grid[idx] as u32).unwrap();
                let vowel_char = std::char::from_u32(self.vowel_grid[idx] as u32).unwrap();
                newly_formed_syllables.push((idx, consonant_char, vowel_char));
                
                self.syllable_grid[idx] = combine(consonant_char, vowel_char, None) as u16;
                self.syllables.set(idx, true);
                self.consonants.set(idx, false);
                self.vowels.set(idx, false);
                self.consonant_grid[idx] = 0;
                self.vowel_grid[idx] = 0;
            }
        }
        
        for (idx, initial, medial) in newly_formed_syllables {
            let row = (idx as u32) / self.width;
            let col = (idx as u32) % self.width;
            let final_consonant_row = (row + 1) % self.height;
            let final_idx = self.get_index(final_consonant_row, col);
            
            if consonant_grid_copy[final_idx] > 0 {
                let potential_final = std::char::from_u32(consonant_grid_copy[final_idx] as u32).unwrap();
                if get_final_consonant_code(potential_final).is_some() {
                    self.syllable_grid[idx] = combine(initial, medial, Some(potential_final)) as u16;
                    self.consonant_grid[final_idx] = 0;
                    self.consonants.set(final_idx, false);
                }
            }
        }
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
                let is_syllable = self.syllables[idx];

                if is_consonant { consonant_neighbors += 1; }
                if is_vowel { vowel_neighbors += 1; }
                if is_consonant || is_vowel || is_syllable { unique_live_neighbors += 1; }
            }
        }
        (consonant_neighbors, vowel_neighbors, unique_live_neighbors)
    }

    pub fn alive_cell(&mut self, row: u32, col: u32, cell_type: JsString) {
        let idx = self.get_index(row, col);
        if self.syllables[idx] { return; }
        let type_str = cell_type.as_string().unwrap_or_default();
        match type_str.as_str() {
            "consonant" => {
                if !self.consonants[idx] { self.consonants.set(idx, true); }
            },
            "vowel" => {
                if !self.vowels[idx] { self.vowels.set(idx, true); }
            },
            _ => {
                if !self.consonants[idx] { self.consonants.set(idx, true); }
                if !self.vowels[idx] { self.vowels.set(idx, true); }
            },
        };

    }

    pub fn kill_cell(&mut self, row: u32, col: u32) {
        let idx = self.get_index(row, col);
        self.consonants.set(idx, false);
        self.vowels.set(idx, false);
        self.syllables.set(idx, false);
        self.consonant_grid[idx] = 0;
        self.vowel_grid[idx] = 0;
        self.syllable_grid[idx] = 0;
    }

    pub fn width(&self) -> u32 { self.width }
    pub fn height(&self) -> u32 { self.height }
    pub fn get_consonant_grid_ptr(&self) -> *const u16 { self.consonant_grid.as_ptr() }
    pub fn get_vowel_grid_ptr(&self) -> *const u16 { self.vowel_grid.as_ptr() }
    pub fn get_syllable_grid_ptr(&self) -> *const u16 { self.syllable_grid.as_ptr() }
}

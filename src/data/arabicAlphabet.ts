export interface ArabicLetter {
  letter: string;
  name: string;
  nameAr: string;
  transliteration: string;
  exampleWord: string;
  exampleMeaning: string;
  exampleWordAr: string;
}

export const arabicAlphabet: ArabicLetter[] = [
  { letter: "أ", name: "Alif", nameAr: "ألف", transliteration: "a", exampleWord: "Arnab", exampleMeaning: "Rabbit", exampleWordAr: "أرنب" },
  { letter: "ب", name: "Ba", nameAr: "باء", transliteration: "b", exampleWord: "Bab", exampleMeaning: "Door", exampleWordAr: "باب" },
  { letter: "ت", name: "Ta", nameAr: "تاء", transliteration: "t", exampleWord: "Tuffaha", exampleMeaning: "Apple", exampleWordAr: "تفاحة" },
  { letter: "ث", name: "Tha", nameAr: "ثاء", transliteration: "th", exampleWord: "Tha'lab", exampleMeaning: "Fox", exampleWordAr: "ثعلب" },
  { letter: "ج", name: "Jim", nameAr: "جيم", transliteration: "j", exampleWord: "Jamal", exampleMeaning: "Camel", exampleWordAr: "جمل" },
  { letter: "ح", name: "Ha", nameAr: "حاء", transliteration: "ḥ", exampleWord: "Hut", exampleMeaning: "Whale", exampleWordAr: "حوت" },
  { letter: "خ", name: "Kha", nameAr: "خاء", transliteration: "kh", exampleWord: "Khubz", exampleMeaning: "Bread", exampleWordAr: "خبز" },
  { letter: "د", name: "Dal", nameAr: "دال", transliteration: "d", exampleWord: "Dub", exampleMeaning: "Bear", exampleWordAr: "دب" },
  { letter: "ذ", name: "Dhal", nameAr: "ذال", transliteration: "dh", exampleWord: "Dhahab", exampleMeaning: "Gold", exampleWordAr: "ذهب" },
  { letter: "ر", name: "Ra", nameAr: "راء", transliteration: "r", exampleWord: "Rajul", exampleMeaning: "Man", exampleWordAr: "رجل" },
  { letter: "ز", name: "Zay", nameAr: "زاي", transliteration: "z", exampleWord: "Zahra", exampleMeaning: "Flower", exampleWordAr: "زهرة" },
  { letter: "س", name: "Sin", nameAr: "سين", transliteration: "s", exampleWord: "Samak", exampleMeaning: "Fish", exampleWordAr: "سمك" },
  { letter: "ش", name: "Shin", nameAr: "شين", transliteration: "sh", exampleWord: "Shams", exampleMeaning: "Sun", exampleWordAr: "شمس" },
  { letter: "ص", name: "Sad", nameAr: "صاد", transliteration: "ṣ", exampleWord: "Sabr", exampleMeaning: "Patience", exampleWordAr: "صبر" },
  { letter: "ض", name: "Dad", nameAr: "ضاد", transliteration: "ḍ", exampleWord: "Daw'", exampleMeaning: "Light", exampleWordAr: "ضوء" },
  { letter: "ط", name: "Taa", nameAr: "طاء", transliteration: "ṭ", exampleWord: "Taa'ir", exampleMeaning: "Bird", exampleWordAr: "طائر" },
  { letter: "ظ", name: "Dhaa", nameAr: "ظاء", transliteration: "ẓ", exampleWord: "Dhil", exampleMeaning: "Shadow", exampleWordAr: "ظل" },
  { letter: "ع", name: "Ain", nameAr: "عين", transliteration: "'a", exampleWord: "'Ain", exampleMeaning: "Eye", exampleWordAr: "عين" },
  { letter: "غ", name: "Ghain", nameAr: "غين", transliteration: "gh", exampleWord: "Ghurab", exampleMeaning: "Crow", exampleWordAr: "غراب" },
  { letter: "ف", name: "Fa", nameAr: "فاء", transliteration: "f", exampleWord: "Fil", exampleMeaning: "Elephant", exampleWordAr: "فيل" },
  { letter: "ق", name: "Qaf", nameAr: "قاف", transliteration: "q", exampleWord: "Qamar", exampleMeaning: "Moon", exampleWordAr: "قمر" },
  { letter: "ك", name: "Kaf", nameAr: "كاف", transliteration: "k", exampleWord: "Kitab", exampleMeaning: "Book", exampleWordAr: "كتاب" },
  { letter: "ل", name: "Lam", nameAr: "لام", transliteration: "l", exampleWord: "Layl", exampleMeaning: "Night", exampleWordAr: "ليل" },
  { letter: "م", name: "Mim", nameAr: "ميم", transliteration: "m", exampleWord: "Ma'", exampleMeaning: "Water", exampleWordAr: "ماء" },
  { letter: "ن", name: "Nun", nameAr: "نون", transliteration: "n", exampleWord: "Nahr", exampleMeaning: "River", exampleWordAr: "نهر" },
  { letter: "ه", name: "Ha", nameAr: "هاء", transliteration: "h", exampleWord: "Hilal", exampleMeaning: "Crescent", exampleWordAr: "هلال" },
  { letter: "و", name: "Waw", nameAr: "واو", transliteration: "w", exampleWord: "Warda", exampleMeaning: "Rose", exampleWordAr: "وردة" },
  { letter: "ي", name: "Ya", nameAr: "ياء", transliteration: "y", exampleWord: "Yad", exampleMeaning: "Hand", exampleWordAr: "يد" },
];

// Group letters into sets of 4 for mini quizzes
export const getLetterGroups = () => {
  const groups: ArabicLetter[][] = [];
  for (let i = 0; i < arabicAlphabet.length; i += 4) {
    groups.push(arabicAlphabet.slice(i, i + 4));
  }
  return groups;
};

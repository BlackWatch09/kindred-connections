export interface ArabicNumber {
  value: number;
  arabic: string;       // ١, ٢, ٣...
  word: string;          // واحد, اثنان...
  name: string;          // One, Two...
  transliteration: string; // Wahid, Ithnan...
  imageDescription: string; // for generating quiz context
}

export const arabicNumbers: ArabicNumber[] = [
  { value: 1, arabic: "١", word: "واحد", name: "One", transliteration: "Wāḥid", imageDescription: "1 apple" },
  { value: 2, arabic: "٢", word: "اثنان", name: "Two", transliteration: "Ithnān", imageDescription: "2 stars" },
  { value: 3, arabic: "٣", word: "ثلاثة", name: "Three", transliteration: "Thalātha", imageDescription: "3 books" },
  { value: 4, arabic: "٤", word: "أربعة", name: "Four", transliteration: "Arba'a", imageDescription: "4 flowers" },
  { value: 5, arabic: "٥", word: "خمسة", name: "Five", transliteration: "Khamsa", imageDescription: "5 fingers" },
  { value: 6, arabic: "٦", word: "ستة", name: "Six", transliteration: "Sitta", imageDescription: "6 birds" },
  { value: 7, arabic: "٧", word: "سبعة", name: "Seven", transliteration: "Sab'a", imageDescription: "7 days" },
  { value: 8, arabic: "٨", word: "ثمانية", name: "Eight", transliteration: "Thamāniya", imageDescription: "8 dots" },
  { value: 9, arabic: "٩", word: "تسعة", name: "Nine", transliteration: "Tis'a", imageDescription: "9 cups" },
  { value: 10, arabic: "١٠", word: "عشرة", name: "Ten", transliteration: "'Ashara", imageDescription: "10 circles" },
  { value: 11, arabic: "١١", word: "أحد عشر", name: "Eleven", transliteration: "Aḥada 'Ashar", imageDescription: "11 hearts" },
  { value: 12, arabic: "١٢", word: "اثنا عشر", name: "Twelve", transliteration: "Ithnā 'Ashar", imageDescription: "12 months" },
  { value: 13, arabic: "١٣", word: "ثلاثة عشر", name: "Thirteen", transliteration: "Thalāthata 'Ashar", imageDescription: "13 leaves" },
  { value: 14, arabic: "١٤", word: "أربعة عشر", name: "Fourteen", transliteration: "Arba'ata 'Ashar", imageDescription: "14 stones" },
  { value: 15, arabic: "١٥", word: "خمسة عشر", name: "Fifteen", transliteration: "Khamsata 'Ashar", imageDescription: "15 drops" },
  { value: 16, arabic: "١٦", word: "ستة عشر", name: "Sixteen", transliteration: "Sittata 'Ashar", imageDescription: "16 tiles" },
  { value: 17, arabic: "١٧", word: "سبعة عشر", name: "Seventeen", transliteration: "Sab'ata 'Ashar", imageDescription: "17 beads" },
  { value: 18, arabic: "١٨", word: "ثمانية عشر", name: "Eighteen", transliteration: "Thamāniyata 'Ashar", imageDescription: "18 gems" },
  { value: 19, arabic: "١٩", word: "تسعة عشر", name: "Nineteen", transliteration: "Tis'ata 'Ashar", imageDescription: "19 lanterns" },
  { value: 20, arabic: "٢٠", word: "عشرون", name: "Twenty", transliteration: "'Ishrūn", imageDescription: "20 coins" },
];

export const getNumberGroups = (): ArabicNumber[][] => {
  const groups: ArabicNumber[][] = [];
  for (let i = 0; i < arabicNumbers.length; i += 4) {
    groups.push(arabicNumbers.slice(i, i + 4));
  }
  return groups;
};

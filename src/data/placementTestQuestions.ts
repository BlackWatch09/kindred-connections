export type QuestionType = "mcq" | "trueFalse" | "fillBlank" | "listening" | "matching" | "spelling";

export interface PlacementQuestion {
  id: number;
  type: QuestionType;
  level: "easy" | "intermediate" | "advanced";
  label: string; // e.g. "Multiple Choice", "Listening"
  question: string;
  arabicAudio?: string; // text to speak
  options?: string[];
  correctAnswer: string; // for mcq/trueFalse: the option text; for fill: the answer; for matching: JSON
  matchPairs?: { left: string; right: string }[];
}

export const placementQuestions: PlacementQuestion[] = [
  // ===== EASY (1-10) =====
  {
    id: 1, type: "mcq", level: "easy", label: "Multiple Choice",
    question: "What is the first letter of the Arabic alphabet?",
    options: ["ب (Ba)", "أ (Alif)", "ت (Ta)", "ج (Jim)"],
    correctAnswer: "أ (Alif)",
  },
  {
    id: 2, type: "trueFalse", level: "easy", label: "True / False",
    question: "The Arabic letter 'ب' is pronounced as 'Ta'.",
    options: ["True", "False"],
    correctAnswer: "False",
  },
  {
    id: 3, type: "listening", level: "easy", label: "Listening",
    question: "Listen to the sound and choose the correct letter.",
    arabicAudio: "سين",
    options: ["ش (Shin)", "س (Sin)", "ص (Sad)", "ث (Tha)"],
    correctAnswer: "س (Sin)",
  },
  {
    id: 4, type: "mcq", level: "easy", label: "Multiple Choice",
    question: "What does 'مرحبا' mean?",
    options: ["Goodbye", "Thank you", "Hello", "Sorry"],
    correctAnswer: "Hello",
  },
  {
    id: 5, type: "fillBlank", level: "easy", label: "Fill in the Blank",
    question: "The number 3 in Arabic is written as ___. (Type the Arabic numeral)",
    correctAnswer: "٣",
  },
  {
    id: 6, type: "listening", level: "easy", label: "Listening",
    question: "Listen and identify the greeting.",
    arabicAudio: "السلام عليكم",
    options: ["مع السلامة", "السلام عليكم", "صباح الخير", "شكراً"],
    correctAnswer: "السلام عليكم",
  },
  {
    id: 7, type: "mcq", level: "easy", label: "Multiple Choice",
    question: "How do you say 'Thank you' in Arabic?",
    options: ["عفواً", "من فضلك", "شكراً", "مرحبا"],
    correctAnswer: "شكراً",
  },
  {
    id: 8, type: "trueFalse", level: "easy", label: "True / False",
    question: "The number ٧ represents the number 7.",
    options: ["True", "False"],
    correctAnswer: "True",
  },
  {
    id: 9, type: "mcq", level: "easy", label: "Multiple Choice",
    question: "Which of these means 'Good morning'?",
    options: ["مساء الخير", "صباح الخير", "تصبح على خير", "مع السلامة"],
    correctAnswer: "صباح الخير",
  },
  {
    id: 10, type: "fillBlank", level: "easy", label: "Fill in the Blank",
    question: "Complete: 'ما ___؟' (What is your name?). Type the missing word.",
    correctAnswer: "اسمك",
  },

  // ===== INTERMEDIATE (11-20) =====
  {
    id: 11, type: "mcq", level: "intermediate", label: "Multiple Choice",
    question: "What is the Arabic pronoun for 'She'?",
    options: ["أنا", "هو", "هي", "نحن"],
    correctAnswer: "هي",
  },
  {
    id: 12, type: "matching", level: "intermediate", label: "Matching",
    question: "Match each adjective with its meaning.",
    matchPairs: [
      { left: "كبير", right: "Big" },
      { left: "صغير", right: "Small" },
      { left: "جميل", right: "Beautiful" },
      { left: "سريع", right: "Fast" },
    ],
    correctAnswer: "كبير:Big,صغير:Small,جميل:Beautiful,سريع:Fast",
  },
  {
    id: 13, type: "listening", level: "intermediate", label: "Listening",
    question: "Listen and choose the correct number.",
    arabicAudio: "خمسة وعشرون",
    options: ["15", "25", "35", "50"],
    correctAnswer: "25",
  },
  {
    id: 14, type: "mcq", level: "intermediate", label: "Multiple Choice",
    question: "Which pronoun means 'We' in Arabic?",
    options: ["أنتم", "هم", "نحن", "أنتِ"],
    correctAnswer: "نحن",
  },
  {
    id: 15, type: "fillBlank", level: "intermediate", label: "Fill in the Blank",
    question: "The opposite of 'حار' (hot) is ___.",
    correctAnswer: "بارد",
  },
  {
    id: 16, type: "trueFalse", level: "intermediate", label: "True / False",
    question: "'أنتَ' refers to a female person.",
    options: ["True", "False"],
    correctAnswer: "False",
  },
  {
    id: 17, type: "mcq", level: "intermediate", label: "Multiple Choice",
    question: "What does 'مئة' mean?",
    options: ["Ten", "Fifty", "Hundred", "Thousand"],
    correctAnswer: "Hundred",
  },
  {
    id: 18, type: "listening", level: "intermediate", label: "Listening",
    question: "Listen and identify the adjective.",
    arabicAudio: "جميل",
    options: ["قبيح (Ugly)", "جميل (Beautiful)", "طويل (Tall)", "قصير (Short)"],
    correctAnswer: "جميل (Beautiful)",
  },
  {
    id: 19, type: "fillBlank", level: "intermediate", label: "Fill in the Blank",
    question: "Complete: 'هذا ___ جديد' (This is a new book). Type the missing word.",
    correctAnswer: "كتاب",
  },
  {
    id: 20, type: "mcq", level: "intermediate", label: "Multiple Choice",
    question: "Which word is an adjective?",
    options: ["يأكل (eats)", "كتاب (book)", "طويل (tall)", "مدرسة (school)"],
    correctAnswer: "طويل (tall)",
  },

  // ===== ADVANCED (21-30) =====
  {
    id: 21, type: "mcq", level: "advanced", label: "Multiple Choice",
    question: "What is the past tense of 'يكتب' (he writes)?",
    options: ["كتب", "يكتب", "سيكتب", "اكتب"],
    correctAnswer: "كتب",
  },
  {
    id: 22, type: "spelling", level: "advanced", label: "Spelling Check",
    question: "Is this spelling correct? 'ذهبتُ إلى المدرسة'",
    options: ["Correct", "Incorrect"],
    correctAnswer: "Correct",
  },
  {
    id: 23, type: "fillBlank", level: "advanced", label: "Fill in the Blank",
    question: "Conjugate 'ذهب' (went) for 'أنا': أنا ___ إلى السوق.",
    correctAnswer: "ذهبتُ",
  },
  {
    id: 24, type: "mcq", level: "advanced", label: "Multiple Choice",
    question: "In the sentence 'إنَّ الطالبَ مجتهدٌ', what is the grammatical case of 'الطالبَ'?",
    options: ["Nominative (مرفوع)", "Accusative (منصوب)", "Genitive (مجرور)", "Jussive (مجزوم)"],
    correctAnswer: "Accusative (منصوب)",
  },
  {
    id: 25, type: "spelling", level: "advanced", label: "Spelling Check",
    question: "Is this spelling correct? 'المعلمون يدرسون الطلاب'",
    options: ["Correct", "Incorrect"],
    correctAnswer: "Correct",
  },
  {
    id: 26, type: "listening", level: "advanced", label: "Listening",
    question: "Listen and choose the correct verb conjugation.",
    arabicAudio: "كتبوا",
    options: ["كتبَ (he wrote)", "كتبتُ (I wrote)", "كتبوا (they wrote)", "تكتبُ (you write)"],
    correctAnswer: "كتبوا (they wrote)",
  },
  {
    id: 27, type: "mcq", level: "advanced", label: "Multiple Choice",
    question: "Choose the correct feminine form of 'معلم' (teacher):",
    options: ["معلمة", "معلمات", "معلمون", "معلمين"],
    correctAnswer: "معلمة",
  },
  {
    id: 28, type: "fillBlank", level: "advanced", label: "Fill in the Blank",
    question: "Complete the conditional: 'لو درستَ ___' (If you studied, you would succeed).",
    correctAnswer: "لنجحتَ",
  },
  {
    id: 29, type: "spelling", level: "advanced", label: "Spelling Check",
    question: "Is this spelling correct? 'الأطفال يلعبون في الحديقه'",
    options: ["Correct", "Incorrect"],
    correctAnswer: "Incorrect",
  },
  {
    id: 30, type: "mcq", level: "advanced", label: "Multiple Choice",
    question: "What type of sentence is 'الجوُّ جميلٌ اليوم'?",
    options: ["Verbal sentence (جملة فعلية)", "Nominal sentence (جملة اسمية)", "Conditional sentence", "Exclamatory sentence"],
    correctAnswer: "Nominal sentence (جملة اسمية)",
  },
];

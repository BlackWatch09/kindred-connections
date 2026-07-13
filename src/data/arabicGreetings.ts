export interface ArabicExpression {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningAr: string;
  meaningTr: string;
  exampleAr: string;
  exampleEn: string;
  exampleTr: string;
}

export const arabicExpressions: ArabicExpression[] = [
  { id: 1, arabic: "السلام عليكم", transliteration: "As-salāmu ʿalaykum", meaning: "Peace be upon you", meaningAr: "السلام عليكم", meaningTr: "Selam olsun", exampleAr: "السلام عليكم، كيف حالكم اليوم؟", exampleEn: "Peace be upon you, how are you today?", exampleTr: "Selam olsun, bugün nasılsınız?" },
  { id: 2, arabic: "وعليكم السلام", transliteration: "Wa ʿalaykumu s-salām", meaning: "And upon you peace", meaningAr: "وعليكم السلام", meaningTr: "Ve aleykümselam", exampleAr: "وعليكم السلام ورحمة الله", exampleEn: "And upon you peace and God's mercy", exampleTr: "Selam ve Allah'ın rahmeti üzerinize olsun" },
  { id: 3, arabic: "أهلاً وسهلاً", transliteration: "Ahlan wa sahlan", meaning: "Welcome", meaningAr: "مرحباً بك", meaningTr: "Hoş geldiniz", exampleAr: "أهلاً وسهلاً في بيتنا", exampleEn: "Welcome to our home", exampleTr: "Evimize hoş geldiniz" },
  { id: 4, arabic: "مرحباً", transliteration: "Marḥaban", meaning: "Hello", meaningAr: "تحية ترحيبية", meaningTr: "Merhaba", exampleAr: "مرحباً يا صديقي!", exampleEn: "Hello my friend!", exampleTr: "Merhaba arkadaşım!" },
  { id: 5, arabic: "صباح الخير", transliteration: "Ṣabāḥ al-khayr", meaning: "Good morning", meaningAr: "تحية صباحية", meaningTr: "Günaydın", exampleAr: "صباح الخير، هل نمت جيداً؟", exampleEn: "Good morning, did you sleep well?", exampleTr: "Günaydın, iyi uyudun mu?" },
  { id: 6, arabic: "مساء الخير", transliteration: "Masāʾ al-khayr", meaning: "Good evening", meaningAr: "تحية مسائية", meaningTr: "İyi akşamlar", exampleAr: "مساء الخير يا جاري العزيز", exampleEn: "Good evening, my dear neighbor", exampleTr: "İyi akşamlar, sevgili komşum" },
  { id: 7, arabic: "كيف حالك؟", transliteration: "Kayfa ḥāluka?", meaning: "How are you?", meaningAr: "سؤال عن الحال", meaningTr: "Nasılsın?", exampleAr: "كيف حالك اليوم يا أخي؟", exampleEn: "How are you today, my brother?", exampleTr: "Bugün nasılsın kardeşim?" },
  { id: 8, arabic: "الحمد لله", transliteration: "Al-ḥamdu lillāh", meaning: "Praise be to God / I'm fine", meaningAr: "شكر لله", meaningTr: "Allah'a şükür", exampleAr: "كيف حالك؟ الحمد لله بخير", exampleEn: "How are you? I'm fine, praise be to God", exampleTr: "Nasılsın? Allah'a şükür iyiyim" },
  { id: 9, arabic: "شكراً", transliteration: "Shukran", meaning: "Thank you", meaningAr: "تعبير عن الشكر", meaningTr: "Teşekkürler", exampleAr: "شكراً جزيلاً على مساعدتك", exampleEn: "Thank you very much for your help", exampleTr: "Yardımın için çok teşekkürler" },
  { id: 10, arabic: "عفواً", transliteration: "ʿAfwan", meaning: "You're welcome / Excuse me", meaningAr: "رد على الشكر", meaningTr: "Rica ederim / Affedersiniz", exampleAr: "عفواً، هل يمكنك مساعدتي؟", exampleEn: "Excuse me, can you help me?", exampleTr: "Affedersiniz, bana yardımcı olabilir misiniz?" },
  { id: 11, arabic: "من فضلك", transliteration: "Min faḍlika", meaning: "Please", meaningAr: "طلب مهذب", meaningTr: "Lütfen", exampleAr: "من فضلك، أعطني كوب ماء", exampleEn: "Please give me a glass of water", exampleTr: "Lütfen bana bir bardak su ver" },
  { id: 12, arabic: "مع السلامة", transliteration: "Maʿa s-salāma", meaning: "Goodbye", meaningAr: "وداع", meaningTr: "Güle güle", exampleAr: "مع السلامة، أراك غداً", exampleEn: "Goodbye, see you tomorrow", exampleTr: "Güle güle, yarın görüşürüz" },
  { id: 13, arabic: "إن شاء الله", transliteration: "In shāʾ Allāh", meaning: "God willing", meaningAr: "بمشيئة الله", meaningTr: "İnşallah", exampleAr: "سأزورك غداً إن شاء الله", exampleEn: "I will visit you tomorrow, God willing", exampleTr: "İnşallah yarın seni ziyaret edeceğim" },
  { id: 14, arabic: "ما شاء الله", transliteration: "Mā shāʾ Allāh", meaning: "God has willed it (admiration)", meaningAr: "تعبير عن الإعجاب", meaningTr: "Maşallah", exampleAr: "ما شاء الله، ابنك ذكي جداً", exampleEn: "Mashallah, your son is very smart", exampleTr: "Maşallah, oğlun çok akıllı" },
  { id: 15, arabic: "بسم الله", transliteration: "Bismillāh", meaning: "In the name of God", meaningAr: "قبل البدء بعمل", meaningTr: "Bismillah", exampleAr: "بسم الله، نبدأ الدرس", exampleEn: "In the name of God, let's begin the lesson", exampleTr: "Bismillah, derse başlayalım" },
  { id: 16, arabic: "جزاك الله خيراً", transliteration: "Jazāka Allāhu khayran", meaning: "May God reward you", meaningAr: "دعاء بالخير", meaningTr: "Allah seni hayırla mükafatlandırsın", exampleAr: "جزاك الله خيراً على كرمك", exampleEn: "May God reward you for your generosity", exampleTr: "Cömertliğin için Allah seni mükafatlandırsın" },
  { id: 17, arabic: "تشرفنا", transliteration: "Tasharrafnā", meaning: "Pleased to meet you", meaningAr: "سعدنا بالتعرف", meaningTr: "Tanıştığımıza memnun oldum", exampleAr: "تشرفنا بمعرفتك يا أستاذ", exampleEn: "Pleased to meet you, professor", exampleTr: "Tanıştığımıza memnun oldum, hocam" },
  { id: 18, arabic: "لا بأس", transliteration: "Lā baʾs", meaning: "No problem / It's okay", meaningAr: "لا مشكلة", meaningTr: "Sorun yok", exampleAr: "لا بأس، يمكننا المحاولة مرة أخرى", exampleEn: "No problem, we can try again", exampleTr: "Sorun yok, tekrar deneyebiliriz" },
  { id: 19, arabic: "أسف", transliteration: "Āsif", meaning: "Sorry", meaningAr: "اعتذار", meaningTr: "Özür dilerim", exampleAr: "أنا آسف على التأخير", exampleEn: "I'm sorry for being late", exampleTr: "Gecikmek için özür dilerim" },
  { id: 20, arabic: "نعم", transliteration: "Naʿam", meaning: "Yes", meaningAr: "موافقة", meaningTr: "Evet", exampleAr: "نعم، أنا موافق على ذلك", exampleEn: "Yes, I agree with that", exampleTr: "Evet, buna katılıyorum" },
  { id: 21, arabic: "لا", transliteration: "Lā", meaning: "No", meaningAr: "رفض", meaningTr: "Hayır", exampleAr: "لا، شكراً، لا أريد المزيد", exampleEn: "No, thank you, I don't want more", exampleTr: "Hayır, teşekkürler, daha fazla istemiyorum" },
  { id: 22, arabic: "تصبح على خير", transliteration: "Tuṣbiḥ ʿalā khayr", meaning: "Good night", meaningAr: "تحية قبل النوم", meaningTr: "İyi geceler", exampleAr: "تصبح على خير، نراك صباحاً", exampleEn: "Good night, see you in the morning", exampleTr: "İyi geceler, sabah görüşürüz" },
  { id: 23, arabic: "بارك الله فيك", transliteration: "Bāraka Allāhu fīk", meaning: "May God bless you", meaningAr: "دعاء بالبركة", meaningTr: "Allah seni mübarek kılsın", exampleAr: "بارك الله فيك على هذا العمل", exampleEn: "May God bless you for this work", exampleTr: "Bu iş için Allah seni mübarek kılsın" },
  { id: 24, arabic: "يا الله", transliteration: "Yā Allāh", meaning: "Oh God (surprise/amazement)", meaningAr: "تعبير عن الدهشة", meaningTr: "Ya Allah", exampleAr: "يا الله، ما أجمل هذا المنظر!", exampleEn: "Oh God, how beautiful this view is!", exampleTr: "Ya Allah, bu manzara ne kadar güzel!" },
  { id: 25, arabic: "الله أكبر", transliteration: "Allāhu Akbar", meaning: "God is the Greatest", meaningAr: "تعظيم الله", meaningTr: "Allahu Ekber", exampleAr: "الله أكبر، هذا إنجاز عظيم", exampleEn: "God is the Greatest, this is a great achievement", exampleTr: "Allahu Ekber, bu büyük bir başarı" },
];

export const getExpressionGroups = (size = 4): ArabicExpression[][] => {
  const groups: ArabicExpression[][] = [];
  for (let i = 0; i < arabicExpressions.length; i += size) {
    groups.push(arabicExpressions.slice(i, i + size));
  }
  return groups;
};

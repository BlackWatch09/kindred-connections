import type { BlogPost } from "./blogPosts";

import blogPrepositionsImg from "@/assets/blog-prepositions.jpg";
import blogColorsImg from "@/assets/blog-colors.jpg";
import blogNumbersImg from "@/assets/blog-numbers.jpg";
import blogTravelImg from "@/assets/blog-travel.jpg";
import blogFamilyImg from "@/assets/blog-family.jpg";
import blogWeatherImg from "@/assets/blog-weather.jpg";
import blogRamadanImg from "@/assets/blog-ramadan.jpg";
import blogAnimalsImg from "@/assets/blog-animals.jpg";
import blogShoppingImg from "@/assets/blog-shopping.jpg";
import blogProverbsImg from "@/assets/blog-proverbs.jpg";

export const blogPostsBatch3: BlogPost[] = [
  // 11. Arabic Classroom Vocabulary
  {
    slug: "arabic-classroom-vocabulary",
    title: { en: "Arabic Classroom Vocabulary: Words Every Student Needs", tr: "Arapça Sınıf Kelimeleri: Her Öğrencinin İhtiyacı Olan Kelimeler" },
    excerpt: { en: "Learn essential Arabic words for the classroom — teacher, student, book, and more.", tr: "Sınıf için temel Arapça kelimeleri öğrenin — öğretmen, öğrenci, kitap ve daha fazlası." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Ahmed Nasser",
    date: "2026-01-15",
    image: blogPrepositionsImg,
    sections: [
      { id: "intro", heading: { en: "In the Classroom", tr: "Sınıfta" }, content: { en: "Whether you're studying Arabic in a formal class or learning on your own, classroom vocabulary is essential. These words will help you follow lessons, ask questions, and communicate with teachers and fellow students.", tr: "İster resmi bir sınıfta Arapça öğreniyor olun, ister kendi başınıza öğrenin, sınıf kelimeleri çok önemlidir." } },
      { id: "people", heading: { en: "People in the Classroom", tr: "Sınıftaki Kişiler" }, content: { en: "Let's learn the words for the people you'll interact with in an Arabic classroom.", tr: "Arapça sınıfında etkileşimde bulunacağınız kişiler için kelimeleri öğrenelim." }, examples: [
        { arabic: "مُعَلِّم", transliteration: "Mu'allim", english: "Teacher (m)", turkish: "Öğretmen (e)" },
        { arabic: "مُعَلِّمة", transliteration: "Mu'allima", english: "Teacher (f)", turkish: "Öğretmen (k)" },
        { arabic: "طالِب", transliteration: "Talib", english: "Student (m)", turkish: "Öğrenci (e)" },
        { arabic: "طالِبة", transliteration: "Taliba", english: "Student (f)", turkish: "Öğrenci (k)" },
      ] },
      { id: "objects", heading: { en: "Classroom Objects", tr: "Sınıf Nesneleri" }, content: { en: "These are the objects you'll find in any classroom. Practice recognizing them in Arabic.", tr: "Herhangi bir sınıfta bulacağınız nesneler. Bunları Arapça olarak tanıma pratiği yapın." }, examples: [
        { arabic: "كِتاب", transliteration: "Kitab", english: "Book", turkish: "Kitap" },
        { arabic: "قَلَم", transliteration: "Qalam", english: "Pen", turkish: "Kalem" },
        { arabic: "دَفتَر", transliteration: "Daftar", english: "Notebook", turkish: "Defter" },
        { arabic: "سَبّورة", transliteration: "Sabbura", english: "Blackboard", turkish: "Kara tahta" },
      ] },
      { id: "phrases-class", heading: { en: "Useful Classroom Phrases", tr: "Faydalı Sınıf İfadeleri" }, content: { en: "These phrases will help you participate actively in Arabic classes.", tr: "Bu ifadeler Arapça derslerinde aktif olarak katılmanıza yardımcı olacaktır." }, examples: [
        { arabic: "لا أفهم", transliteration: "La afham", english: "I don't understand", turkish: "Anlamıyorum" },
        { arabic: "أعد من فضلك", transliteration: "A'id min fadlak", english: "Repeat, please", turkish: "Tekrar edin lütfen" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'كِتاب' mean?", tr: "'كِتاب' ne anlama gelir?" }, options: ["Pen", "Notebook", "Book", "Blackboard"], correctIndex: 2 },
      { type: "fill", question: { en: "The Arabic word for 'pen' is ___", tr: "'Kalem'in Arapçası ___" }, answer: "قَلَم" },
      { type: "mcq", question: { en: "What does 'لا أفهم' mean?", tr: "'لا أفهم' ne anlama gelir?" }, options: ["I understand", "I don't understand", "Repeat please", "Thank you"], correctIndex: 1 },
    ],
  },

  // 12. Telling Time in Arabic
  {
    slug: "telling-time-in-arabic",
    title: { en: "Telling Time in Arabic: Hours, Minutes & Expressions", tr: "Arapça'da Saat Söyleme: Saatler, Dakikalar ve İfadeler" },
    excerpt: { en: "Master how to ask and tell time in Arabic with practical examples and audio pronunciation.", tr: "Pratik örnekler ve ses telaffuzuyla Arapça'da saat sormayı ve söylemeyi öğrenin." },
    category: { en: "Everyday Arabic", tr: "Günlük Arapça" },
    author: "Youssef Al-Masri",
    date: "2026-01-12",
    image: blogNumbersImg,
    sections: [
      { id: "intro", heading: { en: "Why Telling Time Matters", tr: "Saat Söylemenin Önemi" }, content: { en: "Being able to tell time is essential for scheduling meetings, catching flights, and navigating daily life in Arabic-speaking countries. Arabic uses a slightly different structure than English when expressing time.", tr: "Saat söyleyebilmek, Arapça konuşulan ülkelerde toplantı planlamak, uçak yakalamak ve günlük hayatı yönlendirmek için çok önemlidir." } },
      { id: "asking", heading: { en: "Asking for the Time", tr: "Saati Sormak" }, content: { en: "Here are the most common ways to ask 'What time is it?' in Arabic.", tr: "Arapça'da 'Saat kaç?' sormanın en yaygın yolları." }, examples: [
        { arabic: "كَم الساعة؟", transliteration: "Kam as-sa'a?", english: "What time is it?", turkish: "Saat kaç?" },
        { arabic: "الساعة الثالثة", transliteration: "As-sa'a ath-thalitha", english: "It's three o'clock", turkish: "Saat üç" },
      ] },
      { id: "half-quarter", heading: { en: "Half & Quarter Hours", tr: "Yarım ve Çeyrek Saat" }, content: { en: "Arabic has elegant expressions for half past and quarter past/to the hour.", tr: "Arapça'da buçuk ve çeyrek geçe/kala için zarif ifadeler vardır." }, examples: [
        { arabic: "الساعة الثالثة والنصف", transliteration: "As-sa'a ath-thalitha wan-nisf", english: "It's half past three", turkish: "Saat üç buçuk" },
        { arabic: "الساعة الرابعة والربع", transliteration: "As-sa'a ar-rabi'a war-rub'", english: "It's quarter past four", turkish: "Saat dördü çeyrek geçe" },
      ] },
      { id: "periods", heading: { en: "Time Periods", tr: "Zaman Dilimleri" }, content: { en: "Learn how to specify morning, afternoon, and evening in Arabic.", tr: "Arapça'da sabah, öğleden sonra ve akşamı belirtmeyi öğrenin." }, examples: [
        { arabic: "صَباحاً", transliteration: "Sabahan", english: "In the morning (AM)", turkish: "Sabah" },
        { arabic: "مَساءً", transliteration: "Masa'an", english: "In the evening (PM)", turkish: "Akşam" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "How do you ask 'What time is it?' in Arabic?", tr: "Arapça'da 'Saat kaç?' nasıl sorulur?" }, options: ["أين الساعة؟", "كَم الساعة؟", "ما الساعة؟", "هل الساعة؟"], correctIndex: 1 },
      { type: "fill", question: { en: "الساعة الثالثة و___ (half past three)", tr: "الساعة الثالثة و___ (üç buçuk)" }, answer: "النصف" },
      { type: "mcq", question: { en: "What does 'صَباحاً' mean?", tr: "'صَباحاً' ne anlama gelir?" }, options: ["Evening", "Afternoon", "Morning", "Night"], correctIndex: 2 },
    ],
  },

  // 13. Arabic Months and Seasons
  {
    slug: "arabic-months-and-seasons",
    title: { en: "Months and Seasons in Arabic: A Complete Guide", tr: "Arapça Aylar ve Mevsimler: Tam Rehber" },
    excerpt: { en: "Learn the Arabic names for all 12 months and 4 seasons with pronunciation tips.", tr: "Tüm 12 ay ve 4 mevsimin Arapça isimlerini telaffuz ipuçlarıyla öğrenin." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Fatima Khalil",
    date: "2026-01-10",
    image: blogWeatherImg,
    sections: [
      { id: "intro", heading: { en: "Calendar Systems in Arabic", tr: "Arapça Takvim Sistemleri" }, content: { en: "Arabic-speaking countries use different names for the Gregorian months depending on the region. The Levantine region uses unique Arabic names, while the Gulf and North Africa often use transliterated versions. Let's explore the most common system.", tr: "Arapça konuşulan ülkeler, bölgeye bağlı olarak miladi aylar için farklı isimler kullanır." } },
      { id: "months-1", heading: { en: "January to June", tr: "Ocak'tan Haziran'a" }, content: { en: "Here are the first six months of the year in Arabic (Levantine names).", tr: "İşte yılın ilk altı ayı Arapça (Levant isimleri)." }, examples: [
        { arabic: "يناير / كانون الثاني", transliteration: "Yanayir / Kanun ath-thani", english: "January", turkish: "Ocak" },
        { arabic: "فبراير / شباط", transliteration: "Fibrayir / Shubat", english: "February", turkish: "Şubat" },
        { arabic: "يونيو / حزيران", transliteration: "Yunyu / Haziran", english: "June", turkish: "Haziran" },
      ] },
      { id: "seasons", heading: { en: "The Four Seasons", tr: "Dört Mevsim" }, content: { en: "Arabic has beautiful words for each season. Understanding seasons helps with weather conversations and cultural references.", tr: "Arapça her mevsim için güzel kelimelere sahiptir." }, examples: [
        { arabic: "الربيع", transliteration: "Ar-Rabi'", english: "Spring", turkish: "İlkbahar" },
        { arabic: "الصيف", transliteration: "As-Sayf", english: "Summer", turkish: "Yaz" },
        { arabic: "الخريف", transliteration: "Al-Kharif", english: "Autumn", turkish: "Sonbahar" },
        { arabic: "الشتاء", transliteration: "Ash-Shita'", english: "Winter", turkish: "Kış" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What is 'الربيع' in English?", tr: "'الربيع' İngilizce'de nedir?" }, options: ["Summer", "Winter", "Spring", "Autumn"], correctIndex: 2 },
      { type: "fill", question: { en: "The Arabic word for 'summer' is ___", tr: "'Yaz'ın Arapçası ___" }, answer: "الصيف" },
      { type: "mcq", question: { en: "Which word means 'winter'?", tr: "Hangi kelime 'kış' anlamına gelir?" }, options: ["الربيع", "الصيف", "الخريف", "الشتاء"], correctIndex: 3 },
    ],
  },

  // 14. Shopping Phrases in Arabic
  {
    slug: "shopping-phrases-in-arabic",
    title: { en: "Shopping in Arabic: Essential Phrases for the Souq", tr: "Arapça Alışveriş: Çarşı İçin Temel İfadeler" },
    excerpt: { en: "Navigate Arab markets and shops confidently with these essential shopping phrases.", tr: "Bu temel alışveriş ifadeleriyle Arap pazarlarında ve dükkanlarında güvenle gezin." },
    category: { en: "Everyday Arabic", tr: "Günlük Arapça" },
    author: "Layla Hassan",
    date: "2026-01-08",
    image: blogShoppingImg,
    sections: [
      { id: "intro", heading: { en: "Shopping in the Arab World", tr: "Arap Dünyasında Alışveriş" }, content: { en: "Shopping in Arab souqs (markets) is an experience like no other. The vibrant colors, aromatic spices, and lively haggling make it unforgettable. Knowing key shopping phrases in Arabic will help you get better deals and connect with vendors.", tr: "Arap çarşılarında alışveriş eşsiz bir deneyimdir. Canlı renkler, aromatik baharatlar ve hareketli pazarlık onu unutulmaz kılar." } },
      { id: "asking-price", heading: { en: "Asking About Prices", tr: "Fiyat Sormak" }, content: { en: "The most important phrase in any market — how much does it cost?", tr: "Herhangi bir pazarda en önemli ifade — ne kadar?" }, examples: [
        { arabic: "بكَم هذا؟", transliteration: "Bikam hadha?", english: "How much is this?", turkish: "Bu ne kadar?" },
        { arabic: "غالي جداً", transliteration: "Ghali jiddan", english: "Very expensive", turkish: "Çok pahalı" },
        { arabic: "هل يوجد تخفيض؟", transliteration: "Hal yujad takhfid?", english: "Is there a discount?", turkish: "İndirim var mı?" },
      ] },
      { id: "haggling", heading: { en: "Haggling Phrases", tr: "Pazarlık İfadeleri" }, content: { en: "Haggling is an art form in Arab markets. These phrases will help you negotiate like a local.", tr: "Pazarlık, Arap pazarlarında bir sanat formudur. Bu ifadeler yerel biri gibi pazarlık yapmanıza yardımcı olacaktır." }, examples: [
        { arabic: "آخر سعر؟", transliteration: "Akhir si'r?", english: "Final price?", turkish: "Son fiyat?" },
        { arabic: "ممكن أرخص؟", transliteration: "Mumkin arkhas?", english: "Can it be cheaper?", turkish: "Daha ucuz olabilir mi?" },
      ] },
      { id: "buying", heading: { en: "Making a Purchase", tr: "Satın Alma" }, content: { en: "Once you've agreed on a price, use these phrases to complete your purchase.", tr: "Fiyat üzerinde anlaştıktan sonra satın alma işleminizi tamamlamak için bu ifadeleri kullanın." }, examples: [
        { arabic: "سآخذ هذا", transliteration: "Sa'akhudh hadha", english: "I'll take this", turkish: "Bunu alacağım" },
        { arabic: "هل تقبل البطاقة؟", transliteration: "Hal taqbal al-bitaqa?", english: "Do you accept card?", turkish: "Kart kabul ediyor musunuz?" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "How do you ask 'How much is this?' in Arabic?", tr: "Arapça'da 'Bu ne kadar?' nasıl sorulur?" }, options: ["ما هذا؟", "بكَم هذا؟", "أين هذا؟", "هل هذا؟"], correctIndex: 1 },
      { type: "fill", question: { en: "___ جداً (Very expensive)", tr: "___ جداً (Çok pahalı)" }, answer: "غالي" },
      { type: "mcq", question: { en: "What does 'آخر سعر' mean?", tr: "'آخر سعر' ne anlama gelir?" }, options: ["Best quality", "Final price", "New product", "Old stock"], correctIndex: 1 },
    ],
  },

  // 15. Common Arabic Verbs
  {
    slug: "common-arabic-verbs",
    title: { en: "20 Most Common Arabic Verbs You Must Know", tr: "Bilmeniz Gereken En Yaygın 20 Arapça Fiil" },
    excerpt: { en: "Master the most frequently used Arabic verbs with conjugation tips and real examples.", tr: "En sık kullanılan Arapça fiilleri çekim ipuçları ve gerçek örneklerle öğrenin." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Youssef Al-Masri",
    date: "2026-01-05",
    image: blogShoppingImg,
    sections: [
      { id: "intro", heading: { en: "The Power of Verbs", tr: "Fiillerin Gücü" }, content: { en: "Verbs are the engine of any sentence. In Arabic, verbs follow a root system (usually three consonants) that creates families of related words. Learning common verbs opens up your ability to form sentences and express actions.", tr: "Fiiller herhangi bir cümlenin motorudur. Arapça'da fiiller, ilişkili kelime aileleri oluşturan bir kök sistemi (genellikle üç ünsüz) izler." } },
      { id: "basic-verbs", heading: { en: "Basic Action Verbs", tr: "Temel Eylem Fiilleri" }, content: { en: "These are the most essential verbs for daily communication. Master these and you can express most basic actions.", tr: "Bunlar günlük iletişim için en temel fiillerdir." }, examples: [
        { arabic: "كَتَبَ", transliteration: "Kataba", english: "He wrote", turkish: "Yazdı" },
        { arabic: "قَرَأَ", transliteration: "Qara'a", english: "He read", turkish: "Okudu" },
        { arabic: "ذَهَبَ", transliteration: "Dhahaba", english: "He went", turkish: "Gitti" },
        { arabic: "أَكَلَ", transliteration: "Akala", english: "He ate", turkish: "Yedi" },
      ] },
      { id: "movement", heading: { en: "Movement & Communication", tr: "Hareket ve İletişim" }, content: { en: "Verbs of movement and communication are used constantly in everyday Arabic.", tr: "Hareket ve iletişim fiilleri günlük Arapça'da sürekli kullanılır." }, examples: [
        { arabic: "جَلَسَ", transliteration: "Jalasa", english: "He sat", turkish: "Oturdu" },
        { arabic: "تَكَلَّمَ", transliteration: "Takallama", english: "He spoke", turkish: "Konuştu" },
        { arabic: "سَمِعَ", transliteration: "Sami'a", english: "He heard", turkish: "Duydu" },
        { arabic: "رَأَى", transliteration: "Ra'a", english: "He saw", turkish: "Gördü" },
      ] },
      { id: "daily", heading: { en: "Daily Life Verbs", tr: "Günlük Hayat Fiilleri" }, content: { en: "Complete your verb vocabulary with these words you'll use every day.", tr: "Her gün kullanacağınız bu kelimelerle fiil kelime dağarcığınızı tamamlayın." }, examples: [
        { arabic: "نَامَ", transliteration: "Nama", english: "He slept", turkish: "Uyudu" },
        { arabic: "شَرِبَ", transliteration: "Shariba", english: "He drank", turkish: "İçti" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'كَتَبَ' mean?", tr: "'كَتَبَ' ne anlama gelir?" }, options: ["He read", "He wrote", "He went", "He ate"], correctIndex: 1 },
      { type: "fill", question: { en: "The Arabic verb meaning 'he saw' is ___", tr: "'Gördü' anlamına gelen Arapça fiil ___" }, answer: "رَأَى" },
      { type: "mcq", question: { en: "Which verb means 'he spoke'?", tr: "Hangi fiil 'konuştu' anlamına gelir?" }, options: ["سَمِعَ", "تَكَلَّمَ", "جَلَسَ", "نَامَ"], correctIndex: 1 },
    ],
  },

  // 16. Arabic Directions and Places
  {
    slug: "arabic-directions-and-places",
    title: { en: "Arabic Directions and Places: Navigate Like a Local", tr: "Arapça Yönler ve Yerler: Yerel Biri Gibi Gezin" },
    excerpt: { en: "Learn how to ask for directions and name common places in Arabic.", tr: "Arapça'da yol sormayı ve yaygın yerlerin isimlerini öğrenin." },
    category: { en: "Everyday Arabic", tr: "Günlük Arapça" },
    author: "Ahmed Nasser",
    date: "2026-01-03",
    image: blogTravelImg,
    sections: [
      { id: "intro", heading: { en: "Finding Your Way", tr: "Yolunuzu Bulmak" }, content: { en: "Getting lost can be part of the adventure, but knowing how to ask for directions in Arabic will make your travels much smoother. Let's learn the essential direction words and place names.", tr: "Kaybolmak maceranın bir parçası olabilir, ama Arapça'da yol sormayı bilmek seyahatlerinizi çok daha sorunsuz hale getirecektir." } },
      { id: "directions", heading: { en: "Basic Directions", tr: "Temel Yönler" }, content: { en: "Master these four cardinal directions plus essential relative directions.", tr: "Dört ana yönü ve temel göreceli yönleri öğrenin." }, examples: [
        { arabic: "يَمين", transliteration: "Yameen", english: "Right", turkish: "Sağ" },
        { arabic: "يَسار", transliteration: "Yasar", english: "Left", turkish: "Sol" },
        { arabic: "أمام", transliteration: "Amam", english: "In front of", turkish: "Önünde" },
        { arabic: "وَراء", transliteration: "Wara'", english: "Behind", turkish: "Arkasında" },
      ] },
      { id: "places", heading: { en: "Common Places", tr: "Yaygın Yerler" }, content: { en: "Learn the names of places you'll frequently need to find or visit.", tr: "Sıkça bulmanız veya ziyaret etmeniz gereken yerlerin isimlerini öğrenin." }, examples: [
        { arabic: "مَسجِد", transliteration: "Masjid", english: "Mosque", turkish: "Cami" },
        { arabic: "مُستَشفى", transliteration: "Mustashfa", english: "Hospital", turkish: "Hastane" },
        { arabic: "مَطعَم", transliteration: "Mat'am", english: "Restaurant", turkish: "Restoran" },
        { arabic: "صَيدَلِيّة", transliteration: "Saydaliyya", english: "Pharmacy", turkish: "Eczane" },
      ] },
      { id: "asking-dir", heading: { en: "Asking for Directions", tr: "Yol Sorma" }, content: { en: "Use these phrases when you need to find your way around.", tr: "Yolunuzu bulmak istediğinizde bu ifadeleri kullanın." }, examples: [
        { arabic: "أين المطعم؟", transliteration: "Ayna al-mat'am?", english: "Where is the restaurant?", turkish: "Restoran nerede?" },
        { arabic: "كيف أذهب إلى المستشفى؟", transliteration: "Kayf adhhab ila al-mustashfa?", english: "How do I get to the hospital?", turkish: "Hastaneye nasıl gidebilirim?" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'يَمين' mean?", tr: "'يَمين' ne anlama gelir?" }, options: ["Left", "Right", "Straight", "Behind"], correctIndex: 1 },
      { type: "fill", question: { en: "أين ___؟ (Where is the restaurant?)", tr: "أين ___؟ (Restoran nerede?)" }, answer: "المطعم" },
      { type: "mcq", question: { en: "Which word means 'hospital'?", tr: "Hangi kelime 'hastane' anlamına gelir?" }, options: ["مَسجِد", "مَطعَم", "مُستَشفى", "صَيدَلِيّة"], correctIndex: 2 },
    ],
  },

  // 17. Arabic Love Expressions
  {
    slug: "arabic-love-expressions",
    title: { en: "Beautiful Arabic Love Expressions and Their Meanings", tr: "Güzel Arapça Aşk İfadeleri ve Anlamları" },
    excerpt: { en: "Discover the most romantic and poetic Arabic expressions of love and affection.", tr: "En romantik ve şiirsel Arapça aşk ve sevgi ifadelerini keşfedin." },
    category: { en: "Arabic Culture", tr: "Arap Kültürü" },
    author: "Layla Hassan",
    date: "2025-12-30",
    image: blogFamilyImg,
    sections: [
      { id: "intro", heading: { en: "Love in Arabic Poetry", tr: "Arap Şiirinde Aşk" }, content: { en: "Arabic is often called the language of love and poetry. With its rich vocabulary, Arabic has dozens of words for different types and stages of love — far more than most languages. From ancient poetry to modern songs, love expressions are woven into the fabric of Arabic culture.", tr: "Arapça genellikle aşk ve şiir dili olarak adlandırılır. Zengin kelime dağarcığıyla, Arapça'da farklı aşk türleri ve aşamaları için düzinelerce kelime vardır." } },
      { id: "endearment", heading: { en: "Terms of Endearment", tr: "Sevgi İfadeleri" }, content: { en: "These are sweet words used between loved ones in everyday Arabic.", tr: "Bunlar günlük Arapça'da sevdikleriniz arasında kullanılan tatlı kelimelerdir." }, examples: [
        { arabic: "حَبيبي", transliteration: "Habibi", english: "My love (m)", turkish: "Sevgilim (e)" },
        { arabic: "حَبيبتي", transliteration: "Habibti", english: "My love (f)", turkish: "Sevgilim (k)" },
        { arabic: "يا عُمري", transliteration: "Ya 'umri", english: "My life", turkish: "Hayatım" },
        { arabic: "يا قَلبي", transliteration: "Ya qalbi", english: "My heart", turkish: "Kalbim" },
      ] },
      { id: "phrases-love", heading: { en: "Love Phrases", tr: "Aşk İfadeleri" }, content: { en: "Express your feelings with these beautiful Arabic love phrases.", tr: "Duygularınızı bu güzel Arapça aşk ifadeleriyle ifade edin." }, examples: [
        { arabic: "أُحِبُّك", transliteration: "Uhibbuk", english: "I love you", turkish: "Seni seviyorum" },
        { arabic: "أنت نور عيني", transliteration: "Anta nur 'ayni", english: "You are the light of my eyes", turkish: "Sen gözlerimin nurusun" },
      ] },
      { id: "poetic", heading: { en: "Poetic Expressions", tr: "Şiirsel İfadeler" }, content: { en: "Arabic poetry has given the world some of the most beautiful love expressions ever written.", tr: "Arap şiiri dünyaya yazılmış en güzel aşk ifadelerinden bazılarını vermiştir." }, examples: [
        { arabic: "أنتِ القمر في ليلي", transliteration: "Anti al-qamar fi layli", english: "You are the moon in my night", turkish: "Sen gecemdeki aysın" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'حَبيبي' mean?", tr: "'حَبيبي' ne anlama gelir?" }, options: ["My friend", "My heart", "My love", "My life"], correctIndex: 2 },
      { type: "fill", question: { en: "___ (I love you)", tr: "___ (Seni seviyorum)" }, answer: "أُحِبُّك" },
      { type: "mcq", question: { en: "What does 'يا عُمري' literally mean?", tr: "'يا عُمري' kelime anlamı nedir?" }, options: ["My heart", "My soul", "My life", "My eyes"], correctIndex: 2 },
    ],
  },

  // 18. Arabic Proverbs and Wisdom
  {
    slug: "arabic-proverbs-and-wisdom",
    title: { en: "Famous Arabic Proverbs and Their Wisdom", tr: "Ünlü Arapça Atasözleri ve Bilgelikleri" },
    excerpt: { en: "Explore timeless Arabic proverbs that offer wisdom, humor, and life lessons.", tr: "Bilgelik, mizah ve hayat dersleri sunan zamansız Arapça atasözlerini keşfedin." },
    category: { en: "Arabic Culture", tr: "Arap Kültürü" },
    author: "Youssef Al-Masri",
    date: "2025-12-28",
    image: blogProverbsImg,
    sections: [
      { id: "intro", heading: { en: "The Wisdom of Arabic Proverbs", tr: "Arapça Atasözlerinin Bilgeliği" }, content: { en: "Arabic proverbs (أمثال عربية - Amthal 'Arabiyya) carry centuries of collective wisdom. They're used in everyday conversations to make a point, offer advice, or add humor. Understanding proverbs gives you deep insight into Arab culture and thinking.", tr: "Arapça atasözleri (أمثال عربية) yüzyılların kolektif bilgeliğini taşır. Günlük konuşmalarda bir noktaya dikkat çekmek, tavsiye vermek veya mizah katmak için kullanılırlar." } },
      { id: "patience", heading: { en: "Proverbs About Patience", tr: "Sabır Hakkında Atasözleri" }, content: { en: "Patience (صبر - Sabr) is highly valued in Arabic culture. These proverbs reflect that value.", tr: "Sabır (صبر) Arap kültüründe çok değerli görülür. Bu atasözleri bu değeri yansıtır." }, examples: [
        { arabic: "الصبر مفتاح الفرج", transliteration: "As-sabr miftah al-faraj", english: "Patience is the key to relief", turkish: "Sabır, kurtuluşun anahtarıdır" },
        { arabic: "اللي يستنى الزين يحصل عليه", transliteration: "Illi yistanna az-zayn yahsal 'alayh", english: "He who waits for goodness will find it", turkish: "İyiliği bekleyen onu bulur" },
      ] },
      { id: "action", heading: { en: "Proverbs About Action", tr: "Eylem Hakkında Atasözleri" }, content: { en: "Arabic culture also values action and initiative. These proverbs encourage doing rather than just talking.", tr: "Arap kültürü ayrıca eylem ve inisiyatife de değer verir." }, examples: [
        { arabic: "يد واحدة ما تصفق", transliteration: "Yad wahida ma tusaffiq", english: "One hand cannot clap alone", turkish: "Bir el ile alkış olmaz" },
        { arabic: "العلم في الصغر كالنقش في الحجر", transliteration: "Al-'ilm fi as-sighar kan-naqsh fil-hajar", english: "Learning in youth is like carving in stone", turkish: "Gençlikte öğrenmek taşa kazımak gibidir" },
      ] },
      { id: "wisdom", heading: { en: "Proverbs About Wisdom", tr: "Bilgelik Hakkında Atasözleri" }, content: { en: "These proverbs celebrate knowledge, learning, and wise living.", tr: "Bu atasözleri bilgi, öğrenme ve bilge yaşamayı kutlar." }, examples: [
        { arabic: "من جد وجد", transliteration: "Man jadda wajada", english: "Whoever strives shall find", turkish: "Çabalayan bulur" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'الصبر مفتاح الفرج' mean?", tr: "'الصبر مفتاح الفرج' ne anlama gelir?" }, options: ["Patience is weakness", "Patience is the key to relief", "Time heals everything", "Be quick to act"], correctIndex: 1 },
      { type: "fill", question: { en: "من جد ___ (Whoever strives shall find)", tr: "من جد ___ (Çabalayan bulur)" }, answer: "وجد" },
      { type: "mcq", question: { en: "Which proverb means 'One hand cannot clap alone'?", tr: "Hangi atasözü 'Bir el ile alkış olmaz' anlamına gelir?" }, options: ["من جد وجد", "يد واحدة ما تصفق", "الصبر مفتاح الفرج", "العلم نور"], correctIndex: 1 },
    ],
  },

  // 19. Ramadan Traditions and Vocabulary
  {
    slug: "ramadan-traditions-vocabulary",
    title: { en: "Ramadan Traditions: Vocabulary and Cultural Guide", tr: "Ramazan Gelenekleri: Kelime ve Kültür Rehberi" },
    excerpt: { en: "Explore the rich traditions of Ramadan and learn the Arabic vocabulary associated with this holy month.", tr: "Ramazan'ın zengin geleneklerini keşfedin ve bu kutsal ayla ilişkili Arapça kelimeleri öğrenin." },
    category: { en: "Arabic Culture", tr: "Arap Kültürü" },
    author: "Fatima Khalil",
    date: "2025-12-25",
    image: blogRamadanImg,
    sections: [
      { id: "intro", heading: { en: "What is Ramadan?", tr: "Ramazan Nedir?" }, content: { en: "Ramadan (رمضان) is the ninth month of the Islamic calendar. During this month, Muslims around the world fast from dawn to sunset, engage in prayer, and focus on charity and self-reflection. It's a time of community, spirituality, and generosity.", tr: "Ramazan (رمضان) İslami takvimin dokuzuncu ayıdır. Bu ayda dünya genelindeki Müslümanlar şafaktan gün batımına kadar oruç tutar, namaz kılar ve hayır işleri ve öz düşünceye odaklanır." } },
      { id: "fasting", heading: { en: "Fasting Vocabulary", tr: "Oruç Kelimeleri" }, content: { en: "Understanding fasting-related vocabulary is essential during Ramadan.", tr: "Ramazan'da oruçla ilgili kelimeleri anlamak çok önemlidir." }, examples: [
        { arabic: "صَوم", transliteration: "Sawm", english: "Fasting", turkish: "Oruç" },
        { arabic: "إفطار", transliteration: "Iftar", english: "Breaking the fast (evening meal)", turkish: "İftar" },
        { arabic: "سُحور", transliteration: "Suhur", english: "Pre-dawn meal", turkish: "Sahur" },
      ] },
      { id: "greetings-ram", heading: { en: "Ramadan Greetings", tr: "Ramazan Selamlaşmaları" }, content: { en: "Use these greetings during the holy month to connect with Arabic speakers.", tr: "Kutsal ay boyunca Arapça konuşanlarla bağlantı kurmak için bu selamlaşmaları kullanın." }, examples: [
        { arabic: "رمضان كريم", transliteration: "Ramadan Kareem", english: "Generous Ramadan", turkish: "Hayırlı Ramazanlar" },
        { arabic: "رمضان مبارك", transliteration: "Ramadan Mubarak", english: "Blessed Ramadan", turkish: "Mübarek Ramazanlar" },
      ] },
      { id: "eid", heading: { en: "Eid al-Fitr", tr: "Ramazan Bayramı" }, content: { en: "Eid al-Fitr marks the end of Ramadan and is one of the biggest celebrations in the Muslim world.", tr: "Ramazan Bayramı, Ramazan'ın sonunu işaret eder ve Müslüman dünyasındaki en büyük kutlamalardan biridir." }, examples: [
        { arabic: "عيد مبارك", transliteration: "Eid Mubarak", english: "Blessed Eid", turkish: "Bayramınız mübarek olsun" },
        { arabic: "كل عام وأنتم بخير", transliteration: "Kull 'am wa antum bikhair", english: "May you be well every year", turkish: "Her yılınız hayırlı olsun" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'إفطار' mean?", tr: "'إفطار' ne anlama gelir?" }, options: ["Pre-dawn meal", "Breaking the fast", "Prayer", "Charity"], correctIndex: 1 },
      { type: "fill", question: { en: "رمضان ___ (Generous Ramadan)", tr: "رمضان ___ (Hayırlı Ramazanlar)" }, answer: "كريم" },
      { type: "mcq", question: { en: "What celebration marks the end of Ramadan?", tr: "Hangi kutlama Ramazan'ın sonunu işaret eder?" }, options: ["Eid al-Adha", "Eid al-Fitr", "Mawlid", "Laylat al-Qadr"], correctIndex: 1 },
    ],
  },

  // 20. Arabic Emotions and Feelings
  {
    slug: "arabic-emotions-and-feelings",
    title: { en: "Express Your Emotions in Arabic: Feelings Vocabulary", tr: "Arapça Duygularınızı İfade Edin: Duygu Kelimeleri" },
    excerpt: { en: "Learn how to express happiness, sadness, anger, and more emotions in Arabic.", tr: "Mutluluk, üzüntü, öfke ve daha fazla duyguyu Arapça olarak ifade etmeyi öğrenin." },
    category: { en: "Everyday Arabic", tr: "Günlük Arapça" },
    author: "Layla Hassan",
    date: "2025-12-22",
    image: blogColorsImg,
    sections: [
      { id: "intro", heading: { en: "Feelings in Arabic", tr: "Arapça Duygular" }, content: { en: "Being able to express your feelings is one of the most important aspects of communication. Arabic has a rich emotional vocabulary that allows speakers to convey subtle differences in their feelings. Let's explore the most common emotion words.", tr: "Duygularınızı ifade edebilmek iletişimin en önemli yönlerinden biridir. Arapça, konuşmacıların duygularındaki ince farkları aktarmasına olanak tanıyan zengin bir duygusal kelime dağarcığına sahiptir." } },
      { id: "positive", heading: { en: "Positive Emotions", tr: "Olumlu Duygular" }, content: { en: "Express joy, excitement, and gratitude with these Arabic words.", tr: "Sevinç, heyecan ve minnettarlığı bu Arapça kelimelerle ifade edin." }, examples: [
        { arabic: "سَعيد", transliteration: "Sa'eed", english: "Happy", turkish: "Mutlu" },
        { arabic: "فَرِح", transliteration: "Farih", english: "Joyful", turkish: "Sevinçli" },
        { arabic: "مُمتَنّ", transliteration: "Mumtann", english: "Grateful", turkish: "Minnettar" },
        { arabic: "مُتَحَمِّس", transliteration: "Mutahammis", english: "Excited", turkish: "Heyecanlı" },
      ] },
      { id: "negative", heading: { en: "Negative Emotions", tr: "Olumsuz Duygular" }, content: { en: "It's equally important to express difficult feelings. These words help you communicate when things aren't going well.", tr: "Zor duyguları ifade etmek de eşit derecede önemlidir." }, examples: [
        { arabic: "حَزين", transliteration: "Hazeen", english: "Sad", turkish: "Üzgün" },
        { arabic: "غاضِب", transliteration: "Ghadib", english: "Angry", turkish: "Kızgın" },
        { arabic: "خائِف", transliteration: "Kha'if", english: "Afraid", turkish: "Korkmuş" },
        { arabic: "تَعبان", transliteration: "Ta'ban", english: "Tired", turkish: "Yorgun" },
      ] },
      { id: "sentences-em", heading: { en: "Emotion Sentences", tr: "Duygu Cümleleri" }, content: { en: "Practice using emotion words in full sentences.", tr: "Duygu kelimelerini tam cümlelerde kullanma pratiği yapın." }, examples: [
        { arabic: "أنا سعيد جداً اليوم", transliteration: "Ana sa'eed jiddan al-yawm", english: "I am very happy today", turkish: "Bugün çok mutluyum" },
        { arabic: "هي حزينة", transliteration: "Hiya hazeena", english: "She is sad", turkish: "O üzgün" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'سَعيد' mean?", tr: "'سَعيد' ne anlama gelir?" }, options: ["Sad", "Angry", "Happy", "Tired"], correctIndex: 2 },
      { type: "fill", question: { en: "أنا ___ جداً اليوم (I am very happy today)", tr: "أنا ___ جداً اليوم (Bugün çok mutluyum)" }, answer: "سعيد" },
      { type: "mcq", question: { en: "Which word means 'afraid'?", tr: "Hangi kelime 'korkmuş' anlamına gelir?" }, options: ["غاضِب", "حَزين", "خائِف", "تَعبان"], correctIndex: 2 },
    ],
  },
];

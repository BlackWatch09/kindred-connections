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

export const blogPostsBatch2: BlogPost[] = [
  {
    slug: "arabic-prepositions-common-words",
    title: { en: "Arabic Prepositions: Common Words and Usage", tr: "Arapça Edatlar: Yaygın Kelimeler ve Kullanımları" },
    excerpt: { en: "Master the most essential Arabic prepositions and learn how to use them in everyday sentences.", tr: "En temel Arapça edatları öğrenin ve günlük cümlelerde nasıl kullanacağınızı keşfedin." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Youssef Al-Masri",
    date: "2026-02-10",
    image: blogPrepositionsImg,
    sections: [
      { id: "intro", heading: { en: "Why Prepositions Matter", tr: "Edatlar Neden Önemlidir" }, content: { en: "Prepositions are the glue of any language. In Arabic, prepositions (حروف الجر - huruf al-jarr) connect nouns and pronouns to the rest of the sentence, giving context about location, direction, time, and more. Without them, sentences would feel incomplete and confusing. Arabic prepositions have a special grammatical feature — they put the following noun into the genitive case (مجرور - majrur), which changes the ending of the noun. While this grammatical detail might seem complex, the prepositions themselves are quite straightforward to learn. There are about 20 common prepositions in Arabic, but mastering just 6-8 of them will cover the vast majority of everyday situations. These small words carry enormous power in shaping meaning, and understanding them will dramatically improve your ability to read, write, and speak Arabic. Let's explore the most essential ones with clear examples and practice sentences.", tr: "Edatlar her dilin yapıştırıcısıdır. Arapça'da edatlar (حروف الجر) isimleri ve zamirleri cümlenin geri kalanına bağlayarak konum, yön, zaman ve daha fazlası hakkında bağlam sağlar. Bunlar olmadan cümleler eksik ve kafa karıştırıcı hissedilir. Arapça edatlar özel bir dilbilgisel özelliğe sahiptir — sonraki ismi ismin -in haline (مجرور) getirirler. Yaklaşık 20 yaygın edat vardır, ancak sadece 6-8 tanesini öğrenmek günlük durumların büyük çoğunluğunu kapsayacaktır." } },
      { id: "fi", heading: { en: "في (Fi) — In / At", tr: "في (Fi) — İçinde / -de" }, content: { en: "'Fi' is one of the most commonly used Arabic prepositions. It indicates being inside something or at a location. You'll hear it constantly in daily conversations. 'Fi' is incredibly versatile — it can express physical location ('in the house'), time ('in the morning'), abstract concepts ('in love'), and even exclamations ('What's wrong with you?!' — ما فيك؟). When attached to pronouns, 'Fi' becomes: فيّ (fiyya - in me), فيك (fik - in you), فيه (fih - in it/him), فيها (fiha - in her/it). Understanding these pronoun attachments is crucial for fluent Arabic. In Egyptian dialect, 'fi' is also used to express existence, similar to 'there is': 'في واحد هنا' (fi wahid hena - there is someone here).", tr: "'Fi' en yaygın kullanılan Arapça edatlardan biridir. Bir şeyin içinde olmayı veya bir konumda bulunmayı ifade eder. İnanılmaz derecede çok yönlüdür — fiziksel konum, zaman, soyut kavramları ve hatta ünlemleri ifade edebilir. Zamirlere eklendiğinde 'Fi' شekil değiştirir. Mısır lehçesinde 'fi' ayrıca varlığı ifade etmek için kullanılır." }, examples: [
        { arabic: "أنا في البيت", transliteration: "Ana fi al-bayt", english: "I am at home", turkish: "Evdeyim" },
        { arabic: "الكتاب في الحقيبة", transliteration: "Al-kitab fi al-haqeeba", english: "The book is in the bag", turkish: "Kitap çantada" },
        { arabic: "في الصباح أشرب قهوة", transliteration: "Fi as-sabah ashrab qahwa", english: "In the morning I drink coffee", turkish: "Sabahleyin kahve içerim" },
        { arabic: "هل في أحد هنا؟", transliteration: "Hal fi ahad huna?", english: "Is there anyone here?", turkish: "Burada biri var mı?" },
      ] },
      { id: "min", heading: { en: "من (Min) — From", tr: "من (Min) — -den / -dan" }, content: { en: "'Min' expresses origin, source, or starting point. It's equivalent to 'from' in English and is used in countless expressions. Beyond its basic meaning, 'min' is also used for partitive expressions ('some of'), comparison ('bigger than' — أكبر من), and material ('made of' — مصنوع من). When Arabs introduce themselves, they almost always use 'min' to state their origin: 'أنا من مصر' (Ana min Masr - I am from Egypt). This phrase is one of the first things you'll learn and one of the most useful. 'Min' also appears in many fixed expressions: 'من فضلك' (min fadlak - please), 'من الأفضل' (min al-afdal - it's better to), 'من الممكن' (min al-mumkin - it's possible).", tr: "'Min' köken, kaynak veya başlangıç noktasını ifade eder. Temel anlamının ötesinde 'min' bölümleme ifadeleri ('bir kısmı'), karşılaştırma ('daha büyük') ve malzeme ('yapılmış') için de kullanılır. Araplar kendilerini tanıtırken neredeyse her zaman 'min' kullanarak kökenlerini belirtirler." }, examples: [
        { arabic: "أنا من مصر", transliteration: "Ana min Masr", english: "I am from Egypt", turkish: "Mısır'danım" },
        { arabic: "من الصباح إلى المساء", transliteration: "Min as-sabah ila al-masa", english: "From morning to evening", turkish: "Sabahtan akşama kadar" },
        { arabic: "هذا أكبر من ذلك", transliteration: "Hadha akbar min dhalik", english: "This is bigger than that", turkish: "Bu ondan daha büyük" },
        { arabic: "من فضلك ساعدني", transliteration: "Min fadlak sa'idni", english: "Please help me", turkish: "Lütfen bana yardım et" },
      ] },
      { id: "ila", heading: { en: "إلى (Ila) — To / Towards", tr: "إلى (Ila) — -e / -a Doğru" }, content: { en: "'Ila' indicates direction or destination. It's the counterpart of 'min' and together they form the 'from...to' structure that's essential for expressing movement and time ranges. 'Ila' is used with physical destinations ('to school'), time endpoints ('until evening'), and abstract goals ('towards success'). In formal Arabic correspondence, 'إلى' is used at the beginning of letters, similar to 'To:' in English. The phrase 'إلى اللقاء' (ila al-liqa' - until we meet again) is a beautiful and common way to say goodbye in Arabic, carrying a sense of hope for a future meeting.", tr: "'Ila' yön veya hedefi gösterir. 'Min' ile birlikte '-den...-e' yapısını oluşturur. Fiziksel hedeflerle, zaman bitiş noktalarıyla ve soyut hedeflerle kullanılır. 'إلى اللقاء' (ila al-liqa') Arapça'da hoşça kal demenin güzel ve yaygın bir yoludur." }, examples: [
        { arabic: "ذهبت إلى المدرسة", transliteration: "Dhahabtu ila al-madrasa", english: "I went to school", turkish: "Okula gittim" },
        { arabic: "إلى اللقاء", transliteration: "Ila al-liqa'", english: "Until we meet again / Goodbye", turkish: "Tekrar görüşmek üzere" },
        { arabic: "من القاهرة إلى بيروت", transliteration: "Min al-Qahira ila Bayrut", english: "From Cairo to Beirut", turkish: "Kahire'den Beyrut'a" },
      ] },
      { id: "ala", heading: { en: "على (Ala) — On / Upon", tr: "على (Ala) — Üzerinde" }, content: { en: "'Ala' means 'on' or 'upon' and is used for surfaces, obligations, and many idiomatic expressions in Arabic. It's one of the most versatile prepositions because it extends far beyond physical placement. 'Ala' can express obligation ('you must' — عليك أن), cost ('it's on me' — عليّ), direction ('turn right' — على اليمين), and even emotions ('I'm angry at him' — أنا غاضب عليه). The phrase 'على الرحب والسعة' (ala ar-rahb was-sa'a - you're welcome, literally 'upon breadth and ease') is a wonderful example of how 'ala' creates rich, meaningful expressions in Arabic.", tr: "'Ala' 'üzerinde' anlamına gelir ve yüzeyler, yükümlülükler ve birçok deyimsel ifadede kullanılır. En çok yönlü edatlardan biridir çünkü fiziksel yerleşimin çok ötesine geçer. Yükümlülük, maliyet, yön ve hatta duyguları ifade edebilir." }, examples: [
        { arabic: "الكتاب على الطاولة", transliteration: "Al-kitab ala at-tawila", english: "The book is on the table", turkish: "Kitap masanın üzerinde" },
        { arabic: "عليك أن تدرس", transliteration: "'Alayk an tadrus", english: "You must study", turkish: "Çalışmalısın" },
        { arabic: "على اليمين", transliteration: "Ala al-yameen", english: "On the right", turkish: "Sağda" },
        { arabic: "على الرحب والسعة", transliteration: "Ala ar-rahb was-sa'a", english: "You're welcome", turkish: "Rica ederim" },
      ] },
      { id: "bi", heading: { en: "بـ (Bi) — With / By", tr: "بـ (Bi) — İle / Tarafından" }, content: { en: "'Bi' is a prefix preposition meaning 'with,' 'by,' or 'in.' Unlike other prepositions that stand alone, 'bi' attaches directly to the next word. It's used to express means of transportation ('by car' — بالسيارة), instruments ('with a pen' — بالقلم), languages ('in Arabic' — بالعربي), and manner ('with happiness' — بسعادة). The famous Islamic greeting 'بسم الله الرحمن الرحيم' (Bismillah ar-Rahman ar-Raheem - In the name of God, the Most Gracious, the Most Merciful) begins with 'bi,' showing its importance in Arabic culture and daily life.", tr: "'Bi' 'ile', '-la/-le' veya 'tarafından' anlamına gelen bir ön ek edattır. Diğer edatların aksine doğrudan sonraki kelimeye eklenir. Ulaşım araçları, aletler, diller ve tarz ifade etmek için kullanılır." }, examples: [
        { arabic: "أكتب بالقلم", transliteration: "Aktub bil-qalam", english: "I write with a pen", turkish: "Kalemle yazarım" },
        { arabic: "سافرت بالطائرة", transliteration: "Safartu bit-ta'ira", english: "I traveled by plane", turkish: "Uçakla seyahat ettim" },
        { arabic: "أتكلم بالعربي", transliteration: "Atakallam bil-'arabi", english: "I speak in Arabic", turkish: "Arapça konuşurum" },
        { arabic: "بسم الله", transliteration: "Bismillah", english: "In the name of God", turkish: "Allah'ın adıyla" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "Which preposition means 'from'?", tr: "Hangi edat '-den/-dan' anlamına gelir?" }, options: ["في", "من", "إلى", "على"], correctIndex: 1 },
      { type: "fill", question: { en: "أنا ___ البيت (I am at home)", tr: "أنا ___ البيت (Evdeyim)" }, answer: "في" },
      { type: "mcq", question: { en: "What does 'إلى' mean?", tr: "'إلى' ne anlama gelir?" }, options: ["From", "In", "To", "On"], correctIndex: 2 },
      { type: "mcq", question: { en: "Which preposition attaches directly to the next word?", tr: "Hangi edat doğrudan sonraki kelimeye eklenir?" }, options: ["في", "من", "على", "بـ"], correctIndex: 3 },
      { type: "fill", question: { en: "الكتاب ___ الطاولة (The book is on the table)", tr: "الكتاب ___ الطاولة (Kitap masanın üzerinde)" }, answer: "على" },
    ],
  },

  {
    slug: "colors-in-arabic",
    title: { en: "Learn Colors in Arabic: A Colorful Vocabulary Guide", tr: "Arapça Renkleri Öğrenin: Renkli Bir Kelime Rehberi" },
    excerpt: { en: "Discover how to say all the basic colors in Arabic with pronunciation and fun examples.", tr: "Tüm temel renkleri Arapça olarak telaffuz ve eğlenceli örneklerle öğrenin." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Fatima Khalil",
    date: "2026-02-08",
    image: blogColorsImg,
    sections: [
      { id: "intro", heading: { en: "Colors in Arabic Culture", tr: "Arap Kültüründe Renkler" }, content: { en: "Colors play an important role in Arabic culture and language. From the golden sands of the desert to the deep blue of the Mediterranean Sea, Arabic has rich and expressive words for every color. Learning colors is one of the first steps in building your Arabic vocabulary. In Arabic, colors have special grammatical rules — they follow a pattern called 'af'al' (أفعل) for masculine forms, which gives them a distinctive structure. Most masculine color words follow the pattern: أَفْعَل (af'al), and their feminine forms follow: فَعْلاء (fa'la'). For example, أحمر (ahmar - red, masculine) becomes حمراء (hamra' - red, feminine). This pattern is unique to colors and a few other adjective categories in Arabic. Colors also carry deep symbolic meaning in Arab culture. Green (أخضر) is associated with Islam and paradise, white (أبيض) symbolizes purity and peace, and black (أسود) represents strength and elegance.", tr: "Renkler Arap kültüründe ve dilinde önemli bir rol oynar. Çölün altın kumlarından Akdeniz'in derin mavisine kadar, Arapça her renk için zengin ve ifade edici kelimelere sahiptir. Arapça'da renkler özel dilbilgisi kurallarına sahiptir — 'af'al' (أفعل) adı verilen bir kalıp izlerler. Renkler ayrıca Arap kültüründe derin sembolik anlam taşır. Yeşil İslam ve cennetle, beyaz saflık ve barışla ilişkilendirilir." } },
      { id: "primary", heading: { en: "Primary Colors", tr: "Ana Renkler" }, content: { en: "Let's start with the three primary colors. In Arabic, color words often change form depending on gender — masculine and feminine forms exist for most colors. When describing a masculine noun, use the masculine color form; when describing a feminine noun, use the feminine form. This agreement is a fundamental rule in Arabic grammar. The three primary colors — red, blue, and yellow — are among the most frequently used color words in daily Arabic. You'll encounter them when shopping for clothes, describing food, talking about flags, and in countless other situations.", tr: "Üç ana renkle başlayalım. Arapça'da renk kelimeleri genellikle cinsiyete göre değişir — çoğu renk için eril ve dişil formlar mevcuttur. Eril bir ismi tanımlarken eril renk formunu, dişil bir ismi tanımlarken dişil formu kullanın." }, examples: [
        { arabic: "أحمر / حمراء", transliteration: "Ahmar / Hamra'", english: "Red (m/f)", turkish: "Kırmızı" },
        { arabic: "أزرق / زرقاء", transliteration: "Azraq / Zarqa'", english: "Blue (m/f)", turkish: "Mavi" },
        { arabic: "أصفر / صفراء", transliteration: "Asfar / Safra'", english: "Yellow (m/f)", turkish: "Sarı" },
      ] },
      { id: "secondary", heading: { en: "More Essential Colors", tr: "Daha Fazla Temel Renk" }, content: { en: "Beyond the primary colors, here are more colors you'll need in daily life. These appear frequently in descriptions of clothes, food, nature, and everyday objects. Green is especially significant in Arabic culture due to its association with Islam — you'll see it in mosque decorations, flags, and traditional clothing. White and black are used extensively in both literal and figurative language.", tr: "Ana renklerin ötesinde, günlük hayatta ihtiyaç duyacağınız daha fazla renk. Yeşil, İslam'la olan ilişkisi nedeniyle Arap kültüründe özellikle önemlidir." }, examples: [
        { arabic: "أخضر / خضراء", transliteration: "Akhdar / Khadra'", english: "Green (m/f)", turkish: "Yeşil" },
        { arabic: "أبيض / بيضاء", transliteration: "Abyad / Bayda'", english: "White (m/f)", turkish: "Beyaz" },
        { arabic: "أسود / سوداء", transliteration: "Aswad / Sawda'", english: "Black (m/f)", turkish: "Siyah" },
        { arabic: "بُرتقالي / بُرتقالية", transliteration: "Burtuqali / Burtuqaliyya", english: "Orange (m/f)", turkish: "Turuncu" },
        { arabic: "بُنّي / بُنّية", transliteration: "Bunni / Bunniyya", english: "Brown (m/f)", turkish: "Kahverengi" },
      ] },
      { id: "sentences", heading: { en: "Using Colors in Sentences", tr: "Cümlelerde Renk Kullanımı" }, content: { en: "Now let's see how colors are used in real sentences. Remember that colors agree with the noun they describe in gender. In Arabic, the color adjective typically comes after the noun it describes, which is opposite to English word order. Practice these sentences to build natural fluency with color expressions.", tr: "Şimdi renklerin gerçek cümlelerde nasıl kullanıldığını görelim. Renklerin tanımladıkları isimle cinsiyette uyum sağladığını unutmayın." }, examples: [
        { arabic: "السماء زرقاء", transliteration: "As-sama' zarqa'", english: "The sky is blue", turkish: "Gökyüzü mavi" },
        { arabic: "الوردة حمراء", transliteration: "Al-warda hamra'", english: "The rose is red", turkish: "Gül kırmızı" },
        { arabic: "أريد القميص الأبيض", transliteration: "Ureedu al-qamees al-abyad", english: "I want the white shirt", turkish: "Beyaz gömleği istiyorum" },
        { arabic: "ما لونك المفضل؟", transliteration: "Ma lawnak al-mufaddal?", english: "What's your favorite color?", turkish: "En sevdiğin renk ne?" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What color is 'أخضر'?", tr: "'أخضر' hangi renktir?" }, options: ["Red", "Green", "Blue", "Yellow"], correctIndex: 1 },
      { type: "fill", question: { en: "السماء ___ (The sky is blue)", tr: "السماء ___ (Gökyüzü mavi)" }, answer: "زرقاء" },
      { type: "mcq", question: { en: "Which word means 'black' in Arabic?", tr: "Arapça'da hangi kelime 'siyah' demektir?" }, options: ["أبيض", "أحمر", "أسود", "أصفر"], correctIndex: 2 },
      { type: "mcq", question: { en: "What is the feminine form of 'أحمر' (red)?", tr: "'أحمر' (kırmızı) kelimesinin dişil formu nedir?" }, options: ["أحمرة", "حمراء", "حمرة", "أحمري"], correctIndex: 1 },
      { type: "fill", question: { en: "ما ___ك المفضل؟ (What's your favorite color?)", tr: "ما ___ك المفضل؟ (En sevdiğin renk ne?)" }, answer: "لون" },
    ],
  },

  {
    slug: "days-of-the-week-in-arabic",
    title: { en: "Days of the Week in Arabic: Complete Guide", tr: "Arapça Haftanın Günleri: Tam Rehber" },
    excerpt: { en: "Learn all seven days of the week in Arabic with pronunciation, origins, and usage examples.", tr: "Arapça haftanın yedi gününü telaffuz, köken ve kullanım örnekleriyle öğrenin." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Ahmed Nasser",
    date: "2026-02-05",
    image: blogPrepositionsImg,
    sections: [
      { id: "intro", heading: { en: "The Arabic Week", tr: "Arapça Hafta" }, content: { en: "In Arabic-speaking countries, the week traditionally starts on Sunday (الأحد), not Monday. Understanding the days of the week is essential for scheduling, making appointments, and daily communication. The Arabic names for days are deeply connected to Arabic numerals — most days are named after their position in the week. 'الأحد' (Sunday) comes from 'واحد' (one), 'الإثنين' (Monday) from 'اثنان' (two), 'الثلاثاء' (Tuesday) from 'ثلاثة' (three), and so on. This numerical naming makes the system logical and easy to remember once you know the connection. Friday (الجمعة) is special — it's the holy day for Muslims and is derived from 'جمع' (to gather), as the Muslim community gathers for Friday prayers at the mosque. In many Arab countries, the weekend consists of Friday and Saturday, though some countries have shifted to Saturday-Sunday to align with the global business week.", tr: "Arapça konuşulan ülkelerde hafta geleneksel olarak Pazar (الأحد) günü başlar. Haftanın günlerini anlamak planlama, randevu alma ve günlük iletişim için çok önemlidir. Arapça gün isimleri Arapça rakamlarla derin bir bağlantıya sahiptir. Cuma (الجمعة) özeldir — Müslümanların Cuma namazı için toplandığı 'جمع' (toplamak) kelimesinden türetilmiştir." } },
      { id: "sun-tue", heading: { en: "Sunday to Tuesday", tr: "Pazar'dan Salı'ya" }, content: { en: "The first three days of the Arabic week carry names derived from Arabic numerals, reflecting their position in the week. Sunday, الأحد (al-Ahad), is derived from the number one (واحد). It marks the beginning of the work week in most Arab countries. Monday, الإثنين (al-Ithnayn), comes from the number two (اثنان). In Islamic tradition, Monday holds significance as the day the Prophet Muhammad was born. Tuesday, الثلاثاء (ath-Thulatha'), is derived from the number three (ثلاثة). Practice pronouncing the 'th' (ث) sound, which doesn't exist in many other languages.", tr: "Arapça haftanın ilk üç günü, haftadaki konumlarını yansıtan Arapça rakamlardan türetilmiş isimler taşır. Pazar (الأحد) bir sayısından (واحد), Pazartesi (الإثنين) iki sayısından (اثنان), Salı (الثلاثاء) üç sayısından (ثلاثة) türetilmiştir." }, examples: [
        { arabic: "الأحد", transliteration: "Al-Ahad", english: "Sunday", turkish: "Pazar" },
        { arabic: "الإثنين", transliteration: "Al-Ithnayn", english: "Monday", turkish: "Pazartesi" },
        { arabic: "الثلاثاء", transliteration: "Ath-Thulatha'", english: "Tuesday", turkish: "Salı" },
        { arabic: "يوم الأحد أذهب إلى المسجد", transliteration: "Yawm al-Ahad adhhab ila al-masjid", english: "On Sunday I go to the mosque", turkish: "Pazar günü camiye giderim" },
      ] },
      { id: "wed-fri", heading: { en: "Wednesday to Friday", tr: "Çarşamba'dan Cuma'ya" }, content: { en: "Wednesday, الأربعاء (al-Arbi'a'), comes from the number four (أربعة). Thursday, الخميس (al-Khamis), is derived from the number five (خمسة). In Arab culture, Thursday evening is when the weekend begins, making it a popular night for socializing and celebrations. Friday (الجمعة - al-Jumu'a) is the holy day in Islam and is derived from the word 'jama'a' (جمع) meaning 'to gather,' as Muslims gather for the congregational Friday prayer (صلاة الجمعة - Salat al-Jumu'a). Friday in the Arab world is similar to Sunday in Western countries — it's a day of worship, rest, and family time. Many businesses and government offices are closed on Fridays.", tr: "Çarşamba (الأربعاء) dört sayısından, Perşembe (الخميس) beş sayısından türetilmiştir. Cuma (الجمعة) İslam'da kutsal gündür ve 'toplamak' anlamındaki 'جمع' kelimesinden türetilmiştir. Cuma günü Arap dünyasında Batı ülkelerindeki Pazar gününe benzer." }, examples: [
        { arabic: "الأربعاء", transliteration: "Al-Arbi'a'", english: "Wednesday", turkish: "Çarşamba" },
        { arabic: "الخميس", transliteration: "Al-Khamis", english: "Thursday", turkish: "Perşembe" },
        { arabic: "الجمعة", transliteration: "Al-Jumu'a", english: "Friday", turkish: "Cuma" },
        { arabic: "يوم الجمعة يوم مبارك", transliteration: "Yawm al-Jumu'a yawm mubarak", english: "Friday is a blessed day", turkish: "Cuma mübarek bir gündür" },
      ] },
      { id: "saturday", heading: { en: "Saturday — The Last Day", tr: "Cumartesi — Son Gün" }, content: { en: "Saturday is the last day of the Arabic week and is called 'السبت' (as-Sabt), which shares its root with the word 'Sabbath' in English and Hebrew. The root 'سبت' (s-b-t) relates to rest and cessation. In many Arab countries, Saturday is part of the weekend. It's a day for family visits, shopping, and leisure activities. When talking about days in Arabic, you use the word 'يوم' (yawm - day) before the day name: 'يوم السبت' (yawm as-Sabt - Saturday, literally 'day of Saturday').", tr: "Cumartesi Arapça haftanın son günüdür ve 'السبت' (as-Sabt) olarak adlandırılır. 'سبت' (s-b-t) kökü dinlenme ve durmayla ilgilidir. Günler hakkında konuşurken gün adından önce 'يوم' (gün) kelimesi kullanılır." }, examples: [
        { arabic: "السبت", transliteration: "As-Sabt", english: "Saturday", turkish: "Cumartesi" },
        { arabic: "يوم السبت أرتاح في البيت", transliteration: "Yawm as-Sabt artah fi al-bayt", english: "On Saturday I rest at home", turkish: "Cumartesi evde dinlenirim" },
        { arabic: "ما هو اليوم؟ اليوم السبت", transliteration: "Ma huwa al-yawm? Al-yawm as-Sabt", english: "What day is it? Today is Saturday", turkish: "Bugün hangi gün? Bugün Cumartesi" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "Which day does the Arabic week start with?", tr: "Arapça hafta hangi günle başlar?" }, options: ["Monday", "Saturday", "Sunday", "Friday"], correctIndex: 2 },
      { type: "fill", question: { en: "The Arabic word for Friday is ___", tr: "Cuma'nın Arapçası ___" }, answer: "الجمعة" },
      { type: "mcq", question: { en: "What is 'الخميس'?", tr: "'الخميس' nedir?" }, options: ["Wednesday", "Thursday", "Friday", "Saturday"], correctIndex: 1 },
      { type: "mcq", question: { en: "Which Arabic number is 'الأربعاء' derived from?", tr: "'الأربعاء' hangi Arapça sayıdan türetilmiştir?" }, options: ["Three", "Four", "Five", "Six"], correctIndex: 1 },
      { type: "fill", question: { en: "يوم ___ أذهب إلى المسجد (On Sunday I go to the mosque)", tr: "يوم ___ أذهب إلى المسجد (Pazar günü camiye giderim)" }, answer: "الأحد" },
    ],
  },

  {
    slug: "arabic-numbers-1-to-100",
    title: { en: "Arabic Numbers 1 to 100: A Complete Learning Guide", tr: "Arapça Sayılar 1-100: Tam Öğrenme Rehberi" },
    excerpt: { en: "Count from 1 to 100 in Arabic with clear pronunciation and practical examples.", tr: "Net telaffuz ve pratik örneklerle Arapça 1'den 100'e kadar sayın." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Youssef Al-Masri",
    date: "2026-02-03",
    image: blogNumbersImg,
    sections: [
      { id: "intro", heading: { en: "Why Learn Arabic Numbers?", tr: "Neden Arapça Sayıları Öğrenmeliyiz?" }, content: { en: "Numbers are fundamental to any language. Whether you're shopping at a souq, telling time, giving your phone number, or reading prices, knowing Arabic numbers is essential. The good news is that Arabic numbers follow a logical pattern that makes them relatively easy to learn. An interesting historical fact: the 'Arabic numerals' we use globally (0, 1, 2, 3...) were actually transmitted to Europe through Arab mathematicians, though they originated in India. In Arabic-speaking countries, you'll see both the Western-style numerals and the Eastern Arabic numerals (٠, ١, ٢, ٣...) used interchangeably. Learning to read both systems is important for anyone studying Arabic seriously. The word for 'number' in Arabic is 'رقم' (raqm) for a single digit and 'عدد' ('adad) for a number in general.", tr: "Sayılar her dilin temeldir. Alışveriş yaparken, saat söylerken veya telefon numaranızı verirken Arapça sayıları bilmek çok önemlidir. İlginç bir tarihsel gerçek: küresel olarak kullandığımız 'Arap rakamları' aslında Arap matematikçiler aracılığıyla Avrupa'ya ulaşmıştır. Arapça konuşulan ülkelerde hem Batı tarzı rakamları hem de Doğu Arapça rakamlarını (٠, ١, ٢, ٣...) birbirinin yerine kullanılır." } },
      { id: "one-ten", heading: { en: "Numbers 1-10", tr: "Sayılar 1-10" }, content: { en: "These are the building blocks of all Arabic numbers. Master these first, and the rest will follow naturally. Each number from 1 to 10 is a standalone word that you'll need to memorize. Pay special attention to pronunciation — some sounds like 'ث' (th) in ثلاثة and 'خ' (kh) in خمسة are unique to Arabic. Practice saying each number aloud multiple times until it feels natural.", tr: "Bunlar tüm Arapça sayıların yapı taşlarıdır. Önce bunları öğrenin, gerisi doğal olarak gelecektir. Her sayı ezberlemeniz gereken bağımsız bir kelimedir." }, examples: [
        { arabic: "واحد", transliteration: "Wahid", english: "One (1)", turkish: "Bir" },
        { arabic: "اثنان", transliteration: "Ithnan", english: "Two (2)", turkish: "İki" },
        { arabic: "ثلاثة", transliteration: "Thalatha", english: "Three (3)", turkish: "Üç" },
        { arabic: "أربعة", transliteration: "Arba'a", english: "Four (4)", turkish: "Dört" },
        { arabic: "خمسة", transliteration: "Khamsa", english: "Five (5)", turkish: "Beş" },
        { arabic: "عشرة", transliteration: "'Ashara", english: "Ten (10)", turkish: "On" },
      ] },
      { id: "eleven-twenty", heading: { en: "Numbers 11-20", tr: "Sayılar 11-20" }, content: { en: "Numbers 11-19 in Arabic are compound words. They combine the unit with a form of ten (عشر - 'ashar). Number 20 has its own unique word 'عشرون' ('ishrun). The structure for 11-19 is: unit + عشر ('ashar). For example, 11 is أحد عشر (ahada 'ashar — literally 'one ten'), 12 is اثنا عشر (ithna 'ashar — 'two ten'), and so on. This pattern is consistent and once you understand it, you can construct any number from 11 to 19. Number 20, عشرون ('ishrun), breaks this pattern and must be memorized separately. It's the first of the 'tens' numbers, which all end in '-un' or '-in'.", tr: "Arapça'da 11-19 arası sayılar bileşik kelimelerdir. Birler basamağını onun bir formuyla (عشر) birleştirirler. 20 sayısı kendi benzersiz kelimesine sahiptir: 'عشرون'. 11-19 arası yapı: birim + عشر." }, examples: [
        { arabic: "أحد عشر", transliteration: "Ahada 'ashar", english: "Eleven (11)", turkish: "On bir" },
        { arabic: "اثنا عشر", transliteration: "Ithna 'ashar", english: "Twelve (12)", turkish: "On iki" },
        { arabic: "خمسة عشر", transliteration: "Khamsata 'ashar", english: "Fifteen (15)", turkish: "On beş" },
        { arabic: "عشرون", transliteration: "'Ishrun", english: "Twenty (20)", turkish: "Yirmi" },
      ] },
      { id: "tens", heading: { en: "Tens: 30, 40, 50... 100", tr: "Onlar: 30, 40, 50... 100" }, content: { en: "The tens in Arabic follow a clear pattern, making them easier to memorize. They all end in '-un' or '-in' and are derived from the base numbers 1-9. Thirty is ثلاثون (thalathun — from ثلاثة), forty is أربعون (arba'un — from أربعة), and so on. For compound numbers like 45, Arabic uses the structure: unit + و (wa, meaning 'and') + ten. So 45 is خمسة وأربعون (khamsa wa arba'un — literally 'five and forty'). Notice that unlike English where we say 'forty-five,' Arabic puts the unit first: 'five and forty.' This is important to remember when reading numbers. Finally, 100 is مئة (mi'a) or مائة (ma'a), a word you'll encounter frequently in prices and quantities.", tr: "Arapça'daki onlar net bir kalıp izler. Hepsi '-un' veya '-in' ile biter. 45 gibi bileşik sayılar için Arapça şu yapıyı kullanır: birim + و (ve) + on. Yani 45, خمسة وأربعون (beş ve kırk)." }, examples: [
        { arabic: "ثلاثون", transliteration: "Thalathun", english: "Thirty (30)", turkish: "Otuz" },
        { arabic: "أربعون", transliteration: "Arba'un", english: "Forty (40)", turkish: "Kırk" },
        { arabic: "خمسون", transliteration: "Khamsun", english: "Fifty (50)", turkish: "Elli" },
        { arabic: "مئة", transliteration: "Mi'a", english: "One hundred (100)", turkish: "Yüz" },
        { arabic: "خمسة وأربعون", transliteration: "Khamsa wa arba'un", english: "Forty-five (45)", turkish: "Kırk beş" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What is 'عشرون' in English?", tr: "'عشرون' İngilizce'de ne demektir?" }, options: ["Twelve", "Twenty", "Thirty", "Ten"], correctIndex: 1 },
      { type: "fill", question: { en: "The Arabic word for 'one hundred' is ___", tr: "'Yüz' sayısının Arapçası ___" }, answer: "مئة" },
      { type: "mcq", question: { en: "How do you say 'three' in Arabic?", tr: "Arapça'da 'üç' nasıl söylenir?" }, options: ["واحد", "اثنان", "ثلاثة", "أربعة"], correctIndex: 2 },
      { type: "mcq", question: { en: "In Arabic, how is 45 expressed?", tr: "Arapça'da 45 nasıl ifade edilir?" }, options: ["أربعون وخمسة", "خمسة وأربعون", "أربعة وخمسون", "خمسة أربعون"], correctIndex: 1 },
    ],
  },

  {
    slug: "arabic-phrases-for-travel",
    title: { en: "Essential Arabic Phrases for Travelers", tr: "Gezginler İçin Temel Arapça İfadeler" },
    excerpt: { en: "Traveling to an Arab country? Learn the must-know phrases for airports, hotels, and restaurants.", tr: "Bir Arap ülkesine mi seyahat ediyorsunuz? Havalimanları, oteller ve restoranlar için bilinmesi gereken ifadeleri öğrenin." },
    category: { en: "Everyday Arabic", tr: "Günlük Arapça" },
    author: "Layla Hassan",
    date: "2026-01-30",
    image: blogTravelImg,
    sections: [
      { id: "intro", heading: { en: "Travel with Confidence", tr: "Güvenle Seyahat Edin" }, content: { en: "Traveling to the Arab world is an incredible experience. Knowing even a few phrases in Arabic can transform your trip — locals appreciate the effort and you'll find doors opening everywhere. The Arab world spans from Morocco in the west to Oman in the east, offering incredible diversity in landscapes, cuisines, and local dialects. While Modern Standard Arabic (الفصحى - al-fusha) is understood everywhere, each country has its own colloquial dialect. The phrases in this guide use widely understood expressions that will work across the region. Remember, Arabs are renowned for their hospitality (كرم الضيافة - karam ad-diyafa), and making the effort to speak even a little Arabic will be warmly received. Don't worry about perfect pronunciation — your effort itself communicates respect and openness.", tr: "Arap dünyasına seyahat etmek inanılmaz bir deneyimdir. Birkaç Arapça ifade bilmek bile seyahatinizi dönüştürebilir. Bu rehberdeki ifadeler bölge genelinde anlaşılan yaygın ifadeler kullanır. Araplar misafirperverlikleriyle (كرم الضيافة) ünlüdür." } },
      { id: "greetings", heading: { en: "Greetings & Politeness", tr: "Selamlaşma ve Nezaket" }, content: { en: "First impressions matter. These greeting phrases will help you start any conversation on the right foot. The universal Islamic greeting 'As-salamu alaykum' (Peace be upon you) is appropriate in all situations and will be warmly received by everyone, regardless of their religion. The response is 'Wa alaykum as-salam' (And upon you peace). 'Shukran' (Thank you) and 'Min fadlak/fadlik' (Please, m/f) are magic words that open hearts. Adding 'jazeelan' (very much) after 'shukran' shows extra appreciation.", tr: "İlk izlenimler önemlidir. Bu selamlaşma ifadeleri herhangi bir konuşmayı doğru başlatmanıza yardımcı olacaktır. 'As-salamu alaykum' (Selam üzerinize olsun) her durumda uygun olan evrensel İslami selamdır." }, examples: [
        { arabic: "السلام عليكم", transliteration: "As-salamu alaykum", english: "Peace be upon you", turkish: "Selam üzerinize olsun" },
        { arabic: "وعليكم السلام", transliteration: "Wa alaykum as-salam", english: "And upon you peace", turkish: "Ve üzerinize selam" },
        { arabic: "شكراً جزيلاً", transliteration: "Shukran jazeelan", english: "Thank you very much", turkish: "Çok teşekkürler" },
        { arabic: "من فضلك / من فضلِك", transliteration: "Min fadlak / Min fadlik", english: "Please (m/f)", turkish: "Lütfen" },
        { arabic: "عفواً", transliteration: "'Afwan", english: "Excuse me / You're welcome", turkish: "Affedersiniz / Rica ederim" },
      ] },
      { id: "hotel", heading: { en: "At the Hotel", tr: "Otelde" }, content: { en: "These phrases will help you check in, ask about amenities, and communicate with hotel staff. Arab hotels are known for their exceptional hospitality, and staff members will often go above and beyond to help guests. When checking in, having your reservation confirmation ('حجز' - hajz) ready will smooth the process. Don't hesitate to ask about room upgrades — the Arabic phrase for it is 'هل يوجد غرفة أفضل؟' (Hal yujad ghurfa afdal? — Is there a better room?).", tr: "Bu ifadeler otel girişi yapmanıza, olanaklarla ilgili sorular sormanıza ve otel personeliyle iletişim kurmanıza yardımcı olacaktır. Arap otelleri olağanüstü misafirperverlikleriyle bilinir." }, examples: [
        { arabic: "عندي حجز", transliteration: "'Indi hajz", english: "I have a reservation", turkish: "Rezervasyonum var" },
        { arabic: "أين الحمّام؟", transliteration: "Ayna al-hammam?", english: "Where is the bathroom?", turkish: "Banyo nerede?" },
        { arabic: "هل يوجد واي فاي؟", transliteration: "Hal yujad WiFi?", english: "Is there WiFi?", turkish: "WiFi var mı?" },
        { arabic: "أريد غرفة لشخصين", transliteration: "Ureedu ghurfa li-shakhsayn", english: "I want a room for two", turkish: "İki kişilik oda istiyorum" },
      ] },
      { id: "restaurant", heading: { en: "At the Restaurant", tr: "Restoranda" }, content: { en: "Food is central to Arabic hospitality. These phrases will help you order food and navigate menus with ease. In many Arab restaurants, especially traditional ones, the menu might be entirely in Arabic. Knowing key food vocabulary is incredibly helpful. When you enter a restaurant, the staff will likely greet you with 'Ahlan wa sahlan!' (Welcome!). A common question the waiter will ask is 'شو بتحب تطلب؟' (Shu btihib tutlub? — What would you like to order?). Don't miss the opportunity to try local specialties — ask 'ما هو الطبق المشهور عندكم؟' (Ma huwa at-tabaq al-mashhur 'indakum? — What is your famous dish?).", tr: "Yemek, Arap misafirperverliğinin merkezindedir. Bu ifadeler yemek sipariş etmenize ve menülerde rahatça gezinmenize yardımcı olacaktır." }, examples: [
        { arabic: "القائمة من فضلك", transliteration: "Al-qa'ima min fadlak", english: "The menu, please", turkish: "Menü lütfen" },
        { arabic: "الحساب من فضلك", transliteration: "Al-hisab min fadlak", english: "The bill, please", turkish: "Hesap lütfen" },
        { arabic: "ما هو الطبق المشهور؟", transliteration: "Ma huwa at-tabaq al-mashhur?", english: "What is the famous dish?", turkish: "Meşhur yemeğiniz ne?" },
        { arabic: "كان الأكل لذيذ جداً", transliteration: "Kan al-akl ladheedh jiddan", english: "The food was very delicious", turkish: "Yemek çok lezzetliydi" },
      ] },
      { id: "emergency", heading: { en: "Emergency Phrases", tr: "Acil Durum İfadeleri" }, content: { en: "While we hope you never need these phrases, it's important to know them just in case. Emergency situations can happen anywhere, and being able to communicate basic needs in the local language can make a significant difference. Keep these phrases memorized or saved on your phone for quick access.", tr: "Bu ifadelere hiç ihtiyacınız olmayacağını umuyoruz, ama her ihtimale karşı bilmek önemlidir. Acil durumlar her yerde olabilir ve temel ihtiyaçları yerel dilde iletebilmek büyük fark yaratabilir." }, examples: [
        { arabic: "ساعدوني!", transliteration: "Sa'iduni!", english: "Help me!", turkish: "Yardım edin!" },
        { arabic: "أحتاج طبيب", transliteration: "Ahtaj tabeeb", english: "I need a doctor", turkish: "Doktora ihtiyacım var" },
        { arabic: "أين أقرب مستشفى؟", transliteration: "Ayna aqrab mustashfa?", english: "Where is the nearest hospital?", turkish: "En yakın hastane nerede?" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "How do you say 'Thank you very much' in Arabic?", tr: "Arapça'da 'Çok teşekkürler' nasıl denir?" }, options: ["من فضلك", "شكراً جزيلاً", "السلام عليكم", "عندي حجز"], correctIndex: 1 },
      { type: "fill", question: { en: "___ عليكم (Peace be upon you)", tr: "___ عليكم (Selam üzerinize olsun)" }, answer: "السلام" },
      { type: "mcq", question: { en: "What does 'عندي حجز' mean?", tr: "'عندي حجز' ne anlama gelir?" }, options: ["Where is the hotel?", "I have a reservation", "The bill please", "Thank you"], correctIndex: 1 },
      { type: "fill", question: { en: "أحتاج ___ (I need a doctor)", tr: "أحتاج ___ (Doktora ihtiyacım var)" }, answer: "طبيب" },
      { type: "mcq", question: { en: "What is the proper response to 'السلام عليكم'?", tr: "'السلام عليكم'e doğru yanıt nedir?" }, options: ["شكراً", "عفواً", "وعليكم السلام", "أهلاً"], correctIndex: 2 },
    ],
  },

  {
    slug: "arabic-family-members-vocabulary",
    title: { en: "Arabic Family Members: Learn Family Vocabulary", tr: "Arapça Aile Üyeleri: Aile Kelimelerini Öğrenin" },
    excerpt: { en: "Learn how to say mother, father, brother, sister, and more family words in Arabic.", tr: "Anne, baba, ağabey, kız kardeş ve daha fazla aile kelimesini Arapça olarak öğrenin." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Fatima Khalil",
    date: "2026-01-28",
    image: blogFamilyImg,
    sections: [
      { id: "intro", heading: { en: "Family in Arabic Culture", tr: "Arap Kültüründe Aile" }, content: { en: "Family (عائلة - 'A'ila) is the cornerstone of Arabic culture. Arabic has very specific terms for family relationships — far more detailed than English. Understanding family vocabulary helps you connect with Arabic speakers on a deeper level. In Arab societies, family bonds extend far beyond the nuclear family. The extended family (العائلة الكبيرة - al-'a'ila al-kabeera) plays a central role in daily life, with grandparents, aunts, uncles, and cousins often living nearby or even in the same household. Arabic distinguishes between paternal and maternal relatives — your father's brother (عم - 'amm) has a different name than your mother's brother (خال - khal). This linguistic precision reflects the importance placed on family structure in Arab culture. Even the word for 'cousin' differs based on whether they're from the father's or mother's side, and whether they're male or female.", tr: "Aile (عائلة) Arap kültürünün temel taşıdır. Arapça'da aile ilişkileri için çok özel terimler vardır — İngilizce'den çok daha detaylı. Arap toplumlarında aile bağları çekirdek ailenin çok ötesine uzanır. Arapça baba tarafı ve anne tarafı akrabaları birbirinden ayırır — babanızın kardeşi (عم) ile annenizin kardeşi (خال) farklı isimlere sahiptir." } },
      { id: "immediate", heading: { en: "Immediate Family", tr: "Yakın Aile" }, content: { en: "Let's start with the closest family members — the people you see every day. These are among the first words Arabic children learn. In Arabic, there are also informal/affectionate forms: 'ماما' (mama) and 'بابا' (baba) are used lovingly, just like in many other languages. The formal terms أُم (umm) and أَب (ab) are used in more official or religious contexts.", tr: "En yakın aile üyeleriyle başlayalım — her gün gördüğünüz kişiler. Bunlar Arap çocuklarının öğrendiği ilk kelimeler arasındadır. Gayri resmi/sevgi dolu formlar da vardır: 'ماما' ve 'بابا'." }, examples: [
        { arabic: "أُم / والِدة", transliteration: "Umm / Walida", english: "Mother", turkish: "Anne" },
        { arabic: "أَب / والِد", transliteration: "Ab / Walid", english: "Father", turkish: "Baba" },
        { arabic: "أَخ", transliteration: "Akh", english: "Brother", turkish: "Erkek kardeş" },
        { arabic: "أُخت", transliteration: "Ukht", english: "Sister", turkish: "Kız kardeş" },
        { arabic: "اِبن", transliteration: "Ibn", english: "Son", turkish: "Oğul" },
        { arabic: "بِنت / اِبنة", transliteration: "Bint / Ibna", english: "Daughter", turkish: "Kız" },
      ] },
      { id: "extended", heading: { en: "Extended Family", tr: "Geniş Aile" }, content: { en: "Arabic distinguishes between maternal and paternal relatives, showing the language's attention to family detail. This distinction reflects the social structure of Arab families where the father's side (النسب - an-nasab) and mother's side (الأخوال - al-akhwal) have different social roles and expectations. Understanding these distinctions is not just a linguistic exercise — it's a window into how Arab families are structured and how relationships are valued.", tr: "Arapça anne tarafı ve baba tarafı akrabaları birbirinden ayırır; bu dilin aile detaylarına olan dikkatini gösterir. Bu ayrım, Arap ailelerinin sosyal yapısını yansıtır." }, examples: [
        { arabic: "جَد / جَدّة", transliteration: "Jadd / Jadda", english: "Grandfather / Grandmother", turkish: "Büyükbaba / Büyükanne" },
        { arabic: "عَم / عَمّة", transliteration: "'Amm / 'Amma", english: "Paternal uncle / aunt", turkish: "Amca / Hala" },
        { arabic: "خال / خالة", transliteration: "Khal / Khala", english: "Maternal uncle / aunt", turkish: "Dayı / Teyze" },
        { arabic: "زَوج / زَوجة", transliteration: "Zawj / Zawja", english: "Husband / Wife", turkish: "Koca / Karı" },
      ] },
      { id: "sentences-fam", heading: { en: "Talking About Your Family", tr: "Aileniz Hakkında Konuşma" }, content: { en: "Here are some common sentences you can use when talking about your family. Arabs frequently ask about family as a way of showing interest and building rapport. Don't be surprised if someone you've just met asks about your parents, siblings, and whether you're married. These questions are considered polite and show genuine care. Being able to talk about your family in Arabic will help you form deeper connections.", tr: "Aileniz hakkında konuşurken kullanabileceğiniz bazı yaygın cümleler. Araplar sıklıkla ilgi göstermek ve yakınlık kurmak için aile hakkında sorular sorarlar." }, examples: [
        { arabic: "عندي أخ وأختان", transliteration: "'Indi akh wa ukhtayn", english: "I have a brother and two sisters", turkish: "Bir erkek kardeşim ve iki kız kardeşim var" },
        { arabic: "أمي معلمة وأبي طبيب", transliteration: "Ummi mu'allima wa abi tabeeb", english: "My mother is a teacher and my father is a doctor", turkish: "Annem öğretmen ve babam doktor" },
        { arabic: "عائلتي كبيرة", transliteration: "'A'ilati kabeera", english: "My family is big", turkish: "Ailem büyük" },
        { arabic: "أحب عائلتي كثيراً", transliteration: "Uhibb 'a'ilati katheeran", english: "I love my family very much", turkish: "Ailemi çok seviyorum" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'أُم' mean?", tr: "'أُم' ne anlama gelir?" }, options: ["Father", "Brother", "Mother", "Sister"], correctIndex: 2 },
      { type: "fill", question: { en: "The Arabic word for 'grandfather' is ___", tr: "'Büyükbaba' kelimesinin Arapçası ___" }, answer: "جَد" },
      { type: "mcq", question: { en: "Which word means 'maternal uncle'?", tr: "Hangi kelime 'dayı' anlamına gelir?" }, options: ["عَم", "خال", "أَخ", "أَب"], correctIndex: 1 },
      { type: "mcq", question: { en: "What is the difference between 'عم' and 'خال'?", tr: "'عم' ve 'خال' arasındaki fark nedir?" }, options: ["Age difference", "عم is paternal uncle, خال is maternal uncle", "عم is older, خال is younger", "No difference"], correctIndex: 1 },
      { type: "fill", question: { en: "أحب ___ي كثيراً (I love my family very much)", tr: "أحب ___ي كثيراً (Ailemi çok seviyorum)" }, answer: "عائلت" },
    ],
  },

  {
    slug: "weather-vocabulary-in-arabic",
    title: { en: "Weather Vocabulary in Arabic: Talk About the Weather", tr: "Arapça Hava Durumu Kelimeleri: Hava Hakkında Konuşun" },
    excerpt: { en: "Learn essential Arabic weather words and phrases to describe sunny, rainy, and cold days.", tr: "Güneşli, yağmurlu ve soğuk günleri tanımlamak için temel Arapça hava durumu kelimelerini öğrenin." },
    category: { en: "Everyday Arabic", tr: "Günlük Arapça" },
    author: "Ahmed Nasser",
    date: "2026-01-25",
    image: blogWeatherImg,
    sections: [
      { id: "intro", heading: { en: "Talking About Weather", tr: "Hava Durumu Hakkında Konuşma" }, content: { en: "Weather is a universal conversation topic. In Arabic-speaking regions, weather can vary dramatically — from scorching desert heat exceeding 50°C in the Gulf states to cool Mediterranean breezes in Lebanon, and even snowfall in the Atlas Mountains of Morocco. Knowing weather vocabulary allows you to engage in small talk, understand forecasts, and plan activities. The Arabic word for weather is 'الطقس' (at-taqs) in formal Arabic, and 'الجو' (al-jaw) in colloquial speech. When Arabs discuss weather, they often connect it to daily life: 'The weather is beautiful today, let's have coffee outside!' or 'It's too hot to go out.' Weather talk in Arabic goes beyond simple descriptions — it's a way to connect and plan together.", tr: "Hava durumu evrensel bir sohbet konusudur. Arapça konuşulan bölgelerde hava durumu dramatik bir şekilde değişebilir — Körfez ülkelerinde 50°C'yi aşan çöl sıcağından Lübnan'daki serin Akdeniz esintilerine kadar. Hava durumu kelimelerini bilmek küçük konuşmalar yapmanıza ve etkinlikler planlamanıza olanak tanır." } },
      { id: "conditions", heading: { en: "Weather Conditions", tr: "Hava Koşulları" }, content: { en: "Here are the most common weather conditions you'll encounter in Arabic conversations. Each word is an adjective that describes the state of the weather. In Arabic, you'll often hear these used with the word 'الجو' (al-jaw - the weather/atmosphere): 'الجو حار' (al-jaw harr - the weather is hot). These adjectives agree with the noun they describe in gender, though 'الجو' is masculine, so you'll most often use the masculine forms.", tr: "Arapça konuşmalarda karşılaşacağınız en yaygın hava koşulları. Her kelime hava durumunu tanımlayan bir sıfatttır." }, examples: [
        { arabic: "مُشمِس", transliteration: "Mushmis", english: "Sunny", turkish: "Güneşli" },
        { arabic: "غائِم", transliteration: "Gha'im", english: "Cloudy", turkish: "Bulutlu" },
        { arabic: "مُمطِر", transliteration: "Mumtir", english: "Rainy", turkish: "Yağmurlu" },
        { arabic: "بارِد", transliteration: "Barid", english: "Cold", turkish: "Soğuk" },
        { arabic: "حارّ", transliteration: "Harr", english: "Hot", turkish: "Sıcak" },
        { arabic: "عاصِف", transliteration: "'Asif", english: "Stormy/Windy", turkish: "Fırtınalı" },
      ] },
      { id: "phrases", heading: { en: "Weather Phrases and Conversations", tr: "Hava Durumu İfadeleri ve Konuşmalar" }, content: { en: "Use these complete phrases to talk about the weather in Arabic. These are practical sentences you can use immediately in conversation. Notice how Arabic uses the definite article 'ال' (al-) with weather nouns, which is a common grammatical pattern.", tr: "Arapça hava durumu hakkında konuşmak için bu tam ifadeleri kullanın. Bunlar konuşmada hemen kullanabileceğiniz pratik cümlelerdir." }, examples: [
        { arabic: "الجو حار اليوم", transliteration: "Al-jaw harr al-yawm", english: "The weather is hot today", turkish: "Bugün hava sıcak" },
        { arabic: "هل ستمطر غداً؟", transliteration: "Hal satumtir ghadan?", english: "Will it rain tomorrow?", turkish: "Yarın yağmur yağacak mı?" },
        { arabic: "كيف الطقس في بلدك؟", transliteration: "Kayf at-taqs fi baladak?", english: "How's the weather in your country?", turkish: "Ülkende hava nasıl?" },
        { arabic: "أحب الجو البارد", transliteration: "Uhibb al-jaw al-barid", english: "I love cold weather", turkish: "Soğuk havayı severim" },
      ] },
      { id: "seasons-weather", heading: { en: "Weather Across Seasons", tr: "Mevsimlere Göre Hava" }, content: { en: "Understanding how weather changes across seasons helps you describe and discuss climate in Arabic. The Arab world spans multiple climate zones, from the arid deserts of Saudi Arabia to the temperate coasts of Tunisia. Each season brings its own vocabulary and cultural practices — summer brings conversations about seeking shade and drinking cold beverages, while winter brings discussions about rain, heating, and warm meals.", tr: "Hava durumunun mevsimler boyunca nasıl değiştiğini anlamak, Arapça'da iklimi tanımlamanıza ve tartışmanıza yardımcı olur." }, examples: [
        { arabic: "في الصيف الجو حار جداً", transliteration: "Fi as-sayf al-jaw harr jiddan", english: "In summer the weather is very hot", turkish: "Yazın hava çok sıcak" },
        { arabic: "في الشتاء تمطر كثيراً", transliteration: "Fi ash-shita' tumtir katheeran", english: "In winter it rains a lot", turkish: "Kışın çok yağmur yağar" },
        { arabic: "الربيع أجمل فصل", transliteration: "Ar-rabi' ajmal fasl", english: "Spring is the most beautiful season", turkish: "İlkbahar en güzel mevsim" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'مُشمِس' mean?", tr: "'مُشمِس' ne anlama gelir?" }, options: ["Rainy", "Cloudy", "Sunny", "Cold"], correctIndex: 2 },
      { type: "fill", question: { en: "الجو ___ اليوم (The weather is hot today)", tr: "الجو ___ اليوم (Bugün hava sıcak)" }, answer: "حار" },
      { type: "mcq", question: { en: "Which word means 'cold' in Arabic?", tr: "Arapça'da 'soğuk' hangi kelimedir?" }, options: ["حارّ", "بارِد", "غائِم", "مُمطِر"], correctIndex: 1 },
      { type: "fill", question: { en: "كيف ___  في بلدك؟ (How's the weather in your country?)", tr: "كيف ___ في بلدك؟ (Ülkende hava nasıl?)" }, answer: "الطقس" },
      { type: "mcq", question: { en: "What does 'عاصِف' mean?", tr: "'عاصِف' ne anlama gelir?" }, options: ["Sunny", "Rainy", "Stormy/Windy", "Cloudy"], correctIndex: 2 },
    ],
  },

  {
    slug: "short-duas-for-ramadan",
    title: { en: "10 Short Duas for Ramadan in Arabic and English", tr: "Ramazan İçin Arapça ve İngilizce 10 Kısa Dua" },
    excerpt: { en: "Beautiful and easy-to-memorize duas for the holy month of Ramadan with transliteration.", tr: "Ramazan ayı için ezberlenmesi kolay ve güzel dualar, transliterasyonla birlikte." },
    category: { en: "Arabic Culture", tr: "Arap Kültürü" },
    author: "Layla Hassan",
    date: "2026-01-22",
    image: blogRamadanImg,
    sections: [
      { id: "intro", heading: { en: "The Power of Duas in Ramadan", tr: "Ramazan'da Duaların Gücü" }, content: { en: "Ramadan is the holiest month in Islam, a time for fasting, prayer, and reflection. Duas (supplications) are an integral part of this blessed month. The Arabic word 'دعاء' (du'a') comes from the root 'دعو' meaning 'to call upon' or 'to invite,' reflecting the intimate nature of supplication as a direct conversation with God. During Ramadan, duas hold special significance because it's believed that prayers are more readily accepted during this month. The Prophet Muhammad (peace be upon him) said: 'Three people's prayers are not rejected: the fasting person at the time of breaking the fast, the just leader, and the prayer of the oppressed.' Here are 10 short, powerful duas that are easy to memorize and can be recited throughout Ramadan — at iftar, during night prayers, and in quiet moments of reflection.", tr: "Ramazan, İslam'ın en kutsal ayıdır; oruç tutma, namaz ve düşünme zamanıdır. 'دعاء' kelimesi 'çağırmak' veya 'davet etmek' anlamına gelen kökten gelir. Ramazan'da dualar özel bir öneme sahiptir çünkü bu ayda duaların daha kolay kabul edildiğine inanılır. İşte Ramazan boyunca okunabilecek 10 kısa ve güçlü dua." } },
      { id: "dua-1-3", heading: { en: "Duas 1-3: Forgiveness and Mercy", tr: "Dualar 1-3: Bağışlanma ve Merhamet" }, content: { en: "These duas focus on seeking forgiveness and mercy from Allah. Forgiveness (مغفرة - maghfira) is one of the central themes of Ramadan. The entire month is an opportunity to seek a clean slate and renew one's spiritual commitment. The famous dua of Aisha (may Allah be pleased with her) is especially recommended during the last ten nights of Ramadan, when Laylat al-Qadr (the Night of Power) falls.", tr: "Bu dualar Allah'tan bağışlanma ve merhamet dilemeye odaklanır. Bağışlanma (مغفرة) Ramazan'ın merkezi temalarından biridir. Tüm ay temiz bir sayfa aramak ve kişinin manevi bağlılığını yenilemek için bir fırsattır." }, examples: [
        { arabic: "اللهم إنك عفو تحب العفو فاعف عني", transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni", english: "O Allah, You are forgiving and love forgiveness, so forgive me", turkish: "Allah'ım, Sen affedicisin ve affetmeyi seversin, beni affet" },
        { arabic: "رب اغفر لي وارحمني", transliteration: "Rabbighfir li warhamni", english: "My Lord, forgive me and have mercy on me", turkish: "Rabbim, beni bağışla ve bana merhamet et" },
        { arabic: "اللهم اغفر لي ذنبي كله", transliteration: "Allahumma-ghfir li dhanbi kullahu", english: "O Allah, forgive all my sins", turkish: "Allah'ım, tüm günahlarımı bağışla" },
      ] },
      { id: "dua-4-6", heading: { en: "Duas 4-6: Guidance and Knowledge", tr: "Dualar 4-6: Hidayet ve İlim" }, content: { en: "Express your gratitude and ask for divine guidance with these beautiful supplications. Knowledge ('ilm - علم) is highly valued in Islam, and seeking knowledge is considered a form of worship. The dua 'Rabbi zidni 'ilma' (رب زدني علماً - My Lord, increase me in knowledge) comes directly from the Quran (Surah Ta-Ha, 20:114) and is a prayer that never loses its relevance.", tr: "Bu güzel dualarla şükrünüzü ifade edin ve ilahi hidayet isteyin. İlim (علم) İslam'da çok değerli görülür ve ilim aramak bir ibadet formu olarak kabul edilir." }, examples: [
        { arabic: "اللهم اهدني فيمن هديت", transliteration: "Allahumma-hdini fiman hadayt", english: "O Allah, guide me among those You have guided", turkish: "Allah'ım, hidayet ettiklerinin arasında bana da hidayet et" },
        { arabic: "رب زدني علماً", transliteration: "Rabbi zidni 'ilma", english: "My Lord, increase me in knowledge", turkish: "Rabbim, ilmimi artır" },
        { arabic: "اللهم ارزقني فهم القرآن", transliteration: "Allahumma-rzuqni fahm al-Quran", english: "O Allah, grant me understanding of the Quran", turkish: "Allah'ım, bana Kur'an'ı anlama nasip et" },
      ] },
      { id: "dua-7-10", heading: { en: "Duas 7-10: Protection and Blessings", tr: "Dualar 7-10: Koruma ve Bereket" }, content: { en: "Seek protection and blessings with these essential daily duas. These supplications are not limited to Ramadan — they're recommended for daily use throughout the year. The dua beginning with 'Bismillah' (In the name of God) is recited before eating, before starting any task, and at the beginning of every journey. 'Allahumma barik' (O Allah, bless) is a phrase used to express admiration while seeking God's blessing, especially when praising something or someone to avoid the evil eye.", tr: "Bu temel günlük dualarla koruma ve bereket isteyin. Bu dualar sadece Ramazan'la sınırlı değildir — yıl boyunca günlük kullanım için tavsiye edilir." }, examples: [
        { arabic: "بسم الله الذي لا يضر مع اسمه شيء", transliteration: "Bismillahi-lladhi la yadurru ma'asmihi shay'", english: "In the name of Allah, with whose name nothing can harm", turkish: "Allah'ın adıyla, O'nun adıyla hiçbir şey zarar veremez" },
        { arabic: "اللهم بارك لنا في رمضان", transliteration: "Allahumma barik lana fi Ramadan", english: "O Allah, bless us in Ramadan", turkish: "Allah'ım, Ramazan'da bize bereket ver" },
        { arabic: "اللهم تقبل صيامنا وقيامنا", transliteration: "Allahumma taqabbal siyamana wa qiyamana", english: "O Allah, accept our fasting and prayers", turkish: "Allah'ım, orucumuzu ve namazımızı kabul et" },
        { arabic: "اللهم اجعلنا من عتقاء النار", transliteration: "Allahumma-j'alna min 'utaqa' an-nar", english: "O Allah, make us among those freed from the Fire", turkish: "Allah'ım, bizi cehennemden azat edilenlerden kıl" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'رب زدني علماً' mean?", tr: "'رب زدني علماً' ne anlama gelir?" }, options: ["Forgive me", "Guide me", "Increase me in knowledge", "Protect me"], correctIndex: 2 },
      { type: "fill", question: { en: "اللهم إنك ___ تحب العفو (O Allah, You are forgiving...)", tr: "اللهم إنك ___ تحب العفو (Allah'ım, Sen affedicisin...)" }, answer: "عفو" },
      { type: "mcq", question: { en: "What is the main theme of Ramadan duas?", tr: "Ramazan dualarının ana teması nedir?" }, options: ["Travel", "Forgiveness and guidance", "Food", "Numbers"], correctIndex: 1 },
      { type: "fill", question: { en: "اللهم تقبل ___نا وقيامنا (O Allah, accept our fasting...)", tr: "اللهم تقبل ___نا وقيامنا (Allah'ım, orucumuzu kabul et...)" }, answer: "صيام" },
      { type: "mcq", question: { en: "Which Surah contains the dua 'Rabbi zidni ilma'?", tr: "Hangi sure 'Rabbi zidni ilma' duasını içerir?" }, options: ["Al-Fatiha", "Al-Baqara", "Ta-Ha", "Yasin"], correctIndex: 2 },
    ],
  },

  {
    slug: "arabic-animal-names",
    title: { en: "Learn Animal Names in Arabic: A Fun Vocabulary Lesson", tr: "Arapça Hayvan İsimlerini Öğrenin: Eğlenceli Bir Kelime Dersi" },
    excerpt: { en: "From cats to camels — learn the Arabic names of common animals with pronunciation.", tr: "Kedilerden develere — yaygın hayvanların Arapça isimlerini telaffuzla öğrenin." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Ahmed Nasser",
    date: "2026-01-20",
    image: blogAnimalsImg,
    sections: [
      { id: "intro", heading: { en: "Animals in Arabic Culture", tr: "Arap Kültüründe Hayvanlar" }, content: { en: "Animals (حيوانات - Hayawanat) are a fun and practical vocabulary topic. Arabic has rich words for animals, many of which appear in proverbs, stories, and everyday expressions. The camel (جمل - jamal), in particular, holds an almost sacred place in Arabic culture — there are reportedly over 100 different words for camels in Arabic, each describing a different age, color, or characteristic. The Arabic language's relationship with animals goes back to pre-Islamic poetry (الشعر الجاهلي - ash-shi'r al-jahili), where poets would describe desert animals in vivid detail. Even today, animal names appear in common Arabic names: 'أسد' (Asad - lion) is a popular boy's name, and the Prophet's uncle was named 'حمزة' (Hamza), which relates to a lion. Learning animal vocabulary is both practical for daily life and enriching for cultural understanding.", tr: "Hayvanlar (حيوانات) eğlenceli ve pratik bir kelime konusudur. Arapça'da hayvanlar için zengin kelimeler vardır, birçoğu atasözlerinde, hikayelerde ve günlük ifadelerde görülür. Deve (جمل) Arap kültüründe neredeyse kutsal bir yere sahiptir — Arapça'da develeri tanımlayan 100'den fazla farklı kelime olduğu bildirilmektedir." } },
      { id: "pets", heading: { en: "Domestic Animals & Pets", tr: "Evcil Hayvanlar" }, content: { en: "These are the animals you'll most commonly encounter in homes and neighborhoods across the Arab world. Cats (قطط - qitat) are especially beloved in Arab and Islamic culture — the Prophet Muhammad is reported to have said 'Cats are not impure; they are among those who go around among you.' You'll see cats everywhere in Arab cities, often cared for by local residents. Dogs, while kept as pets in some households, have a more complex cultural status. Farm animals like chickens, sheep, and goats are still common in rural areas and play a vital role in Arab cuisine and traditions.", tr: "Arap dünyasında evlerde ve mahallelerde en sık karşılaşacağınız hayvanlar. Kediler (قطط) Arap ve İslam kültüründe özellikle sevilir. Arap şehirlerinde her yerde kediler görürsünüz." }, examples: [
        { arabic: "قِطّة / قِطّ", transliteration: "Qitta / Qitt", english: "Cat (f/m)", turkish: "Kedi" },
        { arabic: "كَلب", transliteration: "Kalb", english: "Dog", turkish: "Köpek" },
        { arabic: "حِصان / فَرَس", transliteration: "Hisan / Faras", english: "Horse (m/f)", turkish: "At" },
        { arabic: "دَجاجة", transliteration: "Dajaja", english: "Chicken", turkish: "Tavuk" },
        { arabic: "خَروف", transliteration: "Kharuf", english: "Sheep/Lamb", turkish: "Koyun/Kuzu" },
      ] },
      { id: "wild", heading: { en: "Wild & Desert Animals", tr: "Vahşi ve Çöl Hayvanları" }, content: { en: "The Arab world is famous for its desert wildlife. The camel, in particular, holds a special place in Arabic culture and language — it's called 'ship of the desert' (سفينة الصحراء - safinat as-sahra') for its ability to traverse vast sand dunes. The Arabian horse (الحصان العربي - al-hisan al-'arabi) is world-renowned for its beauty, endurance, and intelligence. Falconry (الصقارة - as-saqara) using falcons (صقور - suqur) is a prestigious traditional sport in the Gulf states. Lions, while no longer found in the wild in most Arab countries, remain powerful symbols of strength and courage in Arabic culture.", tr: "Arap dünyası çöl vahşi yaşamıyla ünlüdür. Deve özellikle 'çölün gemisi' (سفينة الصحراء) olarak adlandırılır. Arap atı güzelliği, dayanıklılığı ve zekasıyla dünyaca ünlüdür." }, examples: [
        { arabic: "جَمَل", transliteration: "Jamal", english: "Camel", turkish: "Deve" },
        { arabic: "أَسَد", transliteration: "Asad", english: "Lion", turkish: "Aslan" },
        { arabic: "طائِر", transliteration: "Ta'ir", english: "Bird", turkish: "Kuş" },
        { arabic: "سَمَكة", transliteration: "Samaka", english: "Fish", turkish: "Balık" },
        { arabic: "صَقر", transliteration: "Saqr", english: "Falcon", turkish: "Şahin" },
        { arabic: "غَزال", transliteration: "Ghazal", english: "Gazelle/Deer", turkish: "Ceylan" },
      ] },
      { id: "animal-proverbs", heading: { en: "Animals in Arabic Proverbs", tr: "Arapça Atasözlerinde Hayvanlar" }, content: { en: "Animals appear frequently in Arabic proverbs and idioms, reflecting their importance in the culture. Here are some popular animal-related proverbs that you can use in conversation to sound more natural and culturally aware.", tr: "Hayvanlar Arapça atasözlerinde ve deyimlerde sıkça görülür, bu da kültürdeki önemlerini yansıtır." }, examples: [
        { arabic: "القرد في عين أمه غزال", transliteration: "Al-qird fi 'ayn ummihi ghazal", english: "The monkey in its mother's eye is a gazelle (beauty is in the eye of the beholder)", turkish: "Maymun annesinin gözünde ceylandır" },
        { arabic: "الجمل لا يرى حدبته", transliteration: "Al-jamal la yara hadabatahu", english: "The camel doesn't see its own hump", turkish: "Deve kendi kamburunu görmez" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What is the Arabic word for 'camel'?", tr: "'Deve'nin Arapçası nedir?" }, options: ["أَسَد", "جَمَل", "حِصان", "كَلب"], correctIndex: 1 },
      { type: "fill", question: { en: "The Arabic word for 'cat' is ___", tr: "'Kedi'nin Arapçası ___" }, answer: "قِطّة" },
      { type: "mcq", question: { en: "What does 'أَسَد' mean?", tr: "'أَسَد' ne anlama gelir?" }, options: ["Bird", "Fish", "Lion", "Horse"], correctIndex: 2 },
      { type: "mcq", question: { en: "What is a 'صَقر' (saqr)?", tr: "'صَقر' nedir?" }, options: ["Eagle", "Falcon", "Parrot", "Owl"], correctIndex: 1 },
      { type: "fill", question: { en: "The camel is called 'ship of the ___' in Arabic", tr: "Deve, Arapça'da '___'ın gemisi' olarak adlandırılır" }, answer: "desert" },
    ],
  },

  {
    slug: "body-parts-in-arabic",
    title: { en: "Body Parts in Arabic: Essential Vocabulary", tr: "Arapça Vücut Bölümleri: Temel Kelimeler" },
    excerpt: { en: "Learn the names of body parts in Arabic — essential for health, fitness, and everyday conversations.", tr: "Arapça vücut bölümlerinin isimlerini öğrenin — sağlık ve günlük konuşmalar için temel bilgi." },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Fatima Khalil",
    date: "2026-01-18",
    image: blogAnimalsImg,
    sections: [
      { id: "intro", heading: { en: "Why Learn Body Parts?", tr: "Neden Vücut Bölümlerini Öğrenmeliyiz?" }, content: { en: "Knowing body part vocabulary is crucial for medical situations, describing people, and understanding common Arabic expressions. Many Arabic idioms use body part words — 'عيني' ('ayni - my eye) is used as a term of endearment, 'على راسي' ('ala rasi - on my head) means 'I'd be honored to do it,' and 'يدي ويدك' (yadi wa yadak - my hand and your hand) means 'let's work together.' The Arabic word for body is 'جسم' (jism) or 'جسد' (jasad). Body parts are among the most ancient words in any language, and Arabic body vocabulary reveals interesting cultural perspectives. For example, the word for 'heart' (قلب - qalb) is associated with intelligence and understanding in Arabic culture, not just emotions.", tr: "Vücut bölümleri kelimelerini bilmek tıbbi durumlar, insanları tanımlama ve yaygın Arapça ifadeleri anlama için çok önemlidir. Birçok Arapça deyim vücut bölümü kelimelerini kullanır. 'قلب' (kalp) Arap kültüründe sadece duygularla değil, zeka ve anlayışla da ilişkilendirilir." } },
      { id: "head", heading: { en: "Head & Face", tr: "Baş ve Yüz" }, content: { en: "Let's start with the head (رأس - ra's) and facial features — these words come up frequently in descriptions, medical contexts, and everyday expressions. The face (وجه - wajh) holds special significance in Arabic culture — 'saving face' (حفظ ماء الوجه - hifz ma' al-wajh) is an important social concept. The word 'عين' ('ayn - eye) is one of the most used body parts in Arabic idioms: 'عين الحسود فيها عود' ('ayn al-hasud fiha 'ud - the envious eye has a stick in it) warns against the evil eye.", tr: "Baş (رأس) ve yüz özellikleriyle başlayalım — bu kelimeler tanımlarda, tıbbi bağlamlarda ve günlük ifadelerde sıkça kullanılır. Yüz (وجه) Arap kültüründe özel bir öneme sahiptir." }, examples: [
        { arabic: "رَأس", transliteration: "Ra's", english: "Head", turkish: "Baş" },
        { arabic: "عَين / عُيون", transliteration: "'Ayn / 'Uyun", english: "Eye / Eyes", turkish: "Göz / Gözler" },
        { arabic: "أَنف", transliteration: "Anf", english: "Nose", turkish: "Burun" },
        { arabic: "فَم", transliteration: "Fam", english: "Mouth", turkish: "Ağız" },
        { arabic: "أُذُن", transliteration: "Udhun", english: "Ear", turkish: "Kulak" },
        { arabic: "شَعر", transliteration: "Sha'r", english: "Hair", turkish: "Saç" },
      ] },
      { id: "body", heading: { en: "Upper & Lower Body", tr: "Üst ve Alt Vücut" }, content: { en: "These body parts are essential for everyday communication, especially when visiting a doctor or describing physical activities. The word 'يد' (yad - hand) is one of the most commonly used body parts in Arabic expressions. 'القلب' (al-qalb - the heart) is the center of emotion, wisdom, and faith in Arabic thought — when someone says 'من كل قلبي' (min kull qalbi - from all my heart), they express the deepest sincerity.", tr: "Bu vücut bölümleri, özellikle doktora giderken veya fiziksel aktiviteleri tanımlarken günlük iletişim için çok önemlidir. 'يد' (el) Arapça ifadelerde en çok kullanılan vücut bölümlerinden biridir." }, examples: [
        { arabic: "يَد / يَدَين", transliteration: "Yad / Yadayn", english: "Hand / Two hands", turkish: "El / İki el" },
        { arabic: "قَدَم / أَقدام", transliteration: "Qadam / Aqdam", english: "Foot / Feet", turkish: "Ayak / Ayaklar" },
        { arabic: "قَلب", transliteration: "Qalb", english: "Heart", turkish: "Kalp" },
        { arabic: "ظَهر", transliteration: "Dhahr", english: "Back", turkish: "Sırt" },
        { arabic: "بَطن", transliteration: "Batn", english: "Stomach/Belly", turkish: "Karın" },
        { arabic: "رُكبة", transliteration: "Rukba", english: "Knee", turkish: "Diz" },
      ] },
      { id: "doctor-phrases", heading: { en: "At the Doctor: Using Body Vocabulary", tr: "Doktorda: Vücut Kelimelerini Kullanma" }, content: { en: "When visiting a doctor in an Arabic-speaking country, knowing body part vocabulary becomes invaluable. Here are practical phrases that combine body parts with common medical situations. Being able to point to a body part and describe pain or discomfort in Arabic can make a medical visit much smoother and more effective.", tr: "Arapça konuşulan bir ülkede doktoru ziyaret ederken vücut bölümü kelimelerini bilmek paha biçilmez hale gelir. İşte vücut bölümlerini yaygın tıbbi durumlarla birleştiren pratik ifadeler." }, examples: [
        { arabic: "رأسي يؤلمني", transliteration: "Ra'si yu'limuni", english: "My head hurts", turkish: "Başım ağrıyor" },
        { arabic: "عندي ألم في الظهر", transliteration: "'Indi alam fi adh-dhahr", english: "I have back pain", turkish: "Sırt ağrım var" },
        { arabic: "لا أستطيع تحريك يدي", transliteration: "La astati' tahreek yadi", english: "I can't move my hand", turkish: "Elimi hareket ettiremiyorum" },
      ] },
    ],
    questions: [
      { type: "mcq", question: { en: "What does 'عَين' mean?", tr: "'عَين' ne anlama gelir?" }, options: ["Nose", "Eye", "Mouth", "Head"], correctIndex: 1 },
      { type: "fill", question: { en: "The Arabic word for 'heart' is ___", tr: "'Kalp'in Arapçası ___" }, answer: "قَلب" },
      { type: "mcq", question: { en: "Which word means 'hand' in Arabic?", tr: "Arapça'da 'el' hangi kelimedir?" }, options: ["قَدَم", "رَأس", "يَد", "فَم"], correctIndex: 2 },
      { type: "fill", question: { en: "رأسي ___ (My head hurts)", tr: "رأسي ___ (Başım ağrıyor)" }, answer: "يؤلمني" },
      { type: "mcq", question: { en: "What body part is 'أُذُن'?", tr: "'أُذُن' hangi vücut bölümüdür?" }, options: ["Eye", "Nose", "Ear", "Mouth"], correctIndex: 2 },
    ],
  },
];

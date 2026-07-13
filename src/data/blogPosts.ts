export interface BlogExample {
  arabic: string;
  transliteration: string;
  english: string;
  turkish: string;
}

export interface BlogQuestion {
  type: "mcq" | "match" | "fill";
  question: { en: string; tr: string };
  options?: string[];
  correctIndex?: number;
  answer?: string;
  pairs?: { left: string; right: string }[];
}

export interface BlogSection {
  id: string;
  heading: { en: string; tr: string };
  content: { en: string; tr: string };
  examples?: BlogExample[];
}

export interface BlogPost {
  slug: string;
  title: { en: string; tr: string };
  excerpt: { en: string; tr: string };
  category: { en: string; tr: string };
  author: string;
  date: string;
  image: string;
  sections: BlogSection[];
  questions: BlogQuestion[];
}

import blogGreetingsImg from "@/assets/blog-greetings.jpg";
import blogAlphabetImg from "@/assets/blog-alphabet.jpg";
import blogFoodImg from "@/assets/blog-food.jpg";
import { blogPostsBatch2 } from "./blogPostsBatch2";
import { blogPostsBatch3 } from "./blogPostsBatch3";

const originalPosts: BlogPost[] = [
  {
    slug: "ways-to-say-ok-in-arabic",
    title: {
      en: "Ways to Say OK in Arabic: Everyday Expressions",
      tr: "Arapça'da Tamam Demenin Yolları: Günlük İfadeler",
    },
    excerpt: {
      en: "Discover the many ways Arabs express agreement in daily conversations, from formal to casual.",
      tr: "Arapların günlük konuşmalarda onaylarını ifade etmenin birçok yolunu keşfedin.",
    },
    category: { en: "Everyday Arabic", tr: "Günlük Arapça" },
    author: "Youssef Al-Masri",
    date: "2026-02-28",
    image: blogGreetingsImg,
    sections: [
      {
        id: "intro",
        heading: { en: "Introduction", tr: "Giriş" },
        content: {
          en: "In Arabic, there are many ways to say 'OK' or express agreement. Just like in English, the word you choose depends on the context — whether you're speaking formally, casually, or somewhere in between. Arabic is a rich language with regional dialects, meaning the same concept can be expressed differently depending on whether you're in Egypt, the Levant, the Gulf, or North Africa. Understanding these variations is not just about vocabulary — it's about understanding Arab culture itself. When an Arab speaker says 'Tayeb,' they convey warmth; when they say 'Mashi,' it's relaxed and easygoing. Let's explore the most common expressions used across the Arab world and learn when and how to use each one effectively.",
          tr: "Arapça'da 'tamam' demenin veya onay ifade etmenin birçok yolu vardır. Tıpkı Türkçe'de olduğu gibi, seçtiğiniz kelime bağlama bağlıdır — resmi, gündelik veya ikisinin arasında. Arapça, bölgesel lehçeleriyle zengin bir dildir, yani aynı kavram Mısır'da, Levant'ta, Körfez'de veya Kuzey Afrika'da farklı şekillerde ifade edilebilir. Bu varyasyonları anlamak sadece kelime bilgisiyle ilgili değil — Arap kültürünü anlamakla ilgilidir. Arap dünyasında en çok kullanılan ifadeleri keşfedelim ve her birini ne zaman ve nasıl etkili bir şekilde kullanacağımızı öğrenelim.",
        },
      },
      {
        id: "tayeb",
        heading: { en: "Tayeb (طيب) — The Classic OK", tr: "Tayeb (طيب) — Klasik Tamam" },
        content: {
          en: "'Tayeb' is one of the most widely used words for 'OK' in Arabic. It literally means 'good' or 'fine' and is used in everyday conversations across the Middle East. You can use it to acknowledge something, agree to a plan, or simply respond to a statement. In Levantine Arabic (spoken in Syria, Lebanon, Jordan, and Palestine), 'Tayeb' is the go-to word for casual agreement. It's also commonly used as a conversation filler, similar to how English speakers might say 'alright' or 'so.' In formal settings, 'Tayeb' carries a slightly warmer, more personal tone compared to its formal equivalents. You'll hear it used by shopkeepers, taxi drivers, friends, and family members alike. The beauty of 'Tayeb' lies in its versatility — it works in almost any situation where you want to express simple agreement or acknowledgment without being overly formal.",
          tr: "'Tayeb', Arapça'da 'tamam' için en yaygın kullanılan kelimelerden biridir. Kelime anlamı 'iyi' veya 'güzel'dir ve Ortadoğu genelinde günlük konuşmalarda kullanılır. Bir şeyi kabul etmek, bir plana razı olmak veya basitçe bir ifadeye yanıt vermek için kullanabilirsiniz. Levant Arapçasında (Suriye, Lübnan, Ürdün ve Filistin'de konuşulan) 'Tayeb' gündelik anlaşma için başvurulan kelimedir. 'Tayeb'in güzelliği çok yönlülüğünde yatar — basit bir anlaşma veya kabul ifade etmek istediğiniz hemen her durumda işe yarar.",
        },
        examples: [
          { arabic: "طيب، خلاص", transliteration: "Tayeb, khalas", english: "OK, done", turkish: "Tamam, bitti" },
          { arabic: "طيب، ماشي", transliteration: "Tayeb, mashi", english: "OK, alright", turkish: "Tamam, olur" },
          { arabic: "طيب، بكرة إن شاء الله", transliteration: "Tayeb, bukra in sha Allah", english: "OK, tomorrow God willing", turkish: "Tamam, yarın inşallah" },
          { arabic: "طيب، أنا موافق", transliteration: "Tayeb, ana muwafiq", english: "OK, I agree", turkish: "Tamam, katılıyorum" },
        ],
      },
      {
        id: "mashi",
        heading: { en: "Mashi (ماشي) — Sure, No Problem", tr: "Mashi (ماشي) — Tabii, Sorun Yok" },
        content: {
          en: "'Mashi' literally means 'walking' but is used colloquially to mean 'OK', 'sure', or 'no problem'. It's very casual and commonly heard in Egyptian and Levantine Arabic. In Egypt, 'Mashi' is perhaps the most popular way to express casual agreement. When someone suggests a plan and you respond with 'Mashi,' it signals that you're easygoing and flexible. The word carries a sense of relaxation and informality. It's worth noting that 'Mashi' can sometimes be used somewhat dismissively — if someone is complaining and you respond with just 'Mashi,' it might come across as if you're brushing them off. Context and tone are everything in Arabic, just like in any language. 'Mashi el-hal' is a common phrase meaning 'everything is going fine' or 'things are okay,' often used as a response to 'How are you?' It's a wonderfully expressive phrase that captures the Egyptian spirit of taking things as they come.",
          tr: "'Mashi' kelime anlamı 'yürüyen' demektir ama günlük konuşmada 'tamam', 'tabii' veya 'sorun yok' anlamında kullanılır. Çok gündelik bir ifadedir ve özellikle Mısır ve Levant Arapçasında yaygındır. Mısır'da 'Mashi' belki de gündelik anlaşmayı ifade etmenin en popüler yoludur. Birisi bir plan önerdiğinde 'Mashi' ile yanıt verirseniz rahat ve esnek olduğunuzu gösterir. 'Mashi el-hal' 'her şey yolunda' anlamına gelen yaygın bir ifadedir.",
        },
        examples: [
          { arabic: "ماشي الحال", transliteration: "Mashi el-hal", english: "Everything is fine", turkish: "Her şey yolunda" },
          { arabic: "ماشي، نتقابل الساعة خمسة", transliteration: "Mashi, nitqa'bil as-sa'a khamsa", english: "Sure, let's meet at five", turkish: "Tabii, saat beşte buluşalım" },
          { arabic: "الأمور ماشية", transliteration: "Al-umur mashya", english: "Things are going well", turkish: "İşler yolunda gidiyor" },
        ],
      },
      {
        id: "inshallah",
        heading: { en: "In Sha Allah (إن شاء الله) — God Willing", tr: "İnşallah (إن شاء الله) — Allah İsterse" },
        content: {
          en: "While 'In Sha Allah' literally means 'God willing', it is commonly used as a soft 'OK' or 'hopefully'. When someone asks if you can do something, replying with 'In Sha Allah' shows agreement with a hopeful tone. This phrase is deeply embedded in Arabic and Islamic culture. It acknowledges that the future is in God's hands while simultaneously expressing one's intention to do something. However, learners should be aware of its dual nature — sometimes 'In Sha Allah' is used genuinely to express hope, and sometimes it's used as a polite way of saying 'maybe' or even 'probably not.' The tone and context will tell you which meaning is intended. In formal and professional contexts, 'In Sha Allah' is perfectly appropriate and shows cultural awareness. It's one of those Arabic phrases that has transcended language barriers and is understood in many parts of the world.",
          tr: "'İnşallah' kelime anlamı 'Allah isterse' demektir, ancak yumuşak bir 'tamam' veya 'inşallah' olarak yaygın şekilde kullanılır. Bu ifade Arap ve İslam kültürüne derinden gömülüdür. Geleceğin Allah'ın elinde olduğunu kabul ederken aynı zamanda bir şeyi yapma niyetini ifade eder. Ancak öğrenciler ikili doğasının farkında olmalıdır — bazen gerçekten umut ifade etmek için, bazen de 'belki' ve hatta 'muhtemelen hayır' demenin kibar bir yolu olarak kullanılır.",
        },
        examples: [
          { arabic: "إن شاء الله بكرة", transliteration: "In sha Allah bukra", english: "God willing, tomorrow", turkish: "İnşallah yarın" },
          { arabic: "إن شاء الله كل شيء يكون تمام", transliteration: "In sha Allah kull shay'a yakun tamam", english: "God willing, everything will be fine", turkish: "İnşallah her şey iyi olacak" },
          { arabic: "سأحضر إن شاء الله", transliteration: "Sa'ahdar in sha Allah", english: "I will attend, God willing", turkish: "Katılacağım inşallah" },
        ],
      },
      {
        id: "khalas",
        heading: { en: "Khalas (خلاص) — That's It, Done!", tr: "Khalas (خلاص) — Bu Kadar, Bitti!" },
        content: {
          en: "'Khalas' is a powerful word meaning 'done,' 'enough,' 'that's it,' or 'finished.' It's used across the entire Arab world and carries a sense of finality. When you want to end a discussion, confirm a decision, or express that something is complete, 'Khalas' is the word you need. It can be used gently ('Khalas, don't worry about it') or firmly ('Khalas! I said no!'). In everyday life, you'll hear 'Khalas' in restaurants when someone has had enough food, in negotiations when a price is agreed upon, or between friends when wrapping up a conversation. It's one of the most satisfying Arabic words to use because of its definitive nature. Once you say 'Khalas,' the matter is considered closed.",
          tr: "'Khalas' 'bitti', 'yeter', 'bu kadar' veya 'tamamlandı' anlamına gelen güçlü bir kelimedir. Tüm Arap dünyasında kullanılır ve kesinlik duygusu taşır. Bir tartışmayı sonlandırmak, bir kararı onaylamak veya bir şeyin tamamlandığını ifade etmek istediğinizde 'Khalas' ihtiyacınız olan kelimedir. Nazikçe veya kararlı bir şekilde kullanılabilir. 'Khalas' dedikten sonra konu kapatılmış sayılır.",
        },
        examples: [
          { arabic: "خلاص، انتهينا", transliteration: "Khalas, intahayna", english: "Done, we're finished", turkish: "Bitti, bitirdik" },
          { arabic: "خلاص، لا تقلق", transliteration: "Khalas, la taqlaq", english: "Enough, don't worry", turkish: "Yeter, endişelenme" },
          { arabic: "خلاص، متفقين", transliteration: "Khalas, muttafiqeen", english: "Done, we agree", turkish: "Tamam, anlaştık" },
        ],
      },
      {
        id: "tabaan",
        heading: { en: "Tab'an (طبعاً) — Of Course!", tr: "Tab'an (طبعاً) — Tabii ki!" },
        content: {
          en: "'Tab'an' means 'of course' or 'naturally' and is used when agreeing enthusiastically. Unlike the neutral 'Tayeb,' 'Tab'an' conveys enthusiasm and certainty. It's derived from the Arabic root for 'nature,' implying that the agreement is natural and obvious. You'll hear it in both formal and informal settings. When someone asks if you'd like to join them for dinner, responding with 'Tab'an!' shows that you're genuinely happy to accept. It's warmer than a simple 'yes' and shows more engagement than 'Mashi.' In professional contexts, 'Tab'an' can be used to agree to a request while showing willingness and good spirit. It's a word that instantly puts people at ease.",
          tr: "'Tab'an' 'tabii ki' veya 'doğal olarak' anlamına gelir ve coşkuyla kabul ederken kullanılır. Nötr olan 'Tayeb'in aksine, 'Tab'an' coşku ve kesinlik taşır. 'Doğa' anlamındaki Arapça kökten türetilmiştir, anlaşmanın doğal ve açık olduğunu ima eder. Hem resmi hem de gayri resmi ortamlarda duyabilirsiniz.",
        },
        examples: [
          { arabic: "طبعاً، بكل سرور", transliteration: "Tab'an, bikull surur", english: "Of course, with pleasure", turkish: "Tabii ki, memnuniyetle" },
          { arabic: "طبعاً أساعدك", transliteration: "Tab'an asa'dak", english: "Of course I'll help you", turkish: "Tabii ki sana yardım ederim" },
        ],
      },
    ],
    questions: [
      {
        type: "mcq",
        question: { en: "Which word literally means 'walking' but is used to say 'OK'?", tr: "Hangi kelime 'yürüyen' anlamına gelir ama 'tamam' demek için kullanılır?" },
        options: ["طيب", "ماشي", "إن شاء الله", "خلاص"],
        correctIndex: 1,
      },
      {
        type: "fill",
        question: { en: "Complete: طيب، ___ (OK, done)", tr: "Tamamlayın: طيب، ___ (Tamam, bitti)" },
        answer: "خلاص",
      },
      {
        type: "mcq",
        question: { en: "What does 'إن شاء الله' literally mean?", tr: "'إن شاء الله' kelime anlamı nedir?" },
        options: ["No problem", "God willing", "Of course", "Let's go"],
        correctIndex: 1,
      },
      {
        type: "mcq",
        question: { en: "Which expression means 'of course' and shows enthusiasm?", tr: "Hangi ifade 'tabii ki' anlamına gelir ve coşku gösterir?" },
        options: ["خلاص", "ماشي", "طبعاً", "طيب"],
        correctIndex: 2,
      },
      {
        type: "fill",
        question: { en: "___ الحال means 'Everything is fine'", tr: "___ الحال 'Her şey yolunda' demektir" },
        answer: "ماشي",
      },
    ],
  },
  {
    slug: "learn-arabic-alphabet-letter-yaa",
    title: {
      en: "Learn the Arabic Alphabet: Letter Yaa (ي)",
      tr: "Arap Alfabesini Öğrenin: Yaa Harfi (ي)",
    },
    excerpt: {
      en: "Master the letter Yaa — its forms, pronunciation, and how it appears in common Arabic words.",
      tr: "Yaa harfini öğrenin — biçimleri, telaffuzu ve yaygın Arapça kelimelerde nasıl göründüğünü keşfedin.",
    },
    category: { en: "Arabic Basics", tr: "Arapça Temeller" },
    author: "Fatima Khalil",
    date: "2026-02-20",
    image: blogAlphabetImg,
    sections: [
      {
        id: "intro",
        heading: { en: "Introduction to Yaa", tr: "Yaa Harfine Giriş" },
        content: {
          en: "Yaa (ي) is the 28th and last letter of the Arabic alphabet. It is one of the most versatile letters, serving as both a consonant (like the English 'Y') and a long vowel (like 'ee' in 'see'). Understanding Yaa is essential for reading and writing Arabic fluently. Yaa belongs to a special group of Arabic letters called 'huruf al-illa' (حروف العلة), meaning weak letters or vowel letters. These letters (Alif, Waw, and Yaa) form the backbone of Arabic vowel sounds and appear in nearly every Arabic word. As the final letter of the alphabet, Yaa holds a symbolic place in Arabic culture — mastering it means you've completed the journey through the entire alphabet. In calligraphy, Yaa is admired for its elegant curve that sweeps below the baseline, making it one of the most aesthetically pleasing letters to write.",
          tr: "Yaa (ي) Arap alfabesinin 28. ve son harfidir. Hem ünsüz (Türkçe'deki 'Y' gibi) hem de uzun ünlü ('i' sesi gibi) olarak kullanılan en çok yönlü harflerden biridir. Yaa, 'huruf al-illa' (حروف العلة) adı verilen özel bir gruba aittir; bu zayıf harfler veya sesli harf harfleridir. Bu harfler (Elif, Vav ve Yaa) Arapça sesli ses sisteminin omurgasını oluşturur. Kaligrafi'de Yaa, taban çizgisinin altına doğru süzülen zarif eğrisiyle beğenilir.",
        },
      },
      {
        id: "forms",
        heading: { en: "Forms of Yaa in Words", tr: "Kelimelerde Yaa'nın Biçimleri" },
        content: {
          en: "Like most Arabic letters, Yaa changes shape depending on its position in a word. In the initial position it looks like (يـ), in the medial position (ـيـ), in the final connected form (ـي), and in the isolated form (ي). Practice recognizing each form to improve your reading speed. The initial form of Yaa starts with a small curve and extends to the right to connect with the next letter. The medial form sits on the baseline with connections on both sides. The final form features the distinctive downward sweep that makes Yaa recognizable. In Egyptian Arabic writing, the final Yaa is often written without its two dots, which can be confusing for beginners. However, in Modern Standard Arabic (MSA) and in print, the dots are always present. Understanding these positional changes is crucial because Arabic is a cursive script — letters flow into each other, and their shapes change based on where they appear in a word.",
          tr: "Çoğu Arap harfi gibi, Yaa da kelimedeki konumuna göre şekil değiştirir. Başta (يـ), ortada (ـيـ), sonda bağlı (ـي) ve tek başına (ي) olarak yazılır. Her biçimi tanıma pratiği yaparak okuma hızınızı artırabilirsiniz. Mısır Arapçası yazısında, son Yaa genellikle iki noktası olmadan yazılır, bu da başlangıç seviyesindekiler için kafa karıştırıcı olabilir.",
        },
        examples: [
          { arabic: "يد", transliteration: "Yad", english: "Hand", turkish: "El" },
          { arabic: "يوم", transliteration: "Yawm", english: "Day", turkish: "Gün" },
          { arabic: "يمين", transliteration: "Yameen", english: "Right (direction)", turkish: "Sağ (yön)" },
          { arabic: "يقرأ", transliteration: "Yaqra'", english: "He reads", turkish: "Okuyor" },
        ],
      },
      {
        id: "consonant",
        heading: { en: "Yaa as a Consonant", tr: "Ünsüz Olarak Yaa" },
        content: {
          en: "When Yaa appears at the beginning of a word, it almost always functions as a consonant, producing the 'Y' sound. This is similar to the English 'Y' in words like 'yes' or 'year.' In Arabic grammar, many verb forms begin with Yaa, especially in the present tense. For example, the prefix 'يـ' (ya-) is added to verb roots to indicate the third person masculine singular in the present tense: 'يكتب' (yaktub - he writes), 'يلعب' (yal'ab - he plays), 'يسمع' (yasma' - he hears). This pattern is so consistent that once you recognize it, you can identify hundreds of Arabic verbs instantly. Practicing words that begin with Yaa is an excellent way to build your verb vocabulary.",
          tr: "Yaa bir kelimenin başında göründüğünde, neredeyse her zaman bir ünsüz olarak işlev görür ve 'Y' sesini üretir. Arapça dilbilgisinde birçok fiil formu Yaa ile başlar, özellikle şimdiki zamanda. Örneğin, 'يـ' (ya-) ön eki, şimdiki zamanda üçüncü tekil eril kişiyi belirtmek için fiil köklerine eklenir. Bu kalıp o kadar tutarlıdır ki, bir kez tanıdığınızda yüzlerce Arapça fiili anında tanıyabilirsiniz.",
        },
        examples: [
          { arabic: "يكتب", transliteration: "Yaktub", english: "He writes", turkish: "Yazıyor" },
          { arabic: "يلعب", transliteration: "Yal'ab", english: "He plays", turkish: "Oynuyor" },
          { arabic: "يسمع", transliteration: "Yasma'", english: "He hears", turkish: "Duyuyor" },
        ],
      },
      {
        id: "vowel",
        heading: { en: "Yaa as a Long Vowel", tr: "Uzun Ünlü Olarak Yaa" },
        content: {
          en: "When Yaa appears in the middle or end of a word without a vowel mark (sukun), it often serves as a long 'ee' sound, similar to the vowel in 'see,' 'tree,' or 'free.' This long vowel function is essential for proper Arabic pronunciation. Many common Arabic words use Yaa as a long vowel: 'كبير' (kabeer - big), 'صغير' (sagheer - small), 'جميل' (jameel - beautiful). Notice how the 'ee' sound created by Yaa gives these words their characteristic rhythm. The distinction between Yaa as a consonant and Yaa as a vowel is one of the trickier aspects of Arabic for beginners, but with practice, it becomes second nature.",
          tr: "Yaa bir kelimenin ortasında veya sonunda sesli işaret (sükun) olmadan göründüğünde, genellikle uzun 'ii' sesi olarak işlev görür. Bu uzun ünlü işlevi doğru Arapça telaffuz için çok önemlidir. Birçok yaygın Arapça kelime Yaa'yı uzun ünlü olarak kullanır.",
        },
        examples: [
          { arabic: "كبير", transliteration: "Kabeer", english: "Big", turkish: "Büyük" },
          { arabic: "جميل", transliteration: "Jameel", english: "Beautiful", turkish: "Güzel" },
          { arabic: "صغير", transliteration: "Sagheer", english: "Small", turkish: "Küçük" },
          { arabic: "طويل", transliteration: "Taweel", english: "Tall / Long", turkish: "Uzun" },
        ],
      },
      {
        id: "words",
        heading: { en: "Common Words with Yaa", tr: "Yaa İçeren Yaygın Kelimeler" },
        content: {
          en: "Yaa appears in many everyday Arabic words. Here are some common examples to practice with. Try reading each word aloud and listening to the pronunciation. Pay attention to whether Yaa is acting as a consonant ('Y' sound) or a vowel ('ee' sound) in each word. The more you practice, the more natural this distinction will become.",
          tr: "Yaa birçok günlük Arapça kelimede bulunur. İşte pratik yapabileceğiniz bazı yaygın örnekler. Her kelimeyi yüksek sesle okumayı ve telaffuzu dinlemeyi deneyin.",
        },
        examples: [
          { arabic: "بيت", transliteration: "Bayt", english: "House", turkish: "Ev" },
          { arabic: "ميلاد", transliteration: "Meelad", english: "Birthday", turkish: "Doğum günü" },
          { arabic: "ليل", transliteration: "Layl", english: "Night", turkish: "Gece" },
          { arabic: "زيت", transliteration: "Zayt", english: "Oil", turkish: "Yağ" },
        ],
      },
      {
        id: "practice",
        heading: { en: "Practice Tips for Mastering Yaa", tr: "Yaa'yı Ustalaşmak İçin Pratik İpuçları" },
        content: {
          en: "To master Yaa, try writing it in all four forms several times. Then practice reading short words that contain Yaa. Pay attention to whether Yaa is used as a consonant (at the beginning of a word) or as a vowel (usually in the middle or end). Here are some effective practice techniques: First, write Yaa in isolation 20 times, focusing on the smooth downward curve. Next, write Yaa connected to other letters (باي, ليت, يمن). Then, read through a short Arabic text and highlight every Yaa you find — this builds recognition speed. Finally, listen to Arabic audio and try to identify words that contain the 'ee' sound of Yaa. Remember, consistency is more important than quantity. Even 10 minutes of daily practice with Yaa will produce remarkable results within a few weeks.",
          tr: "Yaa'yı öğrenmek için dört biçimini birçok kez yazmayı deneyin. Sonra Yaa içeren kısa kelimeleri okuma pratiği yapın. İşte bazı etkili pratik teknikleri: İlk olarak Yaa'yı yalnız 20 kez yazın. Ardından, Yaa'yı diğer harflere bağlı olarak yazın. Sonra kısa bir Arapça metni okuyun ve bulduğunuz her Yaa'yı işaretleyin. Tutarlılık miktardan daha önemlidir.",
        },
      },
    ],
    questions: [
      {
        type: "mcq",
        question: { en: "What position is Yaa in the Arabic alphabet?", tr: "Yaa Arap alfabesinin kaçıncı harfidir?" },
        options: ["26th", "27th", "28th", "29th"],
        correctIndex: 2,
      },
      {
        type: "mcq",
        question: { en: "What does 'بيت' mean?", tr: "'بيت' ne anlama gelir?" },
        options: ["Day", "Hand", "House", "Beautiful"],
        correctIndex: 2,
      },
      {
        type: "fill",
        question: { en: "The word 'يوم' means ___ in English.", tr: "'يوم' kelimesi Türkçe'de ___ demektir." },
        answer: "Day",
      },
      {
        type: "mcq",
        question: { en: "When Yaa begins a verb in present tense, what person does it indicate?", tr: "Yaa şimdiki zaman fiilinin başında olduğunda hangi kişiyi gösterir?" },
        options: ["I (first person)", "You (second person)", "He (third person masculine)", "She (third person feminine)"],
        correctIndex: 2,
      },
      {
        type: "fill",
        question: { en: "The Arabic word for 'beautiful' is ___", tr: "'Güzel'in Arapçası ___" },
        answer: "جميل",
      },
    ],
  },
  {
    slug: "famous-arabic-foods",
    title: {
      en: "Famous Arabic Foods and How to Say Them",
      tr: "Ünlü Arap Yemekleri ve Nasıl Söylenir",
    },
    excerpt: {
      en: "Explore delicious Arabic cuisine and learn the names of popular dishes with correct pronunciation.",
      tr: "Lezzetli Arap mutfağını keşfedin ve popüler yemeklerin isimlerini doğru telaffuzla öğrenin.",
    },
    category: { en: "Arabic Culture", tr: "Arap Kültürü" },
    author: "Layla Hassan",
    date: "2026-02-15",
    image: blogFoodImg,
    sections: [
      {
        id: "intro",
        heading: { en: "A Taste of Arabic Culture", tr: "Arap Kültüründen Bir Tat" },
        content: {
          en: "Food is a huge part of Arabic culture. Sharing meals is a way of showing hospitality and building relationships. In Arabic culture, offering food to a guest is considered one of the highest forms of generosity. The phrase 'Ahlan wa Sahlan' (أهلاً وسهلاً - Welcome) is often accompanied by the immediate offer of food and drink. Arabic cuisine has been shaped by centuries of trade, geography, and cultural exchange. From the fertile crescent of the Levant to the spice routes of the Gulf, each region has developed its own distinct flavors while sharing a common culinary philosophy: fresh ingredients, bold spices, and generous portions. Learning the names of popular Arabic dishes is a fun and practical way to expand your vocabulary and connect with Arabic culture on a deeper level.",
          tr: "Yemek, Arap kültürünün büyük bir parçasıdır. Yemek paylaşmak, misafirperverlik göstermenin ve ilişkiler kurmanın bir yoludur. Arap kültüründe bir misafire yemek ikram etmek en yüksek cömertlik biçimlerinden biri olarak kabul edilir. Arap mutfağı yüzyıllar süren ticaret, coğrafya ve kültürel alışveriş tarafından şekillendirilmiştir. Popüler Arap yemeklerinin isimlerini öğrenmek, kelime dağarcığınızı genişletmenin eğlenceli ve pratik bir yoludur!",
        },
      },
      {
        id: "hummus",
        heading: { en: "Hummus (حُمُّص)", tr: "Humus (حُمُّص)" },
        content: {
          en: "Hummus is perhaps the most internationally recognized Arabic dish. Made from blended chickpeas, tahini, lemon juice, and garlic, it's a staple across the Middle East. The word 'hummus' actually means 'chickpeas' in Arabic. Every country and every family has their own special recipe — some add more tahini for creaminess, others add extra lemon for tanginess, and some top it with pine nuts, meat, or whole chickpeas. In Lebanon, hummus is often served as a starter (مقبلات - muqabbilat) with warm pita bread. In Palestine, it's a breakfast staple served with olive oil and fresh vegetables. The debate over which country makes the best hummus is a friendly rivalry that spans the entire Middle East. What's universally agreed upon is that homemade hummus is always better than store-bought. The texture should be smooth and creamy, the flavor balanced between the nuttiness of tahini and the brightness of lemon.",
          tr: "Humus belki de uluslararası alanda en çok tanınan Arap yemeğidir. Nohut, tahin, limon suyu ve sarımsaktan yapılır. 'Humus' kelimesi Arapça'da aslında 'nohut' anlamına gelir. Her ülkenin ve her ailenin kendi özel tarifi vardır. Lübnan'da humus genellikle sıcak pide ekmeğiyle bir başlangıç olarak servis edilir. Filistin'de zeytinyağı ve taze sebzelerle kahvaltı klasiğidir.",
        },
        examples: [
          { arabic: "أنا أحب الحُمُّص", transliteration: "Ana uhibb al-hummus", english: "I love hummus", turkish: "Humusu seviyorum" },
          { arabic: "حُمُّص مع خبز", transliteration: "Hummus ma'a khubz", english: "Hummus with bread", turkish: "Ekmekle humus" },
          { arabic: "هل عندكم حُمُّص؟", transliteration: "Hal 'indakum hummus?", english: "Do you have hummus?", turkish: "Humusunuz var mı?" },
        ],
      },
      {
        id: "falafel",
        heading: { en: "Falafel (فلافل)", tr: "Falafel (فلافل)" },
        content: {
          en: "Falafel are deep-fried balls made from ground chickpeas or fava beans, mixed with herbs and spices. They're commonly served in pita bread with vegetables and tahini sauce. Falafel is a popular street food throughout the Arab world. The origin of falafel is debated — Egypt, Palestine, and Lebanon all claim it. Egyptian falafel (called 'ta'amiya' - طعمية) is made with fava beans and has a distinctive green interior from the fresh herbs. Levantine falafel uses chickpeas and is golden throughout. What makes great falafel is the perfect balance of crispy exterior and fluffy, herb-filled interior. The spice blend typically includes cumin, coriander, garlic, and parsley. Street vendors serve falafel sandwiches (ساندويتش فلافل) that are a complete meal — the pita is filled with falafel balls, pickled vegetables, tahini, and sometimes french fries for extra heartiness.",
          tr: "Falafel, öğütülmüş nohut veya bakla, otlar ve baharatlarla karıştırılarak yapılan kızartılmış toplardır. Genellikle pide ekmeğinde sebzeler ve tahin sosuyla servis edilir. Falafel'in kökeni tartışmalıdır — Mısır, Filistin ve Lübnan hepsi sahiplenir. Mısır falafeli (ta'amiya) bakladan yapılır ve taze otlardan yeşil bir iç kısma sahiptir.",
        },
        examples: [
          { arabic: "فلافل مع خبز", transliteration: "Falafel ma'a khubz", english: "Falafel with bread", turkish: "Ekmekle falafel" },
          { arabic: "ساندويتش فلافل", transliteration: "Sandwich falafel", english: "Falafel sandwich", turkish: "Falafel sandviç" },
          { arabic: "فلافل مقرمشة", transliteration: "Falafel muqarmasha", english: "Crispy falafel", turkish: "Çıtır falafel" },
        ],
      },
      {
        id: "shawarma",
        heading: { en: "Shawarma (شاورما)", tr: "Şavarma (شاورما)" },
        content: {
          en: "Shawarma is one of the most popular street foods in the Arab world. It consists of meat (usually chicken or lamb) that is stacked on a vertical spit, slowly roasted, and then shaved off and served in a wrap or on a plate with garlic sauce. The word 'shawarma' comes from the Turkish 'çevirme' meaning 'turning,' reflecting the Ottoman influence on Arab cuisine. Modern shawarma shops are a fixture in every Arab city and many Western cities as well. The meat is marinated for hours in a blend of spices including cardamom, turmeric, cumin, and paprika before being stacked on the spit. The slow rotation ensures even cooking and creates the signature charred edges that give shawarma its distinctive flavor. Chicken shawarma (شاورما دجاج) is typically served with garlic paste (toum - طحينة), while lamb shawarma is often paired with tahini sauce. A complete shawarma plate might include rice, salad, pickles, and french fries.",
          tr: "Şavarma Arap dünyasının en popüler sokak yiyeceklerinden biridir. Dikey bir şişe dizilen et yavaşça kızartılır ve sarılarak veya tabakta sarımsak sosuyla servis edilir. 'Şavarma' kelimesi Türkçe 'çevirme'den gelir. Et, kakule, zerdeçal, kimyon ve kırmızı biber dahil baharatlarla saatlerce marine edilir.",
        },
        examples: [
          { arabic: "شاورما دجاج", transliteration: "Shawarma dajaj", english: "Chicken shawarma", turkish: "Tavuk şavarma" },
          { arabic: "من فضلك، شاورما واحدة", transliteration: "Min fadlak, shawarma wahida", english: "One shawarma, please", turkish: "Bir şavarma lütfen" },
          { arabic: "شاورما لحم مع صلصة ثوم", transliteration: "Shawarma lahm ma'a salsat thum", english: "Lamb shawarma with garlic sauce", turkish: "Sarımsak soslu kuzu şavarma" },
        ],
      },
      {
        id: "mansaf",
        heading: { en: "Mansaf (منسف) — The Royal Dish", tr: "Mansaf (منسف) — Kraliyet Yemeği" },
        content: {
          en: "Mansaf is Jordan's national dish and one of the most revered meals in Arab cuisine. It consists of lamb cooked in a fermented dried yogurt sauce called 'jameed' (جميد), served over a bed of rice and thin bread. Mansaf is traditionally eaten communally from a large shared platter, using the right hand. It's served at weddings, holidays, and important gatherings. The preparation of Mansaf is a labor of love — the lamb is slow-cooked until tender, the jameed sauce is carefully prepared to achieve the right consistency, and the rice is cooked to perfection. Eating Mansaf is as much a social experience as a culinary one, bringing families and communities together around a shared meal.",
          tr: "Mansaf, Ürdün'ün ulusal yemeğidir ve Arap mutfağının en saygın yemeklerinden biridir. 'Jameed' adı verilen fermente kurutulmuş yoğurt sosunda pişirilen kuzudan oluşur, pirinç ve ince ekmek üzerinde servis edilir. Mansaf geleneksel olarak büyük bir paylaşımlı tabaktan sağ elle yenir.",
        },
        examples: [
          { arabic: "المنسف أكلة أردنية", transliteration: "Al-mansaf akla urduniyya", english: "Mansaf is a Jordanian dish", turkish: "Mansaf bir Ürdün yemeğidir" },
          { arabic: "هل جربت المنسف؟", transliteration: "Hal jarrabt al-mansaf?", english: "Have you tried mansaf?", turkish: "Mansaf denedin mi?" },
        ],
      },
    ],
    questions: [
      {
        type: "mcq",
        question: { en: "What does the word 'حُمُّص' literally mean in Arabic?", tr: "'حُمُّص' kelimesi Arapça'da ne anlama gelir?" },
        options: ["Bread", "Chickpeas", "Garlic", "Oil"],
        correctIndex: 1,
      },
      {
        type: "mcq",
        question: { en: "Which dish is made from ground chickpeas and deep-fried?", tr: "Hangi yemek öğütülmüş nohuttan yapılıp kızartılır?" },
        options: ["Hummus", "Shawarma", "Falafel", "Mansaf"],
        correctIndex: 2,
      },
      {
        type: "fill",
        question: { en: "شاورما ___ means 'Chicken shawarma'.", tr: "شاورما ___ 'Tavuk şavarma' demektir." },
        answer: "دجاج",
      },
      {
        type: "mcq",
        question: { en: "Which country's national dish is Mansaf?", tr: "Mansaf hangi ülkenin ulusal yemeğidir?" },
        options: ["Egypt", "Lebanon", "Jordan", "Syria"],
        correctIndex: 2,
      },
      {
        type: "fill",
        question: { en: "The word 'shawarma' comes from the Turkish word ___", tr: "'Şavarma' kelimesi Türkçe ___ kelimesinden gelir" },
        answer: "çevirme",
      },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  ...originalPosts,
  ...blogPostsBatch2,
  ...blogPostsBatch3,
];

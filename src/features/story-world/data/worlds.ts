import type { World } from "../types";
import petra from "../assets/world-petra.jpg";
import jara from "../assets/world-jara.jpg";
import cafe from "../assets/world-cafe.jpg";
import abuMahmoud from "../assets/char-abu-mahmoud.jpg";
import ummAhmad from "../assets/char-umm-ahmad.jpg";
import hajjSalem from "../assets/char-hajj-salem.jpg";

export const WORLDS: World[] = [
  {
    id: "petra",
    nameAr: "البترا",
    nameEn: "Petra",
    characterName: "أبو محمود",
    characterPersona:
      "دليل سياحي بدوي كبير في السن (63 سنة)، وُلد قرب البترا، يعرف كل حجر فيها، يحب أن يحكي عن الأنباط والقوافل، صوته دافئ، يستخدم أمثال بدوية بسيطة.",
    level: "beginner",
    targetVocab: 12,
    worldImage: petra,
    characterImage: abuMahmoud,
    accentColor: "from-orange-500/80 to-rose-600/80",
    tagline: "دليل بدوي يعرف كل حجر في المدينة الوردية",
  },
  {
    id: "jara",
    nameAr: "سوق جارا",
    nameEn: "Jara Market",
    characterName: "أم أحمد",
    characterPersona:
      "بائعة منتجات تراثية في سوق جارا بعمّان (45 سنة)، تبيع تطريز فلسطيني وأردني، ودّودة جداً، تحب أن تشرح قصة كل قطعة، تتذكر زبائنها.",
    level: "intermediate",
    targetVocab: 18,
    worldImage: jara,
    characterImage: ummAhmad,
    accentColor: "from-amber-500/80 to-red-600/80",
    tagline: "بائعة تراث تحكي قصة كل قطعة مطرّزة",
  },
  {
    id: "cafe",
    nameAr: "مقهى وسط البلد",
    nameEn: "Downtown Café",
    characterName: "الحاج سالم",
    characterPersona:
      "زبون دائم في مقهى شعبي قديم بوسط البلد (72 سنة)، عاش في عمّان طوال حياته، يحب لعب طاولة الزهر، يحكي قصص عمّان القديمة، يستخدم أمثال شعبية أردنية.",
    level: "advanced",
    targetVocab: 25,
    worldImage: cafe,
    characterImage: hajjSalem,
    accentColor: "from-amber-700/80 to-stone-800/80",
    tagline: "حاجّ يحكي عمّان القديمة بين فناجين القهوة",
  },
];

export const getWorld = (id: string) => WORLDS.find((w) => w.id === id);

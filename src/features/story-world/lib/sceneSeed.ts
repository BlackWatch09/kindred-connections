import type { SceneSeed } from "../types";

const weathers = ["مشمس دافئ", "غائم قليلاً", "نسيم لطيف", "حار وجاف", "بارد شوي", "غبار خفيف"];
const moods = ["منبسط جداً", "متعب شوي", "حنون ومتذكّر الماضي", "متحمس", "هادئ ومتأمل", "مرح ويحب الدعابة"];
const times = ["الصباح الباكر", "قبل الظهر", "الظهيرة", "بعد العصر", "الغروب", "أول المساء"];
const sideEvents = [
  "مرت مجموعة أطفال يلعبون قبل قليل",
  "سمعت صوت أذان قبل قليل",
  "رجل باع قهوة سادة مرّ الآن",
  "قطة صغيرة تجلس قربك",
  "يوجد عرس في الحي القريب",
  "الكهرباء انقطعت قبل نصف ساعة ورجعت",
  "زبون قديم مرّ وسلّم قبل قليل",
  "رائحة خبز طازج تفوح من الفرن المجاور",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateSceneSeed = (): SceneSeed => ({
  weather: pick(weathers),
  mood: pick(moods),
  timeOfDay: pick(times),
  sideEvent: pick(sideEvents),
});

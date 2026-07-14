# خطة إعادة الهيكلة والتحسين الشاملة — منصّة لُغة

هذه خطة على **٦ مراحل**، من الأعلى أثراً إلى التلميعات النهائية. كل مرحلة قائمة بذاتها ويمكن شحنها منفردةً دون كسر ما قبلها.

---

## المرحلة ١ — الأمان وحماية مفاتيح الذكاء الاصطناعي (أولوية قصوى)

**المشكلة:** حالياً `getGeminiKey()` يقرأ المفتاح من الواجهة الأمامية (localStorage/متغيّرات بناء)، وكل استدعاءات Gemini/OCR/TTS تنطلق مباشرة من المتصفح. أي زائر يستطيع سرقة المفتاح واستهلاك الرصيد.

الخطوات:
1. تفعيل **Lovable Cloud** إن لم يكن مُفعّلاً، والاستفادة من `LOVABLE_API_KEY` الموجود تلقائياً.
2. توحيد كل نداءات الـ AI خلف Edge Functions موجودة أصلاً (`siraj-chat`, `story-generate`, `voice-transcribe`, `writing-analyze`, `tts`, …) وإضافة اثنتين جديدتين: `smart-scan` (OCR)، و`generic-json` (بديل عام لدوال `aiFn.ts`).
3. حذف `getGeminiKey`/`setGeminiKey` من الواجهة، وإزالة كل الوصول المباشر إلى `generativelanguage.googleapis.com`.
4. إضافة **Rate limiting** بسيط داخل كل Edge Function (عدّاد لكل IP/جلسة في جدول `ai_usage`).
5. مراجعة سياسات RLS على كل الجداول العامة، وإضافة `user_roles` منفصلة عن `profiles` إن لم تكن كذلك.

**الأثر:** يمنع سرقة الرصيد، ويجعل تكلفة الذكاء الاصطناعي محكومة وقابلة للقياس.

---

## المرحلة ٢ — تنظيم الشيفرة وقصّ الملفات الطويلة

**المشكلة:** ملفات ضخمة يصعب صيانتها:
- `Admin.tsx` ≈ ٧٢٤ سطر
- `Alphabet.tsx` ≈ ٥٢٠ سطر
- `aiFn.ts` ≈ ٤٩٧ سطر
- `Dashboard.tsx` ≈ ٤٤٨ سطر
- `PlacementTest.tsx` ≈ ٣٥٥ سطر

الخطوات:
1. **`aiFn.ts` → مجلد `src/lib/ai/`** بملف لكل ميزة: `pronunciation.ts`, `story.ts`, `writing.ts`, `translate.ts`, `daily.ts`, `flashcards.ts`, `interview.ts`, `scanner.ts`، مع `client.ts` مشترك يستدعي Edge Functions.
2. **`Admin.tsx`** → تقسيم إلى تبويبات: `AdminUsers.tsx`, `AdminContent.tsx`, `AdminPersona.tsx`, `AdminAnalytics.tsx`.
3. **`Dashboard.tsx`** → استخراج بطاقات إلى `dashboard/` مع `ProgressCard`, `PointsCard`, `StreakCard`, `RecentActivity`.
4. **`Alphabet.tsx` و `PlacementTest.tsx`** → فصل منطق الحالة عن العرض إلى hooks (`useAlphabetLesson`, `usePlacementFlow`).
5. توحيد جميع مودالات الأدوات على `ToolShell` (تمّ جزئياً — إكمال الباقي).

بنية مقترحة:

```text
src/
├── lib/ai/            (client wrappers → edge functions)
├── features/
│   ├── ai-hub/        (AIHub + tool dialogs)
│   ├── courses/       (Courses, CoursePage, lesson data)
│   ├── dashboard/     (Dashboard + cards)
│   ├── admin/         (Admin tabs)
│   └── story-world/   (موجود)
└── shared/            (Navbar, Footer, ToolShell, UI…)
```

---

## المرحلة ٣ — تحسين الأداء (Performance)

**المشكلة:** كل الصفحات والمكوّنات تُحمَّل ضمن حزمة رئيسية واحدة، ولا يوجد `React.lazy` في المشروع.

الخطوات:
1. **Route-level code splitting** — استخدام `React.lazy` + `Suspense` لكل صفحة في `App.tsx`، مع `LoadingFallback` أنيق.
2. **Dialog-level splitting** — تحميل مودالات AIHub الثقيلة عند الطلب فقط (`lazy(() => import(...))`).
3. **Vite manual chunks** — فصل vendor إلى: `react`, `radix`, `framer-motion`, `supabase`, `lucide` لتحسين الـ caching.
4. **الصور**: إضافة `vite-imagetools` وتحويل صور `src/assets` إلى AVIF/WebP، مع preload لصورة LCP (خلفية Hero).
5. **إزالة استيرادات lucide-react الشاملة**: التأكد من import الفردي (تلقائي في ESM لكن نراجع).
6. **`framer-motion`** ثقيل — تقييم الاستبدال بـ CSS transitions حيث لا حاجة لتفاعل معقّد.
7. Audit `tanstack-query`: إضافة `staleTime` افتراضي معقول وتفعيل `refetchOnWindowFocus: false`.
8. **Lighthouse target**: Performance ≥ 90 على `/`, `/ai`, `/courses`, `/dashboard`.

---

## المرحلة ٤ — تجربة المستخدم والوصولية (UX/A11y)

الخطوات:
1. **Error boundaries** على مستوى الصفحة مع رسائل عربية أنيقة.
2. **حالات فارغة (Empty states)** لكل قائمة (نقاط، دروس، محادثات).
3. **حالات تحميل موحّدة** — Skeletons بدل الـ spinners المتفرّقة.
4. **RTL/LTR audit** — التأكد من `dir="rtl"` صحيحاً في كل مكان، وإصلاح أيقونات الأسهم المعكوسة.
5. **A11y**: `aria-label` على كل الأزرار الأيقونية، `role`/`aria-live` على المناطق الديناميكية (نتائج المسح، نتائج المقابلة الصوتية).
6. **لوحة المفاتيح**: تجربة كل المودالات بـ Tab/Shift-Tab/Esc.
7. **Toast unification** — استخدام `sonner` فقط (نلاحظ وجود `use-toast` أيضاً).

---

## المرحلة ٥ — الاختبارات والجودة

الخطوات:
1. **Vitest** موجود — إضافة اختبارات وحدة لـ `lib/points.ts`, `lib/ai/*`, حاسبات النقاط ودوال التشكيل.
2. **React Testing Library** لسيناريوهات المودالات الحرجة (Scanner, Interview, Story).
3. **Playwright** للسيناريو الشامل: تسجيل دخول → بدء درس → إكماله → ظهور النقاط في Dashboard.
4. **ESLint + Prettier + typescript-strict** — تفعيل `noUncheckedIndexedAccess`, `strictNullChecks`.
5. **GitHub Actions** (اختياري): CI يشغّل `bun run build` + `vitest`.

---

## المرحلة ٦ — SEO والنشر النهائي

الخطوات:
1. مراجعة `<title>` و `<meta description>` لكل صفحة عبر مكوّن `<SEO />` صغير (react-helmet-async).
2. `og:image` مخصّصة لكل مسار رئيسي.
3. `sitemap.xml` و `robots.txt`.
4. Structured data (JSON-LD) للدورات (`Course`) والمقالات.
5. Lazy loading للصور غير-LCP و`fetchpriority` للصورة الرئيسية.
6. تفعيل `manifest.webmanifest` وإكمال أيقونات PWA (شاشة رئيسية على الجوال).

---

## للمناقشة قبل البدء

- **تسلسل التنفيذ المقترح:** ١ → ٢ → ٣ → ٤ → ٥ → ٦ (الأمان أولاً لأن ما بعده يعتمد على مسار Edge Functions).
- **المرحلة ١ (الأمان) وحدها**: يوم-يومان عمل وستكسر مؤقتاً بعض الأدوات حتى نُهاجرها ملفاً بملف.
- هل تريد أن نبدأ بالمرحلة ١ الآن؟ أم تفضّل تنفيذ مرحلة أخرى أولاً (مثلاً الأداء إذا كانت لجنة التخرج ستقيس السرعة قبل الأمان)؟

بمجرد موافقتك سأبدأ فوراً بأول مرحلة تختارها.

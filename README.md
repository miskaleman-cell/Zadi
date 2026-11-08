## V20.18 — Dashboard cleanup
- Stock-alerts panel removed from the dashboard; expanded invoice rows fit phone screens. Data format and existing backups are unchanged.

## V20.17 — Aggregated invoice edit log
- One cumulative edit record per invoice (grouped by edit number), dashboard/About mobile layout fixes. Data format and existing backups are unchanged.


## V20.16 UI improvements
- Clearer invoice add-row button, responsive movement controls, corrected price filter label, mobile price toolbar, and two-column customer summary cards.
- Existing saved data format and records are unchanged.

BEYDUN AGRO V20.16 — Invoice Edit Integrity Fix

BEYDUN AGRO — V20.14

# Beydun Agriculture System — تطبيق PWA

تم تجهيز التطبيق ليعمل كتطبيق ويب تقدمي (PWA) حقيقي وقابل للتثبيت، باستخدام شعار
التطبيق نفسه (الموجود أصلاً داخل الكود) كأيقونة، وجاهز للنشر مباشرة على GitHub Pages.

## 📁 هيكل الملفات

```
.
├── index.html                 ← التطبيق (الصفحة الرئيسية)
├── manifest.json               ← بيان PWA (الاسم، الألوان، الأيقونات...)
├── sw.js                       ← Service Worker (يفعّل العمل دون إنترنت)
├── .nojekyll                   ← يمنع GitHub من تجاهل أي ملفات
├── icon-192.png                ← أيقونة عادية 192×192
├── icon-512.png                ← أيقونة عادية 512×512
├── icon-maskable-192.png       ← أيقونة "maskable" (تتكيف مع أشكال الأندرويد)
├── icon-maskable-512.png
├── icon-180.png                ← أيقونة Apple Touch (iOS)
├── favicon-32.png
└── favicon-16.png
```

كل الملفات الآن في المجلد الرئيسي مباشرة (بلا أي مجلدات فرعية)، بما فيها
الأيقونات. كل الأيقونات مُولَّدة من **الشعار الأصلي** الموجود داخل التطبيق
(النسر الذهبي وعبارة BEYDUN AGRO SİSTEM بالخلفية الخضراء)، وليست أيقونة عشوائية.

## 🚀 خطوات النشر على GitHub Pages

### 1. أنشئ مستودع (Repository) جديد
على github.com اضغط **New repository**، اختر اسمًا (مثلاً `beydun-agro`)، واجعله Public.

### 2. ارفع الملفات
من جهازك، داخل مجلد المشروع:

```bash
git init
git add .
git commit -m "Beydun Agriculture System - PWA"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

(أو ببساطة اسحب كل الملفات والمجلدات بالسحب والإفلات Drag & Drop من صفحة
المستودع على GitHub مباشرة إذا كنت لا تستخدم Git من سطر الأوامر).

> ⚠️ مهم: ارفع **محتويات** المجلد مباشرة في جذر المستودع (root) — أي أن
> `index.html` و `manifest.json` و `sw.js` وكل ملفات الأيقونات يجب أن تكون كلها
> في المستوى الأول، وليست داخل مجلد فرعي إضافي.

### 3. فعّل GitHub Pages
داخل المستودع: **Settings → Pages**
- في "Source" اختر: **Deploy from a branch**
- في "Branch" اختر: **main** والمجلد **/ (root)**
- اضغط **Save**

انتظر دقيقة أو دقيقتين، ثم سيظهر الرابط في نفس الصفحة بالشكل:
```
https://USERNAME.github.io/REPO-NAME/
```

### 4. افتح الرابط وجرّب التثبيت
- على **أندرويد (Chrome)**: سيظهر إشعار "إضافة إلى الشاشة الرئيسية" تلقائيًا
  (أو من زر ⋮ في المتصفح)، والأيقونة ستكون شعار Beydun الأخضر.
- على **iOS (Safari)**: زر المشاركة ⎙ ← "إضافة إلى الشاشة الرئيسية".
- على **الكمبيوتر (Chrome/Edge)**: أيقونة تثبيت ⊕ تظهر في شريط العنوان.

بعد التثبيت سيعمل التطبيق بكامل واجهته، وبدون إنترنت أيضًا (بفضل
Service Worker) لأي بيانات تم تحميلها وتخزينها مسبقًا.

## 🔄 عند تحديث التطبيق لاحقًا

في كل مرة تعدّل فيها `index.html` وترفع نسخة جديدة، **غيّر رقم النسخة** في
أول `sw.js`:

```js
const CACHE_NAME = 'beydun-agro-v2';   // كان v1
```

هذا يجبر المتصفح على تحميل أحدث نسخة بدلًا من الاحتفاظ بنسخة قديمة مخزّنة.

## ✅ التحقق من صحة الإعداد (اختياري)
يمكنك التأكد من أن PWA مُعد بشكل صحيح عبر:
**Chrome DevTools → Application tab → Manifest** و **Service Workers**،
أو عبر أداة Lighthouse المدمجة في Chrome (تبويب Lighthouse → Run audit
لقسم "Progressive Web App").

### V20.3
مراجعة إضافية للترجمة العربية والتركية، مع استكمال نصوص إدارة التطبيق، خيارات العرض وحجم الخط، وصفحة أنواع الأدوية والتراكيب والحقول المنسدلة.


### V20.7 — Crop & Season tracking
Invoice records now carry a crop and agricultural season. Season options are editable and suggested from the invoice date; historical dose-per-area sales indicators can be filtered by season and crop. Crop list includes garlic, olive, pistachio, eggplant, pepper, cotton and additional crops. Sales-derived metrics are explicitly historical sales indicators, not approved label doses.

## ملاحظات V20.8
تم حذف تصنيف المحاصيل من واجهة الفواتير وحاسبة الجرعات ووقت العلاج. اكتب نوع المحصول (مثل الثوم أو الفستق) في حقل ملاحظات الفاتورة. بقيت المواسم الزراعية وفلاترها كما هي. لا تُحذف حقول المحاصيل القديمة من بيانات النسخ الاحتياطية.


الإصدار V20.11: تم ضبط ترتيب الأدوية في سجل الحركات ليطابق ترتيبها في الفاتورة، دون بطاقات أو تجميع.

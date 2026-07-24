#!/usr/bin/env node
/*
 * ==================== مجموعة اختبارات زادي (تلقائية) — v69 ====================
 *
 * لماذا هذا الملف موجود:
 * قبل v69 كان كل "تحقق" مذكور في CHANGELOG.md مجرد فحص يدوي لمرة واحدة (node -e
 * "new Function(...)" لسلامة الجملة، ثم مقارنة يدوية لعدد <div>/</div>) يُنفَّذ من
 * سطر أوامر عشوائي في تلك الجلسة تحديداً ولا يُحفَظ. هذا لا يمنع فعلياً كسر ميزة
 * قديمة عند إضافة ميزة جديدة، لأنه لا توجد قائمة ثابتة بما يجب أن يبقى صحيحاً.
 *
 * هذا الملف يحوّل تلك الفحوصات المتفرقة إلى مجموعة اختبارات حقيقية قابلة للتكرار:
 *   node run-tests.js
 * يجب تشغيله بعد أي تعديل على index.html أو sw.js قبل اعتبار الجلسة منتهية.
 * exit code = 0 يعني نجاح كل الاختبارات، وأي رقم آخر يعني وجود عطل يجب إصلاحه.
 *
 * طبيعة الاختبارات (لماذا "ثابتة/structural" وليست محاكاة متصفح كاملة):
 * التطبيق ملف HTML واحد يعتمد بكثافة على window/document/fetch/geolocation
 * الحقيقية، ولا يوجد bundler أو npm project أصلاً (قرار معماري متعمّد وموثّق في
 * الذاكرة طويلة المدى للمشروع: PWA بملف واحد بلا اعتماديات بناء). محاكاة DOM/متصفح
 * كاملة (jsdom مثلاً) تتطلب تثبيت حزم خارجية تكسر مبدأ "الاعتماد فقط على Node
 * الأساسي" المعمول به في هذا المشروع. لذلك هذه الاختبارات "ثابتة": تفحص بنية
 * الكود والبيانات نفسها (syntax، وجود دوال، تفرّد المعرّفات، تناسق الحقول...) بدل
 * تنفيذ التطبيق فعلياً في متصفح. هذا لا يغني عن اختبار يدوي سريع في المتصفح بعد أي
 * تعديل بصري، لكنه يمسك أغلب أعطال "كسرتُ شيئاً قديماً بالخطأ" (بيانات ناقصة، id
 * مكرر، دالة محذوفة بالخطأ، خطأ جملة) تلقائياً وبثوانٍ.
 *
 * لإضافة اختبار جديد: أضف دالة test('اسم وصفي', () => { ...assert... }) جديدة في
 * القسم المناسب أدناه. كل اختبار مستقل ولا يوقف البقية عند فشله.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const INDEX_PATH = path.join(ROOT, 'index.html');
const SW_PATH = path.join(ROOT, 'sw.js');

const html = fs.readFileSync(INDEX_PATH, 'utf8');
const sw = fs.readFileSync(SW_PATH, 'utf8');

// ---- إطار اختبار صغير جداً (بلا أي حزمة خارجية) ----
let passed = 0, failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ✓ ' + name);
  } catch (e) {
    failed++;
    failures.push({ name, error: e.message });
    console.log('  ✗ ' + name + '\n      → ' + e.message);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function section(title) {
  console.log('\n' + title);
}

// استخراج كتل <script>...</script> (بدون سمة src)
function extractScriptBlocks(source) {
  const blocks = [];
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(source))) blocks.push(m[1]);
  return blocks;
}

const scriptBlocks = extractScriptBlocks(html);

// ==================== 1) سلامة الجملة (Syntax) ====================
section('1) سلامة الجملة — كتل <script>');

test('يوجد كتلتا <script> على الأقل (وليس صفر بسبب خطأ استخراج)', () => {
  assert(scriptBlocks.length >= 2, 'توقعتُ كتلتين أو أكثر، وجدتُ ' + scriptBlocks.length);
});

scriptBlocks.forEach((code, i) => {
  test(`كتلة <script> رقم ${i + 1} خالية من أخطاء الجملة (طولها ${code.length} حرف)`, () => {
    // eslint-disable-next-line no-new-func
    new Function(code);
  });
});

test('sw.js خالٍ من أخطاء الجملة', () => {
  // eslint-disable-next-line no-new-func
  new Function(sw);
});

// ==================== 2) توازن وسوم <div> ====================
section('2) توازن الوسوم الأساسية');

test('عدد <div> يساوي تقريباً عدد </div> (فرق ثابت معروف = -2 بسبب نص داخل بيانات، لا يجوز أن يتغيّر)', () => {
  const opens = (html.match(/<div\b/g) || []).length;
  const closes = (html.match(/<\/div>/g) || []).length;
  const diff = opens - closes;
  // الفارق المرجعي موثّق تاريخياً في المشروع؛ إن تغيّر فهذا يعني وسوماً غير متوازنة أُضيفت فعلاً
  assert(diff === -2, `الفارق الحالي ${diff}، والمتوقع -2 (opens=${opens}, closes=${closes})`);
});

// ==================== 3) تفرّد الـ id داخل HTML ====================
section('3) تفرّد معرّفات HTML (id="...")');

test('لا يوجد أي id مكرر داخل عناصر HTML (خارج نصوص القصص/المقالات)', () => {
  // نأخذ فقط أسطر بها وسم HTML يحتوي id="..." (تقريب معقول: يستثني JS template literals التي تحتوي كلاس id بصيغة مختلفة)
  const ids = [];
  const re = /<[a-zA-Z][^>]*\bid="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) ids.push(m[1]);
  const seen = new Map();
  const dups = new Set();
  for (const id of ids) {
    seen.set(id, (seen.get(id) || 0) + 1);
    if (seen.get(id) > 1) dups.add(id);
  }
  assert(dups.size === 0, 'ids مكررة: ' + Array.from(dups).join(', '));
});

// ==================== 4) وجود الدوال الأساسية (لم تُحذف بالخطأ) ====================
section('4) الدوال الأساسية المتوقّع وجودها');

const REQUIRED_FUNCTIONS = [
  // تنقّل عام
  'showPage', 'formatTime',
  // القرآن والصوت
  'playAudio', 'audioPause', 'audioResume', 'audioTogglePlay', 'audioPrev', 'audioNext',
  'closeAudio', 'audioSeek', 'buildUrlList', 'playVerseAudio', 'selectReciter',
  // تحميل الصوت أوفلاين (v69)
  'downloadSurahForOffline', 'audioDownloadCurrentSurah', 'deleteDownloadedAudio',
  'clearAllDownloadedAudio', 'renderAudioDownloadsSettings', 'updateDownloadBtnState',
  'getAudioDownloadsIndex', 'isSurahDownloaded',
  // حصن المسلم / أذكار
  'loadHisnCategories',
  // القصص والسير
  'loadProphetsPage', 'showProphetDetail', 'loadSahabaPage', 'showSahabaDetail',
  'loadTabieenPage', 'showTabieenDetail', 'loadUlamaPage',
  'renderAlaamList', 'setAlaamFilter', 'showAlaamDetail',
  'loadDawlatPage', 'showDawlatDynasty', 'showDawlatRulerDetail',
  'loadShamPage', 'loadIraqPage', 'loadEgyptPage', 'loadLibyaPage', 'loadTurkeyPage', 'loadMaghrebPage', 'loadHijazPage',
  'loadQuranStoriesPage', 'loadIsrailiyatPage', 'showIsrailiyatDetail',
  'loadRacesPage', 'racesShowTree', 'prophetsTreeShow',
  'loadSeerahPage',
  'loadInfobank', 'loadQuizPage', 'loadBooksPage',
  // التقويم الهجري الدقيق (v68)
  'getTodayHijri', 'syncAccurateHijriToday', 'setHijriApproxBadge',
  // خط التطبيق الموحّد (v68)
  'createFontScaleControl', 'changeAppFontScale', 'changeFontSize', 'changeLineHeight',
  'changeAthkarFontSize', 'changeAthkarLineHeight',
];

REQUIRED_FUNCTIONS.forEach((fn) => {
  test(`الدالة موجودة: ${fn}()`, () => {
    // يقبل كلاً من: function fn( ... و  fn = function( ... و  fn = ( ... ) =>  و  fn(...) {  (method-like)
    const patterns = [
      new RegExp(`function\\s+${fn}\\s*\\(`),
      new RegExp(`(?:const|let|var)\\s+${fn}\\s*=\\s*(?:function|\\()`),
      new RegExp(`\\b${fn}\\s*[:=]\\s*(?:async\\s*)?function\\s*\\(`),
      new RegExp(`\\b${fn}\\s*[:=]\\s*\\([^)]*\\)\\s*=>`),
    ];
    const found = patterns.some((re) => re.test(html));
    assert(found, `لم يُعثر على تعريف لدالة ${fn} — قد تكون حُذفت بالخطأ`);
  });
});

// ==================== 5) تناسق مصفوفات البيانات الرئيسية ====================
section('5) تناسق مصفوفات *_DATA (لا id مكرر داخل كل مصفوفة)');

// نستخرج كل مصفوفة data على حدة عبر البحث عن "const NAME = [" ثم موازنة الأقواس
// لإيجاد نهايتها الفعلية (أسلم من regex غير محدود لأن المحتوى قد يحوي أقواساً معقوفة داخل نصوص)
function extractArrayLiteral(source, varName) {
  const startMatch = source.match(new RegExp(`const\\s+${varName}\\s*=\\s*\\[`));
  if (!startMatch) return null;
  let i = startMatch.index + startMatch[0].length - 1; // موضع '['
  let depth = 0;
  let inStr = null; // ' " أو `
  let escape = false;
  for (; i < source.length; i++) {
    const c = source[i];
    if (inStr) {
      if (escape) { escape = false; }
      else if (c === '\\') { escape = true; }
      else if (c === inStr) { inStr = null; }
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { return source.slice(startMatch.index + startMatch[0].length - 1, i + 1); } }
  }
  return null;
}

// يقسّم نص المصفوفة إلى عناصرها المباشرة فقط (depth 0)، بحيث لا نخلط بين id عنصر
// المستوى الأعلى و id عناصر مصفوفة متداخلة بداخله (مثال: DAWLAT_DATA فيها عنصر
// لكل "دولة" وبداخله rulers:[{id:1,...}] بترقيم مستقل يبدأ من 1 من جديد لكل دولة)
function splitTopLevelElements(arrayText) {
  const inner = arrayText.slice(1, -1); // إزالة [ ] الخارجيتين
  const elements = [];
  let depth = 0, current = '', inStr = null, escape = false;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (inStr) {
      current += c;
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = c; current += c; continue; }
    if (c === '{' || c === '[') { depth++; current += c; continue; }
    if (c === '}' || c === ']') { depth--; current += c; continue; }
    if (c === ',' && depth === 0) { elements.push(current); current = ''; continue; }
    current += c;
  }
  if (current.trim()) elements.push(current);
  return elements.map((e) => e.trim()).filter(Boolean);
}

function topLevelIdsOf(arrayText) {
  return splitTopLevelElements(arrayText)
    .map((el) => {
      const m = el.match(/\bid\s*:\s*(?:'([^']*)'|"([^"]*)"|(\d+))/);
      return m ? (m[1] ?? m[2] ?? m[3]) : null;
    })
    .filter((v) => v !== null);
}

// مصفوفات عناصرها تحوي حقل id فريداً على مستواها العلوي مباشرة
const DATA_ARRAYS_WITH_ID = [
  'PROPHETS_DATA', 'SAHABA_DATA', 'TABIEEN_DATA', 'ULAMA_DATA', 'ALAAM_DATA',
  'DAWLAT_DATA', 'SHAM_DATA', 'HIJAZ_DATA', 'IRAQ_DATA', 'EGYPT_DATA', 'LIBYA_DATA',
  'TURKEY_DATA', 'MAGHREB_DATA', 'QURAN_STORIES_DATA', 'ISRAILIYAT_DATA', 'RACES_DATA',
  'HISN_DATA', 'SEERAH_DATA', 'INFOBANK_DATA', 'QUIZ_QUESTIONS',
];

DATA_ARRAYS_WITH_ID.forEach((name) => {
  test(`${name}: موجودة، غير فارغة، ولا id مكرر على مستواها العلوي`, () => {
    const arr = extractArrayLiteral(html, name);
    assert(arr, `تعذّر استخراج المصفوفة ${name} (هل تغيّر اسمها أو حُذفت؟)`);
    const elCount = splitTopLevelElements(arr).length;
    assert(elCount > 0, `${name} فارغة`);
    const ids = topLevelIdsOf(arr);
    assert(ids.length === elCount, `${name}: ${elCount} عنصراً لكن ${ids.length} منها فقط بها id علوي — تحقق يدوياً`);
    const seen = new Set();
    const dups = new Set();
    ids.forEach((id) => { if (seen.has(id)) dups.add(id); seen.add(id); });
    assert(dups.size === 0, `id مكرر على المستوى العلوي داخل ${name}: ${Array.from(dups).join(', ')}`);
  });
});

// مصفوفات لا تعتمد id (بنية {month,day,...} أو {name,lat,lon} إلخ) — تُفحص فقط أنها موجودة وغير فارغة
const DATA_ARRAYS_NO_ID = ['ON_THIS_DAY_DATA', 'ISLAMIC_OCCASIONS_DATA', 'MANUAL_CITIES_DATA'];
DATA_ARRAYS_NO_ID.forEach((name) => {
  test(`${name}: موجودة وغير فارغة`, () => {
    const arr = extractArrayLiteral(html, name);
    assert(arr, `تعذّر استخراج المصفوفة ${name}`);
    assert(splitTopLevelElements(arr).length > 0, `${name} فارغة`);
  });
});

test('RECITERS: كل عنصر يحتوي id و name و emoji', () => {
  const arr = extractArrayLiteral(html, 'RECITERS');
  assert(arr, 'تعذّر استخراج RECITERS');
  const idMatches = arr.match(/id\s*:\s*'[^']+'/g) || [];
  const nameMatches = arr.match(/name\s*:\s*'[^']+'/g) || [];
  assert(idMatches.length > 5, 'عدد قرّاء قليل جداً — هل حُذفت المصفوفة جزئياً؟');
  assert(idMatches.length === nameMatches.length, `عدد id (${idMatches.length}) لا يطابق عدد name (${nameMatches.length})`);
});

// ==================== 6) اختبارات خاصة بميزة تحميل الصوت أوفلاين (v69) ====================
section('6) تحميل الصوتيات للاستماع أوفلاين (v69)');

test('زر التحميل ⭳ موجود مرة واحدة فقط في شريط المشغّل (id="ap-download-btn")', () => {
  const count = (html.match(/id="ap-download-btn"/g) || []).length;
  assert(count === 1, `توقعت ظهوراً واحداً، وجدت ${count}`);
});

test('قسم "الصوتيات المحمّلة" موجود في صفحة الإعدادات (audio-downloads-list/total)', () => {
  assert(/id="audio-downloads-list"/.test(html), 'audio-downloads-list غير موجود');
  assert(/id="audio-downloads-total"/.test(html), 'audio-downloads-total غير موجود');
});

test('playAudio يتحقق من الكاش المحلي (AUDIO_CACHE_NAME) قبل اللجوء للشبكة', () => {
  const fnMatch = html.match(/function playAudio\(surahId\) \{[\s\S]*?\n\}/);
  assert(fnMatch, 'تعذّر استخراج جسم دالة playAudio');
  assert(/AUDIO_CACHE_NAME/.test(fnMatch[0]), 'playAudio لا تستخدم AUDIO_CACHE_NAME — قد تكون ميزة أوفلاين انفصلت عن دالة التشغيل الفعلية');
});

test('sw.js يستثني ملفات الصوت (mp3) من الاعتراض بالكامل', () => {
  assert(/isAudioFile/.test(sw), 'sw.js لا يحتوي فحص isAudioFile');
  assert(/if\s*\(\s*isAudioFile\s*\)\s*return;/.test(sw), 'sw.js لا يُرجع مبكراً عند ملفات الصوت');
});

test('sw.js يستثني كاش الصوت (zadi-audio-v1) من حذف activate()', () => {
  const activateMatch = sw.match(/activate[\s\S]*?\}\);/);
  assert(activateMatch, 'تعذّر استخراج معالج activate');
  assert(/AUDIO_CACHE/.test(activateMatch[0]), 'AUDIO_CACHE غير مذكور داخل activate — قد يُحذف كاش الصوتيات المحمّلة عند كل تحديث نسخة!');
});

// ==================== 7) اختبارات خاصة بحزم الأيقونات (v72) ====================
section('7) حزم الأيقونات القابلة للتبديل (v72)');

const ICON_KEYS_EXPECTED = ['quran','athkar','prayer','tasbih','khatma','qibla','zakat','seerahstories','infobank','quiz','events','exchange','age','reminders','about','appsgrid','settings','duaoccasions','ramadan'];

test('ICON_PACKS تحتوي الحزم الثلاث (emoji/outline/filled)', () => {
  assert(/const ICON_PACKS\s*=\s*\{/.test(html), 'تعذّر العثور على تعريف ICON_PACKS');
  ['emoji', 'outline', 'filled'].forEach((pack) => {
    assert(new RegExp(`${pack}\\s*:\\s*\\{`).test(html), `حزمة "${pack}" غير موجودة داخل ICON_PACKS`);
  });
});

test('كل حزمة تحتوي كل مفاتيح الأيقونات الـ19 المتوقعة', () => {
  const packsBlockMatch = html.match(/const ICON_PACKS\s*=\s*\{[\s\S]*?\n\};/);
  assert(packsBlockMatch, 'تعذّر استخراج جسم ICON_PACKS كاملاً');
  const block = packsBlockMatch[0];
  ICON_KEYS_EXPECTED.forEach((key) => {
    const count = (block.match(new RegExp(`\\b${key}\\s*:`, 'g')) || []).length;
    assert(count >= 3, `المفتاح "${key}" يُتوقع أن يظهر 3 مرات (مرة لكل حزمة)، وُجد ${count}`);
  });
});

test('كل عناصر .dyn-icon[data-icon] في HTML لها مفتاح ضمن المفاتيح المتوقعة', () => {
  const iconEls = html.match(/data-icon="([a-z]+)"/g) || [];
  assert(iconEls.length > 0, 'لا توجد عناصر data-icon في الملف — هل حُذفت بنية التنقل بالخطأ؟');
  iconEls.forEach((m) => {
    const key = m.match(/data-icon="([a-z]+)"/)[1];
    assert(ICON_KEYS_EXPECTED.includes(key), `مفتاح data-icon="${key}" غير معرّف في ICON_KEYS_EXPECTED ولا في ICON_PACKS`);
  });
});

test('applyIconPack تحفظ الاختيار في localStorage وتُطبَّق تلقائياً عند تحميل الصفحة', () => {
  assert(/function applyIconPack\(/.test(html), 'applyIconPack غير معرّفة');
  assert(/localStorage\.setItem\('zadi_icon_pack'/.test(html), 'applyIconPack لا تحفظ الاختيار في localStorage');
  assert(/applyIconPack\(getIconPack\(\)\)/.test(html), 'لا يوجد استدعاء applyIconPack(getIconPack()) عند تحميل الصفحة — الحزمة المحفوظة لن تُطبَّق تلقائياً');
});

test('لوحة اختيار حزمة الأيقونات (icon-pack-panel) موجودة وتحتوي 3 أزرار', () => {
  assert(/id="icon-pack-panel"/.test(html), 'icon-pack-panel غير موجودة في HTML');
  const panelMatch = html.match(/id="icon-pack-panel"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
  assert(panelMatch, 'تعذّر استخراج جسم لوحة icon-pack-panel');
  ['ip-emoji', 'ip-outline', 'ip-filled'].forEach((id) => {
    assert(new RegExp(`id="${id}"`).test(html), `الزر ${id} غير موجود داخل لوحة اختيار الأيقونات`);
  });
});

// ==================== الملخّص ====================
console.log('\n' + '='.repeat(50));
console.log(`النتيجة: ${passed} نجح، ${failed} فشل (من أصل ${passed + failed})`);
if (failed > 0) {
  console.log('\nالاختبارات الفاشلة:');
  failures.forEach((f) => console.log(`  - ${f.name}: ${f.error}`));
  process.exitCode = 1;
} else {
  console.log('كل الاختبارات ناجحة ✓');
  process.exitCode = 0;
}

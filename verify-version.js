#!/usr/bin/env node
/**
 * verify-version.js
 * يتأكد أن رقم "BEYDUN AGRO V<رقم>" في أعلى CHANGELOG.md يطابق
 * APP_VERSION في index.html. شغّله قبل كل تسليم:
 *
 *   node verify-version.js
 *
 * exit code 0 = متطابق، 1 = غير متطابق أو ملف مفقود.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const CHANGELOG_PATH = path.join(DIR, 'CHANGELOG.md');
const INDEX_PATH = path.join(DIR, 'index.html');

function fail(msg) {
  console.error('❌ ' + msg);
  process.exit(1);
}

if (!fs.existsSync(CHANGELOG_PATH)) fail('CHANGELOG.md غير موجود في ' + DIR);
if (!fs.existsSync(INDEX_PATH)) fail('index.html غير موجود في ' + DIR);

const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

// يبحث عن أول عنوان بصيغة: ## 🏷️ BEYDUN AGRO V<رقم>
const changelogMatch = changelog.match(/BEYDUN AGRO V(\d+)/i);
if (!changelogMatch) fail('لم يُعثر على عنوان "BEYDUN AGRO V<رقم>" في CHANGELOG.md');
const changelogVersion = changelogMatch[1];

// يبحث عن: var APP_VERSION = '<رقم>';
const appVersionMatch = indexHtml.match(/var\s+APP_VERSION\s*=\s*['"](\d+)['"]/);
if (!appVersionMatch) fail("لم يُعثر على 'var APP_VERSION = ...' في index.html");
const appVersion = appVersionMatch[1];

if (changelogVersion !== appVersion) {
  fail(
    'عدم تطابق الإصدار!\n' +
    '   CHANGELOG.md   → BEYDUN AGRO V' + changelogVersion + '\n' +
    '   index.html     → APP_VERSION = ' + appVersion + '\n' +
    '   حدّث أحدهما ليطابق الآخر قبل التسليم.'
  );
}

console.log('✅ الإصدار متطابق: BEYDUN AGRO V' + changelogVersion + ' = APP_VERSION ' + appVersion);
process.exit(0);

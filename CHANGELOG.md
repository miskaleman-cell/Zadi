## V20.18 — Dashboard cleanup and expanded invoice rows fix
- Removed the "Stock alerts" panel (unpriced-items list) from the dashboard; "Recent movements" now uses the full width. The bell alerts center and the price-management unpriced filter are unchanged.
- Fixed clipped content when expanding a customer invoice in the movement log: the details table was forced to 500px wide and its location column fell off-screen on phones. It now fits the screen at 360/390/412px in Arabic and Turkish.
- The location column in expanded invoices now shows only the warehouse (the customer is already in the row header), which makes rows shorter and easier to read.
- No stock, invoice, customer, or backup data format was changed.
- Tested in headless Chromium: all pages in two languages at three phone widths, about 1,400 randomized create/edit/cancel operations (no stock-invariant violations), backup round-trip, reload persistence. Excel export, printing, PWA install and real iOS/Android devices were not tested.

## V20.17 — Aggregated invoice edit log and mobile layout fixes
- Each invoice now keeps ONE aggregated edit record that accumulates every edit instead of replacing the previous one. Changes are grouped by edit number and date; "before" values (customer, date, region, notes, season) come from the first edit, "after" values from the latest.
- Older single-edit records (V20.13/V20.14) merge automatically: their existing changes become edit 1 and the next save becomes edit 2.
- The record header shows the total number of changes and edits (for example "5 changes · 3 edits"), in Arabic and Turkish.
- Dashboard "Recent movements" table now fits the card on phones (fixed column widths, no hidden type/quantity columns).
- About page: large statistic values (such as stock value) no longer clip; the system label now follows APP_VERSION instead of the fixed "v4.0".
- Grouped movement-log rows (invoice summaries and edit records) stay inside the screen width on phones, so the date is no longer cut off.
- No stock, invoice, customer, or backup data format was changed; existing backups load unchanged.
- Tested in headless Chromium: 24 pages x 2 languages x 2 phone widths with no overflow or JS errors, about 1,400 randomized create/edit/cancel operations with no stock-invariant violations, backup round-trip, reload persistence, and forced-failure rollback. Excel export, printing, PWA install and real iOS/Android devices were not tested.

## V20.16 — Dashboard and About page mobile fixes
- Fixed dashboard warehouse-distribution cards overflowing the phone viewport; cards now wrap into a responsive two-column layout (one column on very narrow screens).
- Prevented About-page statistic and feature cards from being clipped and constrained their contents on mobile.
- Updated the manager display name to MAHMUD BİDOUN.
- Forced the contact phone number to render left-to-right in Arabic and Turkish layouts while preserving its tap-to-call link.
- Synchronized the in-app APP_VERSION with this release number.

## V20.15 — Mobile UI clarity and responsive layout
- Increased contrast and touch target size for the invoice “Add row” button on its dark toolbar.
- Reflowed movement-log search, filter, and Excel controls on phones so none are pushed off-screen.
- Fixed the price-management unpriced filter button: removed the literal JavaScript template expression and connected the label to the Arabic/Turkish translation key.
- Reflowed price-management actions into a two-column mobile toolbar with readable button contrast.
- Changed customer statistics from four narrow columns to a two-by-two grid on phones; constrained card contents to prevent clipping.
- Added mobile bottom spacing so the customer list and remaining page content can scroll above the fixed bottom navigation.
- No customer, invoice, stock, or backup data was modified.
- JavaScript syntax and ZIP integrity checks passed; a full interactive browser/device test was not available.

## V20.14 — Invoice edit integrity and movement-log fixes
- Prevented empty reference units from being rewritten as “—” on unchanged saves.
- No-op invoice saves now create no movement/edit record and do not touch stock.
- Invoice metadata changes (customer, region, date, notes, season) are recorded.
- Edit comparison is row-based, preserving duplicate-product rows and detecting second-row price changes.
- Missing legacy stock items no longer block metadata-only invoice edits; changing their product/quantity/warehouse is still rejected safely.
- Added/removed/renamed products and warehouse changes are described in the edit log.
- New customer names are added to the customer register.
- Blank drug names now produce validation errors.
- Edit entries are excluded from OUT filtering and dashboard stock movement summaries.
- Movement Excel export renders edit notes as readable text instead of raw JSON.
- Cancelling an invoice also removes its invoice-edit summary.
- Added narrow-screen layout rules for the before/after column.

## 🏷️ BEYDUN AGRO V20.13 — 8 November 2026
### سجل واضح لتعديلات الفواتير بدلاً من أسطر استرجاع المخزون المتكررة
- عند تعديل فاتورة، لا تُضاف حركات RestoreInv منفصلة لكل دواء؛ يُعاد المخزون داخلياً دون تشويش سجل الحركات.
- يُضاف سجل تعديل واحد مرتبط برقم الفاتورة والزبون، ويظهر كسطر قابل للفتح داخل جدول سجل الحركات.
- تعرض القائمة المنسدلة الفروقات لكل دواء: الكمية قبل/بعد، السعر قبل/بعد، الخصم، والأصناف المضافة أو المحذوفة.
- إذا تغيّر اسم الزبون، يظهر اسم الزبون السابق والجديد.
- أسطر RestoreInv القديمة الخاصة بالفواتير التي ما زالت موجودة تُخفى من سجل الحركات؛ استرجاعات الفواتير الملغاة تبقى ظاهرة.
- تبقى بيانات الفواتير والمخزون وسجلات المبيعات محفوظة؛ أضيف سجل التعديل ضمن movements المحفوظة أصلاً.
- تم فحص صياغة JavaScript، واختبار حساب الفروقات بأمثلة كمية وسعر؛ لم يتوفر اختبار متصفح فعلي شامل.

## 🏷️ BEYDUN AGRO V20.12 — 8 November 2026
### تجميع الفاتورة في قائمة منسدلة داخل جدول سجل الحركات
- تجميع حركات إخراج الأدوية التابعة للفاتورة الواحدة في صف واحد داخل الجدول، باستخدام قائمة منسدلة قابلة للفتح والإغلاق؛ دون بطاقات.
- عند فتح الصف تظهر تفاصيل الأدوية والكميات والمواقع، مع بقاء كل فاتورة مستقلة عن الأخرى.
- ترتيب الأدوية داخل القائمة يعتمد على ترتيب سطور الفاتورة في سجل المبيعات، وليس ترتيباً عكسياً أو ترتيب تاريخ الحركة.
- تبقى حركات الإدخال والنقل والمرتجعات وغيرها كسطور مستقلة.
- البحث والفلاتر والتحميل على دفعات تعمل على مستوى الفاتورة؛ البحث باسم دواء يعرض الفاتورة المطابقة كاملة عند فتحها.
- لم يتم تعديل بيانات المخزون أو المبيعات؛ التغيير في طريقة عرض سجل الحركات فقط.
- فحص صياغة JavaScript واختبار تجميعي محلي بفاتورة تجريبية يؤكد ترتيب الأدوية ووجود القائمة المنسدلة؛ لم يتوفر اختبار متصفح فعلي شامل.

## 🏷️ BEYDUN AGRO V20.10 — 8 November 2026
### تجميع مبيعات الفاتورة وتحسين ترتيب سجل الحركات
- تجميع جميع حركات إخراج الأدوية التابعة لرقم الفاتورة والعميل والتاريخ في سطر واحد قابل للفتح والإغلاق داخل سجل الحركات.
- عند فتح الفاتورة تظهر الأدوية وكمياتها بالترتيب نفسه الذي أُدخلت به في الفاتورة، بدلاً من عرض آخر دواء أولاً.
- يبقى البحث والفلاتر والتصفح على دفعات متاحاً، وتظل حركات الإدخال والنقل والمرتجعات ظاهرة كسجلات مستقلة.
- لم يتم تعديل بيانات المخزون أو سجلات المبيعات؛ التغيير خاص بطريقة عرض سجل الحركات.
- فحص صياغة JavaScript وبنية ZIP، واختبار تجميع فاتورة تجريبية وترتيب أسطرها؛ لم يتوفر اختبار متصفح فعلي كامل.

## 🏷️ BEYDUN AGRO V20.9 — 7 November 2026
### إصلاحات دقة المخزون وتعديل الفواتير والنسخ الاحتياطي
- منع اختيار صنف مطابق بالاسم والعبوة من مستودع مختلف عند عدم وجوده في المستودع المحدد؛ أصبح تطابق الصنف صارماً بحسب الاسم والعبوة والمستودع.
- تطبيق نفس منع الانتقال بين المستودعات عند اختيار الصنف في نموذج الفاتورة.
- إضافة حقلي الموسم الزراعي وملاحظات الفاتورة إلى نافذة تعديل الفاتورة، وحفظ القيم المعدلة بدلاً من الاحتفاظ بالملاحظات/الموسم القديمين دون قراءة المدخلات.
- جعل الموسم المحفوظ في تعديل الفاتورة يساوي اختيار المستخدم، أو الموسم المحسوب من تاريخ الفاتورة عند عدم اختيار موسم.
- منع تنزيل نسخة احتياطية ثانية تلقائياً بعد نجاح تنزيل Blob؛ يبقى مسار data URI احتياطياً عند فشل إنشاء Blob.
- إصلاح جذر حزمة ZIP بحيث تكون ملفات التطبيق مباشرة في جذر الأرشيف.
- فحص JavaScript syntax وفحص سلامة ZIP وبنية الحزمة؛ لم يتوفر اختبار شامل عبر متصفح فعلي في بيئة التنفيذ.

## 🏷️ BEYDUN AGRO V20.8 — 7 November 2026
### إزالة حقول تصنيف المحاصيل والاعتماد على ملاحظات الفاتورة
- إزالة قائمة المحصول من نموذج الفاتورة؛ يكتب المستخدم نوع المحصول أو الغرض في حقل ملاحظات الفاتورة الموجود أصلاً.
- إزالة فلتر المحصول من حاسبة الجرعات والإبقاء على فلتر الموسم.
- إزالة حقل المحصول وفلتره وعموده من صفحة وقت العلاج؛ الإبقاء على سبب الرش ونوع الاستخدام وتاريخ الرش وفترة الإعادة والمساحة.
- حفظ ملاحظات الفاتورة مع كل بند مبيعات مرتبط بالفاتورة، والحفاظ عليها عند تعديل الفاتورة.
- الإبقاء على بيانات المحاصيل القديمة داخل النسخ الاحتياطية دون حذفها أو تعديلها، لكنها لم تعد مطلوبة في الواجهة أو الحسابات.
- الإبقاء على اختيار الموسم الزراعي والفلاتر الموسمية كما هي.
- فحص صياغة JavaScript وملفات الحزمة بعد التعديل.

## 🏷️ BEYDUN AGRO V20.7 — 7 November 2026
### ربط الفواتير بوقت العلاج وحاسبة الجرعات وأنواع الأدوية + تحسين الجوال
- ربط كل بند فاتورة بتاريخ الفاتورة والعميل ومساحة أرضه المسجلة؛ تُستخدم المساحة تلقائياً كمساحة مرجعية في سجل وقت العلاج عند عدم إدخال مساحة مخصصة للبند.
- ربط بنود الفواتير بتصنيف الدواء والمادة الفعالة وفئة الخطورة الموجودة في قاعدة أنواع الأدوية، وبمرجع الجرعة المسجل للدواء إن وجد.
- حفظ مراجع الاستخدام المدخلة في الفاتورة تلقائياً داخل سجل جرعات الدواء مع رقم الفاتورة وتاريخها والعميل ومساحته، دون استبدال الجرعة المرجعية الأصلية.
- إظهار الفواتير المصنفة أو المرتبطة بمرجع جرعة في صفحة وقت العلاج تلقائياً. تاريخ الفاتورة هو تاريخ الاستخدام الافتراضي؛ لا يتم اختراع فترة إعادة أو جرعة غير مدخلة.
- ربط الحسابات التاريخية بكمية المبيع ومساحة العميل المسجلة وقت الفاتورة، وعرضها كمؤشر استهلاك تاريخي لكل دونم، وليس كتوصية جرعة زراعية.
- ترحيل سجلات الفواتير القديمة عند فتح صفحة وقت العلاج بقدر ما تسمح به بيانات العميل وتصنيف الدواء ومرجع الجرعة المتاح.
- تحسين عرض حاسبة الجرعات وأنواع الأدوية ووقت العلاج على الهاتف: تكديس الأعمدة، تكبير الحقول، وتحسين التمرير الأفقي للجداول.
- فحص JavaScript syntax، وفحص ملف ZIP، واختبار وحدات ربط مساحة العميل/تاريخ الفاتورة/تصنيف الدواء/مرجع الجرعة وحفظ مرجع الفاتورة بنجاح. لم يُنفذ اختبار شامل لكل تفاعلات التطبيق أو اختبار مرئي على جهاز المستخدم.

## 🏷️ BEYDUN AGRO V20.5 — 5 November 2026
### Turkish translation fixes and customer invoice simplification
- Translated the app-management navigation item and both app-management section headings through the shared Arabic/Turkish language catalog.
- Completed Turkish labels and placeholders in the customer form, including national ID, land area, and notes fields; applied the same translations during normal language switching and initial app loading.
- Removed the discount / İndirim column and input from the new customer invoice entry table. New invoices continue to calculate normally with no discount field; existing historical sales and their saved discount values are preserved.
- Removed the discount column from the customer-invoice Excel export while retaining discount information in sales-history reports where it is part of historical records.
- Preserved the existing embedded application data and all inventory, warehouse, customer, sales, return, and audit records.
- JavaScript syntax validation passed. Visual testing on the user's phone remains necessary.

## V20.4 — 5 November 2026
### Customer invoice and returns page layout
- Removed the discount/İndirim column from the printable customer invoice table. Discount calculations remain intact in invoice totals; this is a display-only removal.
- Reworked the returns page into a responsive layout: two panels on wider screens and vertically stacked panels on phones.
- Made return form fields full-width and vertically arranged on mobile to prevent overlap.
- Kept the returns log in a horizontally scrollable table container on narrow screens so columns do not collide.
- JavaScript syntax validation is required; visual behavior should be checked on the user's device.

## V19.5 — 4 November 2026
### Automatic pricing for historical invoices
- On startup, after the saved database and warehouse data are loaded, the app checks historical sales rows for a missing or zero price.
- If the matching product (name, package, and preferred warehouse, with existing fallback matching) has a current price greater than zero, that current price is copied into the historical invoice row.
- Existing non-zero historical prices are never overwritten. Rows with no matching product or no current price remain unchanged.
- Updated rows are saved through the existing persistence layer, so invoice totals and customer purchase summaries recalculate from the updated sales records.
- JavaScript syntax validation passed. Runtime behavior still needs confirmation with the user's actual saved data.

## V19.1 — 29 September 2026
### PDF pagination — rebuilt from V17
- **Base version is BEYDUN AGRO V17 — Translation Fixed**, the last version confirmed to load data correctly before the later technical changes.
- Re-applied only the warehouse inventory PDF pagination improvement requested by the user.
- Warehouse sections can now use remaining page space instead of forcing large blank areas.
- Table headers repeat when a table continues onto a new page.
- Individual rows are kept intact.
- Print margins and row spacing were reduced to fit more inventory rows per page.
- No changes were made to inventory quantities, prices, warehouses, sales, movements, returns, translation logic, backup logic, or application data.
- Service-worker cache version was advanced only to ensure the rebuilt application shell is loaded.

## V17 — 29 September 2026
### Arabic / Turkish translation audit
- Audited the language switching behavior across the application.
- Added a complete fallback pass that translates exact UI strings from the Arabic/Turkish translation catalog even when they are rendered outside `[data-key]`.
- Added missing common UI/category labels that were hard-coded outside the main translation catalog.
- Arabic mode keeps **drug names, packaging/unit text, and prices unchanged** as requested.
- Turkish mode translates the UI to Turkish while preserving **drug names, packaging/unit text, and prices**.
- Warehouse names continue to use their language-specific Arabic/Turkish fields.
- Added translation handling for placeholders, titles, and aria-labels when their values are part of the UI translation catalog.
- No inventory quantities, prices, drug names, packages, movements, sales, returns, audit records, or warehouse stock data were changed by this translation fix.

## V16 — 29 September 2026
### Warehouse control and unpriced medicines
- Enhanced **إدارة المستودعات / Depo Yönetimi** so every warehouse has a delete control.
- A warehouse can only be deleted when it contains no products; the application blocks deletion of a non-empty warehouse to protect stock data.
- The application also prevents deleting the final remaining warehouse.
- Added an **الأدوية غير المسعرة / Fiyatsız İlaçlar** filter in **إدارة الأسعار / Fiyat Yönetimi**.
- When enabled, the price page shows only products whose price is zero or empty, so they can be edited directly.
- The unpriced filter respects the V15 zero-stock visibility rule: zero-stock products remain hidden from normal price lists and searches.
- No stock quantities, movements, sales, returns, audit logs, or historical records were changed by this update.

## V15 — 29 September 2026
### Zero-stock visibility rule
- Zero-stock products (`qty = 0`) are now hidden from normal product lists and product searches throughout the application.
- This applies to inventory/warehouse lists, the all-products list, price/product lists, reports/product selection lists, dose/medicine selection lists, purchase product selectors, and other normal product pickers/searches.
- The dedicated **الأدوية المنتهية / Tükenen İlaçlar** list remains the exception and continues to show all `qty = 0` products.
- Historical records such as sales, movements, audit logs, returns, and other transaction history are not deleted or altered by this visibility rule.
- No stock quantities were changed.

# BEYDUN AGRO — CHANGELOG

## V14 — 29 September 2026
### Documentation / Release consolidation
- Consolidated the change history from the V7 baseline through V14.
- Documented the product-name, package/unit, price, and classification synchronization work.
- Documented the inventory-safety requirement: stock quantities, warehouse assignments, and historical transaction records were preserved during the synchronization work.
- Documented the Excel-based `HASTALIK-ZARARLI` classification synchronization.
- Recorded the five products for which no reliable `HASTALIK-ZARARLI` match was found and therefore no classification was guessed:
  - BOROPLUS
  - EFA LEAF
  - GAXY
  - SOL FERT — 1 LT
  - SOL FERT — 5 LT

## V13 — 29 September 2026
### HASTALIK-ZARARLI synchronization
- Synchronized the application's medicine-type/classification data with the `HASTALIK-ZARARLI` column in the Excel reference file `2027 SATIŞ FİYAT LİSTESİ.xlsx`.
- Matched 210 of 215 inventory/product records to a reliable Excel classification.
- Preserved the existing internal classification data as a compatibility layer rather than deleting it.
- Did not alter stock quantities, warehouse assignments, prices, or historical movement records as part of the classification update.
- Left five records without a guessed classification because no reliable Excel match was established:
  - BOROPLUS
  - EFA LEAF
  - GAXY
  - SOL FERT — 1 LT
  - SOL FERT — 5 LT

## V12 — 29 September 2026
### Selected package/unit corrections
Applied only the seven explicitly requested package/unit changes:
1. COCOLY: 20 KG → 25 KG
2. CARLOS: 1 KG → 2.5 KG
3. FASCINATE: 1 LT → 1 KG
4. ODEON: 1 KG → 800 GR
5. VITASEVE: 10 LT → 10 KG
6. ANTHOLOGY: PAKET → 600 GR
7. DEFENTOX: 0.25 ML → 250 ML

- No stock quantities were changed.
- No additional package/unit changes were applied beyond the seven requested changes.

## V11 — 29 September 2026
### Excel-based product name/package synchronization
- Updated product names to follow the names in the 2027 Excel price list.
- Updated package/unit descriptions while taking package size into account.
- Examples included:
  - AXLERON 250 ML → AXLERON 200 CC
  - COCOLY 20 KG → COCOLY 25 KG
  - CARLOS 1 KG → CARLOS 2.5 KG
  - ODEON 1 KG → ODEON 50 WP 800 GR
  - DEFENTOX 0.25 ML → DEFENTOX 250 ML
- Preserved inventory quantities during the name/package synchronization.
- The Excel list was used as the naming/package reference.

## V10 — 29 September 2026
### Price correction
- Corrected ANTHOLOGY price from 2,250 to 3,500 based on the 2027 Excel price list.
- Added update handling so previously stored data could receive the corrected price.
- No inventory quantity change was intended by this correction.

## V9 — 29 September 2026
### 2027 product-name alignment
- Updated product names to align with the 2027 Excel price list.
- The source changelog recorded 127 product-name changes and 74 already-matching names.
- Package values were intended to remain unchanged in that release.

## V8 — 29 September 2026
### 2026–2027 price update
- Updated sales prices for the 2026–2027 season according to the application's release history.

## V7 — baseline
- Baseline version used for the detailed V7 → later-version inventory comparison.
- Later synchronization work was designed to preserve stock quantities and historical operational records while updating descriptive/reference data.


## V19.6
- Added a per-line warehouse selector to the historical invoice editor. Selected warehouse is saved with the edited invoice line and drives stock lookup/deduction.

## V19.7 — إصلاح تعديل العملاء الضيوف
- عند تعديل عميل ظاهر في سجل العملاء لكنه غير مسجل ببطاقة عميل، يتم ربط بياناته الجديدة بسجلات مبيعاته ومرتجعاته السابقة.
- عند تغيير الاسم، يتم تحديث اسم العميل في الحركات التاريخية بدلاً من فصلها عن العميل.
- يبقى مسار تعديل العملاء المسجلين كما هو.

## V19.8 — ترتيب العملاء وتحديث مؤشرات الجرعات
- أصبح سجل العملاء مرتباً أبجدياً حسب الاسم بدلاً من ترتيب إجمالي المشتريات.
- بعد حفظ تعديل مساحة الدونم، يتم تحديث مؤشرات الاستهلاك التاريخي لكل دونم فوراً، وإعادة حساب الحاسبة إذا كانت صفحة الجرعات مفتوحة.
- لم يتم تغيير الجرعات الأساسية المحفوظة للأدوية؛ المؤشرات التاريخية تبقى بيانات استهلاك وليست توصية جرعة زراعية.

## V19.9 — تحسين واجهة تعديل الفاتورة على الهاتف
- تكبير حقل اختيار الدواء وجعله بعرض كامل السطر.
- ترتيب الكمية والسعر والخصم والحذف في صف مستقل وواضح.
- تكبير حقول الإدخال واختيار المستودع وتحسين المسافات والبطاقات.
- جعل حقول العميل والمنطقة والتاريخ ورقم الفاتورة عمودية على الشاشات الضيقة.
- إزالة التمرير الداخلي المحدود لقائمة الأصناف لتسهيل استخدام الصفحة.


## V20.0 – إدارة التطبيق وترتيب القوائم
- نقل فئة المبيعات لتظهر أعلى فئة العمليات في القائمة الجانبية.
- إضافة صفحة إدارة التطبيق قبل النسخة الاحتياطية.
- إعداد وضع عرض الجوال/الحاسوب وحجم الخط.
- إضافة وضع سحب وإفلات لترتيب أزرار القائمة وحفظ الترتيب محلياً.

## V20.1 — ترتيب سجل الحركات حسب تاريخ العملية
- أصبح سجل الحركات يعرض الأحدث حسب تاريخ الحركة نفسه، وليس حسب ترتيب إدخالها في النظام.
- إدخال حركة بتاريخ سابق لن يجعلها تظهر قبل الحركات ذات التاريخ الأحدث.
- سجل التعديلات لم يتغير؛ يبقى مرتّباً حسب وقت تسجيل التعديل لمعرفة متى نُفذت العملية فعلياً.

## V20.2 – إزالة زر عرض سطح المكتب ومراجعة الترجمة
- إزالة زر عرض سطح المكتب العائم من واجهة الجوال؛ يبقى اختيار وضع العرض ضمن إدارة التطبيق.
- إعادة تطبيق قاموس الترجمة العربية/التركية بعد إعادة رسم الصفحة لتقليل بقاء النصوص الثابتة بلغة سابقة.
- توسيع قاموس النصوص الثابتة لإعدادات العرض وحجم الخط.
- لم تتم ترجمة أسماء المنتجات أو العملاء أو بيانات المستخدم المدخلة.

## V20.3 — مراجعة استكمال الترجمة العربية والتركية
- إضافة ترجمات ثنائية الاتجاه لعناوين وإعدادات إدارة التطبيق وخيارات وضع العرض وحجم الخط وترتيب الأزرار.
- استكمال ترجمة عناوين وحقول البحث في صفحة أنواع الأدوية والتراكيب، بما فيها خيارات القوائم المنسدلة.
- إضافة ترجمات للحقول والعبارات الثابتة التي ظهرت بالعربية أثناء اختيار التركية والعكس.
- لم تتم ترجمة أسماء العملاء أو الأدوية أو البيانات التي يدخلها المستخدم.


## V20.7 — المحاصيل والمواسم الزراعية
- إضافة قائمة محاصيل تشمل الثوم والزيتون والفستق الحلبي والباذنجان والفلفل والقطن ومحاصيل أخرى في الفاتورة وحاسبة الجرعات.
- إضافة اختيار الموسم الزراعي للفاتورة، مع اقتراح تلقائي وفق التاريخ (سبتمبر–يونيو) وإمكانية التغيير اليدوي.
- حفظ الموسم والمحصول مع بنود المبيعات، والحفاظ على بيانات الموسم عند تعديل الفاتورة.
- إضافة فلاتر الموسم والمحصول لمؤشرات المبيعات التاريخية لكل دواء، وفلاتر الموسم لصفحة وقت العلاج.
- مؤشرات المبيعات تبقى بيانات بيع تاريخية وليست جرعات زراعية معتمدة.


## V20.11 — ترتيب الأدوية في سجل الحركات
- إلغاء تجميع/طيّ فواتير البيع في سجل الحركات؛ بقي عرض السطور في الجدول المعتاد.
- الحفاظ على ترتيب الأدوية داخل كل فاتورة كما أُدخلت في الفاتورة الأصلية.
- استمرار عرض أحدث التواريخ أولاً، مع ثبات ترتيب السجلات داخل التاريخ نفسه.
- الحفاظ على البحث والتصفية والتحميل التدريجي للحركات.

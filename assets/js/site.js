(function () {
  "use strict";

  /* ============ DATA: 60 tools ============ */
  var ICONS = {
    layers: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5m-18 5l9 5 9-5"/>',
    scissors: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 9.75L20 20m-10.25-10.25L4 20M9.75 9.75L20 4M9.75 9.75L4 4m0 0a2.5 2.5 0 103 3m-3-3a2.5 2.5 0 103 3M20 20a2.5 2.5 0 11-3-3m3 3a2.5 2.5 0 11-3-3"/>',
    zip: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3v18M11 3v3m0 3v2m0 2v2m0 2v3m-4-6h4m6-9h4a2 2 0 012 2v10a2 2 0 01-2 2h-4"/>',
    rotate: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M4.5 15a8 8 0 0014.9 2.5M19.5 9A8 8 0 004.6 6.5"/>',
    grid: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>',
    wrench: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a4 4 0 11-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4z"/>',
    convert: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M4 4h16v16H4V4z"/>',
    doc: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    image: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M4 4h16v16H4V4z"/>',
    pencil: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>',
    highlight: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3 3L22 4M3 21h6l11-11-6-6L3 15v6z"/>',
    redact: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm3.5 3.5l11-11"/>',
    watermark: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>',
    tag: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5.586a1 1 0 01.707.293l7.414 7.414a1 1 0 010 1.414l-8.586 8.586a1 1 0 01-1.414 0L3.293 13.293A1 1 0 013 12.586V7a4 4 0 014-4z"/>',
    flatten: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>',
    number: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>',
    crop: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2"/>',
    formImg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7h4a3 3 0 010 6H9m10-6v10"/>',
    shield: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l8 4v5c0 5-3.5 9-8 11-4.5-2-8-6-8-11V6l8-4z"/>',
    lock: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>',
    unlock: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0M6 11h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"/>',
    signature: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 17s2-1 4-1 3 2 5 2 3-2 5-2 4 1 4 1M4 12c2-4 5-9 7-9s2 5 1 9-3 8-1 8 5-4 7-8"/>',
    chat: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.16-3.02-.457L3 21l1.5-4.5C3.55 15.14 3 13.62 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>',
    sparkles: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>',
    translate: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m0 0a15 15 0 01-4 9m4-9a15 15 0 004 6m-8 4l4-9m8 12l-4-9-4 9m1.5-3h5"/>',
    quiz: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    scan: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7V5a2 2 0 012-2h2M4 17v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2"/>',
    compress: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h6v6M20 10h-6V4M14 10l7-7M4 21l7-7"/>',
    reader: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.5C10.5 5 8 4.5 6 5v13c2 0 4.5.5 6 2 1.5-1.5 4-2 6-2V5c-2-.5-4.5 0-6 1.5z"/>',
    compare: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h2m6-16h2a2 2 0 012 2v12a2 2 0 01-2 2h-2M12 3v18"/>'
  };

  var TOOLS = [
    { n: "Merge PDF", d: "Combine multiple files into one document.", h: "/tools/merge-pdf", c: "organize", i: "layers" },
    { n: "Split PDF", d: "Break a PDF into separate files by page.", h: "/tools/split-pdf", c: "organize", i: "scissors" },
    { n: "Compress PDF", d: "Shrink file size without losing quality.", h: "/tools/compress-pdf", c: "organize", i: "compress" },
    { n: "Rotate PDF", d: "Fix sideways or upside-down pages.", h: "/tools/rotate-pdf", c: "organize", i: "rotate" },
    { n: "Organize PDF", d: "Reorder, add, or delete pages visually.", h: "/tools/organize-pdf", c: "organize", i: "grid" },
    { n: "Repair PDF", d: "Recover a corrupted or damaged file.", h: "/tools/repair-pdf", c: "organize", i: "wrench" },
    { n: "PDF to Word", d: "Convert to an editable .docx file.", h: "/tools/pdf-to-word", c: "convert", i: "convert" },
    { n: "Word to PDF", d: "Turn a Word document into a PDF.", h: "/tools/word-to-pdf", c: "convert", i: "doc" },
    { n: "PDF to Excel", d: "Extract tables into a spreadsheet.", h: "/tools/pdf-to-excel", c: "convert", i: "convert" },
    { n: "Excel to PDF", d: "Convert spreadsheets to PDF.", h: "/tools/excel-to-pdf", c: "convert", i: "doc" },
    { n: "PDF to PPT", d: "Turn slides in a PDF into PowerPoint.", h: "/tools/pdf-to-ppt", c: "convert", i: "convert" },
    { n: "PPT to PDF", d: "Convert a presentation to PDF.", h: "/tools/ppt-to-pdf", c: "convert", i: "doc" },
    { n: "PDF to JPG", d: "Export pages as JPG images.", h: "/tools/pdf-to-jpg", c: "convert", i: "image" },
    { n: "JPG to PDF", d: "Combine images into a single PDF.", h: "/tools/jpg-to-pdf", c: "convert", i: "image" },
    { n: "PNG to PDF", d: "Combine PNGs into a single PDF.", h: "/tools/png-to-pdf", c: "convert", i: "image" },
    { n: "PDF to PNG", d: "Export pages as PNG images.", h: "/tools/pdf-to-png", c: "convert", i: "image" },
    { n: "HTML to PDF", d: "Convert a web page into a PDF.", h: "/tools/html-to-pdf", c: "convert", i: "convert" },
    { n: "PDF to Text", d: "Extract plain text from a PDF.", h: "/tools/pdf-to-text", c: "convert", i: "doc" },
    { n: "Text to PDF", d: "Turn plain text into a formatted PDF.", h: "/tools/text-to-pdf", c: "convert", i: "doc" },
    { n: "EPUB to PDF", d: "Convert an e-book to PDF.", h: "/tools/epub-to-pdf", c: "convert", i: "convert" },
    { n: "PDF to EPUB", d: "Convert a PDF into an e-book.", h: "/tools/pdf-to-epub", c: "convert", i: "convert" },
    { n: "PDF to ZIP", d: "Package pages or files into a ZIP.", h: "/tools/pdf-to-zip", c: "convert", i: "zip" },
    { n: "ZIP to PDF", d: "Convert files inside a ZIP to PDF.", h: "/tools/zip-to-pdf", c: "convert", i: "zip" },
    { n: "Image Converter", d: "Convert between image formats.", h: "/tools/image-converter", c: "convert", i: "image" },
    { n: "PDF Editor", d: "Edit text and objects directly.", h: "/tools/pdf-editor", c: "edit", i: "pencil" },
    { n: "Annotate PDF", d: "Add comments and markup.", h: "/tools/annotate-pdf", c: "edit", i: "pencil" },
    { n: "Highlight PDF", d: "Highlight important passages.", h: "/tools/highlight-pdf", c: "edit", i: "highlight" },
    { n: "Redact PDF", d: "Permanently black out sensitive text.", h: "/tools/redact-pdf", c: "edit", i: "redact" },
    { n: "Watermark PDF", d: "Stamp a text or image watermark.", h: "/tools/watermark-pdf", c: "edit", i: "watermark" },
    { n: "Remove Watermark", d: "Clean up an existing watermark.", h: "/tools/remove-watermark", c: "edit", i: "watermark" },
    { n: "Add Image to PDF", d: "Insert an image onto any page.", h: "/tools/add-image-to-pdf", c: "edit", i: "formImg" },
    { n: "Add Page Numbers", d: "Insert numbering in any style.", h: "/tools/add-page-numbers", c: "edit", i: "number" },
    { n: "Metadata Editor", d: "Edit title, author, and tags.", h: "/tools/metadata-editor", c: "edit", i: "tag" },
    { n: "Flatten PDF", d: "Merge form fields and layers into the page.", h: "/tools/flatten-pdf", c: "edit", i: "flatten" },
    { n: "Crop PDF", d: "Trim margins or resize the page area.", h: "/tools/crop-pdf", c: "edit", i: "crop" },
    { n: "Extract Images", d: "Pull every image out of a PDF.", h: "/tools/extract-images", c: "edit", i: "image" },
    { n: "Fill PDF Forms", d: "Complete forms without printing.", h: "/tools/fill-pdf-forms", c: "edit", i: "formImg" },
    { n: "Protect PDF", d: "Add a password to a file.", h: "/tools/protect-pdf", c: "security", i: "lock" },
    { n: "Unlock PDF", d: "Remove a password you own.", h: "/tools/unlock-pdf", c: "security", i: "unlock" },
    { n: "Sign PDF", d: "Add a legally-recognized signature.", h: "/tools/sign-pdf", c: "security", i: "signature" },
    { n: "Chat with PDF", d: "Ask questions about a document.", h: "/tools/chat-with-pdf", c: "ai", i: "chat" },
    { n: "Explain PDF", d: "Get a plain-language walkthrough.", h: "/tools/explain-pdf", c: "ai", i: "sparkles" },
    { n: "Summarize PDF", d: "Condense long documents fast.", h: "/tools/pdf-summarizer", c: "ai", i: "sparkles" },
    { n: "Translate PDF", d: "Translate a document, layout intact.", h: "/tools/pdf-translator", c: "ai", i: "translate" },
    { n: "Rewrite PDF", d: "Simplify or restyle the writing.", h: "/tools/rewrite-pdf", c: "ai", i: "pencil" },
    { n: "Generate Quiz", d: "Turn study material into questions.", h: "/tools/generate-quiz", c: "ai", i: "quiz" },
    { n: "OCR PDF", d: "Make scanned pages searchable.", h: "/tools/ocr-pdf", c: "ai", i: "scan" },
    { n: "OCR Image", d: "Extract text from a photo or scan.", h: "/tools/ocr-image", c: "ai", i: "scan" },
    { n: "PDF Reader", d: "View PDFs in a clean, fast reader.", h: "/tools/pdf-reader", c: "utility", i: "reader" },
    { n: "Compare PDF", d: "Spot differences between two files.", h: "/tools/compare-pdf", c: "utility", i: "compare" },
    { n: "Scan to PDF", d: "Turn phone photos into a clean scan.", h: "/tools/scan-to-pdf", c: "utility", i: "scan" },
    { n: "Image Compressor", d: "Shrink JPG and PNG file sizes.", h: "/tools/image-compressor", c: "utility", i: "compress" },
    { n: "Extract Pages", d: "Pull specific pages into a new file.", h: "/tools/extract-pages", c: "utility", i: "scissors" },
    { n: "Remove Pages", d: "Delete unwanted pages.", h: "/tools/remove-pages", c: "utility", i: "scissors" },
    { n: "Duplicate Pages", d: "Copy a page within a document.", h: "/tools/duplicate-pages", c: "utility", i: "grid" },
    { n: "Remove Blank Pages", d: "Auto-detect and strip blank pages.", h: "/tools/remove-blank-pages", c: "utility", i: "grid" }
  ];

  var CATEGORIES = [
    { key: "organize", name: "Organize", desc: "Merge, split, compress, and clean up page order.", from: "#2563EB", to: "#1D4ED8", icon: "layers" },
    { key: "convert", name: "Convert", desc: "Move between PDF, Office, image, and text formats.", from: "#3B82F6", to: "#2563EB", icon: "convert" },
    { key: "edit", name: "Edit & annotate", desc: "Mark up, watermark, redact, and fine-tune pages.", from: "#0EA5E9", to: "#2563EB", icon: "pencil" },
    { key: "security", name: "Security", desc: "Password-protect, unlock, and sign documents.", from: "#22C55E", to: "#16A34A", icon: "shield" },
    { key: "ai", name: "AI-powered", desc: "Summarize, translate, and chat with your files.", from: "#7C3AED", to: "#5B21B6", icon: "sparkles" },
    { key: "utility", name: "Utilities", desc: "Read, compare, scan, and manage individual pages.", from: "#F97316", to: "#EA580C", icon: "reader" }
  ];

  function icon(name, cls) {
    return '<svg class="' + cls + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + (ICONS[name] || ICONS.doc) + '</svg>';
  }

  /* ============ Render category cards ============ */
  var catWrap = document.getElementById("categoryCards");
  if (catWrap) {
    catWrap.innerHTML = CATEGORIES.map(function (c, idx) {
      var count = TOOLS.filter(function (t) { return t.c === c.key; }).length;
      return (
        '<a href="#tools" data-filter="' + c.key + '" class="cat-card group reveal bg-white dark:bg-surface-card border border-borderc dark:border-surface-border rounded-card p-6 block" style="transition-delay:' + (idx * 50) + 'ms">' +
          '<div class="w-11 h-11 rounded-xl grad-icon flex items-center justify-center mb-5" style="--from:' + c.from + ';--to:' + c.to + '">' +
            icon(c.icon, "w-5 h-5 text-white") +
          "</div>" +
          '<h3 class="font-700 text-lg text-heading dark:text-white mb-1.5">' + c.name + "</h3>" +
          '<p class="text-sm text-body dark:text-gray-400 leading-relaxed mb-4">' + c.desc + "</p>" +
          '<div class="flex items-center justify-between">' +
            '<span class="text-xs font-600 text-gray-400">' + count + " tools</span>" +
            '<span class="arrow inline-flex items-center gap-1 text-sm font-600 text-primary">Explore ' + icon("convert", "w-3.5 h-3.5 hidden") + '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></span>' +
          "</div>" +
        "</a>"
      );
    }).join("");
  }

  /* ============ Render tools grid ============ */
  var grid = document.getElementById("toolsGrid");
  var noResults = document.getElementById("noResults");
  var currentCat = "all";
  var currentQuery = "";

  function renderGrid(filter, query) {
    if (!grid) return;
    currentCat = filter !== undefined ? filter : currentCat;
    currentQuery = query !== undefined ? query : currentQuery;

    var list = currentCat === "all" ? TOOLS : TOOLS.filter(function (t) { return t.c === currentCat; });
    if (currentQuery) {
      var q = currentQuery.trim().toLowerCase();
      list = list.filter(function (t) {
        return t.n.toLowerCase().indexOf(q) !== -1 || t.d.toLowerCase().indexOf(q) !== -1;
      });
    }

    if (noResults) noResults.classList.toggle("show", list.length === 0);
    grid.innerHTML = list.map(function (t) {
      var accent = t.c === "ai" ? "ai" : "primary";
      return (
        '<a href="' + t.h + '" class="tool-card group bg-white dark:bg-surface-card border border-borderc dark:border-surface-border rounded-card p-5 flex items-start gap-4">' +
          '<div class="w-10 h-10 rounded-lg bg-' + (t.c === "ai" ? "ai/10" : "primary-50 dark:bg-primary/10") + ' flex items-center justify-center shrink-0">' +
            icon(t.i, "w-[18px] h-[18px] text-" + accent) +
          "</div>" +
          '<div class="min-w-0 flex-1">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<h3 class="font-600 text-[15px] text-heading dark:text-white truncate">' + t.n + "</h3>" +
              '<svg class="arrow w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' +
            "</div>" +
            '<p class="text-sm text-body dark:text-gray-400 mt-0.5 leading-snug">' + t.d + "</p>" +
          "</div>" +
        "</a>"
      );
    }).join("");
  }
  renderGrid("all");

  /* ============ Filter tabs ============ */
  var tabs = document.querySelectorAll(".filter-tab");
  function setFilter(cat) {
    tabs.forEach(function (btn) {
      btn.setAttribute("aria-selected", btn.getAttribute("data-cat") === cat ? "true" : "false");
    });
    renderGrid(cat, undefined);
  }
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () { setFilter(btn.getAttribute("data-cat")); });
  });
  document.querySelectorAll("[data-filter]").forEach(function (el) {
    el.addEventListener("click", function () {
      var cat = el.getAttribute("data-filter");
      setTimeout(function () { setFilter(cat); }, 50);
      var toolsSection = document.getElementById("tools");
      if (toolsSection) toolsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ============ Search box ============ */
  var searchInput = document.getElementById("toolSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderGrid(undefined, searchInput.value);
    });
  }

  /* ============ Navbar scroll state ============ */
  var nav = document.getElementById("navbar");
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("solid");
    else nav.classList.remove("solid");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============ Mega menu ============ */
  var megaTrigger = document.getElementById("megaTrigger");
  var megaBtn = document.getElementById("megaBtn");
  var megaChev = document.getElementById("megaChev");
  if (megaTrigger) {
    var closeTimer;
    function openMega() {
      clearTimeout(closeTimer);
      megaTrigger.classList.add("mega-open");
      megaBtn.setAttribute("aria-expanded", "true");
      megaChev.style.transform = "rotate(180deg)";
    }
    function closeMega() {
      closeTimer = setTimeout(function () {
        megaTrigger.classList.remove("mega-open");
        megaBtn.setAttribute("aria-expanded", "false");
        megaChev.style.transform = "rotate(0deg)";
      }, 120);
    }
    megaTrigger.addEventListener("mouseenter", openMega);
    megaTrigger.addEventListener("mouseleave", closeMega);
    megaBtn.addEventListener("click", function () {
      megaTrigger.classList.contains("mega-open") ? closeMega() : openMega();
    });
  }

  /* ============ Dark mode ============ */
  var darkToggle = document.getElementById("darkToggle");
  var root = document.documentElement;
  function applyTheme(theme) {
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }
  var stored = null;
  try { stored = localStorage.getItem("pdfly-theme"); } catch (e) {}
  if (stored) applyTheme(stored);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) applyTheme("dark");

  if (darkToggle) {
    darkToggle.addEventListener("click", function () {
      var next = root.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("pdfly-theme", next); } catch (e) {}
    });
  }

  /* ============ Mobile menu ============ */
  var mobileBtn = document.getElementById("mobileMenuBtn");
  var mobileNav = document.getElementById("mobileNav");
  if (mobileBtn) {
    mobileBtn.addEventListener("click", function () {
      mobileNav.classList.toggle("hidden");
    });
  }

  /* ============ Dropzone ============ */
  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  if (dropzone) {
    dropzone.addEventListener("click", function () { fileInput.click(); });
    dropzone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
    ["dragenter", "dragover"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.add("drag"); });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); });
    });
    dropzone.addEventListener("drop", function (e) {
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) {
        document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* ============ FAQ accordion ============ */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    q.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      document.querySelectorAll(".faq-item").forEach(function (el) { el.setAttribute("data-open", "false"); });
      item.setAttribute("data-open", isOpen ? "false" : "true");
    });
  });

  /* ============ Reveal on scroll ============ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
})();

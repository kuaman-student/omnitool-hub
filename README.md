# ⚡ OmniTool Hub — 1,050+ Client-Side Tool Catalog

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge)](https://kuaman-student.github.io/omnitool-hub/)
![Version](https://img.shields.io/badge/Version-5.0-6366f1?style=for-the-badge)
![Catalog entries](https://img.shields.io/badge/Catalog_entries-1,050+-10b981?style=for-the-badge)
![Categories](https://img.shields.io/badge/Categories-28-f59e0b?style=for-the-badge)
![Processing](https://img.shields.io/badge/Processing-Local_File_Operations-ec4899?style=for-the-badge)

**OmniTool Hub** is a zero-server web application with a searchable catalog of **1,050 named tool entries** across **28 categories**. The catalog is broader than the currently implemented feature set: each workspace identifies what it supports, and unfinished operations are labeled rather than returning an unrelated result.

Implemented file operations run in your browser; this app does not upload files to a processing server. The page and its libraries load from external CDNs. Sharing output or using an external service can send content to the destination you choose.

---

## 🌐 Live Website (GitHub Pages)

🚀 **Try it live right now in your browser:**  
👉 **[https://kuaman-student.github.io/omnitool-hub/](https://kuaman-student.github.io/omnitool-hub/)**

---

## ✨ What Makes OmniTool Hub Special?

- **🔎 1,050+ Searchable Catalog Entries:** Each entry has an ID (`#1` to `#1050`); entries with unfinished implementations are marked in their workspace.
- **📤 Direct Share (No Download Required):** Powered by the native Web Share API (`navigator.share`), you can send processed PDFs, edited images, QR codes, and text outputs straight to WhatsApp, Telegram, Email, or AirDrop without cluttering your local storage.
- **🎨 10 Live Chameleon Themes:** Switch effortlessly between *Nebula Glass, Cyberpunk 2077, Aurora Emerald, Sunset Synthwave, Deep Ocean, Crimson Matrix, Royal Gold, Arctic Daylight, Sakura Blossom,* and *Retro Terminal*.
- **✨ 3D Spotlight UI & Dual Views:** Features cursor-tracking radial spotlight cards, a Bento Grid view, a Compact Command list view, and a responsive mobile bottom navigation dock.
- **🔒 Local File Processing:** Supported file operations run in browser memory; files are not sent to a processing server.

---

## 🛠️ Core Interactive Engines Included

1. **📄 PDF tools (`pdf-lib`):** Merge PDFs, split/extract selected page ranges, delete/reorder/duplicate pages, rotate/reverse pages, insert blank or source-PDF pages, add text/page numbers, and edit the document title. PDF comparison currently reports page counts and file sizes only.
2. **🖼️ Image & Canvas workspace (`HTML5 Canvas`):** Selected operations support resize, compression/export, filters, rotation, flipping, text overlay, and PNG/JPG/WebP conversion; other image catalog entries are marked unavailable. Images-to-PDF accepts PNG, JPG, WebP, or SVG images only.
3. **🗜️ ZIP tools (`JSZip`):** Create ZIP archives and extract files from a ZIP archive individually.
4. **💻 Selected developer utilities:** Format/minify JSON, encode/decode Base64, calculate SHA-256/SHA-512, generate UUIDs/passwords, ROT13, and defang URLs.
5. **📊 CSV workspace:** Parse quoted CSV fields, convert to JSON, deduplicate/sort rows, and report dataset statistics.
6. **📈 Selected financial calculators:** GST, EMI, SIP, cash runway, discount, gross margin/markup, ROI, CAC, LTV, recurring revenue, break-even, CAGR, ROAS, and ad metrics.
7. **🎬 Selected media & QR utilities:** Browser text-to-speech, media preview/metadata, video thumbnail capture, QR generation, and QR decoding from images.
8. **🧮 Arithmetic workspace:** Evaluate numeric expressions with parentheses and standard arithmetic operators. Other catalog entries are not implied to be implemented by this workspace.
9. **🧠 Selected prompt utilities:** Rough character-based token estimates, system-prompt/XML wrappers, basic tool-schema templates, fixed-size character chunk previews, limited email/phone-pattern redaction, and whitespace minification. These are local text helpers, not model-backed AI.

---

## 📂 Project Structure

```text
omnitool-hub/
├── index.html        # Main App Layout, 10-Theme Studio, Mobile Dock & 4 Pages
├── styles.css        # 10 CSS Theme Engines, 3D Spotlight Cards & Glassmorphic UI
├── tools-data.js     # Master Database of 28 Categories & 1,050 Individual Tools
├── tools-engine.js   # Client-Side Processing Engines + Universal Share & Download
├── app.js            # State Controller, Search, Deep-Linking (?tool=ID) & Support Desk
└── README.md         # Project Documentation
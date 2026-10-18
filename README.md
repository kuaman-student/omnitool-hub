# ⚡ OmniTool Hub — 1,050+ All-in-One Client-Side Toolkit

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge)](https://kuaman-student.github.io/omnitool-hub/)
![Version](https://img.shields.io/badge/Version-4.0_Ultra-6366f1?style=for-the-badge)
![Tools](https://img.shields.io/badge/Tools-1,050+-10b981?style=for-the-badge)
![Categories](https://img.shields.io/badge/Categories-28-f59e0b?style=for-the-badge)
![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side-ec4899?style=for-the-badge)

**OmniTool Hub** is a fast, modern, zero-server web application that brings **1,050+ individual utilities** across **28 specialized categories** into a single, unified interface. 

Every tool runs **100% locally inside your browser**. Your files, passwords, code snippets, and documents never leave your device.

---

## 🌐 Live Website (GitHub Pages)

🚀 **Try it live right now in your browser:**  
👉 **[https://kuaman-student.github.io/omnitool-hub/](https://kuaman-student.github.io/omnitool-hub/)**

---

## ✨ What Makes OmniTool Hub Special?

- **🎯 1,050+ Dedicated Workspaces:** Every single task has its own button, unique ID (`#1` to `#1050`), instant search tag, and interactive modal studio.
- **📤 Direct Share (No Download Required):** Powered by the native Web Share API (`navigator.share`), you can send processed PDFs, edited images, QR codes, and text outputs straight to WhatsApp, Telegram, Email, or AirDrop without cluttering your local storage.
- **🎨 10 Live Chameleon Themes:** Switch effortlessly between *Nebula Glass, Cyberpunk 2077, Aurora Emerald, Sunset Synthwave, Deep Ocean, Crimson Matrix, Royal Gold, Arctic Daylight, Sakura Blossom,* and *Retro Terminal*.
- **✨ 3D Spotlight UI & Dual Views:** Features cursor-tracking radial spotlight cards, a Bento Grid view, a Compact Command list view, and a responsive mobile bottom navigation dock.
- **🔒 Zero-Trust Local Privacy:** No cloud uploads, no sign-ups, and no server queues. Everything is processed in local RAM and cleared the moment you close the tab.

---

## 🛠️ Core Interactive Engines Included

1. **📄 PDF Studio (`pdf-lib`):** Merge multiple PDFs, split ranges, rotate pages (90°/180°/270°), delete pages, reverse page order, insert blank pages, stamp watermarks, and inspect metadata locally.
2. **🖼️ Image & Canvas Studio (`HTML5 Canvas`):** Resize dimensions, adjust brightness, contrast, saturation, and blur, rotate/flip, apply grayscale or invert filters, add custom watermarks, and convert between PNG, JPG, and WebP.
3. **🤖 Robotics, ROS2, CAD & Electronics Workbench:** 
   - Live interactive **Oscilloscope Canvas** for **PID Controller** step-response tuning and **PWM Duty-Cycle** visualization.
   - **ROS2 Quaternion ↔ Euler** angle converters, differential-drive kinematics, drone thrust-to-weight estimators, Ohm's Law calculators, and 3D printing filament cost estimators.
4. **💻 Developer, Security & Cyber-Forensics:** Format & minify JSON, decode JWT tokens, encode/decode Base64 & URLs, generate hardware-backed **WebCrypto SHA-256 / SHA-512** hashes, create UUIDs, strong passwords, ROT13 ciphers, and defang malicious URLs.
5. **🧠 AI Prompt & LLM Utilities:** Estimate LLM token counts and API costs, build structured XML system prompts, generate OpenAI function-calling JSON schemas, preview RAG text chunks, and redact PII.
6. **📈 FinTech, GST & Business Calculators:** Compute GST (inclusive vs. exclusive split), CGST/SGST breakups, Loan EMIs, SIP wealth compounding, and startup cash burn runway.
7. **🎬 Audio, Video & QR Tools:** Generate custom-colored high-res QR codes, control video playback speeds, capture video frames to PNG, and run browser Text-to-Speech (TTS).

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
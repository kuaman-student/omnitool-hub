// OmniTool Hub v5.0 — Context-Verified Smart Engine Router (100% English)

const ToolEngine = {
  currentArtifact: {
    toolName: "",
    text: "",
    blob: null,
    filename: "omnitool-output.txt",
    mimeType: "text/plain"
  },

  activeCleanup: null,

  setArtifact({ toolName, text = "", blob = null, filename = "omnitool-output.txt", mimeType = "text/plain" }) {
    this.currentArtifact = { toolName, text, blob, filename, mimeType };
  },

  async shareCurrentArtifact(toastCallback) {
    const art = this.currentArtifact;
    const blobToShare = art.blob || new Blob([art.text || `OmniTool Hub — ${art.toolName}`], { type: art.mimeType || "text/plain" });
    const file = new File([blobToShare], art.filename || "output.txt", { type: blobToShare.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `OmniTool Hub — ${art.toolName}`,
          text: (art.text && art.text.length < 400) ? art.text : `Generated with ${art.toolName} on OmniTool Hub`,
          files: [file]
        });
        toastCallback("Shared file directly via system Share Sheet!");
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `OmniTool Hub — ${art.toolName}`,
          text: art.text || `Output from ${art.toolName}`,
          url: window.location.href
        });
        toastCallback("Shared output directly!");
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    await navigator.clipboard.writeText(art.text || window.location.href);
    toastCallback("Result copied to clipboard for instant sharing!");
  },

  downloadCurrentArtifact(toastCallback) {
    const art = this.currentArtifact;
    const blob = art.blob || new Blob([art.text || "No output generated yet."], { type: art.mimeType || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = art.filename || "omnitool-output.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toastCallback(`Downloaded ${art.filename}!`);
  },

  // ============================================================================
  // MASTER CONTEXT-AWARE ROUTER (Checks Specific Tool Name BEFORE Category!)
  // ============================================================================
  renderWorkspace(tool, container) {
    if (typeof this.activeCleanup === "function") {
      this.activeCleanup();
      this.activeCleanup = null;
    }

    container.innerHTML = "";
    const name = tool.name.toLowerCase();
    const cat = tool.categoryId;

    this.setArtifact({
      toolName: tool.name,
      text: `Tool: #${tool.id} ${tool.name} (${tool.categoryName})`,
      filename: `tool-${tool.id}-output.txt`,
      mimeType: "text/plain"
    });

    // --- SPECIFIC OVERRIDES (Fixes Cross-Category Input Mismatches!) ---

    // A. IMAGES TO PDF / ADD IMAGES TO PDF / JPG TO PDF (#40, #23, etc.)
    if (name.includes("images to pdf") || name.includes("add images to pdf") || name.includes("jpg to pdf") || name.includes("image to pdf") || name.includes("svg to pdf")) {
      return this.renderImagesToPdfEngine(tool, container);
    }

    // B. TEXT / WORD / EXCEL / POWERPOINT / HTML / MARKDOWN / EPUB TO PDF (#41, #42, #43, #196, #224, #238, #626)
    if (name.endsWith("to pdf") && !name.includes("image") && !name.includes("jpg") &&
        !/(word|excel|powerpoint|docx|xlsx|pptx)/.test(name)) {
      return this.renderDocumentToPdfEngine(tool, container);
    }

    // C. BASE64 TO IMAGE vs IMAGE TO BASE64 (#85, #86)
    if (name.includes("from base64") || name.includes("base64 to image")) {
      return this.renderBase64ToImageEngine(tool, container);
    }
    if (name.includes("image to base64")) {
      return this.renderImageToBase64Engine(tool, container);
    }

    // D. LIVE SCREEN / WEBCAM / AUDIO RECORDERS (#145, #146, #184)
    if (name.includes("record screen") || name.includes("record webcam") || name.includes("record audio")) {
      return this.renderLiveRecorderEngine(tool, container);
    }

    // E. ZIP / ARCHIVE CREATOR & EXTRACTOR (#297 - #306, #758)
    if (name.includes("zip") || name.includes("archive") || name.includes("7z") || name.includes("tar") || name.includes("gzip")) {
      return this.renderZipArchiveEngine(tool, container);
    }

    // F. BULK FILE MANAGEMENT, RENAMER & CHECKSUMS (Category 21 & Checksum tools)
    if (cat === "files" || name.includes("checksum") || name.includes("duplicate file") || name.includes("file signature") || name.includes("magic-bytes")) {
      return this.renderFileBatchEngine(tool, container);
    }

    // G. TIMERS, STOPWATCH, POMODORO, DICE, COIN, WHEEL (Category 14 interactive tools)
    if (name.includes("stopwatch") || name.includes("timer") || name.includes("pomodoro") || name.includes("alarm")) {
      return this.renderTimerStopwatchEngine(tool, container);
    }
    if (name.includes("dice") || name.includes("coin") || name.includes("wheel") || name.includes("random decision") || name.includes("winner picker") || name.includes("team random")) {
      return this.renderRandomizerStudio(tool, container);
    }

    // H. QR CODE GENERATOR vs QR DECODER
    if (name.includes("qr") && name.includes("decoder")) {
      return this.renderQrDecoderEngine(tool, container);
    }
    if (name.includes("qr")) {
      return this.renderQrEngine(tool, container);
    }

    // --- STANDARD CATEGORY ENGINES ---
    if (cat === "pdf") return this.renderPdfEngine(tool, container);
    if (cat === "image" || (cat === "converters" && (name.includes("png") || name.includes("jpg") || name.includes("webp") || name.includes("svg")))) {
      return this.renderImageEngine(tool, container);
    }
    if (cat === "robotics" || cat === "ros2" || name.includes("ohm") || name.includes("resistor") || name.includes("pwm") || name.includes("gear") || name.includes("3d-printing")) {
      return this.renderRoboticsEngine(tool, container);
    }
    if (cat === "fintech" || name.includes("gst") || name.includes("discount") || name.includes("profit") || name.includes("emi") || name.includes("sip")) {
      return this.renderFinTechEngine(tool, container);
    }
    if (cat === "llmai" || cat === "ai") return this.renderAiLlmEngine(tool, container);
    if (cat === "dev" || cat === "security" || cat === "cyber" || cat === "web" || cat === "design" || cat === "network") {
      return this.renderDevSecurityEngine(tool, container);
    }
    if (cat === "data" || name.includes("csv") || name.includes("spreadsheet")) {
      return this.renderDataSpreadsheetEngine(tool, container);
    }
    if (cat === "audio" || cat === "video" || cat === "gif" || cat === "creator" || name.includes("speech")) {
      return this.renderMediaEngine(tool, container);
    }
    if (cat === "calculators" || cat === "science" || cat === "productivity" || cat === "education") {
      return this.renderCalculatorProductivityEngine(tool, container);
    }
    if (cat === "docs") {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This document operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">Office files will not be read as plain text or exported as a misleading PDF.</p>
        </div>
      `;
      return;
    }
    return this.renderTextAndUniversalEngine(tool, container);
  },

  // ============================================================================
  // SPECIAL ENGINE A: IMAGES TO PDF (#40, #23) — ACCEPTS IMAGES, OUTPUTS PDF!
  // ============================================================================
  renderImagesToPdfEngine(tool, container) {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl glass-subpanel flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold theme-text-primary">Image-to-PDF Compiler — ${tool.name}</h3>
            <p class="text-xs theme-text-muted mt-0.5">Select 1 or multiple images (<b>JPG, PNG, WebP</b>). Each image will be embedded as a high-resolution page inside a new PDF document.</p>
          </div>
          <span class="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Accepts Images Only</span>
        </div>

        <div class="border-2 border-dashed theme-border rounded-2xl p-6 text-center hover:opacity-95 transition">
          <input type="file" id="imgToPdfInput" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" multiple class="hidden" />
          <label for="imgToPdfInput" class="cursor-pointer flex flex-col items-center">
            <i data-lucide="images" class="w-10 h-10 accent-text mb-2"></i>
            <span class="text-sm font-bold theme-text-primary">Click to select Images (PNG, JPG, WebP, SVG — Multiple supported)</span>
            <span class="text-[11px] theme-text-muted mt-1">Image files only — PDF documents are not accepted.</span>
            <span class="text-xs theme-text-muted mt-1" id="imgToPdfStatus">No images selected yet</span>
          </label>
        </div>

        <div id="imgPreviewStrip" class="hidden flex gap-2 overflow-x-auto py-2 custom-scrollbar"></div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs theme-text-muted block mb-1">PDF Page Layout Mode</label>
            <select id="imgPdfPageSize" class="w-full px-3.5 py-2.5 rounded-xl text-sm">
              <option value="fit">Fit Page to Image Dimensions (Original Aspect)</option>
              <option value="a4p">Standard A4 Portrait (595 × 842 pt)</option>
              <option value="a4l">Standard A4 Landscape (842 × 595 pt)</option>
            </select>
          </div>
          <div class="flex items-end">
            <button id="buildImgPdfBtn" disabled class="w-full py-2.5 px-4 rounded-xl accent-gradient text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              <i data-lucide="file-check-2" class="w-4 h-4"></i> Convert Selected Images to PDF
            </button>
          </div>
        </div>

        <div id="imgPdfOutBox" class="hidden p-4 rounded-2xl glass-subpanel text-xs"></div>
      </div>
    `;
    lucide.createIcons();

    const inp = container.querySelector("#imgToPdfInput");
    const status = container.querySelector("#imgToPdfStatus");
    const strip = container.querySelector("#imgPreviewStrip");
    const outBox = container.querySelector("#imgPdfOutBox");
    const convertBtn = container.querySelector("#buildImgPdfBtn");
    let selectedImages = [];
    let previewUrls = [];

    const clearPreviews = () => {
      previewUrls.forEach(URL.revokeObjectURL);
      previewUrls = [];
      strip.innerHTML = "";
      strip.classList.add("hidden");
    };

    this.activeCleanup = clearPreviews;

    inp.addEventListener("change", () => {
      const files = Array.from(inp.files);
      clearPreviews();
      const supportedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
      const isSupportedImage = (file) => {
        const extensionMatches = /\.(png|jpe?g|webp|svg)$/i.test(file.name);
        return supportedMimeTypes.includes(file.type) || (!file.type && extensionMatches);
      };
      const unsupportedFiles = files.filter(file => !isSupportedImage(file));
      if (unsupportedFiles.length) {
        selectedImages = [];
        convertBtn.disabled = true;
        status.textContent = `Unsupported file(s): ${unsupportedFiles.map(file => file.name).join(", ")}. Select PNG, JPG, WebP, or SVG images only.`;
        return;
      }

      selectedImages = files;
      convertBtn.disabled = files.length === 0;
      status.textContent = files.length ? `${files.length} image(s) ready: ${files.map(f => f.name).join(", ")}` : "No images selected";
      if (files.length) {
        strip.classList.remove("hidden");
        files.forEach(file => {
          const url = URL.createObjectURL(file);
          previewUrls.push(url);
          const img = document.createElement("img");
          img.src = url;
          img.alt = file.name;
          img.className = "h-20 w-auto rounded-lg border theme-border object-cover shrink-0";
          strip.appendChild(img);
        });
      }
    });

    // Helper to convert any image (including WebP) into PNG ArrayBuffer via Canvas
    const fileToPngBytes = (file) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(imageUrl);
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const context = c.getContext("2d");
        if (!context) return reject(new Error("Canvas is unavailable for image conversion"));
        context.drawImage(img, 0, 0);
        c.toBlob(async (blob) => {
          if (!blob) return reject(new Error("Canvas conversion failed"));
          resolve({ bytes: await blob.arrayBuffer(), w: img.naturalWidth, h: img.naturalHeight });
        }, "image/png");
      };
      const imageUrl = URL.createObjectURL(file);
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error(`Could not read ${file.name} as an image`));
      };
      img.src = imageUrl;
    });

    convertBtn.addEventListener("click", async () => {
      const files = selectedImages;
      if (!files.length) return alert("Please select at least one image (PNG, JPG, WebP) first!");

      outBox.classList.remove("hidden");
      outBox.innerHTML = `<span class="accent-text font-semibold">Embedding ${files.length} image(s) into PDF...</span>`;

      try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const layout = container.querySelector("#imgPdfPageSize").value;

        for (const f of files) {
          const { bytes, w, h } = await fileToPngBytes(f);
          const embeddedImg = await pdfDoc.embedPng(bytes);

          if (layout === "fit") {
            const page = pdfDoc.addPage([w, h]);
            page.drawImage(embeddedImg, { x: 0, y: 0, width: w, height: h });
          } else {
            const pw = layout === "a4p" ? 595.28 : 841.89;
            const ph = layout === "a4p" ? 841.89 : 595.28;
            const page = pdfDoc.addPage([pw, ph]);
            const margin = 24;
            const scale = Math.min((pw - margin * 2) / w, (ph - margin * 2) / h);
            const dw = w * scale;
            const dh = h * scale;
            page.drawImage(embeddedImg, {
              x: (pw - dw) / 2,
              y: (ph - dh) / 2,
              width: dw,
              height: dh
            });
          }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const outName = "images-compiled.pdf";

        this.setArtifact({
          toolName: tool.name,
          text: `Compiled ${files.length} image(s) into ${outName} (${(blob.size / 1024).toFixed(1)} KB)`,
          blob,
          filename: outName,
          mimeType: "application/pdf"
        });

        outBox.innerHTML = `
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-emerald-400 font-bold">✅ Created ${outName} (${files.length} pages, ${(blob.size / 1024).toFixed(1)} KB)!</span>
            <span class="theme-text-muted">Click <b>"Share Output Directly"</b> or <b>"Download Output"</b> below!</span>
          </div>
        `;
      } catch (err) {
        outBox.classList.add("text-rose-400");
        outBox.textContent = `Error: ${err.message}`;
      }
    });
  },

  // ============================================================================
  // SPECIAL ENGINE B: DOCUMENT / TEXT / CSV / HTML TO PDF GENERATOR
  // ============================================================================
  renderDocumentToPdfEngine(tool, container) {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="p-3.5 rounded-2xl glass-subpanel flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold theme-text-primary">${tool.name} — Document-to-PDF Generator</h3>
            <p class="text-xs theme-text-muted">Upload a document/text/CSV/Markdown file OR type/paste your content below to compile a clean A4 PDF.</p>
          </div>
          <input type="file" id="docToPdfFile" accept=".txt,.md,.csv,.json,.html,.xml,.log" class="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white cursor-pointer" />
        </div>

        <input id="docPdfTitle" type="text" value="${tool.name} Document" placeholder="Document Header Title..." class="w-full px-3.5 py-2 rounded-xl text-sm font-bold" />
        <textarea id="docPdfBody" rows="7" class="w-full p-3.5 rounded-2xl text-xs font-mono" placeholder="Paste or type your document content here...">OmniTool Hub — Official Generated PDF Document\n\nTool Used: ${tool.name}\nGenerated Locally: ${new Date().toLocaleString()}\n\n1. All content is formatted onto standard A4 pages.\n2. You can directly share this generated PDF without downloading or save it to your device.</textarea>

        <div class="flex items-center justify-between gap-3">
          <button id="generateDocPdfBtn" class="px-5 py-2.5 rounded-xl accent-gradient text-white font-bold text-xs shadow-lg flex items-center gap-2">
            <i data-lucide="file-text" class="w-4 h-4"></i> Generate A4 PDF Now
          </button>
          <span id="docPdfStatus" class="text-xs text-emerald-400 font-semibold"></span>
        </div>
      </div>
    `;
    lucide.createIcons();

    const fileInp = container.querySelector("#docToPdfFile");
    const bodyTa = container.querySelector("#docPdfBody");
    const titleInp = container.querySelector("#docPdfTitle");
    const status = container.querySelector("#docPdfStatus");

    fileInp.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      titleInp.value = f.name.replace(/\.[^.]+$/, "");
      const reader = new FileReader();
      reader.onload = (ev) => {
        bodyTa.value = ev.target.result;
        buildPdf();
      };
      reader.readAsText(f);
    });

    const buildPdf = async () => {
      const { PDFDocument, StandardFonts, rgb } = PDFLib;
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const rawLines = bodyTa.value.replace(/\r/g, "").split("\n");
      const wrappedLines = [];
      rawLines.forEach(line => {
        if (line.length <= 85) wrappedLines.push(line);
        else {
          const chunks = line.match(/.{1,85}/g) || [""];
          chunks.forEach(c => wrappedLines.push(c));
        }
      });

      const linesPerPage = 42;
      const totalPages = Math.max(1, Math.ceil(wrappedLines.length / linesPerPage));

      for (let p = 0; p < totalPages; p++) {
        const page = pdfDoc.addPage([595.28, 841.89]);
        page.drawText(titleInp.value || "Document", { x: 45, y: 790, size: 15, font: boldFont, color: rgb(0.15, 0.2, 0.5) });
        const slice = wrappedLines.slice(p * linesPerPage, (p + 1) * linesPerPage);
        slice.forEach((ln, idx) => {
          page.drawText(ln.replace(/[^\x20-\x7E]/g, " "), {
            x: 45,
            y: 755 - idx * 16,
            size: 10.5,
            font,
            color: rgb(0.1, 0.1, 0.1)
          });
        });
        page.drawText(`Page ${p + 1} of ${totalPages}`, { x: 480, y: 30, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const outName = `${(titleInp.value || "document").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;

      this.setArtifact({
        toolName: tool.name,
        text: bodyTa.value,
        blob,
        filename: outName,
        mimeType: "application/pdf"
      });
      status.textContent = `✅ PDF Ready (${totalPages} page(s), ${(blob.size / 1024).toFixed(1)} KB) — Use Share or Download below!`;
    };

    container.querySelector("#generateDocPdfBtn").addEventListener("click", buildPdf);
    buildPdf();
  },

  // ============================================================================
  // SPECIAL ENGINE C: BASE64 <-> IMAGE DEDICATED CONVERTERS (#85, #86)
  // ============================================================================
  renderBase64ToImageEngine(tool, container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <label class="text-xs font-bold accent-text block">Paste Base64 Image String (data:image/... or raw base64)</label>
          <textarea id="b64ImgInput" rows="7" class="w-full p-3 rounded-xl font-mono text-xs" placeholder="Paste Base64 string here...">iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==</textarea>
          <button id="decodeB64ImgBtn" class="w-full py-2 rounded-xl accent-gradient text-white font-bold text-xs">Render Image from Base64</button>
        </div>
        <div class="glass-subpanel p-4 rounded-2xl flex flex-col items-center justify-center">
          <img id="b64PreviewImg" class="max-h-56 rounded-xl border theme-border" alt="Decoded Base64 Preview" />
          <span id="b64ImgStatus" class="text-xs theme-text-muted mt-2">Decoded image ready for Direct Share or Download</span>
        </div>
      </div>
    `;
    const inp = container.querySelector("#b64ImgInput");
    const img = container.querySelector("#b64PreviewImg");
    const st = container.querySelector("#b64ImgStatus");

    const decodeNow = () => {
      let raw = inp.value.trim();
      if (!raw) return;
      if (!raw.startsWith("data:image")) raw = `data:image/png;base64,${raw}`;
      img.onload = () => {
        st.textContent = `Rendered: ${img.naturalWidth} × ${img.naturalHeight} px`;
        fetch(raw).then(r => r.blob()).then(blob => {
          this.setArtifact({ toolName: tool.name, text: raw, blob, filename: "decoded-base64.png", mimeType: blob.type || "image/png" });
        });
      };
      img.onerror = () => { st.textContent = "Invalid Base64 image data"; };
      img.src = raw;
    };
    container.querySelector("#decodeB64ImgBtn").addEventListener("click", decodeNow);
    decodeNow();
  },

  renderImageToBase64Engine(tool, container) {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="glass-subpanel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-bold theme-text-primary">Select any Image to encode into a Base64 Data URI</span>
          <input type="file" id="imgToB64File" accept="image/*" class="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white cursor-pointer" />
        </div>
        <textarea id="imgB64Output" rows="8" readonly class="w-full p-3 rounded-2xl font-mono text-xs" placeholder="Upload an image above to generate its Base64 string..."></textarea>
      </div>
    `;
    const out = container.querySelector("#imgB64Output");
    container.querySelector("#imgToB64File").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        out.value = ev.target.result;
        this.setArtifact({ toolName: tool.name, text: out.value, filename: `${f.name}-base64.txt` });
      };
      reader.readAsDataURL(f);
    });
  },

  // ============================================================================
  // SPECIAL ENGINE D: LIVE SCREEN, WEBCAM & AUDIO RECORDER (#145, #146, #184)
  // ============================================================================
  renderLiveRecorderEngine(tool, container) {
    const n = tool.name.toLowerCase();
    const mode = n.includes("screen") ? "screen" : n.includes("webcam") ? "webcam" : "audio";

    container.innerHTML = `
      <div class="space-y-4">
        <div class="glass-subpanel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold theme-text-primary">Live Browser ${mode.toUpperCase()} Recorder</h3>
            <p class="text-xs theme-text-muted">Captures directly to a WebM media file in local memory. Share or download immediately after stopping.</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="startRecBtn" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white animate-ping"></span> Start Recording
            </button>
            <button id="stopRecBtn" disabled class="px-4 py-2 rounded-xl glass-btn text-xs font-bold opacity-50">Stop & Save</button>
          </div>
        </div>
        <div class="glass-subpanel p-4 rounded-2xl flex flex-col items-center justify-center">
          <video id="recPreview" autoplay muted playsinline class="max-h-64 w-full rounded-xl bg-black"></video>
          <span id="recStatus" class="text-xs font-mono theme-text-muted mt-2">Click "Start Recording" and grant browser permission</span>
        </div>
      </div>
    `;

    const videoEl = container.querySelector("#recPreview");
    const startBtn = container.querySelector("#startRecBtn");
    const stopBtn = container.querySelector("#stopRecBtn");
    const status = container.querySelector("#recStatus");
    let recorder = null;
    let stream = null;
    let chunks = [];

    this.activeCleanup = () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };

    startBtn.addEventListener("click", async () => {
      try {
        chunks = [];
        if (mode === "screen") {
          stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        } else if (mode === "webcam") {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        videoEl.srcObject = stream;
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          const mime = mode === "audio" ? "audio/webm" : "video/webm";
          const ext = "webm";
          const blob = new Blob(chunks, { type: mime });
          videoEl.srcObject = null;
          videoEl.src = URL.createObjectURL(blob);
          videoEl.muted = false;
          videoEl.controls = true;
          const outName = `recorded-${mode}-${Date.now()}.${ext}`;
          this.setArtifact({ toolName: tool.name, text: `Recorded ${mode} (${(blob.size/1024).toFixed(1)} KB)`, blob, filename: outName, mimeType: mime });
          status.textContent = `✅ Recording complete (${(blob.size / 1024).toFixed(1)} KB)! Use Share or Download below.`;
        };
        recorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        stopBtn.classList.remove("opacity-50");
        status.textContent = "🔴 Recording in progress...";
      } catch (err) {
        status.textContent = "Permission denied or device unavailable: " + err.message;
      }
    });

    stopBtn.addEventListener("click", () => {
      if (recorder && recorder.state !== "inactive") recorder.stop();
      if (stream) stream.getTracks().forEach(t => t.stop());
      startBtn.disabled = false;
      stopBtn.disabled = true;
      stopBtn.classList.add("opacity-50");
    });
  },

  // ============================================================================
  // SPECIAL ENGINE E: REAL JSZIP ARCHIVE CREATOR & INSPECTOR (#297 - #306)
  // ============================================================================
  renderZipArchiveEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const isSupportedZip = name.includes("zip") && !name.includes("7z") && !name.includes("tar") &&
      !name.includes("gzip") && !name.includes("batch");
    if (!isSupportedZip) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This archive format or batch operation is not supported yet.</p>
          <p class="text-xs theme-text-muted">This workspace supports creating and extracting standard ZIP archives only.</p>
        </div>
      `;
      return;
    }

    const isExtract = name.includes("extract") || name.includes("inspect") || name.includes("decompressor");
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl glass-subpanel flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold theme-text-primary">Client-Side JSZip Engine — ${tool.name}</h3>
            <p class="text-xs theme-text-muted">${isExtract ? "Select a .zip archive to inspect and extract its contents locally." : "Select multiple files of any type to compress into a downloadable/shareable .zip archive."}</p>
          </div>
          <input type="file" id="zipFileInput" ${isExtract ? 'accept=".zip,application/zip"' : "multiple"} class="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white cursor-pointer" />
        </div>
        <div id="zipOutputBox" class="p-4 rounded-2xl glass-subpanel font-mono text-xs space-y-1.5 min-h-[120px]">Select file(s) above to begin archive processing...</div>
      </div>
    `;

    const inp = container.querySelector("#zipFileInput");
    const out = container.querySelector("#zipOutputBox");

    inp.addEventListener("change", async () => {
      const files = Array.from(inp.files);
      if (!files.length) return;

      try {
        const zip = new JSZip();
        if (isExtract) {
          const loaded = await zip.loadAsync(files[0]);
          const entries = Object.values(loaded.files);
          out.replaceChildren();
          const heading = document.createElement("div");
          heading.className = "text-emerald-400 font-bold";
          heading.textContent = `Archive inspected: ${files[0].name} (${entries.length} entries)`;
          out.appendChild(heading);
          const manifest = [];
          for (const entry of entries) {
            manifest.push(`${entry.dir ? "Folder" : "File"}: ${entry.name}`);
            const row = document.createElement("div");
            row.className = "flex items-center justify-between gap-3";
            const label = document.createElement("span");
            label.textContent = `${entry.dir ? "Folder" : "File"}: ${entry.name}`;
            row.appendChild(label);
            if (!entry.dir) {
              const downloadBtn = document.createElement("button");
              downloadBtn.type = "button";
              downloadBtn.className = "px-2 py-1 rounded-lg glass-btn shrink-0";
              downloadBtn.textContent = "Extract file";
              downloadBtn.addEventListener("click", async () => {
                try {
                  const blob = await entry.async("blob");
                  const fileName = entry.name.split("/").filter(Boolean).pop() || "extracted-file";
                  this.setArtifact({ toolName: tool.name, text: `Extracted ${entry.name}`, blob, filename: fileName, mimeType: blob.type || "application/octet-stream" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = fileName;
                  link.click();
                  setTimeout(() => URL.revokeObjectURL(url), 5000);
                } catch (error) {
                  row.lastChild.textContent = `Extraction failed: ${error.message}`;
                }
              });
              row.appendChild(downloadBtn);
            }
            out.appendChild(row);
          }
          this.setArtifact({ toolName: tool.name, text: manifest.join("\n"), filename: "archive-manifest.txt", mimeType: "text/plain" });
        } else {
          out.innerHTML = `<span class="accent-text">Compressing ${files.length} file(s) into ZIP...</span>`;
          files.forEach(f => zip.file(f.name, f));
          const blob = await zip.generateAsync({ type: "blob" });
          const outName = "omnitool-archive.zip";
          this.setArtifact({ toolName: tool.name, text: `ZIP Archive (${files.length} files, ${(blob.size/1024).toFixed(1)} KB)`, blob, filename: outName, mimeType: "application/zip" });
          out.innerHTML = `<div class="text-emerald-400 font-bold">✅ Created ${outName} (${(blob.size / 1024).toFixed(1)} KB) containing ${files.length} file(s)!</div><div>Click <b>"Share Output Directly"</b> or <b>"Download Output"</b> below.</div>`;
        }
      } catch (err) {
        out.classList.add("text-rose-400");
        out.textContent = `Archive Error: ${err.message}`;
      }
    });
  },

  // ============================================================================
  // SPECIAL ENGINE F: BULK FILE RENAMER, CHECKSUM & MAGIC-BYTE INSPECTOR
  // ============================================================================
  renderFileBatchEngine(tool, container) {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="glass-subpanel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold theme-text-primary">${tool.name} — Multi-File Batch Processor</h3>
            <p class="text-xs theme-text-muted">Select multiple files to inspect SHA-256 checksums, magic-byte signatures, sizes, and bulk rename rules.</p>
          </div>
          <input type="file" id="batchFilesInput" multiple class="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white cursor-pointer" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input id="batchPrefix" type="text" placeholder="Add Prefix (e.g., project_)" value="omni_" class="px-3.5 py-2 rounded-xl text-xs" />
          <input id="batchSuffix" type="text" placeholder="Add Suffix (e.g., _v2)" value="_verified" class="px-3.5 py-2 rounded-xl text-xs" />
        </div>
        <textarea id="batchReportOut" rows="8" readonly class="w-full p-3.5 rounded-2xl font-mono text-xs" placeholder="Select files above to generate batch rename script, CSV manifest, and SHA-256 checksums..."></textarea>
      </div>
    `;

    const inp = container.querySelector("#batchFilesInput");
    const pre = container.querySelector("#batchPrefix");
    const suf = container.querySelector("#batchSuffix");
    const out = container.querySelector("#batchReportOut");

    const processFiles = async () => {
      const files = Array.from(inp.files);
      if (!files.length) return;
      const rows = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const buf = await f.slice(0, 65536).arrayBuffer();
        const hashBuf = await crypto.subtle.digest("SHA-256", buf);
        const hashHex = Array.from(new Uint8Array(hashBuf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
        const magic = Array.from(new Uint8Array(buf.slice(0, 4))).map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
        const dot = f.name.lastIndexOf(".");
        const base = dot > -1 ? f.name.slice(0, dot) : f.name;
        const ext = dot > -1 ? f.name.slice(dot) : "";
        const newName = `${pre.value}${base}${suf.value}_${String(i + 1).padStart(2, "0")}${ext}`;
        rows.push(`${f.name}  -->  ${newName} | ${(f.size / 1024).toFixed(1)} KB | Magic: [${magic}] | SHA256-prefix: ${hashHex}`);
      }
      out.value = rows.join("\n");
      this.setArtifact({ toolName: tool.name, text: out.value, filename: "batch-file-manifest.txt" });
    };

    inp.addEventListener("change", processFiles);
    pre.addEventListener("input", processFiles);
    suf.addEventListener("input", processFiles);
  },

  // ============================================================================
  // SPECIAL ENGINE G: LIVE STOPWATCH, COUNTDOWN & POMODORO TIMER
  // ============================================================================
  renderTimerStopwatchEngine(tool, container) {
    const isPomodoro = tool.name.toLowerCase().includes("pomodoro") || tool.name.toLowerCase().includes("countdown");
    let seconds = isPomodoro ? 25 * 60 : 0;
    let running = false;
    let intervalId = null;

    container.innerHTML = `
      <div class="glass-subpanel p-6 rounded-2xl text-center space-y-4">
        <span class="text-xs font-bold uppercase tracking-wider accent-text">${tool.name}</span>
        <div id="timerDisplay" class="text-5xl sm:text-6xl font-mono font-extrabold theme-text-primary">00:00</div>
        <div class="flex flex-wrap items-center justify-center gap-2.5">
          <button id="tStartBtn" class="px-5 py-2.5 rounded-xl accent-gradient text-white font-bold text-xs">Start / Resume</button>
          <button id="tPauseBtn" class="px-5 py-2.5 rounded-xl glass-btn font-bold text-xs">Pause</button>
          <button id="tResetBtn" class="px-5 py-2.5 rounded-xl glass-btn font-bold text-xs text-rose-400">Reset</button>
          <button id="tLapBtn" class="px-5 py-2.5 rounded-xl glass-btn font-bold text-xs">Record Lap</button>
        </div>
        <div id="lapList" class="text-xs font-mono theme-text-muted space-y-1 max-h-36 overflow-y-auto"></div>
      </div>
    `;

    const disp = container.querySelector("#timerDisplay");
    const laps = container.querySelector("#lapList");

    const fmt = (s) => {
      const m = Math.floor(Math.abs(s) / 60);
      const sec = Math.abs(s) % 60;
      return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };
    disp.textContent = fmt(seconds);

    this.activeCleanup = () => clearInterval(intervalId);

    container.querySelector("#tStartBtn").addEventListener("click", () => {
      if (running) return;
      running = true;
      intervalId = setInterval(() => {
        seconds += isPomodoro ? -1 : 1;
        disp.textContent = fmt(seconds);
      }, 1000);
    });
    container.querySelector("#tPauseBtn").addEventListener("click", () => {
      running = false;
      clearInterval(intervalId);
    });
    container.querySelector("#tResetBtn").addEventListener("click", () => {
      running = false;
      clearInterval(intervalId);
      seconds = isPomodoro ? 25 * 60 : 0;
      disp.textContent = fmt(seconds);
      laps.innerHTML = "";
    });
    container.querySelector("#tLapBtn").addEventListener("click", () => {
      const entry = `Lap @ ${fmt(seconds)}`;
      const div = document.createElement("div");
      div.textContent = entry;
      laps.prepend(div);
      this.setArtifact({ toolName: tool.name, text: Array.from(laps.children).map(c => c.textContent).join("\n"), filename: "timer-laps.txt" });
    });
  },

  // ============================================================================
  // SPECIAL ENGINE H: DICE ROLLER, COIN FLIP & RANDOM DECISION PICKER
  // ============================================================================
  renderRandomizerStudio(tool, container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <label class="text-xs font-bold accent-text block">Options / Names (One per line for Wheel/Winner Picker)</label>
          <textarea id="randItems" rows="6" class="w-full p-3 rounded-xl text-xs font-mono">Option Alpha\nOption Beta\nOption Gamma\nOption Delta</textarea>
          <div class="flex flex-wrap gap-2">
            <button id="pickWinnerBtn" class="px-4 py-2 rounded-xl accent-gradient text-white font-bold text-xs">Pick Random Winner</button>
            <button id="rollDiceBtn" class="px-4 py-2 rounded-xl glass-btn font-bold text-xs">Roll 2d6 Dice</button>
            <button id="flipCoinBtn" class="px-4 py-2 rounded-xl glass-btn font-bold text-xs">Flip Coin</button>
          </div>
        </div>
        <div class="glass-subpanel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <div id="randResultBig" class="text-2xl sm:text-3xl font-extrabold accent-text">Ready to Roll!</div>
          <p id="randSub" class="text-xs font-mono theme-text-muted mt-2">Cryptographically fair selection via window.crypto</p>
        </div>
      </div>
    `;
    const big = container.querySelector("#randResultBig");
    const sub = container.querySelector("#randSub");

    container.querySelector("#pickWinnerBtn").addEventListener("click", () => {
      const items = container.querySelector("#randItems").value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      if (!items.length) return;
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const win = items[arr[0] % items.length];
      big.textContent = `🏆 ${win}`;
      sub.textContent = `Selected from ${items.length} candidates`;
      this.setArtifact({ toolName: tool.name, text: `Winner: ${win}`, filename: "random-result.txt" });
    });

    container.querySelector("#rollDiceBtn").addEventListener("click", () => {
      const d1 = (crypto.getRandomValues(new Uint32Array(1))[0] % 6) + 1;
      const d2 = (crypto.getRandomValues(new Uint32Array(1))[0] % 6) + 1;
      big.textContent = `🎲 ${d1} + ${d2} = ${d1 + d2}`;
      sub.textContent = `Die 1: ${d1} | Die 2: ${d2}`;
      this.setArtifact({ toolName: tool.name, text: `Dice Roll: ${d1} + ${d2} = ${d1 + d2}`, filename: "dice-roll.txt" });
    });

    container.querySelector("#flipCoinBtn").addEventListener("click", () => {
      const side = (crypto.getRandomValues(new Uint32Array(1))[0] % 2) === 0 ? "HEADS" : "TAILS";
      big.textContent = `🪙 ${side}`;
      sub.textContent = `50/50 Cryptographic Coin Toss`;
      this.setArtifact({ toolName: tool.name, text: `Coin Flip: ${side}`, filename: "coin-flip.txt" });
    });
  },

  // ============================================================================
  // 1. PDF ENGINE (Strictly for PDF-Input Operations: Merge, Split, Rotate, etc.)
  // ============================================================================
  renderPdfEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const isCompare = name.includes("compare");
    const isMerge = name.includes("merge");
    const isInsertPages = name.includes("insert pages from another pdf");
    const isMultiPdf = isMerge || isCompare || isInsertPages;
    const supportsPageNumbers = name.includes("page numbers");
    const supportsTextStamp = name.includes("watermark") && !name.includes("remove") ||
      name.includes("add text to pdf") || name.includes("sign pdf") ||
      name.includes("headers and footers");
    const supportsMetadata = name.includes("metadata");
    const supportsPageOperation = name.includes("rotate") || name.includes("reverse") ||
      name.includes("blank") || name.includes("delete") || name.includes("split") ||
      name.includes("extract selected pages") || name.includes("reorder") ||
      name.includes("duplicate");
    const isSupported = isCompare || isMerge || isInsertPages || supportsPageNumbers ||
      supportsTextStamp || supportsMetadata || supportsPageOperation;

    if (!isSupported) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This PDF operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">No file will be changed or downloaded. This workspace will be enabled when it can perform this exact operation safely.</p>
        </div>
      `;
      return;
    }

    let paramLabel = "Page Number / Range (e.g., 1, 2-4)";
    let defaultVal = "1";
    if (name.includes("rotate")) { paramLabel = "Rotation Angle in Degrees (90, 180, 270)"; defaultVal = "90"; }
    else if (supportsTextStamp) {
      paramLabel = "Text / Watermark / Signature Stamp to Apply";
      defaultVal = "APPROVED • OMNITOOL HUB";
    } else if (supportsMetadata) {
      paramLabel = "New Document Title Metadata";
      defaultVal = "Verified PDF Document";
    } else if (isInsertPages) {
      paramLabel = "Insert the second PDF after this page number";
    } else if (name.includes("reorder")) {
      paramLabel = "New page order (comma-separated; e.g., 3,1,2)";
      defaultVal = "";
    } else if (isCompare) {
      paramLabel = "Comparison includes page count and file size";
    }

    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl glass-subpanel flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold theme-text-primary">Client-Side PDF Engine — ${tool.name}</h3>
            <p class="text-xs theme-text-muted mt-0.5">Select your PDF file(s). Once processed, click <b>"Share Output Directly"</b> to send the PDF without downloading, or save it locally.</p>
          </div>
          <span class="text-xs font-mono px-2.5 py-1 rounded-lg accent-badge">100% Local RAM</span>
        </div>

        <div class="border-2 border-dashed theme-border rounded-2xl p-6 text-center hover:opacity-90 transition">
          <input type="file" id="pdfInputFiles" accept="application/pdf" ${isMultiPdf ? "multiple" : ""} class="hidden" />
          <label for="pdfInputFiles" class="cursor-pointer flex flex-col items-center">
            <i data-lucide="file-up" class="w-10 h-10 accent-text mb-2"></i>
            <span class="text-sm font-bold theme-text-primary">Click to choose PDF ${isMultiPdf ? "files (select 2 or more)" : "document"}</span>
            <span class="text-xs theme-text-muted mt-1" id="pdfFileStatus">No PDF selected yet</span>
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs theme-text-muted block mb-1">${paramLabel}</label>
            <input id="pdfParamInput" type="text" value="${defaultVal}" class="w-full px-3.5 py-2 rounded-xl text-sm" />
          </div>
          <div class="flex items-end">
            <button id="runPdfActionBtn" class="w-full py-2.5 px-4 rounded-xl accent-gradient text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg">
              <i data-lucide="zap" class="w-4 h-4"></i> Execute: ${tool.name}
            </button>
          </div>
        </div>

        <div id="pdfOutputBox" class="hidden p-4 rounded-2xl glass-subpanel text-xs space-y-2"></div>
      </div>
    `;
    lucide.createIcons();

    const fileInput = container.querySelector("#pdfInputFiles");
    const statusEl = container.querySelector("#pdfFileStatus");
    const outBox = container.querySelector("#pdfOutputBox");

    fileInput.addEventListener("change", () => {
      const files = Array.from(fileInput.files);
      statusEl.textContent = files.length ? `${files.length} file(s): ${files.map(f => f.name).join(", ")}` : "No PDF selected";
    });

    const parsePageIndexes = (selection, pageCount) => {
      const indexes = [];
      const seen = new Set();
      const parts = selection.split(",").map(part => part.trim()).filter(Boolean);
      if (!parts.length) throw new Error("Enter at least one page number.");

      for (const part of parts) {
        const match = part.match(/^(\d+)(?:-(\d+))?$/);
        if (!match) throw new Error(`Invalid page range: "${part}". Use values like 1, 2-4.`);
        const start = Number(match[1]);
        const end = Number(match[2] || match[1]);
        if (start < 1 || end < start || end > pageCount) {
          throw new Error(`Page range "${part}" is outside this document (1-${pageCount}).`);
        }
        for (let page = start; page <= end; page++) {
          const index = page - 1;
          if (!seen.has(index)) {
            indexes.push(index);
            seen.add(index);
          }
        }
      }
      return indexes;
    };

    container.querySelector("#runPdfActionBtn").addEventListener("click", async () => {
      const files = Array.from(fileInput.files);
      if (!files.length) return alert("Please select at least one PDF file first.");
      if (isMultiPdf && files.length < 2) {
        outBox.classList.remove("hidden");
        outBox.textContent = `Select at least two PDF files to ${isCompare ? "compare" : isMerge ? "merge" : "insert pages"}.`;
        return;
      }

      outBox.classList.remove("hidden");
      outBox.innerHTML = `<span class="accent-text font-semibold">Processing PDF in browser memory...</span>`;

      try {
        const { PDFDocument, degrees, rgb } = PDFLib;

        if (isCompare) {
          const p1 = await PDFDocument.load(await files[0].arrayBuffer());
          const p2 = await PDFDocument.load(await files[1].arrayBuffer());
          const cmpText = `PDF Comparison Report:\n• File 1: ${files[0].name} (${p1.getPageCount()} pages, ${(files[0].size/1024).toFixed(1)} KB)\n• File 2: ${files[1].name} (${p2.getPageCount()} pages, ${(files[1].size/1024).toFixed(1)} KB)\n• Page Difference: ${Math.abs(p1.getPageCount() - p2.getPageCount())} page(s)`;
          this.setArtifact({ toolName: tool.name, text: cmpText, filename: "pdf-comparison.txt", mimeType: "text/plain" });
          outBox.classList.add("whitespace-pre-wrap", "text-emerald-400", "font-mono");
          outBox.textContent = cmpText;
          return;
        }

        let outBytes;
        let outName = `processed-${files[0].name}`;

        if (isMerge) {
          const mergedPdf = await PDFDocument.create();
          for (const f of files) {
            const bytes = await f.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((p) => mergedPdf.addPage(p));
          }
          outBytes = await mergedPdf.save();
          outName = "merged-omnitool.pdf";
        } else if (isInsertPages) {
          const destinationPdf = await PDFDocument.load(await files[0].arrayBuffer());
          const sourcePdf = await PDFDocument.load(await files[1].arrayBuffer());
          const targetPage = Number(container.querySelector("#pdfParamInput").value);
          if (!Number.isInteger(targetPage) || targetPage < 1 || targetPage > destinationPdf.getPageCount()) {
            throw new Error(`Choose an insertion page from 1 to ${destinationPdf.getPageCount()}.`);
          }
          const sourcePages = await destinationPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
          sourcePages.forEach((page, index) => destinationPdf.insertPage(targetPage + index, page));
          outBytes = await destinationPdf.save();
          outName = `pages-inserted-${files[0].name}`;
        } else {
          const bytes = await files[0].arrayBuffer();
          const pdfDoc = await PDFDocument.load(bytes);
          const totalPages = pdfDoc.getPageCount();
          const param = container.querySelector("#pdfParamInput").value.trim();

          if (name.includes("rotate")) {
            const angle = Number(param);
            if (!Number.isInteger(angle) || angle % 90 !== 0) {
              throw new Error("Enter a rotation angle that is a multiple of 90 degrees.");
            }
            pdfDoc.getPages().forEach(page => page.setRotation(degrees(((angle % 360) + 360) % 360)));
            outBytes = await pdfDoc.save();
          } else if (name.includes("reverse")) {
            const newPdf = await PDFDocument.create();
            const indices = pdfDoc.getPageIndices().reverse();
            const copied = await newPdf.copyPages(pdfDoc, indices);
            copied.forEach(p => newPdf.addPage(p));
            outBytes = await newPdf.save();
          } else if (name.includes("blank")) {
            const pages = pdfDoc.getPages();
            const size = pages.length ? pages[pages.length - 1].getSize() : { width: 595.28, height: 841.89 };
            pdfDoc.addPage([size.width, size.height]);
            outBytes = await pdfDoc.save();
          } else if (name.includes("delete")) {
            const pageIndexes = parsePageIndexes(param, totalPages).sort((a, b) => b - a);
            if (pageIndexes.length >= totalPages) throw new Error("At least one page must remain in the PDF.");
            pageIndexes.forEach(pageIndex => pdfDoc.removePage(pageIndex));
            outBytes = await pdfDoc.save();
          } else if (name.includes("split") || name.includes("extract")) {
            const newPdf = await PDFDocument.create();
            const pageIndexes = parsePageIndexes(param, totalPages);
            const copied = await newPdf.copyPages(pdfDoc, pageIndexes);
            copied.forEach(page => newPdf.addPage(page));
            outBytes = await newPdf.save();
            outName = `pages-${param.replace(/[^0-9,-]/g, "")}-${files[0].name}`;
          } else if (name.includes("duplicate")) {
            const pageIndexes = parsePageIndexes(param, totalPages);
            const newPdf = await PDFDocument.create();
            const copyIndexes = pdfDoc.getPageIndices().flatMap(index =>
              pageIndexes.includes(index) ? [index, index] : [index]
            );
            const copied = await newPdf.copyPages(pdfDoc, copyIndexes);
            copied.forEach(page => newPdf.addPage(page));
            outBytes = await newPdf.save();
            outName = `duplicated-pages-${files[0].name}`;
          } else if (name.includes("reorder")) {
            const pageIndexes = parsePageIndexes(param, totalPages);
            if (pageIndexes.length !== totalPages || new Set(pageIndexes).size !== totalPages) {
              throw new Error(`Enter every page exactly once to reorder this ${totalPages}-page document.`);
            }
            const newPdf = await PDFDocument.create();
            const copied = await newPdf.copyPages(pdfDoc, pageIndexes);
            copied.forEach(page => newPdf.addPage(page));
            outBytes = await newPdf.save();
            outName = `reordered-${files[0].name}`;
          } else if (supportsPageNumbers || supportsTextStamp) {
            pdfDoc.getPages().forEach((page, i) => {
              const { height } = page.getSize();
              const text = supportsPageNumbers ? `Page ${i + 1} of ${totalPages}` : (param || "OMNITOOL HUB");
              if (supportsPageNumbers || name.includes("footer")) {
                page.drawText(text, { x: 45, y: 35, size: 14, color: rgb(0.85, 0.15, 0.15) });
              }
              if (supportsTextStamp && name.includes("header")) {
                page.drawText(text, { x: 45, y: height - 40, size: 14, color: rgb(0.85, 0.15, 0.15) });
              }
            });
            outBytes = await pdfDoc.save();
          } else if (supportsMetadata) {
            pdfDoc.setTitle(param || "Processed by OmniTool Hub");
            outBytes = await pdfDoc.save();
          }
        }

        const blob = new Blob([outBytes], { type: "application/pdf" });
        this.setArtifact({
          toolName: tool.name,
          text: `Processed PDF: ${outName} (${(blob.size / 1024).toFixed(1)} KB)`,
          blob,
          filename: outName,
          mimeType: "application/pdf"
        });

        outBox.innerHTML = `
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-emerald-400 font-bold">✅ Ready! ${outName} (${(blob.size / 1024).toFixed(1)} KB)</span>
            <span class="theme-text-muted">Click <b>"Share Output Directly"</b> or <b>"Download Output"</b> in the bottom bar!</span>
          </div>
        `;
      } catch (err) {
        outBox.classList.add("text-rose-400");
        outBox.textContent = `Error: ${err.message}`;
      }
    });
  },

  // ============================================================================
  // 2. IMAGE CANVAS STUDIO
  // ============================================================================
  renderImageEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const supportedOperations = [
      /^resize image$/,
      /^compress image$/,
      /^rotate image$/,
      /^flip image horizontally$/,
      /^flip image vertically$/,
      /^convert jpg to png$/,
      /^convert png to jpg$/,
      /^convert image to webp$/,
      /^convert svg to png$/,
      /^remove exif metadata$/,
      /^adjust brightness$/,
      /^adjust contrast$/,
      /^adjust saturation$/,
      /^convert to grayscale$/,
      /^invert image colo?urs$/,
      /^apply image filters$/,
      /^add text to image$/,
      /^add text to image$/
    ];
    if (!supportedOperations.some(pattern => pattern.test(name))) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This image operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">The image editor currently supports resizing, compression/export, rotation, flipping, selected filters, text watermarks, and the listed raster format conversions.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="space-y-3 glass-subpanel p-4 rounded-2xl">
          <label class="block text-xs font-bold uppercase tracking-wider accent-text">1. Upload Image</label>
          <input type="file" id="imgStudioInput" accept="image/*" class="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white cursor-pointer" />

          <div class="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label class="text-[11px] theme-text-muted">Width (px)</label>
              <input type="number" id="imgWidth" class="w-full px-2.5 py-1.5 rounded-lg text-xs" placeholder="Auto" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Height (px)</label>
              <input type="number" id="imgHeight" class="w-full px-2.5 py-1.5 rounded-lg text-xs" placeholder="Auto" />
            </div>
          </div>

          <div class="space-y-1.5 pt-1">
            <label class="text-[11px] theme-text-muted flex justify-between"><span>Brightness</span><span id="valBright">100%</span></label>
            <input type="range" id="imgBright" min="20" max="200" value="100" class="w-full accent-indigo-500" />

            <label class="text-[11px] theme-text-muted flex justify-between"><span>Contrast</span><span id="valContrast">100%</span></label>
            <input type="range" id="imgContrast" min="20" max="200" value="100" class="w-full accent-indigo-500" />

            <label class="text-[11px] theme-text-muted flex justify-between"><span>Saturation</span><span id="valSat">100%</span></label>
            <input type="range" id="imgSat" min="0" max="250" value="100" class="w-full accent-indigo-500" />

            <label class="text-[11px] theme-text-muted flex justify-between"><span>Blur (px)</span><span id="valBlur">0px</span></label>
            <input type="range" id="imgBlur" min="0" max="20" value="0" class="w-full accent-indigo-500" />
          </div>

          <div class="flex flex-wrap gap-1.5 pt-1">
            <button data-act="rot" class="px-2.5 py-1 rounded-lg glass-btn text-xs">Rotate 90°</button>
            <button data-act="flipH" class="px-2.5 py-1 rounded-lg glass-btn text-xs">Flip H</button>
            <button data-act="flipV" class="px-2.5 py-1 rounded-lg glass-btn text-xs">Flip V</button>
            <button data-act="gray" class="px-2.5 py-1 rounded-lg glass-btn text-xs">Grayscale</button>
            <button data-act="invert" class="px-2.5 py-1 rounded-lg glass-btn text-xs">Invert</button>
          </div>

          <div class="pt-1">
            <label class="text-[11px] theme-text-muted block mb-1">Watermark / Overlay Text</label>
            <input type="text" id="imgWatermark" placeholder="Optional text overlay..." class="w-full px-2.5 py-1.5 rounded-lg text-xs" />
          </div>

          <div class="pt-1">
            <label class="text-[11px] theme-text-muted block mb-1">Output Format</label>
            <select id="imgFormat" class="w-full px-2.5 py-1.5 rounded-lg text-xs">
              <option value="image/png">PNG (Lossless)</option>
              <option value="image/jpeg">JPG (Compressed)</option>
              <option value="image/webp">WebP (Modern)</option>
            </select>
          </div>
        </div>

        <div class="lg:col-span-2 glass-subpanel rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px]">
          <canvas id="studioCanvas" class="max-w-full max-h-[340px] rounded-xl border theme-border"></canvas>
          <div id="imgMetaInfo" class="text-xs theme-text-muted mt-3 font-mono text-center">Live HTML5 Canvas • Ready for Direct Share or Download</div>
        </div>
      </div>
    `;

    const canvas = container.querySelector("#studioCanvas");
    const ctx = canvas.getContext("2d");
    let imgObj = new Image();
    let hasLoadedImage = false;
    let rot = 0, flipH = 1, flipV = 1, gray = false, inv = false;

    const syncCanvasArtifact = () => {
      if (!hasLoadedImage) return;
      const fmt = container.querySelector("#imgFormat").value;
      const ext = fmt.split("/")[1];
      canvas.toBlob((blob) => {
        if (blob) {
          this.setArtifact({
            toolName: tool.name,
            text: `Edited Image (${canvas.width}x${canvas.height}) via ${tool.name}`,
            blob,
            filename: `omnitool-image.${ext}`,
            mimeType: fmt
          });
        }
      }, fmt, 0.92);
    };

    canvas.width = 500;
    canvas.height = 280;
    const grad = ctx.createLinearGradient(0, 0, 500, 280);
    grad.addColorStop(0, "#4f46e5");
    grad.addColorStop(1, "#ec4899");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 280);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tool.name, 250, 130);
    ctx.font = "13px sans-serif";
    ctx.fillText("Upload any image on the left to edit, share, or export!", 250, 165);
    syncCanvasArtifact();

    const redraw = () => {
      if (!hasLoadedImage) return;
      const requestedWidth = Number.parseInt(container.querySelector("#imgWidth").value, 10);
      const requestedHeight = Number.parseInt(container.querySelector("#imgHeight").value, 10);
      const w = requestedWidth > 0 ? requestedWidth : imgObj.naturalWidth;
      const h = requestedHeight > 0 ? requestedHeight : imgObj.naturalHeight;
      if (w > 10000 || h > 10000 || w * h > 40000000) {
        container.querySelector("#imgMetaInfo").textContent = "Choose dimensions up to 10,000 px per side and 40 megapixels total.";
        return;
      }
      const outputWidth = rot % 180 === 0 ? w : h;
      const outputHeight = rot % 180 === 0 ? h : w;
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const br = container.querySelector("#imgBright").value;
      const co = container.querySelector("#imgContrast").value;
      const sa = container.querySelector("#imgSat").value;
      const bl = container.querySelector("#imgBlur").value;
      container.querySelector("#valBright").textContent = br + "%";
      container.querySelector("#valContrast").textContent = co + "%";
      container.querySelector("#valSat").textContent = sa + "%";
      container.querySelector("#valBlur").textContent = bl + "px";

      ctx.save();
      ctx.filter = `brightness(${br}%) contrast(${co}%) saturate(${sa}%) blur(${bl}px) ${gray ? "grayscale(100%)" : ""} ${inv ? "invert(100%)" : ""}`;
      ctx.translate(outputWidth / 2, outputHeight / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(flipH, flipV);
      ctx.drawImage(imgObj, -w / 2, -h / 2, w, h);
      ctx.restore();

      const wm = container.querySelector("#imgWatermark").value.trim();
      if (wm) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `bold ${Math.max(18, Math.round(w / 20))}px sans-serif`;
        ctx.textAlign = "right";
        ctx.fillText(wm, outputWidth - 20, outputHeight - 20);
      }

      container.querySelector("#imgMetaInfo").textContent = `Canvas: ${outputWidth} × ${outputHeight} px | Ready to Share or Download`;
      syncCanvasArtifact();
    };

    container.querySelector("#imgStudioInput").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        imgObj.onload = () => {
          hasLoadedImage = true;
          container.querySelector("#imgWidth").value = imgObj.naturalWidth;
          container.querySelector("#imgHeight").value = imgObj.naturalHeight;
          redraw();
        };
        imgObj.onerror = () => {
          container.querySelector("#imgMetaInfo").textContent = "Could not load this image. Choose a supported image file and try again.";
        };
        imgObj.src = ev.target.result;
      };
      reader.onerror = () => {
        container.querySelector("#imgMetaInfo").textContent = "Could not read this image file.";
      };
      reader.readAsDataURL(file);
    });

    ["#imgWidth", "#imgHeight", "#imgBright", "#imgContrast", "#imgSat", "#imgBlur", "#imgWatermark", "#imgFormat"].forEach(sel => {
      container.querySelector(sel).addEventListener("input", redraw);
    });

    container.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.act;
        if (act === "rot") rot = (rot + 90) % 360;
        if (act === "flipH") flipH *= -1;
        if (act === "flipV") flipV *= -1;
        if (act === "gray") gray = !gray;
        if (act === "invert") inv = !inv;
        redraw();
      });
    });
  },

  // 3. ROBOTICS, ROS2, DRONES & ELECTRONICS ENGINE
  renderRoboticsEngine(tool, container) {
    const n = tool.name.toLowerCase();
    const supportsPidVisualization = n.includes("pid parameter visualiser") || n.includes("pid parameter visualizer");
    const supportsPwmVisualization = n.includes("pwm signal visualiser") || n.includes("pwm signal visualizer");

    if (!supportsPidVisualization && !supportsPwmVisualization) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This robotics/engineering operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">The PID and PWM visualizers are separate tools; this workspace will not substitute unrelated engineering calculations.</p>
        </div>
      `;
      return;
    }

    if (supportsPidVisualization || supportsPwmVisualization) {
      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-subpanel p-4 rounded-2xl space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider accent-text">${tool.name}</h3>
            <div>
              <label class="text-xs theme-text-muted flex justify-between"><span>Kp / Duty (%) / Gain</span><span id="valP">55</span></label>
              <input id="sliderP" type="range" min="1" max="100" value="55" class="w-full accent-indigo-500" />
            </div>
            <div>
              <label class="text-xs theme-text-muted flex justify-between"><span>Ki / Frequency (Hz)</span><span id="valI">20</span></label>
              <input id="sliderI" type="range" min="0" max="100" value="20" class="w-full accent-indigo-500" />
            </div>
            <div>
              <label class="text-xs theme-text-muted flex justify-between"><span>Kd / Damping Factor</span><span id="valD">30</span></label>
              <input id="sliderD" type="range" min="0" max="100" value="30" class="w-full accent-indigo-500" />
            </div>
            <div id="roboticsReadout" class="p-3 rounded-xl glass-card text-xs font-mono space-y-1"></div>
          </div>
          <div class="md:col-span-2 glass-subpanel p-4 rounded-2xl flex flex-col">
            <canvas id="roboticsCanvas" width="560" height="250" class="w-full bg-slate-950 rounded-xl border theme-border"></canvas>
            <span class="text-[11px] theme-text-muted mt-2 font-mono">Real-Time Oscilloscope Plot (Directly Shareable as PNG!)</span>
          </div>
        </div>
      `;
      const c = container.querySelector("#roboticsCanvas");
      const ctx = c.getContext("2d");
      const sP = container.querySelector("#sliderP");
      const sI = container.querySelector("#sliderI");
      const sD = container.querySelector("#sliderD");
      const out = container.querySelector("#roboticsReadout");

      const draw = () => {
        const P = parseFloat(sP.value);
        const I = parseFloat(sI.value);
        const D = parseFloat(sD.value);
        container.querySelector("#valP").textContent = P;
        container.querySelector("#valI").textContent = I;
        container.querySelector("#valD").textContent = D;

        ctx.fillStyle = "#090d1a";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.strokeStyle = "#1e293b";
        ctx.beginPath();
        for (let x = 0; x < c.width; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, c.height); }
        for (let y = 0; y < c.height; y += 40) { ctx.moveTo(0, y); ctx.lineTo(c.width, y); }
        ctx.stroke();

        let summaryText = "";
        if (supportsPwmVisualization) {
          const duty = P / 100;
          const cycles = Math.max(2, Math.round(I / 10));
          const periodPx = c.width / cycles;
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let i = 0; i < cycles; i++) {
            const x0 = i * periodPx;
            const xHigh = x0 + periodPx * duty;
            const xEnd = x0 + periodPx;
            ctx.moveTo(x0, 190);
            ctx.lineTo(x0, 55);
            ctx.lineTo(xHigh, 55);
            ctx.lineTo(xHigh, 190);
            ctx.lineTo(xEnd, 190);
          }
          ctx.stroke();
          summaryText = `PWM Duty: ${P}% | V_avg(5V): ${(5 * duty).toFixed(2)}V | V_avg(3.3V): ${(3.3 * duty).toFixed(2)}V`;
          out.innerHTML = `<div>${summaryText}</div>`;
        } else {
          ctx.strokeStyle = "#64748b";
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(0, 75);
          ctx.lineTo(c.width, 75);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          let pos = 210, vel = 0, integral = 0;
          const target = 75;
          for (let x = 0; x < c.width; x++) {
            const err = target - pos;
            integral += err * 0.002;
            const deriv = -vel;
            const force = (P * 0.004) * err + (I * 0.002) * integral + (D * 0.015) * deriv;
            vel = vel * 0.92 + force;
            pos += vel;
            if (x === 0) ctx.moveTo(x, pos);
            else ctx.lineTo(x, pos);
          }
          ctx.stroke();
          summaryText = `PID Step Response — Kp: ${(P/10).toFixed(1)}, Ki: ${(I/100).toFixed(2)}, Kd: ${(D/10).toFixed(1)}`;
          out.innerHTML = `<div>${summaryText}</div><div class="text-emerald-400">Solid = Plant Output, Dashed = Setpoint</div>`;
        }

        c.toBlob((blob) => {
          this.setArtifact({
            toolName: tool.name,
            text: summaryText,
            blob,
            filename: `${tool.id}-oscilloscope.png`,
            mimeType: "image/png"
          });
        });
      };
      [sP, sI, sD].forEach(el => el.addEventListener("input", draw));
      draw();
      return;
    }

  },

  // 4. QR CODE GENERATOR ENGINE
  renderQrEngine(tool, container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <label class="text-xs font-bold theme-text-primary block">Enter URL, Wi-Fi Credentials, vCard, or Text</label>
          <textarea id="qrTextInput" rows="4" class="w-full p-3 rounded-xl text-sm">https://kuaman-student.github.io/omnitool-hub/</textarea>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[11px] theme-text-muted">Foreground Color</label>
              <input type="color" id="qrFg" value="#000000" class="w-full h-9 rounded cursor-pointer" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Background Color</label>
              <input type="color" id="qrBg" value="#ffffff" class="w-full h-9 rounded cursor-pointer" />
            </div>
          </div>
          <button id="genQrBtn" class="w-full py-2.5 rounded-xl accent-gradient text-white font-bold text-xs shadow-lg">Generate High-Res QR Code</button>
        </div>
        <div class="glass-subpanel p-4 rounded-2xl flex flex-col items-center justify-center">
          <div id="qrCanvasTarget" class="p-4 bg-white rounded-2xl shadow-lg"></div>
          <p class="text-xs text-emerald-400 mt-3 font-medium">Use "Share Output Directly" below to share this QR image without downloading!</p>
        </div>
      </div>
    `;
    const target = container.querySelector("#qrCanvasTarget");
    const makeQr = () => {
      target.innerHTML = "";
      const txt = container.querySelector("#qrTextInput").value || "https://kuaman-student.github.io/omnitool-hub/";
      new QRCode(target, {
        text: txt,
        width: 220,
        height: 220,
        colorDark: container.querySelector("#qrFg").value,
        colorLight: container.querySelector("#qrBg").value
      });
      setTimeout(() => {
        const qrCanvas = target.querySelector("canvas");
        if (qrCanvas) {
          qrCanvas.toBlob((blob) => {
            this.setArtifact({
              toolName: tool.name,
              text: `QR Code for: ${txt}`,
              blob,
              filename: `qrcode-${tool.id}.png`,
              mimeType: "image/png"
            });
          });
        }
      }, 150);
    };
    container.querySelector("#genQrBtn").addEventListener("click", makeQr);
    makeQr();
  },

  renderQrDecoderEngine(tool, container) {
    if (tool.name.toLowerCase().includes("webcam")) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">Webcam QR scanning is not implemented yet.</p>
          <p class="text-xs theme-text-muted">Use the image-based QR decoder instead; this tool will not request camera access or claim a scan succeeded.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3 glass-subpanel p-4 rounded-2xl">
        <label for="qrDecodeFile" class="text-xs font-bold theme-text-primary block">Choose an image containing a QR code</label>
        <input id="qrDecodeFile" type="file" accept="image/*" class="text-xs" />
        <button id="decodeQrBtn" type="button" class="px-4 py-2 rounded-xl accent-gradient text-white text-xs font-bold">Decode QR image</button>
        <p id="qrDecodeStatus" class="text-xs theme-text-muted" role="status" aria-live="polite"></p>
        <pre id="qrDecodeOutput" class="text-xs font-mono whitespace-pre-wrap break-all"></pre>
      </div>
    `;

    const input = container.querySelector("#qrDecodeFile");
    const status = container.querySelector("#qrDecodeStatus");
    const output = container.querySelector("#qrDecodeOutput");
    container.querySelector("#decodeQrBtn").addEventListener("click", async () => {
      const file = input.files[0];
      if (!file) {
        status.textContent = "Choose an image file first.";
        return;
      }
      if (typeof window.BarcodeDetector !== "function" && typeof window.jsQR !== "function") {
        status.textContent = "QR decoding is unavailable because this browser has neither Barcode Detection support nor the jsQR decoder loaded.";
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      try {
        const image = await new Promise((resolve, reject) => {
          const element = new Image();
          element.onload = () => resolve(element);
          element.onerror = () => reject(new Error("Could not read the selected image."));
          element.src = imageUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable for QR decoding.");
        context.drawImage(image, 0, 0);

        let decoded;
        if (typeof window.BarcodeDetector === "function") {
          const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
          const results = await detector.detect(canvas);
          decoded = results.map(result => result.rawValue).filter(Boolean);
        } else {
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
          const result = window.jsQR(pixels.data, pixels.width, pixels.height);
          decoded = result ? [result.data] : [];
        }
        if (!decoded.length) {
          output.textContent = "";
          status.textContent = "No QR code was found in this image.";
          return;
        }

        output.textContent = decoded.join("\n");
        status.textContent = `Decoded ${decoded.length} QR code(s).`;
        this.setArtifact({
          toolName: tool.name,
          text: output.textContent,
          filename: `decoded-qr-${tool.id}.txt`,
          mimeType: "text/plain"
        });
      } catch (error) {
        status.textContent = `QR decoding failed: ${error.message}`;
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    });
  },

  // 5. FINTECH, GST, STARTUP & BUSINESS ENGINE
  renderFinTechEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const kind = name.includes("gst") || name.includes("cgst") || name.includes("tax breakup") ? "gst"
      : name.includes("emi") ? "emi"
      : name.includes("sip") ? "sip"
      : name.includes("runway") || name.includes("burn-rate") ? "runway"
      : name.includes("discount") && !name.includes("discounted cash flow") && !name.includes("annual vs monthly") ? "discount"
      : name.includes("net profit margin") ? null
      : name.includes("gross margin") || name.includes("markup") ? "margin"
      : name.includes("return on investment") || name.includes("(roi)") ? "roi"
      : name.includes("customer acquisition cost") || name.includes("(cac)") ? "cac"
      : name.includes("lifetime value") || name.includes("(ltv)") ? "ltv"
      : (name.includes("mrr") || name.includes("arr")) && !name.includes("growth") ? "recurring"
      : name.includes("break-even") ? "breakeven"
      : name.includes("compound annual growth rate") || name.includes("(cagr)") ? "cagr"
      : name.includes("return on ad spend") || name.includes("(roas)") ? "roas"
      : name.includes("cpm") || name.includes("cpc") || name.includes("ctr") ? "ads"
      : name.includes("bill splitter") || name.includes("group tip") ? "bill"
      : null;

    if (!kind) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This specific financial calculation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">No unrelated financial figures will be shown as the result.</p>
        </div>
      `;
      return;
    }

    const definitions = {
      gst: ["Taxable amount", "GST rate (%)", "Duration (not used)", "Monthly amount (not used)"],
      emi: ["Loan principal", "Annual interest rate (%)", "Loan term (years)", "Extra (not used)"],
      sip: ["Monthly investment", "Expected annual return (%)", "Investment term (years)", "Extra (not used)"],
      runway: ["Available cash reserve", "Monthly cash burn", "Extra (not used)", "Extra (not used)"],
      discount: ["Original price", "Discount (%)", "Extra (not used)", "Extra (not used)"],
      margin: ["Cost / purchase price", "Selling price", "Extra (not used)", "Extra (not used)"],
      roi: ["Initial investment", "Current value / proceeds", "Extra (not used)", "Extra (not used)"],
      cac: ["Sales and marketing spend", "New customers acquired", "Extra (not used)", "Extra (not used)"],
      ltv: ["Monthly revenue per customer", "Gross margin (%)", "Customer lifetime (months)", "Extra (not used)"],
      recurring: ["Number of customers", "Monthly revenue per customer", "Extra (not used)", "Extra (not used)"],
      breakeven: ["Fixed costs", "Price per unit", "Variable cost per unit", "Extra (not used)"],
      cagr: ["Starting value", "Ending value", "Number of years", "Extra (not used)"],
      roas: ["Revenue attributed to ads", "Advertising spend", "Extra (not used)", "Extra (not used)"],
      ads: ["Advertising spend", "Impressions", "Clicks", "Extra (not used)"],
      bill: ["Bill amount", "Number of people", "Tip (%)", "Extra (not used)"]
    };
    const labels = definitions[kind];

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider accent-text">${tool.name}</h3>
          <div class="grid grid-cols-2 gap-2.5">
            ${labels.map((label, index) => `
              <div class="${label.includes("not used") ? "hidden" : ""}">
                <label class="text-[11px] theme-text-muted">${label}</label>
                <input id="fin${String.fromCharCode(65 + index)}" type="number" step="any"
                  value="${kind === "gst" ? [50000, 18][index] || 0
                    : kind === "emi" ? [500000, 8.5, 20][index] || 0
                    : kind === "sip" ? [8000, 12, 10][index] || 0
                    : kind === "runway" ? [500000, 80000][index] || 0
                    : kind === "discount" ? [1000, 10][index] || 0
                    : kind === "margin" ? [600, 1000][index] || 0
                    : kind === "roi" || kind === "roas" ? [10000, 15000][index] || 0
                    : kind === "cac" ? [10000, 20][index] || 0
                    : kind === "ltv" ? [1000, 60, 24][index] || 0
                    : kind === "recurring" ? [100, 50, 5][index] || 0
                    : kind === "breakeven" ? [100000, 500, 300][index] || 0
                    : kind === "cagr" ? [10000, 20000, 5][index] || 0
                    : kind === "ads" ? [10000, 500000, 2000][index] || 0
                    : [1000, 4, 10][index] || 0}" class="w-full px-3 py-1.5 rounded-lg text-sm" />
              </div>
            `).join("")}
          </div>
        </div>
        <div id="finOut" class="glass-subpanel p-4 rounded-2xl font-mono text-xs space-y-2 whitespace-pre-wrap" role="status" aria-live="polite"></div>
      </div>
    `;
    const calcFin = () => {
      const values = ["A", "B", "C", "D"].map(letter =>
        Number(container.querySelector(`#fin${letter}`)?.value || 0)
      );
      const [a, b, c] = values;
      const out = container.querySelector("#finOut");
      if (values.some(value => !Number.isFinite(value) || value < 0)) {
        out.textContent = "Enter valid non-negative numbers.";
        return;
      }

      let text;
      if (kind === "gst") {
        if (b >= 100) { out.textContent = "GST rate must be below 100%."; return; }
        const tax = a * b / 100;
        const inclusiveBase = a / (1 + b / 100);
        text = `GST-exclusive total: ${(a + tax).toFixed(2)}\nTax amount: ${tax.toFixed(2)}\nCGST + SGST (intra-state): ${(tax / 2).toFixed(2)} each\nIGST (inter-state): ${tax.toFixed(2)}\nGST-inclusive base (if entered amount includes tax): ${inclusiveBase.toFixed(2)}\nEmbedded tax: ${(a - inclusiveBase).toFixed(2)}`;
      } else if (kind === "emi") {
        if (c <= 0) { out.textContent = "Loan term must be greater than zero."; return; }
        const rate = b / 1200;
        const months = c * 12;
        const emi = rate === 0 ? a / months : a * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
        text = `Monthly EMI: ${emi.toFixed(2)}\nTotal repayment: ${(emi * months).toFixed(2)}\nTotal interest: ${(emi * months - a).toFixed(2)}`;
      } else if (kind === "sip") {
        if (c <= 0) { out.textContent = "Investment term must be greater than zero."; return; }
        const rate = b / 1200;
        const months = c * 12;
        const value = rate === 0 ? a * months : a * ((1 + rate) ** months - 1) / rate;
        text = `Invested amount: ${(a * months).toFixed(2)}\nEstimated maturity value: ${value.toFixed(2)}\nEstimated gains: ${(value - a * months).toFixed(2)}\nAssumes end-of-month contributions and a constant return.`;
      } else if (kind === "runway") {
        if (b <= 0) { out.textContent = "Monthly cash burn must be greater than zero."; return; }
        text = `Estimated runway: ${(a / b).toFixed(2)} months`;
      } else if (kind === "discount") {
        if (b > 100) { out.textContent = "Discount cannot exceed 100%."; return; }
        text = `Discount amount: ${(a * b / 100).toFixed(2)}\nPrice after discount: ${(a * (1 - b / 100)).toFixed(2)}`;
      } else if (kind === "margin") {
        if (a <= 0 || b <= 0) { out.textContent = "Cost and selling price must be greater than zero."; return; }
        const profit = b - a;
        text = `Gross profit: ${profit.toFixed(2)}\nGross margin: ${(profit / b * 100).toFixed(2)}%\nMarkup on cost: ${(profit / a * 100).toFixed(2)}%`;
      } else if (kind === "roi") {
        if (a <= 0) { out.textContent = "Initial investment must be greater than zero."; return; }
        text = `Profit / loss: ${(b - a).toFixed(2)}\nROI: ${((b - a) / a * 100).toFixed(2)}%`;
      } else if (kind === "cac") {
        if (b <= 0) { out.textContent = "Customer count must be greater than zero."; return; }
        text = `Customer acquisition cost: ${(a / b).toFixed(2)} per customer`;
      } else if (kind === "ltv") {
        if (c <= 0 || b > 100) { out.textContent = "Lifetime must be positive and gross margin cannot exceed 100%."; return; }
        const ltv = a * b / 100 * c;
        text = `Estimated customer lifetime value: ${ltv.toFixed(2)}\nLTV:CAC is not shown because acquisition cost was not provided.`;
      } else if (kind === "recurring") {
        text = `Monthly recurring revenue (MRR): ${(a * b).toFixed(2)}\nAnnual recurring revenue (ARR): ${(a * b * 12).toFixed(2)}\nCustomer count: ${a}\nMonthly revenue per customer: ${b.toFixed(2)}`;
      } else if (kind === "breakeven") {
        if (b <= c) { out.textContent = "Price per unit must exceed variable cost per unit."; return; }
        const units = a / (b - c);
        text = `Break-even volume: ${Math.ceil(units)} units\nBreak-even revenue: ${(Math.ceil(units) * b).toFixed(2)}`;
      } else if (kind === "cagr") {
        if (a <= 0 || c <= 0) { out.textContent = "Starting value and duration must be greater than zero."; return; }
        text = `Compound annual growth rate: ${(((b / a) ** (1 / c) - 1) * 100).toFixed(2)}%`;
      } else if (kind === "roas") {
        if (b <= 0) { out.textContent = "Advertising spend must be greater than zero."; return; }
        text = `ROAS: ${(a / b).toFixed(2)}x\nRevenue per 1 unit of ad spend`;
      } else if (kind === "ads") {
        if (b <= 0) { out.textContent = "Impressions must be greater than zero."; return; }
        text = `CPM: ${(a / b * 1000).toFixed(2)}\nCTR: ${(c / b * 100).toFixed(2)}%\nCPC: ${c > 0 ? (a / c).toFixed(2) : "undefined (no clicks)"}`;
      } else {
        if (b <= 0 || c < 0) { out.textContent = "Enter a positive number of people and a non-negative tip."; return; }
        const total = a * (1 + c / 100);
        text = `Tip amount: ${(a * c / 100).toFixed(2)}\nTotal bill: ${total.toFixed(2)}\nPer person: ${(total / b).toFixed(2)}`;
      }

      out.textContent = text;
      this.setArtifact({ toolName: tool.name, text, filename: `fintech-${tool.id}-report.txt`, mimeType: "text/plain" });
    };
    ["#finA", "#finB", "#finC", "#finD"].forEach(s => container.querySelector(s).addEventListener("input", calcFin));
    calcFin();
  },

  // 6. AI PROMPTS, LLM TOKEN & AGENT ENGINE
  renderAiLlmEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const modes = [];
    if (name.includes("token counter") || name.includes("token estimator")) modes.push("tokens");
    if (name.includes("system prompt template") || name.includes("anthropic xml tag")) modes.push("sysprompt");
    if (name.includes("json schema generator")) modes.push("jsonschema");
    if (name.includes("rag text chunk")) modes.push("ragchunk");
    if (name.includes("pii redactor")) modes.push("pii");
    if (name.includes("prompt token-golf")) modes.push("minify");

    if (!modes.length) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This AI/LLM operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">No model-backed answer or unrelated prompt utility will be presented as its result.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          ${modes.map((mode, index) => {
            const labels = {
              tokens: "Estimate Tokens",
              sysprompt: "Build System Prompt",
              jsonschema: "Generate Tool JSON Schema",
              ragchunk: "Preview Character Chunks",
              pii: "Redact Email/Phone",
              minify: "Minify Prompt"
            };
            return `<button data-ai="${mode}" class="px-3 py-1.5 rounded-xl ${index === 0 ? "accent-gradient text-white" : "glass-btn"} text-xs font-bold">${labels[mode]}</button>`;
          }).join("")}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea id="aiIn" rows="8" class="w-full p-3 rounded-2xl text-xs font-mono" placeholder="Paste prompt, document, or agent instructions..."></textarea>
          <textarea id="aiOut" rows="8" readonly class="w-full p-3 rounded-2xl text-xs font-mono"></textarea>
        </div>
      </div>
    `;
    const inp = container.querySelector("#aiIn");
    const out = container.querySelector("#aiOut");

    const runAi = (mode) => {
      const v = inp.value;
      const chars = v.length;
      const words = v.trim() ? v.trim().split(/\s+/).length : 0;
      const estTokens = Math.ceil(chars / 4);

      if (mode === "tokens") {
        out.value = [
          `=== Approximate Token Estimate (${tool.name}) ===`,
          `Characters: ${chars} | Words: ${words}`,
          `Rough estimate (~4 characters/token): ${estTokens} tokens`,
          `Token counts and costs vary by model, tokenizer, and provider pricing; this is not an exact quote.`
        ].join("\n");
      } else if (mode === "sysprompt") {
        out.value = name.includes("anthropic xml tag")
          ? `<instructions>\n${v}\n</instructions>`
          : `<system_instructions>\n  <role>${tool.name} Specialist</role>\n  <objective>${v}</objective>\n  <guidelines>\n    - Provide deterministic, structured outputs.\n    - Validate edge cases rigorously.\n  </guidelines>\n</system_instructions>`;
      } else if (mode === "jsonschema") {
        out.value = JSON.stringify({
          type: "function",
          function: {
            name: tool.name.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
            description: v.slice(0, 120),
            parameters: {
              type: "object",
              properties: { input_query: { type: "string" }, strict_mode: { type: "boolean" } },
              required: ["input_query"]
            }
          }
        }, null, 2);
      } else if (mode === "ragchunk") {
        const chunks = v.match(/[\s\S]{1,120}/g) || [];
        out.value = chunks.map((c, i) => `[Character chunk #${i + 1}]: ${c}`).join("\n\n");
      } else if (mode === "pii") {
        out.value = v
          .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[REDACTED_EMAIL]")
          .replace(/\b\d{10,12}\b/g, "[REDACTED_PHONE]");
        out.value += "\n\nNote: only email-like strings and 10–12 digit numbers are detected.";
      } else if (mode === "minify") {
        out.value = v.replace(/\s+/g, " ").trim();
      }
      this.setArtifact({ toolName: tool.name, text: out.value, filename: `ai-tool-${tool.id}.txt` });
    };
    container.querySelectorAll("[data-ai]").forEach(b => b.addEventListener("click", () => runAi(b.dataset.ai)));
    inp.addEventListener("input", () => {
      if (modes.includes("tokens")) runAi("tokens");
    });
    runAi(modes[0]);
  },

  // 7. DEVELOPER, SECURITY, CYBER-FORENSICS, WEB & DESIGN ENGINE
  renderDevSecurityEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const supportedOps = new Set();
    if (name.includes("json") && (name.includes("format") || name.includes("beautif"))) supportedOps.add("jsonFmt");
    if (name.includes("json") && name.includes("minif")) supportedOps.add("jsonMin");
    if (name.includes("base64") && !name.includes("data-uri") && (name.includes("encode") || name.includes("to base64"))) supportedOps.add("b64Enc");
    if (name.includes("base64") && !name.includes("data-uri") && (name.includes("decode") || name.includes("from base64") || name.includes("to text"))) supportedOps.add("b64Dec");
    if (name.includes("sha-256") || name.includes("sha256")) supportedOps.add("sha256");
    if (name.includes("sha-512") || name.includes("sha512")) supportedOps.add("sha512");
    if (name.includes("uuid") && (name.includes("generate") || name.includes("generator"))) supportedOps.add("uuid");
    if (name.includes("password") && (name.includes("generate") || name.includes("generator"))) supportedOps.add("pass");
    if (name.includes("rot13") && !name.includes("caesar")) supportedOps.add("rot13");
    if (name.includes("defang") && !name.includes("refang")) supportedOps.add("defang");

    if (!supportedOps.size) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This developer/security operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">Available operations are selected by name; unrelated formatting or security results will not be substituted.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-1.5">
          <button data-dev="jsonFmt" class="px-3 py-1.5 rounded-xl accent-gradient text-xs font-bold text-white">Format JSON</button>
          <button data-dev="jsonMin" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Minify JSON</button>
          <button data-dev="b64Enc" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Base64 Encode</button>
          <button data-dev="b64Dec" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Base64 Decode</button>
          <button data-dev="sha256" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">SHA-256 Hash</button>
          <button data-dev="sha512" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">SHA-512 Hash</button>
          <button data-dev="uuid" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Generate UUIDs</button>
          <button data-dev="pass" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Crypto Password</button>
          <button data-dev="rot13" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">ROT13 Cipher</button>
          <button data-dev="defang" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Defang URL/IP</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea id="devInput" rows="9" class="w-full p-3 rounded-2xl font-mono text-xs">{\n  "toolId": ${tool.id},\n  "toolName": "${tool.name}",\n  "category": "${tool.categoryName}",\n  "clientSidePrivacy": true\n}</textarea>
          <textarea id="devOutput" rows="9" readonly class="w-full p-3 rounded-2xl font-mono text-xs"></textarea>
        </div>
      </div>
    `;

    const inp = container.querySelector("#devInput");
    const out = container.querySelector("#devOutput");
    container.querySelectorAll("[data-dev]").forEach(btn => {
      if (!supportedOps.has(btn.dataset.dev)) btn.remove();
    });
    if (supportedOps.has("b64Dec")) inp.value = "SGVsbG8sIFdvcmxkIQ==";
    else if (!supportedOps.has("jsonFmt") && !supportedOps.has("jsonMin")) inp.value = "OmniTool Hub";

    const runOp = async (op) => {
      const val = inp.value;
      try {
        if (op === "jsonFmt") out.value = JSON.stringify(JSON.parse(val), null, 2);
        else if (op === "jsonMin") out.value = JSON.stringify(JSON.parse(val));
        else if (op === "b64Enc") out.value = btoa(unescape(encodeURIComponent(val)));
        else if (op === "b64Dec") out.value = decodeURIComponent(escape(atob(val.trim())));
        else if (op === "sha256" || op === "sha512") {
          const algo = op === "sha256" ? "SHA-256" : "SHA-512";
          const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(val));
          out.value = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
        } else if (op === "uuid") {
          out.value = Array.from({ length: 10 }, () => crypto.randomUUID()).join("\n");
        } else if (op === "pass") {
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-=";
          const limit = 256 - (256 % chars.length);
          let password = "";
          while (password.length < 24) {
            const randomBytes = crypto.getRandomValues(new Uint8Array(32));
            for (const byte of randomBytes) {
              if (byte < limit) password += chars[byte % chars.length];
              if (password.length === 24) break;
            }
          }
          out.value = password;
        } else if (op === "rot13") {
          out.value = val.replace(/[a-z]/gi, char => {
            const base = char <= "Z" ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
          });
        } else if (op === "defang") {
          out.value = val.replace(/\./g, "[.]").replace(/http/gi, "hxxp");
        }
        this.setArtifact({
          toolName: tool.name,
          text: out.value,
          filename: `dev-${tool.id}-output.txt`,
          mimeType: "text/plain"
        });
      } catch (e) {
        out.value = "Error: " + e.message;
      }
    };

    container.querySelectorAll("[data-dev]").forEach(btn => {
      btn.addEventListener("click", () => runOp(btn.dataset.dev));
    });
    runOp(supportedOps.values().next().value);
  },

  // 8. DATA & SPREADSHEET CSV/JSON ENGINE
  renderDataSpreadsheetEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const mode = /csv[\s-]*to[\s-]*json/.test(name) ? "toJson"
      : name.includes("duplicate") && name.includes("row") ? "dedup"
      : name.includes("sort") && (name.includes("row") || name.includes("table")) ? "sort"
      : name.includes("dataset statistics") ? "stats"
      : null;
    if (!mode) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This data operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">This workspace currently supports CSV-to-JSON, duplicate-row removal, row sorting, and basic dataset statistics only.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <button data-csv="${mode}" class="px-3 py-1.5 rounded-xl accent-gradient text-white text-xs font-bold">${{
            toJson: "CSV → JSON",
            dedup: "Deduplicate Rows",
            sort: "Sort Rows A→Z",
            stats: "Dataset Statistics"
          }[mode]}</button>
        </div>
        <div id="csvStatus" class="text-xs theme-text-muted" role="status" aria-live="polite"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea id="csvIn" rows="8" class="w-full p-3 rounded-2xl font-mono text-xs">name,domain,score\nAman,Robotics,98\nElena,AI,95\nLiam,Embedded,89\nAman,Robotics,98</textarea>
          <textarea id="csvOut" rows="8" readonly class="w-full p-3 rounded-2xl font-mono text-xs"></textarea>
        </div>
      </div>
    `;
    const csvIn = container.querySelector("#csvIn");
    const csvOut = container.querySelector("#csvOut");
    const status = container.querySelector("#csvStatus");

    const parseCsv = (source) => {
      const rows = [];
      let row = [];
      let field = "";
      let quoted = false;
      let closedQuote = false;

      for (let i = 0; i < source.length; i++) {
        const char = source[i];
        if (quoted) {
          if (char === '"' && source[i + 1] === '"') {
            field += '"';
            i++;
          } else if (char === '"') {
            quoted = false;
            closedQuote = true;
          } else {
            field += char;
          }
          continue;
        }

        if (char === '"' && field.length === 0 && !closedQuote) {
          quoted = true;
        } else if (char === "," || char === "\n" || char === "\r") {
          row.push(field);
          field = "";
          closedQuote = false;
          if (char !== ",") {
            if (char === "\r" && source[i + 1] === "\n") i++;
            if (!(row.length === 1 && row[0] === "")) rows.push(row);
            row = [];
          }
        } else {
          if (closedQuote) throw new Error("Unexpected characters after a closing quote.");
          if (char === '"') throw new Error('Quote characters inside a CSV field must be escaped as "".');
          field += char;
        }
      }

      if (quoted) throw new Error("A quoted CSV field is not closed.");
      if (field.length || row.length) {
        row.push(field);
        rows.push(row);
      }
      return rows;
    };

    const serializeCsv = (rows) => rows.map(row => row.map(value => {
      const text = String(value ?? "");
      return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    }).join(",")).join("\n");

    const runCsv = (mode) => {
      try {
        const rows = parseCsv(csvIn.value);
        if (!rows.length) throw new Error("Enter CSV data first.");
        const headers = rows[0].map(header => header.trim());
        if (headers.some(header => !header)) throw new Error("Every column needs a header.");
        if (new Set(headers).size !== headers.length) throw new Error("Column names must be unique.");
        if (rows.slice(1).some(dataRow => dataRow.length > headers.length)) {
          throw new Error("A data row contains more values than the header.");
        }
        const dataRows = rows.slice(1).map(dataRow =>
          Array.from({ length: headers.length }, (_, index) => dataRow[index] ?? "")
        );

        if (mode === "toJson") {
          csvOut.value = JSON.stringify(dataRows.map(dataRow =>
            Object.fromEntries(headers.map((header, index) => [header, dataRow[index]]))
          ), null, 2);
        } else if (mode === "dedup") {
          const uniqueRows = [...new Map(dataRows.map(dataRow => [JSON.stringify(dataRow), dataRow])).values()];
          csvOut.value = serializeCsv([rows[0], ...uniqueRows]);
        } else if (mode === "sort") {
          const sortedRows = [...dataRows].sort((a, b) =>
            a[0].localeCompare(b[0], undefined, { sensitivity: "base" })
          );
          csvOut.value = serializeCsv([rows[0], ...sortedRows]);
        } else if (mode === "stats") {
          csvOut.value = `Data rows: ${dataRows.length}\nColumns: ${headers.length}\nUnique data rows: ${new Set(dataRows.map(JSON.stringify)).size}`;
        }
        status.textContent = `${dataRows.length} data row(s), ${headers.length} column(s).`;
        this.setArtifact({
          toolName: tool.name,
          text: csvOut.value,
          filename: mode === "toJson" ? `data-${tool.id}.json` : `data-${tool.id}.${mode === "stats" ? "txt" : "csv"}`,
          mimeType: mode === "toJson" ? "application/json" : mode === "stats" ? "text/plain" : "text/csv"
        });
      } catch (error) {
        csvOut.value = "";
        status.textContent = error.message;
        status.classList.add("text-rose-400");
        return;
      }
      status.classList.remove("text-rose-400");
    };
    container.querySelectorAll("[data-csv]").forEach(b => b.addEventListener("click", () => runCsv(b.dataset.csv)));
    runCsv(mode);
  },

  // 9. AUDIO, VIDEO & CREATOR ENGINE
  renderMediaEngine(tool, container) {
    const n = tool.name.toLowerCase();
    const isTextToSpeech = n.includes("generate speech from text") || n.includes("text to speech") || n.includes("tts reader");
    const supportsFrameCapture = n.includes("video thumbnail") || n.includes("capture video frame");
    const supportsMetadata = n.includes("metadata") || n.includes("inspect video");
    const supportsPlaybackSpeed = n.includes("playback speed") || n.includes("video speed") || n.includes("audio speed");

    if (n.includes("transcribe")) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">Speech transcription is not implemented yet.</p>
          <p class="text-xs theme-text-muted">The browser speech-synthesis API reads text aloud; it cannot transcribe audio into text.</p>
        </div>
      `;
      return;
    }

    if (isTextToSpeech) {
      container.innerHTML = `
        <div class="space-y-3 glass-subpanel p-4 rounded-2xl">
          <label class="text-xs theme-text-muted block">Enter text to read aloud with browser speech synthesis.</label>
          <textarea id="ttsInput" rows="5" class="w-full p-3 rounded-xl text-sm" placeholder="Type text to read aloud..."></textarea>
          <p id="ttsStatus" class="text-xs theme-text-muted" role="status" aria-live="polite"></p>
          <div class="flex gap-2">
            <button id="speakBtn" class="px-4 py-2 rounded-xl accent-gradient text-white text-xs font-bold">Speak Aloud (TTS)</button>
            <button id="stopSpeakBtn" class="px-4 py-2 rounded-xl glass-btn text-rose-400 text-xs font-semibold">Stop Audio</button>
          </div>
        </div>
      `;
      const ta = container.querySelector("#ttsInput");
      ta.addEventListener("input", () => this.setArtifact({ toolName: tool.name, text: ta.value, filename: `script-${tool.id}.txt` }));
      this.setArtifact({ toolName: tool.name, text: ta.value, filename: `script-${tool.id}.txt` });
      container.querySelector("#speakBtn").addEventListener("click", () => {
        if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance !== "function") {
          container.querySelector("#ttsStatus").textContent = "Speech synthesis is unavailable in this browser.";
          return;
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(ta.value));
      });
      container.querySelector("#stopSpeakBtn").addEventListener("click", () => window.speechSynthesis.cancel());
      return;
    }

    if (!supportsFrameCapture && !supportsMetadata && !supportsPlaybackSpeed) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This audio/video operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">The media preview can inspect and play files, but it will not pretend to convert or edit them.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        <div class="glass-subpanel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <input type="file" id="mediaFileInput" accept="${supportsFrameCapture ? "video/*" : "video/*,audio/*"}" class="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white" />
          <div class="flex items-center gap-2 ${supportsPlaybackSpeed ? "" : "hidden"}">
            <select id="mediaSpeed" class="px-2.5 py-1.5 rounded-xl text-xs">
              <option value="0.5">0.5x Slow-Mo</option>
              <option value="1" selected>1.0x Normal</option>
              <option value="1.5">1.5x Fast</option>
              <option value="2">2.0x Double</option>
            </select>
            <button id="snapFrameBtn" class="px-3.5 py-1.5 rounded-xl accent-gradient text-white text-xs font-bold ${supportsFrameCapture ? "" : "hidden"}">Capture Video Frame</button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="glass-subpanel p-3 rounded-2xl flex flex-col items-center justify-center">
            <video id="mediaPlayer" controls class="max-h-56 w-full rounded-xl bg-black"></video>
            <div id="mediaMeta" class="text-[11px] font-mono theme-text-muted mt-2">Select any video or audio file to inspect or capture frames</div>
            <div class="text-[10px] theme-text-muted mt-1">Playback controls affect preview only; the source file is not modified.</div>
          </div>
          <div class="glass-subpanel p-3 rounded-2xl flex flex-col items-center justify-center">
            <canvas id="frameCanvas" width="320" height="180" class="max-h-56 w-full rounded-xl border theme-border bg-slate-950"></canvas>
            <span class="text-[11px] text-emerald-400 mt-2">${supportsFrameCapture ? "Captured frame" : "Preview"}</span>
          </div>
        </div>
      </div>
    `;
    const player = container.querySelector("#mediaPlayer");
    const fCanvas = container.querySelector("#frameCanvas");
    let mediaUrl = null;
    this.activeCleanup = () => {
      player.pause();
      player.removeAttribute("src");
      player.load();
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
    container.querySelector("#mediaFileInput").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      mediaUrl = URL.createObjectURL(f);
      player.src = mediaUrl;
      player.onloadedmetadata = () => {
        const info = `${f.name} | ${(f.size/1024/1024).toFixed(2)} MB | Duration: ${player.duration.toFixed(1)}s`;
        container.querySelector("#mediaMeta").textContent = info;
        if (supportsMetadata) {
          this.setArtifact({ toolName: tool.name, text: info, filename: `media-metadata-${tool.id}.txt`, mimeType: "text/plain" });
        }
      };
    });
    player.addEventListener("error", () => {
      container.querySelector("#mediaMeta").textContent = "This media file could not be previewed in the browser.";
    });
    container.querySelector("#mediaSpeed").addEventListener("change", (e) => {
      player.playbackRate = parseFloat(e.target.value);
    });
    container.querySelector("#snapFrameBtn").addEventListener("click", () => {
      if (!player.videoWidth) return alert("Please load a video file first.");
      fCanvas.width = player.videoWidth;
      fCanvas.height = player.videoHeight;
      const context = fCanvas.getContext("2d");
      if (!context) return alert("Canvas is unavailable for frame capture.");
      context.drawImage(player, 0, 0);
      fCanvas.toBlob((blob) => {
        if (!blob) return;
        this.setArtifact({ toolName: tool.name, text: "Captured Video Frame", blob, filename: "video-frame.png", mimeType: "image/png" });
      });
    });
  },

  evaluateArithmeticExpression(expression) {
    const compact = expression.replace(/\s/g, "");
    const tokens = compact.match(/\d+(?:\.\d*)?|\.\d+|[()+\-*/%^]/g) || [];
    if (!compact || tokens.join("") !== compact) {
      throw new Error("Use numbers, parentheses, and +, -, *, /, %, or ^ operators only.");
    }

    let position = 0;
    const parsePrimary = () => {
      const token = tokens[position++];
      if (token === "(") {
        const value = parseExpression();
        if (tokens[position++] !== ")") throw new Error("Missing closing parenthesis.");
        return value;
      }
      if (token === undefined || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token)) {
        throw new Error("Expected a number or parenthesized expression.");
      }
      return Number(token);
    };
    const parsePower = () => {
      const value = parsePrimary();
      if (tokens[position] !== "^") return value;
      position++;
      return value ** parseUnary();
    };
    const parseUnary = () => {
      if (tokens[position] === "+") {
        position++;
        return parseUnary();
      }
      if (tokens[position] === "-") {
        position++;
        return -parseUnary();
      }
      return parsePower();
    };
    const parseTerm = () => {
      let value = parseUnary();
      while (["*", "/", "%"].includes(tokens[position])) {
        const operator = tokens[position++];
        const right = parseUnary();
        if ((operator === "/" || operator === "%") && right === 0) {
          throw new Error("Division by zero is not defined.");
        }
        if (operator === "*") value *= right;
        else if (operator === "/") value /= right;
        else value %= right;
      }
      return value;
    };
    const parseExpression = () => {
      let value = parseTerm();
      while (tokens[position] === "+" || tokens[position] === "-") {
        const operator = tokens[position++];
        const right = parseTerm();
        value = operator === "+" ? value + right : value - right;
      }
      return value;
    };

    const result = parseExpression();
    if (position !== tokens.length) throw new Error("Check the expression syntax and parentheses.");
    if (!Number.isFinite(result)) throw new Error("The result is outside the supported numeric range.");
    return result;
  },

  // 10. CALCULATORS, SCIENCE, PRODUCTIVITY & EDUCATION ENGINE
  renderCalculatorProductivityEngine(tool, container) {
    const isBasicCalculator = tool.name.toLowerCase() === "basic calculator";
    if (!isBasicCalculator) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This calculation or conversion is not implemented yet.</p>
          <p class="text-xs theme-text-muted">This workspace supports basic arithmetic expressions only; it will not substitute an unrelated calculation.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <label class="text-xs font-bold accent-text block">${tool.name}</label>
          <p class="text-[11px] theme-text-muted">Evaluate an arithmetic expression using +, −, ×, ÷, %, ^, and parentheses.</p>
          <input id="calcExpr" type="text" value="(250 * 4) + 180" class="w-full px-3.5 py-2 rounded-xl font-mono text-sm" />
        </div>
        <div id="calcResultPanel" class="glass-subpanel p-4 rounded-2xl font-mono text-xs space-y-1.5" role="status" aria-live="polite"></div>
      </div>
    `;

    const calc = () => {
      const expr = container.querySelector("#calcExpr").value;
      try {
        const mathRes = this.evaluateArithmeticExpression(expr);
        const result = `Result: ${mathRes}`;
        container.querySelector("#calcResultPanel").textContent = result;
        this.setArtifact({ toolName: tool.name, text: result, filename: `calculation-${tool.id}.txt` });
      } catch (error) {
        container.querySelector("#calcResultPanel").textContent = `Calculation error: ${error.message}`;
      }
    };
    container.querySelector("#calcExpr").addEventListener("input", calc);
    calc();
  },

  // 11. TEXT & UNIVERSAL MULTI-TOOL WORKBENCH
  renderTextAndUniversalEngine(tool, container) {
    const name = tool.name.toLowerCase();
    const actions = [];
    if (name.includes("uppercase converter")) actions.push(["upper", "UPPERCASE"]);
    if (name.includes("lowercase converter")) actions.push(["lower", "lowercase"]);
    if (name.includes("title case converter")) actions.push(["title", "Title Case"]);
    if (name === "reverse text") actions.push(["reverse", "Reverse"]);
    if (name.includes("duplicate lines")) actions.push(["dedup", "Deduplicate Lines"]);
    if (name.includes("sort lines alphabetically")) actions.push(["sort", "Sort A–Z"]);
    if (name.includes("slug generator")) actions.push(["slug", "Slugify"]);
    if (name.includes("extract email addresses")) actions.push(["emails", "Extract Emails"]);
    if (name.includes("extract urls from text")) actions.push(["urls", "Extract URLs"]);
    if (name.includes("remove extra spaces")) actions.push(["clean", "Trim Whitespace"]);
    const isTextCounter = name.includes("word counter") || name.includes("character counter") ||
      name.includes("reading-time calculator");

    if (!actions.length && !isTextCounter) {
      container.innerHTML = `
        <div class="p-5 rounded-2xl glass-subpanel space-y-2">
          <h3 class="text-sm font-bold theme-text-primary">${tool.name}</h3>
          <p class="text-sm text-amber-400 font-semibold">This text operation is not implemented yet.</p>
          <p class="text-xs theme-text-muted">This workspace supports selected case/line utilities, text extraction, slug creation, whitespace cleanup, and basic word/character/read-time counts.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-1.5">
          ${actions.map(([action, label]) => `<button data-txt="${action}" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">${label}</button>`).join("")}
        </div>

        <textarea id="uniTextInput" rows="7" class="w-full p-3.5 rounded-2xl text-sm" placeholder="Type or paste text for ${tool.name}..."></textarea>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div class="p-2.5 rounded-xl glass-subpanel"><div class="text-sm font-extrabold accent-text" id="stWords">0</div><div class="text-[10px] theme-text-muted uppercase">Words</div></div>
          <div class="p-2.5 rounded-xl glass-subpanel"><div class="text-sm font-extrabold text-emerald-400" id="stChars">0</div><div class="text-[10px] theme-text-muted uppercase">Characters</div></div>
          <div class="p-2.5 rounded-xl glass-subpanel"><div class="text-sm font-extrabold text-amber-400" id="stLines">0</div><div class="text-[10px] theme-text-muted uppercase">Lines</div></div>
          <div class="p-2.5 rounded-xl glass-subpanel"><div class="text-sm font-extrabold text-pink-400" id="stRead">0 sec</div><div class="text-[10px] theme-text-muted uppercase">Reading Time</div></div>
        </div>
      </div>
    `;

    const ta = container.querySelector("#uniTextInput");
    const updateStats = () => {
      const v = ta.value;
      const words = v.trim() ? v.trim().split(/\s+/).length : 0;
      container.querySelector("#stWords").textContent = words;
      container.querySelector("#stChars").textContent = v.length;
      container.querySelector("#stLines").textContent = v ? v.split(/\r?\n/).length : 0;
      container.querySelector("#stRead").textContent = Math.ceil((words / 200) * 60) + " sec";
      this.setArtifact({ toolName: tool.name, text: v, filename: `text-${tool.id}-output.txt` });
    };
    ta.addEventListener("input", updateStats);

    container.querySelectorAll("[data-txt]").forEach(btn => {
      btn.addEventListener("click", () => {
        const op = btn.dataset.txt;
        const v = ta.value;
        if (op === "upper") ta.value = v.toUpperCase();
        if (op === "lower") ta.value = v.toLowerCase();
        if (op === "title") ta.value = v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        if (op === "reverse") ta.value = v.split("").reverse().join("");
        if (op === "dedup") ta.value = [...new Set(v.split(/\r?\n/))].join("\n");
        if (op === "sort") ta.value = v.split(/\r?\n/).sort().join("\n");
        if (op === "slug") ta.value = v.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
        if (op === "emails") ta.value = (v.match(/[\w.-]+@[\w.-]+\.\w+/g) || []).join("\n");
        if (op === "urls") ta.value = (v.match(/https?:\/\/[^\s]+/g) || []).join("\n");
        if (op === "clean") ta.value = v.replace(/\s+/g, " ").trim();
        updateStats();
      });
    });
    updateStats();
  }
};
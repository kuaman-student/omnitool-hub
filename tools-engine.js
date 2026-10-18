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
      try { this.activeCleanup(); } catch {}
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
    if (name.endsWith("to pdf") && !name.includes("image") && !name.includes("jpg")) {
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
      return this.renderImageEngine(tool, container);
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
          <input type="file" id="imgToPdfInput" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" multiple class="hidden" />
          <label for="imgToPdfInput" class="cursor-pointer flex flex-col items-center">
            <i data-lucide="images" class="w-10 h-10 accent-text mb-2"></i>
            <span class="text-sm font-bold theme-text-primary">Click to select Images (PNG, JPG, WebP — Multiple supported)</span>
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
      const supportedMimeTypes = ["image/png", "image/jpeg", "image/webp"];
      const isSupportedImage = (file) => {
        const extensionMatches = /\.(png|jpe?g|webp)$/i.test(file.name);
        return supportedMimeTypes.includes(file.type) || (!file.type && extensionMatches);
      };
      const unsupportedFiles = files.filter(file => !isSupportedImage(file));
      if (unsupportedFiles.length) {
        selectedImages = [];
        convertBtn.disabled = true;
        status.textContent = `Unsupported file(s): ${unsupportedFiles.map(file => file.name).join(", ")}. Select PNG, JPG, or WebP images only.`;
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
        outBox.innerHTML = `<span class="text-rose-400">Error: ${err.message}</span>`;
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
    const isExtract = tool.name.toLowerCase().includes("extract") || tool.name.toLowerCase().includes("inspect") || tool.name.toLowerCase().includes("decompressor");
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
          const names = Object.keys(loaded.files);
          out.innerHTML = `<div class="text-emerald-400 font-bold">Archive Inspected: ${files[0].name} (${names.length} entries)</div>` +
            names.map(n => `<div>📄 ${n} (${loaded.files[n].dir ? "Folder" : "File"})</div>`).join("");
          this.setArtifact({ toolName: tool.name, text: names.join("\n"), filename: "archive-manifest.txt" });
        } else {
          out.innerHTML = `<span class="accent-text">Compressing ${files.length} file(s) into ZIP...</span>`;
          files.forEach(f => zip.file(f.name, f));
          const blob = await zip.generateAsync({ type: "blob" });
          const outName = "omnitool-archive.zip";
          this.setArtifact({ toolName: tool.name, text: `ZIP Archive (${files.length} files, ${(blob.size/1024).toFixed(1)} KB)`, blob, filename: outName, mimeType: "application/zip" });
          out.innerHTML = `<div class="text-emerald-400 font-bold">✅ Created ${outName} (${(blob.size / 1024).toFixed(1)} KB) containing ${files.length} file(s)!</div><div>Click <b>"Share Output Directly"</b> or <b>"Download Output"</b> below.</div>`;
        }
      } catch (err) {
        out.innerHTML = `<span class="text-rose-400">Archive Error: ${err.message}</span>`;
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
    const isMultiPdf = name.includes("merge") || name.includes("compare") || name.includes("another pdf");

    let paramLabel = "Page Number / Range (e.g., 1, 2-4)";
    let defaultVal = "1";
    if (name.includes("rotate")) { paramLabel = "Rotation Angle in Degrees (90, 180, 270)"; defaultVal = "90"; }
    else if (name.includes("watermark") || name.includes("text") || name.includes("header") || name.includes("sign") || name.includes("comment")) {
      paramLabel = "Text / Watermark / Signature Stamp to Apply";
      defaultVal = "APPROVED • OMNITOOL HUB";
    } else if (name.includes("metadata")) {
      paramLabel = "New Document Title Metadata";
      defaultVal = "Verified PDF Document";
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

    container.querySelector("#runPdfActionBtn").addEventListener("click", async () => {
      const files = Array.from(fileInput.files);
      if (!files.length) return alert("Please select at least one PDF file first.");

      outBox.classList.remove("hidden");
      outBox.innerHTML = `<span class="accent-text font-semibold">Processing PDF in browser memory...</span>`;

      try {
        const { PDFDocument, degrees, rgb } = PDFLib;

        if (name.includes("compare") && files.length >= 2) {
          const p1 = await PDFDocument.load(await files[0].arrayBuffer());
          const p2 = await PDFDocument.load(await files[1].arrayBuffer());
          const cmpText = `PDF Comparison Report:\n• File 1: ${files[0].name} (${p1.getPageCount()} pages, ${(files[0].size/1024).toFixed(1)} KB)\n• File 2: ${files[1].name} (${p2.getPageCount()} pages, ${(files[1].size/1024).toFixed(1)} KB)\n• Page Difference: ${Math.abs(p1.getPageCount() - p2.getPageCount())} page(s)`;
          this.setArtifact({ toolName: tool.name, text: cmpText, filename: "pdf-comparison.txt" });
          outBox.innerHTML = `<pre class="whitespace-pre-wrap text-emerald-400 font-mono">${cmpText}</pre>`;
          return;
        }

        let outBytes;
        let outName = `processed-${files[0].name}`;

        if (isMultiPdf) {
          const mergedPdf = await PDFDocument.create();
          for (const f of files) {
            const bytes = await f.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((p) => mergedPdf.addPage(p));
          }
          outBytes = await mergedPdf.save();
          outName = "merged-omnitool.pdf";
        } else {
          const bytes = await files[0].arrayBuffer();
          const pdfDoc = await PDFDocument.load(bytes);
          const totalPages = pdfDoc.getPageCount();
          const param = container.querySelector("#pdfParamInput").value.trim();

          if (name.includes("rotate")) {
            const angle = parseInt(param, 10) || 90;
            pdfDoc.getPages().forEach(p => p.setRotation(degrees(angle)));
            outBytes = await pdfDoc.save();
          } else if (name.includes("reverse")) {
            const newPdf = await PDFDocument.create();
            const indices = pdfDoc.getPageIndices().reverse();
            const copied = await newPdf.copyPages(pdfDoc, indices);
            copied.forEach(p => newPdf.addPage(p));
            outBytes = await newPdf.save();
          } else if (name.includes("blank")) {
            pdfDoc.addPage();
            outBytes = await pdfDoc.save();
          } else if (name.includes("delete")) {
            const pageIdx = Math.max(0, Math.min(totalPages - 1, (parseInt(param, 10) || 1) - 1));
            if (totalPages > 1) pdfDoc.removePage(pageIdx);
            outBytes = await pdfDoc.save();
          } else if (name.includes("split") || name.includes("extract")) {
            const newPdf = await PDFDocument.create();
            const pageIdx = Math.max(0, Math.min(totalPages - 1, (parseInt(param, 10) || 1) - 1));
            const [copied] = await newPdf.copyPages(pdfDoc, [pageIdx]);
            newPdf.addPage(copied);
            outBytes = await newPdf.save();
            outName = `page-${pageIdx + 1}-${files[0].name}`;
          } else if (name.includes("watermark") || name.includes("text") || name.includes("number") || name.includes("header") || name.includes("sign")) {
            pdfDoc.getPages().forEach((page, i) => {
              page.drawText(name.includes("number") ? `Page ${i + 1} of ${totalPages}` : (param || "OMNITOOL HUB"), {
                x: 45,
                y: 35,
                size: 14,
                color: rgb(0.85, 0.15, 0.15)
              });
            });
            outBytes = await pdfDoc.save();
          } else {
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
        outBox.innerHTML = `<span class="text-rose-400">Error: ${err.message}</span>`;
      }
    });
  },

  // ============================================================================
  // 2. IMAGE CANVAS STUDIO
  // ============================================================================
  renderImageEngine(tool, container) {
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
    let rot = 0, flipH = 1, flipV = 1, gray = false, inv = false;

    const syncCanvasArtifact = () => {
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
      if (!imgObj.src) return;
      const w = parseInt(container.querySelector("#imgWidth").value, 10) || imgObj.naturalWidth;
      const h = parseInt(container.querySelector("#imgHeight").value, 10) || imgObj.naturalHeight;
      canvas.width = w;
      canvas.height = h;

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
      ctx.translate(w / 2, h / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(flipH, flipV);
      ctx.drawImage(imgObj, -w / 2, -h / 2, w, h);
      ctx.restore();

      const wm = container.querySelector("#imgWatermark").value.trim();
      if (wm) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `bold ${Math.max(18, Math.round(w / 20))}px sans-serif`;
        ctx.textAlign = "right";
        ctx.fillText(wm, w - 20, h - 20);
      }

      container.querySelector("#imgMetaInfo").textContent = `Canvas: ${w} × ${h} px | Ready to Share or Download`;
      syncCanvasArtifact();
    };

    container.querySelector("#imgStudioInput").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        imgObj.onload = () => {
          container.querySelector("#imgWidth").value = imgObj.naturalWidth;
          container.querySelector("#imgHeight").value = imgObj.naturalHeight;
          redraw();
        };
        imgObj.src = ev.target.result;
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

    if (n.includes("pid") || n.includes("pwm") || n.includes("kalman") || n.includes("filter")) {
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
        if (n.includes("pwm")) {
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

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider accent-text">${tool.name} — Parameters</h3>
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="text-[11px] theme-text-muted">Param A (Roll° / Voltage V / RPM / Thrust g)</label>
              <input id="robA" type="number" value="30" step="any" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Param B (Pitch° / Current A / Wheel Ø cm / Weight g)</label>
              <input id="robB" type="number" value="15" step="any" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Param C (Yaw° / Resistance Ω / Track Width cm)</label>
              <input id="robC" type="number" value="45" step="any" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Param D (Battery mAh / Filament Cost $/kg)</label>
              <input id="robD" type="number" value="2200" step="any" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
          </div>
        </div>
        <div id="robOutput" class="glass-subpanel p-4 rounded-2xl text-xs font-mono space-y-2 overflow-y-auto max-h-80"></div>
      </div>
    `;

    const compute = () => {
      const A = parseFloat(container.querySelector("#robA").value) || 0;
      const B = parseFloat(container.querySelector("#robB").value) || 1;
      const C = parseFloat(container.querySelector("#robC").value) || 1;
      const D = parseFloat(container.querySelector("#robD").value) || 1;

      const r = (A * Math.PI) / 180, p = (B * Math.PI) / 180, y = (C * Math.PI) / 180;
      const cy = Math.cos(y * 0.5), sy = Math.sin(y * 0.5);
      const cp = Math.cos(p * 0.5), sp = Math.sin(p * 0.5);
      const cr = Math.cos(r * 0.5), sr = Math.sin(r * 0.5);
      const qw = cr * cp * cy + sr * sp * sy;
      const qx = sr * cp * cy - cr * sp * sy;
      const qy = cr * sp * cy + sr * cp * sy;
      const qz = cr * cp * sy - sr * sp * cy;

      const wheelCircM = (Math.PI * B) / 100;
      const linSpeed = (A / 60) * wheelCircM;

      const report = [
        `=== ${tool.name} Engineering Telemetry ===`,
        `1. ROS2 Quaternion (from Roll=${A}°, Pitch=${B}°, Yaw=${C}°):`,
        `   [x: ${qx.toFixed(4)}, y: ${qy.toFixed(4)}, z: ${qz.toFixed(4)}, w: ${qw.toFixed(4)}]`,
        `2. Diff-Drive Linear Velocity (@ ${A} RPM, ${B}cm Wheel): ${linSpeed.toFixed(3)} m/s (${(linSpeed*3.6).toFixed(2)} km/h)`,
        `3. Drone Thrust-to-Weight Ratio (A/B): ${(A / B).toFixed(2)} : 1 | Est. Flight Time (${D}mAh @ ${B}A): ${(((D/1000)*0.8)/B*60).toFixed(1)} mins`,
        `4. Ohm's Law & Power: V = ${(B * C).toFixed(2)} V | I = ${(A / C).toFixed(3)} A | Power = ${(A * B).toFixed(2)} W`,
        `5. ROS2 Static TF2 CLI: ros2 run tf2_ros static_transform_publisher 0 0 0 ${qx.toFixed(3)} ${qy.toFixed(3)} ${qz.toFixed(3)} ${qw.toFixed(3)} base_link sensor_frame`
      ].join("\n");

      container.querySelector("#robOutput").innerHTML = `<pre class="whitespace-pre-wrap">${report}</pre>`;
      this.setArtifact({ toolName: tool.name, text: report, filename: `robotics-${tool.id}.txt` });
    };
    ["#robA", "#robB", "#robC", "#robD"].forEach(s => container.querySelector(s).addEventListener("input", compute));
    compute();
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

  // 5. FINTECH, GST, STARTUP & BUSINESS ENGINE
  renderFinTechEngine(tool, container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider accent-text">${tool.name}</h3>
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="text-[11px] theme-text-muted">Principal / Cash Reserve</label>
              <input id="finA" type="number" value="50000" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Rate % (GST / ROI / Interest %)</label>
              <input id="finB" type="number" value="18" step="any" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Duration (Years)</label>
              <input id="finC" type="number" value="5" step="any" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Monthly SIP / Burn Rate</label>
              <input id="finD" type="number" value="8000" step="any" class="w-full px-3 py-1.5 rounded-lg text-sm" />
            </div>
          </div>
        </div>
        <div id="finOut" class="glass-subpanel p-4 rounded-2xl font-mono text-xs space-y-2"></div>
      </div>
    `;
    const calcFin = () => {
      const P = parseFloat(container.querySelector("#finA").value) || 0;
      const R = parseFloat(container.querySelector("#finB").value) || 0;
      const T = parseFloat(container.querySelector("#finC").value) || 1;
      const Burn = parseFloat(container.querySelector("#finD").value) || 1;

      const gstExclusive = (P * R) / 100;
      const gstInclusiveBase = P / (1 + R / 100);
      const gstInclusiveTax = P - gstInclusiveBase;

      const rMonth = R / 12 / 100;
      const nMonths = T * 12;
      const emi = rMonth > 0 ? (P * rMonth * Math.pow(1 + rMonth, nMonths)) / (Math.pow(1 + rMonth, nMonths) - 1) : P / nMonths;
      const sipFV = rMonth > 0 ? Burn * ((Math.pow(1 + rMonth, nMonths) - 1) / rMonth) * (1 + rMonth) : Burn * nMonths;

      const text = [
        `=== ${tool.name} Financial Analysis ===`,
        `• GST Exclusive (+${R}%): Base ${P.toFixed(2)} + CGST ${(gstExclusive/2).toFixed(2)} + SGST ${(gstExclusive/2).toFixed(2)} = Total ${(P + gstExclusive).toFixed(2)}`,
        `• GST Inclusive (${R}% embedded): Net Base ${gstInclusiveBase.toFixed(2)} | Tax Component ${gstInclusiveTax.toFixed(2)}`,
        `• Loan Monthly EMI (${P} @ ${R}% for ${T} yrs): ${emi.toFixed(2)} / month`,
        `• SIP Compounded Wealth (${Burn}/mo @ ${R}% for ${T} yrs): ${sipFV.toFixed(0)}`,
        `• Startup Cash Runway (Reserve ${P} / Burn ${Burn}): ${(P / Burn).toFixed(1)} Months`
      ].join("\n");

      container.querySelector("#finOut").innerHTML = `<pre class="whitespace-pre-wrap">${text}</pre>`;
      this.setArtifact({ toolName: tool.name, text, filename: `fintech-${tool.id}-report.txt` });
    };
    ["#finA", "#finB", "#finC", "#finD"].forEach(s => container.querySelector(s).addEventListener("input", calcFin));
    calcFin();
  },

  // 6. AI PROMPTS, LLM TOKEN & AGENT ENGINE
  renderAiLlmEngine(tool, container) {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <button data-ai="tokens" class="px-3 py-1.5 rounded-xl accent-gradient text-white text-xs font-bold">Count Tokens & Cost</button>
          <button data-ai="sysprompt" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Build System Prompt</button>
          <button data-ai="jsonschema" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Tool JSON Schema</button>
          <button data-ai="ragchunk" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Preview RAG Chunks</button>
          <button data-ai="pii" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Redact PII</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea id="aiIn" rows="8" class="w-full p-3 rounded-2xl text-xs font-mono" placeholder="Paste prompt, document, or agent instructions...">You are an autonomous engineering & software reasoning agent. Break down complex problems into verifiable steps.</textarea>
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
      const estTokens = Math.ceil(chars / 3.8);

      if (mode === "tokens") {
        out.value = [
          `=== LLM Token & API Cost Report (${tool.name}) ===`,
          `Characters: ${chars} | Words: ${words}`,
          `Estimated Tokens (~3.8 chars/token): ${estTokens} tokens`,
          `Est. Cost @ $2.50 / 1M frontier tokens: $${((estTokens / 1e6) * 2.5).toFixed(6)}`,
          `Est. Cost @ $0.15 / 1M fast flash tokens: $${((estTokens / 1e6) * 0.15).toFixed(6)}`,
          `Est. Local VRAM (7B Q4_K_M GGUF): ~4.8 GB`
        ].join("\n");
      } else if (mode === "sysprompt") {
        out.value = `<system_instructions>\n  <role>${tool.name} Specialist</role>\n  <objective>${v}</objective>\n  <guidelines>\n    - Provide deterministic, structured outputs.\n    - Validate edge cases rigorously.\n  </guidelines>\n</system_instructions>`;
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
        const chunks = v.match(/.{1,120}/g) || [];
        out.value = chunks.map((c, i) => `[Chunk #${i + 1}]: ${c.trim()}`).join("\n\n");
      } else if (mode === "pii") {
        out.value = v
          .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[REDACTED_EMAIL]")
          .replace(/\b\d{10,12}\b/g, "[REDACTED_PHONE]");
      }
      this.setArtifact({ toolName: tool.name, text: out.value, filename: `ai-tool-${tool.id}.txt` });
    };
    container.querySelectorAll("[data-ai]").forEach(b => b.addEventListener("click", () => runAi(b.dataset.ai)));
    inp.addEventListener("input", () => runAi("tokens"));
    runAi("tokens");
  },

  // 7. DEVELOPER, SECURITY, CYBER-FORENSICS, WEB & DESIGN ENGINE
  renderDevSecurityEngine(tool, container) {
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
          const arr = new Uint32Array(24);
          crypto.getRandomValues(arr);
          out.value = Array.from(arr, x => chars[x % chars.length]).join("");
        } else if (op === "rot13") {
          out.value = val.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
        } else if (op === "defang") {
          out.value = val.replace(/\./g, "[.]").replace(/http/gi, "hxxp");
        }
        this.setArtifact({ toolName: tool.name, text: out.value, filename: `dev-${tool.id}-output.txt` });
      } catch (e) {
        out.value = "Error: " + e.message;
      }
    };

    container.querySelectorAll("[data-dev]").forEach(btn => {
      btn.addEventListener("click", () => runOp(btn.dataset.dev));
    });
    runOp("jsonFmt");
  },

  // 8. DATA & SPREADSHEET CSV/JSON ENGINE
  renderDataSpreadsheetEngine(tool, container) {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <button data-csv="toJson" class="px-3 py-1.5 rounded-xl accent-gradient text-white text-xs font-bold">CSV → JSON</button>
          <button data-csv="dedup" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Deduplicate Rows</button>
          <button data-csv="sort" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Sort Rows A→Z</button>
          <button data-csv="stats" class="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold">Dataset Statistics</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea id="csvIn" rows="8" class="w-full p-3 rounded-2xl font-mono text-xs">name,domain,score\nAman,Robotics,98\nElena,AI,95\nLiam,Embedded,89\nAman,Robotics,98</textarea>
          <textarea id="csvOut" rows="8" readonly class="w-full p-3 rounded-2xl font-mono text-xs"></textarea>
        </div>
      </div>
    `;
    const csvIn = container.querySelector("#csvIn");
    const csvOut = container.querySelector("#csvOut");

    const runCsv = (mode) => {
      const lines = csvIn.value.trim().split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      if (mode === "toJson") {
        const headers = lines[0].split(",").map(h => h.trim());
        const arr = lines.slice(1).map(line => {
          const vals = line.split(",");
          const obj = {};
          headers.forEach((h, i) => obj[h] = vals[i]?.trim());
          return obj;
        });
        csvOut.value = JSON.stringify(arr, null, 2);
      } else if (mode === "dedup") {
        csvOut.value = [...new Set(lines)].join("\n");
      } else if (mode === "sort") {
        csvOut.value = [lines[0], ...lines.slice(1).sort()].join("\n");
      } else if (mode === "stats") {
        csvOut.value = `Total Rows: ${lines.length}\nData Rows: ${lines.length - 1}\nColumns: ${lines[0].split(",").length}\nUnique Rows: ${new Set(lines).size}`;
      }
      this.setArtifact({ toolName: tool.name, text: csvOut.value, filename: `data-${tool.id}.json`, mimeType: "application/json" });
    };
    container.querySelectorAll("[data-csv]").forEach(b => b.addEventListener("click", () => runCsv(b.dataset.csv)));
    runCsv("toJson");
  },

  // 9. AUDIO, VIDEO & CREATOR ENGINE
  renderMediaEngine(tool, container) {
    const n = tool.name.toLowerCase();
    if (n.includes("speech") || n.includes("tts") || n.includes("reader") || n.includes("teleprompter")) {
      container.innerHTML = `
        <div class="space-y-3 glass-subpanel p-4 rounded-2xl">
          <label class="text-xs theme-text-muted block">Enter Script or Text for Browser Speech Synthesis (TTS) & Teleprompter</label>
          <textarea id="ttsInput" rows="5" class="w-full p-3 rounded-xl text-sm">Welcome to OmniTool Hub v5.0! Every tool features verified inputs, instant sharing without downloading, and complete client-side privacy.</textarea>
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
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(ta.value));
      });
      container.querySelector("#stopSpeakBtn").addEventListener("click", () => window.speechSynthesis.cancel());
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        <div class="glass-subpanel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <input type="file" id="mediaFileInput" accept="video/*,audio/*,image/gif" class="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white" />
          <div class="flex items-center gap-2">
            <select id="mediaSpeed" class="px-2.5 py-1.5 rounded-xl text-xs">
              <option value="0.5">0.5x Slow-Mo</option>
              <option value="1" selected>1.0x Normal</option>
              <option value="1.5">1.5x Fast</option>
              <option value="2">2.0x Double</option>
            </select>
            <button id="snapFrameBtn" class="px-3.5 py-1.5 rounded-xl accent-gradient text-white text-xs font-bold">Capture Video Frame</button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="glass-subpanel p-3 rounded-2xl flex flex-col items-center justify-center">
            <video id="mediaPlayer" controls class="max-h-56 w-full rounded-xl bg-black"></video>
            <div id="mediaMeta" class="text-[11px] font-mono theme-text-muted mt-2">Select any video or audio file to inspect or capture frames</div>
          </div>
          <div class="glass-subpanel p-3 rounded-2xl flex flex-col items-center justify-center">
            <canvas id="frameCanvas" width="320" height="180" class="max-h-56 w-full rounded-xl border theme-border bg-slate-950"></canvas>
            <span class="text-[11px] text-emerald-400 mt-2">Captured Frame (Ready for Direct Share!)</span>
          </div>
        </div>
      </div>
    `;
    const player = container.querySelector("#mediaPlayer");
    const fCanvas = container.querySelector("#frameCanvas");
    container.querySelector("#mediaFileInput").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      player.src = URL.createObjectURL(f);
      player.onloadedmetadata = () => {
        const info = `${f.name} | ${(f.size/1024/1024).toFixed(2)} MB | Duration: ${player.duration.toFixed(1)}s`;
        container.querySelector("#mediaMeta").textContent = info;
        this.setArtifact({ toolName: tool.name, text: info, blob: f, filename: f.name, mimeType: f.type });
      };
    });
    container.querySelector("#mediaSpeed").addEventListener("change", (e) => {
      player.playbackRate = parseFloat(e.target.value);
    });
    container.querySelector("#snapFrameBtn").addEventListener("click", () => {
      if (!player.videoWidth) return alert("Please load a video file first.");
      fCanvas.width = player.videoWidth;
      fCanvas.height = player.videoHeight;
      fCanvas.getContext("2d").drawImage(player, 0, 0);
      fCanvas.toBlob((blob) => {
        this.setArtifact({ toolName: tool.name, text: "Captured Video Frame", blob, filename: "video-frame.png", mimeType: "image/png" });
      });
    });
  },

  // 10. CALCULATORS, SCIENCE, PRODUCTIVITY & EDUCATION ENGINE
  renderCalculatorProductivityEngine(tool, container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-subpanel p-4 rounded-2xl space-y-3">
          <label class="text-xs font-bold accent-text block">${tool.name} — Live Evaluator</label>
          <input id="calcExpr" type="text" value="(250 * 4) + 180" class="w-full px-3.5 py-2 rounded-xl font-mono text-sm" />
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[11px] theme-text-muted">Input A (Value / CGPA / Base)</label>
              <input id="numA" type="number" value="9.2" step="any" class="w-full px-3 py-1.5 rounded-lg text-xs" />
            </div>
            <div>
              <label class="text-[11px] theme-text-muted">Input B (Factor / Total / %)</label>
              <input id="numB" type="number" value="9.5" step="any" class="w-full px-3 py-1.5 rounded-lg text-xs" />
            </div>
          </div>
        </div>
        <div id="calcResultPanel" class="glass-subpanel p-4 rounded-2xl font-mono text-xs space-y-1.5"></div>
      </div>
    `;

    const calc = () => {
      const expr = container.querySelector("#calcExpr").value;
      const A = parseFloat(container.querySelector("#numA").value) || 0;
      const B = parseFloat(container.querySelector("#numB").value) || 1;
      let mathRes = "N/A";
      try {
        mathRes = Function(`"use strict"; return (${expr.replace(/[^0-9+\-*/().%^]/g, "")})`)();
      } catch {}
      const intA = Math.max(0, Math.floor(Math.abs(A)));
      const report = [
        `Expression Result: ${mathRes}`,
        `A × B: ${(A * B).toFixed(4)} | A ÷ B: ${(A / B).toFixed(4)}`,
        `CGPA (${A}) → Percentage: ${(A * 9.5).toFixed(2)}%`,
        `Binary(${intA}): ${intA.toString(2)} | Hex: 0x${intA.toString(16).toUpperCase()}`,
        `Current Unix Timestamp: ${Math.floor(Date.now() / 1000)}`
      ].join("\n");

      container.querySelector("#calcResultPanel").innerHTML = `<pre class="whitespace-pre-wrap">${report}</pre>`;
      this.setArtifact({ toolName: tool.name, text: report, filename: `calculation-${tool.id}.txt` });
    };
    ["#calcExpr", "#numA", "#numB"].forEach(s => container.querySelector(s).addEventListener("input", calc));
    calc();
  },

  // 11. TEXT & UNIVERSAL MULTI-TOOL WORKBENCH
  renderTextAndUniversalEngine(tool, container) {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-1.5">
          <button data-txt="upper" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">UPPERCASE</button>
          <button data-txt="lower" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">lowercase</button>
          <button data-txt="title" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Title Case</button>
          <button data-txt="reverse" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Reverse</button>
          <button data-txt="dedup" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Deduplicate Lines</button>
          <button data-txt="sort" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Sort A–Z</button>
          <button data-txt="slug" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Slugify</button>
          <button data-txt="emails" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Extract Emails</button>
          <button data-txt="urls" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Extract URLs</button>
          <button data-txt="clean" class="px-2.5 py-1 rounded-xl glass-btn text-xs font-semibold">Trim Whitespace</button>
        </div>

        <textarea id="uniTextInput" rows="7" class="w-full p-3.5 rounded-2xl text-sm" placeholder="Type or paste content for ${tool.name}...">OmniTool Hub v5.0 — 1,050+ Verified Client-Side Utilities with Direct Sharing & 10 Live Themes!</textarea>

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
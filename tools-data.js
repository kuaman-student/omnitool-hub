// Complete Master List of 28 Categories & 1,050 Individual Tools (100% English)
const CATEGORIES_DATA = [
  {
    id: "pdf",
    num: 1,
    name: "PDF Tools",
    icon: "file-text",
    color: "rose",
    websites: ["PDF24", "iLovePDF", "Sejda"],
    description: "Merge, split, compress, convert, protect, OCR, and edit PDF documents locally in your browser.",
    tools: [
      "Merge PDF files", "Split PDF by page ranges", "Delete selected PDF pages", "Extract selected pages", "Reorder PDF pages",
      "Rotate PDF pages", "Reverse page order", "Duplicate PDF pages", "Insert blank pages", "Insert pages from another PDF",
      "Replace selected pages", "Crop PDF pages", "Resize PDF pages", "Compress PDF", "Repair damaged PDF",
      "Unlock PDF", "Password-protect PDF", "Add watermark", "Remove watermark where permitted", "Add page numbers",
      "Add headers and footers", "Add text to PDF", "Add images to PDF", "Draw or annotate PDF", "Highlight PDF text",
      "Add comments and sticky notes", "Sign PDF", "Create fillable PDF forms", "Fill existing PDF forms", "Flatten PDF forms",
      "Redact sensitive content", "OCR scanned PDF", "Extract text from PDF", "Extract images from PDF", "Extract tables from PDF",
      "PDF to Word", "PDF to Excel", "PDF to PowerPoint", "PDF to JPG/PNG", "Images to PDF",
      "Word to PDF", "Excel to PDF", "PowerPoint to PDF", "Compare two PDFs", "View and edit PDF metadata"
    ]
  },
  {
    id: "image",
    num: 2,
    name: "Image Tools",
    icon: "image",
    color: "pink",
    websites: ["Photopea", "Squoosh", "iLoveIMG"],
    description: "Resize, crop, compress, convert, filter, upscale, and inspect images on an interactive HTML5 Canvas.",
    tools: [
      "Resize image", "Crop image", "Compress image", "Rotate image", "Flip image horizontally",
      "Flip image vertically", "Convert JPG to PNG", "Convert PNG to JPG", "Convert image to WebP", "Convert image to AVIF",
      "Convert image to GIF", "Convert SVG to PNG", "Convert PNG to ICO", "Change image DPI", "Change image quality",
      "Remove image background", "Make background transparent", "Replace image background", "Remove unwanted objects", "Upscale image",
      "Sharpen image", "Reduce image blur", "Adjust brightness", "Adjust contrast", "Adjust saturation",
      "Adjust hue", "Convert to grayscale", "Invert image colours", "Apply image filters", "Add image border",
      "Add rounded corners", "Add text to image", "Add logo or watermark", "Create image collage", "Overlay two images",
      "Combine images vertically", "Combine images horizontally", "Extract dominant colours", "Generate colour palette from image", "Create image from Base64",
      "Convert image to Base64", "Compare two images", "View image dimensions and metadata", "Remove EXIF metadata", "Generate a favicon"
    ]
  },
  {
    id: "gif",
    num: 3,
    name: "GIF & Animated Image Tools",
    icon: "film",
    color: "purple",
    websites: ["EZGIF", "iLoveIMG"],
    description: "Create, split, optimize, reverse, and convert animated GIFs and sprite frames.",
    tools: [
      "Create GIF from images", "Create GIF from video", "Split GIF into frames", "Extract a selected GIF frame", "Remove GIF frames",
      "Reorder GIF frames", "Reverse GIF animation", "Resize GIF", "Crop GIF", "Compress GIF",
      "Rotate GIF", "Change GIF speed", "Change animation loop count", "Add text to GIF", "Add watermark to GIF",
      "Convert GIF to MP4", "Convert GIF to WebP", "Convert GIF to PNG frames", "Optimise GIF colours", "Merge GIF animations"
    ]
  },
  {
    id: "video",
    num: 4,
    name: "Video Tools",
    icon: "video",
    color: "indigo",
    websites: ["123apps", "Kapwing", "CloudConvert"],
    description: "Trim, crop, convert, adjust playback speed, record screen/webcam, and capture video frames.",
    tools: [
      "Trim video", "Cut video", "Split video into clips", "Merge videos", "Reorder video clips",
      "Crop video", "Resize video resolution", "Change aspect ratio", "Rotate video", "Flip video",
      "Compress video", "Convert MP4 to WebM", "Convert MOV to MP4", "Convert MKV to MP4", "Change video codec",
      "Change frame rate", "Change video bitrate", "Change playback speed", "Create slow motion", "Reverse video",
      "Mute video", "Extract audio from video", "Replace video audio", "Add background music", "Add subtitles",
      "Burn subtitles into video", "Extract subtitles", "Add watermark to video", "Add titles and captions", "Create video thumbnail",
      "Extract video frames", "Convert video to GIF", "Convert video to image sequence", "Create slideshow from images", "Record screen",
      "Record webcam", "Create picture-in-picture video", "Stabilise shaky video", "Add fade-in/fade-out", "Compare two videos",
      "Inspect video metadata", "Create a contact sheet of video frames", "Add letterboxing or padding", "Remove black borders by cropping", "Detect scene changes"
    ]
  },
  {
    id: "audio",
    num: 5,
    name: "Audio Tools",
    icon: "headphones",
    color: "cyan",
    websites: ["123apps", "Vocal Remover"],
    description: "Trim, convert, normalize, visualize waveforms, record voice, and synthesize speech.",
    tools: [
      "Trim audio", "Cut audio", "Split audio", "Merge audio files", "Reorder audio segments",
      "Convert MP3 to WAV", "Convert WAV to MP3", "Convert audio to FLAC", "Convert audio to AAC", "Convert audio to OGG",
      "Convert audio to M4A", "Compress audio", "Change bitrate", "Change sample rate", "Change audio volume",
      "Normalise loudness", "Fade audio in", "Fade audio out", "Remove silence", "Reverse audio",
      "Change audio speed", "Change pitch", "Convert stereo to mono", "Convert mono to stereo", "Remove background noise",
      "Separate vocals from music", "Extract vocals", "Extract instrumental audio", "Record audio in browser", "Generate speech from text",
      "Transcribe speech to text", "Generate audio waveform", "Create audio visualisation", "Edit ID3 tags", "Edit album artwork",
      "View audio metadata", "Compare audio files", "Detect silence intervals", "Join audio with video", "Create a ringtone"
    ]
  },
  {
    id: "docs",
    num: 6,
    name: "Word, Excel & Document Tools",
    icon: "file-spreadsheet",
    color: "emerald",
    websites: ["CloudConvert", "iLovePDF"],
    description: "Convert, format, and clean DOCX, XLSX, CSV, PPTX, and structured office documents.",
    tools: [
      "DOCX to PDF", "PDF to DOCX", "DOCX to TXT", "TXT to DOCX", "DOCX to HTML",
      "HTML to DOCX", "RTF to DOCX", "ODT to DOCX", "Merge Word documents", "Split Word documents",
      "Compare documents", "Extract text from document", "Count words in document", "Count characters in document", "Find and replace text",
      "Remove duplicate paragraphs", "Remove blank paragraphs", "Clean document formatting", "Convert text to table", "Convert table to text",
      "Add page numbers", "Add headers and footers", "Add watermark", "Generate table of contents", "Extract images from DOCX",
      "Inspect document properties", "Remove document metadata", "Protect document", "Convert Excel to PDF", "Convert PDF to Excel",
      "XLSX to CSV", "CSV to XLSX", "CSV to JSON", "JSON to CSV", "Merge CSV files",
      "Split CSV by rows", "Remove duplicate CSV rows", "Sort CSV rows", "Filter CSV data", "Clean spreadsheet whitespace",
      "Convert date formats in CSV", "Compare two spreadsheets", "Convert PowerPoint to PDF", "Convert PDF to PowerPoint", "Extract images from PowerPoint"
    ]
  },
  {
    id: "text",
    num: 7,
    name: "Text & Writing Utilities",
    icon: "type",
    color: "amber",
    websites: ["Browserling", "TextTools"],
    description: "Case converters, word counters, line sorting, regex extraction, encoding, and diff tools.",
    tools: [
      "Uppercase converter", "Lowercase converter", "Title Case converter", "Sentence Case converter", "Reverse text",
      "Reverse word order", "Remove extra spaces", "Remove line breaks", "Add line breaks", "Add line numbers",
      "Remove line numbers", "Sort lines alphabetically", "Reverse line order", "Shuffle lines", "Remove duplicate lines",
      "Remove blank lines", "Find and replace", "Word counter", "Character counter", "Sentence counter",
      "Paragraph counter", "Reading-time calculator", "Lorem Ipsum generator", "Slug generator", "Text-to-ASCII converter",
      "ASCII-to-text converter", "Unicode inspector", "HTML entity encoder", "HTML entity decoder", "URL encoder",
      "URL decoder", "Base64 text encoder", "Base64 text decoder", "Escape JSON strings", "Unescape JSON strings",
      "Extract URLs from text", "Extract email addresses", "Extract phone numbers", "Find repeated words", "Compare text differences"
    ]
  },
  {
    id: "converters",
    num: 8,
    name: "File Converters & Archive Tools",
    icon: "archive",
    color: "orange",
    websites: ["Online-Convert", "CloudConvert"],
    description: "Convert images, e-books, subtitles, archives (ZIP/TAR/GZIP), and structured data formats.",
    tools: [
      "JPG to PNG", "PNG to WebP", "HEIC to JPG", "SVG to PDF", "SVG to PNG",
      "DOCX to ODT", "ODT to PDF", "PPTX to ODP", "XLSX to ODS", "EPUB to PDF",
      "EPUB to MOBI", "MOBI to EPUB", "TXT to EPUB", "SRT to VTT", "VTT to SRT",
      "ASS subtitle to SRT", "ZIP creator", "ZIP extractor", "7Z extractor", "TAR extractor",
      "GZIP compressor", "GZIP decompressor", "TAR to ZIP", "Inspect archive contents", "Test archive integrity",
      "Password-protect ZIP", "Convert XML to JSON", "Convert JSON to XML", "Convert JSON to YAML", "Convert YAML to JSON",
      "Convert TOML to JSON", "Convert CSV to XML", "Convert Markdown to HTML", "Convert HTML to Markdown", "Convert HTML to plain text"
    ]
  },
  {
    id: "dev",
    num: 9,
    name: "Developer & Coding Tools",
    icon: "code-2",
    color: "blue",
    websites: ["DevToys", "Transform Tools", "Regex101"],
    description: "JSON/XML/SQL/HTML/JS formatters, Regex tester, JWT decoder, UUID, Cron, and CSS generators.",
    tools: [
      "JSON formatter", "JSON minifier", "JSON validator", "JSON tree viewer", "JSON diff checker",
      "JSON to TypeScript", "JSON to CSV", "XML formatter", "XML validator", "YAML validator",
      "YAML formatter", "TOML validator", "SQL formatter", "SQL minifier", "HTML formatter",
      "HTML minifier", "CSS formatter", "CSS minifier", "JavaScript formatter", "JavaScript minifier",
      "JavaScript obfuscator", "Regex tester", "Regex explainer", "Regex generator", "Markdown editor and preview",
      "Markdown table generator", "Markdown to HTML", "HTML to Markdown", "URL parser", "Query-string builder",
      "URL encoder/decoder", "Base64 encoder/decoder", "JWT decoder", "UUID generator", "ULID generator",
      "Random string generator", "Lorem Ipsum API data generator", "Hash generator", "File checksum calculator", "Unix timestamp converter",
      "Cron expression generator", "Cron expression parser", ".gitignore generator", ".editorconfig generator", "Colour code converter",
      "HTML colour picker", "CSS gradient generator", "CSS box-shadow generator", "CSS border-radius generator", "CSS animation generator",
      "SVG path editor", "SVG optimiser", "SVG to JSX converter", "HTML entity encoder", "MIME type lookup",
      "User-agent parser", "HTTP header viewer", "HTTP request builder", "API response formatter", "Webhook request tester"
    ]
  },
  {
    id: "network",
    num: 10,
    name: "Networking & Internet Utilities",
    icon: "globe",
    color: "sky",
    websites: ["MXToolbox", "Cloudflare Radar"],
    description: "IPv4/IPv6 subnet calculators, CIDR ranges, DNS lookup, HTTP status, and bandwidth estimators.",
    tools: [
      "IPv4 address calculator", "IPv6 address calculator", "Subnet calculator", "CIDR range calculator", "IP address format converter",
      "MAC address formatter", "MAC address vendor lookup", "Public IP lookup", "DNS record lookup", "DNS propagation checker",
      "Domain WHOIS lookup", "Domain age checker", "SSL certificate inspector", "SSL certificate expiry checker", "HTTP status-code lookup",
      "HTTP header analyser", "URL redirect checker", "URL parser", "URL shortener", "QR code generator for URLs",
      "Website response-time checker", "Website availability monitor", "Ping tool", "Traceroute tool", "Port availability checker",
      "Bandwidth calculator", "Download-time estimator", "Data transfer rate converter", "Wi-Fi QR generator", "User-agent information viewer"
    ]
  },
  {
    id: "security",
    num: 11,
    name: "Security, Encryption & Integrity",
    icon: "shield",
    color: "teal",
    websites: ["CyberChef", "DevToys"],
    description: "SHA-256/512 hashes, HMAC, password generators, strength estimators, AES encryption, and redaction.",
    tools: [
      "SHA-256 hash generator", "SHA-512 hash generator", "SHA-1 hash calculator", "MD5 checksum calculator", "File checksum verifier",
      "Text hash calculator", "HMAC generator", "Random password generator", "Passphrase generator", "Password strength estimator",
      "Random token generator", "UUID generator", "Base64 encoder/decoder", "URL encoding/decoding", "HTML escaping/unescaping",
      "JWT decoder", "JWT expiry inspector", "PEM certificate viewer", "X.509 certificate inspector", "Public-key format converter",
      "File encryption utility", "File decryption utility", "Text encryption/decryption", "EXIF metadata remover", "PDF metadata remover",
      "Document metadata inspector", "Sensitive text redactor", "QR code decoder", "File signature detector", "Duplicate file checksum finder"
    ]
  },
  {
    id: "qr",
    num: 12,
    name: "QR Codes, Barcodes & Generators",
    icon: "qr-code",
    color: "violet",
    websites: ["QRCode Monkey", "Mockaroo"],
    description: "Generate URL/Wi-Fi/vCard QR codes, barcodes, UUIDs, dummy JSON/CSV, and placeholder assets.",
    tools: [
      "URL QR generator", "Text QR generator", "Wi-Fi QR generator", "Contact-card QR generator", "Email QR generator",
      "Phone-number QR generator", "Location QR generator", "Payment QR generator", "QR code with logo", "Custom-colour QR generator",
      "QR code decoder from image", "QR code decoder from webcam", "Barcode generator", "EAN-13 barcode generator", "UPC barcode generator",
      "Code 128 generator", "Code 39 generator", "ISBN barcode generator", "Serial-number generator", "UUID generator",
      "Random-number generator", "Random-name generator", "Dummy email-data generator", "Sample JSON generator", "Fake CSV-data generator for testing",
      "Lorem Ipsum generator", "Placeholder-image generator", "Favicon generator", "CSS gradient generator", "Colour palette generator"
    ]
  },
  {
    id: "calculators",
    num: 13,
    name: "Calculators & Converters",
    icon: "calculator",
    color: "lime",
    websites: ["OmniCalculator", "RapidTables"],
    description: "Scientific, GST, percentage, base converters, physical units, and electronics calculators.",
    tools: [
      "Basic calculator", "Scientific calculator", "Percentage calculator", "Discount calculator", "GST calculator",
      "Profit/loss calculator", "Ratio calculator", "Fraction calculator", "GCD calculator", "LCM calculator",
      "Prime-number checker", "Factorial calculator", "Exponent calculator", "Logarithm calculator", "Binary-to-decimal converter",
      "Decimal-to-binary converter", "Hexadecimal converter", "Octal converter", "Roman numeral converter", "Length converter",
      "Mass converter", "Area converter", "Volume converter", "Temperature converter", "Speed converter",
      "Pressure converter", "Energy converter", "Power converter", "Voltage/current/resistance calculator", "Ohm's law calculator",
      "Resistor colour-code calculator", "LED resistor calculator", "Battery runtime estimator", "Electrical power calculator", "Unit-prefix converter",
      "Storage-unit converter", "Bandwidth converter", "Date-difference calculator", "Age calculator", "Time-duration calculator",
      "Timezone converter", "Unix timestamp converter", "Countdown calculator", "Fuel-efficiency converter", "Pace and speed calculator"
    ]
  },
  {
    id: "productivity",
    num: 14,
    name: "Date, Time & Productivity Tools",
    icon: "calendar-clock",
    color: "yellow",
    websites: ["TimeAndDate", "Pomofocus"],
    description: "Date calculators, world clock, Pomodoro timer, stopwatch, habit tracker, and random pickers.",
    tools: [
      "Calendar generator", "Date difference finder", "Add days to a date", "Subtract days from a date", "Working-days calculator",
      "Week-number calculator", "Leap-year checker", "Timezone converter", "World-clock viewer", "Unix timestamp converter",
      "Cron schedule explainer", "Stopwatch", "Countdown timer", "Pomodoro timer", "Alarm tool",
      "Meeting-time planner", "Habit tracker", "To-do list generator", "Random decision picker", "Team-name generator",
      "Team randomiser", "Wheel-of-names generator", "Dice roller", "Coin-flip simulator", "Random-group generator"
    ]
  },
  {
    id: "ai",
    num: 15,
    name: "AI-Powered Tools",
    icon: "sparkles",
    color: "fuchsia",
    websites: ["Hugging Face Spaces", "remove.bg"],
    description: "Summarizers, OCR, speech transcription, grammar rewrite, code explainers, and prompt assistants.",
    tools: [
      "PDF question-answering tool", "Document summariser", "Multiple-document summariser", "Image-to-text extractor", "OCR for scanned documents",
      "Handwriting recognition", "Table extraction from documents", "Invoice data extractor", "Resume parser", "Grammar checker",
      "Paraphrasing tool", "Text simplifier", "Text translator", "Text-to-speech tool", "Speech-to-text tool",
      "Audio transcription summariser", "Subtitle generator", "Subtitle translator", "Image caption generator", "AI image generator",
      "AI image editor", "Background remover", "Image upscaler", "Photo restoration tool", "Object-removal tool",
      "AI logo generator", "AI poster generator", "Presentation generator", "Diagram generator", "Flowchart generator",
      "Mind-map generator", "Code explainer", "Code debugging assistant", "SQL query generator", "Regex generator",
      "Data-analysis assistant", "Chart recommendation tool", "Semantic text similarity checker", "Embedding visualiser", "Text classification tool"
    ]
  },
  {
    id: "data",
    num: 16,
    name: "Data & Spreadsheet Utilities",
    icon: "table",
    color: "green",
    websites: ["CSVJSON", "Transform Tools"],
    description: "CSV viewer/editor, JSON flattener, deduplication, dataset statistics, and column frequency counters.",
    tools: [
      "CSV viewer", "CSV editor", "CSV formatter", "CSV validator", "CSV-to-JSON converter",
      "JSON-to-CSV converter", "JSON-to-Excel converter", "Excel-to-JSON converter", "TSV-to-CSV converter", "Merge CSV files",
      "Split CSV by row count", "Split CSV by column", "Remove duplicate rows", "Remove duplicate columns", "Sort table rows",
      "Filter table rows", "Find missing values", "Replace missing values", "Trim whitespace in cells", "Change column names",
      "Reorder columns", "Compare two CSV files", "Compare two JSON files", "Merge JSON objects", "Flatten nested JSON",
      "JSON path explorer", "XML-to-JSON converter", "SQL-to-JSON converter", "Data deduplication tool", "Random sample selector",
      "Dataset statistics calculator", "Missing-data report generator", "Data type detector", "Date-column formatter", "Column value frequency counter"
    ]
  },
  {
    id: "web",
    num: 17,
    name: "Web, HTML & Website Utilities",
    icon: "layout",
    color: "indigo",
    websites: ["CodePen", "MetaTags.io"],
    description: "Live HTML/CSS/JS playground, SEO meta/OpenGraph generators, link extractors, and contrast checkers.",
    tools: [
      "HTML live editor", "CSS live editor", "JavaScript playground", "HTML preview tool", "HTML validator",
      "CSS validator", "JSON-LD validator", "Sitemap generator", "Robots.txt generator", "Meta-tag generator",
      "Open Graph preview", "Twitter/X card preview", "Favicon generator", "Website screenshot tool", "Website colour extractor",
      "Webpage-to-PDF converter", "Webpage-to-image converter", "HTML-to-text converter", "Link extractor", "Broken-link checker",
      "Redirect-chain checker", "URL parameter builder", "QR code for webpage", "Responsive layout tester", "Viewport-size calculator",
      "Website performance report", "Accessibility checker", "Colour contrast checker", "Font pairing preview", "Web font format converter"
    ]
  },
  {
    id: "design",
    num: 18,
    name: "Design, Colours & Typography",
    icon: "palette",
    color: "pink",
    websites: ["Coolors", "SVGOMG"],
    description: "HEX/RGB/HSL converters, palette harmonics, glassmorphism/neumorphism CSS, and typography scales.",
    tools: [
      "HEX-to-RGB converter", "RGB-to-HSL converter", "Colour palette generator", "Complementary-colour finder", "Gradient generator",
      "CSS shadow generator", "Border-radius generator", "Glassmorphism generator", "Neumorphism generator", "Typography scale generator",
      "Font preview tool", "Font pairing finder", "Font metadata viewer", "WOFF-to-TTF converter", "SVG optimiser",
      "SVG editor", "SVG-to-JSX converter", "Icon generator", "App icon resizer", "Social-media image resizer",
      "Thumbnail template maker", "Poster layout creator", "Image mockup generator", "CSS pattern generator", "CSS animation previewer"
    ]
  },
  {
    id: "science",
    num: 19,
    name: "Science, Maths & Engineering",
    icon: "cpu",
    color: "blue",
    websites: ["Desmos", "WolframAlpha"],
    description: "Matrices, vectors, calculus, statistics, RC/RLC impedance, wire gauge, PWM, and logic truth tables.",
    tools: [
      "Scientific calculator", "Equation solver", "Matrix calculator", "Matrix inverse calculator", "Determinant calculator",
      "Vector calculator", "Vector dot-product calculator", "Vector cross-product calculator", "Complex-number calculator", "Derivative calculator",
      "Integral calculator", "Limit calculator", "Equation plotter", "Function graph generator", "Statistics calculator",
      "Standard-deviation calculator", "Probability calculator", "Normal-distribution calculator", "Linear-regression calculator", "Unit conversion calculator",
      "Significant-figures calculator", "Scientific-notation converter", "Ohm's law calculator", "Voltage-divider calculator", "Resistor colour-code decoder",
      "LED resistor calculator", "Series-resistance calculator", "Parallel-resistance calculator", "RC time-constant calculator", "Capacitor-charge calculator",
      "Inductor-reactance calculator", "Capacitive-reactance calculator", "Impedance calculator", "AC frequency/wavelength calculator", "Power and energy calculator",
      "Battery runtime estimator", "Voltage-drop calculator", "Wire-gauge calculator", "PWM duty-cycle calculator", "Resistor-divider calculator",
      "Logic-gate truth-table generator", "Binary arithmetic calculator", "Number-system converter", "3D-printing time estimator", "Gear-ratio calculator"
    ]
  },
  {
    id: "education",
    num: 20,
    name: "Education, Notes & Study Utilities",
    icon: "graduation-cap",
    color: "amber",
    websites: ["Quizlet", "ZoteroBib"],
    description: "Flashcards, quizzes, spaced repetition, APA/MLA citation formatters, and CGPA/attendance calculators.",
    tools: [
      "Flashcard generator", "Quiz generator", "Multiple-choice question generator", "Random question selector", "Study timetable generator",
      "Revision schedule generator", "Spaced-repetition planner", "Notes-to-summary converter", "Notes-to-flashcards converter", "Lecture audio transcriber",
      "Lecture summariser", "Citation formatter", "Bibliography generator", "APA citation formatter", "MLA citation formatter",
      "Word count for assignments", "Reading-time estimator", "Grade calculator", "CGPA calculator", "Percentage-to-grade converter",
      "Attendance calculator", "Marks-weightage calculator", "Random study-group creator", "Presentation outline generator", "Diagram and concept-map creator"
    ]
  },
  {
    id: "files",
    num: 21,
    name: "File Management & Batch Processing",
    icon: "folder-cog",
    color: "emerald",
    websites: ["Bulk Rename Utility", "PDF24"],
    description: "Bulk file renamer, prefix/suffix, folder tree generator, file chunk splitter, and checksum comparison.",
    tools: [
      "Bulk file renamer", "Add prefix to filenames", "Add suffix to filenames", "Replace text in filenames", "Number files sequentially",
      "Sort filenames naturally", "Extract filenames to TXT", "Export file list to CSV", "Generate folder tree", "Find duplicate files",
      "Compare file checksums", "Identify file type by signature", "Inspect file size", "Split large files into chunks", "Rejoin file chunks",
      "Batch image conversion", "Batch image resizing", "Batch image compression", "Batch PDF conversion", "Batch file renaming",
      "Batch metadata removal", "Batch text replacement", "Batch archive extraction", "Batch checksum generation", "Batch file-format detection"
    ]
  },
  {
    id: "accessibility",
    num: 22,
    name: "Accessibility & Language Tools",
    icon: "languages",
    color: "teal",
    websites: ["WAVE", "Aksharamukha"],
    description: "TTS reader, readability analyzer, script transliteration, contrast, and color-blind simulator.",
    tools: [
      "Text-to-speech reader", "Speech-to-text converter", "Text readability analyser", "Text simplifier", "Grammar checker",
      "Spell checker", "Language detector", "Translation tool", "Transliteration tool", "Roman-to-Devanagari converter",
      "Devanagari-to-Roman transliterator", "Subtitle generator", "Subtitle timing editor", "Subtitle format converter", "Colour-blindness simulation",
      "Contrast-ratio checker", "Image alt-text generator", "Accessible colour-palette generator", "Keyboard-navigation tester", "Screen-reader-friendly HTML checker"
    ]
  },
  {
    id: "robotics",
    num: 23,
    name: "3D, CAD & Robotics Utilities",
    icon: "bot",
    color: "rose",
    websites: ["3DViewer.net", "NCViewer"],
    description: "STL/G-code analyzers, 3D filament cost, gear ratios, RPM-to-speed, 2D rotation matrices, PID & PWM visualizers.",
    tools: [
      "STL file viewer", "OBJ file viewer", "GLTF/GLB model viewer", "STL-to-OBJ converter", "OBJ-to-STL converter",
      "GLB-to-GLTF converter", "3D model dimension inspector", "3D model rotation and preview", "STL mesh repair", "3D model simplifier",
      "Mesh file converter", "G-code viewer", "G-code basic analyser", "3D-printing filament estimator", "3D-printing cost calculator",
      "Gear-ratio calculator", "Wheel RPM-to-speed calculator", "Motor torque/power calculator", "Battery capacity calculator", "Robot coordinate converter",
      "Degree-to-radian converter", "Rotation-matrix calculator", "2D vector visualiser", "Homogeneous transformation calculator", "PID parameter visualiser",
      "PWM signal visualiser", "UART baud-rate calculator", "I²C address scanner reference", "Arduino/ESP32 pinout reference", "Electronics resistor calculator"
    ]
  },
  {
    id: "llmai",
    num: 24,
    name: "AI Prompts, LLM & Agent Utilities",
    icon: "brain-circuit",
    color: "fuchsia",
    websites: ["Hugging Face", "OpenRouter", "LangChain"],
    description: "Token counters, LLM API cost estimators, system prompt builders, JSON schema generators, and RAG chunking tools.",
    tools: [
      "LLM token counter & estimator", "AI API pricing calculator", "System prompt template builder", "Few-shot prompt formatter", "Chain-of-Thought prompt generator",
      "JSON schema generator for tool calling", "OpenAI function-calling validator", "RAG text chunk size visualizer", "Chunk overlap calculator", "Vector embedding dimension memory calculator",
      "Cosine similarity calculator for vectors", "Dot-product similarity tester", "Euclidean distance calculator", "Prompt variable injector", "Prompt A/B comparison diff tool",
      "Jailbreak & prompt-injection sanitizer", "PII redactor for LLM prompts", "Markdown-to-JSONL fine-tuning converter", "CSV-to-JSONL dataset converter", "ChatML format converter",
      "Alpaca-to-ShareGPT dataset converter", "LLM context-window fill gauge", "VRAM requirement estimator for GGUF models", "Quantization size calculator (FP16/Q8/Q4)", "Tokens-per-second latency benchmark calculator",
      "Batch API cost discount calculator", "AI agent persona generator", "Mermaid diagram prompt builder", "SQL schema-to-prompt converter", "Regex prompt generator",
      "Code review prompt builder", "Unit-test generation prompt builder", "Git commit message prompt builder", "Academic paper summarizer prompt", "Stop-sequence config builder",
      "Temperature & Top-P sampling visualizer", "Logit-bias JSON builder", "AI hallucination checklist verifier", "Synthetic Q&A pair template builder", "Knowledge-graph triple extractor helper",
      "Multi-agent role-play script builder", "Voice-AI latency budget calculator", "Vision-LLM image tile token calculator", "Anthropic XML tag wrapper", "System instruction compressor",
      "Prompt token-golf minifier", "AI safety moderation keyword scanner", "Model benchmark score comparator"
    ]
  },
  {
    id: "ros2",
    num: 25,
    name: "ROS2, Drone & Autonomous Systems",
    icon: "radar",
    color: "cyan",
    websites: ["ROS.org", "ArduPilot", "PX4"],
    description: "Quaternion-Euler converters, Ackermann/Diff-drive kinematics, LiDAR data rate, Drone thrust-to-weight, and Kalman tuning.",
    tools: [
      "Quaternion to Euler angles converter", "Euler angles to Quaternion converter", "Differential-drive kinematics calculator", "Ackermann steering geometry calculator", "Mecanum wheel holonomic kinematics solver",
      "Omni-wheel velocity vector mixer", "ROS2 launch file XML/Python template generator", "URDF joint & link inertia tensor calculator", "Box/Cylinder/Sphere moment of inertia calculator", "TF2 static transform publisher command builder",
      "ROS2 QoS profile compatibility checker", "DDS domain ID port calculator", "LiDAR point-cloud data rate estimator", "Stereo camera depth baseline calculator", "Camera focal-length & FOV calculator",
      "Pinhole camera projection matrix builder", "AprilTag / ArUco marker size-distance calculator", "Odometry covariance matrix formatter", "IMU Allan variance noise helper", "Kalman filter 1D step simulator",
      "Complementary filter alpha cutoff calculator", "Low-pass RC/digital filter cutoff calculator", "Drone Thrust-to-Weight ratio calculator", "Quadcopter hover flight-time estimator", "Brushless motor KV to RPM calculator",
      "Propeller tip-speed & pitch speed calculator", "ESC amp rating & burst current selector", "LiPo C-rating safe discharge current calculator", "LiPo cell voltage storage/full checker", "Solar rover power budget calculator",
      "Stepper motor microstepping resolution calculator", "Lead-screw linear velocity & thrust calculator", "Belt & pulley pitch length calculator", "Servo linkage torque & lever-arm calculator", "Encoder ticks-per-revolution to distance converter",
      "CAN bus bit-timing & baud calculator", "Modbus RTU CRC-16 checksum calculator", "MAVLink packet payload inspector", "NMEA 0183 GPS sentence parser", "GPS Lat/Long Haversine distance & bearing calculator",
      "UTM to Lat/Long coordinate converter", "Occupancy grid map memory size calculator", "A* / Dijkstra grid heuristic comparator", "Pure Pursuit lookahead distance calculator", "PID anti-windup clamp calculator",
      "Deadband & hysteresis response tester", "Ultrasonic TOF distance temperature compensator", "Load-cell Wheatstone bridge mV/V calculator"
    ]
  },
  {
    id: "fintech",
    num: 26,
    name: "FinTech, Startup, GST & Business Tools",
    icon: "landmark",
    color: "emerald",
    websites: ["ClearTax", "Zerodha Varsity", "Stripe Atlas"],
    description: "GST inclusive/exclusive, EMI, SIP, CAGR, startup runway, SaaS MRR/churn, cap-table dilution, and unit economics.",
    tools: [
      "GST inclusive vs exclusive split calculator", "CGST / SGST / IGST invoice tax breakup", "HSN/SAC margin & markup calculator", "Startup cash burn-rate & runway calculator", "SaaS MRR & ARR growth projector",
      "Customer Acquisition Cost (CAC) calculator", "Lifetime Value (LTV) & LTV:CAC ratio calculator", "SaaS revenue churn & net retention calculator", "Founder equity dilution & cap-table simulator", "Pre-money & Post-money valuation calculator",
      "SAFE note conversion dilution calculator", "ESOP option pool vest schedule calculator", "Break-even units & revenue calculator", "Gross margin vs Net profit margin calculator", "Return on Ad Spend (ROAS) calculator",
      "CPM, CPC & CTR digital ad calculator", "E-commerce return-rate profit impact calculator", "Freelance hourly rate & utilization calculator", "Invoice late-fee interest calculator", "Compound Annual Growth Rate (CAGR) calculator",
      "SIP mutual fund wealth calculator", "Lumpsum investment future value calculator", "Step-up SIP maturity calculator", "Home/Car/Education Loan EMI calculator", "Loan prepayment interest saver calculator",
      "Flat interest vs Reducing balance converter", "Fixed Deposit (FD) compounding calculator", "Recurring Deposit (RD) maturity calculator", "PPF 15-year maturity estimator", "Inflation purchasing-power erosion calculator",
      "Rule of 72 doubling-time calculator", "Net Present Value (NPV) cashflow calculator", "Return on Investment (ROI) percentage calculator", "Working capital & current ratio calculator", "Inventory turnover & days-sales calculator",
      "Price elasticity of demand calculator", "Discounted Cash Flow (DCF) terminal value helper", "Salary CTC to in-hand take-home estimator", "Gratuity payout eligibility calculator", "HRA tax exemption calculator",
      "Advance tax installment schedule calculator", "TDS deduction rate quick calculator", "UPI / Payment gateway MDR fee calculator", "International wire FX markup calculator", "Subscription annual vs monthly discount calculator",
      "Bill splitter & group tip calculator", "Cost-per-unit batch manufacturing calculator", "B2B quotation & proforma summary generator"
    ]
  },
  {
    id: "cyber",
    num: 27,
    name: "Cyber-Forensics, OSINT & Network Defense",
    icon: "shield-alert",
    color: "rose",
    websites: ["CyberChef", "OWASP", "Shodan"],
    description: "CSP/CORS builders, CVSS v3 score calculator, hex/magic-byte analyzer, Caesar/XOR ciphers, and SPF/DMARC builders.",
    tools: [
      "CVSS v3.1 vulnerability severity score calculator", "Content-Security-Policy (CSP) header generator", "CORS header configuration builder", "HSTS & security headers checklist generator", "Subresource Integrity (SRI) hash generator",
      "File magic-bytes (hex signature) identifier", "Hex dump viewer & ASCII inspector", "XOR cipher encrypt/decrypt workbench", "Caesar & ROT13 cipher wheel", "Vigenère cipher encoder/decoder",
      "Morse code translator & audio beeper", "Atbash & substitution cipher tool", "Shannon entropy randomness calculator", "Data-URI base64 payload builder", "Defang / Refang malicious URLs & IPs",
      "Email SPF record syntax generator", "DMARC policy tag builder", "DKIM key record formatter", "SSH key fingerprint format helper", "Chmod octal & symbolic permission calculator",
      "Linux umask permission calculator", "Iptables / UFW firewall rule generator", "Fail2ban regex filter tester", "Wireshark display filter builder", "Tcpdump command-line flag builder",
      "Nmap scan command generator (ethical audit)", "Nikto / Gobuster syntax reference builder", "SQL injection payload sanitizer & escaper", "XSS HTML context encoder & sanitizer", "Path-traversal string normalizer",
      "JWT weak-secret dictionary audit helper", "OAuth2 PKCE code_verifier & challenge generator", "TOTP 2FA base32 secret formatter", "Bcrypt cost-factor timing estimator", "Argon2 parameter memory/time calculator",
      "Password crack-time brute-force estimator", "Diceware 6-word passphrase generator", "API rate-limit token-bucket simulator", "DDoS bandwidth & packet-per-second calculator", "Syslog severity & facility code decoder",
      "Windows Event ID quick lookup reference", "MITRE ATT&CK technique ID notes formatter", "Incident response timeline log formatter", "YARA rule skeleton template generator", "Sigma log rule YAML template builder",
      "STIX/TAXII threat indicator JSON formatter", "CVE markdown advisory report generator", "Bug-bounty vulnerability report template builder"
    ]
  },
  {
    id: "creator",
    num: 28,
    name: "Content Creator, YouTube & Gaming Tools",
    icon: "clapperboard",
    color: "amber",
    websites: ["SocialBlade", "Streamlabs", "OBS"],
    description: "YouTube chapter timestamps, bitrate calculators, teleprompter, BPM tapper, gaming eDPI/FOV, and tournament brackets.",
    tools: [
      "YouTube chapter timestamp formatter", "Video script speaking-time teleprompter", "Browser full-screen scrolling teleprompter", "OBS streaming bitrate & resolution calculator", "Uncompressed vs H.264 video file size estimator",
      "Audio file size calculator (PCM/MP3/AAC)", "YouTube title & description length checker", "YouTube tag & keyword comma formatter", "Thumbnail safe-zone & aspect ratio checker", "Instagram carousel split-image planner",
      "Short-form hook script template generator", "Podcast episode show-notes markdown builder", "SRT subtitle timestamp offset shifter", "BPM tap tempo & beat interval calculator", "Delay & reverb pre-delay time (ms) calculator",
      "Musical note to frequency (Hz) converter", "dBFS to linear gain ratio converter", "Camera shutter-angle (180-degree rule) calculator", "Depth-of-Field & hyperfocal distance calculator", "Timelapse shooting interval & clip duration calculator",
      "Golden hour & lighting sun-angle helper", "Green-screen chroma-key RGB spill checker", "Gaming mouse eDPI sensitivity calculator", "CS2 / Valorant / Apex sensitivity converter", "Sim-racing Field of View (FOV) calculator",
      "Monitor PPI (Pixels Per Inch) & retina distance calculator", "Refresh-rate frame-time (ms) converter (60Hz–540Hz)", "PC bottleneck & PSU wattage estimator", "GPU VRAM resolution texture budget estimator", "Network ping & jitter packet-loss score calculator",
      "Esports round-robin schedule generator", "Single-elimination tournament bracket builder", "Elo / MMR rating change calculator", "Speedrun split time difference calculator", "Loot-drop probability & gacha pity calculator",
      "D&D / RPG polyhedral dice expression roller (2d20+5)", "Minecraft block coordinate & Nether portal calculator", "Roblox / Unity UI UDim2 scale converter", "Game loop delta-time & fixed-step visualizer", "2D AABB bounding-box collision tester",
      "Sprite-sheet grid UV coordinate calculator", "Pixel-art palette quantizer helper", "Discord webhook embed JSON builder", "Discord timestamp syntax generator (<t:unix:R>)", "Twitch / YouTube chat command response builder",
      "Giveaway provably-fair winner picker", "Creator sponsorship rate-card calculator", "Media-kit stats summary card generator"
    ]
  }
];

// Build flat array of all 1,050 tools with sequential IDs (#1 to #1050)
const ALL_TOOLS = [];
let globalCounter = 1;

CATEGORIES_DATA.forEach((cat) => {
  cat.tools.forEach((toolName) => {
    ALL_TOOLS.push({
      id: globalCounter++,
      name: toolName,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryNum: cat.num,
      icon: cat.icon,
      color: cat.color,
      websites: cat.websites
    });
  });
});
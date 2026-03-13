import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen, Brain, Search, Globe, FolderOpen, Settings, Bot, PenTool,
  Shield, CheckCircle2, Sparkles, Mic, ImagePlus, FileText,
  Clock3, PanelsTopLeft, Workflow, Laptop, Wrench, Compass, ArrowRight,
  RefreshCcw, Link2, Users, Headphones, Table2, Camera, LayoutGrid,
  School, Share2, Lightbulb, ChevronDown, ChevronRight, AlertTriangle,
  Zap, Target, Eye, Layers, ArrowUpRight, Menu, X, Hash, MessageSquare,
  Database, Cpu, Lock, BookMarked, Puzzle, CircleDot, Play, Pause
} from "lucide-react";

/* ─────────────────────────────────────────────
   FONT LOADER
   ───────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    :root {
      --font-display: 'Fraunces', 'Georgia', serif;
      --font-body: 'DM Sans', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --green-deep: #0A3D2E;
      --green-mid: #10a37f;
      --green-light: #E8F5EE;
      --cream: #FAF8F4;
      --cream-dark: #F0EDE6;
      --ink: #1A1A1A;
      --ink-light: #6B6B6B;
      --ink-muted: #9B9B9B;
      --border: #E2DFD8;
      --border-light: #ECEAE4;
      --amber-warm: #F59E0B;
      --rose-accent: #E11D48;
    }
    * { font-family: var(--font-body); }
    h1, h2, h3, .font-display { font-family: var(--font-display); }
    code, .font-mono { font-family: var(--font-mono); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    details summary::-webkit-details-marker { display: none; }
    details summary { list-style: none; }
  `}</style>
);

/* ─────────────────────────────────────────────
   CONSTANTS & DATA
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "March 12, 2026";

const LEVELS = [
  { key: "all", label: "All Levels" },
  { key: "foundation", label: "Foundation" },
  { key: "core", label: "Core Skills" },
  { key: "power", label: "Power Features" },
  { key: "expert", label: "Expert" },
];

const CORE_FEATURES = [
  { title: "Search", icon: Globe, color: "#0284c7", description: "Real-time web results for current facts, prices, news, laws, schedules, and anything that changes.", when: "Anything that might have changed since the model's training cutoff." },
  { title: "Deep Research", icon: Search, color: "#4f46e5", description: "Multi-step documented research across web sources, uploaded files, and connected apps.", when: "You need a report with sources, not a quick answer." },
  { title: "Projects", icon: FolderOpen, color: "#059669", description: "Persistent workspace with shared files, custom instructions, and conversation memory.", when: "Any work you will revisit: courses, clients, startups, personal systems." },
  { title: "Memory", icon: Database, color: "#d97706", description: "Stores durable preferences and recurring context that carries across conversations.", when: "Preferences and patterns, not exact document storage." },
  { title: "Custom Instructions", icon: Settings, color: "#57534e", description: "Always-on behavior rules for tone, formatting, response structure, and boundaries.", when: "You want every chat to follow your house rules by default." },
  { title: "Canvas", icon: PanelsTopLeft, color: "#334155", description: "A visible drafting surface for writing and code that supports targeted inline edits.", when: "Iterative editing of long-form text or code files." },
  { title: "Tasks", icon: Clock3, color: "#7c3aed", description: "Schedule one-time or recurring outputs that execute later and notify you.", when: "Reminders, daily briefs, recurring summaries." },
  { title: "Apps (Connectors)", icon: Wrench, color: "#0d9488", description: "Connect external tools — Google Drive, Slack, email — so ChatGPT can read and act on your data.", when: "The best context for your question lives outside of chat." },
  { title: "Agent", icon: Workflow, color: "#16a34a", description: "Autonomous execution across browsers, files, code, and connected apps for complex multi-step tasks.", when: "The job involves navigating sites, filling forms, or chaining multiple actions." },
  { title: "Custom GPTs", icon: Bot, color: "#44403c", description: "Reusable assistants with stable instructions, knowledge files, and selected capabilities.", when: "A workflow repeats often enough to formalize." },
  { title: "Voice", icon: Mic, color: "#e11d48", description: "Spoken interaction for low-friction thinking, brainstorming, and conversational exploration.", when: "You want to think out loud or multitask." },
  { title: "Images", icon: ImagePlus, color: "#c026d3", description: "Upload images for analysis, generate new images from descriptions, and edit images inline.", when: "Visual understanding, creation, or refinement." },
  { title: "Files & Data", icon: FileText, color: "#0891b2", description: "Upload PDFs, spreadsheets, documents, and structured data for analysis with code execution.", when: "You need charts, summaries, calculations, or structured analysis." },
  { title: "Models", icon: Brain, color: "#65a30d", description: "Choose between speed-optimized, balanced, and reasoning-heavy modes depending on the job.", when: "Match model power to task complexity — do not always default to the strongest." },
];

const ADDITIONAL_FEATURES = [
  { title: "Study Mode", icon: School, color: "#059669", description: "Guided learning with questions, staged explanations, and comprehension checks instead of direct answers." },
  { title: "Record", icon: Headphones, color: "#0284c7", description: "Capture spoken meetings, lectures, or notes, then produce summaries and reusable artifacts." },
  { title: "Group Chats", icon: Users, color: "#7c3aed", description: "Invite other people into the same conversation for shared planning and collaborative work." },
  { title: "Shared Links", icon: Link2, color: "#57534e", description: "Share a conversation via URL instead of screenshots or copy-paste." },
  { title: "Image Editing", icon: Camera, color: "#c026d3", description: "Select a region of a generated image and refine, replace, or remove parts with natural language." },
  { title: "Interactive Tables", icon: Table2, color: "#0891b2", description: "Inspect uploaded tabular data in a visual table before requesting charts, summaries, or conclusions." },
  { title: "Skills", icon: Share2, color: "#0d9488", description: "Reusable workflows that teach ChatGPT to perform specific jobs with greater consistency." },
  { title: "Pulse", icon: Sparkles, color: "#4f46e5", description: "Asynchronous research that proactively brings back visual summaries on topics you care about." },
];

const TOOL_CHOOSER = [
  { goal: "Quick answer or one-off draft", tool: "Normal Chat", icon: MessageSquare, reason: "Lowest friction. No setup needed." },
  { goal: "Up-to-date information", tool: "Search", icon: Globe, reason: "Anything that may have changed since training." },
  { goal: "Ongoing work with files", tool: "Project", icon: FolderOpen, reason: "Preserves context, files, and instructions across sessions." },
  { goal: "Edit a long document or code", tool: "Canvas", icon: PanelsTopLeft, reason: "Better than linear chat for surgical revision." },
  { goal: "Multi-source documented report", tool: "Deep Research", icon: Search, reason: "Built for multi-step synthesis with citations." },
  { goal: "Complex online task", tool: "Agent", icon: Workflow, reason: "Best when the job crosses multiple sites and actions." },
  { goal: "Scheduled or recurring output", tool: "Tasks", icon: Clock3, reason: "Runs asynchronously and notifies when done." },
  { goal: "Repeat the same workflow often", tool: "GPT or Skill", icon: Bot, reason: "Turn stable patterns into reusable systems." },
];

const PROMPT_BLOCKS = [
  { label: "Goal", example: "Write a one-page project brief for an investor meeting.", color: "#10a37f" },
  { label: "Context", example: "The startup is pre-revenue, Series A stage, in climate tech.", color: "#0284c7" },
  { label: "Constraints", example: "Keep it under 400 words. No jargon. No bullet points.", color: "#7c3aed" },
  { label: "Output Format", example: "Structured as: Problem → Solution → Traction → Ask.", color: "#d97706" },
  { label: "Quality Bar", example: "Write at the level of a McKinsey associate, not a template.", color: "#e11d48" },
  { label: "Verification", example: "Flag any claim that needs a source before I send this.", color: "#334155" },
];

/* ─────────────────────────────────────────────
   GUIDE SECTIONS — EXPANDED CONTENT
   ───────────────────────────────────────────── */
const GUIDE_SECTIONS = [
  {
    id: "mental-model",
    level: "foundation",
    number: "01",
    title: "Start with the right mental model",
    icon: Brain,
    color: "#65a30d",
    summary: "Treat ChatGPT as a reasoning and language partner, not as an infallible oracle. Its first response is typically a useful draft — not the final truth. The strongest users treat every output as provisional until inspected.",
    whyItMatters: "Most disappointing results stem from a mismatch in expectations. Users who expect certainty get frustrated; users who expect a skilled first draft get extraordinary leverage.",
    beginnerMoves: [
      "Assume the first answer is a draft. Read it critically before relying on it.",
      "Ask what assumptions were made before you act on the result.",
      "Use ChatGPT to accelerate your judgment, not to replace it.",
    ],
    advancedMoves: [
      "Ask for the strongest counter-argument against its own recommendation.",
      "Separate exploration (brainstorming), recommendation (synthesis), and risk review (stress-testing) into distinct passes.",
      "Use the model as a second opinion, not the primary decision-maker, on anything consequential.",
    ],
    commonMistakes: [
      "Trusting numerical claims without verification — the model generates plausible numbers, not always correct ones.",
      "Assuming silence means confidence — if the model does not flag uncertainty, it does not mean certainty exists.",
      "Copying outputs verbatim without reading them through once, as a human reader would.",
    ],
    promptExamples: [
      { prompt: "What assumptions did you make in your last answer?", why: "Forces the model to surface hidden reasoning." },
      { prompt: "What would a skeptical domain expert challenge here?", why: "Produces adversarial review of its own work." },
      { prompt: "Give me the strongest argument against your recommendation.", why: "Prevents confirmation bias in the output." },
      { prompt: "Rate your confidence in each claim from 1 to 5 and explain why.", why: "Separates high-confidence facts from speculation." },
    ],
    beforeAfter: {
      before: "Write me a business plan for a coffee shop.",
      after: "Draft a one-page business plan for a specialty coffee shop in downtown Boston. Target audience: graduate students and remote workers. Include realistic revenue assumptions and flag anything you estimated rather than sourced.",
      improvement: "Adds context, audience, location, quality bar, and a verification rule."
    },
    visual: "mental",
  },
  {
    id: "workspace",
    level: "foundation",
    number: "02",
    title: "Learn the workspace before obsessing over prompts",
    icon: Laptop,
    color: "#059669",
    summary: "Modern ChatGPT is a layered workspace, not a single text box. Different jobs belong in different layers: normal chat, projects, search, canvas, deep research, tasks, apps, or agent. A decent prompt in the correct layer almost always outperforms a clever prompt in the wrong one.",
    whyItMatters: "Choosing the right workspace is the highest-leverage decision you make before typing a single word. Most users underuse projects, canvas, and tasks because they never learned the layers exist.",
    beginnerMoves: [
      "Use normal chat for quick, one-off questions and drafts.",
      "Use a Project for any work you will revisit more than once.",
      "Use Temporary Chat when you want a completely blank slate with no memory.",
    ],
    advancedMoves: [
      "Split your work by domain (one project per course, client, or initiative) rather than mixing everything into one conversation.",
      "Treat projects as long-term knowledge hubs — upload reference files, set project-specific instructions, and return to the same workspace.",
      "Use canvas for documents and code that need iterative editing; keep strategy discussion in chat.",
    ],
    commonMistakes: [
      "Starting a new chat every time instead of returning to the relevant project.",
      "Using chat for long documents when canvas would allow targeted inline edits.",
      "Ignoring tasks and agent entirely — these are the operational layer most users never discover.",
    ],
    promptExamples: [
      { prompt: "Help me decide: should this be a normal chat, a project, or a GPT?", why: "Uses the model itself to pick the right workspace." },
      { prompt: "List the ideal project structure for managing my semester coursework.", why: "Plans workspace architecture before diving into content." },
      { prompt: "What files and instructions should I add to this project to get the best results?", why: "Optimizes project context for recurring use." },
    ],
    beforeAfter: {
      before: "I keep starting new chats for my thesis research and losing context.",
      after: "Create a Project called 'MS Thesis — [topic]'. Upload my literature review PDF, set instructions to always use APA style and a formal academic tone, and start our first research conversation inside it.",
      improvement: "Moves from ephemeral chats to a persistent, context-aware workspace."
    },
    visual: "layers",
  },
  {
    id: "prompting",
    level: "foundation",
    number: "03",
    title: "Prompting fundamentals: clarity beats cleverness",
    icon: PenTool,
    color: "#0284c7",
    summary: "Good prompts are operating briefs, not magic spells. Fancy wording is optional; clear constraints are not. The model cannot see the standards in your head unless you write them down. Specificity compounds — every concrete detail you add narrows the output toward what you actually need.",
    whyItMatters: "Vague prompts produce generic outputs. Most frustration with AI writing quality traces back to under-specified inputs, not model limitations.",
    beginnerMoves: [
      "Name the audience and the actual use case — 'for a professor email' not 'write something formal.'",
      "State what success looks like before asking for the output.",
      "Specify format, tone, length, and what to explicitly avoid.",
    ],
    advancedMoves: [
      "Ask for the outline first, approve it, then request the full draft. This two-step pattern prevents structural rewrites.",
      "Separate facts from interpretation when doing research: 'List the facts first, then give me your analysis separately.'",
      "Provide a rubric or checklist the model should grade itself against before delivering the final answer.",
    ],
    commonMistakes: [
      "Writing a three-word prompt and expecting a tailored result.",
      "Adding too many constraints at once — start focused, then refine in the next turn.",
      "Asking 'Can you…?' instead of directly stating what you want. The model will always say yes; skip to the instruction.",
    ],
    promptExamples: [
      { prompt: "My goal is ___. Context: ___. Constraints: ___. Produce ___.", why: "The universal prompt skeleton — works for nearly everything." },
      { prompt: "Show me the outline first. Do not draft the full answer yet.", why: "Prevents wasted effort on the wrong structure." },
      { prompt: "Before writing, tell me what you still need to know.", why: "Lets the model ask clarifying questions before committing." },
      { prompt: "Write this as if you are a [specific role] explaining to [specific audience].", why: "Anchors tone and depth simultaneously." },
    ],
    beforeAfter: {
      before: "Write a cover letter.",
      after: "Write a cover letter for a Strategy Analyst role at McKinsey. I am a graduate student in International Management with prior experience in SOP development and CRM systems. Tone: confident but not arrogant. Length: 350 words. Do not use the phrase 'I am passionate about.'",
      improvement: "Adds role, background, tone, length, and a negative constraint."
    },
    visual: "prompt",
  },
  {
    id: "revision",
    level: "core",
    number: "04",
    title: "Use revision workflows, not one-shot perfection",
    icon: RefreshCcw,
    color: "#7c3aed",
    summary: "Strong ChatGPT use is iterative. The practical pattern is: frame the job, get a draft, critique it, revise with a narrower target, then package the final output. Most users restart from scratch when they should be refining the existing answer instead.",
    whyItMatters: "One-shot prompting caps your output quality at whatever the model produces on the first try. Revision workflows consistently produce higher-quality results because each pass adds specificity.",
    beginnerMoves: [
      "After the first draft, ask 'What is weak or missing in your last answer?' before you manually rewrite.",
      "Request revision with a narrower target: 'Tighten the argument in paragraph 2.'",
      "Do not restart the conversation unless the fundamental direction is wrong.",
    ],
    advancedMoves: [
      "Use fixed passes: structure → factual accuracy → tone → compression → final packaging.",
      "Ask the model to critique itself before asking it to rewrite — self-diagnosis improves the revision.",
      "Specify a compression ratio: 'Cut this by 30% without losing any essential information.'",
    ],
    commonMistakes: [
      "Rewriting everything manually instead of asking the model to diagnose and fix its own work.",
      "Giving vague feedback like 'make it better' — this produces unpredictable changes.",
      "Running too many passes — three targeted rounds usually outperform six unfocused ones.",
    ],
    promptExamples: [
      { prompt: "Tell me why your last answer did not fully meet the goal I stated.", why: "Self-diagnosis before revision produces targeted fixes." },
      { prompt: "Revise for sharper business logic and tighter evidence. Do not change the structure.", why: "Constrains the revision scope." },
      { prompt: "Compress this by 35% without losing anything essential.", why: "Forces prioritization without manual editing." },
      { prompt: "Grade your output against these criteria: [list]. Where did you score below 4/5?", why: "Structured self-evaluation before final revision." },
    ],
    beforeAfter: {
      before: "That's not quite right. Try again.",
      after: "The argument in section 2 is circular. Rewrite it with a concrete data point from the uploaded report. Keep the rest unchanged.",
      improvement: "Specifies exactly what is wrong, what to fix, and what to preserve."
    },
    visual: "workflow",
  },
  {
    id: "writing",
    level: "core",
    number: "05",
    title: "Writing, rewriting, and transformation",
    icon: FileText,
    color: "#57534e",
    summary: "ChatGPT is exceptionally strong at transformation work: rewriting for a different audience, changing tone, summarizing, reorganizing structure, comparing versions, simplifying dense text, and tightening prose. It is often better at improving existing text than inventing the ideal draft from nothing.",
    whyItMatters: "Most professional writing is transformation, not creation — reformatting notes into emails, condensing reports, adjusting tone for different stakeholders. This is where AI assistance has the highest return.",
    beginnerMoves: [
      "Paste the original text and clearly state what must stay and what must change.",
      "Specify audience, channel (email, Slack, report), and tone.",
      "Ask for multiple versions when tone is uncertain — then pick the best one.",
    ],
    advancedMoves: [
      "Use contrastive versions: 'Give me three variants: formal, concise, and persuasive.'",
      "Ask for sentence-level diagnosis: 'Which specific sentences feel generic and why?'",
      "Request a style transfer: 'Rewrite this in the style of [publication/author], maintaining my facts.'",
    ],
    commonMistakes: [
      "Letting ChatGPT write from scratch when you have existing notes or drafts to transform.",
      "Accepting the first tone without exploring alternatives.",
      "Not specifying what to preserve — the model may change things you wanted kept intact.",
    ],
    promptExamples: [
      { prompt: "Rewrite this for a professor email: respectful, direct, natural, no fluff.", why: "Precise transformation with tone and format constraints." },
      { prompt: "Give me three versions: formal, concise, and more persuasive.", why: "Contrastive outputs let you pick or blend the best elements." },
      { prompt: "Tell me exactly which sentences feel generic and why.", why: "Line-level diagnosis is more useful than vague critique." },
      { prompt: "Keep my facts and structure. Only change the tone to be warmer and less corporate.", why: "Scoped transformation with clear preservation rules." },
    ],
    beforeAfter: {
      before: "Make this email better.",
      after: "Rewrite this email for my program director. Tone: respectful and direct, not sycophantic. Remove any corporate jargon. Keep it under 150 words. Preserve the three action items at the end.",
      improvement: "Specifies audience, tone, anti-patterns, length, and preservation rules."
    },
    visual: "writing",
  },
  {
    id: "files-data",
    level: "core",
    number: "06",
    title: "Files, PDFs, spreadsheets, and data",
    icon: Table2,
    color: "#0891b2",
    summary: "ChatGPT can inspect uploaded files, summarize documents, execute code on tabular data, and produce charts and visualizations. The key to quality is sequencing: describe the data first, then analyze, then conclude. Jumping straight to conclusions skips the audit step where most errors occur.",
    whyItMatters: "File-based work becomes dramatically stronger when you ask the model to inspect the data before interpreting it. Skipping inspection is the single most common source of incorrect data analysis.",
    beginnerMoves: [
      "Ask what the file contains before asking what it means.",
      "For datasets, request a field audit first: columns, date range, missing values, obvious anomalies.",
      "For PDFs, separate structure, argument, evidence, and critique into distinct steps.",
    ],
    advancedMoves: [
      "Require an explicit audit trail: 'List every assumption and transformation you used to produce this chart.'",
      "Ask the model to restate extracted tables cleanly before drawing conclusions.",
      "Use code execution for large datasets — ChatGPT can run Python with pandas, matplotlib, and more.",
    ],
    commonMistakes: [
      "Uploading a spreadsheet and immediately asking 'What are the key insights?' without auditing the data first.",
      "Trusting chart labels without verifying the underlying calculations.",
      "Assuming the model can read every PDF perfectly — scanned documents and complex layouts sometimes need OCR help.",
    ],
    promptExamples: [
      { prompt: "Describe this dataset first: fields, date range, missing values, and likely analysis options.", why: "Audit before analysis catches errors early." },
      { prompt: "Extract the core argument of this PDF before critiquing it.", why: "Separates comprehension from judgment." },
      { prompt: "List every assumption you used to produce this chart.", why: "Creates a reviewable audit trail." },
      { prompt: "Write Python code to clean this data, then run it and show me the result.", why: "Uses code execution for reproducible analysis." },
    ],
    beforeAfter: {
      before: "What are the key insights from this spreadsheet?",
      after: "First, audit this spreadsheet: list all columns, data types, date range, missing values, and any anomalies. Then propose three analysis approaches ranked by likely usefulness. Do not run any analysis until I approve an approach.",
      improvement: "Adds an inspection step, proposes before executing, and requires approval."
    },
    visual: "data",
  },
  {
    id: "search-research",
    level: "core",
    number: "07",
    title: "Search, deep research, and citation discipline",
    icon: Search,
    color: "#4f46e5",
    summary: "Use Search for current answers backed by real sources. Use Deep Research for longer, multi-step reports that synthesize across web pages, files, and connected apps. Anything current, regulated, local, controversial, or fast-changing should never rely on the model's static memory alone.",
    whyItMatters: "ChatGPT without search is answering from a frozen snapshot of the world. For anything that changes — prices, laws, personnel, events — you need live retrieval to avoid confidently stated outdated information.",
    beginnerMoves: [
      "Use Search for anything that may have changed recently: stock prices, news, company leadership, legislation.",
      "Inspect whether a cited source actually supports the specific claim being made.",
      "Prefer primary sources (company filings, government sites, peer-reviewed papers) when stakes are high.",
    ],
    advancedMoves: [
      "Force a split between confirmed facts and reasoned inference: 'Separate what is confirmed from what is your inference.'",
      "Specify acceptable source types, geographic region, and date horizon.",
      "Use Deep Research for comprehensive reports, but define the scope before it begins.",
    ],
    commonMistakes: [
      "Trusting model knowledge for current events without enabling search.",
      "Accepting a claim as 'sourced' without clicking through to verify the source actually says what was attributed.",
      "Using Deep Research for a quick factual question — it is built for synthesis, not speed.",
    ],
    promptExamples: [
      { prompt: "Search the web and answer with current primary sources only.", why: "Forces live retrieval with source quality constraints." },
      { prompt: "Separate confirmed facts from your inference. Label each clearly.", why: "Makes epistemic status transparent." },
      { prompt: "What in this answer could become outdated within six months?", why: "Identifies time-sensitive claims proactively." },
      { prompt: "Use Deep Research to produce a documented report on [topic]. Scope: [region, date range, source types].", why: "Gives Deep Research a defined job brief." },
    ],
    beforeAfter: {
      before: "What's the latest on AI regulation?",
      after: "Search for the latest AI regulation developments in the EU and US from the past 30 days. Cite primary sources only (official government publications, not opinion pieces). Separate enacted legislation from proposed bills.",
      improvement: "Adds geographic scope, time range, source quality, and categorization rules."
    },
    visual: "research",
  },
  {
    id: "multimodal",
    level: "core",
    number: "08",
    title: "Voice, images, and multimodal workflows",
    icon: ImagePlus,
    color: "#c026d3",
    summary: "ChatGPT is no longer text-only. Voice input, image understanding, image generation, and image editing are standard parts of the product. The key to quality is specificity — vague visual requests produce generic results, just as vague text prompts do.",
    whyItMatters: "Multimodal capabilities turn ChatGPT into a visual analysis tool, a creative image studio, and a hands-free brainstorming partner simultaneously. Most users underutilize these modes.",
    beginnerMoves: [
      "Tell ChatGPT exactly what you want done with an uploaded image — do not just say 'What do you think?'",
      "Use voice mode when speed matters more than polished phrasing, or when you are multitasking.",
      "For image generation, specify subject, framing, mood, lighting, and style explicitly.",
    ],
    advancedMoves: [
      "Chain modes together: analyze an image → explain it in text → turn the explanation into notes or slides.",
      "Use image critique prompts for design review: 'Evaluate this UI screenshot for visual hierarchy and accessibility.'",
      "For image editing, select a specific region and describe precisely what should change.",
    ],
    commonMistakes: [
      "Uploading an image with no instructions — the model will guess what you want, and it will guess wrong.",
      "Expecting photorealistic results from vague descriptions.",
      "Forgetting that voice mode conversations carry the same context as text conversations in the same chat.",
    ],
    promptExamples: [
      { prompt: "Extract all menu items from this photo and organize them by category with English translations.", why: "Specific extraction task with clear output structure." },
      { prompt: "Explain this chart to a non-technical executive in under 120 words.", why: "Visual analysis with audience and length constraints." },
      { prompt: "Generate an image: vertical 9:16, cinematic composition, minimal clutter, warm golden-hour lighting.", why: "Technical photography-style specification for image generation." },
      { prompt: "In the generated image, replace only the background with a clean white studio setting. Keep the subject exactly as is.", why: "Scoped image editing with preservation rules." },
    ],
    beforeAfter: {
      before: "Make me a cool image.",
      after: "Generate a 16:9 illustration of a modern Tokyo coffee shop interior at dusk. Style: architectural photography with shallow depth of field. Mood: warm, contemplative. Include: wooden counter, espresso machine, floor-to-ceiling windows showing city lights. No people.",
      improvement: "Adds every visual parameter: aspect ratio, subject, style, mood, elements, and exclusions."
    },
    visual: "multimodal",
  },
  {
    id: "study-collab",
    level: "power",
    number: "09",
    title: "Study mode, record, group chats, shared links, and skills",
    icon: LayoutGrid,
    color: "#0d9488",
    summary: "Some of the most useful features are not about asking or generating. They help you learn, capture spoken content, collaborate, share, and formalize workflows. These features change how ChatGPT fits into classrooms, teamwork, and repeated real-life processes.",
    whyItMatters: "Learning is not the same as getting answers. Collaboration is not the same as solo prompting. These features address fundamentally different use cases that text chat alone cannot serve well.",
    beginnerMoves: [
      "Use Study Mode when you want to learn the material, not just get the answer.",
      "Use Record for meetings, brainstorms, lectures, or voice notes — then turn the capture into structured artifacts.",
      "Use Shared Links and Group Chats to collaborate without screenshots or copy-paste.",
    ],
    advancedMoves: [
      "Turn recorded meeting summaries into project source files for ongoing reference.",
      "Use Skills to formalize repeated jobs so the workflow does not need rebuilding each time.",
      "Combine Group Chats with a Project to give multiple collaborators shared context.",
    ],
    commonMistakes: [
      "Using normal chat to study — it gives you the answer immediately, which defeats the learning purpose.",
      "Forgetting that Record exists — many users manually type meeting notes when voice capture is available.",
      "Sharing full conversations via screenshot instead of using the Shared Link feature.",
    ],
    promptExamples: [
      { prompt: "Quiz me on this material instead of telling me the answers directly.", why: "Engages Study Mode's pedagogical approach." },
      { prompt: "Turn this meeting recording into action items, owner assignments, and a follow-up email draft.", why: "Multi-output transformation of a voice capture." },
      { prompt: "Convert this repeated workflow into a reusable Skill with clear input/output definitions.", why: "Formalizes a stable process for reuse." },
    ],
    beforeAfter: {
      before: "Explain photosynthesis to me.",
      after: "I am studying for my biology exam on photosynthesis. Do not explain it to me directly. Instead, ask me questions to check my understanding, starting from basic concepts and building up. Correct my mistakes with brief explanations.",
      improvement: "Switches from answer-delivery to guided learning."
    },
    visual: "collab",
  },
  {
    id: "personalization",
    level: "power",
    number: "10",
    title: "Memory, custom instructions, personality, and temporary chat",
    icon: Database,
    color: "#d97706",
    summary: "These four controls are related but not interchangeable. Memory stores recurring context. Custom Instructions set always-on behavior rules. Personality adjusts style. Temporary Chat creates a clean room. Confusing these layers creates inconsistent or over-personalized results.",
    whyItMatters: "Personalization is a system, not a single setting. Each layer has a specific job, and misconfigured personalization degrades results more often than it improves them.",
    beginnerMoves: [
      "Keep memory for broad, stable preferences only — job title, language, preferred response style.",
      "Put global writing rules in Custom Instructions — always use APA format, never use bullet points, etc.",
      "Use Temporary Chat when you need a session with no memory carryover.",
    ],
    advancedMoves: [
      "Treat Personality as texture (warm, concise, direct) — not as a replacement for explicit instructions.",
      "Use project-specific instructions instead of stuffing every rule into global Custom Instructions.",
      "Periodically audit your memory: ask 'What do you currently remember about me?' and clean up anything outdated.",
    ],
    commonMistakes: [
      "Putting everything in memory instead of using Custom Instructions for behavioral rules.",
      "Not realizing that memory can accumulate stale or incorrect information over time.",
      "Using Personality to try to change the model's capabilities — it only changes style, not skill.",
    ],
    promptExamples: [
      { prompt: "What do you currently remember about me?", why: "Audits memory for accuracy and relevance." },
      { prompt: "Forget the preference about always using formal tone.", why: "Targeted memory cleanup." },
      { prompt: "Treat this chat as a blank-slate consultation. Do not use any stored preferences.", why: "Clean-room mode without switching to Temporary Chat." },
    ],
    beforeAfter: {
      before: "I set all my preferences in memory but my results are inconsistent.",
      after: "Move stable behavior rules (tone, formatting, never-do rules) into Custom Instructions. Keep only factual context (job, location, ongoing projects) in Memory. Use project-level instructions for domain-specific rules.",
      improvement: "Separates personalization into the correct layers."
    },
    visual: "memory",
  },
  {
    id: "projects",
    level: "power",
    number: "11",
    title: "Projects as your real operating system",
    icon: FolderOpen,
    color: "#16a34a",
    summary: "Projects are where ChatGPT stops feeling like a chatbot and starts feeling like a context-aware workbench. A well-configured project with uploaded files, custom instructions, and conversation history outperforms any single-chat interaction, no matter how clever the prompt.",
    whyItMatters: "For any work that spans multiple sessions — academic courses, client engagements, product development, personal systems — projects are the highest-leverage organizational tool in ChatGPT.",
    beginnerMoves: [
      "Create one project per major workstream. Name it clearly.",
      "Upload only relevant context files — quality matters more than quantity.",
      "Write project-specific instructions that describe the ongoing purpose and recurring conventions.",
    ],
    advancedMoves: [
      "Use projects as living knowledge bases: add summaries of past conversations as new source files.",
      "Keep weekly work inside one project rather than starting fresh chats each session.",
      "Set up a 'meta-project' for personal productivity: goals, schedules, reflection templates.",
    ],
    commonMistakes: [
      "Creating too many narrow projects instead of a well-scoped set of broadly useful ones.",
      "Uploading every file you have — the model gets confused when context is bloated and unfocused.",
      "Not writing project instructions — the project becomes just a folder instead of a context-aware workspace.",
    ],
    promptExamples: [
      { prompt: "Design the ideal project structure for managing my coursework this semester.", why: "Plans the workspace before filling it with content." },
      { prompt: "Given everything in this project, draft a memo consistent with prior decisions.", why: "Leverages accumulated project context for coherent output." },
      { prompt: "Summarize the key decisions from our last five conversations in this project.", why: "Creates a living summary for future reference." },
    ],
    beforeAfter: {
      before: "I have files everywhere and keep losing track of context across chats.",
      after: "Create a project for each domain. Upload reference files. Write instructions. Return to the same project for related work. Periodically summarize and archive old conversations into a project source file.",
      improvement: "Replaces scattered conversations with a structured, persistent workspace."
    },
    visual: "project",
  },
  {
    id: "gpts",
    level: "power",
    number: "12",
    title: "When to build a GPT and when not to",
    icon: Bot,
    color: "#44403c",
    summary: "A custom GPT is useful when a workflow repeats often, has stable instructions, and benefits from a reusable interface. But most people build GPTs too early — before the workflow is proven and stable. Start with saved prompts. Only formalize a GPT after the pattern clearly repeats.",
    whyItMatters: "A premature GPT bakes in an immature workflow. A well-timed GPT turns a proven process into a one-click tool that anyone can use.",
    beginnerMoves: [
      "Save successful prompts before building a GPT — the prompt is the prototype.",
      "Only formalize into a GPT after you have repeated the same workflow at least three times.",
      "Keep the GPT's purpose narrow. One job, done well.",
    ],
    advancedMoves: [
      "Separate the GPT into four layers: role definition, instructions, knowledge files, and tool permissions.",
      "Write explicit failure rules: what the GPT should refuse or flag instead of attempting.",
      "Test the GPT with adversarial inputs before sharing it with others.",
    ],
    commonMistakes: [
      "Building a GPT for something you have only done once — the workflow is not yet stable.",
      "Making the GPT too broad — a 'do everything' GPT performs poorly compared to a focused one.",
      "Not uploading knowledge files — the GPT relies entirely on the base model instead of your domain context.",
    ],
    promptExamples: [
      { prompt: "Turn our last successful workflow into a reusable GPT blueprint.", why: "Derives GPT design from proven experience." },
      { prompt: "Write the instructions, input schema, output schema, and failure rules for this GPT.", why: "Produces a complete, testable GPT specification." },
      { prompt: "What edge cases should this GPT handle gracefully?", why: "Proactive resilience testing." },
    ],
    beforeAfter: {
      before: "I want a GPT that handles all my email communications.",
      after: "I want a GPT that drafts reply emails to university professors. Tone: respectful and direct. Length: under 150 words. It should ask me for context before drafting. It should refuse to send anything without my confirmation. Upload: my email style guide.",
      improvement: "Narrows scope, sets tone, adds safety rules, and includes reference material."
    },
    visual: "gpt",
  },
  {
    id: "canvas",
    level: "power",
    number: "13",
    title: "Canvas for writing and code revision",
    icon: PanelsTopLeft,
    color: "#334155",
    summary: "Canvas provides a visible working surface alongside the chat. It is better than linear conversation when the work is document-like or file-like and requires iterative, surgical edits rather than full rewrites.",
    whyItMatters: "Long artifacts suffer in linear chat. You lose track of the current version, diffs are hard to see, and each edit risks unintended changes elsewhere. Canvas makes the document the center of gravity.",
    beginnerMoves: [
      "Use canvas when you need to see and refine a long artifact — reports, essays, code files.",
      "Keep one canvas file focused on one purpose.",
      "Ask for targeted edits ('Fix paragraph 3') rather than vague rewrites ('Make it better').",
    ],
    advancedMoves: [
      "Use chat to discuss strategy and canvas to execute the resulting changes.",
      "For code, request architecture-level changes first, then narrow diffs second.",
      "Use canvas version history to compare before-and-after states of your document.",
    ],
    commonMistakes: [
      "Continuing to use chat for long documents when canvas would be more efficient.",
      "Requesting full rewrites in canvas when only a paragraph needs to change.",
      "Not taking advantage of code canvas for debugging — it supports targeted inline patches.",
    ],
    promptExamples: [
      { prompt: "Open this as a writing canvas and rewrite only the introduction.", why: "Uses canvas for scoped editing." },
      { prompt: "Find logic errors in this code component and patch only those lines.", why: "Targeted code fix via canvas." },
      { prompt: "Reorganize this document: move section 3 before section 2 and merge sections 4 and 5.", why: "Structural reorganization where canvas excels." },
    ],
    beforeAfter: {
      before: "Rewrite my essay. [pastes 2000 words in chat]",
      after: "Open this essay in a writing canvas. Do not change anything yet. First, annotate which sections are strong and which need revision. Then I will tell you which edits to make.",
      improvement: "Uses canvas for inspection before modification, preserving control."
    },
    visual: "canvas",
  },
  {
    id: "tasks-apps-agent",
    level: "expert",
    number: "14",
    title: "Tasks, apps, pulse, and agent",
    icon: Workflow,
    color: "#16a34a",
    summary: "This is the operational layer. Tasks execute later and notify you. Apps bring external data into chat. Pulse runs asynchronous research. Agent performs autonomous multi-step work across browsers, files, and tools. The highest leverage now comes from deciding when ChatGPT should answer, remember, or execute.",
    whyItMatters: "Most users interact with ChatGPT only in real-time question-and-answer mode. The operational layer turns it into a system that works on your behalf when you are not watching.",
    beginnerMoves: [
      "Use Tasks for reminders, daily briefings, and recurring summaries.",
      "Use Apps when the information you need lives in Google Drive, Slack, email, or another connected service.",
      "Use Agent for any multi-step online workflow that would take you 15+ minutes of manual clicking.",
    ],
    advancedMoves: [
      "Write agent prompts like job briefs: objective, sources to use, constraints, stop points, and expected deliverable.",
      "Use Pulse to get proactive updates on topics you care about without manually checking.",
      "Combine Tasks with Projects: set a weekly task that produces a summary from a specific project context.",
    ],
    commonMistakes: [
      "Not knowing Agent exists — it is the most powerful feature most users have never tried.",
      "Giving Agent vague instructions — it needs the same clarity as any good prompt, plus explicit stopping rules.",
      "Using Tasks only for reminders when they can produce complex recurring outputs.",
    ],
    promptExamples: [
      { prompt: "Set a recurring daily task: every morning at 8 AM, brief me on [topic] with the top three developments.", why: "Turns ChatGPT into a proactive briefing system." },
      { prompt: "Use connected sources and public web sources to build a documented competitive analysis.", why: "Combines internal and external data." },
      { prompt: "Use Agent to complete this workflow: [steps]. Pause before the final submission and show me what you have.", why: "Autonomous execution with a human checkpoint before completion." },
    ],
    beforeAfter: {
      before: "Can you check these five websites and compare their pricing?",
      after: "Use Agent to visit these five competitor websites, extract their current pricing tiers, and compile the results into a comparison table. Pause if any site requires login. Flag pricing that seems outdated.",
      improvement: "Delegates to Agent with clear scope, error handling, and quality rules."
    },
    visual: "agent",
  },
  {
    id: "model-choice",
    level: "expert",
    number: "15",
    title: "Model choice and plan-sensitive behavior",
    icon: Compass,
    color: "#65a30d",
    summary: "ChatGPT offers multiple model modes that trade off speed, reasoning depth, and tool support. Faster modes are better for drafting and transformation. Deeper reasoning modes are better for complex analysis, logic, and synthesis. Not every task needs the most powerful setting.",
    whyItMatters: "Users who always default to the most advanced mode waste time on simple tasks. Users who never escalate miss out on deeper reasoning when it matters. The skill is in matching mode to task.",
    beginnerMoves: [
      "Use Auto (the default) for most everyday work — it selects a sensible balance.",
      "Escalate to a reasoning-heavy mode only when the task involves complex logic, math, or multi-step synthesis.",
      "Do not assume the strongest mode is always the best — speed has value too.",
    ],
    advancedMoves: [
      "Use faster modes for drafting and brainstorming, then switch to a deeper mode for critical review.",
      "Watch for tool availability: some premium reasoning modes may have limited web search or file access.",
      "For multi-turn work, start in a lighter mode and escalate mid-conversation if the task demands it.",
    ],
    commonMistakes: [
      "Always using the most powerful mode, even for simple tasks like formatting or rewording.",
      "Blaming the model when the real issue was picking the wrong mode for the job.",
      "Not checking whether your plan tier has access to the modes you need for a given task.",
    ],
    promptExamples: [
      { prompt: "Give me the quick answer first, then a deeper analysis in a second pass.", why: "Uses both speed and depth in sequence." },
      { prompt: "This is a complex logic problem. Use extended thinking to work through it step by step.", why: "Explicitly invokes deeper reasoning when needed." },
      { prompt: "Would this task benefit more from fast drafting or careful reasoning?", why: "Asks the model to help you pick the right mode." },
    ],
    beforeAfter: {
      before: "I always use the most advanced model for everything.",
      after: "Use Auto for quick tasks. Escalate to a reasoning mode for logic-heavy problems, code debugging, or nuanced analysis. Use a fast mode when you need volume: brainstorming, drafting multiple options, or iterating quickly.",
      improvement: "Matches model power to task type, optimizing both speed and quality."
    },
    visual: "models",
  },
  {
    id: "privacy-risk",
    level: "expert",
    number: "16",
    title: "Privacy, data controls, and risk discipline",
    icon: Shield,
    color: "#e11d48",
    summary: "The more capable ChatGPT becomes, the more important boundaries become. Strong users know not only how to use the tool, but when not to. Sensitive data requires upload discipline, and high-stakes outputs still require expert human review.",
    whyItMatters: "Capability without boundaries leads to casual data exposure or over-reliance on AI outputs for decisions that require human accountability. Risk discipline is what separates power users from reckless users.",
    beginnerMoves: [
      "Do not upload sensitive content casually — client data, financial records, personal identifiers.",
      "Scrub identifiable information when possible before uploading.",
      "Use Temporary Chat for anything where you want the cleanest privacy posture available.",
    ],
    advancedMoves: [
      "Create your own traffic-light upload policy: red (never upload), yellow (upload with redaction), green (safe to upload).",
      "Require expert human review before acting on any high-stakes AI output — legal, medical, financial.",
      "Audit what data you have shared with ChatGPT periodically and clean up anything unnecessary.",
    ],
    commonMistakes: [
      "Uploading full client databases when a redacted sample would suffice.",
      "Assuming Temporary Chat means nothing is processed — it still reaches the model, it just is not stored.",
      "Using AI outputs as final decisions in regulated domains without professional review.",
    ],
    promptExamples: [
      { prompt: "Identify which parts of this task are high-risk and should be verified by a human expert.", why: "Makes the model flag its own limitations proactively." },
      { prompt: "Help me redact this document before I upload the full version.", why: "Uses AI to prepare for safe AI use." },
      { prompt: "What data in this file is personally identifiable? Help me remove it.", why: "PII detection before upload." },
    ],
    beforeAfter: {
      before: "Here's my full client list — analyze the trends.",
      after: "I have a client dataset with 500 rows. Before uploading, I will remove names, email addresses, and phone numbers. I will replace company names with anonymized labels. Then analyze the revenue trends by industry segment.",
      improvement: "Redacts identifiers before upload, preserving analytical value while protecting privacy."
    },
    visual: "privacy",
  },
];

/* ─────────────────────────────────────────────
   SVG VISUAL COMPONENTS
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const common = `h-44 w-full text-[var(--green-deep)] opacity-80`;

  const visuals = {
    mental: (
      <svg viewBox="0 0 360 200" className={common}>
        <rect x="24" y="20" width="128" height="54" rx="14" className={s} strokeWidth="2.2" />
        <rect x="208" y="20" width="128" height="54" rx="14" className={s} strokeWidth="2.2" />
        <rect x="116" y="130" width="128" height="54" rx="14" className={s} strokeWidth="2.2" />
        <path d="M152 47h56" className={s} strokeWidth="2" markerEnd="url(#arr)" />
        <path d="M88 74l60 56" className={s} strokeWidth="2" />
        <path d="M272 74l-60 56" className={s} strokeWidth="2" />
        <text x="88" y="52" textAnchor="middle" className="fill-current text-[13px] font-semibold">Your goal</text>
        <text x="272" y="52" textAnchor="middle" className="fill-current text-[13px] font-semibold">AI draft</text>
        <text x="180" y="162" textAnchor="middle" className="fill-current text-[13px] font-semibold">Your judgment</text>
        <text x="180" y="104" textAnchor="middle" className="fill-current text-[10px] opacity-60">inspect → decide → act</text>
      </svg>
    ),
    layers: (
      <svg viewBox="0 0 360 200" className={common}>
        {[
          [36, 16, 288, 28, "Normal Chat"],
          [50, 50, 260, 28, "Projects + Canvas"],
          [64, 84, 232, 28, "Memory + Instructions"],
          [78, 118, 204, 28, "GPTs + Study + Skills"],
          [92, 152, 176, 28, "Tasks + Apps + Agent"],
        ].map(([x, y, w, h, label]) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={h} rx="12" className={s} strokeWidth="2.2" />
            <text x={180} y={y + 18} textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
          </g>
        ))}
        <text x="340" y="30" textAnchor="end" className="fill-current text-[9px] opacity-50">simple</text>
        <text x="340" y="170" textAnchor="end" className="fill-current text-[9px] opacity-50">powerful</text>
      </svg>
    ),
    prompt: (
      <svg viewBox="0 0 360 200" className={common}>
        {[
          [20, 16, "Goal", "What do you want?"],
          [126, 16, "Context", "Background info"],
          [232, 16, "Rules", "Constraints"],
          [20, 108, "Format", "How to deliver"],
          [126, 108, "Quality", "Standard to hit"],
          [232, 108, "Verify", "Check this claim"],
        ].map(([x, y, label, sub]) => (
          <g key={label}>
            <rect x={x} y={y} width="108" height="60" rx="12" className={s} strokeWidth="2.2" />
            <text x={Number(x) + 54} y={Number(y) + 26} textAnchor="middle" className="fill-current text-[12px] font-semibold">{label}</text>
            <text x={Number(x) + 54} y={Number(y) + 42} textAnchor="middle" className="fill-current text-[9px] opacity-60">{sub}</text>
          </g>
        ))}
      </svg>
    ),
    workflow: (
      <svg viewBox="0 0 360 180" className={common}>
        {[
          [30, "Frame"],
          [100, "Draft"],
          [170, "Critique"],
          [240, "Revise"],
          [310, "Ship"],
        ].map(([x, label], i) => (
          <g key={label}>
            <circle cx={x} cy="90" r="26" className={s} strokeWidth="2.2" />
            <text x={x} y="94" textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
            {i < 4 && <path d={`M${Number(x) + 26} 90h18`} className={s} strokeWidth="2" />}
          </g>
        ))}
        <text x="180" y="148" textAnchor="middle" className="fill-current text-[10px] opacity-50">each pass adds specificity</text>
      </svg>
    ),
    writing: (
      <svg viewBox="0 0 360 180" className={common}>
        <rect x="20" y="24" width="100" height="120" rx="14" className={s} strokeWidth="2.2" />
        <rect x="140" y="24" width="80" height="120" rx="14" className={s} strokeWidth="2.2" />
        <rect x="240" y="24" width="100" height="120" rx="14" className={s} strokeWidth="2.2" />
        <text x="70" y="48" textAnchor="middle" className="fill-current text-[12px] font-semibold">Source</text>
        <text x="180" y="48" textAnchor="middle" className="fill-current text-[12px] font-semibold">Transform</text>
        <text x="290" y="48" textAnchor="middle" className="fill-current text-[12px] font-semibold">Output</text>
        <path d="M120 84h20M220 84h20" className={s} strokeWidth="2" />
        <text x="70" y="72" textAnchor="middle" className="fill-current text-[9px] opacity-60">your draft</text>
        <text x="180" y="72" textAnchor="middle" className="fill-current text-[9px] opacity-60">tone, length</text>
        <text x="290" y="72" textAnchor="middle" className="fill-current text-[9px] opacity-60">polished</text>
      </svg>
    ),
    data: (
      <svg viewBox="0 0 360 180" className={common}>
        <rect x="20" y="20" width="130" height="120" rx="14" className={s} strokeWidth="2.2" />
        <path d="M20 50h130M52 20v120M84 20v120M116 20v120M20 80h130M20 110h130" className={s} strokeWidth="1.5" />
        <rect x="196" y="30" width="28" height="88" rx="8" className={s} strokeWidth="2.2" />
        <rect x="236" y="58" width="28" height="60" rx="8" className={s} strokeWidth="2.2" />
        <rect x="276" y="42" width="28" height="76" rx="8" className={s} strokeWidth="2.2" />
        <rect x="316" y="66" width="28" height="52" rx="8" className={s} strokeWidth="2.2" />
        <path d="M190 130h160" className={s} strokeWidth="2" />
        <text x="85" y="160" textAnchor="middle" className="fill-current text-[10px] opacity-60">1. Inspect</text>
        <text x="270" y="160" textAnchor="middle" className="fill-current text-[10px] opacity-60">2. Conclude</text>
      </svg>
    ),
    research: (
      <svg viewBox="0 0 360 180" className={common}>
        <circle cx="76" cy="76" r="38" className={s} strokeWidth="2.2" />
        <path d="M104 104l28 28" className={s} strokeWidth="2.2" />
        <rect x="180" y="18" width="150" height="34" rx="12" className={s} strokeWidth="2.2" />
        <rect x="180" y="66" width="150" height="34" rx="12" className={s} strokeWidth="2.2" />
        <rect x="180" y="114" width="150" height="34" rx="12" className={s} strokeWidth="2.2" />
        <text x="255" y="40" textAnchor="middle" className="fill-current text-[11px] font-semibold">Primary source</text>
        <text x="255" y="88" textAnchor="middle" className="fill-current text-[11px] font-semibold">Secondary source</text>
        <text x="255" y="136" textAnchor="middle" className="fill-current text-[11px] font-semibold">Model inference</text>
        <circle cx="342" cy="35" r="5" className="fill-[var(--green-mid)] stroke-none" />
        <circle cx="342" cy="83" r="5" className="fill-[var(--amber-warm)] stroke-none" />
        <circle cx="342" cy="131" r="5" className="fill-[var(--rose-accent)] stroke-none opacity-60" />
      </svg>
    ),
    multimodal: (
      <svg viewBox="0 0 360 180" className={common}>
        {[
          [30, "Text"],
          [114, "Image"],
          [198, "Voice"],
          [282, "Edit"],
        ].map(([x, label]) => (
          <g key={label}>
            <rect x={x} y="36" width="66" height="66" rx="16" className={s} strokeWidth="2.2" />
            <text x={Number(x) + 33} y="74" textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
          </g>
        ))}
        <path d="M96 69h18M180 69h18M264 69h18" className={s} strokeWidth="2" />
        <text x="180" y="136" textAnchor="middle" className="fill-current text-[10px] opacity-50">chain modes for richer workflows</text>
      </svg>
    ),
    collab: (
      <svg viewBox="0 0 360 180" className={common}>
        {[
          [22, 36, 72, 50, "Record"],
          [112, 16, 136, 50, "Study Mode"],
          [112, 100, 136, 50, "Group Chat"],
          [266, 36, 72, 50, "Share"],
        ].map(([x, y, w, h, label]) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={h} rx="14" className={s} strokeWidth="2.2" />
            <text x={Number(x) + Number(w) / 2} y={Number(y) + 30} textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
          </g>
        ))}
        <path d="M94 61h18M248 41h18M248 125h18" className={s} strokeWidth="2" />
      </svg>
    ),
    memory: (
      <svg viewBox="0 0 360 180" className={common}>
        {[
          [16, 24, 80, 48, "Memory"],
          [108, 24, 112, 48, "Instructions"],
          [232, 24, 108, 48, "Personality"],
        ].map(([x, y, w, h, label]) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={h} rx="14" className={s} strokeWidth="2.2" />
            <text x={Number(x) + Number(w) / 2} y={Number(y) + 30} textAnchor="middle" className="fill-current text-[12px] font-semibold">{label}</text>
          </g>
        ))}
        <rect x="68" y="112" width="224" height="48" rx="16" className={s} strokeWidth="2.2" />
        <text x="180" y="140" textAnchor="middle" className="fill-current text-[12px] font-semibold">Consistent output</text>
        <path d="M56 72l44 40M164 72v40M286 72l-44 40" className={s} strokeWidth="2" />
      </svg>
    ),
    project: (
      <svg viewBox="0 0 360 180" className={common}>
        <rect x="32" y="12" width="296" height="156" rx="20" className={s} strokeWidth="2.2" />
        <rect x="52" y="40" width="76" height="104" rx="12" className={s} strokeWidth="2.2" />
        <rect x="142" y="40" width="76" height="104" rx="12" className={s} strokeWidth="2.2" />
        <rect x="232" y="40" width="76" height="48" rx="10" className={s} strokeWidth="2.2" />
        <rect x="232" y="96" width="76" height="48" rx="10" className={s} strokeWidth="2.2" />
        <text x="90" y="96" textAnchor="middle" className="fill-current text-[11px] font-semibold">Chats</text>
        <text x="180" y="96" textAnchor="middle" className="fill-current text-[11px] font-semibold">Files</text>
        <text x="270" y="68" textAnchor="middle" className="fill-current text-[10px] font-semibold">Sources</text>
        <text x="270" y="124" textAnchor="middle" className="fill-current text-[10px] font-semibold">Rules</text>
      </svg>
    ),
    gpt: (
      <svg viewBox="0 0 360 180" className={common}>
        {[
          [20, 66, 86, 48, "Role"],
          [128, 16, 104, 48, "Knowledge"],
          [128, 116, 104, 48, "Tools"],
          [254, 66, 86, 48, "Rules"],
        ].map(([x, y, w, h, label]) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={h} rx="14" className={s} strokeWidth="2.2" />
            <text x={Number(x) + Number(w) / 2} y={Number(y) + 29} textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
          </g>
        ))}
        <path d="M106 90h22M232 40h22M232 140h22" className={s} strokeWidth="2" />
        <path d="M180 64v52" className={s} strokeWidth="2" />
      </svg>
    ),
    canvas: (
      <svg viewBox="0 0 360 180" className={common}>
        <rect x="24" y="12" width="312" height="156" rx="18" className={s} strokeWidth="2.2" />
        <path d="M24 44h312" className={s} strokeWidth="2" />
        <path d="M140 44v124M244 44v124" className={s} strokeWidth="1.8" />
        <text x="82" y="32" textAnchor="middle" className="fill-current text-[11px] font-semibold">Outline</text>
        <text x="192" y="32" textAnchor="middle" className="fill-current text-[11px] font-semibold">Draft</text>
        <text x="292" y="32" textAnchor="middle" className="fill-current text-[11px] font-semibold">Edits</text>
        <text x="192" y="104" textAnchor="middle" className="fill-current text-[9px] opacity-50">visible working surface</text>
      </svg>
    ),
    agent: (
      <svg viewBox="0 0 360 180" className={common}>
        {[
          [14, 66, 68, 48, "Goal"],
          [102, 16, 72, 48, "Browse"],
          [102, 116, 72, 48, "Files"],
          [194, 16, 72, 48, "Apps"],
          [194, 116, 72, 48, "Code"],
          [286, 66, 56, 48, "Done"],
        ].map(([x, y, w, h, label]) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={h} rx="12" className={s} strokeWidth="2.2" />
            <text x={Number(x) + Number(w) / 2} y={Number(y) + 29} textAnchor="middle" className="fill-current text-[10px] font-semibold">{label}</text>
          </g>
        ))}
        <path d="M82 90h20M138 64v52M174 40h20M174 140h20M266 40l20 44M266 140l20-44" className={s} strokeWidth="2" />
      </svg>
    ),
    models: (
      <svg viewBox="0 0 360 180" className={common}>
        {[
          [24, 66, 80, 48, "Auto"],
          [128, 16, 80, 48, "Fast"],
          [128, 116, 80, 48, "Deep"],
          [256, 66, 80, 48, "Pro"],
        ].map(([x, y, w, h, label]) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={h} rx="14" className={s} strokeWidth="2.2" />
            <text x={Number(x) + Number(w) / 2} y={Number(y) + 29} textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
          </g>
        ))}
        <path d="M104 90h24M208 40h48M208 140h48" className={s} strokeWidth="2" />
        <path d="M168 64v52" className={s} strokeWidth="2" />
        <text x="168" y="94" textAnchor="middle" className="fill-current text-[8px] opacity-40">match to task</text>
      </svg>
    ),
    privacy: (
      <svg viewBox="0 0 360 180" className={common}>
        <path d="M180 16l96 36v50c0 38-28 70-96 90-68-20-96-52-96-90V52l96-36z" className={s} strokeWidth="2.2" />
        <path d="M148 96l20 20 44-48" className={s} strokeWidth="2.5" />
        <text x="180" y="166" textAnchor="middle" className="fill-current text-[11px] opacity-50">capability needs boundaries</text>
      </svg>
    ),
  };

  return visuals[type] || null;
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────── */

function FeatureCard({ title, icon: Icon, color, description, when }) {
  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-white p-5 transition-all duration-200 hover:border-[var(--green-mid)] hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}>
          <Icon className="h-[18px] w-[18px]" style={{ color }} />
        </div>
        <span className="text-[15px] font-semibold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{title}</span>
      </div>
      <p className="text-[13px] leading-[1.65] text-[var(--ink-light)]">{description}</p>
      {when && (
        <div className="mt-3 rounded-xl bg-[var(--cream)] px-3 py-2 text-[12px] leading-[1.6] text-[var(--ink-light)]">
          <span className="font-semibold text-[var(--green-deep)]">When: </span>{when}
        </div>
      )}
    </div>
  );
}

function MiniFeature({ title, icon: Icon, color, description }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 transition-all duration-200 hover:shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <span className="text-[13px] font-semibold text-[var(--ink)]">{title}</span>
      </div>
      <p className="text-[12px] leading-[1.6] text-[var(--ink-light)]">{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Before → After</div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-red-400">Weak prompt</div>
          <div className="text-[13px] leading-[1.6] text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Strong prompt</div>
          <div className="text-[13px] leading-[1.6] text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-[1.6] text-[var(--green-deep)]">
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-3">
      <div className="text-[13px] leading-[1.6] text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{prompt}</div>
      <div className="mt-1 text-[11px] leading-[1.5] text-[var(--ink-muted)]">{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6"
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: section.color }}
        >
          <section.icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              {section.number} · {section.level.charAt(0).toUpperCase() + section.level.slice(1)}
            </span>
          </div>
          <h3 className="text-[17px] font-semibold leading-snug text-[var(--ink)] md:text-[19px]" style={{ fontFamily: "var(--font-display)" }}>
            {section.title}
          </h3>
          {!isExpanded && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-[1.6] text-[var(--ink-light)]">{section.summary}</p>
          )}
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-[var(--ink-muted)] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Body — expanded */}
      {isExpanded && (
        <div className="border-t border-[var(--border-light)] px-5 pb-6 pt-5 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left column: content */}
            <div className="space-y-5">
              <p className="text-[14px] leading-[1.75] text-[var(--ink)]">{section.summary}</p>

              <div className="rounded-xl border border-[var(--border-light)] bg-[var(--cream)] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Why this matters</div>
                <p className="mt-2 text-[13px] leading-[1.7] text-[var(--ink)]">{section.whyItMatters}</p>
              </div>

              {/* Start here */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--green-deep)]">Start here</div>
                <div className="mt-2 space-y-2">
                  {section.beginnerMoves.map((m, i) => (
                    <div key={i} className="flex gap-2 text-[13px] leading-[1.65] text-[var(--ink)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--green-mid)]" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Advanced moves</div>
                <div className="mt-2 space-y-2">
                  {section.advancedMoves.map((m, i) => (
                    <div key={i} className="flex gap-2 text-[13px] leading-[1.65] text-[var(--ink)]">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common mistakes */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rose-accent)]">Common mistakes</div>
                <div className="mt-2 space-y-2">
                  {section.commonMistakes.map((m, i) => (
                    <div key={i} className="flex gap-2 text-[13px] leading-[1.65] text-[var(--ink)]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rose-accent)] opacity-60" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before / After */}
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>

            {/* Right column: visual + prompts */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--cream)] p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Visual model</div>
                <SectionVisual type={section.visual} />
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Prompt examples</div>
                <div className="mt-2 space-y-2">
                  {section.promptExamples.map((p, i) => (
                    <PromptExample key={i} {...p} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const [mobileNav, setMobileNav] = useState(false);

  const toggleSection = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpanded(new Set(GUIDE_SECTIONS.map((s) => s.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpanded(new Set());
  }, []);

  const filteredSections = useMemo(() => {
    return GUIDE_SECTIONS.filter((s) => {
      const levelMatch = level === "all" || s.level === level;
      if (!query.trim()) return levelMatch;
      const haystack = [
        s.title, s.summary, s.whyItMatters,
        ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes,
        ...s.promptExamples.map((p) => p.prompt + " " + p.why),
        s.beforeAfter.before, s.beforeAfter.after, s.beforeAfter.improvement,
      ].join(" ").toLowerCase();
      return levelMatch && haystack.includes(query.toLowerCase());
    });
  }, [level, query]);

  const sectionsByLevel = useMemo(() => {
    const groups = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach((s) => groups[s.level]?.push(s));
    return groups;
  }, [filteredSections]);

  const levelLabels = {
    foundation: "Foundation",
    core: "Core Skills",
    power: "Power Features",
    expert: "Expert",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)", color: "var(--ink)" }}>
      <FontLoader />

      <div className="mx-auto max-w-[76rem] px-4 py-6 md:px-8 md:py-10">

        {/* ─── HEADER ─── */}
        <header className="overflow-hidden rounded-3xl border border-[var(--border)]" style={{ background: "linear-gradient(135deg, #E8F5EE 0%, #FAF8F4 40%, #F0EDE6 100%)" }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green-deep)]">
                <BookOpen className="h-3.5 w-3.5" />
                Practical reference
              </div>
              <h1 className="text-[32px] font-medium leading-[1.15] tracking-tight text-[var(--ink)] md:text-[44px]" style={{ fontFamily: "var(--font-display)" }}>
                A Master Guide<br className="hidden sm:block" /> to ChatGPT
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-[var(--ink-light)]">
                What each tool does, when to use it, and how to get measurably better results. Written for everyday users first, with deeper sections for those who want them.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[var(--ink-light)] shadow-sm">
                  <Lightbulb className="h-3 w-3 text-[var(--green-mid)]" />
                  Verified against OpenAI docs as of {VERIFIED_DATE}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[var(--ink-light)] shadow-sm">
                  <Layers className="h-3 w-3 text-[var(--green-mid)]" />
                  16 sections · 4 levels · 60+ prompt examples
                </div>
              </div>
            </div>

            {/* Big picture visual */}
            <div className="rounded-2xl border border-[var(--border-light)] bg-white/70 p-5 shadow-sm">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">What ChatGPT does today</div>
              <svg viewBox="0 0 440 220" className="h-full w-full text-[var(--green-deep)]">
                {[
                  [20, 10, 130, 44, "Answering", "chat · search"],
                  [160, 10, 130, 44, "Organizing", "projects · memory"],
                  [300, 10, 130, 44, "Making", "canvas · images · files"],
                  [20, 138, 130, 44, "Learning", "study · record"],
                  [160, 138, 130, 44, "Sharing", "groups · links · skills"],
                  [300, 138, 130, 44, "Executing", "tasks · apps · agent"],
                ].map(([x, y, w, h, label, sub]) => (
                  <g key={label}>
                    <rect x={x} y={y} width={w} height={h} rx="12" className="fill-none stroke-current" strokeWidth="2" />
                    <text x={Number(x) + Number(w) / 2} y={Number(y) + 22} textAnchor="middle" className="fill-current text-[12px] font-semibold">{label}</text>
                    <text x={Number(x) + Number(w) / 2} y={Number(y) + 36} textAnchor="middle" className="fill-current text-[9px] opacity-50">{sub}</text>
                  </g>
                ))}
                {[
                  [150, 32, 160, 32],
                  [290, 32, 300, 32],
                  [85, 54, 85, 138],
                  [225, 54, 225, 138],
                  [365, 54, 365, 138],
                ].map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-current" strokeWidth="1.5" opacity="0.3" />
                ))}
                <text x="220" y="105" textAnchor="middle" className="fill-current text-[11px] font-semibold opacity-40">the full stack</text>
              </svg>
            </div>
          </div>
        </header>

        {/* ─── QUICK PRINCIPLES ─── */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Six principles that matter most</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: PenTool, title: "Ask clearly", desc: "State the goal, context, constraints, and desired format." },
              { icon: LayoutGrid, title: "Choose the right layer", desc: "Use chat, project, canvas, search, or agent on purpose." },
              { icon: Shield, title: "Verify when it matters", desc: "Use search and sources for anything current or high-stakes." },
              { icon: RefreshCcw, title: "Revise, do not restart", desc: "Good results come from a second pass, not a fresh chat." },
              { icon: Bot, title: "Systemize what works", desc: "Turn a successful workflow into a project, GPT, task, or skill." },
              { icon: Eye, title: "Use visuals to think faster", desc: "Tables, diagrams, and screenshots reduce reading friction." },
            ].map(({ icon: I, title, desc }) => (
              <div key={title} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--green-deep)] text-white">
                  <I className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[var(--ink)]">{title}</div>
                  <div className="mt-0.5 text-[12px] leading-[1.6] text-[var(--ink-light)]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TOOL CHOOSER TABLE ─── */}
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex flex-col gap-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Decision table</div>
            <h2 className="text-[22px] font-medium tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
              Which ChatGPT tool should you use?
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--border-light)]">
            <table className="min-w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[var(--cream)]">
                  <th className="px-4 py-3 font-semibold text-[var(--ink)]">Your goal</th>
                  <th className="px-4 py-3 font-semibold text-[var(--ink)]">Best tool</th>
                  <th className="hidden px-4 py-3 font-semibold text-[var(--ink)] md:table-cell">Why</th>
                </tr>
              </thead>
              <tbody>
                {TOOL_CHOOSER.map((row, i) => (
                  <tr key={row.goal} className={i % 2 === 0 ? "bg-white" : "bg-[var(--cream)]/40"}>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">{row.goal}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[var(--green-deep)]">
                        <row.icon className="h-3.5 w-3.5" />
                        <span className="font-semibold">{row.tool}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--ink-light)] md:table-cell">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── PROMPT FORMULA ─── */}
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Prompt pattern</div>
            <h2 className="mt-1 text-[22px] font-medium tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
              Six blocks that improve almost any prompt
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b, i) => (
              <div key={b.label} className="rounded-xl border border-[var(--border-light)] bg-[var(--cream)] p-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{ backgroundColor: b.color }}>{i + 1}</span>
                  <span className="text-[13px] font-semibold text-[var(--ink)]">{b.label}</span>
                </div>
                <p className="text-[12px] leading-[1.6] text-[var(--ink-light)]" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>{b.example}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CORE FEATURES GRID ─── */}
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Feature stack</div>
            <h2 className="mt-1 text-[22px] font-medium tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
              The core ChatGPT tools
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {CORE_FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>

        {/* ─── ADDITIONAL FEATURES ─── */}
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Often overlooked</div>
            <h2 className="mt-1 text-[22px] font-medium tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
              Features most users miss
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ADDITIONAL_FEATURES.map((f) => <MiniFeature key={f.title} {...f} />)}
          </div>
        </section>

        {/* ─── NAVIGATOR (sticky) ─── */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border border-[var(--border)] bg-white/95 p-4 shadow-md backdrop-blur-md md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Guide navigator</div>
              <p className="mt-0.5 text-[12px] text-[var(--ink-light)]">Filter by level, search, or expand all sections.</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections, tips, prompts…"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--cream)] py-2.5 pl-10 pr-4 text-[13px] outline-none transition-colors focus:border-[var(--green-mid)] md:w-72"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setLevel(l.key)}
                    className={`rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all ${
                      level === l.key
                        ? "bg-[var(--green-deep)] text-white shadow-sm"
                        : "border border-[var(--border)] bg-white text-[var(--ink-light)] hover:bg-[var(--cream)]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <button onClick={expandAll} className="rounded-lg border border-[var(--border)] px-2.5 py-2 text-[11px] font-medium text-[var(--ink-light)] transition hover:bg-[var(--cream)]">
                  Expand all
                </button>
                <button onClick={collapseAll} className="rounded-lg border border-[var(--border)] px-2.5 py-2 text-[11px] font-medium text-[var(--ink-light)] transition hover:bg-[var(--cream)]">
                  Collapse
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── GUIDE SECTIONS ─── */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (sections.length === 0) return null;
            return (
              <div key={lev}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[var(--border)]" />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">{levelLabels[lev]}</span>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <div className="space-y-4">
                  {sections.map((section) => (
                    <GuideSectionCard
                      key={section.id}
                      section={section}
                      isExpanded={expanded.has(section.id)}
                      onToggle={() => toggleSection(section.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </main>

        {/* ─── SCOPE NOTES ─── */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Scope</div>
            <h3 className="mt-2 text-[18px] font-medium text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>What this guide covers</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-[1.65] text-[var(--ink-light)]">
              <div className="rounded-xl bg-[var(--cream)] px-4 py-2.5">User-facing ChatGPT features, not enterprise admin settings.</div>
              <div className="rounded-xl bg-[var(--cream)] px-4 py-2.5">Practical usage decisions over product trivia.</div>
              <div className="rounded-xl bg-[var(--cream)] px-4 py-2.5">Feature availability may vary by plan, platform, and rollout timing.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{ background: "linear-gradient(135deg, #E8F5EE, #F0FAF5)" }}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--green-deep)]">The single biggest upgrade</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--green-deep)] text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-[var(--green-deep)]" style={{ fontFamily: "var(--font-display)" }}>
                  Stop asking "How do I prompt better?"
                </div>
                <p className="mt-2 text-[13px] leading-[1.7] text-[var(--green-deep)] opacity-80">
                  Start asking "Which ChatGPT layer fits this job best?" That single shift improves results more than any collection of prompt tricks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <footer className="mt-8 overflow-hidden rounded-3xl border border-emerald-900/20 p-6 text-white shadow-lg md:p-10" style={{ background: "linear-gradient(135deg, #0A2A1F 0%, #0D3B2E 40%, #143D30 100%)" }}>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Final takeaway</div>
              <h2 className="mt-2 text-[24px] font-medium tracking-tight md:text-[28px]" style={{ fontFamily: "var(--font-display)" }}>
                What mastery actually looks like
              </h2>
              <p className="mt-4 max-w-2xl text-[14px] leading-[1.8] text-emerald-100/80">
                Mastery is not about theatrical prompts. It is knowing how to choose the correct mode, define the job clearly, verify what matters, revise intelligently, and turn successful workflows into reusable systems. The best users are not prompt engineers — they are clear thinkers who happen to use AI.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold text-white">Keep re-checking</div>
              <div className="mt-3 space-y-1.5 text-[12px] leading-[1.6] text-emerald-200/70">
                {[
                  "Capabilities Overview", "Pricing & Plans", "Release Notes",
                  "Projects", "Memory FAQ", "Canvas", "Tasks",
                  "Apps & Connectors", "ChatGPT Search", "Deep Research",
                  "Study Mode", "Record", "Shared Links", "Group Chats",
                  "Skills", "Agent", "Voice Mode", "Images FAQ",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-emerald-400/50" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   INLINE SVG ICON SYSTEM (no lucide-react)
   24x24 viewBox, stroke-based, 2px stroke
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FONT + GLOBAL STYLES
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   COLORS
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "March 12, 2026";
const LEVELS = [
  { key: "all", label: "All" }, { key: "foundation", label: "Foundation" },
  { key: "core", label: "Core" }, { key: "power", label: "Power" }, { key: "expert", label: "Expert" },
];

const CORE_FEATURES = [
  { title: "Search", ico: "globe", color: "#0284c7", description: "Real-time web results for current facts, prices, news, laws, and anything that changes.", when: "Anything that might have changed since the model's training cutoff." },
  { title: "Deep Research", ico: "search", color: "#4f46e5", description: "Multi-step documented research across web sources, files, and connected apps.", when: "You need a report with sources, not a quick answer." },
  { title: "Projects", ico: "folderOpen", color: "#059669", description: "Persistent workspace with shared files, custom instructions, and conversation memory.", when: "Any work you will revisit: courses, clients, startups." },
  { title: "Memory", ico: "database", color: "#d97706", description: "Stores durable preferences and recurring context across conversations.", when: "Preferences and patterns, not exact document storage." },
  { title: "Custom Instructions", ico: "settingsGear", color: "#57534e", description: "Always-on behavior rules for tone, formatting, and response structure.", when: "You want every chat to follow your rules by default." },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "A visible drafting surface for writing and code with targeted inline edits.", when: "Iterative editing of long-form text or code." },
  { title: "Tasks", ico: "clock", color: "#7c3aed", description: "Schedule outputs that execute later and notify you.", when: "Reminders, daily briefs, recurring summaries." },
  { title: "Apps (Connectors)", ico: "wrench", color: "#0d9488", description: "Connect external tools so ChatGPT can read and act on your data.", when: "Best context lives outside chat." },
  { title: "Agent", ico: "workflow", color: "#16a34a", description: "Autonomous execution across browsers, files, code, and connected apps.", when: "Multi-step tasks across sites and actions." },
  { title: "Custom GPTs", ico: "bot", color: "#44403c", description: "Reusable assistants with stable instructions and knowledge files.", when: "A workflow repeats often enough to formalize." },
  { title: "Voice", ico: "mic", color: "#e11d48", description: "Spoken interaction for low-friction thinking and exploration.", when: "Think out loud or multitask." },
  { title: "Images", ico: "imagePlus", color: "#c026d3", description: "Upload for analysis, generate from descriptions, and edit inline.", when: "Visual understanding, creation, or refinement." },
  { title: "Files & Data", ico: "fileText", color: "#0891b2", description: "Upload PDFs, spreadsheets, documents for analysis with code execution.", when: "Charts, summaries, calculations." },
  { title: "Models", ico: "brain", color: "#65a30d", description: "Choose speed-optimized, balanced, or reasoning-heavy modes.", when: "Match power to task complexity." },
];

const ADDITIONAL_FEATURES = [
  { title: "Study Mode", ico: "school", color: "#059669", description: "Guided learning with questions and comprehension checks." },
  { title: "Record", ico: "headphones", color: "#0284c7", description: "Capture spoken meetings, then produce summaries." },
  { title: "Group Chats", ico: "users", color: "#7c3aed", description: "Invite others into a conversation for shared planning." },
  { title: "Shared Links", ico: "link2", color: "#57534e", description: "Share a conversation via URL." },
  { title: "Image Editing", ico: "camera", color: "#c026d3", description: "Select and refine regions of generated images." },
  { title: "Interactive Tables", ico: "table2", color: "#0891b2", description: "Inspect uploaded data visually before analysis." },
  { title: "Skills", ico: "share2", color: "#0d9488", description: "Reusable workflows for consistent repeated jobs." },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "Async research that brings back visual summaries." },
];

const TOOL_CHOOSER = [
  { goal: "Quick answer or draft", tool: "Normal Chat", ico: "messageSquare", reason: "Lowest friction." },
  { goal: "Current information", tool: "Search", ico: "globe", reason: "Anything that may have changed." },
  { goal: "Ongoing work with files", tool: "Project", ico: "folderOpen", reason: "Preserves context across sessions." },
  { goal: "Edit a long document", tool: "Canvas", ico: "panelsTopLeft", reason: "Better for surgical revision." },
  { goal: "Multi-source report", tool: "Deep Research", ico: "search", reason: "Multi-step synthesis with citations." },
  { goal: "Complex online task", tool: "Agent", ico: "workflow", reason: "Crosses multiple sites and actions." },
  { goal: "Recurring output", tool: "Tasks", ico: "clock", reason: "Runs async, notifies you." },
  { goal: "Same workflow often", tool: "GPT or Skill", ico: "bot", reason: "Turn patterns into systems." },
];

const PROMPT_BLOCKS = [
  { label: "Goal", example: "Write a one-page project brief for an investor meeting.", color: "#10a37f" },
  { label: "Context", example: "The startup is pre-revenue, Series A, climate tech.", color: "#0284c7" },
  { label: "Constraints", example: "Under 400 words. No jargon. No bullet points.", color: "#7c3aed" },
  { label: "Format", example: "Structured as: Problem, Solution, Traction, Ask.", color: "#d97706" },
  { label: "Quality", example: "Write at McKinsey associate level, not a template.", color: "#e11d48" },
  { label: "Verify", example: "Flag any claim that needs a source.", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"Start with the right mental model", ico:"brain", color:"#65a30d",
    summary:"Treat ChatGPT as a reasoning partner, not an oracle. Its first response is a useful draft, not final truth. Treat every output as provisional until inspected.",
    whyItMatters:"Most disappointment stems from mismatched expectations. Expect a skilled first draft, not certainty.",
    beginnerMoves:["Assume the first answer is a draft. Read critically.","Ask what assumptions were made.","Use ChatGPT to accelerate judgment, not replace it."],
    advancedMoves:["Ask for the strongest counter-argument.","Separate exploration, recommendation, and risk review into passes.","Use it as a second opinion on consequential decisions."],
    commonMistakes:["Trusting numerical claims without verification.","Assuming silence means confidence.","Copying outputs verbatim."],
    promptExamples:[{prompt:"What assumptions did you make?",why:"Surfaces hidden reasoning."},{prompt:"What would a skeptical expert challenge?",why:"Adversarial self-review."},{prompt:"Strongest argument against your recommendation.",why:"Prevents confirmation bias."},{prompt:"Rate confidence in each claim 1-5.",why:"Separates facts from speculation."}],
    beforeAfter:{before:"Write me a business plan for a coffee shop.",after:"Draft a one-page plan for a specialty coffee shop in downtown Boston. Target: grad students and remote workers. Flag anything estimated rather than sourced.",improvement:"Adds context, audience, location, and a verification rule."},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"Learn the workspace before obsessing over prompts", ico:"laptop", color:"#059669",
    summary:"Modern ChatGPT is a layered workspace. Different jobs belong in different layers. A decent prompt in the correct layer outperforms a clever prompt in the wrong one.",
    whyItMatters:"Choosing the right workspace is the highest-leverage decision before typing a word.",
    beginnerMoves:["Normal chat for quick one-offs.","Project for anything you will revisit.","Temporary Chat for a blank slate."],
    advancedMoves:["One project per course, client, or initiative.","Projects as long-term knowledge hubs.","Canvas for iterative editing; chat for strategy."],
    commonMistakes:["New chat every time instead of returning to a project.","Chat for long documents instead of canvas.","Ignoring tasks and agent entirely."],
    promptExamples:[{prompt:"Should this be a chat, project, or GPT?",why:"Model picks the workspace."},{prompt:"Ideal project structure for my semester.",why:"Plans architecture first."},{prompt:"What files and instructions should I add?",why:"Optimizes project context."}],
    beforeAfter:{before:"I keep starting new chats and losing context.",after:"Create a Project. Upload references. Set instructions. Return to the same project.",improvement:"Ephemeral chats become a persistent workspace."},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"Prompting: clarity beats cleverness", ico:"penTool", color:"#0284c7",
    summary:"Good prompts are operating briefs. Fancy wording is optional; clear constraints are not. The model cannot see the standards in your head unless you write them down.",
    whyItMatters:"Vague prompts produce generic outputs. Most frustration traces to under-specified inputs.",
    beginnerMoves:["Name audience and use case explicitly.","State what success looks like.","Specify format, tone, length, and what to avoid."],
    advancedMoves:["Outline first, approve, then full draft.","Separate facts from interpretation.","Provide a rubric for self-grading."],
    commonMistakes:["Three-word prompts expecting tailored results.","Too many constraints at once.","'Can you...?' instead of direct instructions."],
    promptExamples:[{prompt:"Goal: ___. Context: ___. Constraints: ___. Produce: ___.",why:"Universal skeleton."},{prompt:"Outline first. Do not draft yet.",why:"Prevents wrong-structure rewrites."},{prompt:"Before writing, tell me what you need to know.",why:"Model asks clarifying questions."},{prompt:"Write as [role] explaining to [audience].",why:"Anchors tone and depth."}],
    beforeAfter:{before:"Write a cover letter.",after:"Cover letter for Strategy Analyst at McKinsey. Grad student, International Management, SOP and CRM experience. Confident, not arrogant. 350 words. No 'I am passionate about.'",improvement:"Role, background, tone, length, negative constraint."},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"Revision workflows beat one-shot perfection", ico:"refreshCcw", color:"#7c3aed",
    summary:"Strong use is iterative: frame, draft, critique, revise, package. Most users restart when they should refine.",
    whyItMatters:"One-shot caps quality at the first try. Revision consistently produces better results.",
    beginnerMoves:["After the draft: 'What is weak or missing?'","Revise with a narrower target.","Do not restart unless the direction is fundamentally wrong."],
    advancedMoves:["Fixed passes: structure, accuracy, tone, compression, packaging.","Self-critique before rewrite.","Specify compression ratios."],
    commonMistakes:["Manual rewriting instead of model self-diagnosis.","Vague feedback like 'make it better.'","Too many unfocused passes."],
    promptExamples:[{prompt:"Why did your answer not meet the goal?",why:"Self-diagnosis before revision."},{prompt:"Revise for sharper logic. Keep structure.",why:"Constrains scope."},{prompt:"Compress by 35% without losing essentials.",why:"Forces prioritization."},{prompt:"Grade against these criteria. Where below 4/5?",why:"Structured self-evaluation."}],
    beforeAfter:{before:"That's not right. Try again.",after:"Section 2 argument is circular. Rewrite with a data point from the uploaded report. Keep the rest.",improvement:"What is wrong, what to fix, what to preserve."},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"Writing, rewriting, and transformation", ico:"fileText", color:"#57534e",
    summary:"ChatGPT excels at transformation: rewriting for different audiences, changing tone, summarizing, reorganizing. Often better at improving existing text than drafting from nothing.",
    whyItMatters:"Most professional writing is transformation. This is where AI has the highest return.",
    beginnerMoves:["Paste original. State what stays and what changes.","Specify audience, channel, tone.","Multiple versions when tone is uncertain."],
    advancedMoves:["Contrastive versions: formal, concise, persuasive.","Sentence-level diagnosis.","Style transfer with preserved facts."],
    commonMistakes:["Drafting from scratch when notes exist.","Accepting first tone without alternatives.","Not specifying what to preserve."],
    promptExamples:[{prompt:"Rewrite for professor email: respectful, direct, no fluff.",why:"Precise transformation."},{prompt:"Three versions: formal, concise, persuasive.",why:"Contrastive selection."},{prompt:"Which sentences feel generic and why?",why:"Line-level diagnosis."},{prompt:"Keep facts and structure. Only change tone.",why:"Scoped transformation."}],
    beforeAfter:{before:"Make this email better.",after:"Rewrite for program director. Respectful, direct. Remove jargon. Under 150 words. Keep action items.",improvement:"Audience, tone, anti-patterns, length, preservation."},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"Files, PDFs, spreadsheets, and data", ico:"table2", color:"#0891b2",
    summary:"ChatGPT inspects files, summarizes documents, executes code on data, produces charts. Key: describe first, analyze second, conclude third.",
    whyItMatters:"Inspecting data before interpreting it catches the most common errors.",
    beginnerMoves:["Ask what the file contains before what it means.","Request a field audit first.","For PDFs: separate structure, argument, evidence."],
    advancedMoves:["Require an audit trail of assumptions.","Restate extracted tables before concluding.","Code execution for large datasets."],
    commonMistakes:["Immediately asking for 'key insights.'","Trusting chart labels without verifying.","Assuming perfect PDF parsing."],
    promptExamples:[{prompt:"Describe: fields, date range, missing values, analysis options.",why:"Audit before analysis."},{prompt:"Extract core argument before critiquing.",why:"Comprehension before judgment."},{prompt:"List every assumption used for this chart.",why:"Audit trail."},{prompt:"Write Python to clean this, run it, show result.",why:"Reproducible analysis."}],
    beforeAfter:{before:"Key insights from this spreadsheet?",after:"Audit: columns, types, date range, missing values. Propose three analyses ranked by usefulness. Do not run until I approve.",improvement:"Inspection, proposals, approval gate."},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"Search, deep research, and citations", ico:"search", color:"#4f46e5",
    summary:"Search for current answers with sources. Deep Research for multi-step reports. Anything current, regulated, or fast-changing should never rely on static memory.",
    whyItMatters:"Without search, ChatGPT answers from a frozen snapshot.",
    beginnerMoves:["Search for anything that may have changed.","Verify cited sources support specific claims.","Prefer primary sources for high stakes."],
    advancedMoves:["'Separate confirmed facts from your inference.'","Specify source types, region, date horizon.","Deep Research with defined scope."],
    commonMistakes:["Trusting model knowledge for current events.","Accepting 'sourced' claims without clicking through.","Deep Research for quick factual questions."],
    promptExamples:[{prompt:"Search. Primary sources only.",why:"Live retrieval with quality constraints."},{prompt:"Separate facts from inference. Label each.",why:"Transparent epistemic status."},{prompt:"What could become outdated in six months?",why:"Time-sensitivity flagging."},{prompt:"Deep Research: [topic]. Scope: [region, dates].",why:"Defined job brief."}],
    beforeAfter:{before:"Latest on AI regulation?",after:"Search: AI regulation, EU and US, past 30 days. Primary sources. Separate enacted from proposed.",improvement:"Scope, time range, quality, categorization."},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"Voice, images, and multimodal workflows", ico:"imagePlus", color:"#c026d3",
    summary:"Voice, image understanding, generation, and editing are standard. Specificity is key: vague visual requests produce generic results.",
    whyItMatters:"Multimodal turns ChatGPT into visual analysis tool, image studio, and hands-free brainstorming partner.",
    beginnerMoves:["Tell exactly what to do with an uploaded image.","Voice when speed matters more than polish.","Image gen: specify subject, framing, mood, style."],
    advancedMoves:["Chain modes: analyze, explain, then create notes.","Image critique for design review.","Scoped editing: select region, describe change."],
    commonMistakes:["Uploading images with no instructions.","Expecting photorealism from vague descriptions.","Forgetting voice carries the same context as text."],
    promptExamples:[{prompt:"Extract menu items, organize by category.",why:"Specific extraction."},{prompt:"Explain this chart to a non-technical exec in 120 words.",why:"Analysis with constraints."},{prompt:"Generate: vertical 9:16, cinematic, golden-hour.",why:"Photography-style spec."},{prompt:"Replace background with white studio. Keep subject.",why:"Scoped editing."}],
    beforeAfter:{before:"Make me a cool image.",after:"16:9: modern Tokyo coffee shop at dusk. Architectural photography, shallow depth of field. Warm. Wooden counter, espresso machine, city lights. No people.",improvement:"Ratio, subject, style, mood, elements, exclusions."},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"Study, record, groups, links, and skills", ico:"layoutGrid", color:"#0d9488",
    summary:"Features for learning, capturing spoken content, collaborating, sharing, and formalizing workflows.",
    whyItMatters:"Learning differs from getting answers. Collaboration differs from solo prompting.",
    beginnerMoves:["Study Mode to learn, not just get answers.","Record for meetings and lectures.","Shared Links and Group Chats for clean collaboration."],
    advancedMoves:["Recorded summaries as project source files.","Skills for repeated jobs.","Group Chats + Projects for shared context."],
    commonMistakes:["Normal chat for studying defeats learning.","Forgetting Record exists.","Screenshots instead of Shared Links."],
    promptExamples:[{prompt:"Quiz me instead of telling answers.",why:"Pedagogical approach."},{prompt:"Recording to action items and follow-up draft.",why:"Multi-output transformation."},{prompt:"Convert this workflow into a Skill.",why:"Formalizes a process."}],
    beforeAfter:{before:"Explain photosynthesis.",after:"Studying for biology exam. Do not explain. Ask questions to check understanding, basic to advanced. Correct with brief explanations.",improvement:"Answer-delivery becomes guided learning."},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"Memory, instructions, personality, temp chat", ico:"database", color:"#d97706",
    summary:"Memory stores context. Instructions set rules. Personality adjusts style. Temporary Chat is a clean room. Not interchangeable.",
    whyItMatters:"Misconfigured personalization degrades results more than it helps.",
    beginnerMoves:["Memory: broad, stable preferences.","Instructions: global writing rules.","Temporary Chat: zero carryover."],
    advancedMoves:["Personality is texture, not a replacement for instructions.","Project-specific instructions over global settings.","Periodic memory audits."],
    commonMistakes:["Everything in memory instead of Instructions.","Stale memory accumulation.","Personality to change capabilities, not style."],
    promptExamples:[{prompt:"What do you remember about me?",why:"Audits memory."},{prompt:"Forget the preference about formal tone.",why:"Targeted cleanup."},{prompt:"Blank-slate. No stored preferences.",why:"Clean-room mode."}],
    beforeAfter:{before:"Preferences in memory but inconsistent results.",after:"Behavior rules in Instructions. Facts in Memory. Domain rules in project instructions.",improvement:"Correct layer separation."},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"Projects as your operating system", ico:"folderOpen", color:"#16a34a",
    summary:"Projects make ChatGPT a context-aware workbench. A well-configured project outperforms any single-chat interaction.",
    whyItMatters:"For multi-session work, projects are the highest-leverage organizational tool.",
    beginnerMoves:["One project per workstream. Name clearly.","Upload only relevant files.","Write project instructions."],
    advancedMoves:["Add conversation summaries as source files.","Weekly work in one project, not fresh chats.","Meta-project for personal productivity."],
    commonMistakes:["Too many narrow projects.","Uploading everything: bloated context.","No project instructions."],
    promptExamples:[{prompt:"Ideal project structure for my semester.",why:"Plans workspace first."},{prompt:"Draft a memo consistent with prior work.",why:"Leverages accumulated context."},{prompt:"Summarize key decisions from last five conversations.",why:"Living summary."}],
    beforeAfter:{before:"Files everywhere, losing track.",after:"One project per domain. References. Instructions. Return. Periodically summarize.",improvement:"Scattered conversations become structured."},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"When to build a GPT (and when not to)", ico:"bot", color:"#44403c",
    summary:"Useful when a workflow repeats, has stable instructions, and benefits from reuse. But most people build too early.",
    whyItMatters:"Premature GPT bakes in an immature workflow. Well-timed GPT turns a proven process into one-click tool.",
    beginnerMoves:["Save prompts first: prompt is the prototype.","Formalize after three repetitions.","Narrow purpose. One job."],
    advancedMoves:["Four layers: role, instructions, knowledge, tools.","Explicit failure rules.","Adversarial testing."],
    commonMistakes:["GPT for something done once.","Too broad: 'do everything.'","No knowledge files."],
    promptExamples:[{prompt:"Turn our workflow into a GPT blueprint.",why:"Derives from experience."},{prompt:"Instructions, input/output schema, failure rules.",why:"Complete specification."},{prompt:"Edge cases this GPT should handle?",why:"Resilience testing."}],
    beforeAfter:{before:"GPT for all my email.",after:"GPT for replying to professors. Respectful, direct. Under 150 words. Asks context first. Refuses without confirmation. Upload: style guide.",improvement:"Narrow scope, safety rules, references."},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"Canvas for writing and code revision", ico:"panelsTopLeft", color:"#334155",
    summary:"Visible working surface alongside chat. Better than linear conversation for document-like work requiring surgical edits.",
    whyItMatters:"Long artifacts suffer in chat. Canvas makes the document the center of gravity.",
    beginnerMoves:["Canvas for long artifacts.","One file per purpose.","Targeted edits, not vague rewrites."],
    advancedMoves:["Chat for strategy, canvas for execution.","Architecture first, narrow diffs second.","Version history for comparison."],
    commonMistakes:["Chat for long documents.","Full rewrites when a paragraph needs fixing.","Not using code canvas for debugging."],
    promptExamples:[{prompt:"Writing canvas. Rewrite only introduction.",why:"Scoped editing."},{prompt:"Find logic errors. Patch only those lines.",why:"Targeted code fix."},{prompt:"Move section 3 before 2, merge 4 and 5.",why:"Structural reorganization."}],
    beforeAfter:{before:"Rewrite my essay. [2000 words in chat]",after:"Open in canvas. Do not change yet. Annotate strong vs weak sections. Then I direct edits.",improvement:"Inspection before modification."},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"Tasks, apps, pulse, and agent", ico:"workflow", color:"#16a34a",
    summary:"Operational layer. Tasks run later. Apps bring data in. Pulse researches async. Agent does autonomous multi-step work.",
    whyItMatters:"Most users only do real-time Q&A. This layer turns ChatGPT into a system that works for you.",
    beginnerMoves:["Tasks: reminders, briefings, recurring summaries.","Apps: when info lives in Drive, Slack, email.","Agent: multi-step workflows (15+ min manual)."],
    advancedMoves:["Agent prompts as job briefs with stop points.","Pulse for proactive topic updates.","Tasks + Projects for weekly auto-summaries."],
    commonMistakes:["Not knowing Agent exists.","Vague agent instructions without stopping rules.","Tasks only for reminders."],
    promptExamples:[{prompt:"Daily task: 8 AM brief on [topic], top 3.",why:"Proactive briefing."},{prompt:"Connected + public sources for competitive analysis.",why:"Internal + external data."},{prompt:"Agent: workflow steps. Pause before submission.",why:"Autonomous with checkpoint."}],
    beforeAfter:{before:"Check five sites and compare pricing.",after:"Agent: visit five competitors, extract pricing, compile table. Pause if login needed. Flag outdated pricing.",improvement:"Delegated with scope and error handling."},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"Model choice and mode selection", ico:"compass", color:"#65a30d",
    summary:"Different modes trade speed, reasoning depth, and tool support. Match model power to task.",
    whyItMatters:"Always using the strongest mode wastes time. Never escalating misses depth.",
    beginnerMoves:["Auto for everyday work.","Escalate for complex logic or synthesis.","Strongest is not always best."],
    advancedMoves:["Fast for drafting, deep for critical review.","Watch tool limitations in reasoning modes.","Start light, escalate mid-conversation."],
    commonMistakes:["Most powerful mode for everything.","Blaming model instead of mode.","Not checking plan tier access."],
    promptExamples:[{prompt:"Quick answer first, deeper second pass.",why:"Speed then depth."},{prompt:"Complex logic. Extended thinking, step by step.",why:"Explicit deep reasoning."},{prompt:"Fast drafting or careful reasoning for this?",why:"Model helps pick mode."}],
    beforeAfter:{before:"Always use most advanced model.",after:"Auto for quick tasks. Reasoning for logic. Fast for brainstorming.",improvement:"Power matched to task type."},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"Privacy, data controls, and risk", ico:"shield", color:"#e11d48",
    summary:"More capability demands more boundaries. Sensitive data needs upload discipline. High-stakes outputs need human review.",
    whyItMatters:"Capability without boundaries leads to data exposure or over-reliance.",
    beginnerMoves:["Do not upload sensitive content casually.","Scrub identifiers before uploading.","Temporary Chat for cleanest privacy."],
    advancedMoves:["Traffic-light upload policy: red, yellow, green.","Expert review before high-stakes action.","Periodic data audit."],
    commonMistakes:["Full databases when a sample suffices.","Assuming Temporary Chat means nothing processed.","AI outputs as final decisions in regulated domains."],
    promptExamples:[{prompt:"Which parts need human expert verification?",why:"Flags limitations."},{prompt:"Help redact before full upload.",why:"Safe preparation."},{prompt:"What here is personally identifiable? Remove it.",why:"PII detection."}],
    beforeAfter:{before:"Full client list, analyze trends.",after:"Remove names, emails, phones. Anonymize companies. Then analyze revenue by segment.",improvement:"Redacts identifiers, preserves analytical value."},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   SVG SECTION VISUALS
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"Your goal",{bold:true})}{tx(276,39,"AI draft",{bold:true})}{tx(180,137,"Your judgment",{bold:true})}{tx(180,84,"inspect, decide, act",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","Normal Chat"],["54","38","252","24","Projects + Canvas"],["68","68","224","24","Memory + Instructions"],["82","98","196","24","GPTs + Study + Skills"],["96","128","168","24","Tasks + Apps + Agent"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"simple",{dim:true,size:8})}{tx(336,146,"powerful",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","Goal"],["126","8","Context"],["234","8","Rules"],["18","92","Format"],["126","92","Quality"],["234","92","Verify"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","Frame"],["100","Draft"],["170","Critique"],["240","Revise"],["310","Ship"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"each pass adds specificity",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"Source",{bold:true})}{tx(180,38,"Transform",{bold:true})}{tx(294,38,"Output",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. Inspect",{dim:true,size:9})}{tx(252,126,"2. Conclude",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"Primary",{bold:true})}{tx(242,69,"Secondary",{bold:true})}{tx(242,109,"Inference",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","Text"],["120","Image"],["204","Voice"],["288","Edit"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"chain modes together",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","Record"],["100","6","120","42","Study"],["100","78","120","42","Group"],["238","24","80","42","Share"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","Memory"],["100","10","120","40","Instructions"],["232","10","108","40","Personality"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"Consistent output",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"Chats",{bold:true})}{tx(166,76,"Files",{bold:true})}{tx(264,52,"Sources",{bold:true,size:9})}{tx(264,100,"Rules",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","Role"],["116","4","96","42","Knowledge"],["116","94","96","42","Tools"],["234","48","110","42","Rules"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"Outline",{bold:true,size:10})}{tx(190,22,"Draft",{bold:true,size:10})}{tx(290,22,"Edits",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","Goal"],["90","6","64","40","Browse"],["90","94","64","40","Files"],["174","6","64","40","Apps"],["174","94","64","40","Code"],["258","48","80","40","Done"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Auto"],["116","4","72","40","Fast"],["116","96","72","40","Deep"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"capability needs boundaries",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>When: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Before vs. After</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">Weak</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Strong</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Why this matters</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>Start here</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Advanced</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>Common mistakes</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Visual model</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Prompt examples</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { foundation: "Foundation", core: "Core Skills", power: "Power Features", expert: "Expert" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* HEADER */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> Practical reference</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>A Master Guide to ChatGPT</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>What each tool does, when to use it, and how to get measurably better results. Written for everyday users first, with deeper sections for those who want them.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> Verified {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 sections &middot; 60+ prompts</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>What ChatGPT does today</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","Answering","chat, search"],["150","4","120","38","Organizing","projects, memory"],["284","4","120","38","Making","canvas, images"],["16","120","120","38","Learning","study, record"],["150","120","120","38","Sharing","groups, links"],["284","120","120","38","Executing","tasks, agent"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>the full stack</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* SIX PRINCIPLES */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Six principles</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"Ask clearly",d:"Goal, context, constraints, format."},{ico:"layoutGrid",t:"Choose the right layer",d:"Chat, project, canvas, search, agent."},{ico:"shield",t:"Verify when it matters",d:"Search for current or high-stakes."},{ico:"refreshCcw",t:"Revise, do not restart",d:"Good results from a second pass."},{ico:"bot",t:"Systemize what works",d:"Project, GPT, task, or skill."},{ico:"eye",t:"Visuals to think faster",d:"Tables, diagrams, screenshots."}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* TOOL CHOOSER */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Decision table</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Which tool should you use?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Your goal</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Best tool</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>Why</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* PROMPT FORMULA */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Prompt pattern</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Six blocks that improve any prompt</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Feature stack</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>The core ChatGPT tools</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* ADDITIONAL */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Often overlooked</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Features most users miss</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* NAVIGATOR */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Expand</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Collapse</button>
          </div>
        </section>

        {/* GUIDE SECTIONS */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* SCOPE + TAKEAWAY */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Scope</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>What this covers</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>User-facing features, not enterprise admin.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Practical usage over product trivia.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Availability varies by plan and platform.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>Biggest upgrade</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>Stop asking "How do I prompt better?"</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>Start asking "Which ChatGPT layer fits this job?" That shift improves results more than prompt tricks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">Final takeaway</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">What mastery looks like</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>Choose the correct mode. Define the job clearly. Verify what matters. Revise intelligently. Turn successes into reusable systems. The best users are clear thinkers who happen to use AI.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">Keep re-checking</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["Capabilities","Pricing","Release Notes","Projects","Memory FAQ","Canvas","Tasks","Apps","Search","Deep Research","Study Mode","Record","Shared Links","Groups","Skills","Agent","Voice","Images FAQ"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
             <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            ChatGPT User Guide
             <br />
            © 2026 EugeneYip.com All Rights Reserved. 
             </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

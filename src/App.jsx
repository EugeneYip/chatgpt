import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  Search,
  Globe,
  FolderOpen,
  MemoryStick,
  Settings,
  Bot,
  PenTool,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Mic,
  Image as ImageIcon,
  FileText,
  Clock3,
  PanelsTopLeft,
  Workflow,
  Laptop,
  Wrench,
  Compass,
  ArrowRight,
  RefreshCcw,
  Link2,
  Users,
  Headphones,
  Table2,
  Camera,
  LayoutGrid,
  School,
  Share2,
  Lightbulb,
} from "lucide-react";

const verifiedAsOf = "March 12, 2026";

const coreFeatures = [
  {
    title: "Search",
    icon: Globe,
    accent: "sky",
    detail: "Use for current facts, prices, news, laws, schedules, and source-backed answers.",
    note: "Fresh information",
  },
  {
    title: "Deep Research",
    icon: Search,
    accent: "indigo",
    detail: "Use for multi-step, documented research across web sources, files, and enabled apps.",
    note: "Long-form synthesis",
  },
  {
    title: "Projects",
    icon: FolderOpen,
    accent: "emerald",
    detail: "Use for any ongoing course, client, startup, or personal workstream with files and memory.",
    note: "Workspace layer",
  },
  {
    title: "Memory",
    icon: MemoryStick,
    accent: "amber",
    detail: "Use for durable preferences and recurring context across chats, not for exact document storage.",
    note: "Personalization",
  },
  {
    title: "Custom Instructions",
    icon: Settings,
    accent: "stone",
    detail: "Use for always-on behavior rules such as tone, formatting, and response style.",
    note: "Behavior rules",
  },
  {
    title: "Canvas",
    icon: PanelsTopLeft,
    accent: "slate",
    detail: "Use when you need visible drafting, editing, restructuring, or code revision.",
    note: "Editing surface",
  },
  {
    title: "Tasks",
    icon: Clock3,
    accent: "violet",
    detail: "Use for one-time reminders and recurring outputs that should run later.",
    note: "Automation",
  },
  {
    title: "Apps",
    icon: Wrench,
    accent: "teal",
    detail: "Use when the best context lives in connected tools such as docs, email, or other services.",
    note: "Connected tools",
  },
  {
    title: "Agent",
    icon: Workflow,
    accent: "green",
    detail: "Use for complex online tasks that require many steps, files, websites, and actions.",
    note: "Execution layer",
  },
  {
    title: "GPTs",
    icon: Bot,
    accent: "neutral",
    detail: "Use for repeatable assistants with stable instructions, knowledge, and selected capabilities.",
    note: "Reusable assistants",
  },
  {
    title: "Voice",
    icon: Mic,
    accent: "rose",
    detail: "Use for low-friction thinking, conversational exploration, and spoken interaction.",
    note: "Spoken chat",
  },
  {
    title: "Images",
    icon: ImageIcon,
    accent: "fuchsia",
    detail: "Use for image understanding, image generation, and image editing in chat.",
    note: "Visual creation",
  },
  {
    title: "Files & Data",
    icon: FileText,
    accent: "cyan",
    detail: "Use for PDFs, documents, spreadsheets, charts, and structured analysis with code tools.",
    note: "Analysis layer",
  },
  {
    title: "Models",
    icon: Brain,
    accent: "lime",
    detail: "Use different model modes depending on whether you need speed, depth, or tool support.",
    note: "Speed vs depth",
  },
];

const additionalFeatures = [
  {
    title: "Study Mode",
    icon: School,
    accent: "emerald",
    detail: "Guided learning with questions, staged explanations, and checks for understanding.",
  },
  {
    title: "Record",
    icon: Headphones,
    accent: "sky",
    detail: "Capture spoken meetings or notes, then turn them into summaries and reusable canvases.",
  },
  {
    title: "Group Chats",
    icon: Users,
    accent: "violet",
    detail: "Bring other people into the same chat for shared planning and discussion.",
  },
  {
    title: "Shared Links",
    icon: Link2,
    accent: "stone",
    detail: "Share a conversation with a link instead of screenshots or copy-paste.",
  },
  {
    title: "Image Editing",
    icon: Camera,
    accent: "fuchsia",
    detail: "Select an area of a generated image and refine, replace, or remove parts naturally.",
  },
  {
    title: "Interactive Tables",
    icon: Table2,
    accent: "cyan",
    detail: "Inspect uploaded data in table form before asking for charts, summaries, or conclusions.",
  },
  {
    title: "Skills",
    icon: Share2,
    accent: "teal",
    detail: "Reusable workflows that help ChatGPT perform specific jobs more consistently.",
  },
  {
    title: "Pulse",
    icon: Sparkles,
    accent: "indigo",
    detail: "An asynchronous research experience that proactively brings back visual summaries.",
  },
];

const quickStartCards = [
  {
    title: "Ask clearly",
    icon: PenTool,
    subtitle: "State the goal, context, constraints, and desired format.",
  },
  {
    title: "Choose the right layer",
    icon: LayoutGrid,
    subtitle: "Use chat, project, canvas, search, or agent on purpose.",
  },
  {
    title: "Verify when it matters",
    icon: Shield,
    subtitle: "Use search and sources for anything current or high-stakes.",
  },
  {
    title: "Revise, do not restart",
    icon: RefreshCcw,
    subtitle: "Good results usually come from a second pass, not the first answer.",
  },
  {
    title: "Systemize what works",
    icon: Bot,
    subtitle: "Turn a successful workflow into a project, GPT, task, or skill.",
  },
  {
    title: "Use visuals to think faster",
    icon: ImageIcon,
    subtitle: "Tables, diagrams, screenshots, and charts reduce reading friction.",
  },
];

const toolChooserRows = [
  {
    goal: "I need a quick answer or draft",
    best: "Normal chat",
    why: "Fastest option for one-off work.",
  },
  {
    goal: "I need current information",
    best: "Search",
    why: "Best for anything that may have changed recently.",
  },
  {
    goal: "I am working on something ongoing",
    best: "Project",
    why: "Keeps related files, chats, and instructions together.",
  },
  {
    goal: "I need to edit a long document or code file",
    best: "Canvas",
    why: "Better than linear chat for iterative revision.",
  },
  {
    goal: "I need a multi-source report",
    best: "Deep Research",
    why: "Built for documented, multi-step synthesis.",
  },
  {
    goal: "I need ChatGPT to do a complex online task",
    best: "Agent",
    why: "Best for action-heavy workflows across sites and files.",
  },
  {
    goal: "I need recurring reminders or updates",
    best: "Tasks",
    why: "Runs later and notifies you when finished.",
  },
  {
    goal: "I repeat this same workflow a lot",
    best: "GPT or Skill",
    why: "Turn repetition into a reusable system.",
  },
];

const promptFormula = [
  "Goal",
  "Context",
  "Constraints",
  "Output format",
  "Quality bar",
  "Verification rule",
];

const guideSections = [
  {
    id: "mental-model",
    level: "Beginner",
    title: "Start with the right mental model",
    icon: Brain,
    accent: "lime",
    summary:
      "Treat ChatGPT as a reasoning and language partner, not as an infallible answer machine. Its first answer is often a useful draft, not the final truth.",
    whyItMatters:
      "Most disappointing results come from expecting certainty when the tool was operating on partial context or reasonable guesses.",
    beginnerMoves: [
      "Assume the first answer is provisional until you inspect it.",
      "Ask what assumptions were made before relying on the result.",
      "Use ChatGPT to accelerate judgment, not replace it.",
    ],
    advancedMoves: [
      "Ask for the strongest case against its own recommendation.",
      "Separate exploration, recommendation, and risk review into different passes.",
    ],
    promptExamples: [
      "What assumptions did you make in your last answer?",
      "What would a skeptical reviewer challenge here?",
      "Give me the strongest argument against your recommendation.",
    ],
    visual: "mental",
  },
  {
    id: "workspace",
    level: "Beginner",
    title: "Learn the workspace before you obsess over prompts",
    icon: Laptop,
    accent: "emerald",
    summary:
      "Modern ChatGPT is a layered workspace. Different jobs belong in chat, projects, search, canvas, deep research, tasks, apps, or agent.",
    whyItMatters:
      "A decent prompt in the right workspace usually beats a clever prompt in the wrong one.",
    beginnerMoves: [
      "Use normal chat for quick one-off requests.",
      "Use a project for any work you will revisit.",
      "Use temporary chat when you want a blank slate.",
    ],
    advancedMoves: [
      "Split your work by domain instead of mixing everything into one thread.",
      "Treat projects as long-term knowledge hubs, not just folders.",
    ],
    promptExamples: [
      "Help me decide whether this belongs in a normal chat, project, or GPT.",
      "List the best workspace setup for this workflow.",
    ],
    visual: "layers",
  },
  {
    id: "prompting",
    level: "Beginner",
    title: "Prompting fundamentals: clarity beats cleverness",
    icon: PenTool,
    accent: "sky",
    summary:
      "Good prompts are concrete operating briefs. Fancy wording is optional. Clear constraints are not.",
    whyItMatters:
      "ChatGPT cannot see the standards in your head unless you write them down.",
    beginnerMoves: [
      "Name the audience and the actual use case.",
      "State what success looks like.",
      "Specify format, tone, and what to avoid.",
    ],
    advancedMoves: [
      "Ask for the outline first, then approve it, then request the full answer.",
      "Separate facts from interpretation in research work.",
    ],
    promptExamples: [
      "My goal is ___. The context is ___. Constraints are ___. Produce ___.",
      "Show me the outline first. Do not draft the full answer yet.",
      "Before writing, tell me what you still need to know.",
    ],
    visual: "prompt",
  },
  {
    id: "revision",
    level: "Intermediate",
    title: "Use revision workflows instead of expecting one-shot perfection",
    icon: RefreshCcw,
    accent: "violet",
    summary:
      "Strong ChatGPT use is iterative. A practical pattern is frame, draft, critique, revise, and package.",
    whyItMatters:
      "Most users restart from scratch too often. Experts improve the existing answer instead.",
    beginnerMoves: [
      "After the first draft, ask what is weak or missing.",
      "Then ask for revision with a narrower target.",
      "Do not manually rewrite before extracting the model’s own diagnosis.",
    ],
    advancedMoves: [
      "Use fixed passes such as structure, factual accuracy, tone, compression, and final packaging.",
      "Ask the model to critique itself before you ask it to rewrite.",
    ],
    promptExamples: [
      "Tell me why your last answer did not fully meet the goal.",
      "Revise this for sharper business logic and tighter evidence.",
      "Compress this by 35 percent without losing anything essential.",
    ],
    visual: "workflow",
  },
  {
    id: "writing",
    level: "Intermediate",
    title: "Writing, rewriting, and transformation work",
    icon: FileText,
    accent: "stone",
    summary:
      "ChatGPT is especially strong at transformation work: rewriting, summarizing, changing tone, reorganizing, comparing versions, simplifying, and sharpening.",
    whyItMatters:
      "It is often better at improving existing text than inventing a perfect draft from nothing.",
    beginnerMoves: [
      "Paste the original text and state what must stay and what must change.",
      "Specify audience, channel, and tone.",
      "Ask for multiple versions when tone is uncertain.",
    ],
    advancedMoves: [
      "Use contrastive versions such as formal, concise, and persuasive.",
      "Ask for sentence-level diagnosis when writing feels generic.",
    ],
    promptExamples: [
      "Rewrite this for a professor email: respectful, direct, natural, no fluff.",
      "Give me three versions: formal, concise, and more persuasive.",
      "Tell me exactly which sentences feel generic and why.",
    ],
    visual: "writing",
  },
  {
    id: "files-data",
    level: "Intermediate",
    title: "Files, PDFs, spreadsheets, and data analysis",
    icon: FileText,
    accent: "cyan",
    summary:
      "ChatGPT can inspect uploaded files, summarize documents, and use code tools for tables, charts, and data analysis.",
    whyItMatters:
      "File work becomes much stronger when you ask ChatGPT to describe, inspect, and then conclude in separate passes.",
    beginnerMoves: [
      "Ask what the file contains before asking what it means.",
      "For datasets, request a field audit and analysis options first.",
      "For PDFs, separate structure, argument, evidence, and critique.",
    ],
    advancedMoves: [
      "Require a clear audit trail of assumptions and transformations.",
      "Ask the model to restate extracted tables cleanly before drawing conclusions.",
    ],
    promptExamples: [
      "Describe this dataset first: fields, date range, missing values, and likely analyses.",
      "Extract the core argument of this PDF before critiquing it.",
      "List every assumption you used to produce this chart.",
    ],
    visual: "data",
  },
  {
    id: "search-research",
    level: "Intermediate",
    title: "Search, deep research, and citation discipline",
    icon: Search,
    accent: "indigo",
    summary:
      "Use Search for current answers with sources. Use Deep Research for longer, multi-step reports across web, files, sites, and apps.",
    whyItMatters:
      "Anything current, regulated, local, controversial, or fast-changing should not rely on static memory alone.",
    beginnerMoves: [
      "Use search for anything that may have changed recently.",
      "Inspect whether a cited source actually supports the claim.",
      "Prefer primary sources when stakes are high.",
    ],
    advancedMoves: [
      "Force a split between confirmed facts and reasoned inference.",
      "Specify acceptable sources, region, and date horizon.",
    ],
    promptExamples: [
      "Search the web and answer with current primary sources only.",
      "Separate confirmed facts from your inference.",
      "What in this answer could become outdated quickly?",
    ],
    visual: "research",
  },
  {
    id: "multimodal",
    level: "Intermediate",
    title: "Voice, images, image editing, and multimodal workflows",
    icon: ImageIcon,
    accent: "fuchsia",
    summary:
      "ChatGPT is not text-only. Voice, image input, image creation, and image editing are now normal parts of the product.",
    whyItMatters:
      "Specific visual jobs get better results than vague requests like ‘thoughts?’ or ‘make this better.’",
    beginnerMoves: [
      "Tell ChatGPT exactly what you want done with an image.",
      "Use voice when speed matters more than polished phrasing.",
      "For image generation, specify subject, framing, mood, and style.",
    ],
    advancedMoves: [
      "Chain modes together: analyze an image, explain it, then turn it into notes or slides.",
      "Use image critique prompts for design review and visual QA.",
    ],
    promptExamples: [
      "Extract all menu items from this photo and translate them into English.",
      "Explain this chart to a non-technical executive in 120 words.",
      "Generate an image with a cinematic vertical composition and minimal clutter.",
    ],
    visual: "multimodal",
  },
  {
    id: "study-record-collab",
    level: "Advanced",
    title: "Study mode, record, group chats, shared links, and skills",
    icon: LayoutGrid,
    accent: "teal",
    summary:
      "Some of the most useful features are not just about asking or generating. They help you learn, capture, collaborate, share, and reuse workflows.",
    whyItMatters:
      "These features change how ChatGPT fits into classes, teamwork, and repeated real-life workflows.",
    beginnerMoves: [
      "Use study mode when learning matters more than getting the answer immediately.",
      "Use record for meetings, brainstorms, or voice notes.",
      "Use shared links and group chats to collaborate more cleanly.",
    ],
    advancedMoves: [
      "Turn recorded summaries into project sources.",
      "Use skills to formalize repeated jobs without rebuilding the workflow each time.",
    ],
    promptExamples: [
      "Quiz me instead of telling me the answer directly.",
      "Turn this meeting capture into action items and a follow-up draft.",
      "Convert this repeated workflow into a reusable skill.",
    ],
    visual: "collab",
  },
  {
    id: "personalization",
    level: "Advanced",
    title: "Memory, custom instructions, personality, and temporary chat",
    icon: MemoryStick,
    accent: "amber",
    summary:
      "These controls are related but not interchangeable. Memory stores recurring context. Custom instructions set rules. Personality changes style. Temporary chat creates a blank slate.",
    whyItMatters:
      "Confusing these layers creates inconsistent or over-personalized results.",
    beginnerMoves: [
      "Keep memory for broad preferences only.",
      "Put global writing rules in custom instructions.",
      "Use temporary chat for clean-room or sensitive tasks.",
    ],
    advancedMoves: [
      "Treat personality as texture, not as a substitute for instructions.",
      "Use project-specific rules instead of stuffing every rule into global settings.",
    ],
    promptExamples: [
      "What do you currently remember about me?",
      "Forget this preference.",
      "Treat this chat as a blank-slate consultation.",
    ],
    visual: "memory",
  },
  {
    id: "projects",
    level: "Advanced",
    title: "Projects as your real operating system",
    icon: FolderOpen,
    accent: "green",
    summary:
      "Projects are where ChatGPT starts feeling less like a chatbot and more like a context-aware workbench.",
    whyItMatters:
      "For serious work, organization usually matters more than clever prompting.",
    beginnerMoves: [
      "Create one project per major workstream.",
      "Name it clearly and upload only relevant context.",
      "Keep each project narrow in purpose.",
    ],
    advancedMoves: [
      "Use projects as living knowledge bases with saved sources and connected context.",
      "Keep repeated weekly work inside one project instead of starting fresh chats.",
    ],
    promptExamples: [
      "Design the ideal project structure for this semester-long workflow.",
      "Given everything in this project, draft a memo that stays consistent with prior work.",
    ],
    visual: "project",
  },
  {
    id: "gpts",
    level: "Advanced",
    title: "When to build a GPT and when not to",
    icon: Bot,
    accent: "neutral",
    summary:
      "A custom GPT is useful when a workflow repeats often, has stable instructions, and deserves a reusable interface.",
    whyItMatters:
      "Many people build GPTs too early, before the workflow is stable enough to formalize.",
    beginnerMoves: [
      "Start by saving good prompts before building a GPT.",
      "Only formalize a GPT after the pattern clearly repeats.",
      "Keep the GPT’s purpose narrow.",
    ],
    advancedMoves: [
      "Separate role, instructions, knowledge, and tool selection intentionally.",
      "Write failure rules so the GPT stays inside its job.",
    ],
    promptExamples: [
      "Turn our last successful workflow into a reusable GPT blueprint.",
      "Write the instructions, input schema, output schema, and failure rules for this GPT.",
    ],
    visual: "gpt",
  },
  {
    id: "canvas",
    level: "Advanced",
    title: "Canvas for writing and coding revision",
    icon: PanelsTopLeft,
    accent: "slate",
    summary:
      "Canvas is better than plain chat when the work is inherently document-like or file-like.",
    whyItMatters:
      "Long artifacts benefit from a visible working surface, not only a sequence of messages.",
    beginnerMoves: [
      "Use canvas when you need to see and refine a long artifact.",
      "Keep one file focused on one purpose.",
      "Ask for targeted edits rather than vague rewrites.",
    ],
    advancedMoves: [
      "Use chat for strategy and canvas for execution.",
      "For code, request architecture changes first and narrower diffs second.",
    ],
    promptExamples: [
      "Open this as a coding canvas and refactor the structure.",
      "Rewrite only the introduction and leave the rest untouched.",
      "Find logic errors in this component and patch only those parts.",
    ],
    visual: "canvas",
  },
  {
    id: "tasks-apps-agent",
    level: "Expert",
    title: "Tasks, apps, pulse, and agent: from answering to doing",
    icon: Workflow,
    accent: "green",
    summary:
      "This is the operational layer. Tasks run later. Apps bring in outside context. Pulse researches asynchronously. Agent performs multi-step online work.",
    whyItMatters:
      "The highest leverage now comes from deciding when ChatGPT should answer, remember, or execute.",
    beginnerMoves: [
      "Use tasks for reminders and recurring updates.",
      "Use apps when the best information lives outside chat.",
      "Use agent for multi-step online workflows.",
    ],
    advancedMoves: [
      "Write agent prompts like job briefs with sources, constraints, and stop points.",
      "Use pulse and tasks when you want work to come back to you proactively.",
    ],
    promptExamples: [
      "Set a recurring daily task that briefs me on this topic.",
      "Use connected sources and public sources to build a documented report.",
      "Use agent to complete this multi-step workflow and pause before submission.",
    ],
    visual: "agent",
  },
  {
    id: "model-choice",
    level: "Expert",
    title: "Model choice and plan-sensitive behavior",
    icon: Compass,
    accent: "lime",
    summary:
      "Different model modes optimize for different jobs. Some are better for speed. Some are better for deeper reasoning. Some tool support varies by mode.",
    whyItMatters:
      "Users often blame the model when the real issue was choosing the wrong mode for the task.",
    beginnerMoves: [
      "Use auto first for everyday work.",
      "Escalate only when the task truly needs more reasoning depth.",
      "Do not assume the most advanced mode is always the best choice.",
    ],
    advancedMoves: [
      "Use faster modes for drafting and transformation, deeper modes for hard synthesis.",
      "Watch for tool limitations in reasoning-heavy premium modes.",
    ],
    promptExamples: [
      "Would this task benefit more from faster drafting or deeper reasoning?",
      "Give me the quick answer first, then a deeper second pass.",
    ],
    visual: "models",
  },
  {
    id: "privacy-risk",
    level: "Expert",
    title: "Privacy, data controls, and risk discipline",
    icon: Shield,
    accent: "rose",
    summary:
      "Strong users know not only how to use ChatGPT, but when not to. Sensitive work still requires upload discipline and human review.",
    whyItMatters:
      "The more capable the tool becomes, the more important boundaries become.",
    beginnerMoves: [
      "Do not upload sensitive content casually.",
      "Scrub identifiers when possible.",
      "Use temporary chat when you want the cleanest privacy posture available in normal product use.",
    ],
    advancedMoves: [
      "Create your own red, yellow, and green upload policy.",
      "Require expert review before acting on high-stakes outputs.",
    ],
    promptExamples: [
      "Identify what parts of this task are high-risk and should be verified by a human expert.",
      "Help me redact this document before upload.",
    ],
    visual: "privacy",
  },
];

function getAccentClasses(accent) {
  const map = {
    emerald: {
      icon: "bg-emerald-500 text-white",
      soft: "bg-emerald-50 border-emerald-200 text-emerald-950",
      ring: "border-emerald-200",
      badge: "bg-emerald-600 text-white",
      tint: "bg-emerald-50",
      text: "text-emerald-800",
    },
    sky: {
      icon: "bg-sky-500 text-white",
      soft: "bg-sky-50 border-sky-200 text-sky-950",
      ring: "border-sky-200",
      badge: "bg-sky-600 text-white",
      tint: "bg-sky-50",
      text: "text-sky-800",
    },
    indigo: {
      icon: "bg-indigo-500 text-white",
      soft: "bg-indigo-50 border-indigo-200 text-indigo-950",
      ring: "border-indigo-200",
      badge: "bg-indigo-600 text-white",
      tint: "bg-indigo-50",
      text: "text-indigo-800",
    },
    violet: {
      icon: "bg-violet-500 text-white",
      soft: "bg-violet-50 border-violet-200 text-violet-950",
      ring: "border-violet-200",
      badge: "bg-violet-600 text-white",
      tint: "bg-violet-50",
      text: "text-violet-800",
    },
    teal: {
      icon: "bg-teal-500 text-white",
      soft: "bg-teal-50 border-teal-200 text-teal-950",
      ring: "border-teal-200",
      badge: "bg-teal-600 text-white",
      tint: "bg-teal-50",
      text: "text-teal-800",
    },
    green: {
      icon: "bg-[#10a37f] text-white",
      soft: "bg-emerald-50 border-emerald-200 text-emerald-950",
      ring: "border-emerald-200",
      badge: "bg-[#10a37f] text-white",
      tint: "bg-emerald-50",
      text: "text-emerald-800",
    },
    fuchsia: {
      icon: "bg-fuchsia-500 text-white",
      soft: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-950",
      ring: "border-fuchsia-200",
      badge: "bg-fuchsia-600 text-white",
      tint: "bg-fuchsia-50",
      text: "text-fuchsia-800",
    },
    cyan: {
      icon: "bg-cyan-500 text-white",
      soft: "bg-cyan-50 border-cyan-200 text-cyan-950",
      ring: "border-cyan-200",
      badge: "bg-cyan-600 text-white",
      tint: "bg-cyan-50",
      text: "text-cyan-800",
    },
    amber: {
      icon: "bg-amber-500 text-white",
      soft: "bg-amber-50 border-amber-200 text-amber-950",
      ring: "border-amber-200",
      badge: "bg-amber-600 text-white",
      tint: "bg-amber-50",
      text: "text-amber-800",
    },
    lime: {
      icon: "bg-lime-500 text-white",
      soft: "bg-lime-50 border-lime-200 text-lime-950",
      ring: "border-lime-200",
      badge: "bg-lime-600 text-white",
      tint: "bg-lime-50",
      text: "text-lime-800",
    },
    rose: {
      icon: "bg-rose-500 text-white",
      soft: "bg-rose-50 border-rose-200 text-rose-950",
      ring: "border-rose-200",
      badge: "bg-rose-600 text-white",
      tint: "bg-rose-50",
      text: "text-rose-800",
    },
    slate: {
      icon: "bg-slate-700 text-white",
      soft: "bg-slate-50 border-slate-200 text-slate-950",
      ring: "border-slate-200",
      badge: "bg-slate-800 text-white",
      tint: "bg-slate-50",
      text: "text-slate-800",
    },
    neutral: {
      icon: "bg-stone-800 text-white",
      soft: "bg-stone-50 border-stone-200 text-stone-950",
      ring: "border-stone-200",
      badge: "bg-stone-900 text-white",
      tint: "bg-stone-50",
      text: "text-stone-800",
    },
    stone: {
      icon: "bg-stone-700 text-white",
      soft: "bg-stone-50 border-stone-200 text-stone-950",
      ring: "border-stone-200",
      badge: "bg-stone-800 text-white",
      tint: "bg-stone-50",
      text: "text-stone-800",
    },
  };

  return map[accent] || map.stone;
}

function SectionVisual({ type, accent = "stone" }) {
  const box = "fill-none stroke-current";
  const accentText = `${getAccentClasses(accent).text}`;

  if (type === "mental") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="20" y="22" width="140" height="58" rx="16" className={box} strokeWidth="2.5" />
        <rect x="200" y="22" width="140" height="58" rx="16" className={box} strokeWidth="2.5" />
        <rect x="110" y="138" width="140" height="58" rx="16" className={box} strokeWidth="2.5" />
        <path d="M160 50h40" className={box} strokeWidth="2.5" />
        <path d="M90 80l55 58" className={box} strokeWidth="2.5" />
        <path d="M270 80l-55 58" className={box} strokeWidth="2.5" />
        <text x="90" y="57" textAnchor="middle" className="fill-current text-[15px] font-semibold">Your goal</text>
        <text x="270" y="57" textAnchor="middle" className="fill-current text-[15px] font-semibold">AI output</text>
        <text x="180" y="171" textAnchor="middle" className="fill-current text-[15px] font-semibold">Your judgment</text>
      </svg>
    );
  }

  if (type === "layers") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        {[
          [36, 24, 288, 28, "Normal chat"],
          [50, 58, 260, 28, "Project"],
          [64, 92, 232, 28, "Memory + Instructions"],
          [78, 126, 204, 28, "GPT + Canvas + Study"],
          [92, 160, 176, 28, "Tasks + Apps + Agent"],
        ].map(([x, y, w, h, label]) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={h} rx="14" className={box} strokeWidth="2.5" />
            <text x={180} y={y + 18} textAnchor="middle" className="fill-current text-[12px] font-semibold">{label}</text>
          </g>
        ))}
      </svg>
    );
  }

  if (type === "prompt") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        {[
          [20, 24, "Goal"],
          [126, 24, "Context"],
          [232, 24, "Rules"],
          [20, 100, "Format"],
          [126, 100, "Quality"],
          [232, 100, "Verify"],
        ].map(([x, y, label]) => (
          <g key={label}>
            <rect x={x} y={y} width="108" height="52" rx="14" className={box} strokeWidth="2.5" />
            <text x={Number(x) + 54} y={Number(y) + 30} textAnchor="middle" className="fill-current text-[13px] font-semibold">{label}</text>
          </g>
        ))}
      </svg>
    );
  }

  if (type === "workflow") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        {[
          [28, "Frame"],
          [94, "Draft"],
          [160, "Critique"],
          [226, "Revise"],
          [292, "Package"],
        ].map(([x, label], i) => (
          <g key={label}>
            <circle cx={x} cy="100" r="24" className={box} strokeWidth="2.5" />
            <text x={x} y="105" textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
            {i < 4 && <path d={`M${Number(x) + 24} 100h18`} className={box} strokeWidth="2.5" />}
          </g>
        ))}
      </svg>
    );
  }

  if (type === "writing") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="24" y="28" width="104" height="144" rx="16" className={box} strokeWidth="2.5" />
        <rect x="144" y="28" width="92" height="144" rx="16" className={box} strokeWidth="2.5" />
        <rect x="252" y="28" width="84" height="144" rx="16" className={box} strokeWidth="2.5" />
        <text x="76" y="52" textAnchor="middle" className="fill-current text-[13px] font-semibold">Source</text>
        <text x="190" y="52" textAnchor="middle" className="fill-current text-[13px] font-semibold">Transform</text>
        <text x="294" y="52" textAnchor="middle" className="fill-current text-[13px] font-semibold">Target</text>
        <path d="M128 100h16" className={box} strokeWidth="2.5" />
        <path d="M236 100h16" className={box} strokeWidth="2.5" />
      </svg>
    );
  }

  if (type === "data") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="26" y="28" width="130" height="140" rx="16" className={box} strokeWidth="2.5" />
        <path d="M26 58h130M58 28v140M90 28v140M122 28v140M26 88h130M26 118h130M26 148h130" className={box} strokeWidth="1.8" />
        <rect x="202" y="38" width="24" height="100" rx="8" className={box} strokeWidth="2.5" />
        <rect x="238" y="70" width="24" height="68" rx="8" className={box} strokeWidth="2.5" />
        <rect x="274" y="54" width="24" height="84" rx="8" className={box} strokeWidth="2.5" />
        <path d="M196 152h120" className={box} strokeWidth="2.5" />
        <text x="91" y="188" textAnchor="middle" className="fill-current text-[12px]">Inspect first</text>
        <text x="256" y="188" textAnchor="middle" className="fill-current text-[12px]">Then conclude</text>
      </svg>
    );
  }

  if (type === "research") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <circle cx="82" cy="88" r="40" className={box} strokeWidth="2.5" />
        <path d="M110 116l30 30" className={box} strokeWidth="2.5" />
        <rect x="184" y="28" width="136" height="36" rx="14" className={box} strokeWidth="2.5" />
        <rect x="184" y="82" width="136" height="36" rx="14" className={box} strokeWidth="2.5" />
        <rect x="184" y="136" width="136" height="36" rx="14" className={box} strokeWidth="2.5" />
        <text x="252" y="50" textAnchor="middle" className="fill-current text-[12px] font-semibold">Primary source</text>
        <text x="252" y="104" textAnchor="middle" className="fill-current text-[12px] font-semibold">Secondary source</text>
        <text x="252" y="158" textAnchor="middle" className="fill-current text-[12px] font-semibold">Inference</text>
      </svg>
    );
  }

  if (type === "multimodal") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="18" y="54" width="72" height="72" rx="18" className={box} strokeWidth="2.5" />
        <rect x="106" y="54" width="72" height="72" rx="18" className={box} strokeWidth="2.5" />
        <rect x="194" y="54" width="72" height="72" rx="18" className={box} strokeWidth="2.5" />
        <rect x="282" y="54" width="60" height="72" rx="18" className={box} strokeWidth="2.5" />
        <text x="54" y="150" textAnchor="middle" className="fill-current text-[11px]">Input</text>
        <text x="142" y="150" textAnchor="middle" className="fill-current text-[11px]">Create</text>
        <text x="230" y="150" textAnchor="middle" className="fill-current text-[11px]">Voice</text>
        <text x="312" y="150" textAnchor="middle" className="fill-current text-[11px]">Edit</text>
      </svg>
    );
  }

  if (type === "memory") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="20" y="34" width="78" height="48" rx="14" className={box} strokeWidth="2.5" />
        <rect x="112" y="34" width="112" height="48" rx="14" className={box} strokeWidth="2.5" />
        <rect x="238" y="34" width="102" height="48" rx="14" className={box} strokeWidth="2.5" />
        <rect x="70" y="126" width="220" height="56" rx="18" className={box} strokeWidth="2.5" />
        <path d="M59 82l46 44M169 82v44M289 82l-38 44" className={box} strokeWidth="2.5" />
        <text x="59" y="62" textAnchor="middle" className="fill-current text-[12px] font-semibold">Memory</text>
        <text x="168" y="62" textAnchor="middle" className="fill-current text-[12px] font-semibold">Instructions</text>
        <text x="289" y="62" textAnchor="middle" className="fill-current text-[12px] font-semibold">Personality</text>
      </svg>
    );
  }

  if (type === "project") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="40" y="24" width="280" height="168" rx="22" className={box} strokeWidth="2.5" />
        <rect x="62" y="50" width="72" height="114" rx="14" className={box} strokeWidth="2.5" />
        <rect x="148" y="50" width="72" height="114" rx="14" className={box} strokeWidth="2.5" />
        <rect x="234" y="50" width="62" height="48" rx="12" className={box} strokeWidth="2.5" />
        <rect x="234" y="114" width="62" height="48" rx="12" className={box} strokeWidth="2.5" />
        <text x="98" y="110" textAnchor="middle" className="fill-current text-[11px] font-semibold">Chats</text>
        <text x="184" y="110" textAnchor="middle" className="fill-current text-[11px] font-semibold">Files</text>
        <text x="265" y="80" textAnchor="middle" className="fill-current text-[10px] font-semibold">Sources</text>
        <text x="265" y="144" textAnchor="middle" className="fill-current text-[10px] font-semibold">Rules</text>
      </svg>
    );
  }

  if (type === "gpt") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="26" y="84" width="90" height="56" rx="16" className={box} strokeWidth="2.5" />
        <rect x="136" y="30" width="90" height="56" rx="16" className={box} strokeWidth="2.5" />
        <rect x="136" y="138" width="90" height="56" rx="16" className={box} strokeWidth="2.5" />
        <rect x="246" y="84" width="90" height="56" rx="16" className={box} strokeWidth="2.5" />
        <path d="M116 112h20M226 58h20M226 166h20" className={box} strokeWidth="2.5" />
        <path d="M181 86v52" className={box} strokeWidth="2.5" />
        <text x="71" y="116" textAnchor="middle" className="fill-current text-[11px] font-semibold">Rules</text>
        <text x="181" y="62" textAnchor="middle" className="fill-current text-[11px] font-semibold">Knowledge</text>
        <text x="181" y="170" textAnchor="middle" className="fill-current text-[11px] font-semibold">Tools</text>
        <text x="291" y="116" textAnchor="middle" className="fill-current text-[11px] font-semibold">Role</text>
      </svg>
    );
  }

  if (type === "canvas") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="30" y="24" width="300" height="172" rx="20" className={box} strokeWidth="2.5" />
        <path d="M30 56h300" className={box} strokeWidth="2.5" />
        <path d="M112 56v140M248 56v140" className={box} strokeWidth="2.5" />
        <text x="71" y="44" textAnchor="middle" className="fill-current text-[12px] font-semibold">Outline</text>
        <text x="180" y="44" textAnchor="middle" className="fill-current text-[12px] font-semibold">Draft</text>
        <text x="289" y="44" textAnchor="middle" className="fill-current text-[12px] font-semibold">Edits</text>
      </svg>
    );
  }

  if (type === "agent") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="18" y="80" width="74" height="52" rx="14" className={box} strokeWidth="2.5" />
        <rect x="110" y="28" width="74" height="52" rx="14" className={box} strokeWidth="2.5" />
        <rect x="110" y="140" width="74" height="52" rx="14" className={box} strokeWidth="2.5" />
        <rect x="202" y="28" width="74" height="52" rx="14" className={box} strokeWidth="2.5" />
        <rect x="202" y="140" width="74" height="52" rx="14" className={box} strokeWidth="2.5" />
        <rect x="294" y="80" width="48" height="52" rx="14" className={box} strokeWidth="2.5" />
        <path d="M92 106h18M147 80v60M184 54h18M184 166h18M276 54l18 52M276 166l18-52" className={box} strokeWidth="2.5" />
        <text x="55" y="110" textAnchor="middle" className="fill-current text-[11px] font-semibold">Goal</text>
        <text x="147" y="58" textAnchor="middle" className="fill-current text-[10px] font-semibold">Browser</text>
        <text x="147" y="170" textAnchor="middle" className="fill-current text-[10px] font-semibold">Files</text>
        <text x="239" y="58" textAnchor="middle" className="fill-current text-[10px] font-semibold">Apps</text>
        <text x="239" y="170" textAnchor="middle" className="fill-current text-[10px] font-semibold">Code</text>
        <text x="318" y="110" textAnchor="middle" className="fill-current text-[10px] font-semibold">Done</text>
      </svg>
    );
  }

  if (type === "models") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="28" y="84" width="84" height="52" rx="16" className={box} strokeWidth="2.5" />
        <rect x="138" y="32" width="84" height="52" rx="16" className={box} strokeWidth="2.5" />
        <rect x="138" y="136" width="84" height="52" rx="16" className={box} strokeWidth="2.5" />
        <rect x="248" y="84" width="84" height="52" rx="16" className={box} strokeWidth="2.5" />
        <path d="M112 110h26M222 58h26M222 162h26" className={box} strokeWidth="2.5" />
        <path d="M180 84v52" className={box} strokeWidth="2.5" />
        <text x="70" y="114" textAnchor="middle" className="fill-current text-[10px] font-semibold">Auto</text>
        <text x="180" y="62" textAnchor="middle" className="fill-current text-[10px] font-semibold">Fast</text>
        <text x="180" y="166" textAnchor="middle" className="fill-current text-[10px] font-semibold">Deep</text>
        <text x="290" y="114" textAnchor="middle" className="fill-current text-[10px] font-semibold">Pro</text>
      </svg>
    );
  }

  if (type === "privacy") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <path d="M180 28l92 34v50c0 40-28 74-92 96-64-22-92-56-92-96V62l92-34z" className={box} strokeWidth="2.5" />
        <path d="M145 109l22 22 48-54" className={box} strokeWidth="2.5" />
        <text x="180" y="186" textAnchor="middle" className="fill-current text-[12px]">Boundaries matter</text>
      </svg>
    );
  }

  if (type === "collab") {
    return (
      <svg viewBox="0 0 360 220" className={`h-52 w-full ${accentText}`}>
        <rect x="24" y="44" width="74" height="54" rx="14" className={box} strokeWidth="2.5" />
        <rect x="116" y="24" width="128" height="54" rx="14" className={box} strokeWidth="2.5" />
        <rect x="116" y="96" width="128" height="54" rx="14" className={box} strokeWidth="2.5" />
        <rect x="262" y="44" width="74" height="54" rx="14" className={box} strokeWidth="2.5" />
        <path d="M98 71h18M244 51h18M244 123h18" className={box} strokeWidth="2.5" />
        <text x="61" y="75" textAnchor="middle" className="fill-current text-[10px] font-semibold">Record</text>
        <text x="180" y="56" textAnchor="middle" className="fill-current text-[10px] font-semibold">Study</text>
        <text x="180" y="128" textAnchor="middle" className="fill-current text-[10px] font-semibold">Group</text>
        <text x="299" y="75" textAnchor="middle" className="fill-current text-[10px] font-semibold">Share</text>
      </svg>
    );
  }

  return null;
}

function QuickStartCard({ title, subtitle, icon: Icon }) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#10a37f] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm font-semibold text-stone-950">{title}</div>
      <div className="mt-1 text-sm leading-6 text-stone-600">{subtitle}</div>
    </div>
  );
}

function StatCard({ title, detail, note, icon: Icon, accent = "stone" }) {
  const c = getAccentClasses(accent);
  return (
    <div className={`rounded-[1.75rem] border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${c.ring}`}>
      <div className="mb-3 flex items-center gap-3">
        <div className={`rounded-2xl p-2 ${c.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-stone-950">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-stone-700">{detail}</p>
      <p className={`mt-3 text-xs font-medium uppercase tracking-[0.18em] ${c.text}`}>{note}</p>
    </div>
  );
}

function MiniFeatureCard({ title, detail, icon: Icon, accent = "stone" }) {
  const c = getAccentClasses(accent);
  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-sm ${c.soft}`}>
      <div className="mb-3 flex items-center gap-3">
        <div className={`rounded-xl p-2 ${c.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="text-sm leading-6">{detail}</div>
    </div>
  );
}

function SectionCard({ section }) {
  const Icon = section.icon;
  const c = getAccentClasses(section.accent);

  return (
    <section id={section.id} className={`scroll-mt-28 rounded-[2rem] border bg-white p-6 shadow-sm md:p-8 ${c.ring}`}>
      <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${c.soft}`}>
              {section.level}
            </span>
            <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${c.badge}`}>
              <Icon className="h-3.5 w-3.5" />
              {section.title}
            </div>
          </div>

          <p className="text-base leading-7 text-stone-800 md:text-lg">{section.summary}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Why it matters</div>
              <div className="mt-2 text-sm leading-6 text-stone-700">{section.whyItMatters}</div>
            </div>
            <div className={`rounded-[1.5rem] border p-4 ${c.soft}`}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em]">Start here</div>
              <ul className="mt-2 space-y-2 text-sm leading-6">
                {section.beginnerMoves.slice(0, 2).map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Try this prompt</div>
              <div className="mt-2 text-sm leading-6 text-stone-800">{section.promptExamples[0]}</div>
            </div>
          </div>

          <details className="mt-5 rounded-[1.5rem] border border-stone-200 bg-white p-4 open:shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-stone-900">
              See more tips and prompt examples
            </summary>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Beginner moves</div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                  {section.beginnerMoves.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Advanced moves</div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                  {section.advancedMoves.map((item) => (
                    <li key={item} className="flex gap-2">
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 border-t border-stone-200 pt-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">More prompt examples</div>
              <div className="mt-3 space-y-3">
                {section.promptExamples.slice(1).map((prompt) => (
                  <div key={prompt} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-800">
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>

        <div className={`rounded-[1.75rem] border p-5 md:p-6 ${c.soft}`}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-75">Visual model</div>
          <SectionVisual type={section.visual} accent={section.accent} />
        </div>
      </div>
    </section>
  );
}

function CoverageVisual() {
  return (
    <svg viewBox="0 0 520 270" className="h-full w-full text-emerald-900">
      <rect x="18" y="20" width="144" height="64" rx="18" className="fill-none stroke-current" strokeWidth="2.5" />
      <rect x="188" y="20" width="144" height="64" rx="18" className="fill-none stroke-current" strokeWidth="2.5" />
      <rect x="358" y="20" width="144" height="64" rx="18" className="fill-none stroke-current" strokeWidth="2.5" />
      <rect x="18" y="170" width="144" height="64" rx="18" className="fill-none stroke-current" strokeWidth="2.5" />
      <rect x="188" y="170" width="144" height="64" rx="18" className="fill-none stroke-current" strokeWidth="2.5" />
      <rect x="358" y="170" width="144" height="64" rx="18" className="fill-none stroke-current" strokeWidth="2.5" />
      <path d="M162 52h26M332 52h26M90 84v86M260 84v86M430 84v86" className="fill-none stroke-current" strokeWidth="2.5" />
      <text x="90" y="47" textAnchor="middle" className="fill-current text-[14px] font-semibold">Answering</text>
      <text x="90" y="66" textAnchor="middle" className="fill-current text-[11px]">chat, search</text>
      <text x="260" y="47" textAnchor="middle" className="fill-current text-[14px] font-semibold">Organizing</text>
      <text x="260" y="66" textAnchor="middle" className="fill-current text-[11px]">projects, memory</text>
      <text x="430" y="47" textAnchor="middle" className="fill-current text-[14px] font-semibold">Making</text>
      <text x="430" y="66" textAnchor="middle" className="fill-current text-[11px]">canvas, images, files</text>
      <text x="90" y="197" textAnchor="middle" className="fill-current text-[14px] font-semibold">Learning</text>
      <text x="90" y="216" textAnchor="middle" className="fill-current text-[11px]">study, record</text>
      <text x="260" y="197" textAnchor="middle" className="fill-current text-[14px] font-semibold">Sharing</text>
      <text x="260" y="216" textAnchor="middle" className="fill-current text-[11px]">groups, links, skills</text>
      <text x="430" y="197" textAnchor="middle" className="fill-current text-[14px] font-semibold">Executing</text>
      <text x="430" y="216" textAnchor="middle" className="fill-current text-[11px]">tasks, apps, agent</text>
    </svg>
  );
}

function PromptFormulaVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {promptFormula.map((item, index) => (
        <div key={item} className="rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#10a37f]">Step {index + 1}</div>
          <div className="mt-2 text-sm font-semibold text-stone-950">{item}</div>
        </div>
      ))}
    </div>
  );
}

function LearningPathVisual() {
  return (
    <svg viewBox="0 0 520 170" className="h-full w-full text-[#10a37f]">
      {[
        [30, "Ask"],
        [136, "Choose"],
        [242, "Verify"],
        [348, "Revise"],
        [454, "Systemize"],
      ].map(([x, label], index) => (
        <g key={label}>
          <circle cx={x} cy="84" r="28" className="fill-none stroke-current" strokeWidth="2.5" />
          <text x={x} y="89" textAnchor="middle" className="fill-current text-[11px] font-semibold">{label}</text>
          {index < 4 && <path d={`M${Number(x) + 28} 84h50`} className="fill-none stroke-current" strokeWidth="2.5" />}
        </g>
      ))}
    </svg>
  );
}

export default function ChatGPTMasterGuideCanvas() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");

  const levels = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

  const filteredSections = useMemo(() => {
    return guideSections.filter((section) => {
      const levelMatch = level === "All" || section.level === level;
      const text = [
        section.title,
        section.summary,
        section.whyItMatters,
        ...section.beginnerMoves,
        ...section.advancedMoves,
        ...section.promptExamples,
      ]
        .join(" ")
        .toLowerCase();
      const queryMatch = text.includes(query.toLowerCase());
      return levelMatch && queryMatch;
    });
  }, [level, query]);

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <header className="overflow-hidden rounded-[2.25rem] border border-emerald-200 bg-gradient-to-br from-[#e9f7f2] via-[#fbfaf6] to-[#eef8f4] shadow-sm">
          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
                <BookOpen className="h-3.5 w-3.5" />
                ChatGPT guide
              </div>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                A Practical Master Guide to ChatGPT
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700 md:text-lg">
                Learn what each major ChatGPT tool does, when to use it, and how to get better results faster. This page is written for everyday users first, with deeper sections available when you want them.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-stone-600 shadow-sm">
                <Lightbulb className="h-3.5 w-3.5 text-[#10a37f]" />
                Updated to match official OpenAI product documentation as of {verifiedAsOf}
              </div>
            </div>

            <div className="rounded-[2rem] border border-emerald-200 bg-white/85 p-5 shadow-sm md:p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">The big picture</div>
              <CoverageVisual />
            </div>
          </div>
        </header>

        <section className="mt-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickStartCards.map((item) => (
              <QuickStartCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-emerald-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Learning path</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">How people get good at ChatGPT</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                The fastest path is simple: ask clearly, choose the right tool, verify when needed, revise deliberately, and systemize what works.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5">
              <LearningPathVisual />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Quick chooser</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Which ChatGPT tool should you use?</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                If you only remember one table from this guide, make it this one.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-stone-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Your goal</th>
                    <th className="px-4 py-3 font-semibold">Best tool</th>
                    <th className="px-4 py-3 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {toolChooserRows.map((row, index) => (
                    <tr key={row.goal} className={index % 2 === 0 ? "bg-white" : "bg-stone-50/60"}>
                      <td className="px-4 py-4 font-medium text-stone-900">{row.goal}</td>
                      <td className="px-4 py-4 text-stone-700">{row.best}</td>
                      <td className="px-4 py-4 text-stone-700">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Main tools</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">The core ChatGPT feature stack</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
              These are the features that most strongly shape how people use ChatGPT today.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {coreFeatures.map((item) => (
              <StatCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Often overlooked</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Useful features many people miss</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {additionalFeatures.map((item) => (
              <MiniFeatureCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Prompt pattern</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">A simple prompt formula that works almost everywhere</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Most bad prompts improve immediately when these six pieces become explicit.
              </p>
            </div>
            <div>
              <PromptFormulaVisual />
            </div>
          </div>
        </section>

        <section className="sticky top-0 z-10 mt-8 rounded-[2rem] border border-stone-200 bg-white/95 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Guide navigator</div>
              <div className="mt-1 text-sm text-stone-700">Filter the guide by level or search inside the content.</div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections, tips, prompts..."
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#10a37f] md:w-80"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {levels.map((item) => (
                  <button
                    key={item}
                    onClick={() => setLevel(item)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                      level === item
                        ? "bg-[#10a37f] text-white"
                        : "border border-stone-200 bg-stone-50 text-stone-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <main className="mt-8 space-y-8">
          {filteredSections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </main>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-8 xl:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Reader reminder</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">What this guide focuses on</h2>
              <div className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">It focuses on user-facing ChatGPT features, not enterprise admin settings.</div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">It emphasizes practical usage decisions more than technical product trivia.</div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">Feature availability can still vary by plan, platform, and rollout timing.</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Best habit</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">The single biggest upgrade</h2>
              <div className="mt-5 rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[#10a37f] p-2 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-emerald-950">Stop asking only “How do I prompt better?”</div>
                    <div className="mt-2 text-sm leading-6 text-emerald-950">
                      Start asking “Which ChatGPT layer fits this job best?” That one shift improves results more than most prompt tweaks.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-[#0f2d22] via-[#153629] to-[#1b4332] p-6 text-white shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Final takeaway</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">What mastery actually looks like</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-200">
                Mastery is not writing theatrical prompts. It is knowing how to choose the correct mode, define the job clearly, verify what matters, revise intelligently, and turn successful workflows into reusable systems.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold">Keep re-checking</div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-200">
                <li>Capabilities Overview</li>
                <li>Pricing</li>
                <li>Release Notes</li>
                <li>Projects</li>
                <li>Memory FAQ</li>
                <li>Temporary Chat FAQ</li>
                <li>Canvas</li>
                <li>Tasks</li>
                <li>Apps</li>
                <li>ChatGPT Search</li>
                <li>Deep Research</li>
                <li>Study Mode</li>
                <li>Record</li>
                <li>Shared Links</li>
                <li>Group Chats</li>
                <li>Skills</li>
                <li>ChatGPT Agent</li>
                <li>Voice Mode</li>
                <li>Images FAQ</li>
                <li>Image Inputs FAQ</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useMemo, useState, useCallback } from "react";
import {
  BookOpen, Brain, Search, Globe, FolderOpen, Settings, Bot, PenTool,
  Shield, CheckCircle2, Sparkles, Mic, ImagePlus, FileText,
  Clock3, PanelsTopLeft, Workflow, Laptop, Wrench, Compass, ArrowRight,
  RefreshCcw, Link2, Users, Headphones, Table2, Camera, LayoutGrid,
  School, Share2, Lightbulb, ChevronDown, AlertTriangle, Eye,
  Layers, MessageSquare, Database
} from "lucide-react";

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

const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

const VERIFIED_DATE = "March 12, 2026";
const LEVELS = [
  { key: "all", label: "All" }, { key: "foundation", label: "Foundation" },
  { key: "core", label: "Core" }, { key: "power", label: "Power" }, { key: "expert", label: "Expert" },
];

const CORE_FEATURES = [
  { title: "Search", icon: Globe, color: "#0284c7", description: "Real-time web results for current facts, prices, news, laws, and anything that changes.", when: "Anything that might have changed since the model's training cutoff." },
  { title: "Deep Research", icon: Search, color: "#4f46e5", description: "Multi-step documented research across web sources, files, and connected apps.", when: "You need a report with sources, not a quick answer." },
  { title: "Projects", icon: FolderOpen, color: "#059669", description: "Persistent workspace with shared files, custom instructions, and conversation memory.", when: "Any work you will revisit: courses, clients, startups." },
  { title: "Memory", icon: Database, color: "#d97706", description: "Stores durable preferences and recurring context across conversations.", when: "Preferences and patterns, not exact document storage." },
  { title: "Custom Instructions", icon: Settings, color: "#57534e", description: "Always-on behavior rules for tone, formatting, and response structure.", when: "You want every chat to follow your rules by default." },
  { title: "Canvas", icon: PanelsTopLeft, color: "#334155", description: "A visible drafting surface for writing and code with targeted inline edits.", when: "Iterative editing of long-form text or code." },
  { title: "Tasks", icon: Clock3, color: "#7c3aed", description: "Schedule outputs that execute later and notify you.", when: "Reminders, daily briefs, recurring summaries." },
  { title: "Apps (Connectors)", icon: Wrench, color: "#0d9488", description: "Connect external tools so ChatGPT can read and act on your data.", when: "Best context lives outside chat." },
  { title: "Agent", icon: Workflow, color: "#16a34a", description: "Autonomous execution across browsers, files, code, and connected apps.", when: "Multi-step tasks across sites and actions." },
  { title: "Custom GPTs", icon: Bot, color: "#44403c", description: "Reusable assistants with stable instructions and knowledge files.", when: "A workflow repeats often enough to formalize." },
  { title: "Voice", icon: Mic, color: "#e11d48", description: "Spoken interaction for low-friction thinking and exploration.", when: "Think out loud or multitask." },
  { title: "Images", icon: ImagePlus, color: "#c026d3", description: "Upload for analysis, generate from descriptions, and edit inline.", when: "Visual understanding, creation, or refinement." },
  { title: "Files & Data", icon: FileText, color: "#0891b2", description: "Upload PDFs, spreadsheets, documents for analysis with code execution.", when: "Charts, summaries, calculations." },
  { title: "Models", icon: Brain, color: "#65a30d", description: "Choose speed-optimized, balanced, or reasoning-heavy modes.", when: "Match power to task complexity." },
];

const ADDITIONAL_FEATURES = [
  { title: "Study Mode", icon: School, color: "#059669", description: "Guided learning with questions and comprehension checks." },
  { title: "Record", icon: Headphones, color: "#0284c7", description: "Capture spoken meetings, then produce summaries." },
  { title: "Group Chats", icon: Users, color: "#7c3aed", description: "Invite others into a conversation for shared planning." },
  { title: "Shared Links", icon: Link2, color: "#57534e", description: "Share a conversation via URL." },
  { title: "Image Editing", icon: Camera, color: "#c026d3", description: "Select and refine regions of generated images." },
  { title: "Interactive Tables", icon: Table2, color: "#0891b2", description: "Inspect uploaded data visually before analysis." },
  { title: "Skills", icon: Share2, color: "#0d9488", description: "Reusable workflows for consistent repeated jobs." },
  { title: "Pulse", icon: Sparkles, color: "#4f46e5", description: "Async research that brings back visual summaries." },
];

const TOOL_CHOOSER = [
  { goal: "Quick answer or draft", tool: "Normal Chat", icon: MessageSquare, reason: "Lowest friction." },
  { goal: "Current information", tool: "Search", icon: Globe, reason: "Anything that may have changed." },
  { goal: "Ongoing work with files", tool: "Project", icon: FolderOpen, reason: "Preserves context across sessions." },
  { goal: "Edit a long document", tool: "Canvas", icon: PanelsTopLeft, reason: "Better for surgical revision." },
  { goal: "Multi-source report", tool: "Deep Research", icon: Search, reason: "Multi-step synthesis with citations." },
  { goal: "Complex online task", tool: "Agent", icon: Workflow, reason: "Crosses multiple sites and actions." },
  { goal: "Recurring output", tool: "Tasks", icon: Clock3, reason: "Runs async, notifies you." },
  { goal: "Same workflow often", tool: "GPT or Skill", icon: Bot, reason: "Turn patterns into systems." },
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
  { id:"mental-model", level:"foundation", number:"01", title:"Start with the right mental model", icon:Brain, color:"#65a30d",
    summary:"Treat ChatGPT as a reasoning partner, not an oracle. Its first response is a useful draft, not final truth. Treat every output as provisional until inspected.",
    whyItMatters:"Most disappointment stems from mismatched expectations. Expect a skilled first draft, not certainty.",
    beginnerMoves:["Assume the first answer is a draft. Read critically.","Ask what assumptions were made.","Use ChatGPT to accelerate judgment, not replace it."],
    advancedMoves:["Ask for the strongest counter-argument.","Separate exploration, recommendation, and risk review into passes.","Use it as a second opinion on consequential decisions."],
    commonMistakes:["Trusting numerical claims without verification.","Assuming silence means confidence.","Copying outputs verbatim."],
    promptExamples:[{prompt:"What assumptions did you make?",why:"Surfaces hidden reasoning."},{prompt:"What would a skeptical expert challenge?",why:"Adversarial self-review."},{prompt:"Strongest argument against your recommendation.",why:"Prevents confirmation bias."},{prompt:"Rate confidence in each claim 1-5.",why:"Separates facts from speculation."}],
    beforeAfter:{before:"Write me a business plan for a coffee shop.",after:"Draft a one-page plan for a specialty coffee shop in downtown Boston. Target: grad students and remote workers. Flag anything estimated rather than sourced.",improvement:"Adds context, audience, location, and a verification rule."},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"Learn the workspace before obsessing over prompts", icon:Laptop, color:"#059669",
    summary:"Modern ChatGPT is a layered workspace. Different jobs belong in different layers. A decent prompt in the correct layer outperforms a clever prompt in the wrong one.",
    whyItMatters:"Choosing the right workspace is the highest-leverage decision before typing a word.",
    beginnerMoves:["Normal chat for quick one-offs.","Project for anything you will revisit.","Temporary Chat for a blank slate."],
    advancedMoves:["One project per course, client, or initiative.","Projects as long-term knowledge hubs.","Canvas for iterative editing; chat for strategy."],
    commonMistakes:["New chat every time instead of returning to a project.","Chat for long documents instead of canvas.","Ignoring tasks and agent entirely."],
    promptExamples:[{prompt:"Should this be a chat, project, or GPT?",why:"Model picks the workspace."},{prompt:"Ideal project structure for my semester.",why:"Plans architecture first."},{prompt:"What files and instructions should I add?",why:"Optimizes project context."}],
    beforeAfter:{before:"I keep starting new chats and losing context.",after:"Create a Project. Upload references. Set instructions. Return to the same project.",improvement:"Ephemeral chats become a persistent workspace."},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"Prompting: clarity beats cleverness", icon:PenTool, color:"#0284c7",
    summary:"Good prompts are operating briefs. Fancy wording is optional; clear constraints are not. The model cannot see the standards in your head unless you write them down.",
    whyItMatters:"Vague prompts produce generic outputs. Most frustration traces to under-specified inputs.",
    beginnerMoves:["Name audience and use case explicitly.","State what success looks like.","Specify format, tone, length, and what to avoid."],
    advancedMoves:["Outline first, approve, then full draft.","Separate facts from interpretation.","Provide a rubric for self-grading."],
    commonMistakes:["Three-word prompts expecting tailored results.","Too many constraints at once.","'Can you...?' instead of direct instructions."],
    promptExamples:[{prompt:"Goal: ___. Context: ___. Constraints: ___. Produce: ___.",why:"Universal skeleton."},{prompt:"Outline first. Do not draft yet.",why:"Prevents wrong-structure rewrites."},{prompt:"Before writing, tell me what you need to know.",why:"Model asks clarifying questions."},{prompt:"Write as [role] explaining to [audience].",why:"Anchors tone and depth."}],
    beforeAfter:{before:"Write a cover letter.",after:"Cover letter for Strategy Analyst at McKinsey. Grad student, International Management, SOP and CRM experience. Confident, not arrogant. 350 words. No 'I am passionate about.'",improvement:"Role, background, tone, length, negative constraint."},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"Revision workflows beat one-shot perfection", icon:RefreshCcw, color:"#7c3aed",
    summary:"Strong use is iterative: frame, draft, critique, revise, package. Most users restart when they should refine.",
    whyItMatters:"One-shot caps quality at the first try. Revision consistently produces better results.",
    beginnerMoves:["After the draft: 'What is weak or missing?'","Revise with a narrower target.","Do not restart unless the direction is fundamentally wrong."],
    advancedMoves:["Fixed passes: structure, accuracy, tone, compression, packaging.","Self-critique before rewrite.","Specify compression ratios."],
    commonMistakes:["Manual rewriting instead of model self-diagnosis.","Vague feedback like 'make it better.'","Too many unfocused passes."],
    promptExamples:[{prompt:"Why did your answer not meet the goal?",why:"Self-diagnosis before revision."},{prompt:"Revise for sharper logic. Keep structure.",why:"Constrains scope."},{prompt:"Compress by 35% without losing essentials.",why:"Forces prioritization."},{prompt:"Grade against these criteria. Where below 4/5?",why:"Structured self-evaluation."}],
    beforeAfter:{before:"That's not right. Try again.",after:"Section 2 argument is circular. Rewrite with a data point from the uploaded report. Keep the rest.",improvement:"What is wrong, what to fix, what to preserve."},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"Writing, rewriting, and transformation", icon:FileText, color:"#57534e",
    summary:"ChatGPT excels at transformation: rewriting for different audiences, changing tone, summarizing, reorganizing. Often better at improving existing text than drafting from nothing.",
    whyItMatters:"Most professional writing is transformation. This is where AI has the highest return.",
    beginnerMoves:["Paste original. State what stays and what changes.","Specify audience, channel, tone.","Multiple versions when tone is uncertain."],
    advancedMoves:["Contrastive versions: formal, concise, persuasive.","Sentence-level diagnosis.","Style transfer with preserved facts."],
    commonMistakes:["Drafting from scratch when notes exist.","Accepting first tone without alternatives.","Not specifying what to preserve."],
    promptExamples:[{prompt:"Rewrite for professor email: respectful, direct, no fluff.",why:"Precise transformation."},{prompt:"Three versions: formal, concise, persuasive.",why:"Contrastive selection."},{prompt:"Which sentences feel generic and why?",why:"Line-level diagnosis."},{prompt:"Keep facts and structure. Only change tone.",why:"Scoped transformation."}],
    beforeAfter:{before:"Make this email better.",after:"Rewrite for program director. Respectful, direct. Remove jargon. Under 150 words. Keep action items.",improvement:"Audience, tone, anti-patterns, length, preservation."},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"Files, PDFs, spreadsheets, and data", icon:Table2, color:"#0891b2",
    summary:"ChatGPT inspects files, summarizes documents, executes code on data, produces charts. Key: describe first, analyze second, conclude third.",
    whyItMatters:"Inspecting data before interpreting it catches the most common errors.",
    beginnerMoves:["Ask what the file contains before what it means.","Request a field audit first.","For PDFs: separate structure, argument, evidence."],
    advancedMoves:["Require an audit trail of assumptions.","Restate extracted tables before concluding.","Code execution for large datasets."],
    commonMistakes:["Immediately asking for 'key insights.'","Trusting chart labels without verifying.","Assuming perfect PDF parsing."],
    promptExamples:[{prompt:"Describe: fields, date range, missing values, analysis options.",why:"Audit before analysis."},{prompt:"Extract core argument before critiquing.",why:"Comprehension before judgment."},{prompt:"List every assumption used for this chart.",why:"Audit trail."},{prompt:"Write Python to clean this, run it, show result.",why:"Reproducible analysis."}],
    beforeAfter:{before:"Key insights from this spreadsheet?",after:"Audit: columns, types, date range, missing values. Propose three analyses ranked by usefulness. Do not run until I approve.",improvement:"Inspection, proposals, approval gate."},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"Search, deep research, and citations", icon:Search, color:"#4f46e5",
    summary:"Search for current answers with sources. Deep Research for multi-step reports. Anything current, regulated, or fast-changing should never rely on static memory.",
    whyItMatters:"Without search, ChatGPT answers from a frozen snapshot.",
    beginnerMoves:["Search for anything that may have changed.","Verify cited sources support specific claims.","Prefer primary sources for high stakes."],
    advancedMoves:["'Separate confirmed facts from your inference.'","Specify source types, region, date horizon.","Deep Research with defined scope."],
    commonMistakes:["Trusting model knowledge for current events.","Accepting 'sourced' claims without clicking through.","Deep Research for quick factual questions."],
    promptExamples:[{prompt:"Search. Primary sources only.",why:"Live retrieval with quality constraints."},{prompt:"Separate facts from inference. Label each.",why:"Transparent epistemic status."},{prompt:"What could become outdated in six months?",why:"Time-sensitivity flagging."},{prompt:"Deep Research: [topic]. Scope: [region, dates].",why:"Defined job brief."}],
    beforeAfter:{before:"Latest on AI regulation?",after:"Search: AI regulation, EU and US, past 30 days. Primary sources. Separate enacted from proposed.",improvement:"Scope, time range, quality, categorization."},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"Voice, images, and multimodal workflows", icon:ImagePlus, color:"#c026d3",
    summary:"Voice, image understanding, generation, and editing are standard. Specificity is key: vague visual requests produce generic results.",
    whyItMatters:"Multimodal turns ChatGPT into visual analysis tool, image studio, and hands-free brainstorming partner.",
    beginnerMoves:["Tell exactly what to do with an uploaded image.","Voice when speed matters more than polish.","Image gen: specify subject, framing, mood, style."],
    advancedMoves:["Chain modes: analyze, explain, then create notes.","Image critique for design review.","Scoped editing: select region, describe change."],
    commonMistakes:["Uploading images with no instructions.","Expecting photorealism from vague descriptions.","Forgetting voice carries the same context as text."],
    promptExamples:[{prompt:"Extract menu items, organize by category.",why:"Specific extraction."},{prompt:"Explain this chart to a non-technical exec in 120 words.",why:"Analysis with constraints."},{prompt:"Generate: vertical 9:16, cinematic, golden-hour.",why:"Photography-style spec."},{prompt:"Replace background with white studio. Keep subject.",why:"Scoped editing."}],
    beforeAfter:{before:"Make me a cool image.",after:"16:9: modern Tokyo coffee shop at dusk. Architectural photography, shallow depth of field. Warm. Wooden counter, espresso machine, city lights. No people.",improvement:"Ratio, subject, style, mood, elements, exclusions."},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"Study, record, groups, links, and skills", icon:LayoutGrid, color:"#0d9488",
    summary:"Features for learning, capturing spoken content, collaborating, sharing, and formalizing workflows.",
    whyItMatters:"Learning differs from getting answers. Collaboration differs from solo prompting.",
    beginnerMoves:["Study Mode to learn, not just get answers.","Record for meetings and lectures.","Shared Links and Group Chats for clean collaboration."],
    advancedMoves:["Recorded summaries as project source files.","Skills for repeated jobs.","Group Chats + Projects for shared context."],
    commonMistakes:["Normal chat for studying defeats learning.","Forgetting Record exists.","Screenshots instead of Shared Links."],
    promptExamples:[{prompt:"Quiz me instead of telling answers.",why:"Pedagogical approach."},{prompt:"Recording to action items and follow-up draft.",why:"Multi-output transformation."},{prompt:"Convert this workflow into a Skill.",why:"Formalizes a process."}],
    beforeAfter:{before:"Explain photosynthesis.",after:"Studying for biology exam. Do not explain. Ask questions to check understanding, basic to advanced. Correct with brief explanations.",improvement:"Answer-delivery becomes guided learning."},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"Memory, instructions, personality, temp chat", icon:Database, color:"#d97706",
    summary:"Memory stores context. Instructions set rules. Personality adjusts style. Temporary Chat is a clean room. Not interchangeable.",
    whyItMatters:"Misconfigured personalization degrades results more than it helps.",
    beginnerMoves:["Memory: broad, stable preferences.","Instructions: global writing rules.","Temporary Chat: zero carryover."],
    advancedMoves:["Personality is texture, not a replacement for instructions.","Project-specific instructions over global settings.","Periodic memory audits."],
    commonMistakes:["Everything in memory instead of Instructions.","Stale memory accumulation.","Personality to change capabilities, not style."],
    promptExamples:[{prompt:"What do you remember about me?",why:"Audits memory."},{prompt:"Forget the preference about formal tone.",why:"Targeted cleanup."},{prompt:"Blank-slate. No stored preferences.",why:"Clean-room mode."}],
    beforeAfter:{before:"Preferences in memory but inconsistent results.",after:"Behavior rules in Instructions. Facts in Memory. Domain rules in project instructions.",improvement:"Correct layer separation."},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"Projects as your operating system", icon:FolderOpen, color:"#16a34a",
    summary:"Projects make ChatGPT a context-aware workbench. A well-configured project outperforms any single-chat interaction.",
    whyItMatters:"For multi-session work, projects are the highest-leverage organizational tool.",
    beginnerMoves:["One project per workstream. Name clearly.","Upload only relevant files.","Write project instructions."],
    advancedMoves:["Add conversation summaries as source files.","Weekly work in one project, not fresh chats.","Meta-project for personal productivity."],
    commonMistakes:["Too many narrow projects.","Uploading everything: bloated context.","No project instructions."],
    promptExamples:[{prompt:"Ideal project structure for my semester.",why:"Plans workspace first."},{prompt:"Draft a memo consistent with prior work.",why:"Leverages accumulated context."},{prompt:"Summarize key decisions from last five conversations.",why:"Living summary."}],
    beforeAfter:{before:"Files everywhere, losing track.",after:"One project per domain. References. Instructions. Return. Periodically summarize.",improvement:"Scattered conversations become structured."},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"When to build a GPT (and when not to)", icon:Bot, color:"#44403c",
    summary:"Useful when a workflow repeats, has stable instructions, and benefits from reuse. But most people build too early.",
    whyItMatters:"Premature GPT bakes in an immature workflow. Well-timed GPT turns a proven process into one-click tool.",
    beginnerMoves:["Save prompts first: prompt is the prototype.","Formalize after three repetitions.","Narrow purpose. One job."],
    advancedMoves:["Four layers: role, instructions, knowledge, tools.","Explicit failure rules.","Adversarial testing."],
    commonMistakes:["GPT for something done once.","Too broad: 'do everything.'","No knowledge files."],
    promptExamples:[{prompt:"Turn our workflow into a GPT blueprint.",why:"Derives from experience."},{prompt:"Instructions, input/output schema, failure rules.",why:"Complete specification."},{prompt:"Edge cases this GPT should handle?",why:"Resilience testing."}],
    beforeAfter:{before:"GPT for all my email.",after:"GPT for replying to professors. Respectful, direct. Under 150 words. Asks context first. Refuses without confirmation. Upload: style guide.",improvement:"Narrow scope, safety rules, references."},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"Canvas for writing and code revision", icon:PanelsTopLeft, color:"#334155",
    summary:"Visible working surface alongside chat. Better than linear conversation for document-like work requiring surgical edits.",
    whyItMatters:"Long artifacts suffer in chat. Canvas makes the document the center of gravity.",
    beginnerMoves:["Canvas for long artifacts.","One file per purpose.","Targeted edits, not vague rewrites."],
    advancedMoves:["Chat for strategy, canvas for execution.","Architecture first, narrow diffs second.","Version history for comparison."],
    commonMistakes:["Chat for long documents.","Full rewrites when a paragraph needs fixing.","Not using code canvas for debugging."],
    promptExamples:[{prompt:"Writing canvas. Rewrite only introduction.",why:"Scoped editing."},{prompt:"Find logic errors. Patch only those lines.",why:"Targeted code fix."},{prompt:"Move section 3 before 2, merge 4 and 5.",why:"Structural reorganization."}],
    beforeAfter:{before:"Rewrite my essay. [2000 words in chat]",after:"Open in canvas. Do not change yet. Annotate strong vs weak sections. Then I direct edits.",improvement:"Inspection before modification."},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"Tasks, apps, pulse, and agent", icon:Workflow, color:"#16a34a",
    summary:"Operational layer. Tasks run later. Apps bring data in. Pulse researches async. Agent does autonomous multi-step work.",
    whyItMatters:"Most users only do real-time Q&A. This layer turns ChatGPT into a system that works for you.",
    beginnerMoves:["Tasks: reminders, briefings, recurring summaries.","Apps: when info lives in Drive, Slack, email.","Agent: multi-step workflows (15+ min manual)."],
    advancedMoves:["Agent prompts as job briefs with stop points.","Pulse for proactive topic updates.","Tasks + Projects for weekly auto-summaries."],
    commonMistakes:["Not knowing Agent exists.","Vague agent instructions without stopping rules.","Tasks only for reminders."],
    promptExamples:[{prompt:"Daily task: 8 AM brief on [topic], top 3.",why:"Proactive briefing."},{prompt:"Connected + public sources for competitive analysis.",why:"Internal + external data."},{prompt:"Agent: workflow steps. Pause before submission.",why:"Autonomous with checkpoint."}],
    beforeAfter:{before:"Check five sites and compare pricing.",after:"Agent: visit five competitors, extract pricing, compile table. Pause if login needed. Flag outdated pricing.",improvement:"Delegated with scope and error handling."},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"Model choice and mode selection", icon:Compass, color:"#65a30d",
    summary:"Different modes trade speed, reasoning depth, and tool support. Match model power to task.",
    whyItMatters:"Always using the strongest mode wastes time. Never escalating misses depth.",
    beginnerMoves:["Auto for everyday work.","Escalate for complex logic or synthesis.","Strongest is not always best."],
    advancedMoves:["Fast for drafting, deep for critical review.","Watch tool limitations in reasoning modes.","Start light, escalate mid-conversation."],
    commonMistakes:["Most powerful mode for everything.","Blaming model instead of mode.","Not checking plan tier access."],
    promptExamples:[{prompt:"Quick answer first, deeper second pass.",why:"Speed then depth."},{prompt:"Complex logic. Extended thinking, step by step.",why:"Explicit deep reasoning."},{prompt:"Fast drafting or careful reasoning for this?",why:"Model helps pick mode."}],
    beforeAfter:{before:"Always use most advanced model.",after:"Auto for quick tasks. Reasoning for logic. Fast for brainstorming.",improvement:"Power matched to task type."},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"Privacy, data controls, and risk", icon:Shield, color:"#e11d48",
    summary:"More capability demands more boundaries. Sensitive data needs upload discipline. High-stakes outputs need human review.",
    whyItMatters:"Capability without boundaries leads to data exposure or over-reliance.",
    beginnerMoves:["Do not upload sensitive content casually.","Scrub identifiers before uploading.","Temporary Chat for cleanest privacy."],
    advancedMoves:["Traffic-light upload policy: red, yellow, green.","Expert review before high-stakes action.","Periodic data audit."],
    commonMistakes:["Full databases when a sample suffices.","Assuming Temporary Chat means nothing processed.","AI outputs as final decisions in regulated domains."],
    promptExamples:[{prompt:"Which parts need human expert verification?",why:"Flags limitations."},{prompt:"Help redact before full upload.",why:"Safe preparation."},{prompt:"What here is personally identifiable? Remove it.",why:"PII detection."}],
    beforeAfter:{before:"Full client list, analyze trends.",after:"Remove names, emails, phones. Anonymize companies. Then analyze revenue by segment.",improvement:"Redacts identifiers, preserves analytical value."},
    visual:"privacy" },
];

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

function FeatureCard({ title, icon: Icon, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Icon className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>When: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, icon: Icon, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Icon className="h-3.5 w-3.5" style={{ color }} /></div>
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
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
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
  const Icon = section.icon;
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Icon className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <ChevronDown className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
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
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Advanced</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><ArrowRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>Common mistakes</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
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
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><BookOpen className="h-3.5 w-3.5" /> Practical reference</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>A Master Guide to ChatGPT</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>What each tool does, when to use it, and how to get measurably better results. Written for everyday users first, with deeper sections for those who want them.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Lightbulb className="h-3 w-3" style={{ color: C.greenMid }} /> Verified {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Layers className="h-3 w-3" style={{ color: C.greenMid }} /> 16 sections &middot; 60+ prompts</span>
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
            {[{icon:PenTool,t:"Ask clearly",d:"Goal, context, constraints, format."},{icon:LayoutGrid,t:"Choose the right layer",d:"Chat, project, canvas, search, agent."},{icon:Shield,t:"Verify when it matters",d:"Search for current or high-stakes."},{icon:RefreshCcw,t:"Revise, do not restart",d:"Good results from a second pass."},{icon:Bot,t:"Systemize what works",d:"Project, GPT, task, or skill."},{icon:Eye,t:"Visuals to think faster",d:"Tables, diagrams, screenshots."}].map(({icon:I,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><I className="h-4 w-4"/></div>
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
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><r.icon className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
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
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Sparkles className="h-5 w-5"/></div>
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
          </div>
        </footer>
      </div>
    </div>
  );
}

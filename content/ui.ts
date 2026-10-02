import type { L, Locale } from "./profile";

/** ข้อความของตัว UI เอง (หัวข้อ, ปุ่ม, footer) — เนื้อหาตัวตนอยู่ใน profile.ts */
export const ui = {
  nav: {
    about: { th: "เกี่ยวกับ", en: "About" },
    experience: { th: "ประสบการณ์", en: "Experience" },
    projects: { th: "ผลงาน", en: "Work" },
    domains: { th: "ขอบเขตงาน", en: "Coverage" },
    ai: { th: "AI", en: "AI" },
    skills: { th: "ทักษะ", en: "Skills" },
    contact: { th: "ติดต่อ", en: "Contact" },
  },
  sections: {
    about: { th: "เกี่ยวกับผม", en: "About" },
    experience: { th: "ประสบการณ์ทำงาน", en: "Experience" },
    projects: { th: "ผลงานที่ผ่านมา", en: "Selected work" },
    domains: { th: "ระบบที่รับผิดชอบและสนับสนุน", en: "Systems owned and supported" },
    background: { th: "การศึกษาและคุณวุฒิ", en: "Education & credentials" },
    ai: { th: "AI ในกระบวนการทำงาน", en: "How I work with AI" },
    skills: { th: "ทักษะและเครื่องมือ", en: "Skills & tools" },
    contact: { th: "ติดต่อ", en: "Get in touch" },
  },
  aiLead: {
    th: "ใช้ AI เป็นส่วนหนึ่งของกระบวนการทำงาน ไม่ใช่แค่ code completion ทั้ง knowledge base, skill ที่แชร์ในทีม, hook ที่ตรวจงานก่อนส่งมอบ และการต่อเข้ากับแพลตฟอร์มผ่าน MCP",
    en: "AI is part of the working process rather than a code-completion tool: a knowledge base, skills shared across the team, hooks that check work before delivery, and connections to the platforms over MCP.",
  },
  aiResultLabel: { th: "ผลที่ได้", en: "Result" },
  graphCaption: {
    th: "โครงสร้าง knowledge base จริงที่ใช้งานอยู่ — 251 note เชื่อมถึงกัน 508 link แบ่งเป็น 28 กลุ่มระบบ",
    en: "The live structure of the knowledge base — 251 notes, 508 links between them, clustered into 28 systems.",
  },
  graphLabel: {
    th: "แผนภาพ node และ link แสดงความเชื่อมโยงของ note ใน knowledge base",
    en: "A node-and-link diagram showing how notes in the knowledge base connect.",
  },
  projectsLead: {
    th: "ผลงานส่วนใหญ่เป็นระบบภายใน จึงไม่เปิดเผยชื่อและภาพหน้าจอ แต่อธิบายตามหน้าที่ของระบบ และยินดีลงรายละเอียดในการสัมภาษณ์",
    en: "Most are internal systems, so names and screenshots are withheld. Each is described by what it does, and I'm glad to go deeper in interview.",
  },
  education: { th: "การศึกษา", en: "Education" },
  // เป็นคอร์สและ badge ที่เรียนเพื่อประเมินว่าเอามาใช้กับงานได้ไหม ไม่ใช่ certification ที่สอบ — ห้ามเรียกว่าใบรับรอง
  certifications: { th: "การอบรมและ badge", en: "Training & badges" },
  googleCloud: { th: "Google Cloud", en: "Google Cloud" },
  googleCloudSummary: {
    th: "skill badge — Gemini, multi-agent, RAG, Document AI, Kubernetes และงานแพลตฟอร์มพื้นฐาน",
    en: "skill badges — Gemini, multi-agent, RAG, Document AI, Kubernetes and core platform work",
  },
  microsoftLearn: { th: "Microsoft Learn", en: "Microsoft Learn" },
  learnCourses: {
    th: "คอร์สสาย exam track ที่เรียนจบ",
    en: "Completed exam-track courses",
  },
  verifyAt: { th: "ตรวจสอบได้ที่", en: "Verify at" },
  languages: { th: "ภาษา", en: "Languages" },
  domainsLead: {
    th: "ทั้งระบบที่รับผิดชอบโดยตรงและระบบที่สนับสนุนในองค์กรเดียว ชื่อระบบเป็นข้อมูลภายใน จึงระบุตามลักษณะงาน",
    en: "Systems I own and systems I support, all within one organisation. The names are confidential, so they are listed by function.",
  },
  diagramCaption: {
    th: "ภาพรวมเชิง concept — ไม่ใช่ topology จริงของระบบ",
    en: "Conceptual overview, not the actual system topology.",
  },
  scrollHint: { th: "เลื่อนแนวนอนเพื่อดูภาพทั้งหมด", en: "Scroll horizontally to view the full diagram." },
  contactLead: {
    th: "ติดต่อทางอีเมลหรือ LinkedIn ได้เลย",
    en: "Email or LinkedIn is the best way to reach me.",
  },
  moreProjects: { th: "ระบบอื่นที่พัฒนาและดูแล", en: "Other systems I build and maintain" },
  contactCta: { th: "ติดต่อผม", en: "Get in touch" },
  // ใช้คำว่า resume ไม่ใช่ CV — สาย IT ในไทยและฝั่งอเมริกาใช้ resume (สั้น 1–2 หน้า) ส่วน CV คือฉบับยาวแบบสายวิชาการ/ยุโรป
  resumeKeyProjects: { th: "ผลงานหลัก", en: "Key projects" },
  resumeCore: { th: "ทักษะหลัก", en: "Core" },
  resumePdf: { th: "ดาวน์โหลด Resume (PDF ภาษาอังกฤษ)", en: "Download resume (PDF)" },
  builtWith: {
    th: "เขียนด้วย Next.js และ Tailwind CSS · deploy บน Vercel",
    en: "Built with Next.js and Tailwind CSS · deployed on Vercel",
  },
  skipToContent: { th: "ข้ามไปเนื้อหาหลัก", en: "Skip to main content" },
  switchLang: { th: "English", en: "ภาษาไทย" },
  switchLangLabel: { th: "Switch to English", en: "เปลี่ยนเป็นภาษาไทย" },
  themeToDark: { th: "เปลี่ยนเป็นโหมดมืด", en: "Switch to dark mode" },
  themeToLight: { th: "เปลี่ยนเป็นโหมดสว่าง", en: "Switch to light mode" },
} satisfies Record<string, L | Record<string, L>>;

/** หยิบข้อความตามภาษาปัจจุบัน */
export const t = (text: L, lang: Locale) => text[lang];

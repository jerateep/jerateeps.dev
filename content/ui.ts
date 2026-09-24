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
    domains: { th: "ขอบเขตระบบที่เคยดูแล", en: "Systems I've worked on" },
    background: { th: "การศึกษาและคุณวุฒิ", en: "Education & credentials" },
    ai: { th: "AI ในกระบวนการทำงาน", en: "How I work with AI" },
    skills: { th: "ทักษะและเครื่องมือ", en: "Skills & tools" },
    contact: { th: "ติดต่อ", en: "Get in touch" },
  },
  aiLead: {
    th: "ผมไม่ได้ใช้ AI แค่เติมโค้ดให้จบบรรทัด แต่วางมันเป็นส่วนหนึ่งของกระบวนการ — มีคลังความรู้ให้มันอ่าน มีกฎของแต่ละระบบให้มันรู้ และมีด่านตรวจที่รันเองก่อนงานจะขึ้น",
    en: "I don't use AI just to finish lines of code. It's wired into the process: a knowledge base it reads from, per-system rules it knows, and automated gates that run before anything ships.",
  },
  aiResultLabel: { th: "ผลที่ได้", en: "Result" },
  projectsLead: {
    th: "เกือบทั้งหมดเป็นระบบภายในของนายจ้าง — ชื่อระบบและภาพหน้าจอเปิดเผยไม่ได้ จึงเรียกตามหน้าที่และเล่าเฉพาะสิ่งที่อธิบายได้ในห้องสัมภาษณ์",
    en: "Almost all of these are my employer's internal systems — the system names and screenshots can't be shown, so each is named by what it does and described only as far as I can defend it in an interview.",
  },
  education: { th: "การศึกษา", en: "Education" },
  certifications: { th: "ใบรับรอง", en: "Certifications" },
  verifyAt: { th: "ตรวจสอบได้ที่", en: "Verify at" },
  languages: { th: "ภาษา", en: "Languages" },
  domainsLead: {
    th: "กว่า 20 ระบบในองค์กรเดียว — ชื่อระบบเป็นความลับ จึงเรียกตามหน้าที่ที่ทำ",
    en: "20+ systems inside one organisation. The names are confidential, so they are listed by what they do.",
  },
  diagramCaption: {
    th: "ภาพรวมเชิงแนวคิด — ไม่ใช่ผังระบบจริง",
    en: "Conceptual overview, not the actual system topology.",
  },
  scrollHint: { th: "เลื่อนดูแนวนอนได้", en: "Scroll sideways to see it all." },
  contactLead: {
    th: "มีงานที่อยากคุย หรือแค่อยากทักมาถาม — ยินดีเสมอครับ",
    en: "Got a project in mind, or just want to say hi? Always happy to talk.",
  },
  viewProject: { th: "ดูผลงาน", en: "View" },
  builtWith: {
    th: "เขียนด้วย Next.js และ Tailwind CSS · deploy บน Vercel",
    en: "Built with Next.js and Tailwind CSS · deployed on Vercel",
  },
  skipToContent: { th: "ข้ามไปเนื้อหาหลัก", en: "Skip to main content" },
  switchLang: { th: "English", en: "ภาษาไทย" },
  switchLangLabel: { th: "Switch to English", en: "เปลี่ยนเป็นภาษาไทย" },
} satisfies Record<string, L | Record<string, L>>;

/** หยิบข้อความตามภาษาปัจจุบัน */
export const t = (text: L, lang: Locale) => text[lang];

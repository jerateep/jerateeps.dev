import type { L, Locale } from "./profile";

/** ข้อความของตัว UI เอง (หัวข้อ, ปุ่ม, footer) — เนื้อหาตัวตนอยู่ใน profile.ts */
export const ui = {
  nav: {
    about: { th: "เกี่ยวกับ", en: "About" },
    experience: { th: "ประสบการณ์", en: "Experience" },
    projects: { th: "ผลงาน", en: "Work" },
    domains: { th: "ขอบเขตงาน", en: "Coverage" },
    skills: { th: "ทักษะ", en: "Skills" },
    contact: { th: "ติดต่อ", en: "Contact" },
  },
  sections: {
    about: { th: "เกี่ยวกับผม", en: "About" },
    experience: { th: "ประสบการณ์ทำงาน", en: "Experience" },
    projects: { th: "ผลงานที่ผ่านมา", en: "Selected work" },
    domains: { th: "ขอบเขตระบบที่เคยดูแล", en: "Systems I've worked on" },
    skills: { th: "ทักษะและเครื่องมือ", en: "Skills & tools" },
    contact: { th: "ติดต่อ", en: "Get in touch" },
  },
  domainsLead: {
    th: "กว่า 20 ระบบในองค์กรเดียว — ชื่อระบบเป็นความลับ จึงเรียกตามหน้าที่ที่ทำ",
    en: "20+ systems inside one organisation. The names are confidential, so they are listed by what they do.",
  },
  flowCaption: {
    th: "ภาพรวมเชิงแนวคิด — ไม่ใช่ผังระบบจริง",
    en: "Conceptual overview, not the actual system topology.",
  },
  contactLead: {
    th: "มีงานที่อยากคุย หรือแค่อยากทักมาถาม — ยินดีเสมอครับ",
    en: "Got a project in mind, or just want to say hi? Always happy to talk.",
  },
  confidential: {
    th: "ระบบภายในองค์กร — ชื่อจริงปกปิด",
    en: "Internal system — name withheld",
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

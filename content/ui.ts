import type { L, Locale } from "./profile";

/** ข้อความของตัว UI เอง (หัวข้อ, ปุ่ม, footer) — เนื้อหาตัวตนอยู่ใน profile.ts */
export const ui = {
  nav: {
    about: { th: "เกี่ยวกับ", en: "About" },
    experience: { th: "ประสบการณ์", en: "Experience" },
    projects: { th: "ผลงาน", en: "Work" },
    skills: { th: "ทักษะ", en: "Skills" },
    contact: { th: "ติดต่อ", en: "Contact" },
  },
  sections: {
    about: { th: "เกี่ยวกับผม", en: "About" },
    experience: { th: "ประสบการณ์ทำงาน", en: "Experience" },
    projects: { th: "ผลงานที่ผ่านมา", en: "Selected work" },
    skills: { th: "ทักษะและเครื่องมือ", en: "Skills & tools" },
    contact: { th: "ติดต่อ", en: "Get in touch" },
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

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
    th: "ประยุกต์ใช้ AI เป็นส่วนหนึ่งของกระบวนการพัฒนา ไม่ใช่เพียงเครื่องมือเติมโค้ด ประกอบด้วยคลังความรู้ที่เครื่องมือเรียกใช้ได้ คู่มืออ้างอิงเฉพาะระบบ และด่านตรวจอัตโนมัติก่อนส่งมอบ",
    en: "AI is applied as part of the development process rather than as a code-completion tool: a knowledge base the tooling reads from, documented per-system rules, and automated gates that run before delivery.",
  },
  aiResultLabel: { th: "ผลที่ได้", en: "Result" },
  graphCaption: {
    th: "โครงสร้างคลังความรู้จริงที่ใช้งานอยู่ — 229 บันทึก เชื่อมถึงกัน 503 เส้น แบ่งเป็น 28 กลุ่มระบบ · ไม่แสดงชื่อบันทึกเพราะเป็นชื่อระบบภายใน",
    en: "The live structure of the knowledge base — 229 notes, 503 links between them, clustered into 28 systems. Note titles are omitted because they are internal system names.",
  },
  graphLabel: {
    th: "แผนภาพจุดและเส้นแสดงความเชื่อมโยงของบันทึกในคลังความรู้",
    en: "A node-and-link diagram showing how notes in the knowledge base connect.",
  },
  projectsLead: {
    th: "ผลงานส่วนใหญ่เป็นระบบภายในขององค์กรที่สังกัด ชื่อระบบและภาพหน้าจอไม่สามารถเปิดเผยได้ จึงระบุตามลักษณะงานและให้รายละเอียดเท่าที่อธิบายได้ในการสัมภาษณ์",
    en: "Most of these are internal systems belonging to my employer. System names and screenshots cannot be disclosed, so each is described by function and in the level of detail that can be substantiated in an interview.",
  },
  education: { th: "การศึกษา", en: "Education" },
  certifications: { th: "ใบรับรอง", en: "Certifications" },
  verifyAt: { th: "ตรวจสอบได้ที่", en: "Verify at" },
  languages: { th: "ภาษา", en: "Languages" },
  domainsLead: {
    th: "ระบบมากกว่า 20 ระบบภายในองค์กรเดียว ชื่อระบบเป็นข้อมูลภายใน จึงระบุตามลักษณะงานที่รับผิดชอบ",
    en: "More than 20 systems within a single organisation. The system names are confidential and are therefore listed by function.",
  },
  diagramCaption: {
    th: "ภาพรวมเชิงแนวคิด — ไม่ใช่ผังระบบจริง",
    en: "Conceptual overview, not the actual system topology.",
  },
  scrollHint: { th: "เลื่อนแนวนอนเพื่อดูภาพทั้งหมด", en: "Scroll horizontally to view the full diagram." },
  contactLead: {
    th: "หากสนใจร่วมงานหรือต้องการสอบถามรายละเอียดเพิ่มเติม ยินดีรับการติดต่อ",
    en: "For project enquiries or further details, please feel free to get in touch.",
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

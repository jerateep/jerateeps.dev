/**
 * แหล่งข้อมูลเดียวของทั้งเว็บ — แก้ที่นี่ที่เดียว หน้าเว็บอัปเดตตาม
 *
 * PDPA / ความลับของนายจ้าง — อ่านก่อนใส่ข้อมูล:
 *   1. อย่าใส่ชื่อ-นามสกุล, อีเมล, เบอร์โทรของ "คนอื่น" (หัวหน้า ลูกค้า เพื่อนร่วมทีม) เด็ดขาด
 *   2. ระบบภายในของบริษัท: ตั้ง confidential: true แล้วใช้ชื่อกลาง ๆ
 *      (เช่น "ระบบอนุมัติงบภายในองค์กร" แทนชื่อระบบจริง) — หน้าเว็บจะขึ้น badge ให้เอง
 *   3. ภาพหน้าจอระบบภายใน = ห้ามขึ้นเว็บ เว้นแต่เบลอ/วาดใหม่จนไม่เหลือข้อมูลจริง
 *      (ชื่อพนักงาน, เลขเอกสาร, ยอดเงิน, ชื่อลูกค้า ฯลฯ)
 *   4. ตัวเลข impact ให้ใช้แบบสัมพัทธ์ ("ลดเวลา ~70%") ไม่ใช่ยอดเงินหรือจำนวนจริงของบริษัท
 */

export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "th";

/** ข้อความสองภาษา */
export type L = Record<Locale, string>;

export type Job = {
  company: L;
  role: L;
  period: L;
  summary: L;
  highlights: L[];
  stack: string[];
  /** true = ชื่อบริษัท/ระบบปกปิด ใช้ชื่อกลาง ๆ แทน */
  confidential?: boolean;
};

export type Project = {
  slug: string;
  name: L;
  summary: L;
  role: L;
  impact: L[];
  stack: string[];
  year: string;
  /** ลิงก์สาธารณะเท่านั้น — ระบบภายในไม่ต้องใส่ */
  link?: string;
  confidential?: boolean;
};

export type SkillGroup = {
  title: L;
  items: string[];
};

export const profile = {
  /** TODO: เปลี่ยนเป็นชื่อจริงถ้าต้องการให้ recruiter เห็นชื่อ */
  name: { th: "jerateeps", en: "jerateeps" } satisfies L,
  role: {
    th: "Full-stack Developer · Back-office & Automation",
    en: "Full-stack Developer · Back-office & Automation",
  } satisfies L,
  tagline: {
    th: "สร้างระบบหลังบ้านองค์กรที่คนใช้จริงทุกวัน — .NET, Next.js, SQL Server และงาน automation",
    en: "I build the enterprise back-office systems people actually use every day — .NET, Next.js, SQL Server, and automation.",
  } satisfies L,
  location: { th: "กรุงเทพฯ ประเทศไทย", en: "Bangkok, Thailand" } satisfies L,
  available: {
    th: "เปิดรับงานฟรีแลนซ์และโอกาสใหม่ ๆ",
    en: "Open to freelance work and new opportunities",
  } satisfies L,

  about: [
    {
      th: "ผมทำงานกับระบบหลังบ้านขององค์กรเป็นหลัก — ระบบอนุมัติเอกสาร, ระบบสิทธิ์การใช้งาน, งาน automation ที่เชื่อมหลายระบบเข้าด้วยกัน งานส่วนใหญ่ไม่ได้อยู่ในที่สว่าง แต่ถ้ามันล่ม ทั้งออฟฟิศรู้ทันที",
      en: "I work mostly on enterprise back-office systems — approval workflows, permission management, and automation that stitches several systems together. Most of it is invisible, but everyone notices the day it breaks.",
    },
    {
      th: "ถนัดงานที่ต้องเข้าใจของเดิมก่อนแก้: อ่านโค้ด legacy ที่ไม่มีเอกสาร, ย้ายระบบเก่าขึ้นของใหม่โดยไม่ทำ flow ธุรกิจพัง, และเขียนสิ่งที่ค้นเจอทิ้งไว้ให้คนถัดไป",
      en: "My strength is understanding what already exists before changing it: reading undocumented legacy code, migrating old systems without breaking the business flow, and writing down what I learn for whoever comes next.",
    },
  ] satisfies L[],

  /**
   * TODO: ที่ทำงานก่อนหน้า — เดี๋ยวเติมทีหลัง
   * คัดลอกบล็อกข้างล่างแล้วแก้ข้อมูลได้เลย เรียงจากใหม่ → เก่า
   */
  experience: [
    {
      company: { th: "บริษัทด้านโทรคมนาคมดาวเทียม", en: "Satellite telecom company" },
      role: { th: "Software Developer", en: "Software Developer" },
      period: { th: "ปัจจุบัน", en: "Present" },
      confidential: true,
      summary: {
        th: "ดูแลและพัฒนาระบบ back-office ที่พนักงานทั้งองค์กรใช้ — ตั้งแต่ระบบอนุมัติเอกสาร ระบบจัดการสิทธิ์เมนู ไปจนถึงงาน RPA ที่ยิงงานเข้า SAP",
        en: "Build and maintain the back-office systems used across the organisation — document approval, menu permission management, and RPA pipelines that feed SAP.",
      },
      highlights: [
        {
          th: "ย้ายระบบ ASP.NET WebForms เดิมขึ้น .NET 8 + Next.js โดยรักษา business flow เดิมไว้ครบ",
          en: "Migrated legacy ASP.NET WebForms systems to .NET 8 + Next.js while preserving the original business flow.",
        },
        {
          th: "ออกแบบชั้น permission ที่ให้สิทธิ์ตามโครงสร้างองค์กร แทนการผูกสิทธิ์รายคน",
          en: "Designed a permission layer that grants access by org attributes instead of per-user assignment.",
        },
        {
          th: "วางระบบคิวงาน automation บน message queue ให้หลายเซิร์ฟเวอร์รับงานขนานกันได้",
          en: "Built a message-queue based automation pipeline so multiple worker servers process jobs in parallel.",
        },
      ],
      stack: [".NET 8", "ASP.NET", "Next.js", "SQL Server", "RabbitMQ", "Docker"],
    },
    // {
    //   company: { th: "ชื่อบริษัทก่อนหน้า", en: "Previous company" },
    //   role: { th: "ตำแหน่ง", en: "Role" },
    //   period: { th: "2563 – 2565", en: "2020 – 2022" },
    //   summary: { th: "...", en: "..." },
    //   highlights: [{ th: "...", en: "..." }],
    //   stack: ["..."],
    // },
  ] satisfies Job[],

  /** TODO: เติมผลงานที่อยากโชว์ — ระบบภายในใช้ confidential: true */
  projects: [
    {
      slug: "approval-workflow",
      name: {
        th: "ระบบขออนุมัติงบประมาณภายในองค์กร",
        en: "Internal budget approval system",
      },
      summary: {
        th: "ระบบยื่นและอนุมัติคำขอใช้งบ ที่สร้างสายอนุมัติอัตโนมัติตามโครงสร้างองค์กรและวงเงิน พร้อมเช็คยอดคงเหลือกับระบบบัญชีแบบเรียลไทม์",
        en: "A budget request and approval system that generates the approver line automatically from org structure and amount, with real-time balance checks against the accounting system.",
      },
      role: { th: "Full-stack · ออกแบบ + พัฒนา", en: "Full-stack · design + build" },
      confidential: true,
      year: "2024",
      impact: [
        {
          th: "ลดเวลารออนุมัติจากหลายวันเหลือระดับชั่วโมง",
          en: "Cut approval turnaround from days to hours.",
        },
        {
          th: "ตัดขั้นตอนเดินเอกสารกระดาษออกทั้งหมด",
          en: "Removed the paper routing step entirely.",
        },
      ],
      stack: ["ASP.NET", "SQL Server", "SOAP integration"],
    },
    {
      slug: "rpa-queue",
      name: {
        th: "แพลตฟอร์มคิวงาน RPA",
        en: "RPA job queue platform",
      },
      summary: {
        th: "เว็บพอร์ทัลให้ผู้ใช้ส่งงานเอกสารเป็น batch เข้าคิว แล้วมี worker บนหลายเครื่องดึงไปสั่ง robot ทำงานต่อ พร้อมหน้าติดตามสถานะรายใบ",
        en: "A portal where users queue document batches, with workers across several machines pulling jobs and driving desktop robots, plus per-item status tracking.",
      },
      role: { th: "Full-stack · ออกแบบ + พัฒนา", en: "Full-stack · design + build" },
      confidential: true,
      year: "2024",
      impact: [
        {
          th: "งานคีย์เอกสารซ้ำ ๆ ที่เคยทำมือ กลายเป็นตั้งคิวแล้วเดินจากไปได้",
          en: "Turned repetitive manual data entry into a queue-and-walk-away job.",
        },
        {
          th: "งานที่ fail retry เองได้ ไม่ต้องรอคนมาไล่ดู",
          en: "Failed jobs retry themselves instead of waiting for someone to notice.",
        },
      ],
      stack: [".NET", "RabbitMQ", "SQL Server", "Power Automate Desktop"],
    },
    {
      slug: "freelance",
      name: {
        th: "งานฟรีแลนซ์ผ่าน Fastwork",
        en: "Freelance work via Fastwork",
      },
      summary: {
        th: "รับพัฒนาเว็บและระบบภายในให้ลูกค้าธุรกิจ — ตั้งแต่คุยความต้องการ ออกแบบ ลงมือเขียน จนส่งมอบและดูแลต่อ",
        en: "Web and internal-system development for business clients — from requirements and design through build, delivery, and ongoing support.",
      },
      role: { th: "ฟรีแลนซ์ · รับผิดชอบทั้งงาน", en: "Freelance · end to end" },
      year: "—", // TODO: ใส่ช่วงปีที่รับงาน
      impact: [
        // TODO: หยิบงานเด่น 2–3 ชิ้นจาก Fastwork มาเขียนเป็นข้อ ๆ (ห้ามใส่ชื่อลูกค้าถ้าไม่ได้ขออนุญาต)
        {
          th: "ดูตัวอย่างงานและรีวิวจากลูกค้าได้ที่โปรไฟล์ Fastwork",
          en: "Sample work and client reviews are on the Fastwork profile.",
        },
      ],
      stack: ["Next.js", "ASP.NET", "SQL Server"], // TODO: ปรับตามงานจริง
      link: "https://fastwork.co/byob/2KRa1es4ON",
    },
    // {
    //   slug: "your-project",
    //   name: { th: "ชื่อผลงาน", en: "Project name" },
    //   summary: { th: "...", en: "..." },
    //   role: { th: "...", en: "..." },
    //   year: "2025",
    //   impact: [{ th: "...", en: "..." }],
    //   stack: ["..."],
    //   link: "https://example.com",
    // },
  ] satisfies Project[],

  skills: [
    {
      title: { th: "หลัก", en: "Core" },
      items: ["C#", "TypeScript", "SQL", "JavaScript"],
    },
    {
      title: { th: "Backend", en: "Backend" },
      items: [".NET 8", "ASP.NET Core", "ASP.NET WebForms", "REST", "SOAP"],
    },
    {
      title: { th: "Frontend", en: "Frontend" },
      items: ["Next.js", "React", "Tailwind CSS"],
    },
    {
      title: { th: "ข้อมูลและโครงสร้าง", en: "Data & infra" },
      items: ["SQL Server", "RabbitMQ", "Docker", "GitLab CI", "Nginx"],
    },
    {
      title: { th: "Automation", en: "Automation" },
      items: ["Power Automate", "Power Apps", "SAP integration", "Microsoft Graph"],
    },
  ] satisfies SkillGroup[],

  /** TODO: ใส่ลิงก์จริง — ลบอันที่ไม่ใช้ออก */
  links: [
    { label: "GitHub", href: "https://github.com/jerateep" },
    { label: "Fastwork", href: "https://fastwork.co/byob/2KRa1es4ON" },
    { label: "Email", href: "mailto:jerateep_@live.com" },
    // { label: "LinkedIn", href: "https://linkedin.com/in/..." },
  ],
} as const;

export type Profile = typeof profile;

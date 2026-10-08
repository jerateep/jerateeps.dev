/**
 * แหล่งข้อมูลเดียวของทั้งเว็บ — แก้ที่นี่ที่เดียว หน้าเว็บอัปเดตตาม
 *
 * ผลงานด้านล่างเรียบเรียงจาก second-brain vault (knowledge/<ระบบ>/*-index.md)
 * แล้ว sanitize ก่อนลงเว็บ — สิ่งที่ "ถอดออกทุกครั้ง" ห้ามใส่กลับ:
 *   IP/hostname ภายใน · ชื่อ DB และชื่อตาราง · path repo และ GitLab remote
 *   GUID ของ environment/site · ชื่อ view ที่เก็บข้อมูลพนักงาน · ชื่อ function ของ SAP
 *   URL ระบบภายใน · อะไรก็ตามที่แตะ credential
 *
 * PDPA — อ่านก่อนเติมของใหม่:
 *   1. อย่าใส่ชื่อ-นามสกุล, อีเมล, เบอร์โทรของ "คนอื่น" (หัวหน้า ลูกค้า เพื่อนร่วมทีม) เด็ดขาด
 *   2. ระบบภายในของบริษัท: ตั้ง confidential: true แล้วใช้ชื่อกลาง ๆ
 *      (เช่น "ระบบอนุมัติงบภายในองค์กร" แทนชื่อระบบจริง) — คำอธิบายรวมอยู่หัว section ผลงาน
 *   3. ภาพหน้าจอระบบภายใน = ห้ามขึ้นเว็บ เว้นแต่เบลอ/วาดใหม่จนไม่เหลือข้อมูลจริง
 *      (ชื่อพนักงาน, เลขเอกสาร, ยอดเงิน, ชื่อลูกค้า ฯลฯ)
 *   4. ตัวเลข impact ให้ใช้แบบสัมพัทธ์ ("ลดเวลา ~70%") ไม่ใช่ยอดเงินหรือจำนวนจริงของบริษัท
 */

export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** ข้อความสองภาษา */
export type L = Record<Locale, string>;

export type Job = {
  company: L;
  role: L;
  period: L;
  summary: L;
  /** ตำแหน่งก่อนหน้าในบริษัทเดียวกัน (ใหม่ → เก่า) — ให้เห็นว่าบทบาทขยับ ไม่ใช่ตำแหน่งเดิม 8 ปี */
  previousRoles?: { role: L; period: L }[];
  highlights: L[];
  stack: string[];
  /** resume PDF แสดง bullet แค่กี่ข้อแรก (0 = บรรทัดตำแหน่งอย่างเดียว) — งานเก่าที่ไม่เกี่ยวกับสายที่สมัคร */
  resumeHighlights?: number;
};

export type Project = {
  slug: string;
  name: L;
  summary: L;
  role: L;
  impact: L[];
  stack: string[];
  /** ข้อ impact ที่ resume PDF ใช้ (ค่าเริ่มต้น 0) — เลือกข้อที่ไม่ซ้ำกับ bullet ของงานด้านบน */
  resumeImpact?: number;
  /** ใช้จัดลำดับและอ้างอิงตอนแก้เนื้อหา ไม่ได้แสดงบนหน้าเว็บ */
  year: string;
  /** ลิงก์สาธารณะเท่านั้น — ระบบภายในไม่ต้องใส่ */
  link?: string;
  confidential?: boolean;
  /**
   * visual ย่อประจำการ์ด — 3–5 ขั้น บอกรูปร่างของระบบ
   * กฎเดียวกับแผนภาพใหญ่: ชื่อเชิงหน้าที่เท่านั้น
   */
  flow?: { label: L; icon: string }[];
  /**
   * ป้ายในแผนภาพสถาปัตยกรรม (ตำแหน่งอยู่ในคอมโพเนนต์)
   * เรียกทุกอย่างตามหน้าที่ ห้ามชื่อเครื่อง พอร์ต path ชื่อตาราง หรือชื่อคู่ค้า
   */
  diagram?: Record<string, L>;
  /** การ์ดกินความกว้าง 2 คอลัมน์ (ใช้กับการ์ดที่มีแผนภาพ) */
  featured?: boolean;
  /**
   * แสดงแบบย่อในลิสต์ท้าย section — ชื่อ สรุปหนึ่งบรรทัด และ stack
   * การ์ดเต็มสิบสามใบทำให้ใบเด่นถูกกลบ และดันปุ่มติดต่อไปไกลจนไม่มีใครเลื่อนถึง
   */
  compact?: boolean;
};

export type Group = {
  title: L;
  items: string[];
};

/** กลุ่มระบบที่เคยดูแล — โชว์ความกว้าง ไม่ลงรายละเอียด */
export type DomainGroup = {
  title: L;
  items: L[];
};

/** วิธีทำงาน 1 อย่าง: ทำอะไร → ได้ผลอะไร */
export type Practice = {
  title: L;
  body: L;
  result: L;
};

export type Education = {
  school: L;
  degree: L;
  /** ไทยใช้ พ.ศ. ให้ตรงกับช่วงเวลาของงาน ไม่งั้น recruiter คำนวณช่วงห่างผิด */
  period: L;
};

export const profile = {
  name: { th: "Jerateep Saelee", en: "Jerateep Saelee" } satisfies L,
  role: {
    th: "Full-stack Developer (.NET) · ประสบการณ์ 10+ ปี · ระบบการเงินและ enterprise integration",
    en: "Full-stack Developer (.NET) · 10+ years · Enterprise Finance & Integration Systems",
  } satisfies L,
  tagline: {
    th: "พัฒนาและดูแลระบบ back-office หลักของผู้ให้บริการดาวเทียม ทั้ง approval workflow งบประมาณ, SAP integration และ SSO กลาง พร้อม support ระบบอื่นในองค์กร งานช่วงหลังรวมถึงการ migrate ระบบอายุกว่าสิบปีขึ้น .NET 8 โดยไม่มี downtime",
    en: "I build and maintain core back-office systems at a satellite operator (finance approvals, SAP integration, single sign-on) and support other systems across the organisation. Recently moved decade-old systems to .NET 8 with no downtime.",
  } satisfies L,
  location: { th: "นนทบุรี ประเทศไทย", en: "Nonthaburi, Thailand" } satisfies L,
  about: [
    {
      th: "ดูแลระบบที่เกี่ยวกับการเงินและการอนุมัติ เช่น approval workflow งบประมาณ การรับส่งข้อมูลกับ SAP และการกำหนดสิทธิ์การเข้าถึง ระบบเหล่านี้มีผู้ใช้ทั่วองค์กร การแก้ไขจึงต้องระมัดระวัง",
      en: "I maintain systems around finance and approvals: budget approval workflows, data exchange with SAP, and access permissions. People across the organisation use them, so changes need care.",
    },
    {
      th: "งานส่วนใหญ่คือการ modernize ระบบ legacy อย่างระมัดระวัง โดยตรวจ behavior จริงของระบบเทียบกับฐานข้อมูลก่อนแก้ทุกครั้ง การ upgrade หรือ migrate จึงไม่กระทบ business process เดิม ซึ่งสำคัญที่สุดกับระบบการเงินและการอนุมัติ บางระบบใช้งานมาราว 20 ปีแต่ยังต้องใช้ต่อ จึงต้องดูแลให้ไปต่อได้ ส่วนระบบใหม่เขียนด้วยเทคโนโลยีปัจจุบัน",
      en: "I modernise legacy systems carefully. Before changing anything, I check how the system really behaves against the database, so upgrades keep the business process unchanged. Some of these systems are about 20 years old and must keep running; new systems use current technology.",
    },
    {
      th: "ชอบลองเครื่องมือที่น่าจะช่วยงานของทีมได้ แล้วแบ่งปันตัวที่ใช้ได้ผลจริง เช่น Claude Code พร้อม skill และ knowledge base ที่แชร์ให้ทีมใช้ต่อ และแยก backend กับ frontend ตาม clean architecture ในระบบที่ rewrite ควบคู่กับการทำ documentation ให้ระบบที่ไม่มีเอกสาร จนเป็น reference ที่ทีมใช้งานจริง",
      en: "I like trying tools that could help the team and sharing the ones that work, such as Claude Code with shared skills and a knowledge base the team now uses. I also write documentation for undocumented systems, which the team now uses as a reference.",
    },
  ] satisfies L[],

  /** เรียงจากใหม่ → เก่า */
  experience: [
    {
      company: {
        // ใส่ทั้งชื่อใหม่และชื่อเดิม เพราะ recruiter ค้นด้วยชื่อเดิมเป็นหลัก
        // และโปรไฟล์ LinkedIn/JobsDB ยังขึ้นชื่อเดิมอยู่
        th: "Gulf Space Technology (เดิมชื่อ บมจ. ไทยคม)",
        en: "Gulf Space Technology (formerly Thaicom PCL)",
      },
      role: { th: "Full-stack Developer", en: "Full-stack Developer" },
      // เปลี่ยนตำแหน่งราวกลางปี 2022 — เจ้าของจำเดือนไม่ได้ จึงใส่แค่ปี
      period: { th: "2565 – ปัจจุบัน", en: "2022 – Present" },
      previousRoles: [
        {
          role: { th: "Senior Programmer Analyst", en: "Senior Programmer Analyst" },
          period: { th: "ธ.ค. 2561 – 2565", en: "Dec 2018 – 2022" },
        },
      ],
      summary: {
        th: "รับผิดชอบระบบ back-office หลัก และ support ระบบอื่นทั่วองค์กร ครอบคลุมงานการเงิน approval workflow, access management และ SAP integration ทั้งดูแลระบบ legacy บน Web Forms, พัฒนาระบบใหม่บน ASP.NET Core และงาน automation ทั้งฝั่ง server และ RPA",
        en: "Own the core back-office systems and support many others across finance, approvals, access management and SAP integration — spanning legacy Web Forms support, new builds on ASP.NET Core, and automation on both the server and RPA side.",
      },
      highlights: [
        {
          th: "Migrate ระบบ ASP.NET Web Forms ที่ใช้งานมากว่าสิบปีขึ้น .NET 8 และ Next.js บนฐานข้อมูลเดิม โดยไม่มี downtime",
          en: "Migrated ASP.NET Web Forms systems to .NET 8 and Next.js on the existing database, with no downtime.",
        },
        {
          th: "พัฒนาระบบ SSO กลางบน Microsoft Entra ID (OAuth 2.0) ต่อยอดจากข้อเสนอของทีม DevOps แล้วค่อย ๆ ย้ายแอปอื่นมาใช้ แทน login แยกของแต่ละแอป",
          en: "Built the central SSO on Microsoft Entra ID (OAuth 2.0), based on a DevOps team proposal, and moved apps onto it one by one to replace their separate logins.",
        },
        {
          th: "ออกแบบ permission layer ที่ให้สิทธิ์ตามโครงสร้างองค์กร (สังกัด แผนก ตำแหน่ง) แทนการ assign สิทธิ์รายคน แก้ rule จุดเดียวมีผลกับทุกแอปที่อยู่หลัง SSO",
          en: "Designed a permission layer that grants access by business unit, department and position instead of per user. One rule change applies to every app behind SSO.",
        },
        {
          th: "ออกแบบระบบ automation ด้วย Power Automate, AI Builder และ UiPath สำหรับงาน document processing และเพื่อ workaround ข้อจำกัดของ SAP ECC6",
          en: "Built automation with Power Automate, AI Builder and UiPath for document processing and to work around SAP ECC6 limits.",
        },
        {
          th: "พัฒนา web service และ flow สำหรับ sync ข้อมูลพนักงานจาก SQL Server เข้าสู่ Active Directory เพื่อทำ user provisioning และ deprovisioning แบบอัตโนมัติ",
          en: "Built a web service and flow that syncs employee data into on-premises Active Directory, automating user provisioning and deprovisioning.",
        },
        {
          th: "กำกับงาน vendor และ outsource developer ทั้ง assign งาน, code review และตรวจรับงาน และ escalate ปัญหากับ vendor ของระบบ SAP",
          en: "Supervised vendors and outsourced developers: assigning tasks, reviewing code, accepting deliverables, and escalating issues to the SAP vendor.",
        },
        {
          th: "นำ RabbitMQ มาทำ queue งาน RPA และแยก .NET API กับ Next.js ตาม clean architecture แทนโครงสร้าง monolith เดิม หลังทดลองกับงานจริงแล้วได้ผล",
          en: "After testing both on real work, introduced RabbitMQ for RPA job queues and split old monoliths into a .NET API and a Next.js front end (clean architecture).",
        },
        {
          th: "นำเครื่องมือ AI เข้ามาในกระบวนการพัฒนา ได้แก่ Claude Code พร้อม skill และ knowledge base ที่ทีมใช้ร่วมกัน ช่วย debug และ reverse-engineer ระบบ legacy",
          en: "Brought AI tools into development (Claude Code with shared skills and a knowledge base the team now uses) to help debug and reverse-engineer legacy systems.",
        },
      ],
      stack: [
        ".NET 8",
        "ASP.NET Core",
        "ASP.NET Web Forms",
        "Vue.js",
        "Next.js",
        "SQL Server",
        "RabbitMQ",
        "Python",
        "Docker",
        "SAP SOAP services",
      ],
    },
    {
      company: {
        th: "สำนักวัณโรค กรมควบคุมโรค กระทรวงสาธารณสุข",
        en: "Bureau of Tuberculosis, Ministry of Public Health",
      },
      role: { th: "Programmer", en: "Programmer" },
      period: { th: "ต.ค. 2560 – ต.ค. 2561", en: "Oct 2017 – Oct 2018" },
      summary: {
        th: "เก็บ requirement จากผู้ใช้งาน และพัฒนาทั้ง front end และ back end ด้วย C# บน .NET Framework พร้อมรับผิดชอบงานด้านฐานข้อมูลและ Active Directory",
        en: "Gathered requirements from users and developed both front end and back end in C# on .NET Framework, alongside database work and Active Directory administration.",
      },
      highlights: [
        {
          th: "พัฒนาเว็บแอปพลิเคชันด้วย C#.NET บน .NET Framework 4.5 และจัดทำ stored procedure ในฐานข้อมูล",
          en: "Developed web applications in C#.NET on .NET Framework 4.5 and wrote the database stored procedures.",
        },
        {
          th: "รับผิดชอบงานด้าน Business Intelligence ด้วย SSAS และ Tableau",
          en: "Handled business intelligence work using SSAS and Tableau.",
        },
      ],
      stack: ["C#", ".NET Framework", "SQL Server", "SSAS", "Tableau"],
    },
    {
      company: {
        th: "Ramathibodi Facilities Services",
        en: "Ramathibodi Facilities Services",
      },
      role: {
        th: "System Development and IT Support Officer",
        en: "System Development and IT Support Officer",
      },
      period: { th: "ก.ค. 2557 – ก.ย. 2560", en: "Jul 2014 – Sep 2017" },
      summary: {
        th: "รับผิดชอบสองบทบาทควบคู่กัน ได้แก่ การพัฒนาระบบภายใน และการดูแลงาน IT support ของสำนักงาน",
        en: "Held two roles concurrently: developing internal systems and running IT support for the office.",
      },
      highlights: [
        {
          th: "พัฒนาระบบ IT asset management ระบบ IT service request (C#, ASP.NET MVC, Entity Framework) และระบบลงทะเบียนงานสัมมนา",
          en: "Built an IT asset management system, an IT service request system (C#, ASP.NET MVC, Entity Framework) and a seminar registration system.",
        },
        {
          th: "ดูแล Active Directory ระบบ e-document และ G Suite รวมถึง mailbox migration งาน hardware และ network และวางแผน preventive maintenance",
          en: "Administered Active Directory, the electronic document system and G Suite (including mailbox migration), plus hardware, network and preventive-maintenance planning.",
        },
      ],
      stack: ["C#", "ASP.NET MVC", "Entity Framework", "Active Directory", "K2"],
      resumeHighlights: 1,
    },
    {
      company: {
        th: "เอสวีโอเอ (มหาชน)",
        en: "SVOA Public Company Limited",
      },
      role: { th: "IT Technician", en: "IT Technician" },
      period: { th: "ก.ค. 2556 – มี.ค. 2557", en: "Jul 2013 – Mar 2014" },
      summary: {
        th: "ให้บริการ IT support แบบ on-site ในโรงพยาบาล ครอบคลุมการดูแลอุปกรณ์ network และ issue tracking",
        en: "Provided on-site IT support in a hospital, covering equipment and network maintenance and issue tracking.",
      },
      highlights: [
        {
          th: "Support บุคลากรทางการแพทย์แบบ on-site และทำ preventive maintenance ให้อุปกรณ์ IT และ network",
          en: "Supported medical staff on site and carried out preventive maintenance on IT equipment and networks.",
        },
      ],
      stack: ["IT support", "Networking"],
      resumeHighlights: 0,
    },
  ] satisfies Job[],

  projects: [
    {
      slug: "sap-doc-pipeline",
      name: {
        th: "Pipeline ออกเอกสารจาก SAP อัตโนมัติ (end-to-end)",
        en: "Automated SAP invoice and receipt pipeline",
      },
      summary: {
        th: "ระบบที่ใหญ่ที่สุดที่ดูแลอยู่ ปรับกระบวนการออกเอกสารสำหรับลูกค้า (ใบแจ้งหนี้ ใบลดหนี้ ใบเสร็จ) จากเดิมที่ต้องสั่งพิมพ์จากระบบ ERP ทีละฉบับ มาเป็น pipeline อัตโนมัติแบบ end-to-end ตั้งแต่ใช้ robot ดึงข้อมูล, parse print-image เป็น structured data, render เอกสาร จนถึงส่งต่อเข้าระบบ billing ของคู่ค้า",
        en: "The largest system I look after. It handles customer-facing documents (invoices, credit notes, receipts) end to end: a robot retrieves the data, the print image is parsed into structured form, documents are rendered, and the results are transferred to partner billing systems — replacing a process that previously required printing each document individually from the ERP.",
      },
      role: {
        th: "ออกแบบ architecture, เลือก JasperReports มาแทนขั้นตอนเดิมที่ต้องวางข้อความลง Excel แล้วสั่งพิมพ์ PDF ทีละฉบับ และวางวิธี verify ความถูกต้อง",
        en: "Architecture, choosing JasperReports to replace the old step of pasting text into Excel and printing each PDF by hand, and the correctness verification strategy",
      },
      confidential: true,
      featured: true,
      year: "2025–2026",
      /**
       * ป้ายทุกตัวในแผนภาพ — ตำแหน่งอยู่ใน components/PipelineDiagram.tsx
       * ห้ามใส่ชื่อเครื่อง พอร์ต path ชื่อตาราง หรือชื่อระบบของคู่ค้า
       */
      diagram: {
        panelApp: { th: "เซิร์ฟเวอร์แอป", en: "APP SERVER" },
        panelWorker: { th: "เครื่องประมวลผล", en: "WORKER MACHINE" },
        panelData: { th: "SQL SERVER", en: "SQL SERVER" },

        user: { th: "ผู้ใช้", en: "User" },
        portal: { th: "เว็บพอร์ทัล", en: "Web portal" },
        portalSub: { th: "ASP.NET", en: "ASP.NET" },
        queue: { th: "RabbitMQ", en: "RabbitMQ" },
        queueSub: { th: "1 งาน = 1 message", en: "1 job = 1 message" },
        render: { th: "Render service", en: "Render service" },
        renderSub: { th: "ประกอบ payload", en: "payload builder" },
        engine: { th: "JasperReports", en: "JasperReports" },
        engineSub: { th: "PDF · HTML · DOCX", en: "PDF · HTML · DOCX" },

        consumer: { th: "Consumer", en: "Consumer" },
        consumerSub: { th: ".NET · ขนานกัน", en: ".NET · parallel" },
        robot: { th: "Power Automate", en: "Power Automate" },
        robotSub: { th: "Desktop · ขับ SAP", en: "Desktop · to SAP" },
        parser: { th: "ตัวแปลงข้อความ", en: "Parser" },
        parserSub: { th: "Python", en: "Python" },

        config: { th: "ค่าตั้งระบบ", en: "Configuration" },
        configSub: { th: "แหล่งเดียว ทับ env", en: "one source, wins" },
        blocks: { th: "คลังบล็อก", en: "Block store" },
        blocksSub: { th: "แปลงครั้งเดียว", en: "parsed once" },

        erp: { th: "SAP ECC", en: "SAP ECC" },
        erpSub: { th: "ต้นทาง print-image", en: "print-image source" },
        partner: { th: "ระบบรับบิลคู่ค้า", en: "Partner billing" },
        partnerSub: { th: "ล้มเหลว → แจ้งเตือน", en: "alerts on failure" },
        share: { th: "ไฟล์แชร์เอกสาร", en: "Document share" },
        shareSub: { th: "แยกฉบับ + รวมเล่ม", en: "per-sheet + merged" },

        eSubmit: { th: "ส่งเลขเอกสาร", en: "submit doc" },
        eEnqueue: { th: "เข้าคิว", en: "enqueue" },
        eConsume: { th: "ดึงงาน", en: "consume" },
        eTrigger: { th: "สั่งทำงาน", en: "trigger" },
        ePull: { th: "ดึง print-image", en: "pull print image" },
        eHandoff: { th: "ส่งไฟล์ต่อ", en: "hand off file" },
        eStore: { th: "เก็บโครงสร้าง", en: "store blocks" },
        eConfig: { th: "โหลดค่าตั้ง", en: "load config" },
        eRenderIngest: { th: "เรนเดอร์ตอนออกใบ", en: "render on ingest" },
        ePreview: { th: "พรีวิว", en: "preview" },
        eLoadBlocks: { th: "อ่านบล็อกเดิม", en: "load blocks" },
        eRender: { th: "เรนเดอร์", en: "render" },
        eUpload: { th: "อัปโหลดบิล", en: "upload billing" },
        eSave: { th: "บันทึกไฟล์", en: "save files" },
      } satisfies Record<string, L>,
      impact: [
        {
          th: "Re-process เอกสารย้อนหลังทั้งหมด (หลักหมื่นฉบับ) แล้ว diff กับต้นฉบับทีละฉบับจนไม่พบความแตกต่าง ก่อนเปลี่ยนมาใช้ระบบใหม่เป็น default",
          en: "Before go-live, re-ran all past documents (tens of thousands) and compared each with its original until there were zero differences.",
        },
        {
          th: "ออกแบบให้ parse print-image ครั้งเดียวแล้วเก็บเป็น structured data ทั้งขั้น render และ preview จึงอ่านจาก source เดียวกัน ลดความเสี่ยงที่ logic สองชุดจะให้ผลต่างกัน",
          en: "Settled on parse-once: the print image is read a single time into structured storage, so rendering and preview read the same source and there is no second builder to drift.",
        },
        {
          th: "ข้อมูลที่ผู้ใช้แก้เองจะถูก flag ไว้ และการ re-parse ภายหลังจะข้ามเอกสารฉบับนั้นถาวร เพื่อไม่ให้ข้อมูลที่คนตรวจแล้วถูกเขียนทับ",
          en: "Human edits are flagged, so later re-parses skip those documents permanently — work a person verified never gets overwritten.",
        },
        {
          th: "เก็บ print-image ต้นฉบับแบบ read-only เป็น audit trail ไว้ตรวจย้อนกลับเมื่อสงสัยว่า parse ข้อมูลไม่ครบ",
          en: "The original print image is kept read-only as an audit trail, so a suspected missed line can be compared against the source immediately.",
        },
        {
          th: "ทำให้ pipeline ทั้งหมดรันบนเครื่อง local ได้ด้วยคำสั่งเดียว ตรวจผลการแก้ layout ได้โดยไม่ต้องรอรอบ deploy",
          en: "The entire pipeline runs locally with a single command, allowing layout changes to be verified without waiting for a deployment cycle.",
        },
      ],
      stack: [
        "Python",
        ".NET",
        "JasperReports",
        "RabbitMQ",
        "SQL Server",
        "Docker",
        "Power Automate Desktop",
        "SAP",
      ],
    },
    {
      slug: "iam-rewrite",
      resumeImpact: 1,
      name: {
        th: "ระบบ access management ขององค์กร (rewrite)",
        en: "Enterprise access management (rewrite)",
      },
      summary: {
        th: "ย้ายระบบ menu permission ของ back-office ทั้งองค์กรจาก WebForms รุ่นเก่าขึ้น .NET 8 Web API + Next.js บนฐานข้อมูลเดิม หลักสำคัญคือให้สิทธิ์ผ่าน rule ที่อิงโครงสร้างองค์กร แทนการ assign สิทธิ์รายคน",
        en: "Lifted the organisation-wide back-office menu permission system from legacy WebForms to a .NET 8 Web API + Next.js front end on the same database. The governing principle is to grant access through org-structure rules rather than per-person assignment.",
      },
      role: { th: "Full-stack · ออกแบบและพัฒนา", en: "Full-stack · design + build" },
      confidential: true,
      year: "2025",
      flow: [
        { label: { th: "Rule ตามโครงสร้างองค์กร", en: "Org-structure rules" }, icon: "rules" },
        { label: { th: "Permission set และเมนู", en: "Permission sets" }, icon: "queue" },
        { label: { th: "ทุกแอปที่ผ่าน SSO", en: "Every app behind SSO" }, icon: "browser" },
        { label: { th: "รายงาน audit ตาม ISO", en: "ISO audit reports" }, icon: "report" },
      ],
      impact: [
        {
          th: "Onboard พนักงานใหม่ไม่ต้อง config สิทธิ์รายคนอีกต่อไป ใครเข้าเงื่อนไขของ rule ไหนก็ได้ชุดเมนูของ rule นั้นทันที",
          en: "Onboarding no longer requires per-person configuration; matching a rule grants the corresponding menu set immediately.",
        },
        {
          th: "เพิ่มชุด report สำหรับ audit ตามมาตรฐาน ISO: matrix กฎ×เมนู, เทียบสิทธิ์ระหว่างคน, หา orphan account, และ audit log",
          en: "Added ISO audit reports: rule-by-menu matrix, user access comparison, orphan-account detection and audit log.",
        },
        {
          th: "ทำหน้า My Access แบบ self-service ให้พนักงานเช็กสิทธิ์ของตัวเองได้ ลดปริมาณคำถามที่ส่งมายังทีม IT",
          en: "A self-service My Access page allows staff to review their own permissions, reducing the volume of enquiries directed to IT.",
        },
      ],
      stack: [".NET 8", "Dapper", "Next.js", "HeroUI", "SQL Server"],
    },
    {
      slug: "sso-platform",
      compact: true,
      name: {
        th: "ระบบ authentication กลางและ approval delegation",
        en: "Central authentication and approval delegation",
      },
      summary: {
        th: "Authentication service ที่ทุกระบบ back-office ใช้ร่วมกัน login ครั้งเดียวแล้วคืนทั้ง identity เมนูที่มีสิทธิ์ และ delegation chain ของการอนุมัติกลับไปให้แอป แต่ละแอปจึงไม่ต้องอ่าน permission table เอง",
        en: "The authentication service every back-office system shares. One sign-in returns the user's identity, the menus they may use, and their approval-delegation chain — so no application has to read the permission tables itself.",
      },
      role: {
        th: "ดูแลต่อเนื่อง และ integrate ระบบใหม่เข้ากับ service นี้",
        en: "Ongoing maintenance, and integrating new systems onto it",
      },
      confidential: true,
      year: "2024–2026",
      flow: [
        { label: { th: "ผู้ใช้ login ครั้งเดียว", en: "One sign-in" }, icon: "person" },
        { label: { th: "Central service ตรวจสิทธิ์", en: "Central service resolves" }, icon: "shield" },
        { label: { th: "คืนเมนูและ permission group", en: "Menus and groups returned" }, icon: "queue" },
        { label: { th: "ทุกแอปใช้ผลเดียวกัน", en: "Every app uses the same result" }, icon: "browser" },
      ],
      impact: [
        {
          th: "แอปที่ต่อเข้ามาไม่ต้องแตะ permission database โดยตรง ลดทั้งสิทธิ์ที่ต้องขอ และจุดที่ permission logic จะเพี้ยนไม่ตรงกัน",
          en: "Connected applications never touch the permission database directly, which cuts both the access they must be granted and the places where permission logic can drift apart.",
        },
        {
          th: "รองรับ approval delegation หลายแบบ ทั้งมอบให้ผู้ช่วย รักษาการตามสายงาน และมอบแบบ ad hoc ซึ่งเป็นเงื่อนไขที่ระบบอนุมัติทุกตัวต้องใช้ร่วมกัน",
          en: "Carries several kinds of approval delegation — to an assistant, by org line, and ad hoc — the conditions every approval system in the organisation depends on.",
        },
        {
          th: "ปรับให้รองรับ domain ใหม่ตอนองค์กรเปลี่ยนชื่อ โดยย้ายค่าที่เคย hardcode ในโค้ดไปเป็น config แยกตาม environment",
          en: "Extended to accept a new domain during the corporate rename, moving values that had been fixed in code into per-environment configuration.",
        },
      ],
      stack: ["ASP.NET", "SOAP", "OAuth 2.0", "SQL Server", "Active Directory"],
    },
    {
      slug: "sap-middleware",
      resumeImpact: 1,
      name: {
        th: "SAP integration middleware ของระบบ back-office",
        en: "SAP integration middleware",
      },
      summary: {
        th: "Wrap SOAP web service ของ SAP เป็น REST API ที่ระบบอื่นเรียกได้ง่าย ๆ พร้อม scheduled job ที่ดึง master data ไปป้อนระบบ downstream (ทรัพย์สิน, สินค้าคงคลัง, ลูกค้า, vendor, งบประมาณ)",
        en: "Wraps SAP's SOAP services as a REST API other systems can call, plus scheduled jobs that feed master data downstream (assets, inventory, customers, vendors, budgets).",
      },
      role: { th: "Backend · ออกแบบและพัฒนา", en: "Backend · design + build" },
      confidential: true,
      year: "2025",
      flow: [
        { label: { th: "SAP", en: "SAP" }, icon: "erp" },
        { label: { th: "REST middleware", en: "REST middleware" }, icon: "browser" },
        { label: { th: "Scheduled job", en: "Scheduled jobs" }, icon: "gear" },
        { label: { th: "ระบบ downstream", en: "Downstream systems" }, icon: "worker" },
      ],
      impact: [
        {
          th: "ระบบ downstream ไม่ต้อง integrate กับ SAP แยกกันเองอีกต่อไป เหลือจุด maintain เพียงจุดเดียว",
          en: "Removed the need for each downstream system to integrate with SAP independently, consolidating maintenance into a single point.",
        },
        {
          th: "ใช้ AI ช่วยหาวิธีเขียน XML query กับ SOAP service ที่ vendor มีอยู่แล้ว เพื่อดึงข้อมูลที่ต้องการ เช่น ข้อมูลลูกค้า โดยไม่ต้องรอทีม ABAP พัฒนา endpoint ใหม่",
          en: "Used AI to work out XML queries for the vendor's existing SOAP services (e.g. customer data), instead of waiting for the ABAP team to build new endpoints.",
        },
        {
          th: "เพิ่ม alert เมื่อ sync ข้อมูลไม่สำเร็จ ทำให้รู้ทันทีว่าข้อมูลฝั่ง downstream ยังไม่อัปเดต",
          en: "Added alerting on failed synchronisation, so a stale downstream dataset is now visible immediately.",
        },
      ],
      stack: ["ASP.NET Core", "Hangfire", "SOAP", "SQL Server", "SAP"],
    },
    {
      slug: "budget-request",
      resumeImpact: 1,
      name: {
        th: "ระบบขออนุมัติงบประมาณ",
        en: "Budget request & approval system",
      },
      summary: {
        th: "ระบบยื่นและอนุมัติคำขอใช้เงินทั้งแบบมีงบ ไม่มีงบ และโอนงบข้ามรายการ generate สายอนุมัติ (approval line) อัตโนมัติจากโครงสร้างองค์กรและวงเงิน และ escalate ผู้อนุมัติขึ้นเองเมื่อเกินงบ",
        en: "Submit and approve funding requests — budgeted, non-budgeted, and budget transfers. The approver line is generated from org structure and amount, and escalates automatically when a request goes over budget.",
      },
      role: { th: "Full-stack · พัฒนาและบำรุงรักษา", en: "Full-stack · ongoing development" },
      confidential: true,
      year: "2024–2025",
      flow: [
        { label: { th: "ยื่นคำขอ", en: "Submit request" }, icon: "form" },
        { label: { th: "ตรวจงบคงเหลือกับ SAP", en: "Check budget in SAP" }, icon: "erp" },
        { label: { th: "สายอนุมัติอัตโนมัติ", en: "Approver line" }, icon: "rules" },
        { label: { th: "อนุมัติใน portal กลาง", en: "Approve in portal" }, icon: "shield" },
      ],
      impact: [
        {
          th: "ยกเลิกขั้นตอนเดินเอกสารกระดาษทั้งหมด ผู้อนุมัติทำรายการผ่าน portal กลางได้โดยตรง",
          en: "Eliminated paper routing entirely; approvers complete the process through the central portal.",
        },
        {
          th: "ตรวจสอบยอดงบประมาณคงเหลือกับ SAP ตั้งแต่ขั้นตอนยื่นคำขอ แทนการตรวจพบเมื่อเอกสารถึงฝ่ายการเงินแล้ว",
          en: "Added a budget check against SAP at submission, instead of when the request reaches finance.",
        },
      ],
      stack: ["ASP.NET MVC", "SQL Server", "SOAP integration"],
    },
    {
      slug: "asset-management",
      compact: true,
      name: {
        th: "ระบบจัดการทรัพย์สินองค์กร",
        en: "Corporate asset management",
      },
      summary: {
        th: "ระบบติดตามทรัพย์สินตลอดอายุการใช้งาน ครอบคลุมเอกสารเจ็ดประเภท ตั้งแต่การย้ายทรัพย์สินเข้า-ออกอาคาร การโอนผู้ถือครองและ cost center ไปจนถึงการยืม คืน และต่ออายุ ทุกใบวิ่งผ่าน approval workflow และ post กลับเข้าระบบบัญชี",
        en: "Tracks assets across their working life through seven document types — moving assets in and out of the building, transferring holder and cost centre, and borrowing, returning and extending. Every document runs an approval line and posts back to the accounting system.",
      },
      role: {
        th: "พัฒนาและดูแล รวมถึง reverse-engineer กระบวนการเดิม",
        en: "Development and maintenance, including reverse-engineering the original process",
      },
      confidential: true,
      year: "2024–2026",
      flow: [
        { label: { th: "ยื่นเอกสารทรัพย์สิน", en: "Raise an asset document" }, icon: "form" },
        { label: { th: "สายอนุมัติตามประเภท", en: "Approval line per type" }, icon: "rules" },
        { label: { th: "Post กลับระบบบัญชี", en: "Post to accounting" }, icon: "erp" },
        { label: { th: "ติดตามสถานะทรัพย์สิน", en: "Track asset status" }, icon: "database" },
      ],
      impact: [
        {
          th: "ทำเอกสาร reference ของ workflow ครบทั้งเจ็ดประเภทจากโค้ดและฐานข้อมูลจริง พร้อม flowchart และตาราง owner ราย step ให้ทีมใช้ต่อได้",
          en: "Produced a workflow reference covering all seven document types, derived from the code and the live database, with flowcharts and per-step ownership for the team to work from.",
        },
        {
          th: "Asset master data sync มาจากระบบบัญชีตาม schedule อัตโนมัติ แทนการคีย์ซ้ำในสองระบบ",
          en: "Asset master data arrives from the accounting system on a schedule, instead of being keyed into two systems.",
        },
        {
          th: "แก้กรณีที่หน้าจอโอนผู้ถือครองยอมรับทรัพย์สินซ้ำและแจ้ง error ที่ไม่ตรงกับสาเหตุจริง",
          en: "Fixed a transfer screen that accepted duplicate assets and reported errors that did not match the real cause.",
        },
      ],
      stack: ["ASP.NET Web Forms", "SQL Server", "SAP", "SOAP"],
    },
    {
      slug: "logistics-inventory",
      compact: true,
      name: {
        th: "ระบบคลังสินค้าและงานขนส่ง",
        en: "Inventory and logistics",
      },
      summary: {
        th: "ระบบที่ดูแลการเบิกจ่ายและเคลื่อนย้ายสินค้าคงคลัง ต่อเนื่องไปถึงงานขนส่ง การคิดต้นทุนราย job และการวางบิล forwarder พร้อมงาน month-end close ที่ต้อง reconcile กับระบบบัญชี",
        en: "Covers stock issue and movement through to freight jobs, per-job costing, forwarder billing, and the month-end close that has to reconcile against the accounting system.",
      },
      role: {
        th: "พัฒนา และแก้ปัญหา data integrity",
        en: "Development, with a focus on data-integrity defects",
      },
      confidential: true,
      year: "2024–2026",
      flow: [
        { label: { th: "เบิกจ่ายและเคลื่อนย้าย", en: "Issue and movement" }, icon: "folder" },
        { label: { th: "งานขนส่งและต้นทุน", en: "Freight jobs and costing" }, icon: "worker" },
        { label: { th: "วางบิล forwarder", en: "Forwarder billing" }, icon: "report" },
        { label: { th: "ปิดรอบ reconcile", en: "Month-end reconciliation" }, icon: "erp" },
      ],
      impact: [
        {
          th: "ไล่แก้ bug ด้าน data integrity เช่น where condition ที่กว้างเกินจน update ผิด row และ edit path ที่ delete แล้ว insert ใหม่ทุกครั้ง ทำให้ link ระหว่างเอกสารขาด",
          en: "Worked through a set of data-integrity defects — a search condition broad enough to update the wrong rows, and an edit path that deleted and re-inserted records, severing the links between documents.",
        },
        {
          th: "วาง state machine ของวันที่ในเส้นทางขนส่งให้ชัดเจน หลังพบว่าการบันทึกวันที่บางขั้นถูกเขียนทับจนหายไป",
          en: "Defined a clear state machine for the dates along a shipment, after finding that saving one stage could overwrite and lose another.",
        },
        {
          th: "ย้ายชุด analytical table มาไว้บนฐานข้อมูลปัจจุบัน และกู้ primary key ที่หายระหว่าง migrate",
          en: "Consolidated the analytical tables onto the current database platform and restored the primary keys lost in transit.",
        },
      ],
      stack: ["ASP.NET", "SQL Server", "Oracle", "SAP"],
    },
    {
      slug: "identity-automation",
      name: {
        th: "ระบบ automation ของ account lifecycle พนักงาน",
        en: "Employee onboarding/offboarding automation",
      },
      summary: {
        th: "ทำให้งานเปิด แก้ และปิด account พนักงานทั้ง lifecycle เป็นอัตโนมัติ ตั้งแต่ onboard ไปจนถึงวันลาออก ประกอบด้วย Web API ที่สั่งงาน corporate directory และ cloud flow กว่า 30 ตัวที่ครอบคลุมทั้งพนักงานในระบบ HR พนักงานนอกระบบ และบุคคลภายนอก",
        en: "Automates the full employee account lifecycle from joining to leaving: a Web API that drives the corporate directory, plus more than thirty cloud flows covering staff in the HR system, staff outside it, and external people.",
      },
      role: {
        th: "ออกแบบและพัฒนา ทั้งฝั่ง API และฝั่ง flow",
        en: "Design and implementation, both the API and the flows",
      },
      confidential: true,
      year: "2025–2026",
      flow: [
        { label: { th: "ข้อมูลพนักงานจาก HR", en: "HR employee data" }, icon: "database" },
        { label: { th: "flow แยกตามประเภทบุคคล", en: "Flows per person type" }, icon: "rules" },
        { label: { th: "สั่งงาน directory และเมล", en: "Directory and mail actions" }, icon: "shield" },
        { label: { th: "Account, license และ mail group", en: "Accounts, licences, groups" }, icon: "contact" },
      ],
      impact: [
        {
          th: "งานวันลาออกรวมเป็น scheduled job ชุดเดียว ทั้ง disable account, ดึง license คืน, ถอดออกจาก mail group และตั้ง mail forwarding จากเดิมที่ต้องไล่ทำทีละระบบด้วยมือ",
          en: "Automated offboarding as one scheduled job (disable account, reclaim licences, remove groups, forward mail), replacing manual steps in each system.",
        },
        {
          th: "แยกเส้นทางของพนักงานในระบบ HR พนักงานนอกระบบ และบุคคลภายนอก ออกจากกัน เพราะสามกลุ่มนี้มีต้นทางข้อมูลและเงื่อนไขการหมดอายุต่างกัน",
          en: "Splits the path for HR-registered staff, staff outside the HR system, and external people, because the three differ in where their data comes from and when their access should expire.",
        },
        {
          th: "flow ที่ใหญ่ที่สุดมีกว่าร้อย step ในตัวเดียว — จัดการ mail group และสมาชิกทั้งองค์กร ซึ่งเดิมเป็นงานที่ต้องทำซ้ำทุกเดือน",
          en: "The largest single flow runs well over a hundred steps, maintaining organisation-wide mail groups and their members — work that previously recurred every month by hand.",
        },
        {
          th: "มี scheduled flow เช็ก health ของ connection ตัวเอง ทำให้รู้ก่อนที่ connector หมดอายุจะทำให้ทั้งชุดหยุดทำงาน",
          en: "A scheduled flow checks the health of its own connections, so an expiring connector is caught before it can stop the whole set.",
        },
      ],
      stack: [
        "Power Automate",
        "ASP.NET Core",
        "Microsoft Graph",
        "Active Directory",
        "PowerShell",
        "Power Apps",
        "SQL Server",
      ],
    },
    {
      slug: "enterprise-automation",
      resumeImpact: 2,
      name: {
        th: "งาน automation กลางขององค์กร",
        en: "Organisation-wide automation",
      },
      summary: {
        th: "ชุด cloud flow บน environment production ที่ทำหน้าที่เป็น glue ระหว่างระบบภายใน ครอบคลุม scheduled sync, alert, API ให้ระบบอื่นเรียก และงานรับส่งเอกสาร รวมกว่า 60 flow",
        en: "A set of production cloud flows acting as glue between internal systems — scheduled synchronisation, alerting, APIs other systems call, and document handling — more than sixty in total.",
      },
      role: {
        th: "ออกแบบ พัฒนา และดูแลต่อเนื่อง",
        en: "Design, implementation and ongoing maintenance",
      },
      confidential: true,
      year: "2024–2026",
      flow: [
        { label: { th: "Schedule และ HTTP trigger", en: "Schedules and HTTP triggers" }, icon: "gear" },
        { label: { th: "Sync ข้อมูลข้ามระบบ", en: "Cross-system sync" }, icon: "database" },
        { label: { th: "Alert ไปยังผู้ดูแล", en: "Alerts to the right people" }, icon: "mail" },
        { label: { th: "เอกสารและรายงาน", en: "Documents and reports" }, icon: "report" },
      ],
      impact: [
        {
          th: "Sync ข้อมูลพนักงานลง on-premise directory ตาม schedule ทำให้ระบบที่อ่าน directory ได้ข้อมูลตรงกันโดยไม่ต้อง integrate กับ HR เอง",
          en: "Synchronises employee data into the on-premises directory on a schedule, so every system reading from it stays consistent without integrating with HR directly.",
        },
        {
          th: "Sync การจองห้องและ resource เข้า shared calendar พร้อม flow แยกรายห้องสำหรับรับการเปลี่ยนแปลงแบบ real-time",
          en: "Synchronises room and resource bookings into the shared calendar, with a per-room flow to pick up changes as they happen.",
        },
        {
          th: "ทำ alerting endpoint กลางที่ระบบอื่นยิงเข้ามาได้ ทั้ง alert อุปกรณ์ network, สถานะงาน document processing และ mail queue ที่ค้าง แล้วส่งต่อเข้าแชตของทีมที่รับผิดชอบ",
          en: "Built a shared alert endpoint that routes network, document-processing and mail-queue alerts from other systems to the right team's chat.",
        },
        {
          th: "Wrap ข้อมูลของระบบภายในเป็น API ให้ระบบอื่นเรียกใช้ เช่น org chart และ reference data ของระบบจัดสรรทรัพยากร โดยไม่ต้องเปิดฐานข้อมูลให้กันตรง ๆ",
          en: "Wraps internal data as APIs other systems can call — the org chart, and reference data from the resource-allocation system — without exposing databases to each other.",
        },
        {
          th: "Scheduled job ที่ดึงอัตราแลกเปลี่ยนและรัน batch ฝั่ง ERP แล้วนำผลเข้าระบบ downstream ลดงานที่เคยต้องมีคนกดเองทุกวัน",
          en: "Scheduled jobs pull exchange rates and run ERP-side batches, feeding the results downstream and removing work that previously needed a person to trigger it daily.",
        },
        {
          th: "flow ส่วนใหญ่พัฒนาและดูแลเอง ภายหลังต่อเข้ากับเครื่องมือ AI ผ่าน MCP ทำให้ตรวจและแก้ไขได้สะดวกขึ้น",
          en: "Most of these flows I build and maintain myself; connecting the platform to AI tooling over MCP has made them easier to inspect and change.",
        },
      ],
      stack: [
        "Power Automate",
        "Microsoft Graph",
        "Exchange Online",
        "SharePoint",
        "SQL Server",
        "SAP",
        "REST",
      ],
    },
    {
      slug: "e-name-card",
      compact: true,
      name: {
        th: "แอปพนักงานแบบ cloud-native บน Kubernetes (นามบัตรดิจิทัล)",
        en: "Cloud-native staff app on Kubernetes (digital name card)",
      },
      summary: {
        th: "เว็บแอปที่ให้พนักงานเปิดนามบัตรดิจิทัลของตัวเองและให้คนอื่น save ลง contacts ได้ในขั้นตอนเดียว login ด้วยบัญชีองค์กร สร้าง QR code ให้รายบุคคล และเสิร์ฟข้อมูลเป็นไฟล์ contact มาตรฐานที่มือถือทุกเครื่องอ่านได้",
        en: "A web app where staff open their own digital name card and anyone can save it to their contacts in a single step. Sign-in uses the corporate account, each person gets a QR code, and the data is served as the standard contact-file format that every phone understands.",
      },
      role: {
        th: "Full-stack · ออกแบบ พัฒนา และวาง deployment",
        en: "Full-stack · design, implementation and deployment",
      },
      confidential: true,
      year: "2026",
      flow: [
        { label: { th: "Login บัญชีองค์กร", en: "Corporate sign-in" }, icon: "shield" },
        { label: { th: "นามบัตรของตัวเอง", en: "Your own card" }, icon: "contact" },
        { label: { th: "QR code รายบุคคล", en: "Personal QR code" }, icon: "qr" },
        { label: { th: "Save ลง contacts", en: "Save to contacts" }, icon: "folder" },
      ],
      impact: [
        {
          th: "Authenticate ผ่าน Microsoft Entra ID ทำให้พนักงานเห็นและแก้ได้เฉพาะนามบัตรของตัวเอง โดยไม่ต้องสร้าง user system ขึ้นมาใหม่",
          en: "Authentication through Microsoft Entra ID means each person sees and edits only their own card, without standing up a separate user system.",
        },
        {
          th: "เก็บ secret ทั้งหมดไว้ใน Azure Key Vault และดึงตอน runtime ไม่มีค่า sensitive ฝังอยู่ใน source code หรือ config file",
          en: "All secrets live in Azure Key Vault and are fetched at run time; none are embedded in source or configuration files.",
        },
        {
          th: "Ship เป็น container บน Kubernetes พร้อม CI/CD pipeline ที่ต้องมีผู้อนุมัติก่อน deploy ขึ้น production",
          en: "Ships as a container on Kubernetes, with a CI/CD pipeline that requires an approver before a production deploy.",
        },
      ],
      stack: [
        "ASP.NET Core MVC",
        ".NET 9",
        "Microsoft Entra ID",
        "Azure Key Vault",
        "Azure Blob Storage",
        "Docker",
        "Kubernetes",
      ],
    },
    {
      slug: "corporate-website",
      compact: true,
      name: {
        th: "เว็บไซต์องค์กรสองภาษาบน Webflow",
        en: "Bilingual corporate website on Webflow",
      },
      summary: {
        th: "Migrate เว็บไซต์องค์กรจาก WordPress เดิมขึ้น Webflow พร้อม restructure เนื้อหาใหม่เป็น CMS collection และรองรับสองภาษา ให้ content owner แก้เองได้โดยไม่ต้องผ่าน developer ดูแลงาน build และ maintain เอง และภายหลังต่อผ่าน MCP ทำให้แก้ไขได้สะดวกขึ้น",
        en: "Migrated the corporate website from a legacy WordPress platform to Webflow, restructuring the content into CMS collections with full bilingual support so that content owners can make changes without developer involvement. I handle the build and upkeep, and connecting it over MCP later made changes easier.",
      },
      role: {
        th: "พัฒนาและ migrate content ผ่าน API ของแพลตฟอร์มเป็นหลัก",
        en: "Implementation and content migration, primarily through the platform API",
      },
      confidential: true,
      year: "2025–2026",
      flow: [
        { label: { th: "เว็บเดิมบน WordPress", en: "Legacy WordPress site" }, icon: "wordpress" },
        { label: { th: "Extract content", en: "Extract content" }, icon: "parse" },
        { label: { th: "จัดเป็น CMS collection", en: "Into CMS collections" }, icon: "database" },
        { label: { th: "เว็บสองภาษา", en: "Bilingual site" }, icon: "globe" },
      ],
      impact: [
        {
          th: "เนื้อหาบางส่วนของเว็บเดิมไม่ปรากฏใน HTML เนื่องจากถูกโหลดผ่าน AJAX ของ plugin จึงต้องวิเคราะห์และเรียก endpoint เหล่านั้นโดยตรงเพื่อดึงข้อมูลมาให้ครบ",
          en: "Parts of the old site were not present in the HTML because a plugin loaded them over AJAX, so those endpoints were analysed and called directly to retrieve the content in full.",
        },
        {
          th: "ผูก element สำคัญของ homepage ทั้ง background video, headline และการไล่สี เข้ากับ CMS เพื่อให้ content owner ปรับเองได้",
          en: "Bound the key homepage elements — background video, headline and its colour treatment — to the CMS so content owners can adjust them directly.",
        },
        {
          th: "ทำให้หน้า listing แสดงข้อมูลได้ครบทุกรายการ โดยออกแบบเลี่ยง limit จำนวน item ต่อ Collection List ของแพลตฟอร์ม",
          en: "Made a listing page show its full dataset by designing around the platform cap on items per Collection List.",
        },
        {
          th: "รองรับงาน rebrand องค์กร ทั้ง color system โลโก้ และหน้า maintenance ระหว่างเปลี่ยนผ่าน",
          en: "Supported a corporate rebrand, covering the colour system, logo and the maintenance page used during the transition.",
        },
      ],
      stack: ["Webflow", "Webflow CMS", "JavaScript", "CSS", "Cloudflare"],
    },
    {
      slug: "employee-intranet",
      compact: true,
      name: {
        th: "อินทราเน็ตพนักงานบน Power Pages",
        en: "Employee intranet on Power Pages",
      },
      summary: {
        th: "เว็บภายในสำหรับพนักงานที่สร้างบน Power Pages โดยเก็บเนื้อหาทั้งหมดไว้ใน Dataverse และมีแอป back-office ให้ทีมสื่อสารองค์กรจัดการเองได้ ครอบคลุมข่าวสาร เอกสาร และลิงก์ระบบภายใน",
        en: "The staff-facing internal site, built on Power Pages with all content held in Dataverse and a back-office app the communications team runs themselves — news, documents and links into internal systems.",
      },
      role: {
        th: "พัฒนา ดูแล และ reverse-engineer โครงสร้างเดิม",
        en: "Development, maintenance, and reverse-engineering the existing structure",
      },
      confidential: true,
      year: "2025–2026",
      flow: [
        { label: { th: "ทีมสื่อสารจัดการเนื้อหา", en: "Comms team edits content" }, icon: "form" },
        { label: { th: "เก็บใน Dataverse", en: "Stored in Dataverse" }, icon: "database" },
        { label: { th: "Render บน Power Pages", en: "Rendered by Power Pages" }, icon: "browser" },
        { label: { th: "พนักงานเข้าถึงได้ทั่วองค์กร", en: "Reaches all staff" }, icon: "person" },
      ],
      impact: [
        {
          th: "ทำแผนผังไซต์ทั้งชุดจากตัวไซต์จริงโดยตรง ทำให้ทีมมี reference ไว้ใช้ตอนแก้ครั้งต่อไป",
          en: "Mapped the site in full, working directly from the live site, giving the team a reference to work from next time.",
        },
        {
          th: "เริ่ม rewrite ฝั่ง back office เป็นเว็บแอปที่ออกแบบตาม workflow จริงของทีมสื่อสาร แทน model-driven app เดิม",
          en: "The back office is being rewritten as a web app shaped around how the communications team actually works, replacing the original model-driven app.",
        },
        {
          th: "ทำ rebrand ทั้งไซต์ ทั้ง color system โลโก้ และชื่อที่ฝังอยู่ใน component หลายจุดของไซต์",
          en: "Applied the corporate rebrand across the site — colour system, logo, and the name embedded in components throughout it.",
        },
      ],
      stack: ["Power Pages", "Dataverse", "Power Platform", "JavaScript", "CSS"],
    },
  ] satisfies Project[],

  /** ความกว้างของงาน — ชื่อกลาง ๆ ทั้งหมด ไม่มีชื่อระบบภายใน */
  domains: [
    {
      title: { th: "การเงินและอนุมัติ", en: "Finance & approvals" },
      items: [
        { th: "ระบบขออนุมัติงบประมาณ ทั้งแบบมีงบ ไม่มีงบ และการโอนงบ", en: "Funding requests (budgeted, non-budgeted, transfers)" },
        { th: "ระบบเบิกค่าใช้จ่ายและเงินยืมทดรองของพนักงาน", en: "Employee expenses and cash advances" },
        { th: "การวิเคราะห์อายุลูกหนี้และสถานะความเสี่ยงของลูกหนี้", en: "Receivable ageing and risk-status analysis" },
        { th: "Approval portal กลางที่ทุกระบบ integrate เข้ามา", en: "Central approval portal integrated with every system" },
      ],
    },
    {
      title: { th: "ปฏิบัติการและ supply chain", en: "Operations & supply chain" },
      items: [
        { th: "ระบบจัดการทรัพย์สิน ครอบคลุมการย้าย โอน ยืม และคืน", en: "Asset management: movement, transfer, borrow, return" },
        { th: "ระบบงานขนส่งและ job costing ของ forwarder", en: "Logistics jobs and forwarder job costing" },
        { th: "ระบบจัดสรร capacity ดาวเทียมและคำขอใช้บริการ", en: "Satellite capacity allocation and service requests" },
        { th: "ระบบบริหารความเสี่ยงองค์กร", en: "Enterprise risk management" },
      ],
    },
    {
      title: { th: "แพลตฟอร์มกลาง", en: "Shared platforms" },
      items: [
        { th: "ระบบ single sign-on และการมอบอำนาจอนุมัติ", en: "Single sign-on and approval delegation" },
        { th: "ระบบ menu permission และ audit ตามมาตรฐาน ISO", en: "Menu permissions and ISO-aligned audit" },
        { th: "Mail queue กลางพร้อม delivery tracking", en: "Central mail queue with delivery tracking" },
        { th: "Middleware จองปฏิทินและจัดการ mailbox บน Microsoft 365", en: "Calendar booking and mailbox management middleware on Microsoft 365" },
      ],
    },
    {
      title: { th: "เว็บและ low-code", en: "Web & low-code" },
      items: [
        { th: "เว็บไซต์องค์กรสองภาษาบนแพลตฟอร์ม Webflow", en: "Bilingual corporate website on Webflow" },
        { th: "ระบบอินทราเน็ตพนักงานบน Dataverse และ Power Pages", en: "Employee intranet on Dataverse + Power Pages" },
        { th: "แอปพลิเคชันจัดการข้อมูลบน SharePoint ผ่าน Microsoft Graph", en: "SharePoint data-management applications via Microsoft Graph" },
        { th: "Cloud flow ที่ integrate form ฐานข้อมูล และระบบอีเมล", en: "Cloud flows integrating forms, databases and mail" },
      ],
    },
  ] satisfies DomainGroup[],

  education: [
    {
      school: {
        th: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ",
        en: "King Mongkut's University of Technology North Bangkok",
      },
      degree: {
        th: "วิทยาศาสตรบัณฑิต (วท.บ.) วิทยาการคอมพิวเตอร์",
        en: "B.Sc. Computer Science",
      },
      period: { th: "2552 – 2556", en: "2009 – 2013" },
    },
    {
      school: { th: "วิทยาลัยเทคนิคตรัง", en: "Trang Technical College" },
      degree: {
        th: "ปวช. และ ปวส. สาขาคอมพิวเตอร์ธุรกิจ",
        en: "Vocational Certificate and Higher Vocational Certificate, Business Computing",
      },
      period: { th: "2547 – 2552", en: "2004 – 2009" },
    },
  ] satisfies Education[],

  /**
   * ใบรับรอง — ใช้ชื่อทางการตามที่ผู้ออกให้เรียก เรียงจากใหม่ → เก่า
   * ตรวจสอบได้จาก credentialProfiles ด้านล่าง อย่าใส่ใบที่ลิงก์ยืนยันไม่ได้
   */
  certifications: [
    "Introduction to Security in the World of AI",
    "Create Embeddings, Vector Search, and RAG with BigQuery",
    "Deploy Multi-Agent Architectures",
    "Develop Gen AI Apps with Gemini and Streamlit",
    "Gemini for Cloud Architects",
    "Gemini for DevOps Engineers",
    "Gemini for Security Engineers",
    "Gemini for Network Engineers",
    "AI Boost Bites: Automate tasks with Gemini and Apps Script",
    "Automate Data Capture at Scale with Document AI",
    "Manage Kubernetes in Google Cloud",
    "Deploy Kubernetes Applications on Google Cloud",
    "Monitoring in Google Cloud",
    "Use APIs to Work with Cloud Storage",
    "The Basics of Google Cloud Compute",
    "Build a Website on Google Cloud",
  ],

  /** หน้าโปรไฟล์ที่ recruiter กดตรวจใบรับรองเองได้ */
  credentialProfiles: [
    {
      label: "Google Cloud Skills Boost",
      href: "https://www.skills.google/public_profiles/ff0df1b5-da13-4301-9cdc-ee3c838afa30",
    },
    {
      label: "Microsoft Learn",
      href: "https://learn.microsoft.com/en-us/users/jerateepsaelee-4053",
    },
  ],

  languages: [
    {
      name: { th: "ไทย", en: "Thai" },
      level: { th: "ภาษาแม่", en: "Native" },
    },
    {
      name: { th: "อังกฤษ", en: "English" },
      level: {
        th: "อ่านและเขียนระดับใช้งานจริง (เอกสารเทคนิค อีเมล แชต) · ยังพูดสื่อสารไม่ได้",
        en: "Reading and writing for work (technical documentation, email, chat) · not conversational in spoken English",
      },
    },
  ],

  /**
   * AI ในกระบวนการทำงานจริง — เล่าเป็น "ทำอะไร → ได้ผลอะไร"
   * เขียนเฉพาะสิ่งที่ใช้อยู่จริงและอธิบายได้ตอนสัมภาษณ์ ไม่ใส่คำสวยที่พิสูจน์ไม่ได้
   */
  aiPractice: [
    {
      title: {
        th: "Knowledge base และ playbook รายระบบ",
        en: "A knowledge base and per-system playbooks",
      },
      body: {
        th: "สิ่งที่ git history ไม่ได้บอก เช่น เหตุผลของการออกแบบ ข้อควรระวัง และข้อเท็จจริงเรื่องฐานข้อมูลและการ deploy จะบันทึกแยกตามระบบลง knowledge base กลาง และทำเป็น playbook ที่เครื่องมือ AI โหลดเองเมื่อเข้าหัวข้อนั้น เช่น webservice contract, โครงสร้าง permission และเงื่อนไขของ approval workflow",
        en: "What version history doesn't record — design rationale, pitfalls, database and deployment facts — goes into per-system notes in a central knowledge base, and into playbooks the AI tooling loads when a topic comes up: webservice contracts, permission structures, approval-flow rules.",
      },
      result: {
        th: "คำถามว่าระบบทำงานอย่างไรตอบได้ในระดับนาทีแทนครึ่งวัน และคำตอบอ้างอิง behavior จริงของระบบ ไม่ใช่ pattern ทั่วไปที่ฟังดูถูกแต่ผิดบริบท",
        en: "Questions about how a system works take minutes instead of half a day, and answers rest on documented behaviour rather than plausible general patterns.",
      },
    },
    {
      title: {
        th: "skill สำหรับงานที่ทำซ้ำ แชร์ให้ทีมใช้",
        en: "Skills for repeatable work, shared with the team",
      },
      body: {
        th: "งานที่ทำบ่อยและพลาดง่ายถูกเขียนเป็น skill ให้ AI ทำตามขั้นตอนเดิมทุกครั้ง เช่น ตั้งชื่อ branch และ commit ตามมาตรฐาน deploy ขึ้น server ผ่าน FTP โดย backup ไฟล์เดิมก่อน, test หน้าเว็บผ่าน browser จริงพร้อมเก็บ evidence และ draft เอกสาร change ตัวที่ลองจนใช้ได้แล้วแชร์ให้คนในทีมใช้ต่อ",
        en: "Frequent, error-prone work is written up as skills the AI follows the same way every time: branch and commit conventions, FTP deploys that back up the current files first, real-browser tests that capture evidence, and change-record drafting. The ones that prove themselves are shared with the team.",
      },
      result: {
        th: "ขั้นตอนประจำทำเหมือนกันทุกครั้งไม่ว่าใครเป็นคนสั่ง และคนในทีมเริ่มงานเหล่านี้ได้โดยไม่ต้องจำขั้นตอนเอง",
        en: "Routine steps run the same way whoever triggers them, and teammates can pick them up without memorising the procedure.",
      },
    },
    {
      title: {
        th: "ใช้ hook เป็น gate แทนการอาศัยความจำ",
        en: "Hooks as gates instead of memory",
      },
      body: {
        th: "กฎที่เคยต้องจำเองถูกย้ายไปเป็น hook ที่ทำงาน ณ จุดที่เกี่ยวข้อง ได้แก่ security scan ตามเกณฑ์เดียวกับ quality gate ขององค์กรก่อน push, บันทึกความรู้ลง knowledge base ทุกครั้งที่ commit และเตือนให้หยุดถามก่อนเมื่องานแตะเงิน approval workflow หรือกำลังจะสรุป behavior ของระบบ legacy โดยยังไม่ได้อ่าน source code",
        en: "Rules that used to rely on memory now run as hooks at the point they matter: a security scan against the organisation's quality-gate criteria before every push, knowledge captured at every commit, and a prompt to stop and ask when work touches money or approvals, or is about to assume legacy behaviour without reading the source.",
      },
      result: {
        th: "Bug ถูกจับได้ก่อนส่งมอบ แทนที่จะไปเจอตอน review หรือหลัง deploy",
        en: "Defects are caught before delivery rather than at review or after deployment.",
      },
    },
    {
      title: {
        th: "ต่อ AI เข้ากับแพลตฟอร์มผ่าน MCP",
        en: "Connecting AI to the platforms over MCP",
      },
      body: {
        th: "ต่อเครื่องมือ AI เข้ากับแพลตฟอร์มที่ใช้งานจริงผ่าน MCP ทั้ง Power Automate, Webflow, browser สำหรับ test และ Microsoft docs ทำให้ตรวจ flow แก้ content เว็บ และ test หน้าจอได้จากที่เดียว โดยคนยังเป็นผู้อนุมัติทุกการเปลี่ยนแปลง",
        en: "The AI tooling is connected over MCP to the platforms in daily use — Power Automate, Webflow, a browser for testing, and Microsoft's documentation — so flows can be inspected, site content changed and screens tested from one place, with a person approving every change.",
      },
      result: {
        th: "งานที่เคยต้องสลับเข้าหลายหน้าจอทำได้ในรอบเดียว และแก้ไขได้สะดวกขึ้นมาก",
        en: "Work that meant hopping between several consoles now happens in one pass, and changes are far easier to make.",
      },
    },
    {
      title: {
        th: "แบ่งงานระหว่างเครื่องมือกับผู้ตัดสินใจ",
        en: "Tooling covers breadth, judgement stays human",
      },
      body: {
        th: "มอบงานที่ใช้เวลามากแต่ไม่ต้องใช้วิจารณญาณ เช่น อ่านไฟล์จำนวนมาก เทียบ environment dev กับ production และ draft เอกสาร ให้เครื่องมือทำแบบ parallel ส่วน design decision และงานที่เกี่ยวข้องกับข้อมูลจริง จะตรวจสอบด้วยตนเองทุกครั้ง",
        en: "Work that consumes time but not judgement — reviewing large numbers of files, comparing dev against production, drafting documentation — is delegated to run in parallel. Design decisions and anything touching production data are always reviewed personally first.",
      },
      result: {
        th: "งาน reverse-engineering ที่เดิมใช้เวลาหลายวัน เสร็จภายใน session เดียว โดยยังคงมีผู้รับผิดชอบผลลัพธ์",
        en: "Reverse-engineering that previously took days is completed within a single working session, with a person remaining accountable for the result.",
      },
    },
    {
      title: {
        th: "ต่อ AI เข้ากับระบบงานจริง ไม่ใช่แค่ในเอดิเตอร์",
        en: "Wiring AI into the systems of record, not just the editor",
      },
      body: {
        th: "ทุก release ขึ้น production ต้องเปิดเอกสาร change ในระบบ ITSM ทุกครั้ง ซึ่งเดิมเป็นงานเขียนซ้ำ ๆ จึงต่อ API ของระบบนั้นเข้ากับกระบวนการ แล้วให้ AI ประกอบเนื้อหาจากสิ่งที่แก้จริง ทั้งรายการไฟล์ database script, implementation plan, rollback plan และ test plan ก่อนเปิดเป็น draft รอคนตรวจ",
        en: "Every production release requires a change record in the ITSM system, which was repetitive writing. The system API is now wired into the process and AI assembles the content from what actually changed — file list, database steps, implementation, backout and test plans — opening it as a draft for a person to review.",
      },
      result: {
        th: "เอกสาร change ตรงกับสิ่งที่แก้จริงเสมอ เพราะสร้างจาก diff ไม่ใช่จากความจำ และคนยังเป็นผู้ตรวจและกดส่งเองทุกฉบับ",
        en: "The change record always matches what was actually changed, because it is generated from the diff rather than from memory — and a person still reviews and submits every one.",
      },
    },
  ] satisfies Practice[],

  /**
   * ทักษะแกนหลัก — หน้าเว็บจะเน้นให้เด่นกว่าตัวอื่น
   * มี 40+ chip ถ้าน้ำหนักเท่ากันหมด คนกวาดตาแล้วจับไม่ได้ว่าถนัดอะไรจริง
   */
  coreSkills: [
    "C#",
    "ASP.NET Core",
    ".NET Framework 2.0 – .NET 10",
    "SQL Server",
    "Power Automate",
  ],

  skills: [
    {
      title: { th: "หลัก", en: "Core" },
      items: ["C#", "TypeScript", "SQL", "Python", "JavaScript"],
    },
    {
      title: { th: "Backend", en: "Backend" },
      items: [".NET Framework 2.0 / 3.5 / 4.x", ".NET Core 1 – 3.1", ".NET 5 / 6 / 8 / 10", "ASP.NET Core", "ASP.NET Web Forms", "Dapper", "EF Core", "REST", "SOAP"],
    },
    {
      title: { th: "Frontend", en: "Frontend" },
      items: ["Vue.js", "Next.js", "React", "Tailwind CSS", "HeroUI", "HTML/CSS"],
    },
    {
      title: { th: "ฐานข้อมูล", en: "Databases" },
      items: ["SQL Server", "MySQL", "MariaDB", "Oracle"],
    },
    {
      title: { th: "Infra และ DevOps", en: "Infra & DevOps" },
      items: ["Docker", "Portainer", "RabbitMQ", "Hangfire", "Git", "GitLab CI", "Nginx", "Azure Key Vault", "Azure Blob Storage"],
    },
    {
      title: { th: "AI engineering", en: "AI engineering" },
      items: [
        "Claude Code",
        "Skills & hooks",
        "MCP servers",
        "Agent workflows",
        "Prompt/context engineering",
        "Automated code review",
      ],
    },
    {
      title: { th: "Enterprise และ automation", en: "Enterprise & automation" },
      items: [
        "SAP SOAP services (consumer)",
        "Active Directory",
        "Microsoft Entra ID",
        "Microsoft Graph",
        "ServiceNow API",
        "Power Automate",
        "Power Apps",
        "Power Pages",
        "AI Builder",
        "Dataverse",
        "UiPath",
        "Webflow",
      ],
    },
  ] satisfies Group[],

  /** เบอร์โทรจงใจไม่ใส่ — หน้าเว็บสาธารณะคือแหล่งเก็บเบอร์ของบอทสแปม */
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jerateep-saelee-2b4b8bb2/",
    },
    { label: "GitHub", href: "https://github.com/jerateep" },
    { label: "Email", href: "mailto:jerateep_@live.com" },
  ],
} as const;

export type Profile = typeof profile;

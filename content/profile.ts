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
  /**
   * ป้ายในแผนภาพสถาปัตยกรรม (ตำแหน่งอยู่ในคอมโพเนนต์)
   * เรียกทุกอย่างตามหน้าที่ ห้ามชื่อเครื่อง พอร์ต path ชื่อตาราง หรือชื่อคู่ค้า
   */
  diagram?: Record<string, L>;
  /** การ์ดกินความกว้าง 2 คอลัมน์ (ใช้กับการ์ดที่มีแผนภาพ) */
  featured?: boolean;
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
  period: string;
};

export const profile = {
  name: { th: "Jerateep Saelee", en: "Jerateep Saelee" } satisfies L,
  role: {
    th: "Full-stack Developer · ประสบการณ์ 10+ ปี · Back-office & Automation",
    en: "Full-stack Developer · 10+ years · Back-office & Automation",
  } satisfies L,
  tagline: {
    th: "พัฒนาและดูแลระบบ back-office ระดับองค์กรด้วย .NET, Next.js และ SQL Server ควบคู่กับงาน automation และการประยุกต์ใช้ AI ในกระบวนการพัฒนา",
    en: "Developing and maintaining enterprise back-office systems with .NET, Next.js and SQL Server, alongside automation and the applied use of AI within the development process.",
  } satisfies L,
  location: { th: "นนทบุรี ประเทศไทย", en: "Nonthaburi, Thailand" } satisfies L,
  /** TODO: ยืนยันว่ารับงานแบบไหนบ้าง และพร้อมเริ่มเมื่อไหร่ */
  available: {
    th: "เปิดรับงานประจำและงานฟรีแลนซ์",
    en: "Open to full-time roles and freelance work",
  } satisfies L,

  about: [
    {
      th: "Full Stack Developer ประสบการณ์กว่า 10 ปี รับผิดชอบระบบ back-office หลักราวสิบระบบ ครอบคลุมงานเอกสารและสายอนุมัติงบประมาณ ระบบสิทธิ์การเข้าถึง ระบบเชื่อมต่อ SAP และงาน automation และให้การสนับสนุนระบบ back-office อื่นอีกกว่า 20 ระบบในองค์กรเดียวกัน",
      en: "A Full Stack Developer with over 10 years of experience, owning around ten core back-office systems — document and budget-approval workflows, access management, SAP integration and automation — and supporting more than twenty further back-office systems across the same organisation.",
    },
    {
      th: "มีความเชี่ยวชาญเฉพาะด้านระบบ legacy ที่ไม่มีเอกสารประกอบ โดยใช้วิธีตรวจสอบพฤติกรรมจริงของระบบเทียบกับฐานข้อมูลก่อนแก้ไขทุกครั้ง เพื่อให้การปรับปรุงหรือย้ายระบบไม่กระทบกระบวนการทางธุรกิจเดิม โดยเฉพาะระบบที่เกี่ยวข้องกับการเงินและการอนุมัติซึ่งต้องการความถูกต้องสมบูรณ์",
      en: "Specialised in undocumented legacy systems, verifying actual system behaviour against the database before any modification so that upgrades and migrations preserve the existing business process — particularly for systems handling finance and approvals, where correctness is non-negotiable.",
    },
    {
      th: "ให้ความสำคัญกับการจัดทำเอกสารควบคู่กับการพัฒนา ทั้งการ reverse-engineer ระบบเดิมให้เป็นเอกสารอ้างอิง และการกำหนดมาตรฐานการทำงานร่วมกันของทีม เพื่อลดเวลาที่ต้องใช้ในการทำความเข้าใจระบบสำหรับผู้ที่รับช่วงงานต่อ",
      en: "Places equal weight on documentation: reverse-engineering existing systems into reference material and establishing team conventions, reducing the time required for others to take the work forward.",
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
      role: { th: "Full Stack Developer", en: "Full Stack Developer" },
      period: { th: "ธ.ค. 2561 – ปัจจุบัน", en: "Dec 2018 – Present" },
      summary: {
        th: "รับผิดชอบการพัฒนาและบำรุงรักษาระบบ back-office ที่ใช้งานทั่วทั้งองค์กร ครอบคลุมทั้งการดูแลระบบเดิมบน ASP.NET Web Forms และการพัฒนาระบบใหม่บน ASP.NET Core ในส่วนของงานเอกสารและสายอนุมัติ ระบบสิทธิ์การเข้าถึง ระบบเชื่อมต่อ SAP และงาน automation ทั้งฝั่งเซิร์ฟเวอร์และ RPA",
        en: "Responsible for developing and maintaining the back-office systems used across the organisation, covering both legacy ASP.NET Web Forms support and new development on ASP.NET Core: document and approval workflows, access management, SAP integration middleware, and automation on both the server and RPA side.",
      },
      highlights: [
        {
          th: "ย้ายระบบ ASP.NET Web Forms ที่ใช้งานมากว่าสิบปีขึ้นสู่ .NET 8 และ Next.js โดยใช้ฐานข้อมูลเดิมต่อเนื่อง และไม่มีการหยุดให้บริการ",
          en: "Migrated decade-old ASP.NET Web Forms systems to .NET 8 and Next.js on the existing database, without service interruption.",
        },
        {
          th: "ออกแบบชั้นการจัดการสิทธิ์ที่กำหนดสิทธิ์ตามโครงสร้างองค์กร (สังกัด แผนก ตำแหน่ง) แทนการผูกสิทธิ์รายบุคคล การแก้ไขกฎเพียงจุดเดียวมีผลกับทุกแอปพลิเคชันที่ใช้ SSO",
          en: "Designed a permission layer granting access by organisational attributes (business unit, department, position) rather than per-user assignment; a single rule change propagates to every application behind SSO.",
        },
        {
          th: "ออกแบบระบบ automation ด้วย Power Automate, AI Builder และ UiPath สำหรับงานประมวลผลเอกสาร และเพื่อรองรับข้อจำกัดของระบบ SAP ECC6",
          en: "Architected automation with Power Automate, AI Builder and UiPath for document processing and to work around limits of the SAP ECC6 system.",
        },
        {
          th: "ปรับปรุงระบบยืนยันตัวตนของแอปพลิเคชันเดิมให้รองรับ Microsoft Entra ID (OAuth 2.0) รองรับการล็อกอินครั้งเดียวใช้งานได้ทุกระบบ และยกระดับความปลอดภัย",
          en: "Modernised legacy application authentication onto Microsoft Entra ID (OAuth 2.0), enabling single sign-on and tightening security.",
        },
        {
          th: "พัฒนา web service และ flow สำหรับ sync ข้อมูลพนักงานจาก SQL Server เข้าสู่ Active Directory เพื่อให้การเปิดและปิดบัญชีผู้ใช้เป็นไปโดยอัตโนมัติ",
          en: "Built a web service and flow that syncs employee data into on-premise Active Directory, automating user provisioning and deprovisioning.",
        },
        {
          th: "ประสานงานกับผู้รับเหมาและผู้ขายภายนอก ครอบคลุมการมอบหมายงาน การตรวจทานโค้ด และการติดตามการแก้ไขปัญหากับผู้ขายระบบ SAP",
          en: "Coordinated with external vendors and outsourced teams, covering task assignment, code review, and issue-resolution tracking with the SAP system vendor.",
        },
        {
          th: "ประยุกต์ใช้เครื่องมือ AI ในกระบวนการพัฒนาซอฟต์แวร์เพื่อช่วยตรวจหาและวิเคราะห์ข้อผิดพลาด ส่งผลให้ส่งมอบงานได้เร็วขึ้น",
          en: "Applied AI tooling within the software development lifecycle to assist with debugging and troubleshooting, reducing delivery time.",
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
        "SAP",
      ],
    },
    {
      company: {
        th: "สำนักวัณโรค กรมควบคุมโรค กระทรวงสาธารณสุข",
        en: "Bureau of Tuberculosis, Ministry of Public Health",
      },
      role: { th: "Programmer", en: "Programmer" },
      period: { th: "ต.ค. 2560 – ต.ค. 2561 · กรุงเทพฯ", en: "Oct 2017 – Oct 2018 · Bangkok" },
      summary: {
        th: "รวบรวมความต้องการจากผู้ใช้งานและพัฒนาทั้งส่วนหน้าและส่วนหลังด้วย C# บน .NET Framework พร้อมรับผิดชอบงานด้านฐานข้อมูลและ Active Directory",
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
      period: { th: "ก.ค. 2558 – ก.ย. 2560", en: "Jul 2015 – Sep 2017" },
      summary: {
        th: "รับผิดชอบสองบทบาทควบคู่กัน ได้แก่ การพัฒนาระบบภายใน และการดูแลงาน IT support ของสำนักงาน",
        en: "Held two roles concurrently: developing internal systems and running IT support for the office.",
      },
      highlights: [
        {
          th: "พัฒนาระบบจัดการทรัพย์สิน IT ระบบรับคำขอบริการ IT (C#, ASP.NET MVC, Entity Framework) และระบบลงทะเบียนงานสัมมนา",
          en: "Built an IT asset management system, an IT service request system (C#, ASP.NET MVC, Entity Framework) and a seminar registration system.",
        },
        {
          th: "ดูแล Active Directory ระบบเอกสารอิเล็กทรอนิกส์ และ G Suite รวมถึงการย้ายข้อมูลอีเมล งานด้าน hardware และเครือข่าย และการจัดทำแผนบำรุงรักษาเชิงป้องกัน",
          en: "Administered Active Directory, the electronic document system and G Suite (including mailbox migration), plus hardware, network and preventive-maintenance planning.",
        },
      ],
      stack: ["C#", "ASP.NET MVC", "Entity Framework", "Active Directory", "K2"],
    },
    {
      company: {
        th: "เอสวีโอเอ (มหาชน)",
        en: "SVOA Public Company Limited",
      },
      role: { th: "IT Technician", en: "IT Technician" },
      period: { th: "ก.ค. 2556 – มี.ค. 2557", en: "Jul 2013 – Mar 2014" },
      summary: {
        th: "ให้บริการ IT support ณ สถานที่ปฏิบัติงานในโรงพยาบาล ครอบคลุมการดูแลอุปกรณ์ เครือข่าย และระบบติดตามปัญหา",
        en: "Provided on-site IT support in a hospital, covering equipment and network maintenance and issue tracking.",
      },
      highlights: [
        {
          th: "สนับสนุนบุคลากรทางการแพทย์ ณ สถานที่ปฏิบัติงาน และดำเนินการบำรุงรักษาเชิงป้องกันของอุปกรณ์และเครือข่าย",
          en: "Supported medical staff on site and carried out preventive maintenance on IT equipment and networks.",
        },
      ],
      stack: ["IT support", "Networking"],
    },
  ] satisfies Job[],

  projects: [
    {
      slug: "sap-doc-pipeline",
      name: {
        th: "ระบบผลิตเอกสารจาก SAP อัตโนมัติ (end-to-end)",
        en: "End-to-end SAP document production pipeline",
      },
      summary: {
        th: "ระบบขนาดใหญ่ที่สุดที่รับผิดชอบ ปรับกระบวนการออกเอกสารสำหรับลูกค้า (ใบแจ้งหนี้ ใบลดหนี้ ใบเสร็จ) จากเดิมที่ต้องสั่งพิมพ์จากระบบ ERP ทีละฉบับ มาเป็น pipeline อัตโนมัติแบบครบวงจร ตั้งแต่การดึงข้อมูลด้วย robot การแปลง print-image เป็นข้อมูลเชิงโครงสร้าง การเรนเดอร์เอกสาร จนถึงการส่งต่อให้ระบบรับบิลของคู่ค้า",
        en: "The largest system under my responsibility. It handles customer-facing documents (invoices, credit notes, receipts) end to end: a robot retrieves the data, the print image is parsed into structured form, documents are rendered, and the results are transferred to partner billing systems — replacing a process that previously required printing each document individually from the ERP.",
      },
      role: {
        th: "ออกแบบสถาปัตยกรรม พัฒนาทั้งสามภาษา และกำหนดวิธีตรวจสอบความถูกต้อง",
        en: "Architecture, implementation across three languages, and the correctness verification strategy",
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
          th: "ประมวลผลเอกสารย้อนหลังทั้งคลัง (หลักหมื่นฉบับ) และตรวจเทียบกับต้นฉบับรายฉบับจนไม่พบความแตกต่าง ก่อนเปลี่ยนมาใช้ระบบใหม่เป็นค่าเริ่มต้น",
          en: "Re-processed the entire back catalogue (tens of thousands of documents) and diffed every one against its original to zero differences before the new path became the default.",
        },
        {
          th: "ออกแบบให้อ่าน print-image เพียงครั้งเดียวแล้วจัดเก็บเป็นข้อมูลเชิงโครงสร้าง ทั้งขั้นตอนออกเอกสารและขั้นตอนแสดงตัวอย่างจึงอ่านจากแหล่งข้อมูลเดียวกัน ลดความเสี่ยงที่ตรรกะสองชุดจะให้ผลลัพธ์ต่างกัน",
          en: "Settled on parse-once: the print image is read a single time into structured storage, so rendering and preview read the same source and there is no second builder to drift.",
        },
        {
          th: "ข้อมูลที่ผู้ใช้แก้ไขเองจะถูกทำเครื่องหมายไว้ และการประมวลผลซ้ำในภายหลังจะข้ามเอกสารฉบับนั้นอย่างถาวร เพื่อไม่ให้ข้อมูลที่ผ่านการตรวจสอบโดยบุคคลถูกเขียนทับ",
          en: "Human edits are flagged, so later re-parses skip those documents permanently — work a person verified never gets overwritten.",
        },
        {
          th: "จัดเก็บ print-image ต้นฉบับแบบอ่านอย่างเดียวเพื่อใช้เป็น audit trail สำหรับตรวจสอบย้อนกลับเมื่อสงสัยว่าการอ่านข้อมูลไม่ครบถ้วน",
          en: "The original print image is kept read-only as an audit trail, so a suspected missed line can be compared against the source immediately.",
        },
        {
          th: "จัดให้ pipeline ทั้งหมดรันบนเครื่องนักพัฒนาได้ด้วยคำสั่งเดียว ทำให้ตรวจผลการแก้ไข layout ได้โดยไม่ต้องรอรอบ deploy",
          en: "The entire pipeline runs locally with a single command, allowing layout changes to be verified without waiting for a deployment cycle.",
        },
      ],
      stack: [
        "Python",
        ".NET",
        "Java",
        "RabbitMQ",
        "SQL Server",
        "Docker",
        "Power Automate Desktop",
        "SAP",
      ],
    },
    {
      slug: "iam-rewrite",
      name: {
        th: "ระบบจัดการสิทธิ์เข้าถึงองค์กร (เขียนใหม่)",
        en: "Enterprise access management (rewrite)",
      },
      summary: {
        th: "ยกระบบสิทธิ์เมนูของ back-office ทั้งองค์กรจาก WebForms รุ่นเก่าขึ้น .NET 8 Web API + Next.js โดยใช้ฐานข้อมูลเดิม หลักการสำคัญคือการให้สิทธิ์ตามกฎที่อ้างอิงโครงสร้างองค์กร แทนการกำหนดสิทธิ์รายบุคคล",
        en: "Lifted the organisation-wide back-office menu permission system from legacy WebForms to a .NET 8 Web API + Next.js front end on the same database. The governing principle is to grant access through org-structure rules rather than per-person assignment.",
      },
      role: { th: "Full-stack · ออกแบบและพัฒนา", en: "Full-stack · design + build" },
      confidential: true,
      year: "2025",
      impact: [
        {
          th: "การเพิ่มพนักงานใหม่ไม่ต้องกำหนดสิทธิ์รายบุคคลอีกต่อไป ผู้ใช้ที่เข้าเงื่อนไขของกฎใดจะได้รับชุดเมนูของกฎนั้นทันที",
          en: "Onboarding no longer requires per-person configuration; matching a rule grants the corresponding menu set immediately.",
        },
        {
          th: "เพิ่มชุด report สำหรับ audit ตามมาตรฐาน ISO: matrix กฎ×เมนู, เทียบสิทธิ์ระหว่างคน, หา orphan account, และ audit log",
          en: "Added an ISO-audit reporting set: rule×menu matrix, access comparison between users, orphan-account detection, and audit logging.",
        },
        {
          th: "จัดทำหน้า My Access ให้พนักงานตรวจสอบสิทธิ์ของตนเองได้ ลดปริมาณคำถามที่ส่งมายังทีม IT",
          en: "A self-service My Access page allows staff to review their own permissions, reducing the volume of enquiries directed to IT.",
        },
      ],
      stack: [".NET 8", "Dapper", "Next.js", "HeroUI", "SQL Server"],
    },
    {
      slug: "sap-middleware",
      name: {
        th: "ตัวกลางคุย SAP ของระบบหลังบ้าน",
        en: "SAP integration middleware",
      },
      summary: {
        th: "ห่อ SOAP web service ของ SAP ให้กลายเป็น REST ที่ระบบอื่นเรียกง่าย ๆ พร้อม job ตามเวลาที่ดึง master data ไปป้อนระบบปลายน้ำ (ทรัพย์สิน, สินค้าคงคลัง, ลูกค้า, ผู้ขาย, งบประมาณ)",
        en: "Wraps SAP's SOAP services as a REST API other systems can call, plus scheduled jobs that feed master data downstream (assets, inventory, customers, vendors, budgets).",
      },
      role: { th: "Backend · ออกแบบและพัฒนา", en: "Backend · design + build" },
      confidential: true,
      year: "2025",
      impact: [
        {
          th: "ระบบปลายทางไม่ต้องเชื่อมต่อ SAP แยกกันอีกต่อไป เหลือจุดดูแลรักษาเพียงจุดเดียว",
          en: "Removed the need for each downstream system to integrate with SAP independently, consolidating maintenance into a single point.",
        },
        {
          th: "เพิ่มช่องทางอ่านตาราง SAP โดยตรงสำหรับข้อมูลที่ service เดิมเข้าถึงไม่ได้ ลดการพึ่งพาการพัฒนาเพิ่มเติมจากทีม ABAP",
          en: "Added a direct table-read path for data the existing services couldn't see, removing the wait on the ABAP team for new endpoints.",
        },
        {
          th: "แก้ไขจุดตรวจสอบที่ทำให้การ sync ข้อมูลหยุดทำงานโดยไม่มีการแจ้งเตือน ซึ่งเดิมทำให้ไม่ทราบว่าข้อมูลไม่ถูกส่งมา",
          en: "Closed a failure gate that allowed synchronisation to stall without notification, a condition that previously went undetected.",
        },
      ],
      stack: ["ASP.NET Core", "Hangfire", "SOAP", "SQL Server", "SAP"],
    },
    {
      slug: "budget-request",
      name: {
        th: "ระบบขออนุมัติงบประมาณ",
        en: "Budget request & approval system",
      },
      summary: {
        th: "ระบบยื่นและอนุมัติคำขอใช้เงินทั้งแบบมีงบ ไม่มีงบ และโอนงบข้ามรายการ สร้างสายอนุมัติอัตโนมัติจากโครงสร้างองค์กรและวงเงิน พร้อมยกระดับผู้อนุมัติเองเมื่อเกินงบ",
        en: "Submit and approve funding requests — budgeted, non-budgeted, and budget transfers. The approver line is generated from org structure and amount, and escalates automatically when a request goes over budget.",
      },
      role: { th: "Full-stack · พัฒนาและบำรุงรักษา", en: "Full-stack · ongoing development" },
      confidential: true,
      year: "2024–2025",
      impact: [
        {
          th: "ยกเลิกขั้นตอนเดินเอกสารกระดาษทั้งหมด ผู้อนุมัติดำเนินการผ่านพอร์ทัลกลางได้โดยตรง",
          en: "Eliminated paper routing entirely; approvers complete the process through the central portal.",
        },
        {
          th: "ตรวจสอบยอดงบประมาณคงเหลือกับ SAP ตั้งแต่ขั้นตอนยื่นคำขอ แทนการตรวจพบเมื่อเอกสารถึงฝ่ายการเงินแล้ว",
          en: "Validates remaining budget against SAP at submission, rather than at the point the request reaches finance.",
        },
      ],
      stack: ["ASP.NET MVC", "SQL Server", "SOAP integration"],
    },
    {
      slug: "ad-provisioning",
      name: {
        th: "ระบบจัดการบัญชีผู้ใช้อัตโนมัติ",
        en: "Automated account provisioning",
      },
      summary: {
        th: "Web API ที่ดูแลวงจรชีวิตบัญชีผู้ใช้ — สร้าง แก้ ปิด และ sync ข้อมูลพนักงานจากระบบ HR เข้า directory ขององค์กร รวมถึงจัดการ mail contact และการส่งต่อเมล",
        en: "A Web API that owns the account lifecycle — create, update, disable — and syncs employee attributes from HR into the corporate directory, including mail contacts and forwarding.",
      },
      role: { th: "Backend · พัฒนาและแก้ไขปัญหาการใช้งาน", en: "Backend · development and troubleshooting" },
      confidential: true,
      year: "2025",
      impact: [
        {
          th: "เปลี่ยนงาน onboarding และ offboarding จากการดำเนินการด้วยมือทีละบัญชี เป็นกระบวนการอัตโนมัติที่ทำงานตามข้อมูลจากระบบ HR",
          en: "Onboarding and offboarding moved from per-account manual work to an automated job driven by HR data.",
        },
        {
          th: "แก้ไขกรณีที่งานรายงานผลสำเร็จทั้งที่ directory ปฏิเสธคำสั่ง อันเกิดจากการอ่านผลลัพธ์ไม่ครบทุกช่องทาง",
          en: "Fixed a case where the job reported success while the directory had rejected the command, because only one of the two output streams was being read.",
        },
      ],
      stack: ["ASP.NET Core", "PowerShell", "SSH", "Active Directory", "Docker"],
    },
    {
      slug: "corporate-website",
      name: {
        th: "เว็บไซต์องค์กรสองภาษาบน Webflow",
        en: "Bilingual corporate website on Webflow",
      },
      summary: {
        th: "ย้ายเว็บไซต์องค์กรจาก WordPress เดิมขึ้นแพลตฟอร์ม Webflow พร้อมจัดโครงสร้างเนื้อหาใหม่เป็น CMS collection และรองรับสองภาษา โดยให้เจ้าของเนื้อหาแก้ไขเองได้โดยไม่ต้องผ่านนักพัฒนา",
        en: "Migrated the corporate website from a legacy WordPress platform to Webflow, restructuring the content into CMS collections with full bilingual support so that content owners can make changes without developer involvement.",
      },
      role: {
        th: "พัฒนาและย้ายข้อมูล ผ่าน API เป็นหลัก",
        en: "Implementation and content migration, primarily through the platform API",
      },
      confidential: true,
      year: "2025–2026",
      impact: [
        {
          th: "เนื้อหาบางส่วนของเว็บเดิมไม่ปรากฏใน HTML เนื่องจากถูกโหลดผ่าน AJAX ของปลั๊กอิน จึงต้องวิเคราะห์และเรียก endpoint เหล่านั้นโดยตรงเพื่อดึงข้อมูลมาให้ครบ",
          en: "Parts of the old site were not present in the HTML because a plugin loaded them over AJAX, so those endpoints were analysed and called directly to retrieve the content in full.",
        },
        {
          th: "ออกแบบให้องค์ประกอบสำคัญของหน้าแรก ทั้งวิดีโอพื้นหลัง ข้อความหลัก และการไล่สี ผูกกับ CMS เพื่อให้เจ้าของเนื้อหาปรับเองได้",
          en: "Bound the key homepage elements — background video, headline and its colour treatment — to the CMS so content owners can adjust them directly.",
        },
        {
          th: "แก้กรณีหน้ารายการแสดงข้อมูลไม่ครบ เนื่องจากข้อจำกัดจำนวนรายการต่อ Collection List ของแพลตฟอร์ม ซึ่งไม่มีการแจ้งเตือนใด ๆ",
          en: "Resolved a case where a listing page showed incomplete data due to a platform cap on items per Collection List, a limit that surfaces no warning.",
        },
        {
          th: "รองรับงานเปลี่ยนอัตลักษณ์องค์กร ทั้งชุดสี โลโก้ และหน้าแจ้งปิดปรับปรุงระหว่างเปลี่ยนผ่าน",
          en: "Supported a corporate rebrand, covering the colour system, logo and the maintenance page used during the transition.",
        },
      ],
      stack: ["Webflow", "Webflow CMS", "JavaScript", "CSS", "Cloudflare"],
    },
    {
      slug: "power-platform-automation",
      name: {
        th: "งาน automation บน Power Platform",
        en: "Automation on the Power Platform",
      },
      summary: {
        th: "ออกแบบและพัฒนา cloud flow ที่เชื่อม Microsoft Forms, SQL Server, Exchange Online และ Active Directory เข้าด้วยกัน ครอบคลุมทั้งงานประมวลผลแบบทดสอบพนักงาน งานแจ้งเตือน และงานอ่านข้อมูลจากเอกสารด้วย AI Builder",
        en: "Designed and built cloud flows connecting Microsoft Forms, SQL Server, Exchange Online and Active Directory, covering employee assessment processing, notifications, and document data capture with AI Builder.",
      },
      role: { th: "ออกแบบและพัฒนา flow", en: "Flow design and implementation" },
      confidential: true,
      year: "2025–2026",
      impact: [
        {
          th: "flow ตรวจคะแนนแบบทดสอบจรรยาบรรณพนักงานเทียบกับเฉลย บันทึกผลลง SQL Server และส่งอีเมลแจ้งผลให้ผู้ทำแบบทดสอบโดยอัตโนมัติ รองรับทั้งฉบับภาษาไทยและภาษาอังกฤษ",
          en: "A flow scores employee code-of-conduct assessments against the answer key, records results in SQL Server, and emails the outcome to each respondent automatically, in both Thai and English editions.",
        },
        {
          th: "ผลที่บันทึกไว้ถูกนำไปใช้ในรายงานติดตามความคืบหน้ารายหน่วยงาน สำหรับรายงานต่อคณะกรรมการ",
          en: "The recorded results feed a completion-tracking report broken down by business unit for reporting to the governing committee.",
        },
        {
          th: "ย้ายการส่งอีเมลของระบบคิวเมลกลางมาใช้ cloud flow และเพิ่มการอ้างอิงข้ามระบบ เพื่อให้ติดตามอีเมลที่ส่งไม่สำเร็จกลับไปยังรายการต้นทางได้",
          en: "Moved the central mail queue's delivery onto a cloud flow and added cross-system references so bounced mail can be traced back to the originating record.",
        },
        {
          th: "ใช้ AI Builder อ่านข้อมูลจากเอกสารเพื่อลดงานคีย์ข้อมูลด้วยมือ และใช้ร่วมกับ UiPath ในงานที่ระบบ ERP ไม่เปิดช่องทางให้เชื่อมต่อโดยตรง",
          en: "Applied AI Builder to extract data from documents, reducing manual entry, and combined it with UiPath where the ERP offered no direct integration path.",
        },
      ],
      stack: [
        "Power Automate",
        "AI Builder",
        "Microsoft Forms",
        "SQL Server",
        "Microsoft Graph",
        "UiPath",
      ],
    },
    {
      slug: "freelance",
      name: {
        th: "งานฟรีแลนซ์ผ่าน Fastwork",
        en: "Freelance work via Fastwork",
      },
      summary: {
        th: "รับพัฒนาเว็บไซต์และระบบภายในให้ลูกค้าองค์กร ครอบคลุมตั้งแต่การเก็บความต้องการ การออกแบบ การพัฒนา จนถึงการส่งมอบและดูแลต่อเนื่อง",
        en: "Web and internal-system development for business clients — from requirements and design through build, delivery, and ongoing support.",
      },
      role: { th: "ฟรีแลนซ์ · รับผิดชอบตลอดโครงการ", en: "Freelance · end to end" },
      year: "—", // TODO: ใส่ช่วงปีที่รับงาน
      impact: [
        // TODO: หยิบงานเด่น 2–3 ชิ้นจาก Fastwork มาเขียนเป็นข้อ ๆ (ห้ามใส่ชื่อลูกค้าถ้าไม่ได้ขออนุญาต)
        {
          th: "ตัวอย่างผลงานและความเห็นจากลูกค้าแสดงอยู่บนโปรไฟล์ Fastwork",
          en: "Sample work and client reviews are on the Fastwork profile.",
        },
      ],
      stack: ["Next.js", "ASP.NET", "SQL Server"], // TODO: ปรับตามงานจริง
      link: "https://fastwork.co/byob/2KRa1es4ON",
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
        { th: "พอร์ทัลอนุมัติกลางที่เชื่อมต่อจากทุกระบบ", en: "Central approval portal integrated with every system" },
      ],
    },
    {
      title: { th: "ปฏิบัติการและซัพพลายเชน", en: "Operations & supply chain" },
      items: [
        { th: "ระบบจัดการทรัพย์สิน ครอบคลุมการย้าย โอน ยืม และคืน", en: "Asset management: movement, transfer, borrow, return" },
        { th: "ระบบงานขนส่งและการคิดต้นทุนงานของผู้ให้บริการขนส่ง", en: "Logistics jobs and forwarder job costing" },
        { th: "ระบบจัดสรร capacity ดาวเทียมและคำขอใช้บริการ", en: "Satellite capacity allocation and service requests" },
        { th: "ระบบบริหารความเสี่ยงองค์กร", en: "Enterprise risk management" },
      ],
    },
    {
      title: { th: "แพลตฟอร์มกลาง", en: "Shared platforms" },
      items: [
        { th: "ระบบ single sign-on และการมอบอำนาจอนุมัติ", en: "Single sign-on and approval delegation" },
        { th: "ระบบจัดการสิทธิ์การเข้าถึงและการตรวจสอบตามมาตรฐาน ISO", en: "Menu permissions and ISO-aligned audit" },
        { th: "ระบบคิวส่งอีเมลกลางพร้อมการติดตามสถานะการส่ง", en: "Central mail queue with delivery tracking" },
        { th: "Middleware จองปฏิทินและจัดการ mailbox บน Microsoft 365", en: "Calendar booking and mailbox management middleware on Microsoft 365" },
      ],
    },
    {
      title: { th: "เว็บและ low-code", en: "Web & low-code" },
      items: [
        { th: "เว็บไซต์องค์กรสองภาษาบนแพลตฟอร์ม Webflow", en: "Bilingual corporate website on Webflow" },
        { th: "ระบบอินทราเน็ตพนักงานบน Dataverse และ Power Pages", en: "Employee intranet on Dataverse + Power Pages" },
        { th: "แอปพลิเคชันจัดการข้อมูลบน SharePoint ผ่าน Microsoft Graph", en: "SharePoint data-management applications via Microsoft Graph" },
        { th: "Cloud flow เชื่อมต่อแบบฟอร์ม ฐานข้อมูล และระบบอีเมล", en: "Cloud flows integrating forms, databases and mail" },
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
      period: "2009 – 2013",
    },
    {
      school: { th: "วิทยาลัยเทคนิคตรัง", en: "Trang Technical College" },
      degree: {
        th: "บริหารธุรกิจบัณฑิต (บธ.บ.) คอมพิวเตอร์ธุรกิจ",
        en: "B.B.A. Business Computer",
      },
      period: "2004 – 2009",
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
        th: "ใช้งานได้ระดับพื้นฐาน",
        en: "Limited working proficiency",
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
        th: "คลังความรู้ที่เครื่องมือ AI เรียกใช้ได้",
        en: "A knowledge base the tooling reads from",
      },
      body: {
        th: "เมื่อศึกษาระบบใดจนเข้าใจ จะบันทึกข้อมูลที่ประวัติ git ไม่ได้ระบุไว้ ได้แก่ เหตุผลเบื้องหลังการออกแบบ ข้อควรระวังที่พบ และข้อเท็จจริงเกี่ยวกับฐานข้อมูลและการ deploy จัดเก็บเป็นบันทึกแยกตามระบบและ sync เข้าคลังความรู้กลางโดยอัตโนมัติ",
        en: "When a system has been studied in depth, the information that version history does not record — design rationale, known pitfalls, and non-obvious facts about the database and deployment — is documented as per-system notes and synchronised into a central knowledge base.",
      },
      result: {
        th: "ลดเวลาตอบคำถามเชิงโครงสร้างของระบบจากระดับครึ่งวันเหลือระดับนาที และทีมงานอื่นสามารถใช้บันทึกเดียวกันได้",
        en: "Answering how a system works dropped from half a day of code investigation to minutes, and the same notes serve the rest of the team.",
      },
    },
    {
      title: {
        th: "คู่มืออ้างอิงเฉพาะระบบสำหรับเครื่องมือ AI",
        en: "Documented domain rules available to the tooling",
      },
      body: {
        th: "จัดทำคู่มืออ้างอิงเฉพาะระบบให้เครื่องมือ AI เรียกใช้เมื่อเข้าสู่หัวข้อนั้น ครอบคลุมสัญญาของ webservice โครงสร้างสิทธิ์ ขั้นตอน deploy และเงื่อนไขของ flow อนุมัติ เพื่อให้คำตอบอ้างอิงจากพฤติกรรมจริงของระบบ",
        en: "Each system has a reference playbook that the tooling loads when the topic arises — webservice contracts, permission structures, deployment steps and approval-flow rules — so that answers derive from documented system behaviour rather than general patterns.",
      },
      result: {
        th: "ลดข้อเสนอแนะที่ดูสมเหตุสมผลแต่ไม่ถูกต้องตามบริบท ซึ่งเป็นความเสี่ยงสำคัญของการใช้ AI กับระบบที่เกี่ยวข้องกับการเงินและการอนุมัติ",
        en: "Reduces plausible but incorrect suggestions, which is the principal risk of applying AI to systems involving finance and approvals.",
      },
    },
    {
      title: {
        th: "ด่านตรวจอัตโนมัติแทนการอาศัยความจำ",
        en: "Automated gates instead of remembering",
      },
      body: {
        th: "ย้ายกฎการทำงานที่เดิมต้องอาศัยความจำ ไปเป็น hook และ agent ที่ทำงานอัตโนมัติ ณ จุดที่เกี่ยวข้อง ได้แก่ การตรวจช่องโหว่ตามเกณฑ์เดียวกับ quality gate ขององค์กรก่อน push การบังคับรูปแบบการตั้งชื่อ branch และ commit และการแจ้งเตือนเมื่อกำลังจะสรุปพฤติกรรมของระบบเดิมโดยยังไม่ได้ตรวจสอบจากซอร์สโค้ด",
        en: "Working rules that previously depended on memory now execute automatically at the relevant point: a security scan against the same criteria as the organisation's quality gate before every push, enforced branch and commit conventions, and a prompt when legacy behaviour is about to be assumed rather than verified against the source.",
      },
      result: {
        th: "ตรวจพบข้อผิดพลาดก่อนส่งมอบ แทนที่จะพบในขั้นตอน review หรือหลัง deploy",
        en: "Defects are identified before delivery rather than at review or after deployment.",
      },
    },
    {
      title: {
        th: "แบ่งงานระหว่างเครื่องมือกับผู้ตัดสินใจ",
        en: "Tooling covers breadth, judgement stays human",
      },
      body: {
        th: "มอบหมายงานที่ใช้เวลามากแต่ไม่ต้องใช้วิจารณญาณ เช่น การตรวจอ่านไฟล์จำนวนมาก การเปรียบเทียบสภาพแวดล้อม dev กับ production และการร่างเอกสาร ให้เครื่องมือทำงานขนานกัน ส่วนการตัดสินใจเชิงออกแบบและงานที่เกี่ยวข้องกับข้อมูลจริง จะตรวจสอบด้วยตนเองทุกครั้ง",
        en: "Work that consumes time but not judgement — reviewing large numbers of files, comparing dev against production, drafting documentation — is delegated to run in parallel. Design decisions and anything touching production data are always reviewed personally first.",
      },
      result: {
        th: "งาน reverse-engineering ที่เดิมใช้เวลาหลายวัน ดำเนินการเสร็จภายในรอบการทำงานเดียว โดยยังคงมีผู้รับผิดชอบผลลัพธ์",
        en: "Reverse-engineering that previously took days is completed within a single working session, with a person remaining accountable for the result.",
      },
    },
    {
      title: {
        th: "ต่อ AI เข้ากับระบบงานจริง ไม่ใช่แค่ในเอดิเตอร์",
        en: "Wiring AI into the systems of record, not just the editor",
      },
      body: {
        th: "งานส่งมอบขึ้น production ต้องเปิดเอกสาร change ในระบบ ITSM ทุกครั้ง ซึ่งเดิมเป็นงานเขียนซ้ำ ๆ จึงต่อ API ของระบบนั้นเข้ากับกระบวนการ แล้วให้ AI ประกอบเนื้อหาจากสิ่งที่แก้จริง ทั้งรายการไฟล์ คำสั่งฐานข้อมูล แผนติดตั้ง แผนถอยกลับ และแผนทดสอบ ก่อนเปิดเป็นฉบับร่างรอคนตรวจ",
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
    "ASP.NET WebForms",
    ".NET 8",
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
      items: [".NET 8", "ASP.NET Core", "ASP.NET WebForms", "Dapper", "EF Core", "REST", "SOAP"],
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
      title: { th: "โครงสร้างและ DevOps", en: "Infra & DevOps" },
      items: ["Docker", "RabbitMQ", "Hangfire", "Git", "GitLab CI", "Nginx"],
    },
    {
      title: { th: "AI ในงานวิศวกรรม", en: "AI engineering" },
      items: [
        "Claude Code",
        "MCP servers",
        "Agent workflows",
        "Prompt/context engineering",
        "Automated code review",
      ],
    },
    {
      title: { th: "องค์กรและ automation", en: "Enterprise & automation" },
      items: [
        "SAP integration (RFC)",
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
    { label: "Fastwork", href: "https://fastwork.co/byob/2KRa1es4ON" },
    { label: "Email", href: "mailto:jerateep_@live.com" },
  ],
} as const;

export type Profile = typeof profile;

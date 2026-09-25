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
  about: [
    {
      th: "Full Stack Developer ประสบการณ์กว่า 10 ปี รับผิดชอบระบบ back-office หลักราวสิบระบบ ครอบคลุมงานเอกสารและสายอนุมัติงบประมาณ ระบบสิทธิ์การเข้าถึง ระบบเชื่อมต่อ SAP และงาน automation และให้การสนับสนุนระบบ back-office อื่นอีกกว่า 20 ระบบในองค์กรเดียวกัน",
      en: "A Full Stack Developer with over 10 years of experience, owning around ten core back-office systems — document and budget-approval workflows, access management, SAP integration and automation — and supporting more than twenty further back-office systems across the same organisation.",
    },
    {
      th: "มีความเชี่ยวชาญด้านระบบ legacy ที่ใช้งานต่อเนื่องมานาน โดยยึดวิธีตรวจสอบพฤติกรรมจริงของระบบเทียบกับฐานข้อมูลก่อนแก้ไขทุกครั้ง เพื่อให้การปรับปรุงหรือย้ายระบบไม่กระทบกระบวนการทางธุรกิจเดิม โดยเฉพาะระบบที่เกี่ยวข้องกับการเงินและการอนุมัติซึ่งต้องการความถูกต้องสมบูรณ์",
      en: "Specialised in long-running legacy systems, working from verified behaviour — checking how a system actually runs against the database before any change so that upgrades and migrations preserve the existing business process — particularly for systems handling finance and approvals, where correctness is non-negotiable.",
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
      flow: [
        { label: { th: "กฎตามโครงสร้างองค์กร", en: "Org-structure rules" }, icon: "rules" },
        { label: { th: "ชุดสิทธิ์และเมนู", en: "Permission sets" }, icon: "queue" },
        { label: { th: "ทุกแอปที่ผ่าน SSO", en: "Every app behind SSO" }, icon: "browser" },
        { label: { th: "รายงานตรวจสอบตาม ISO", en: "ISO audit reports" }, icon: "report" },
      ],
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
      slug: "sso-platform",
      compact: true,
      name: {
        th: "ระบบยืนยันตัวตนกลางและการมอบอำนาจอนุมัติ",
        en: "Central authentication and approval delegation",
      },
      summary: {
        th: "บริการยืนยันตัวตนที่ทุกระบบ back-office เรียกใช้ร่วมกัน ล็อกอินครั้งเดียวแล้วคืนทั้งตัวตน เมนูที่มีสิทธิ์ และสายการมอบอำนาจอนุมัติกลับไปให้แอป ทำให้แต่ละแอปไม่ต้องอ่านตารางสิทธิ์เอง",
        en: "The authentication service every back-office system shares. One sign-in returns the user's identity, the menus they may use, and their approval-delegation chain — so no application has to read the permission tables itself.",
      },
      role: {
        th: "ดูแลต่อเนื่องและต่อระบบใหม่เข้ากับบริการนี้",
        en: "Ongoing maintenance, and integrating new systems onto it",
      },
      confidential: true,
      year: "2024–2026",
      flow: [
        { label: { th: "ผู้ใช้ล็อกอินครั้งเดียว", en: "One sign-in" }, icon: "person" },
        { label: { th: "บริการกลางตรวจสิทธิ์", en: "Central service resolves" }, icon: "shield" },
        { label: { th: "คืนเมนูและกลุ่มสิทธิ์", en: "Menus and groups returned" }, icon: "queue" },
        { label: { th: "ทุกแอปใช้ผลเดียวกัน", en: "Every app uses the same result" }, icon: "browser" },
      ],
      impact: [
        {
          th: "แอปที่ต่อเข้ามาไม่ต้องเข้าถึงฐานข้อมูลสิทธิ์โดยตรง ลดทั้งสิทธิ์ที่ต้องขอและจุดที่ตรรกะสิทธิ์จะแตกต่างกันเอง",
          en: "Connected applications never touch the permission database directly, which cuts both the access they must be granted and the places where permission logic can drift apart.",
        },
        {
          th: "รองรับการมอบอำนาจอนุมัติหลายรูปแบบ ทั้งมอบให้ผู้ช่วย รักษาการตามสายงาน และการมอบเฉพาะกิจ ซึ่งเป็นเงื่อนไขที่ระบบอนุมัติทุกตัวต้องใช้ร่วมกัน",
          en: "Carries several kinds of approval delegation — to an assistant, by org line, and ad hoc — the conditions every approval system in the organisation depends on.",
        },
        {
          th: "ปรับให้รองรับโดเมนใหม่ตอนองค์กรเปลี่ยนชื่อ โดยย้ายค่าที่เคยตายตัวในโค้ดไปเป็นค่าตั้งที่แยกตามสภาพแวดล้อม",
          en: "Extended to accept a new domain during the corporate rename, moving values that had been fixed in code into per-environment configuration.",
        },
      ],
      stack: ["ASP.NET", "SOAP", "OAuth 2.0", "SQL Server", "Active Directory"],
    },
    {
      slug: "sap-middleware",
      compact: true,
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
      flow: [
        { label: { th: "SAP", en: "SAP" }, icon: "erp" },
        { label: { th: "REST API ตัวกลาง", en: "REST middleware" }, icon: "browser" },
        { label: { th: "งานตามเวลา", en: "Scheduled jobs" }, icon: "gear" },
        { label: { th: "ระบบปลายทาง", en: "Downstream systems" }, icon: "worker" },
      ],
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
          th: "เพิ่มการแจ้งเตือนเมื่อการ sync ข้อมูลไม่สำเร็จ ทำให้รู้ได้ทันทีว่าข้อมูลปลายทางยังไม่อัปเดต",
          en: "Added alerting on failed synchronisation, so a stale downstream dataset is now visible immediately.",
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
      flow: [
        { label: { th: "ยื่นคำขอ", en: "Submit request" }, icon: "form" },
        { label: { th: "ตรวจงบคงเหลือกับ SAP", en: "Check budget in SAP" }, icon: "erp" },
        { label: { th: "สายอนุมัติอัตโนมัติ", en: "Approver line" }, icon: "rules" },
        { label: { th: "อนุมัติในพอร์ทัลกลาง", en: "Approve in portal" }, icon: "shield" },
      ],
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
      slug: "asset-management",
      compact: true,
      name: {
        th: "ระบบจัดการทรัพย์สินองค์กร",
        en: "Corporate asset management",
      },
      summary: {
        th: "ระบบติดตามทรัพย์สินตลอดอายุการใช้งาน ครอบคลุมเอกสารเจ็ดประเภท ตั้งแต่การย้ายทรัพย์สินเข้า-ออกอาคาร การโอนผู้ถือครองและศูนย์ต้นทุน ไปจนถึงการยืม คืน และต่ออายุ ทุกใบวิ่งผ่านสายอนุมัติและบันทึกกลับเข้าระบบบัญชี",
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
        { label: { th: "บันทึกกลับระบบบัญชี", en: "Post to accounting" }, icon: "erp" },
        { label: { th: "ติดตามสถานะทรัพย์สิน", en: "Track asset status" }, icon: "database" },
      ],
      impact: [
        {
          th: "จัดทำเอกสารอ้างอิงของ workflow ครบทั้งเจ็ดประเภทจากโค้ดและฐานข้อมูลจริง พร้อม flowchart และตารางผู้รับผิดชอบราย step ให้ทีมใช้ต่อได้",
          en: "Produced a workflow reference covering all seven document types, derived from the code and the live database, with flowcharts and per-step ownership for the team to work from.",
        },
        {
          th: "ข้อมูลหลักของทรัพย์สินรับมาจากระบบบัญชีตามเวลาโดยอัตโนมัติ แทนการคีย์ซ้ำในสองระบบ",
          en: "Asset master data arrives from the accounting system on a schedule, instead of being keyed into two systems.",
        },
        {
          th: "แก้กรณีที่หน้าจอโอนผู้ถือครองยอมรับทรัพย์สินซ้ำและแจ้ง error ที่ไม่ตรงกับสาเหตุจริง",
          en: "Fixed a transfer screen that accepted duplicate assets and reported errors that did not match the real cause.",
        },
      ],
      stack: ["ASP.NET WebForms", "SQL Server", "SAP", "SOAP"],
    },
    {
      slug: "logistics-inventory",
      compact: true,
      name: {
        th: "ระบบคลังสินค้าและงานขนส่ง",
        en: "Inventory and logistics",
      },
      summary: {
        th: "ระบบที่ดูแลการเบิกจ่ายและเคลื่อนย้ายสินค้าคงคลัง ต่อเนื่องไปถึงงานขนส่ง การคิดต้นทุนรายงาน และการวางบิลผู้ให้บริการขนส่ง พร้อมงานปิดรอบสิ้นเดือนที่ต้องกระทบยอดกับระบบบัญชี",
        en: "Covers stock issue and movement through to freight jobs, per-job costing, forwarder billing, and the month-end close that has to reconcile against the accounting system.",
      },
      role: {
        th: "พัฒนาและแก้ปัญหาความถูกต้องของข้อมูล",
        en: "Development, with a focus on data-integrity defects",
      },
      confidential: true,
      year: "2024–2026",
      flow: [
        { label: { th: "เบิกจ่ายและเคลื่อนย้าย", en: "Issue and movement" }, icon: "folder" },
        { label: { th: "งานขนส่งและต้นทุน", en: "Freight jobs and costing" }, icon: "worker" },
        { label: { th: "วางบิลผู้ให้บริการ", en: "Forwarder billing" }, icon: "report" },
        { label: { th: "ปิดรอบกระทบยอด", en: "Month-end reconciliation" }, icon: "erp" },
      ],
      impact: [
        {
          th: "แก้ชุดข้อบกพร่องด้านความถูกต้องของข้อมูล เช่น เงื่อนไขค้นหาที่กว้างเกินจนแก้ข้อมูลผิดรายการ และการลบแล้วเพิ่มใหม่ทุกครั้งที่แก้ไข ซึ่งทำให้ความเชื่อมโยงระหว่างเอกสารขาด",
          en: "Worked through a set of data-integrity defects — a search condition broad enough to update the wrong rows, and an edit path that deleted and re-inserted records, severing the links between documents.",
        },
        {
          th: "วาง state machine ของวันที่ในเส้นทางขนส่งให้ชัดเจน หลังพบว่าการบันทึกวันที่บางขั้นถูกเขียนทับจนหายไป",
          en: "Defined a clear state machine for the dates along a shipment, after finding that saving one stage could overwrite and lose another.",
        },
        {
          th: "ย้ายชุดตารางวิเคราะห์ข้อมูลมาไว้บนฐานข้อมูลปัจจุบัน และกู้คีย์หลักที่หายระหว่างการย้าย",
          en: "Consolidated the analytical tables onto the current database platform and restored the primary keys lost in transit.",
        },
      ],
      stack: ["ASP.NET", "SQL Server", "Oracle", "SAP"],
    },
    {
      slug: "identity-automation",
      name: {
        th: "ระบบอัตโนมัติของวงจรชีวิตบัญชีพนักงาน",
        en: "Employee identity lifecycle automation",
      },
      summary: {
        th: "ยกงานเปิด แก้ และปิดบัญชีพนักงานทั้งวงจรให้เป็นอัตโนมัติ ตั้งแต่รับพนักงานใหม่ไปจนถึงวันลาออก ประกอบด้วย Web API ที่สั่งงาน directory ขององค์กร และชุด cloud flow กว่า 30 ตัวที่ครอบคลุมทั้งพนักงานในระบบ HR พนักงานนอกระบบ และบุคคลภายนอก",
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
        { label: { th: "บัญชี สิทธิ์ และกลุ่มเมล", en: "Accounts, licences, groups" }, icon: "contact" },
      ],
      impact: [
        {
          th: "งานวันลาออกรวมเป็นชุดเดียวที่ทำงานตามกำหนดเวลา ทั้งปิดบัญชี ถอนสิทธิ์ใช้งาน ถอดออกจากกลุ่มเมล และตั้งการส่งต่อเมล จากเดิมที่ต้องไล่ทำทีละระบบด้วยมือ",
          en: "Leaving-day work runs as one scheduled set — disabling the account, reclaiming licences, removing group memberships and setting mail forwarding — instead of being worked through system by system by hand.",
        },
        {
          th: "แยกเส้นทางของพนักงานในระบบ HR พนักงานนอกระบบ และบุคคลภายนอก ออกจากกัน เพราะสามกลุ่มนี้มีต้นทางข้อมูลและเงื่อนไขการหมดอายุต่างกัน",
          en: "Splits the path for HR-registered staff, staff outside the HR system, and external people, because the three differ in where their data comes from and when their access should expire.",
        },
        {
          th: "งานชุดใหญ่ที่สุดมีกว่าร้อยขั้นตอนในหนึ่ง flow — จัดการกลุ่มเมลและสมาชิกทั้งองค์กร ซึ่งเดิมเป็นงานที่ต้องทำซ้ำทุกเดือน",
          en: "The largest single flow runs well over a hundred steps, maintaining organisation-wide mail groups and their members — work that previously recurred every month by hand.",
        },
        {
          th: "มี flow ตรวจสถานะการเชื่อมต่อของตัวเองตามเวลา ทำให้รู้ก่อนที่ connector หมดอายุจะทำให้ทั้งชุดหยุดทำงาน",
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
      name: {
        th: "งาน automation กลางขององค์กร",
        en: "Organisation-wide automation",
      },
      summary: {
        th: "ชุด cloud flow บน environment production ที่ทำหน้าที่เป็นกาวเชื่อมระหว่างระบบภายใน ครอบคลุมงานซิงก์ข้อมูลตามเวลา งานแจ้งเตือน งานเปิด API ให้ระบบอื่นเรียก และงานรับส่งเอกสาร รวมกว่า 60 flow",
        en: "A set of production cloud flows acting as glue between internal systems — scheduled synchronisation, alerting, APIs other systems call, and document handling — more than sixty in total.",
      },
      role: {
        th: "ออกแบบ พัฒนา และดูแลต่อเนื่อง",
        en: "Design, implementation and ongoing maintenance",
      },
      confidential: true,
      year: "2024–2026",
      flow: [
        { label: { th: "ตัวกระตุ้นตามเวลาและ HTTP", en: "Schedules and HTTP triggers" }, icon: "gear" },
        { label: { th: "ซิงก์ข้อมูลข้ามระบบ", en: "Cross-system sync" }, icon: "database" },
        { label: { th: "แจ้งเตือนไปยังผู้ดูแล", en: "Alerts to the right people" }, icon: "mail" },
        { label: { th: "เอกสารและรายงาน", en: "Documents and reports" }, icon: "report" },
      ],
      impact: [
        {
          th: "ซิงก์ข้อมูลพนักงานลง directory ภายในองค์กรตามเวลา ทำให้ระบบที่อ่าน directory ได้ข้อมูลตรงกันโดยไม่ต้องต่อ HR เอง",
          en: "Synchronises employee data into the on-premise directory on a schedule, so every system reading from it stays consistent without integrating with HR directly.",
        },
        {
          th: "ซิงก์การจองห้องและทรัพยากรเข้าปฏิทินกลาง พร้อม flow แยกต่อห้องสำหรับรับการเปลี่ยนแปลงแบบทันที",
          en: "Synchronises room and resource bookings into the shared calendar, with a per-room flow to pick up changes as they happen.",
        },
        {
          th: "ทำช่องทางแจ้งเตือนกลางที่ระบบอื่นยิงเข้ามาได้ ทั้งแจ้งเตือนอุปกรณ์เครือข่าย สถานะงานประมวลผลเอกสาร และคิวส่งเมลที่ค้าง ส่งต่อเข้าแชตของทีมที่รับผิดชอบ",
          en: "Provides a shared alerting endpoint other systems post to — network-device alerts, document-processing status, stalled mail queues — routed into the responsible team's chat.",
        },
        {
          th: "ห่อข้อมูลของระบบภายในเป็น API ให้ระบบอื่นเรียกใช้ เช่น ผังองค์กร และข้อมูลอ้างอิงของระบบจัดสรรทรัพยากร โดยไม่ต้องเปิดฐานข้อมูลให้กันตรง ๆ",
          en: "Wraps internal data as APIs other systems can call — the org chart, and reference data from the resource-allocation system — without exposing databases to each other.",
        },
        {
          th: "งานตามเวลาที่ดึงข้อมูลอัตราแลกเปลี่ยนและรันงานฝั่ง ERP แล้วนำผลเข้าระบบปลายทาง ลดงานที่เคยต้องมีคนกดเองทุกวัน",
          en: "Scheduled jobs pull exchange rates and run ERP-side batches, feeding the results downstream and removing work that previously needed a person to trigger it daily.",
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
      name: {
        th: "ระบบนามบัตรอิเล็กทรอนิกส์ขององค์กร",
        en: "Corporate digital name card",
      },
      summary: {
        th: "เว็บแอปที่ให้พนักงานเปิดนามบัตรดิจิทัลของตัวเองและให้คนอื่นบันทึกลงสมุดโทรศัพท์ได้ในขั้นตอนเดียว ล็อกอินด้วยบัญชีองค์กร สร้าง QR code ให้รายบุคคล และแปลงข้อมูลเป็นไฟล์รายชื่อมาตรฐานที่โทรศัพท์ทุกเครื่องอ่านได้",
        en: "A web app where staff open their own digital name card and anyone can save it to their contacts in a single step. Sign-in uses the corporate account, each person gets a QR code, and the data is served as the standard contact-file format that every phone understands.",
      },
      role: {
        th: "Full-stack · ออกแบบ พัฒนา และวาง deployment",
        en: "Full-stack · design, implementation and deployment",
      },
      confidential: true,
      year: "2026",
      flow: [
        { label: { th: "ล็อกอินบัญชีองค์กร", en: "Corporate sign-in" }, icon: "shield" },
        { label: { th: "นามบัตรของตัวเอง", en: "Your own card" }, icon: "contact" },
        { label: { th: "QR code รายบุคคล", en: "Personal QR code" }, icon: "qr" },
        { label: { th: "บันทึกลงสมุดโทรศัพท์", en: "Save to contacts" }, icon: "folder" },
      ],
      impact: [
        {
          th: "ยืนยันตัวตนผ่าน Microsoft Entra ID ทำให้พนักงานเห็นและแก้ได้เฉพาะนามบัตรของตัวเอง โดยไม่ต้องสร้างระบบผู้ใช้ขึ้นมาใหม่",
          en: "Authentication through Microsoft Entra ID means each person sees and edits only their own card, without standing up a separate user system.",
        },
        {
          th: "เก็บ secret ทั้งหมดไว้ใน Azure Key Vault และดึงตอนรัน ไม่มีค่าอ่อนไหวฝังอยู่ในโค้ดหรือไฟล์ตั้งค่า",
          en: "All secrets live in Azure Key Vault and are fetched at run time; none are embedded in source or configuration files.",
        },
        {
          th: "ส่งขึ้นใช้งานเป็น container บน Kubernetes พร้อม CI/CD ที่ต้องมีผู้อนุมัติก่อน deploy ขึ้น production",
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
        th: "ย้ายเว็บไซต์องค์กรจาก WordPress เดิมขึ้นแพลตฟอร์ม Webflow พร้อมจัดโครงสร้างเนื้อหาใหม่เป็น CMS collection และรองรับสองภาษา โดยให้เจ้าของเนื้อหาแก้ไขเองได้โดยไม่ต้องผ่านนักพัฒนา",
        en: "Migrated the corporate website from a legacy WordPress platform to Webflow, restructuring the content into CMS collections with full bilingual support so that content owners can make changes without developer involvement.",
      },
      role: {
        th: "พัฒนาและย้ายข้อมูล ผ่าน API เป็นหลัก",
        en: "Implementation and content migration, primarily through the platform API",
      },
      confidential: true,
      year: "2025–2026",
      flow: [
        { label: { th: "เว็บเดิมบน WordPress", en: "Legacy WordPress site" }, icon: "wordpress" },
        { label: { th: "ดึงเนื้อหาออกมา", en: "Extract content" }, icon: "parse" },
        { label: { th: "จัดเป็น CMS collection", en: "Into CMS collections" }, icon: "database" },
        { label: { th: "เว็บสองภาษา", en: "Bilingual site" }, icon: "globe" },
      ],
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
          th: "ทำให้หน้ารายการแสดงข้อมูลได้ครบทุกรายการ โดยออกแบบรอบข้อจำกัดจำนวนรายการต่อ Collection List ของแพลตฟอร์ม",
          en: "Made a listing page show its full dataset by designing around the platform cap on items per Collection List.",
        },
        {
          th: "รองรับงานเปลี่ยนอัตลักษณ์องค์กร ทั้งชุดสี โลโก้ และหน้าแจ้งปิดปรับปรุงระหว่างเปลี่ยนผ่าน",
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
        th: "เว็บภายในสำหรับพนักงานที่สร้างบน Power Pages โดยเก็บเนื้อหาทั้งหมดไว้ใน Dataverse และมีแอปหลังบ้านให้ทีมสื่อสารองค์กรจัดการเองได้ ครอบคลุมข่าวสาร เอกสาร และลิงก์ระบบภายใน",
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
        { label: { th: "แสดงผลบน Power Pages", en: "Rendered by Power Pages" }, icon: "browser" },
        { label: { th: "พนักงานเข้าถึงได้ทั่วองค์กร", en: "Reaches all staff" }, icon: "person" },
      ],
      impact: [
        {
          th: "จัดทำแผนผังของไซต์ทั้งชุดจากตัวไซต์โดยตรง ทำให้ทีมมีเอกสารอ้างอิงสำหรับแก้ไขครั้งต่อไป",
          en: "Mapped the site in full, working directly from the live site, giving the team a reference to work from next time.",
        },
        {
          th: "เริ่มเขียนหลังบ้านใหม่เป็นเว็บแอปที่ออกแบบตามลำดับงานจริงของทีมสื่อสาร แทน model-driven app เดิม",
          en: "The back office is being rewritten as a web app shaped around how the communications team actually works, replacing the original model-driven app.",
        },
        {
          th: "ปรับอัตลักษณ์องค์กรใหม่ทั้งไซต์ ทั้งชุดสี โลโก้ และชื่อที่ฝังอยู่ในส่วนประกอบหลายจุดของไซต์",
          en: "Applied the corporate rebrand across the site — colour system, logo, and the name embedded in components throughout it.",
        },
      ],
      stack: ["Power Pages", "Dataverse", "Power Platform", "JavaScript", "CSS"],
    },
    {
      slug: "freelance",
      compact: true,
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
        th: "ปวช. และ ปวส. สาขาคอมพิวเตอร์ธุรกิจ",
        en: "Vocational Certificate and Higher Vocational Certificate, Business Computer",
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

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

export const profile = {
  /** TODO: เปลี่ยนเป็นชื่อจริงถ้าต้องการให้ recruiter เห็นชื่อ */
  name: { th: "jerateeps", en: "jerateeps" } satisfies L,
  role: {
    th: "Full-stack Developer · Back-office & Automation",
    en: "Full-stack Developer · Back-office & Automation",
  } satisfies L,
  tagline: {
    th: "สร้างระบบหลังบ้านองค์กรที่คนใช้จริงทุกวัน — .NET, Next.js, SQL Server และงาน automation โดยมี AI เป็นส่วนหนึ่งของกระบวนการ ไม่ใช่ของเล่นข้างทาง",
    en: "I build the enterprise back-office systems people actually use every day — .NET, Next.js, SQL Server, and automation — with AI wired into the process, not bolted on the side.",
  } satisfies L,
  location: { th: "กรุงเทพฯ ประเทศไทย", en: "Bangkok, Thailand" } satisfies L,
  available: {
    th: "เปิดรับงานฟรีแลนซ์และโอกาสใหม่ ๆ",
    en: "Open to freelance work and new opportunities",
  } satisfies L,

  about: [
    {
      th: "ผมดูแลระบบหลังบ้านขององค์กรกว่า 20 ระบบ — ตั้งแต่สายอนุมัติเอกสารและการเบิกจ่าย ไปจนถึงงาน automation ที่เชื่อม SAP, Active Directory และ Microsoft 365 เข้าด้วยกัน งานพวกนี้ไม่ได้อยู่ในที่สว่าง แต่ถ้ามันล่ม ทั้งออฟฟิศรู้ทันที",
      en: "I look after 20+ enterprise back-office systems — approval and expense workflows, and the automation that ties SAP, Active Directory and Microsoft 365 together. None of it is glamorous, but everyone notices the day it breaks.",
    },
    {
      th: "ถนัดงานที่ต้องเข้าใจของเดิมก่อนแก้: อ่านโค้ด legacy ที่ไม่มีเอกสาร เทียบพฤติกรรมจริงกับฐานข้อมูล แล้วค่อยย้ายขึ้นของใหม่โดยไม่ทำ flow ธุรกิจพัง ระบบที่ทำงานเกี่ยวกับเงินและการอนุมัติ ผิดไม่ได้แม้แต่ใบเดียว",
      en: "My strength is understanding what already exists before changing it: reading undocumented legacy code, checking its real behaviour against the database, then migrating it without breaking the business flow. When a system moves money or approvals, a single wrong document is one too many.",
    },
    {
      th: "อีกครึ่งหนึ่งของงานคือเขียนสิ่งที่ค้นเจอทิ้งไว้ — reverse-engineer ระบบเก่าเป็นเอกสาร วาง convention ให้ทีม และทำให้คนถัดไปไม่ต้องขุดซ้ำ",
      en: "The other half of the job is writing down what I find — reverse-engineering old systems into documentation, setting team conventions, and making sure the next person doesn't have to dig it all up again.",
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
        th: "ดูแลและพัฒนาระบบ back-office ที่พนักงานทั้งองค์กรใช้ — งานเอกสารและสายอนุมัติ, ระบบสิทธิ์การเข้าถึง, ตัวกลางคุย SAP, และงาน automation ทั้งฝั่งเซิร์ฟเวอร์และ RPA",
        en: "Build and maintain the back-office systems used across the organisation — document and approval workflows, access management, SAP middleware, and automation on both the server and RPA side.",
      },
      highlights: [
        {
          th: "ย้ายระบบ ASP.NET WebForms อายุสิบกว่าปีขึ้น .NET 8 + Next.js โดยใช้ฐานข้อมูลเดิมต่อไร้รอยต่อ ไม่ต้องหยุดให้บริการ",
          en: "Migrated decade-old ASP.NET WebForms systems to .NET 8 + Next.js on the existing database, with no service interruption.",
        },
        {
          th: "ออกแบบชั้น permission ที่ให้สิทธิ์ตามโครงสร้างองค์กร (สังกัด/แผนก/ตำแหน่ง) แทนการผูกสิทธิ์รายคน แก้กฎที่เดียวมีผลทุกแอปที่ผ่าน SSO",
          en: "Designed a permission layer that grants access by org attributes (BU, department, position) instead of per-user assignment — one rule change propagates to every app behind SSO.",
        },
        {
          th: "วางระบบคิวงาน automation บน message queue ให้ worker หลายเครื่องรับงานขนานกัน และ retry งานที่ล้มเองได้",
          en: "Built a message-queue automation pipeline so worker machines process jobs in parallel and failed jobs retry themselves.",
        },
        {
          th: "reverse-engineer ระบบเก่าที่ไม่มีเอกสารให้กลายเป็น reference ที่ทีมใช้ต่อได้ พร้อม flowchart และตารางผู้รับผิดชอบราย step",
          en: "Reverse-engineered undocumented legacy systems into references the team can work from, with flowcharts and per-step ownership tables.",
        },
      ],
      stack: [
        ".NET 8",
        "ASP.NET",
        "Next.js",
        "SQL Server",
        "RabbitMQ",
        "Python",
        "Docker",
        "SAP",
      ],
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

  projects: [
    {
      slug: "iam-rewrite",
      name: {
        th: "ระบบจัดการสิทธิ์เข้าถึงองค์กร (เขียนใหม่)",
        en: "Enterprise access management (rewrite)",
      },
      summary: {
        th: "ยกระบบสิทธิ์เมนูของ back-office ทั้งองค์กรจาก WebForms รุ่นเก่าขึ้น .NET 8 Web API + Next.js โดยใช้ฐานข้อมูลเดิม จุดขายคือให้สิทธิ์ด้วย “กฎตามโครงสร้างองค์กร” แทนการจิ้มรายคน",
        en: "Lifted the organisation-wide back-office menu permission system from legacy WebForms to a .NET 8 Web API + Next.js front end on the same database. The core idea: grant access with org-structure rules instead of per-person assignment.",
      },
      role: { th: "Full-stack · ออกแบบ + พัฒนา", en: "Full-stack · design + build" },
      confidential: true,
      year: "2025",
      impact: [
        {
          th: "เพิ่มพนักงานใหม่ไม่ต้องตั้งสิทธิ์ทีละคนอีกต่อไป — เข้ากฎไหนได้เมนูชุดนั้นทันที",
          en: "Onboarding no longer needs per-person setup — matching a rule grants the whole menu set instantly.",
        },
        {
          th: "เพิ่มชุด report สำหรับ audit ตามมาตรฐาน ISO: matrix กฎ×เมนู, เทียบสิทธิ์ระหว่างคน, หา orphan account, และ audit log",
          en: "Added an ISO-audit reporting set: rule×menu matrix, access comparison between users, orphan-account detection, and audit logging.",
        },
        {
          th: "มีหน้า My Access ให้พนักงานตรวจสิทธิ์ตัวเองได้ ลดคำถามที่วิ่งเข้าทีม IT",
          en: "A self-service My Access page lets staff check their own permissions, cutting the questions that used to land on IT.",
        },
      ],
      stack: [".NET 8", "Dapper", "Next.js", "HeroUI", "SQL Server"],
    },
    {
      slug: "sap-doc-pipeline",
      name: {
        th: "ระบบผลิตเอกสารจาก SAP อัตโนมัติ (end-to-end)",
        en: "End-to-end SAP document production pipeline",
      },
      summary: {
        th: "งานที่ใหญ่ที่สุดที่เคยทำ — ยกกระบวนการออกเอกสารให้ลูกค้า (ใบแจ้งหนี้ ใบลดหนี้ ใบเสร็จ) ทั้งสายจากที่เคยสั่งพิมพ์จากระบบ ERP ทีละใบ มาเป็น pipeline ที่ตั้งคิวแล้วจบเอง ตั้งแต่ robot ไปดึงข้อมูล แงะ print-image ออกเป็นโครงสร้าง เรนเดอร์เป็นเอกสาร ไปจนถึงส่งต่อให้ระบบรับบิลของคู่ค้า",
        en: "The largest system I've built — it takes customer-facing documents (invoices, credit notes, receipts) end to end: a robot pulls the data, the print image is parsed into structure, documents are rendered, and the results are handed off to partner billing systems. What used to be printed one page at a time is now a queue you walk away from.",
      },
      role: {
        th: "ออกแบบสถาปัตยกรรม + พัฒนาทั้ง 3 ภาษา + วางวิธีตรวจความถูกต้อง",
        en: "Architecture, implementation across three languages, and the correctness strategy",
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
        panelData: { th: "ฐานข้อมูล", en: "DATABASE" },

        user: { th: "ผู้ใช้", en: "User" },
        portal: { th: "เว็บพอร์ทัล", en: "Web portal" },
        portalSub: { th: "ตั้งคิว · แก้ · พรีวิว", en: "queue · edit · preview" },
        queue: { th: "คิวข้อความ", en: "Message queue" },
        queueSub: { th: "1 งาน = 1 message", en: "one job, one message" },
        render: { th: "Render service", en: "Render service" },
        renderSub: { th: "ประกอบ payload ที่เดียว", en: "single payload builder" },
        engine: { th: "Report engine", en: "Report engine" },
        engineSub: { th: "PDF · HTML · DOCX", en: "PDF · HTML · DOCX" },

        consumer: { th: "Consumer", en: "Consumer" },
        consumerSub: { th: "ขนานกันหลายเครื่อง", en: "runs in parallel" },
        robot: { th: "Robot", en: "Robot" },
        robotSub: { th: "ขับระบบ ERP", en: "drives the ERP" },
        parser: { th: "ตัวแงะข้อความ", en: "Parser" },
        parserSub: { th: "ดิบ → โครงสร้าง", en: "raw to structure" },

        config: { th: "ค่าตั้งระบบ", en: "Configuration" },
        configSub: { th: "แหล่งเดียว ทับ env", en: "one source, beats env" },
        blocks: { th: "คลังบล็อก", en: "Block store" },
        blocksSub: { th: "แงะครั้งเดียว", en: "parsed once" },

        erp: { th: "ระบบ ERP", en: "ERP system" },
        erpSub: { th: "ต้นทาง print-image", en: "print-image source" },
        partner: { th: "ระบบรับบิลคู่ค้า", en: "Partner billing" },
        partnerSub: { th: "ล้มเหลว → แจ้งเตือน", en: "failure raises alert" },
        share: { th: "ไฟล์แชร์เอกสาร", en: "Document share" },
        shareSub: { th: "แยกฉบับ + รวมเล่ม", en: "per-sheet + combined" },

        eSubmit: { th: "ส่งเลขเอกสาร", en: "submit doc no." },
        eEnqueue: { th: "เข้าคิว", en: "enqueue" },
        eConsume: { th: "ดึงงาน", en: "consume" },
        eTrigger: { th: "สั่งทำงาน", en: "trigger" },
        ePull: { th: "ดึง print-image", en: "pull print image" },
        eHandoff: { th: "ส่งไฟล์ต่อ", en: "hand off file" },
        eStore: { th: "เก็บโครงสร้าง", en: "store blocks" },
        eConfig: { th: "โหลดค่าตั้ง", en: "load config" },
        eRenderIngest: { th: "เรนเดอร์ตอนออกใบ", en: "render on ingest" },
        ePreview: { th: "พรีวิว / export", en: "preview / export" },
        eLoadBlocks: { th: "อ่านบล็อกเดิม", en: "load blocks" },
        eRender: { th: "เรนเดอร์", en: "render" },
        eUpload: { th: "อัปโหลดบิล", en: "upload billing" },
        eSave: { th: "บันทึกไฟล์", en: "save files" },
      } satisfies Record<string, L>,
      impact: [
        {
          th: "ย้อนประมวลผลเอกสารเก่าทั้งคลัง (หลักหมื่นใบ) แล้วเทียบกับต้นฉบับทีละใบได้ 0 ความต่าง ก่อนจะกล้าสลับมาใช้ของใหม่เป็นค่าเริ่มต้น",
          en: "Re-processed the entire back catalogue (tens of thousands of documents) and diffed every one against its original to zero differences before the new path became the default.",
        },
        {
          th: "ตัดสินใจ “แงะครั้งเดียว” — อ่าน print-image ทีเดียวแล้วเก็บเป็นโครงสร้าง ทั้งตอนออกเอกสารและตอนพรีวิวจึงอ่านจากแหล่งเดียวกัน ไม่มีตัวประกอบข้อมูลซ้ำสองที่ให้ผลต่างกัน",
          en: "Settled on parse-once: the print image is read a single time into structured storage, so rendering and preview read the same source and there is no second builder to drift.",
        },
        {
          th: "ข้อมูลที่คนแก้เองถูกทำเครื่องหมายไว้ การ re-parse รอบหลังจะข้ามใบนั้นถาวร — งานที่คนตรวจแล้วไม่ถูกทับ",
          en: "Human edits are flagged, so later re-parses skip those documents permanently — work a person verified never gets overwritten.",
        },
        {
          th: "เก็บ print-image ต้นฉบับไว้แบบอ่านอย่างเดียวเป็น audit trail เวลาสงสัยว่าอ่านตกบรรทัด เปิดเทียบได้ทันที",
          en: "The original print image is kept read-only as an audit trail, so a suspected missed line can be compared against the source immediately.",
        },
        {
          th: "รันได้ครบทั้ง pipeline บนเครื่องตัวเองด้วยคำสั่งเดียว ทำให้แก้ layout แล้วเห็นผลโดยไม่ต้องรอ deploy",
          en: "The whole pipeline runs locally with one command, so layout changes can be checked without waiting on a deploy.",
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
      slug: "sap-middleware",
      name: {
        th: "ตัวกลางคุย SAP ของระบบหลังบ้าน",
        en: "SAP integration middleware",
      },
      summary: {
        th: "ห่อ SOAP web service ของ SAP ให้กลายเป็น REST ที่ระบบอื่นเรียกง่าย ๆ พร้อม job ตามเวลาที่ดึง master data ไปป้อนระบบปลายน้ำ (ทรัพย์สิน, สินค้าคงคลัง, ลูกค้า, ผู้ขาย, งบประมาณ)",
        en: "Wraps SAP's SOAP services as a REST API other systems can call, plus scheduled jobs that feed master data downstream (assets, inventory, customers, vendors, budgets).",
      },
      role: { th: "Backend · ออกแบบ + พัฒนา", en: "Backend · design + build" },
      confidential: true,
      year: "2025",
      impact: [
        {
          th: "ระบบปลายน้ำเลิกต่อ SAP เองทีละระบบ เหลือจุดเดียวที่ต้องดูแล",
          en: "Downstream systems stopped each wiring up SAP themselves — one place to maintain instead of many.",
        },
        {
          th: "เพิ่มทางอ่านตาราง SAP ตรงสำหรับข้อมูลที่ service เดิมมองไม่เห็น ไม่ต้องรอทีม ABAP เขียนของใหม่ให้",
          en: "Added a direct table-read path for data the existing services couldn't see, removing the wait on the ABAP team for new endpoints.",
        },
        {
          th: "อุด gate ที่ทำให้ข้อมูล sync ค้างเงียบ ๆ — จากเดิมที่ไม่มีใครรู้ว่าของไม่มา",
          en: "Closed a failure gate that let syncs stall silently, where previously nobody knew the data had stopped arriving.",
        },
      ],
      stack: ["ASP.NET Core", "Hangfire", "SOAP", "SQL Server", "SAP"],
    },
    {
      slug: "money-request",
      name: {
        th: "ระบบขออนุมัติใช้เงิน",
        en: "Money request & approval system",
      },
      summary: {
        th: "ระบบยื่นและอนุมัติคำขอใช้เงินทั้งแบบมีงบ ไม่มีงบ และโอนงบข้ามรายการ สร้างสายอนุมัติอัตโนมัติจากโครงสร้างองค์กรและวงเงิน พร้อมยกระดับผู้อนุมัติเองเมื่อเกินงบ",
        en: "Submit and approve funding requests — budgeted, non-budgeted, and budget transfers. The approver line is generated from org structure and amount, and escalates automatically when a request goes over budget.",
      },
      role: { th: "Full-stack · พัฒนาและดูแลต่อเนื่อง", en: "Full-stack · ongoing development" },
      confidential: true,
      year: "2024–2025",
      impact: [
        {
          th: "ตัดขั้นตอนเดินเอกสารกระดาษออกทั้งหมด ผู้อนุมัติกดจบได้จากพอร์ทัลกลาง",
          en: "Removed paper routing entirely — approvers finish the job from the central portal.",
        },
        {
          th: "เช็คยอดงบคงเหลือกับระบบบัญชีตอนยื่น ไม่ต้องรอให้ถึงฝ่ายการเงินแล้วค่อยรู้ว่างบไม่พอ",
          en: "Checks remaining budget against the accounting system at submission, instead of finding out at finance that the money isn't there.",
        },
      ],
      stack: ["ASP.NET MVC", "SQL Server", "SOAP integration"],
    },
    {
      slug: "expense-system",
      name: {
        th: "ระบบเบิกค่าใช้จ่ายพนักงาน",
        en: "Employee expense system",
      },
      summary: {
        th: "ระบบเบิกและเคลียร์ค่าใช้จ่าย — เบิกคืน เงินยืม ค่าเดินทาง ผูกกับงบประมาณและสายอนุมัติ แล้วยิงรายการเข้าระบบบัญชีให้อัตโนมัติ",
        en: "Expense claims and clearing — reimbursement, cash advances, and travel — tied to budgets and approval lines, then posted into the accounting system automatically.",
      },
      role: { th: "พัฒนาและดูแลระบบ", en: "Development and maintenance" },
      confidential: true,
      year: "2024–2025",
      impact: [
        {
          th: "รายการที่อนุมัติแล้วเข้าบัญชีเองโดยไม่ต้องคีย์ซ้ำ",
          en: "Approved items post to accounting without being re-keyed.",
        },
        {
          th: "แยกโมดูลตั๋วเครื่องบินและอัตราแลกเปลี่ยนออกมาเป็นของตัวเอง แก้ทีละส่วนได้โดยไม่กระทบตัวหลัก",
          en: "Split the air-ticket and exchange-rate modules out so each can change without touching the core.",
        },
      ],
      stack: ["ASP.NET WebForms", "SQL Server", "SAP"],
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
      role: { th: "Backend · พัฒนาและแก้ปัญหาหน้างาน", en: "Backend · development and troubleshooting" },
      confidential: true,
      year: "2025",
      impact: [
        {
          th: "งาน onboarding/offboarding ที่เคยทำมือทีละบัญชี กลายเป็น job ที่รันตามข้อมูล HR",
          en: "Onboarding and offboarding went from per-account manual work to a job driven by HR data.",
        },
        {
          th: "แก้จุดที่ job รายงานว่า “ผ่าน” ทั้งที่ directory ปฏิเสธคำสั่ง เพราะอ่านผลลัพธ์ไม่ครบทั้งสองช่องทาง",
          en: "Fixed a case where the job reported success while the directory had rejected the command, because only one of the two output streams was being read.",
        },
      ],
      stack: ["ASP.NET Core", "PowerShell", "SSH", "Active Directory", "Docker"],
    },
    {
      slug: "dashboard-platform",
      name: {
        th: "แพลตฟอร์ม dashboard ภายในองค์กร",
        en: "In-house dashboard platform",
      },
      summary: {
        th: "แพลตฟอร์มทำ report/dashboard ของ back-office ที่เขียนเอง แทนการซื้อ license เครื่องมือ BI — วางโครงให้เพิ่ม report ตัวใหม่ได้โดยไม่ต้องตั้งโปรเจกต์ใหม่ทุกครั้ง",
        en: "An in-house reporting and dashboard platform for back-office, built instead of buying BI licences — structured so a new report drops in without standing up a new project each time.",
      },
      role: { th: "Full-stack · วางรากฐานแพลตฟอร์ม", en: "Full-stack · platform foundation" },
      confidential: true,
      year: "2025",
      impact: [
        {
          th: "report ตัวแรกคือ dashboard ผลแบบทดสอบพนักงานทั้งองค์กร ต่อจากฟอร์มออนไลน์ผ่าน flow ที่ตรวจคะแนนและส่งเมลเอง",
          en: "The first report is an org-wide assessment dashboard, fed by an online form through a flow that scores submissions and sends the mail itself.",
        },
        {
          th: "แยกเป็น 2 deployable (API กับหน้าเว็บ) ใช้ origin เดียวกันทั้ง dev และ prod ลดปัญหา CORS/cookie",
          en: "Two deployables (API and web) served from one origin in both dev and prod, which keeps CORS and cookie issues off the table.",
        },
      ],
      stack: [".NET", "Next.js", "Power Automate", "SQL Server", "Docker"],
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
  ] satisfies Project[],

  /** ความกว้างของงาน — ชื่อกลาง ๆ ทั้งหมด ไม่มีชื่อระบบภายใน */
  domains: [
    {
      title: { th: "การเงินและอนุมัติ", en: "Finance & approvals" },
      items: [
        { th: "ขออนุมัติใช้เงิน (มีงบ/ไม่มีงบ/โอนงบ)", en: "Funding requests (budgeted, non-budgeted, transfers)" },
        { th: "เบิกค่าใช้จ่ายและเงินยืมพนักงาน", en: "Employee expenses and cash advances" },
        { th: "วิเคราะห์อายุลูกหนี้และสุขภาพ AR", en: "AR aging and receivable health analysis" },
        { th: "พอร์ทัลอนุมัติกลางที่ทุกระบบมาเสียบ", en: "Central approval portal every system plugs into" },
      ],
    },
    {
      title: { th: "ปฏิบัติการและซัพพลายเชน", en: "Operations & supply chain" },
      items: [
        { th: "จัดการทรัพย์สิน: ย้าย โอน ยืม คืน", en: "Asset management: movement, transfer, borrow, return" },
        { th: "งานขนส่งและ job costing ของ forwarder", en: "Logistics jobs and forwarder job costing" },
        { th: "จัดสรร capacity ดาวเทียมและ service request", en: "Satellite capacity allocation and service requests" },
        { th: "บริหารความเสี่ยงองค์กร (ERM)", en: "Enterprise risk management" },
      ],
    },
    {
      title: { th: "แพลตฟอร์มกลาง", en: "Shared platforms" },
      items: [
        { th: "Single sign-on และการมอบอำนาจอนุมัติ", en: "Single sign-on and approval delegation" },
        { th: "จัดการสิทธิ์เมนูและ audit ตาม ISO", en: "Menu permissions and ISO-aligned audit" },
        { th: "คิวส่งอีเมลกลางพร้อมติดตามสถานะ", en: "Central mail queue with delivery tracking" },
        { th: "middleware จองปฏิทินและจัดการ mailbox", en: "Calendar booking and mailbox management middleware" },
      ],
    },
    {
      title: { th: "เว็บและ low-code", en: "Web & low-code" },
      items: [
        { th: "เว็บไซต์องค์กรสองภาษาบน Webflow", en: "Bilingual corporate website on Webflow" },
        { th: "อินทราเน็ตพนักงานบน Dataverse + Power Pages", en: "Employee intranet on Dataverse + Power Pages" },
        { th: "แอป CRUD บน SharePoint ผ่าน Microsoft Graph", en: "SharePoint CRUD apps over Microsoft Graph" },
        { th: "cloud flow เชื่อมฟอร์ม ฐานข้อมูล และอีเมล", en: "Cloud flows linking forms, databases, and mail" },
      ],
    },
  ] satisfies DomainGroup[],

  /**
   * AI ในกระบวนการทำงานจริง — เล่าเป็น "ทำอะไร → ได้ผลอะไร"
   * เขียนเฉพาะสิ่งที่ใช้อยู่จริงและอธิบายได้ตอนสัมภาษณ์ ไม่ใส่คำสวยที่พิสูจน์ไม่ได้
   */
  aiPractice: [
    {
      title: {
        th: "คลังความรู้ที่ AI อ่านต่อได้",
        en: "A knowledge base the assistant reads from",
      },
      body: {
        th: "ทุกครั้งที่แงะระบบไหนจนเข้าใจ ผมเขียนสิ่งที่ git บอกไม่ได้ทิ้งไว้ — เหตุผลเบื้องหลัง กับดักที่เจอ ข้อเท็จจริงของฐานข้อมูลและ deploy — เป็นโน้ตแยกตามระบบ แล้ว sync เข้าคลังกลางอัตโนมัติ งานรอบถัดไปเริ่มจากตรงนั้นแทนที่จะขุดใหม่",
        en: "Every time I dig into a system, I write down what git can't tell you later — the reasoning, the traps, the non-obvious facts about the database and deployment — as per-system notes synced into one shared store. The next task starts from there instead of from scratch.",
      },
      result: {
        th: "คำถามแบบ “ระบบนี้ทำงานยังไง” ที่เคยต้องไล่โค้ดครึ่งวัน เหลือระดับนาที และคนอื่นในทีมอ่านต่อได้",
        en: "“How does this system work?” went from half a day of code archaeology to minutes — and other people can read it too.",
      },
    },
    {
      title: {
        th: "กฎของแต่ละระบบ เขียนให้ AI รู้",
        en: "Domain rules the assistant actually knows",
      },
      body: {
        th: "ผมเขียนคู่มือสั้น ๆ ต่อระบบให้ผู้ช่วย AI โหลดเองเมื่อเข้าเรื่องนั้น — สัญญาของ webservice, โครงสิทธิ์, ขั้นตอน deploy, กติกาของ flow อนุมัติ ทำให้มันตอบจากของจริง ไม่ใช่เดาจากรูปแบบทั่วไป",
        en: "Each system has a short playbook the assistant loads when the topic comes up — webservice contracts, permission structures, deployment steps, approval-flow rules — so answers come from how the system really behaves, not from a generic guess.",
      },
      result: {
        th: "ลดข้อเสนอที่ฟังดูดีแต่ผิดบริบท ซึ่งเป็นความเสี่ยงที่แท้จริงของการใช้ AI กับระบบที่แตะเงินและการอนุมัติ",
        en: "Cuts the plausible-but-wrong suggestions — the real risk of using AI on systems that touch money and approvals.",
      },
    },
    {
      title: {
        th: "ด่านอัตโนมัติ แทนการอาศัยความจำ",
        en: "Automated gates instead of remembering",
      },
      body: {
        th: "กติกาที่เคยต้องจำเอง ผมย้ายไปเป็น hook และ agent ที่รันตอนนั้นเลย — ตรวจช่องโหว่ตามเกณฑ์เดียวกับ quality gate ขององค์กรก่อน push, บังคับรูปแบบ branch และ commit, เตือนเมื่อกำลังจะเดาพฤติกรรมของ legacy แทนที่จะไปอ่านโค้ดจริง",
        en: "Rules I used to have to remember now run at the moment they matter — a security scan against the same criteria as the org quality gate before every push, enforced branch and commit conventions, and a prompt when I'm about to assume legacy behaviour instead of reading the source.",
      },
      result: {
        th: "ความผิดพลาดถูกจับตั้งแต่ก่อนขึ้น ไม่ใช่ตอน review หรือหลัง deploy",
        en: "Mistakes get caught before they ship, not at review or after deploy.",
      },
    },
    {
      title: {
        th: "ให้ AI ทำงานกว้าง คนตัดสินใจ",
        en: "AI covers ground, I make the calls",
      },
      body: {
        th: "งานที่กินเวลาแต่ไม่กินความคิด — ไล่อ่านหลายสิบไฟล์ เทียบ dev กับ prod ร่างเอกสาร — ให้ผู้ช่วยทำขนานกัน ส่วนการตัดสินใจเชิงออกแบบและอะไรที่แตะข้อมูลจริง ผมอ่านเองก่อนเสมอ",
        en: "The work that eats time but not judgement — reading dozens of files, diffing dev against prod, drafting documentation — runs in parallel through the assistant. Design decisions and anything touching real data, I read myself first.",
      },
      result: {
        th: "งาน reverse-engineer ที่เคยกินเวลาเป็นวัน จบใน session เดียว โดยยังมีคนรับผิดชอบผลลัพธ์",
        en: "Reverse-engineering that used to take days now finishes in one session, with a human still accountable for the result.",
      },
    },
  ] satisfies Practice[],

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
      items: ["Next.js", "React", "Tailwind CSS", "HeroUI"],
    },
    {
      title: { th: "ข้อมูลและโครงสร้าง", en: "Data & infra" },
      items: ["SQL Server", "RabbitMQ", "Hangfire", "Docker", "GitLab CI", "Nginx"],
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
        "SAP integration",
        "Active Directory",
        "Microsoft Graph",
        "Power Automate",
        "Power Pages",
        "Dataverse",
        "Webflow",
      ],
    },
  ] satisfies Group[],

  /** TODO: ใส่ลิงก์จริง — ลบอันที่ไม่ใช้ออก */
  links: [
    { label: "GitHub", href: "https://github.com/jerateep" },
    { label: "Fastwork", href: "https://fastwork.co/byob/2KRa1es4ON" },
    { label: "Email", href: "mailto:jerateep_@live.com" },
    // { label: "LinkedIn", href: "https://linkedin.com/in/..." },
  ],
} as const;

export type Profile = typeof profile;

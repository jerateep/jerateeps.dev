/**
 * ตัวกันข้อมูลภายในหลุดขึ้นเว็บ
 *
 * เนื้อหาในเว็บนี้เรียบเรียงมาจาก second-brain vault ซึ่งมี IP เซิร์ฟเวอร์ ชื่อ DB
 * ชื่อตาราง GitLab host และ GUID ของ environment ปนอยู่เต็มไปหมด
 * สคริปต์นี้อ่านทุกไฟล์ที่จะถูก render แล้ว fail ถ้าเจอรูปแบบพวกนั้น
 *
 * รันเอง:      npm run check:content
 * รันอัตโนมัติ: npm run build (ผ่าน prebuild) และใน CI
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
/** ตรวจเฉพาะที่ที่ข้อความจริงอยู่ — ไม่ตรวจตัวสคริปต์เองและไฟล์ config */
const SCAN_DIRS = ["content", "app", "components"];

const RULES = [
  {
    id: "private-ip",
    why: "IP ภายในองค์กร",
    re: /\b(?:10|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b|\b192\.168\.\d{1,3}\.\d{1,3}\b/g,
  },
  {
    id: "internal-host",
    why: "hostname ภายใน (โดเมนบริษัท/GitLab/CRM)",
    re: /\b[\w.-]+\.(?:REDACTED\.net|REDACTED\.io|REDACTED\.com|crm5?\.REDACTED\.com)\b/gi,
  },
  {
    id: "db-name",
    why: "ชื่อฐานข้อมูลภายใน",
    re: /\bdb[_-](?:backoffice|sharepoint|fin_acct)\b/gi,
  },
  {
    id: "internal-table",
    why: "ชื่อตาราง/view ของระบบภายใน",
    re: /\b(?:com|sys|aud|ctl|mem|exp|edi|ams|cms|rpa|nac|oe|ris|oauth)_[A-Za-z]\w*\b/g,
  },
  {
    id: "sap-object",
    why: "ชื่อ object ของ SAP",
    re: /\b(?:Z[A-Z0-9_]{4,}|REDACTED|REDACTED|REDACTED|REDACTED|REDACTED)\b/g,
  },
  {
    id: "guid",
    why: "GUID ของ environment/site",
    re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
  },
  {
    id: "unc-path",
    why: "path ไฟล์/ไดรฟ์ภายใน",
    re: /(?:\\\\[\w.-]+\\|\b[A-Z]:\\Users\\)/g,
  },
  {
    id: "credential",
    why: "อะไรที่ดูเหมือน credential",
    re: /\b(?:password|passwd|api[_-]?key|secret|client[_-]?secret|connectionstring)\s*[:=]\s*["'][^"']+["']/gi,
  },
];

/** ข้อความที่ปลอดภัยแต่ไปชนกฎข้างบน — เติมได้ พร้อมเหตุผล */
const ALLOW = [
  "ams_", // ไม่มีจริงในเนื้อหา แต่กันไว้เผื่อคำภาษาอังกฤษปกติ
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|md|mdx|json|css)$/.test(entry)) out.push(full);
  }
  return out;
}

const findings = [];

for (const dir of SCAN_DIRS) {
  let files;
  try {
    files = walk(join(ROOT, dir));
  } catch {
    continue; // โฟลเดอร์ยังไม่มี ข้ามไป
  }

  for (const file of files) {
    // สคริปต์ตรวจเองมี pattern อยู่ในตัว จึงต้องข้าม
    if (file.includes("check-content")) continue;

    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const rule of RULES) {
        rule.re.lastIndex = 0;
        for (const match of line.matchAll(rule.re)) {
          if (ALLOW.some((a) => match[0].toLowerCase().includes(a))) continue;
          findings.push({
            file: relative(ROOT, file),
            line: i + 1,
            rule: rule.id,
            why: rule.why,
            text: match[0],
          });
        }
      }
    });
  }
}

if (findings.length === 0) {
  console.log("✓ check-content: ไม่พบข้อมูลภายในในเนื้อหาที่จะขึ้นเว็บ");
  process.exit(0);
}

console.error(`\n✗ check-content: พบ ${findings.length} จุดที่ห้ามขึ้นเว็บ\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  [${f.rule}] ${f.why}`);
  console.error(`    → ${f.text}`);
}
console.error(
  "\nแก้โดยเปลี่ยนเป็นคำอธิบายกลาง ๆ หรือถ้ามั่นใจว่าปลอดภัยจริง ให้เติมใน ALLOW ของ scripts/check-content.mjs พร้อมเหตุผล\n",
);
process.exit(1);

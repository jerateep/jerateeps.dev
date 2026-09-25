/**
 * ตัวกันข้อมูลภายในหลุดขึ้นเว็บ
 *
 * เนื้อหาในเว็บนี้เรียบเรียงมาจาก second-brain vault ซึ่งมี IP เซิร์ฟเวอร์ ชื่อ DB
 * ชื่อตาราง GitLab host และ GUID ของ environment ปนอยู่เต็มไปหมด
 * สคริปต์นี้อ่านไฟล์ที่จะถูก render แล้ว fail ถ้าเจอรูปแบบพวกนั้น
 *
 * ⚠️ กฎที่มี "ชื่อจริง" ขององค์กรอยู่ใน scripts/deny-list.local.json ซึ่ง gitignore ไว้
 * เพราะ repo นี้เป็น public — ถ้า commit รายชื่อขึ้นไป ตัวรายชื่อเองก็คือข้อมูลที่รั่ว
 * ในไฟล์นี้เก็บเฉพาะกฎเชิงโครงสร้างที่ไม่ต้องเอ่ยชื่อใคร
 *
 * รันเอง:      npm run check:content
 * รันอัตโนมัติ: npm run build (ผ่าน prebuild) และใน CI
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";

const ROOT = process.cwd();

/** โฟลเดอร์ที่ไล่ทั้งต้นไม้ */
const SCAN_DIRS = ["content", "app", "components", "scripts", ".github"];
/** ไฟล์ระดับรากที่ต้องตรวจด้วย — เนื้อหาจาก vault เคยถูกวางในไฟล์พวกนี้ได้เหมือนกัน */
const SCAN_FILES = [
  "README.md",
  "sonar-project.properties",
  "package.json",
  "next.config.ts",
];

/** กฎเชิงโครงสร้าง — ไม่มีชื่อจริงขององค์กรใด commit ขึ้น repo สาธารณะได้ */
const STRUCTURAL_RULES = [
  {
    id: "private-ip",
    why: "IP ภายในองค์กร",
    re: /\b(?:10|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b|\b192\.168\.\d{1,3}\.\d{1,3}\b/g,
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
  {
    id: "corp-email",
    why: "อีเมลที่ไม่ใช่โดเมนสาธารณะ (อาจเป็นอีเมลบริษัท)",
    re: /\b[\w.+-]+@(?!live\.com|gmail\.com|outlook\.com|hotmail\.com|example\.com)[\w-]+\.[\w.-]+\b/g,
  },
];

const DENY_FILE = join(ROOT, "scripts", "deny-list.local.json");

/** กฎที่มีชื่อจริง โหลดจากไฟล์ local ถ้ามี */
function loadLocalRules() {
  if (!existsSync(DENY_FILE)) return null;
  const parsed = JSON.parse(readFileSync(DENY_FILE, "utf8"));
  return parsed.rules.map((r) => ({
    id: r.id,
    why: r.why,
    re: new RegExp(r.re, r.flags ?? "g"),
  }));
}

const localRules = loadLocalRules();
const RULES = [...STRUCTURAL_RULES, ...(localRules ?? [])];

/** ข้อความที่ปลอดภัยแต่ไปชนกฎข้างบน — เติมได้ พร้อมเหตุผล */
const ALLOW = [
  // id ของหน้าโปรไฟล์สาธารณะ Google Cloud Skills Boost — ตั้งใจให้แชร์ ไม่ใช่ id ของ environment
  "ff0df1b5-da13-4301-9cdc-ee3c838afa30",
  // โดเมนสาธารณะที่เว็บนี้ลิงก์ไปโดยตั้งใจ
  "@jerateeps.dev",
  "noreply@",
];

/**
 * ข้อความที่ชนกฎเพราะมันคือ "ตัว regex" ในไฟล์นี้เอง ไม่ใช่ข้อมูลจริง
 * ระบุเป็นรายไฟล์ + รายข้อความ ไม่ใช่การยกเว้นทั้งไฟล์
 * (การยกเว้นทั้งไฟล์คือช่องที่ทำให้ deny list เคยหลุดมาแล้ว)
 */
const SELF_ALLOW = {
  "scripts/check-content.mjs": ["\\\\Users\\"],
};

/** ไฟล์ที่ git ignore อยู่ = ขึ้น repo สาธารณะไม่ได้ จึงไม่ต้องตรวจ */
function gitIgnored(paths) {
  if (paths.length === 0) return new Set();
  try {
    const out = execFileSync("git", ["check-ignore", "--stdin"], {
      input: paths.join("\n"),
      encoding: "utf8",
    });
    return new Set(out.split(/\r?\n/).filter(Boolean));
  } catch (err) {
    // exit code 1 = ไม่มีไฟล์ไหนถูก ignore ซึ่งไม่ใช่ error
    if (err.status === 1) return new Set(String(err.stdout ?? "").split(/\r?\n/).filter(Boolean));
    throw err;
  }
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|mjs|js|md|mdx|json|css|ya?ml|properties)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const files = [];
for (const dir of SCAN_DIRS) {
  try {
    files.push(...walk(join(ROOT, dir)));
  } catch {
    // โฟลเดอร์ยังไม่มี ข้ามไป
  }
}
for (const name of SCAN_FILES) {
  const full = join(ROOT, name);
  if (existsSync(full)) files.push(full);
}

const ignored = gitIgnored(files.map((f) => relative(ROOT, f).replace(/\\/g, "/")));

const findings = [];
for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  // ไฟล์ที่ git ignore ขึ้น repo ไม่ได้อยู่แล้ว — deny-list.local.json อยู่กลุ่มนี้
  if (ignored.has(rel)) continue;

  const selfAllow = SELF_ALLOW[rel] ?? [];
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      for (const match of line.matchAll(rule.re)) {
        if (ALLOW.some((a) => match[0].toLowerCase().includes(a.toLowerCase()))) {
          continue;
        }
        if (selfAllow.includes(match[0])) continue;
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

if (!localRules) {
  console.warn(
    `⚠ ไม่พบ ${relative(ROOT, DENY_FILE)} — ตรวจเฉพาะกฎเชิงโครงสร้าง\n` +
      "  ไฟล์นี้เก็บ 'ชื่อจริง' ที่ห้ามหลุด (โดเมนบริษัท ชื่อ DB ชื่อตาราง ชื่อเครื่อง)\n" +
      "  จึงถูก gitignore ไว้ — ถ้าคอมมิตขึ้น repo สาธารณะ ตัวรายชื่อเองก็คือข้อมูลที่รั่ว\n" +
      "  เครื่องที่ใช้แก้เนื้อหาต้องสร้างเองในรูปแบบนี้:\n" +
      '  { "rules": [ { "id": "internal-host", "why": "โดเมนภายใน",\n' +
      '                 "re": "example[.]internal", "flags": "gi" } ] }',
  );
}

if (findings.length === 0) {
  console.log(
    `✓ check-content: ตรวจ ${files.length} ไฟล์ ไม่พบข้อมูลภายในในเนื้อหาที่จะขึ้นเว็บ`,
  );
  process.exit(0);
}

console.error(`\n✗ check-content: พบ ${findings.length} จุดที่ห้ามขึ้นเว็บ\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  [${f.rule}] ${f.why}`);
  console.error(`    → ${f.text}`);
}
console.error(
  "\nแก้โดยเปลี่ยนเป็นคำอธิบายกลาง ๆ หรือถ้ามั่นใจว่าปลอดภัยจริง ให้เติมใน ALLOW ของสคริปต์นี้พร้อมเหตุผล\n",
);
process.exit(1);

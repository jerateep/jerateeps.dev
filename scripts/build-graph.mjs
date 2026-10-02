/**
 * สร้างภาพกราฟความรู้จากโครงสร้างลิงก์จริงใน second-brain vault
 *
 * ผลลัพธ์คือ content/graph.json ที่มีพิกัด เส้น และป้ายหัวข้อของกลุ่ม — ไม่มีชื่อโน้ต
 * และไม่มีชื่อโฟลเดอร์ เพราะชื่อเหล่านั้นคือชื่อระบบภายในที่ทั้งเว็บตั้งใจไม่เปิดเผย
 * ป้ายมาจากตาราง TOPICS ด้านล่างเท่านั้น (ชื่อตามหน้าที่ที่เจ้าของตรวจแล้ว)
 *
 * รันมือเมื่อ vault เปลี่ยนโครงสร้างจนอยากอัปเดตภาพ:
 *   node scripts/build-graph.mjs <path-ไป-vault>
 * จัด layout ใหม่จาก content/graph.json ที่มีอยู่ โดยไม่ต้องมี vault (ไม่มีป้าย เพราะไฟล์ไม่มีชื่อโฟลเดอร์):
 *   node scripts/build-graph.mjs --relayout
 *
 * ไม่ได้ผูกกับ build เพราะ vault ไม่ได้อยู่ใน repo นี้ และ CI มองไม่เห็น
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename, relative, sep } from "node:path";

const OUT = join(process.cwd(), "content", "graph.json");
const VAULT = process.argv[2];
if (!VAULT) {
  console.error("usage: node scripts/build-graph.mjs <vault-path> | --relayout");
  process.exit(2);
}

/**
 * ป้ายหัวข้อของแต่ละกลุ่ม: โฟลเดอร์ใน vault → ชื่อตามหน้าที่ที่ขึ้นเว็บได้
 * ⚠️ ค่าทางขวาจะขึ้นเว็บสาธารณะ — ใช้ชื่อตามหน้าที่เท่านั้น ห้ามชื่อระบบภายใน
 * โฟลเดอร์ที่ไม่อยู่ในตารางนี้ไม่มีป้าย (ตั้งใจ ไม่ได้ลืม) และกลุ่มเล็กกว่า MIN_LABEL โน้ตก็ไม่มีป้าย
 */
const TOPICS = {
  rpa: "RPA",
  webflow: "Website",
  memoonline: "Budget approval",
  "sap-doc": "SAP documents",
  "menu-permission": "Permissions",
  timesheet: "Timesheet",
  "sap-webservice": "SAP integration",
  sso: "SSO",
  memory: "Working rules",
  infra: "Infrastructure",
  cms: "Capacity",
};
const MIN_LABEL = 7;

// ---- อ่านโครงสร้าง: จาก vault หรือจาก graph.json เดิม ----
let n, edges, groupOf, groupNames, groupCount;

if (VAULT === "--relayout") {
  const old = JSON.parse(readFileSync(OUT, "utf8"));
  n = old.nodes.length;
  edges = old.edges;
  groupOf = old.nodes.map((node) => node.g);
  groupCount = old.groups;
  groupNames = null; // ไม่มีชื่อโฟลเดอร์ในไฟล์ จึงไม่มีป้าย
} else {
  const ROOT = join(VAULT, "knowledge");
  const walk = (dir) =>
    readdirSync(dir).flatMap((entry) => {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) return walk(full);
      return entry.endsWith(".md") ? [full] : [];
    });
  const files = walk(ROOT);

  // index: ชื่อไฟล์ (ไม่เอานามสกุล) -> ลำดับ node
  const idOf = new Map();
  const groups = new Map();
  groupOf = [];
  files.forEach((file, i) => {
    idOf.set(basename(file, ".md").toLowerCase(), i);
    const top = relative(ROOT, file).split(sep)[0];
    if (!groups.has(top)) groups.set(top, groups.size);
    groupOf.push(groups.get(top));
  });

  // เส้นเชื่อมจาก [[wikilink]] ที่ปลายทางมีอยู่จริง
  const edgeSet = new Set();
  files.forEach((file, from) => {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/\[\[([^\]|#]+)/g)) {
      const to = idOf.get(m[1].trim().toLowerCase());
      if (to === undefined || to === from) continue;
      edgeSet.add(from < to ? `${from},${to}` : `${to},${from}`);
    }
  });
  n = files.length;
  edges = [...edgeSet].map((s) => s.split(",").map(Number));
  groupNames = [...groups.keys()];
  groupCount = groups.size;
}

const degree = new Array(n).fill(0);
for (const [a, b] of edges) {
  degree[a]++;
  degree[b]++;
}

// ---- force layout ----
// ponytail: แรงผลักคิดแบบ O(n²) ทุกรอบ — n≈230 จึงเร็วพออยู่แล้ว
// ถ้า vault โตเกินหลักพันโน้ตค่อยเปลี่ยนไปใช้ Barnes-Hut หรือ d3-force
const rand = (() => {
  let s = 20260924; // seed คงที่ เพื่อให้ผลลัพธ์ซ้ำได้ทุกครั้งที่รัน
  return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
})();

const x = new Array(n);
const y = new Array(n);
for (let i = 0; i < n; i++) {
  // เริ่มด้วยการวางแต่ละกลุ่มรอบวงรีคนละมุม ช่วยให้คลัสเตอร์แยกกันเร็วขึ้น
  const a = (groupOf[i] / groupCount) * Math.PI * 2 + rand() * 0.4;
  const r = 200 + rand() * 120;
  x[i] = Math.cos(a) * r * 1.6;
  y[i] = Math.sin(a) * r;
}

const ITER = 700;
for (let step = 0; step < ITER; step++) {
  const cool = 1 - step / ITER;
  const fx = new Array(n).fill(0);
  const fy = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let dx = x[i] - x[j];
      let dy = y[i] - y[j];
      let d2 = dx * dx + dy * dy;
      if (d2 < 0.01) {
        dx = rand() - 0.5;
        dy = rand() - 0.5;
        d2 = 0.01;
      }
      // ต่างกลุ่มผลักกันแรงกว่า — กลุ่มจึงแยกเป็นเกาะ ไม่ปนเป็นใยแมงมุมก้อนเดียว
      const f = (groupOf[i] === groupOf[j] ? 420 : 900) / d2;
      fx[i] += dx * f;
      fy[i] += dy * f;
      fx[j] -= dx * f;
      fy[j] -= dy * f;
    }
  }

  for (const [a, b] of edges) {
    const dx = x[b] - x[a];
    const dy = y[b] - y[a];
    const d = Math.hypot(dx, dy) || 0.01;
    // เส้นข้ามกลุ่มยืดได้ยาวกว่า ไม่ดึงเกาะเข้าหากันจนทับ
    const rest = groupOf[a] === groupOf[b] ? 24 : 70;
    const f = (d - rest) * 0.035;
    fx[a] += (dx / d) * f;
    fy[a] += (dy / d) * f;
    fx[b] -= (dx / d) * f;
    fy[b] -= (dy / d) * f;
  }

  for (let i = 0; i < n; i++) {
    // ดึงเข้ากลางแนวตั้งแรงกว่าแนวนอน — ภาพจึงกว้างตามกรอบ 1000x620 ไม่กองเป็นก้อนกลม
    fx[i] -= x[i] * 0.005;
    fy[i] -= y[i] * 0.011;
    x[i] += Math.max(-12, Math.min(12, fx[i])) * cool;
    y[i] += Math.max(-12, Math.min(12, fy[i])) * cool;
  }
}

// โน้ตเดี่ยวที่ไม่มีลิงก์ไม่ต้องวาด — ลอยกระจายตามขอบแล้วดูรก ตัวเลขใน caption ยังนับรวมเหมือนเดิม
const keep = [];
for (let i = 0; i < n; i++) if (degree[i] > 0) keep.push(i);
const newId = new Map(keep.map((old, i) => [old, i]));

// ---- normalise ลงกรอบ 1000x620 ----
const W = 1000;
const H = 620;
const pad = 30;
const kx = keep.map((i) => x[i]);
const ky = keep.map((i) => y[i]);
const minX = Math.min(...kx);
const maxX = Math.max(...kx);
const minY = Math.min(...ky);
const maxY = Math.max(...ky);
const scale = Math.min((W - pad * 2) / (maxX - minX), (H - pad * 2) / (maxY - minY));
const offX = (W - (maxX - minX) * scale) / 2 - minX * scale;
const offY = (H - (maxY - minY) * scale) / 2 - minY * scale;

const round = (v) => Math.round(v * 10) / 10;
const nodes = keep.map((i) => ({
  x: round(x[i] * scale + offX),
  y: round(y[i] * scale + offY),
  r: round(2.2 + Math.min(degree[i], 12) * 0.55),
  g: groupOf[i],
}));
const keptEdges = edges.map(([a, b]) => [newId.get(a), newId.get(b)]);

// ป้ายวางที่จุดศูนย์ถ่วงของกลุ่ม (คิดหลัง normalise แล้ว)
const labels = [];
(groupNames ?? []).forEach((folder, g) => {
  const text = TOPICS[folder];
  const members = nodes.filter((node) => node.g === g);
  if (!text || members.length < MIN_LABEL) return;
  const cx = members.reduce((s, m) => s + m.x, 0) / members.length;
  const cy = members.reduce((s, m) => s + m.y, 0) / members.length;
  labels.push({ x: round(cx), y: round(cy), text });
});

writeFileSync(
  OUT,
  JSON.stringify({
    _comment:
      "สร้างโดย scripts/build-graph.mjs — พิกัด เส้น และป้ายหัวข้อจากตาราง TOPICS ไม่มีชื่อโน้ตหรือชื่อโฟลเดอร์",
    width: W,
    height: H,
    groups: groupCount,
    nodes,
    edges: keptEdges,
    labels,
  }),
);
console.log(
  `graph.json: ${nodes.length} nodes (${n - nodes.length} isolated hidden), ${keptEdges.length} edges, ${groupCount} clusters, ${labels.length} labels: ${labels.map((l) => l.text).join(", ")}`,
);

/**
 * สร้างภาพกราฟความรู้จากโครงสร้างลิงก์จริงใน second-brain vault
 *
 * ผลลัพธ์คือ content/graph.json ที่มี "พิกัดกับเส้น" เท่านั้น — ไม่มีชื่อโน้ต
 * ไม่มีชื่อโฟลเดอร์ ไม่มีข้อความใด ๆ ติดออกมา เพราะชื่อโน้ตคือชื่อระบบภายใน
 * ซึ่งเป็นสิ่งที่ทั้งเว็บนี้ตั้งใจไม่เปิดเผย
 *
 * รันมือเมื่อ vault เปลี่ยนโครงสร้างจนอยากอัปเดตภาพ:
 *   node scripts/build-graph.mjs <path-ไป-vault>
 *
 * ไม่ได้ผูกกับ build เพราะ vault ไม่ได้อยู่ใน repo นี้ และ CI มองไม่เห็น
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename, relative, sep } from "node:path";

const VAULT = process.argv[2];
if (!VAULT) {
  console.error("usage: node scripts/build-graph.mjs <vault-path>");
  process.exit(2);
}

const ROOT = join(VAULT, "knowledge");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

const files = walk(ROOT);

// index: ชื่อไฟล์ (ไม่เอานามสกุล) -> ลำดับ node
const idOf = new Map();
const groupOf = [];
const groups = new Map();

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
const edges = [...edgeSet].map((s) => s.split(",").map(Number));

const n = files.length;
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
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
})();

const x = new Array(n);
const y = new Array(n);
for (let i = 0; i < n; i++) {
  // เริ่มด้วยการวางแต่ละกลุ่มรอบวงกลมคนละมุม ช่วยให้คลัสเตอร์แยกกันเร็วขึ้น
  const a = (groupOf[i] / groups.size) * Math.PI * 2 + rand() * 0.6;
  const r = 200 + rand() * 120;
  x[i] = Math.cos(a) * r;
  y[i] = Math.sin(a) * r;
}

const ITER = 600;
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
      const f = 420 / d2;
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
    const f = (d - 28) * 0.035;
    fx[a] += (dx / d) * f;
    fy[a] += (dy / d) * f;
    fx[b] -= (dx / d) * f;
    fy[b] -= (dy / d) * f;
  }

  for (let i = 0; i < n; i++) {
    // ดึงเข้ากลางเบา ๆ กันโน้ตที่ไม่มีลิงก์ลอยหลุดขอบ
    fx[i] -= x[i] * 0.007;
    fy[i] -= y[i] * 0.007;
    x[i] += Math.max(-12, Math.min(12, fx[i])) * cool;
    y[i] += Math.max(-12, Math.min(12, fy[i])) * cool;
  }
}

// ---- normalise ลงกรอบ 1000x620 ----
const W = 1000;
const H = 620;
const pad = 24;
const minX = Math.min(...x);
const maxX = Math.max(...x);
const minY = Math.min(...y);
const maxY = Math.max(...y);
const scale = Math.min((W - pad * 2) / (maxX - minX), (H - pad * 2) / (maxY - minY));
const offX = (W - (maxX - minX) * scale) / 2 - minX * scale;
const offY = (H - (maxY - minY) * scale) / 2 - minY * scale;

const round = (v) => Math.round(v * 10) / 10;
const nodes = [];
for (let i = 0; i < n; i++) {
  nodes.push({
    x: round(x[i] * scale + offX),
    y: round(y[i] * scale + offY),
    r: round(2.2 + Math.min(degree[i], 12) * 0.55),
    g: groupOf[i],
  });
}

const out = {
  _comment:
    "สร้างโดย scripts/build-graph.mjs — มีแต่พิกัดกับเส้น ไม่มีชื่อโน้ตหรือชื่อโฟลเดอร์",
  width: W,
  height: H,
  groups: groups.size,
  nodes,
  edges,
};

writeFileSync(join(process.cwd(), "content", "graph.json"), JSON.stringify(out));
console.log(
  `graph.json: ${n} nodes, ${edges.length} edges, ${groups.size} clusters — ไม่มีชื่อใด ๆ ติดออกมา`,
);

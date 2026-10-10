/**
 * กันข้อความในแผนภาพล้นกล่อง
 *
 * SVG ไม่ตัดบรรทัดให้ ข้อความที่ยาวเกินกล่องจึงล้นออกไปทับของข้างเคียงแบบเงียบ ๆ
 * เคยเกิดมาแล้วตอนเปลี่ยนป้ายเป็นชื่อผลิตภัณฑ์จริง — ยาวขึ้นโดยไม่มีอะไรฟ้อง
 *
 * สคริปต์นี้ประมาณความกว้างจากชนิดตัวอักษร ไม่ได้วัดจากเบราว์เซอร์จริง
 * จึงตั้งงบไว้ต่ำกว่าความกว้างจริงเล็กน้อยเพื่อกันพลาด
 *
 * รันเอง: npm run check:diagram   (รันอัตโนมัติผ่าน prebuild)
 */

import { profile } from "../content/profile.ts";

/** ความกว้างของกล่อง/ตัวอักษร ต้องตรงกับ components/PipelineDiagram.tsx */
const BOX_W = 176;
const LEFT_PAD = 12;
const RIGHT_PAD = 12;
const TITLE_PX = 17;
const SUB_PX = 13;
/** ป้ายบนเส้นต้องพอดีช่องระหว่างกล่อง (272 − 176) */
const EDGE_GAP = 96;
const LABEL_PX = 12.5;

/**
 * ประมาณความกว้างข้อความ
 * บรรทัดย่อยใช้ฟอนต์ mono ซึ่งทุกตัวอักษรกว้างเท่ากันรวมช่องว่าง (≈0.6em)
 * ส่วนหัวกล่องใช้ฟอนต์ sans จึงคิดตามชนิดตัวอักษร
 */
function estimate(text, px, mono) {
  if (mono) return [...text].length * 0.6 * px;
  let units = 0;
  for (const ch of text) {
    if (/[฀-๿]/.test(ch)) {
      // สระบนล่างไม่กินความกว้าง
      units += /[ัิ-ฺ็-๎]/.test(ch) ? 0 : 0.62;
    } else if (/[A-Z0-9]/.test(ch)) units += 0.64;
    else if (/[a-z]/.test(ch)) units += 0.58;
    else if (ch === ' ') units += 0.3;
    else units += 0.5;
  }
  return units * px;
}

const diagram = profile.projects.find((p) => p.diagram)?.diagram;
if (!diagram) {
  console.log("✓ check-diagram: ไม่มีแผนภาพให้ตรวจ");
  process.exit(0);
}

const problems = [];
for (const [key, value] of Object.entries(diagram)) {
  const isSub = key.endsWith("Sub");
  if (key.startsWith("lg")) continue; // legend อยู่แถบล่าง มีที่ว่างพอ
  const isEdge = /^e[A-Z]/.test(key);
  // ป้ายบนเส้นใช้ mono และต้องพอดีช่องระหว่างกล่อง รวม padding 12
  const budget = isEdge ? EDGE_GAP - 12 : BOX_W - LEFT_PAD - RIGHT_PAD;
  const px = isEdge ? LABEL_PX : isSub ? SUB_PX : TITLE_PX;
  const mono = isEdge || isSub;

  for (const [lang, text] of Object.entries(value)) {
    const w = estimate(text, px, mono);
    if (w > budget) {
      problems.push(
        `  ${key} (${lang}) ≈ ${Math.round(w)}u เกินงบ ${budget}u — "${text}"`,
      );
    }
  }
}

if (problems.length === 0) {
  console.log("✓ check-diagram: ป้ายทุกตัวอยู่ในกล่อง");
  process.exit(0);
}

console.error(`\n✗ check-diagram: ป้าย ${problems.length} จุดจะล้นกล่อง\n`);
console.error(problems.join("\n"));
console.error("\nแก้โดยย่อข้อความ หรือขยายกล่องใน components/PipelineDiagram.tsx\n");
process.exit(1);

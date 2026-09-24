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
const BOX_W = 180;
const WIDE_BOX_W = 190;
const ICON_OFFSET = 40;
const RIGHT_PAD = 10;
const TITLE_PX = 16;
const SUB_PX = 12.5;

/** กล่องที่กว้างกว่ามาตรฐาน — ฝั่งขวาของแผนภาพ */
const WIDE = new Set(["erp", "partner", "share"]);
/** กล่องผู้ใช้แคบกว่าและไม่มีบรรทัดย่อย */
const NARROW = { user: 110 };

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
  const base = key.replace(/Sub$/, "");
  if (key.startsWith("e") && /^e[A-Z]/.test(key)) continue; // ป้ายบนเส้น ไม่ได้อยู่ในกล่อง
  if (key.startsWith("panel")) continue; // ป้ายกรอบกลุ่ม อยู่บนเส้นขอบ ไม่มีกล่องคุม

  const boxW = NARROW[base] ?? (WIDE.has(base) ? WIDE_BOX_W : BOX_W);
  const budget = boxW - ICON_OFFSET - RIGHT_PAD;
  const px = isSub ? SUB_PX : TITLE_PX;

  for (const [lang, text] of Object.entries(value)) {
    const w = estimate(text, px);
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

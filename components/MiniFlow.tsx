import type { L, Locale } from "@/content/profile";
import { ICONS } from "./icons";

export type MiniStep = { label: L; icon: string };

/**
 * visual ย่อประจำการ์ดผลงาน — บอกรูปร่างของระบบใน 3–5 ขั้น
 *
 * ทำเป็น HTML/flex ไม่ใช่ SVG ด้วยเหตุผลเดียวกับที่เคยเจอมาแล้ว:
 * SVG ไม่ตัดบรรทัดและย่อตัวอักษรตามความกว้าง พอการ์ดแคบลงจะอ่านไม่ออก
 *
 * แนวตั้งแบบ timeline: เส้นบางเชื่อมไอคอนแทน ↓ ที่กินบรรทัดของตัวเอง
 * - ↓ แยกบรรทัดทำให้ 4 ขั้นกลายเป็น 7 แถว กล่องสูงโล่ง
 * - แนวนอนแบบ flex-wrap ตัดบรรทัดไม่แน่นอน อ่านลำดับไม่ออก
 * - แนวนอนแบบแบ่งช่องเท่ากันเหลือช่องละ ~48px จนป้ายแตก 4 บรรทัด
 *
 * ⚠️ ป้ายต้องเป็นชื่อเชิงหน้าที่เท่านั้น เหมือนแผนภาพใหญ่
 */
export function MiniFlow({
  steps,
  lang,
}: {
  steps: readonly MiniStep[];
  lang: Locale;
}) {
  return (
    <ol className="mt-4 rounded-md border border-border bg-bg px-3 py-2">
      {steps.map((step, i) => (
        <li key={i} className="relative flex items-center gap-2.5 py-1.5">
          {/* เส้นเชื่อมไปขั้นถัดไป — ลากจากใต้ไอคอนถึงไอคอนถัดไป */}
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute top-[calc(50%+10px)] left-[7.5px] h-[calc(100%-20px)] w-px bg-accent/40"
            />
          )}
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-4 shrink-0 stroke-accent"
            fill="none"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ICONS[step.icon] ?? ICONS.gear} />
          </svg>
          <span className="text-xs text-muted">{step.label[lang]}</span>
        </li>
      ))}
    </ol>
  );
}

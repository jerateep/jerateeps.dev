import type { L, Locale } from "@/content/profile";
import { ICONS } from "./icons";

export type MiniStep = { label: L; icon: string };

/**
 * visual ย่อประจำการ์ดผลงาน — บอกรูปร่างของระบบใน 3–5 ขั้น
 *
 * ทำเป็น HTML/flex ไม่ใช่ SVG ด้วยเหตุผลเดียวกับที่เคยเจอมาแล้ว:
 * SVG ไม่ตัดบรรทัดและย่อตัวอักษรตามความกว้าง พอการ์ดแคบลงจะอ่านไม่ออก
 *
 * เรียงต่อกันแบบ flex-wrap ให้แต่ละขั้นกว้างตามข้อความของมันเอง
 * - แนวตั้ง (↓ กินหนึ่งบรรทัด) เคยทำให้ 4 ขั้นกลายเป็น 7 แถว ครึ่งขวาของกล่องว่าง
 * - แนวนอนแบบแบ่งช่องเท่ากันเคยเหลือช่องละ ~48px จนป้ายแตก 4 บรรทัด
 * ลูกศรอยู่ใน li เดียวกับป้ายถัดไป จึงไม่หลุดไปค้างท้ายบรรทัดตอนตัดบรรทัด
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
    <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-md border border-border bg-bg p-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className="text-accent">
              →
            </span>
          )}
          <span className="flex items-center gap-1.5">
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
          </span>
        </li>
      ))}
    </ol>
  );
}

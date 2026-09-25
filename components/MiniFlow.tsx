import { Fragment } from "react";
import type { L, Locale } from "@/content/profile";
import { ICONS } from "./icons";

export type MiniStep = { label: L; icon: string };

/**
 * visual ย่อประจำการ์ดผลงาน — บอกรูปร่างของระบบใน 3–5 ขั้น
 *
 * ทำเป็น HTML/flex ไม่ใช่ SVG ด้วยเหตุผลเดียวกับที่เคยเจอมาแล้ว:
 * SVG ไม่ตัดบรรทัดและย่อตัวอักษรตามความกว้าง พอการ์ดแคบลงจะอ่านไม่ออก
 *
 * เรียงแนวตั้งเสมอ ไม่พลิกเป็นแนวนอนตาม breakpoint เพราะ breakpoint ผูกกับ
 * ความกว้างจอ ไม่ใช่ความกว้างการ์ด และพอจอ ≥640px กริดก็กลายเป็นสองคอลัมน์พอดี
 * การ์ดจึงกว้างราว 350px เสมอ แนวนอนเลยเหลือช่องป้ายละ ~48px จนข้อความแตก 4 บรรทัด
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
    <ol className="mt-4 flex flex-col gap-2 rounded-md border border-border bg-bg p-3">
      {steps.map((step, i) => (
        <Fragment key={i}>
          <li className="flex items-center gap-2">
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
            <span className="text-xs text-muted">
              {step.label[lang]}
            </span>
          </li>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="pl-[7px] text-accent"
            >
              ↓
            </span>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

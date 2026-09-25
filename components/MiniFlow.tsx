import { Fragment } from "react";
import type { L, Locale } from "@/content/profile";
import { ICONS } from "./icons";

export type MiniStep = { label: L; icon: string };

/**
 * visual ย่อประจำการ์ดผลงาน — บอกรูปร่างของระบบใน 3–5 ขั้น
 *
 * ทำเป็น HTML/flex ไม่ใช่ SVG ด้วยเหตุผลเดียวกับที่เคยเจอมาแล้ว:
 * SVG ไม่ตัดบรรทัดและย่อตัวอักษรตามความกว้าง พอการ์ดแคบลงจะอ่านไม่ออก
 * ส่วน flex ตัดบรรทัดเองและพลิกเป็นแนวตั้งบนจอแคบได้
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
    <ol className="mt-4 flex flex-col gap-2 rounded-md border border-border bg-bg p-3 sm:flex-row sm:items-start">
      {steps.map((step, i) => (
        <Fragment key={i}>
          <li className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:gap-1.5 sm:text-center">
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
            <span className="text-xs leading-snug text-muted">
              {step.label[lang]}
            </span>
          </li>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="pl-[7px] text-accent sm:self-start sm:pt-0.5 sm:pl-0"
            >
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </span>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

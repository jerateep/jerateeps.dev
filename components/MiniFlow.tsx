import type { L, Locale } from "@/content/profile";

export type MiniStep = { label: L };

/**
 * visual ย่อประจำการ์ดผลงาน — บอกรูปร่างของระบบใน 3–5 ขั้น ตามหลัก diagram-design
 *
 * ทำเป็น HTML/flex ไม่ใช่ SVG: SVG ไม่ตัดบรรทัดและย่อตัวอักษรตามความกว้าง
 * พอการ์ดแคบลงจะอ่านไม่ออก
 *
 * - แนวตั้ง กล่องละขั้น มีเลขขั้นแบบ mono เป็น tag มุมสี่เหลี่ยม (ไม่ใช่ pill)
 * - เส้นเชื่อมตรงแนวตั้งพร้อมหัวลูกศร ไม่มีเส้นเฉียง
 * - สีเน้นจุดเดียว: ขั้นสุดท้าย (ผลลัพธ์ของระบบ) — ที่เหลือเป็นสีกลาง
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
  const last = steps.length - 1;
  return (
    <ol className="mt-4">
      {steps.map((step, i) => (
        <li key={i}>
          <div
            className={`flex items-center gap-2.5 rounded-md border px-2.5 py-1.5 ${
              i === last ? "border-accent bg-accent-soft" : "border-border bg-surface"
            }`}
          >
            <span
              className={`shrink-0 rounded-[2px] px-1 font-mono text-[10px] leading-4 tracking-wide ${
                i === last ? "bg-accent text-bg" : "bg-border text-fg"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`text-xs ${i === last ? "text-fg" : "text-muted"}`}>{step.label[lang]}</span>
          </div>
          {/* เส้นเชื่อมตรงลงขั้นถัดไป หัวลูกศรชี้ลง — ตรงแนวกึ่งกลาง tag เลขขั้น */}
          {i < last && (
            <svg aria-hidden viewBox="0 0 10 14" className="ml-[17px] block h-3.5 w-2.5 text-muted">
              <line x1="5" y1="0" x2="5" y2="9" stroke="currentColor" strokeWidth="1.1" />
              <path d="M2,8 L5,13 L8,8 z" fill="currentColor" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
}

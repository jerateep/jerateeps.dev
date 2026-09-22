import type { L, Locale } from "@/content/profile";

export type FlowStep = {
  label: L;
  note?: L;
};

/**
 * แผนภาพ flow แบบ HTML/flex ไม่ใช่ SVG — เพราะต้องย่อลงจอมือถือแล้วตัวหนังสือยังอ่านออก
 * (SVG จะ scale ตัวอักษรลงตามความกว้างจนเล็กเกินอ่าน)
 */
export function FlowDiagram({
  steps,
  lang,
  caption,
}: {
  steps: readonly FlowStep[];
  lang: Locale;
  caption?: string;
}) {
  return (
    <figure className="mt-5">
      <ol className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex flex-col items-stretch gap-1 sm:flex-1 sm:flex-row"
          >
            <div className="flex-1 rounded-md border border-border bg-bg px-3 py-2">
              <p className="text-xs leading-snug font-medium">
                {step.label[lang]}
              </p>
              {step.note && (
                <p className="mt-1 font-mono text-[11px] leading-snug text-muted">
                  {step.note[lang]}
                </p>
              )}
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="flex shrink-0 items-center justify-center py-1 text-accent sm:py-0"
              >
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

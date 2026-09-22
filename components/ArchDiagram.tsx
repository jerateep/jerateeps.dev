import type { L, Locale } from "@/content/profile";

export type ArchTier = {
  /** ป้ายชั้น เช่น "หน้าบ้าน" / "เครื่องประมวลผล" */
  title: L;
  nodes: readonly { label: L; note?: L }[];
};

/**
 * แผนภาพสถาปัตยกรรมแบบแบ่งชั้น — HTML/grid ไม่ใช่ SVG
 * เหตุผลเดียวกับ FlowDiagram: SVG ย่อตัวอักษรตามความกว้างจนอ่านไม่ออกบนมือถือ
 *
 * ⚠️ ข้อมูลที่ป้อนเข้ามาต้องเป็นชื่อเชิงหน้าที่เท่านั้น
 * ห้ามมีชื่อเครื่อง พอร์ต path ชื่อตาราง หรือชื่อระบบของคู่ค้า
 */
export function ArchDiagram({
  tiers,
  lang,
  caption,
}: {
  tiers: readonly ArchTier[];
  lang: Locale;
  caption?: string;
}) {
  return (
    <figure className="mt-6">
      <div className="rounded-lg border border-border bg-bg p-4 sm:p-5">
        {tiers.map((tier, i) => (
          <div key={i}>
            <div className="sm:flex sm:items-start sm:gap-4">
              <p className="mb-2 font-mono text-[11px] tracking-wide text-muted uppercase sm:mb-0 sm:w-28 sm:shrink-0 sm:pt-2.5">
                {tier.title[lang]}
              </p>
              <ul className="grid flex-1 gap-2 sm:grid-cols-3">
                {tier.nodes.map((node, j) => (
                  <li
                    key={j}
                    className="rounded-md border border-border bg-surface px-3 py-2"
                  >
                    <p className="text-xs leading-snug font-medium">
                      {node.label[lang]}
                    </p>
                    {node.note && (
                      <p className="mt-0.5 font-mono text-[11px] leading-snug text-muted">
                        {node.note[lang]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {i < tiers.length - 1 && (
              <p
                aria-hidden
                className="py-1.5 text-center text-accent sm:pl-32 sm:text-left"
              >
                ↓
              </p>
            )}
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

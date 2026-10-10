import type { L, Locale } from "@/content/profile";

/**
 * แผนภาพ pipeline ออกเอกสาร — SVG เขียนเอง ตามหลักของ skill diagram-design
 *
 * ทำไมไม่ใช้ mermaid: ฝั่ง client กินบันเดิลระดับ MB และ render หลังหน้าโหลด
 * และเขียน SVG เองแปลว่าคุมได้ 100% ว่ามี label อะไรโผล่บ้าง
 *
 * กติกาที่ต้องรักษา (มาจาก diagram-design):
 * - ไม่เกิน 9 กล่อง 12 เส้น — เกินแปลว่าควรแยกเป็นสองภาพ
 * - เส้นตรงแนวนอน/แนวตั้งเท่านั้น ไม่มีเส้นเฉียงหรือโค้ง จึงวางกล่องเป็นตาราง 2 แถว 5 คอลัมน์
 * - สีเน้นไม่เกิน 2 จุด (ตัวแปลง + เส้น "แปลงครั้งเดียว") — จุดขายของระบบคือ parse ครั้งเดียว
 * - ป้ายบนเส้นมีพื้นทึบ และเว้นห่างจากเส้น 8px ไม่ทับเส้น
 * - วาดเส้นก่อนกล่อง กล่องจึงอยู่บนสุด
 *
 * ⚠️ ข้อความทุกตัวมาจาก content/profile.ts และต้องเป็นชื่อเชิงหน้าที่เท่านั้น
 * ห้ามชื่อเครื่อง พอร์ต path ชื่อตาราง หรือชื่อระบบของคู่ค้า
 * แก้ข้อความแล้วให้รัน npm run check:diagram (ค่าขนาดด้านล่างต้องตรงกับสคริปต์นั้น)
 */

type Dict = Record<string, L>;

const W = 176; // ความกว้างกล่อง
const H = 72;
const COL = [24, 296, 568, 840, 1112]; // ห่างกัน 272 → ช่องระหว่างกล่อง 96 พอสำหรับป้าย ~10 ตัวอักษร
const ROW = [36, 200];
const VIEW_W = 1312;
const LEGEND_Y = 304;
const VIEW_H = 352;

const LABEL_PX = 12.5;
const GAP = 8; // ระยะห่างป้ายจากเส้น

const cx = (c: number) => COL[c] + W / 2;
const cy = (r: number) => ROW[r] + H / 2;

/** ประมาณความกว้างป้าย — สระบน/ล่างของไทยไม่กินที่ */
function labelWidth(text: string) {
  let n = 0;
  for (const ch of text) if (!/[ัิ-ฺ็-๎]/.test(ch)) n++;
  return n * LABEL_PX * 0.62 + 12;
}

type Kind = "step" | "core" | "external" | "store";

function Node({
  c,
  r,
  tag,
  title,
  sub,
  kind = "step",
}: {
  c: number;
  r: number;
  tag: string;
  title: string;
  sub: string;
  kind?: Kind;
}) {
  const x = COL[c];
  const y = ROW[r];
  const box =
    kind === "core"
      ? "fill-accent-soft stroke-accent"
      : kind === "external"
        ? "fill-bg stroke-muted"
        : kind === "store"
          ? "fill-bg stroke-border"
          : "fill-surface stroke-border";
  const tagW = tag.length * 6.8 + 10;
  return (
    <g>
      {/* พื้นทึบรองก่อน ให้กล่องเส้นประยังบังเส้นเชื่อมที่ลอดใต้ */}
      <rect x={x} y={y} width={W} height={H} rx={6} className="fill-bg" />
      <rect
        x={x}
        y={y}
        width={W}
        height={H}
        rx={6}
        className={box}
        strokeWidth={kind === "core" ? 1.6 : 1.2}
        strokeDasharray={kind === "external" ? "5 4" : undefined}
      />
      <rect
        x={x + 12}
        y={y + 11}
        width={tagW}
        height={16}
        rx={2}
        className={kind === "core" ? "fill-accent" : "fill-border"}
      />
      <text
        x={x + 12 + tagW / 2}
        y={y + 23}
        textAnchor="middle"
        fontSize={11}
        fontFamily="var(--font-mono)"
        letterSpacing={0.6}
        className={kind === "core" ? "fill-bg" : "fill-fg"}
      >
        {tag}
      </text>
      <text x={x + 12} y={y + 47} fontSize={17} fontWeight={600} className="fill-fg">
        {title}
      </text>
      <text x={x + 12} y={y + 63} fontSize={13} fontFamily="var(--font-mono)" className="fill-muted">
        {sub}
      </text>
    </g>
  );
}

/** ป้ายบนเส้น — พื้นทึบ เว้นจากเส้น GAP px (แนวนอน: อยู่เหนือเส้น · แนวตั้ง: อยู่ขวาของเส้น) */
function Label({ x, y, text, side, accent }: { x: number; y: number; text: string; side: "above" | "right"; accent?: boolean }) {
  const w = labelWidth(text);
  const h = 18;
  const rx = side === "above" ? x - w / 2 : x + GAP;
  const ry = side === "above" ? y - GAP - h : y - h / 2;
  return (
    <g>
      <rect x={rx} y={ry} width={w} height={h} rx={2} className="fill-bg" />
      <text
        x={rx + w / 2}
        y={ry + 13.5}
        textAnchor="middle"
        fontSize={LABEL_PX}
        fontFamily="var(--font-mono)"
        letterSpacing={0.5}
        className={accent ? "fill-accent" : "fill-muted"}
      >
        {text}
      </text>
    </g>
  );
}

/** เส้นตรงแนวนอนหรือแนวตั้งเท่านั้น */
function Edge({
  from,
  to,
  label,
  accent,
  dashed,
}: {
  from: [number, number];
  to: [number, number];
  label: string;
  accent?: boolean;
  dashed?: boolean;
}) {
  const horizontal = from[1] === to[1];
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  return (
    <g>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        className={accent ? "stroke-accent" : "stroke-muted"}
        strokeWidth={accent ? 1.6 : 1.1}
        strokeDasharray={dashed ? "5 4" : undefined}
        markerEnd={accent ? "url(#pd-arrow-accent)" : "url(#pd-arrow)"}
      />
      {horizontal ? (
        <Label x={mx} y={my} text={label} side="above" accent={accent} />
      ) : (
        <Label x={mx} y={my} text={label} side="right" accent={accent} />
      )}
    </g>
  );
}

export function PipelineDiagram({
  t,
  lang,
  caption,
  scrollHint,
}: {
  t: Dict;
  lang: Locale;
  caption?: string;
  scrollHint?: string;
}) {
  const s = (key: string) => t[key]?.[lang] ?? "";
  const right = (c: number) => COL[c] + W;
  const left = (c: number) => COL[c];

  const legend: { kind: Kind | "flow" | "call"; label: string }[] = [
    { kind: "step", label: s("lgStep") },
    { kind: "core", label: s("lgCore") },
    { kind: "external", label: s("lgExternal") },
    { kind: "flow", label: s("lgFlow") },
    { kind: "call", label: s("lgCall") },
  ];

  return (
    // ดึงกลับไปกินความกว้างเต็มการ์ด หักล้าง padding ที่การ์ดใบเด่นดันเข้ามา
    <figure className="mt-6 lg:-mx-10 xl:-mx-28">
      {/* fade ขอบขวาบอกว่ายังมีต่อ — scrollbar บน macOS เป็น overlay จึงไม่เห็น affordance */}
      <div className="overflow-x-auto rounded-lg border border-border bg-bg [mask-image:linear-gradient(to_right,#000_92%,transparent)] xl:[mask-image:none]">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
          role="img"
          aria-labelledby="pipeline-title pipeline-desc"
          className="block min-w-[760px]"
        >
          <title id="pipeline-title">{caption}</title>
          <desc id="pipeline-desc">
            {[s("user"), s("portal"), s("queue"), s("robot"), s("erp"), s("parser"), s("store"), s("render"), s("partner")].join(" → ")}
          </desc>
          <defs>
            <marker id="pd-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto">
              <path d="M0,0 L10,5 L0,10 z" className="fill-muted" />
            </marker>
            <marker id="pd-arrow-accent" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto">
              <path d="M0,0 L10,5 L0,10 z" className="fill-accent" />
            </marker>
          </defs>

          {/* เส้นก่อน — แถวบนไหลขวา แถวล่างไหลซ้าย */}
          <Edge from={[right(0), cy(0)]} to={[left(1), cy(0)]} label={s("eSubmit")} />
          <Edge from={[right(1), cy(0)]} to={[left(2), cy(0)]} label={s("eEnqueue")} />
          <Edge from={[right(2), cy(0)]} to={[left(3), cy(0)]} label={s("eTrigger")} />
          <Edge from={[right(3), cy(0)]} to={[left(4), cy(0)]} label={s("ePull")} dashed />
          <Edge from={[cx(3), ROW[0] + H]} to={[cx(3), ROW[1]]} label={s("eHandoff")} />
          <Edge from={[left(3), cy(1)]} to={[right(2), cy(1)]} label={s("eParse")} accent />
          <Edge from={[left(2), cy(1)]} to={[right(1), cy(1)]} label={s("eLoad")} />
          <Edge from={[left(1), cy(1)]} to={[right(0), cy(1)]} label={s("eUpload")} dashed />
          <Edge from={[cx(1), ROW[1]]} to={[cx(1), ROW[0] + H]} label={s("ePreview")} />

          {/* กล่อง */}
          <Node c={0} r={0} tag="USER" title={s("user")} sub={s("userSub")} />
          <Node c={1} r={0} tag="WEB" title={s("portal")} sub={s("portalSub")} />
          <Node c={2} r={0} tag="QUEUE" title={s("queue")} sub={s("queueSub")} />
          <Node c={3} r={0} tag="RPA" title={s("robot")} sub={s("robotSub")} />
          <Node c={4} r={0} tag="ERP" title={s("erp")} sub={s("erpSub")} kind="external" />
          <Node c={3} r={1} tag="PARSE" title={s("parser")} sub={s("parserSub")} kind="core" />
          <Node c={2} r={1} tag="DB" title={s("store")} sub={s("storeSub")} kind="store" />
          <Node c={1} r={1} tag="RENDER" title={s("render")} sub={s("renderSub")} />
          <Node c={0} r={1} tag="EXT" title={s("partner")} sub={s("partnerSub")} kind="external" />

          {/* legend แถบล่าง ไม่ลอยในพื้นที่แผนภาพ */}
          <line x1={24} x2={VIEW_W - 24} y1={LEGEND_Y} y2={LEGEND_Y} className="stroke-border" strokeWidth={1} />
          {legend.map((item, i) => {
            const x = 24 + i * 220;
            const y = LEGEND_Y + 24;
            return (
              <g key={item.kind}>
                {item.kind === "flow" || item.kind === "call" ? (
                  <line
                    x1={x}
                    x2={x + 28}
                    y1={y}
                    y2={y}
                    className="stroke-muted"
                    strokeWidth={1.1}
                    strokeDasharray={item.kind === "call" ? "5 4" : undefined}
                    markerEnd="url(#pd-arrow)"
                  />
                ) : (
                  <rect
                    x={x}
                    y={y - 7}
                    width={28}
                    height={14}
                    rx={3}
                    className={
                      item.kind === "core"
                        ? "fill-accent-soft stroke-accent"
                        : item.kind === "external"
                          ? "fill-bg stroke-muted"
                          : "fill-surface stroke-border"
                    }
                    strokeWidth={1.2}
                    strokeDasharray={item.kind === "external" ? "5 4" : undefined}
                  />
                )}
                <text x={x + 38} y={y + 5} fontSize={13.5} className="fill-muted">
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted">
        {caption && <span>{caption}</span>}
        {scrollHint && <span className="xl:hidden">{scrollHint}</span>}
      </figcaption>
    </figure>
  );
}

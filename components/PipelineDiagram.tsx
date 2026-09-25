import type { L, Locale } from "@/content/profile";
import { ICONS } from "./icons";

/**
 * แผนภาพสถาปัตยกรรมแบบกราฟ — SVG เขียนเอง ไม่ใช่ mermaid
 *
 * ทำไมไม่ใช้ mermaid: ฝั่ง client กินบันเดิลระดับ MB และ render หลังหน้าโหลด
 * ส่วนฝั่ง build ต้องลาก headless browser มาด้วย แลกกับการวาดกล่อง 13 ใบไม่คุ้ม
 * และที่สำคัญกว่า — เขียน SVG เองแปลว่าคุมได้ 100% ว่ามี label อะไรโผล่บ้าง
 *
 * ⚠️ ข้อความทุกตัวมาจาก content/profile.ts และต้องเป็นชื่อเชิงหน้าที่เท่านั้น
 * ห้ามชื่อเครื่อง พอร์ต path ชื่อตาราง หรือชื่อระบบของคู่ค้า
 *
 * เรื่องขนาด: ตัวอักษรใน SVG ย่อตามความกว้างที่ถูก render จริง จึงตั้งขนาดไว้ใหญ่กว่าปกติ
 * แล้วห่อด้วย overflow-x-auto + min-width — พอจอแคบจะเลื่อนแทนที่จะย่อจนอ่านไม่ออก
 */

type Dict = Record<string, L>;

/** กรอบพอดีเนื้อหาจริง (กล่องอยู่ x 20–1280, y 60–490) ไม่เผื่อที่ว่างตาย */
const VIEW = { x: 8, y: 48, w: 1284, h: 456 };

/** กล่อง 1 ใบ */
function Node({
  x,
  y,
  w = 180,
  h = 56,
  title,
  sub,
  icon,
  accent,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  icon?: keyof typeof ICONS | string;
  accent?: boolean;
}) {
  const path = icon ? ICONS[icon] : undefined;
  const textX = path ? x + 40 : x + 14;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        className={
          accent
            ? "fill-accent-soft stroke-accent"
            : "fill-surface stroke-border"
        }
        strokeWidth={1.5}
      />
      {path && (
        <g
          transform={`translate(${x + 13}, ${y + h / 2 - 10}) scale(0.83)`}
          className={accent ? "stroke-accent" : "stroke-muted"}
          fill="none"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={path} />
        </g>
      )}
      <text
        x={textX}
        y={sub ? y + 24 : y + h / 2 + 6}
        className="fill-fg"
        fontSize={17}
        fontWeight={500}
      >
        {title}
      </text>
      {/*
        งบความกว้างของบรรทัดย่อย = w − 58 หน่วย (ราว 17 ตัวอักษรไทยที่ 13px)
        ยาวกว่านี้จะล้นออกนอกกล่องเงียบ ๆ เพราะ SVG ไม่ตัดบรรทัดให้
        แก้ข้อความแล้วให้รัน npm run check:diagram
      */}
      {sub && (
        <text
          x={textX}
          y={y + 43}
          className="fill-muted"
          fontSize={13.5}
          fontFamily="var(--font-mono)"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/** กรอบจัดกลุ่ม */
function Panel({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        className="fill-bg stroke-border"
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <text
        x={x + 14}
        y={y + 22}
        className="fill-muted"
        fontSize={13}
        fontFamily="var(--font-mono)"
        letterSpacing={0.5}
      >
        {label}
      </text>
    </g>
  );
}

/** เส้นเชื่อม + ป้ายกำกับที่มีพื้นหลังทับเส้น */
function Edge({
  d,
  label,
  lx,
  ly,
  dashed,
}: {
  d: string;
  label: string;
  lx: number;
  ly: number;
  dashed?: boolean;
}) {
  const width = label.length * 7.6 + 16;
  return (
    <g>
      <path
        d={d}
        fill="none"
        className="stroke-border"
        strokeWidth={1.5}
        strokeDasharray={dashed ? "4 4" : undefined}
        markerEnd="url(#arrow)"
      />
      <rect
        x={lx - width / 2}
        y={ly - 11}
        width={width}
        height={21}
        rx={4}
        className="fill-bg"
      />
      <text
        x={lx}
        y={ly + 4}
        textAnchor="middle"
        className="fill-muted"
        fontSize={13}
      >
        {label}
      </text>
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

  return (
    // เฉพาะแผนภาพที่ทะลุออกนอกคอลัมน์ข้อความ ตัวการ์ดและข้อความยังอยู่ในกริด
    <figure className="mt-6 lg:-mx-16 xl:-mx-40">
      {/* fade ขอบขวาบอกว่ายังมีต่อ — scrollbar บน macOS เป็น overlay จึงไม่เห็น affordance */}
      <div className="overflow-x-auto rounded-lg border border-border bg-bg [mask-image:linear-gradient(to_right,#000_92%,transparent)] xl:[mask-image:none]">
        <svg
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          width="100%"
          role="img"
          aria-label={caption}
          className="block min-w-[760px]"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX={9}
              refY={5}
              markerWidth={7}
              markerHeight={7}
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className="fill-border" />
            </marker>
          </defs>

          {/* กรอบจัดกลุ่ม วาดก่อนเพื่อให้อยู่ใต้ทุกอย่าง */}
          <Panel x={230} y={60} w={220} h={430} label={s("panelApp")} />
          <Panel x={520} y={60} w={220} h={350} label={s("panelWorker")} />
          <Panel x={810} y={300} w={220} h={190} label={s("panelData")} />

          {/* เส้นเชื่อม */}
          <Edge d="M130,128 L244,128" label={s("eSubmit")} lx={188} ly={110} />
          <Edge d="M340,156 L340,194" label={s("eEnqueue")} lx={340} ly={176} />
          <Edge
            d="M430,222 C480,222 492,140 534,131"
            label={s("eConsume")}
            lx={487}
            ly={168}
          />
          <Edge d="M630,156 L630,194" label={s("eTrigger")} lx={630} ly={176} />
          <Edge
            d="M720,222 C900,222 940,130 1084,128"
            label={s("ePull")}
            lx={903}
            ly={156}
          />
          <Edge d="M630,256 L630,304" label={s("eHandoff")} lx={630} ly={281} />
          <Edge
            d="M720,344 C780,344 792,440 824,446"
            label={s("eStore")}
            lx={774}
            ly={408}
          />
          <Edge
            d="M830,356 C784,356 762,332 726,332"
            label={s("eConfig")}
            lx={778}
            ly={326}
            dashed
          />
          <Edge
            d="M540,340 C492,340 470,428 436,436"
            label={s("eRenderIngest")}
            lx={482}
            ly={400}
          />
          <Edge
            d="M430,140 C458,172 458,306 436,328"
            label={s("ePreview")}
            lx={474}
            ly={238}
          />
          <Edge
            d="M430,352 C600,478 700,466 824,452"
            label={s("eLoadBlocks")}
            lx={624}
            ly={476}
          />
          <Edge d="M340,366 L340,404" label={s("eRender")} lx={340} ly={386} />
          <Edge
            d="M720,318 C850,298 952,248 1084,232"
            label={s("eUpload")}
            lx={884}
            ly={268}
          />
          <Edge
            d="M720,362 C822,544 952,516 1084,462"
            label={s("eSave")}
            lx={876}
            ly={528}
          />

          {/* กล่อง */}
          <Node x={20} y={100} w={110} title={s("user")} icon="person" />

          <Node x={250} y={100} title={s("portal")} icon="browser" sub={s("portalSub")} accent />
          <Node x={250} y={200} title={s("queue")} icon="queue" sub={s("queueSub")} />
          <Node x={250} y={310} title={s("render")} icon="render" sub={s("renderSub")} />
          <Node x={250} y={410} title={s("engine")} icon="report" sub={s("engineSub")} />

          <Node x={540} y={100} title={s("consumer")} icon="worker" sub={s("consumerSub")} />
          <Node x={540} y={200} title={s("robot")} icon="robot" sub={s("robotSub")} />
          <Node x={540} y={310} title={s("parser")} icon="parse" sub={s("parserSub")} accent />

          <Node x={830} y={340} title={s("config")} icon="gear" sub={s("configSub")} />
          <Node x={830} y={420} title={s("blocks")} icon="database" sub={s("blocksSub")} />

          <Node x={1090} y={100} w={190} title={s("erp")} icon="erp" sub={s("erpSub")} />
          <Node x={1090} y={200} w={190} title={s("partner")} icon="cloud" sub={s("partnerSub")} />
          <Node x={1090} y={420} w={190} title={s("share")} icon="folder" sub={s("shareSub")} />
        </svg>
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted">
        {caption && <span>{caption}</span>}
        {scrollHint && <span className="xl:hidden">{scrollHint}</span>}
      </figcaption>
    </figure>
  );
}

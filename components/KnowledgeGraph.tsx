import graph from "@/content/graph.json";

// ระบุ type เอง — ตอน graph.json ยังไม่มีป้าย TS จะอนุมาน [] เป็น never[]
const labels: { x: number; y: number; text: string }[] = graph.labels;

// รัศมีที่ถือว่าเป็นโน้ตหลัก (ถูกอ้างถึง ~7 ครั้งขึ้นไป ตามสูตรใน build-graph.mjs)
const HUB = 6;

/**
 * ภาพคลังความรู้ — โครงสร้างลิงก์จริงจาก second-brain vault
 *
 * สร้างพิกัดไว้ล่วงหน้าด้วย scripts/build-graph.mjs แล้ว commit เป็น JSON
 * จึงไม่ต้องคำนวณ layout ตอน render และไม่ต้องมี vault อยู่ตอน build
 *
 * ⚠️ ไม่มีชื่อโน้ต — ชื่อโน้ตในคลังคือชื่อระบบภายใน
 * มีแค่ป้ายหัวข้อกลุ่มละหนึ่งป้าย (ชื่อตามหน้าที่จากตาราง TOPICS ใน build-graph.mjs)
 * ถ้าไม่มีป้าย ภาพจะเหลือแค่จุดกับก้าน ดูเป็นโมเลกุลมากกว่าคลังความรู้
 */
export function KnowledgeGraph({
  caption,
  label,
}: {
  caption: string;
  label: string;
}) {
  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-lg border border-border bg-bg">
        <svg
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          width="100%"
          role="img"
          aria-label={label}
          className="block"
        >
          {/* ภาษาเดียวกับลูกโลกที่ hero: เส้นสี accent บางและจาง จุดเล็ก */}
          {/* เส้นในกลุ่มชัด เส้นข้ามกลุ่มจางมาก — ไม่งั้นเส้นยาวข้ามภาพจะกลายเป็นใยแมงมุมกลางจอ */}
          <g className="stroke-accent" strokeWidth={0.7}>
            {graph.edges.map(([a, b], i) => {
              const same = graph.nodes[a].g === graph.nodes[b].g;
              return (
                <line
                  key={i}
                  x1={graph.nodes[a].x}
                  y1={graph.nodes[a].y}
                  x2={graph.nodes[b].x}
                  y2={graph.nodes[b].y}
                  opacity={same ? 0.35 : 0.07}
                />
              );
            })}
          </g>
          <g className="fill-accent">
            {graph.nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={n.r * 0.75}
                // ความเข้มต่างกันตามกลุ่ม ให้แต่ละเกาะอ่านแยกกันได้ด้วยสีเดียว
                // โน้ตหลักเข้มเต็มที่เสมอ ไม่ใช้วงเรือง (วงซ้อนกันแล้วเป็นปื้น)
                opacity={n.r >= HUB ? 1 : 0.4 + ((n.g * 0.618) % 1) * 0.4}
              />
            ))}
          </g>
          {/* ขอบสีพื้นรอบตัวอักษร (paint-order) ให้ป้ายอ่านออกแม้วางทับเส้นและจุด */}
          <g
            className="fill-muted stroke-bg font-sans"
            fontSize={12}
            fontWeight={500}
            letterSpacing={0.3}
            strokeWidth={4}
            paintOrder="stroke"
            textAnchor="middle"
          >
            {labels.map((l) => (
              <text key={l.text} x={l.x} y={l.y}>
                {l.text}
              </text>
            ))}
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}

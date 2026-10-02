import graph from "@/content/graph.json";

// ระบุ type เอง — ตอน graph.json ยังไม่มีป้าย TS จะอนุมาน [] เป็น never[]
const labels: { x: number; y: number; text: string }[] = graph.labels;

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
          <g className="stroke-border" strokeWidth={0.9} opacity={0.9}>
            {graph.edges.map(([a, b], i) => (
              <line
                key={i}
                x1={graph.nodes[a].x}
                y1={graph.nodes[a].y}
                x2={graph.nodes[b].x}
                y2={graph.nodes[b].y}
              />
            ))}
          </g>
          <g className="fill-accent">
            {graph.nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={n.r}
                // จุดที่ถูกอ้างถึงบ่อยจะทั้งใหญ่และเข้มกว่า
                opacity={0.45 + Math.min(n.r / 9, 0.5)}
              />
            ))}
          </g>
          {/* ขอบสีพื้นรอบตัวอักษร (paint-order) ให้ป้ายอ่านออกแม้วางทับเส้นและจุด */}
          <g
            className="fill-fg stroke-bg font-sans"
            fontSize={15}
            fontWeight={500}
            strokeWidth={5}
            paintOrder="stroke"
            textAnchor="middle"
          >
            {labels.map((l) => (
              <text key={l.text} x={l.x} y={l.y} dy="0.35em">
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

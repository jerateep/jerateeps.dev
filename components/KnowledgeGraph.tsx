import graph from "@/content/graph.json";

/**
 * ภาพคลังความรู้ — โครงสร้างลิงก์จริงจาก second-brain vault
 *
 * สร้างพิกัดไว้ล่วงหน้าด้วย scripts/build-graph.mjs แล้ว commit เป็น JSON
 * จึงไม่ต้องคำนวณ layout ตอน render และไม่ต้องมี vault อยู่ตอน build
 *
 * ⚠️ ตั้งใจไม่มี label ใด ๆ — ชื่อโน้ตในคลังคือชื่อระบบภายใน
 * ซึ่งทั้งเว็บนี้ตั้งใจไม่เปิดเผย ภาพนี้จึงเหลือแค่รูปทรงของความเชื่อมโยง
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
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}

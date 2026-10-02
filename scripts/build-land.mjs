/**
 * สร้างจุดแผ่นดินสำหรับลูกโลกที่ hero → content/land.json
 *
 * กระจายจุดบนทรงกลมแบบ fibonacci (ระยะห่างเท่ากันทั่วโลก) แล้วเก็บเฉพาะจุดที่ตกบนแผ่นดิน
 * ข้อมูลแผ่นดินจาก world-atlas (Natural Earth 1:110m, public domain) — ใช้แค่ตอนรันสคริปต์นี้
 * หน้าเว็บโหลดแค่ไฟล์ผลลัพธ์ ไม่ต้องมี library แผนที่ตอนรันจริง
 *
 * รันมือเมื่ออยากเปลี่ยนความหนาแน่น:
 *   node scripts/build-land.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

// รวมทุก polygon เป็นรายการวง (ring) — วงแรกของแต่ละ polygon คือขอบนอก ที่เหลือคือรู (ทะเลสาบ)
const polygons = land.features.flatMap((f) =>
  f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates,
);

// ray casting บนพิกัด lon/lat — พอสำหรับภาพตกแต่ง (ไม่ต้องแม่นตามแนวเส้นโค้งของโลก)
const inRing = (lon, lat, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const onLand = (lon, lat) =>
  polygons.some(([outer, ...holes]) => inRing(lon, lat, outer) && !holes.some((h) => inRing(lon, lat, h)));

// ponytail: ทดสอบทุก polygon ต่อจุด — 16k จุด × ~130 polygon ยังเสร็จในไม่กี่วินาที รันครั้งเดียวจึงไม่ต้องทำ index
const N = 16000;
const golden = Math.PI * (3 - Math.sqrt(5));
const points = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((golden * i * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // ตัดแอนตาร์กติกา — กินจุดเยอะแต่ไม่ช่วยให้ดูออกว่าเป็นโลก
  if (onLand(lon, lat)) points.push(Math.round(lat * 10) / 10, Math.round(lon * 10) / 10);
}

writeFileSync(
  join(process.cwd(), "content", "land.json"),
  JSON.stringify({
    _comment: "สร้างโดย scripts/build-land.mjs จาก Natural Earth 1:110m — คู่ [lat, lon] เรียงต่อกัน",
    points,
  }),
);
console.log(`land.json: ${points.length / 2} land points from ${N} samples`);

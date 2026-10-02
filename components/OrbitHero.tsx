"use client";

import { useEffect, useRef, useState } from "react";
import type { Material } from "three";
import land from "@/content/land.json";

/**
 * แผนที่จราจรดาวเทียมรอบโลก — ของตกแต่งหลัง hero (aria-hidden)
 *
 * - โลกเป็นจุดเฉพาะบนแผ่นดิน (content/land.json จาก scripts/build-land.mjs) อ่านออกว่าเป็นโลกจากรูปทวีป
 *   ใช้จุดน้อย จึงคมทั้งโหมดสว่างและมืด และไม่เป็นลายจุดถี่ทั้งลูก
 * - ทรงกลมล่องหน (เขียนแค่ depth) บังซีกหลัง — จุดและดาวเทียมด้านหลังโลกไม่ทะลุมาให้รก
 * - ดาวเทียมวงโคจรต่ำหลายแนวเอียง วิ่งเร็วพร้อมหาง + วง geostationary ที่หมุนไปพร้อมโลก
 * - กรุงเทพฯ ส่งสัญญาณขึ้นดาวเทียมไทยคมสองตำแหน่งจริง แล้วกระจายลงพื้นที่ให้บริการ (ข้อมูลสาธารณะ):
 *   78.5°E (Thaicom 6/8 — โทรทัศน์: ไทย อินเดีย แอฟริกา) และ 119.5°E (Thaicom 4 — broadband เอเชียแปซิฟิก)
 *   ไทยเด่นสุด: จุดใหญ่ มีชีพจร เส้นสว่างกว่า จุดปลายทางอื่นเล็กและจางกว่า
 * - three.js โหลดหลังหน้าแรก render; reduced motion → เฟรมเดียว; ไม่มี WebGL หรือจอแคบ → ไม่โหลดเลย
 *
 * ponytail: เปลี่ยนธีมตามการตั้งค่าเครื่องกลางคัน (ไม่ผ่านปุ่ม) ยังไม่สร้างฉากใหม่ — ต้อง reload
 */

const DEG = Math.PI / 180;
const BANGKOK = { lat: 13.75, lon: 100.5 };
// ดาวเทียมไทยคมตามตำแหน่งวงโคจรจริง และพื้นที่ให้บริการตัวอย่างของแต่ละดวง (ตรวจจากข้อมูลสาธารณะ ต.ค. 2026)
const FLEET = [
  {
    lon: 78.5,
    downs: [
      { lat: 28.6, lon: 77.2 }, // นิวเดลี
      { lat: -1.3, lon: 36.8 }, // ไนโรบี
    ],
  },
  {
    lon: 119.5,
    downs: [
      { lat: -33.9, lon: 151.2 }, // ซิดนีย์
      { lat: 35.7, lon: 139.7 }, // โตเกียว
      { lat: -6.2, lon: 106.8 }, // จาการ์ตา
    ],
  },
];

export function OrbitHero({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  // สีอ่านจาก CSS variable ตอนสร้างฉาก — สลับธีมแล้วสร้างใหม่ (ThemeToggle ยิง event "themechange")
  const [rev, setRev] = useState(0);
  useEffect(() => {
    const bump = () => setRev((r) => r + 1);
    addEventListener("themechange", bump);
    return () => removeEventListener("themechange", bump);
  }, []);

  useEffect(() => {
    const el = box.current;
    // ผู้เรียกซ่อนไว้ (จอแคบ) → ไม่ต้องโหลด three.js เลย
    // ponytail: เช็กครั้งเดียวตอน mount — หมุนจอจากแคบเป็นกว้างต้อง reload ถึงจะเห็น
    if (
      !el?.offsetWidth ||
      !document.createElement("canvas").getContext("webgl2")
    )
      return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      const css = getComputedStyle(document.documentElement);
      const color = (v: string) =>
        new THREE.Color(css.getPropertyValue(v).trim());
      const muted = color("--muted");
      const accent = color("--accent");
      const bg = color("--bg");
      const light = bg.getHSL({ h: 0, s: 0, l: 0 }).l > 0.5;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.domElement.className = "size-full";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 18);

      const R = 4.2;
      // ไม่ใช่สัดส่วนจริง (จริง ~6.6 เท่า) — ย่อให้วงทั้งวงอยู่ในกรอบ ไม่หลุดขอบขวา
      const GEO = R * 1.38;
      // มองลงจากด้านบนเล็กน้อย — ถ้ามองระนาบศูนย์สูตรแนวราบพอดี วง geostationary จะแบนเป็นเส้นตรง
      const VIEW_TILT = 0.38;
      const toXYZ = (lat: number, lon: number, r: number) =>
        new THREE.Vector3(
          r * Math.cos(lat * DEG) * Math.cos(lon * DEG),
          r * Math.sin(lat * DEG),
          -r * Math.cos(lat * DEG) * Math.sin(lon * DEG),
        );

      const tilt = new THREE.Group(); // เอียงแกนโลก + parallax ตามเมาส์
      tilt.position.x = 2.6; // เยื้องขวา ให้ล้นขอบจอ
      tilt.rotation.z = 23.5 * DEG;
      tilt.rotation.x = VIEW_TILT;
      scene.add(tilt);
      const earth = new THREE.Group(); // หมุนรอบแกน — ทุกอย่างที่ติดกับผิวโลกอยู่ในนี้
      // หันประเทศไทยเข้ากล้องตอนเริ่ม (เยื้องซ้ายนิดหน่อย จะได้หมุนผ่านกลางภาพ)
      earth.rotation.y = -Math.PI / 2 - BANGKOK.lon * DEG - 0.5; // ไทยอยู่ซ้ายของกลางภาพ แล้วหมุนผ่าน
      tilt.add(earth);

      // ทรงกลมล่องหนบังซีกหลัง: เขียนแค่ depth ไม่วาดสี — จุดด้านหลังโลกไม่ทะลุมา
      // แต่ไม่มีพื้นทึบไปบังตัวหนังสือ hero ที่ลูกโลกทับอยู่
      const occluder = new THREE.Mesh(
        new THREE.SphereGeometry(R * 0.985, 48, 32),
        new THREE.MeshBasicMaterial({ colorWrite: false }),
      );
      occluder.renderOrder = -1; // ต้องเขียน depth ก่อนของอื่นวาด
      earth.add(occluder);

      // แผ่นดิน
      const pts = land.points;
      const landPos = new Float32Array((pts.length / 2) * 3);
      for (let i = 0; i < pts.length; i += 2)
        toXYZ(pts[i], pts[i + 1], R).toArray(landPos, (i / 2) * 3);
      const landGeo = new THREE.BufferGeometry();
      landGeo.setAttribute("position", new THREE.BufferAttribute(landPos, 3));
      earth.add(
        new THREE.Points(
          landGeo,
          new THREE.PointsMaterial({
            color: muted,
            size: 0.055,
            transparent: true,
            // สีเข้มบนพื้นสว่างตัดกันน้อยกว่าสีสว่างบนพื้นมืด จึงทึบกว่า
            opacity: light ? 0.85 : 0.7,
          }),
        ),
      );

      // วง geostationary — หมุนไปพร้อมโลก (นิยามของ geostationary)
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 200 }, (_, i) => toXYZ(0, (i / 200) * 360, GEO)),
      );
      earth.add(
        new THREE.LineLoop(
          ringGeo,
          new THREE.LineBasicMaterial({
            color: muted,
            transparent: true,
            opacity: light ? 0.35 : 0.3,
          }),
        ),
      );
      const satGeom = new THREE.SphereGeometry(0.09, 12, 8);
      const fleetMat = new THREE.MeshBasicMaterial({ color: accent });

      // กรุงเทพฯ (จุดหลัก ใหญ่สุด มีชีพจร)
      const bkk = toXYZ(BANGKOK.lat, BANGKOK.lon, R * 1.002);
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 8),
        new THREE.MeshBasicMaterial({ color: accent }),
      );
      marker.position.copy(bkk);
      earth.add(marker);
      const pulse = new THREE.Mesh(
        new THREE.RingGeometry(0.1, 0.13, 32),
        new THREE.MeshBasicMaterial({
          color: accent,
          transparent: true,
          side: THREE.DoubleSide,
        }),
      );
      pulse.position.copy(bkk);
      pulse.lookAt(bkk.clone().multiplyScalar(2)); // วางราบกับผิวโลก
      earth.add(pulse);

      const line = (
        from: InstanceType<typeof THREE.Vector3>,
        to: InstanceType<typeof THREE.Vector3>,
        opacity: number,
      ) =>
        earth.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([from, to]),
            new THREE.LineBasicMaterial({
              color: accent,
              transparent: true,
              opacity,
            }),
          ),
        );
      const packetOf = (size: number, opacity: number) => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(size, 8, 6),
          new THREE.MeshBasicMaterial({
            color: accent,
            transparent: true,
            opacity,
          }),
        );
        earth.add(m);
        return m;
      };

      // สัญญาณขึ้น: กรุงเทพฯ → ดาวเทียม (สว่าง เร็ว)  สัญญาณลง: ดาวเทียม → ปลายทาง (จาง ช้า)
      type Hop = {
        from: InstanceType<typeof THREE.Vector3>;
        to: InstanceType<typeof THREE.Vector3>;
        p: InstanceType<typeof THREE.Mesh>;
        speed: number;
        phase: number;
      };
      const hops: Hop[] = [];
      FLEET.forEach((sat, si) => {
        const at = toXYZ(0, sat.lon, GEO);
        const m = new THREE.Mesh(satGeom, fleetMat);
        m.position.copy(at);
        earth.add(m);
        line(bkk, at, 0.55);
        hops.push({
          from: bkk,
          to: at,
          p: packetOf(0.05, 1),
          speed: 0.35,
          phase: si * 0.5,
        });
        sat.downs.forEach((d, di) => {
          const ground = toXYZ(d.lat, d.lon, R * 1.002);
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 10, 8),
            new THREE.MeshBasicMaterial({
              color: accent,
              transparent: true,
              opacity: 0.7,
            }),
          );
          dot.position.copy(ground);
          earth.add(dot);
          line(at, ground, 0.22);
          hops.push({
            from: at,
            to: ground,
            p: packetOf(0.035, 0.8),
            speed: 0.22,
            phase: (si + di) * 0.37,
          });
        });
      });

      // ดาวเทียมวงโคจรต่ำ: แต่ละดวงมีระนาบวงโคจรของตัวเอง (เอียง + หมุนแกน) — seed คงที่
      let seed = 20261002;
      const rand = () =>
        (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      const LEO = 44;
      // หางยาว ~70° ของวงโคจรแล้วค่อย ๆ จางหาย — หางสั้นดูเป็นขีดขาด ๆ ไม่เหมือนแนววงโคจร
      const TRAIL = 40;
      const STEP = 0.03;
      const fade = (k: number) =>
        Math.pow(k / TRAIL, 1.6) * (light ? 0.85 : 0.65);
      const leo = Array.from({ length: LEO }, () => {
        const q = new THREE.Quaternion().setFromEuler(
          new THREE.Euler((rand() - 0.5) * Math.PI, rand() * Math.PI * 2, 0),
        );
        return {
          q,
          r: R * (1.08 + rand() * 0.14),
          a: rand() * Math.PI * 2,
          v: 0.25 + rand() * 0.25,
        };
      });
      const leoPos = new Float32Array(LEO * 3);
      const leoGeo = new THREE.BufferGeometry();
      leoGeo.setAttribute("position", new THREE.BufferAttribute(leoPos, 3));
      tilt.add(
        new THREE.Points(
          leoGeo,
          new THREE.PointsMaterial({ color: accent, size: light ? 0.11 : 0.1 }),
        ),
      );
      // หาง: เส้นต่อจุดย้อนหลัง ไล่สีจากสีพื้นไปสี accent
      const trailPos = new Float32Array(LEO * (TRAIL - 1) * 6);
      const trailCol = new Float32Array(LEO * (TRAIL - 1) * 6);
      for (let s = 0; s < LEO; s++)
        for (let k = 0; k < TRAIL - 1; k++) {
          const o = (s * (TRAIL - 1) + k) * 6;
          bg.clone().lerp(accent, fade(k)).toArray(trailCol, o);
          bg.clone()
            .lerp(accent, fade(k + 1))
            .toArray(trailCol, o + 3);
        }
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
      trailGeo.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));
      tilt.add(
        new THREE.LineSegments(
          trailGeo,
          new THREE.LineBasicMaterial({ vertexColors: true }),
        ),
      );

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      // parallax: เอียงตามตำแหน่งเมาส์บนจอ แบบหน่วงนุ่ม ๆ
      let lean = 0;
      const onMouse = (e: MouseEvent) =>
        (lean = (e.clientY / innerHeight - 0.5) * 0.2);
      addEventListener("mousemove", onMouse);

      const v = new THREE.Vector3();
      const orbitPoint = (s: (typeof leo)[number], a: number) =>
        v.set(Math.cos(a) * s.r, 0, Math.sin(a) * s.r).applyQuaternion(s.q);
      const lp = leoGeo.attributes.position as InstanceType<
        typeof THREE.BufferAttribute
      >;
      const tp = trailGeo.attributes.position as InstanceType<
        typeof THREE.BufferAttribute
      >;
      // THREE.Clock เลิกใช้แล้วในเวอร์ชันนี้ — นับเวลาเองจาก performance.now()
      const start = performance.now();
      let last = start;
      const frame = () => {
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const t = (now - start) / 1000;
        earth.rotation.y += dt * 0.05;
        tilt.rotation.x += (VIEW_TILT + lean - tilt.rotation.x) * 0.04;

        leo.forEach((s, i) => {
          s.a += s.v * dt;
          orbitPoint(s, s.a);
          lp.setXYZ(i, v.x, v.y, v.z);
          for (let k = 0; k < TRAIL - 1; k++) {
            const o = (i * (TRAIL - 1) + k) * 2;
            orbitPoint(s, s.a - (TRAIL - 1 - k) * STEP);
            tp.setXYZ(o, v.x, v.y, v.z);
            orbitPoint(s, s.a - (TRAIL - 2 - k) * STEP);
            tp.setXYZ(o + 1, v.x, v.y, v.z);
          }
        });
        lp.needsUpdate = true;
        tp.needsUpdate = true;

        // ชีพจรที่กรุงเทพฯ + ข้อมูลวิ่งขึ้นดาวเทียม
        const p = (t % 2.4) / 2.4;
        pulse.scale.setScalar(1 + p * 2.5);
        (
          pulse.material as InstanceType<typeof THREE.MeshBasicMaterial>
        ).opacity = 1 - p;
        for (const h of hops)
          h.p.position.lerpVectors(h.from, h.to, (t * h.speed + h.phase) % 1);

        renderer.render(scene, camera);
      };
      if (still) frame();
      else renderer.setAnimationLoop(frame);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        removeEventListener("mousemove", onMouse);
        scene.traverse((o) => {
          if (
            o instanceof THREE.Points ||
            o instanceof THREE.Line ||
            o instanceof THREE.Mesh
          ) {
            o.geometry.dispose();
            (o.material as Material).dispose();
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [rev]);

  return <div ref={box} aria-hidden className={className} />;
}

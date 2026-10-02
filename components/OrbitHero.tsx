"use client";

import { useEffect, useRef } from "react";
import type { Material } from "three";

/**
 * ลูกโลกจุดกับ network ของ node ที่ลอยอยู่เหนือผิวโลก — ของตกแต่งหลัง hero (aria-hidden)
 * แนวเดียวกับต้นแบบที่ลองใน Gemini: โทนขาวดำ ลูกโลกใหญ่ล้นขอบขวา node ต่อเส้นหากันเมื่ออยู่ใกล้
 *
 * - สีมาจากธีมของเว็บ: ผิวโลกใช้ --muted, เส้นกับ node ใช้ --accent ให้เข้าชุดกับปุ่มและหัวข้อ
 * - fog สีพื้น ทำให้ซีกหลังกลืนหาย อ่านเป็นทรงกลม
 * - ตำแหน่งสุ่มแบบมี seed ภาพจึงเหมือนเดิมทุกครั้งที่โหลด
 * - เอียงตามเมาส์เล็กน้อย (parallax) เฉพาะตอนเมาส์อยู่บนหน้า
 * - three.js โหลดหลังหน้าแรก render; reduced motion → เฟรมเดียว; ไม่มี WebGL หรือจอแคบ → ไม่โหลดเลย
 *
 * ponytail: อ่านสีจาก CSS variable ครั้งเดียวตอนสร้าง — ถ้าสลับธีมกลางคันต้อง reload
 * ponytail: เส้นเชื่อมคิดแบบ O(n²) ทุกเฟรม — n=110 ราว 6k คู่ต่อเฟรม ยังเบา ถ้าเพิ่ม node เป็นหลักพันค่อยทำ grid
 */
export function OrbitHero({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    // ผู้เรียกซ่อนไว้ (จอแคบ) → ไม่ต้องโหลด three.js เลย
    // ponytail: เช็กครั้งเดียวตอน mount — หมุนจอจากแคบเป็นกว้างต้อง reload ถึงจะเห็น
    if (!el?.offsetWidth || !document.createElement("canvas").getContext("webgl2")) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      const css = getComputedStyle(document.documentElement);
      const color = (v: string) => new THREE.Color(css.getPropertyValue(v).trim());
      const fg = color("--fg");
      const muted = color("--muted");
      const accent = color("--accent");
      const bg = color("--bg");

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.domElement.className = "size-full";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(bg, 14, 23); // ซีกหน้าชัด ซีกหลังกลืนไปกับพื้น
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 18);

      const R = 5.5;
      const globe = new THREE.Group();
      globe.position.x = 3.4; // เยื้องขวา ให้ล้นขอบจอเหมือนต้นแบบ
      globe.rotation.z = (23.5 * Math.PI) / 180;
      scene.add(globe);

      // seed คงที่ ตำแหน่ง node จึงเหมือนเดิมทุกครั้ง
      let seed = 20261002;
      const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

      // ผิวโลก: จุดกระจายแบบ fibonacci ความหนาแน่นสม่ำเสมอ
      // จุดห่าง ๆ ไม่ให้เป็นลายถี่ — จุดแน่นบนพื้นสว่างกระตุ้นอาการกลัวรู (trypophobia) ได้
      const N = 600;
      const surface = new Float32Array(N * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        surface.set([Math.cos(golden * i) * r * R, y * R, Math.sin(golden * i) * r * R], i * 3);
      }
      const surfaceGeo = new THREE.BufferGeometry();
      surfaceGeo.setAttribute("position", new THREE.BufferAttribute(surface, 3));
      globe.add(
        new THREE.Points(
          surfaceGeo,
          new THREE.PointsMaterial({
            color: muted,
            size: 0.05,
            transparent: true,
            // พื้นสว่างจุดเทาเห็นชัดกว่าพื้นมืดมาก จึงจางกว่า
            opacity: bg.getHSL({ h: 0, s: 0, l: 0 }).l > 0.5 ? 0.2 : 0.5,
          }),
        ),
      );

      // รูปทรงโลกบอกด้วยเส้นแทนจุดถี่ ๆ: ขอบวงกลมที่หันเข้ากล้องเสมอ + เส้นรุ้ง-แวงจาง ๆ ไม่กี่เส้น
      const ring = (radius: number, seg = 160) =>
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: seg }, (_, i) => {
            const a = (i / seg) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
          }),
        );
      const rim = new THREE.LineLoop(
        ring(R),
        new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.45, fog: false }),
      );
      rim.position.copy(globe.position); // อยู่นอก globe จึงไม่หมุนตาม — เป็นเงาขอบโลกเสมอ
      scene.add(rim);
      const gridMat = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.25 });
      for (const lat of [-0.6, 0, 0.6]) {
        const loop = new THREE.LineLoop(ring(R * Math.cos(lat)), gridMat);
        loop.rotation.x = Math.PI / 2;
        loop.position.y = R * Math.sin(lat);
        globe.add(loop);
      }
      for (const lon of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
        const loop = new THREE.LineLoop(ring(R), gridMat);
        loop.rotation.y = lon;
        globe.add(loop);
      }

      // node ลอยเหนือผิวโลก เคลื่อนช้า ๆ บนเปลือกทรงกลมของตัวเอง
      const M = 110;
      const nodes = Array.from({ length: M }, () => ({
        r: R * (1.12 + rand() * 0.16),
        th: rand() * Math.PI * 2,
        ph: Math.acos(rand() * 2 - 1),
        vTh: (rand() - 0.5) * 0.12,
        vPh: (rand() - 0.5) * 0.12,
      }));
      const nodePos = new Float32Array(M * 3);
      const nodeCol = new Float32Array(M * 3);
      // node ส่วนใหญ่สี accent ให้เข้าชุดกับเส้น มีบางตัวเป็นสีตัวอักษรตัดให้มีจังหวะ
      nodes.forEach((_, i) => (i % 7 === 0 ? fg : accent).toArray(nodeCol, i * 3));
      const nodeGeo = new THREE.BufferGeometry();
      nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
      nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
      globe.add(
        new THREE.Points(
          nodeGeo,
          new THREE.PointsMaterial({ size: 0.12, vertexColors: true, fog: false }),
        ),
      );

      // เส้นเชื่อมระหว่าง node ที่อยู่ใกล้กัน
      const MAX_LINES = 140;
      const linePos = new Float32Array(MAX_LINES * 6);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
      globe.add(
        new THREE.LineSegments(
          lineGeo,
          // fog: false — fog ดึงสีเขียวไปทางสีพื้นจนเส้นกลายเป็นเทา ให้ fog ทำงานแค่ที่ผิวโลก
          new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.16, fog: false }),
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
      let tilt = 0;
      const onMouse = (e: MouseEvent) => (tilt = (e.clientY / innerHeight - 0.5) * 0.25);
      addEventListener("mousemove", onMouse);

      const nPos = nodeGeo.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
      const lPos = lineGeo.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
      const clock = new THREE.Clock();
      const frame = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        globe.rotation.y += dt * 0.06;
        globe.rotation.x += (tilt - globe.rotation.x) * 0.04;

        nodes.forEach((n, i) => {
          n.th += n.vTh * dt;
          n.ph += n.vPh * dt;
          if (n.ph < 0.15 || n.ph > Math.PI - 0.15) n.vPh *= -1; // เด้งก่อนถึงขั้วโลก ไม่ให้ไปกองที่ขั้ว
          const s = Math.sin(n.ph);
          nPos.setXYZ(i, n.r * s * Math.cos(n.th), n.r * Math.cos(n.ph), n.r * s * Math.sin(n.th));
        });
        nPos.needsUpdate = true;

        let k = 0;
        for (let i = 0; i < M && k < MAX_LINES; i++) {
          for (let j = i + 1; j < M && k < MAX_LINES; j++) {
            const dx = nodePos[i * 3] - nodePos[j * 3];
            const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
            const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
            if (dx * dx + dy * dy + dz * dz > 3.2) continue;
            lPos.setXYZ(k * 2, nodePos[i * 3], nodePos[i * 3 + 1], nodePos[i * 3 + 2]);
            lPos.setXYZ(k * 2 + 1, nodePos[j * 3], nodePos[j * 3 + 1], nodePos[j * 3 + 2]);
            k++;
          }
        }
        lineGeo.setDrawRange(0, k * 2);
        lPos.needsUpdate = true;

        renderer.render(scene, camera);
      };
      if (still) frame();
      else renderer.setAnimationLoop(frame);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        removeEventListener("mousemove", onMouse);
        scene.traverse((o) => {
          if (o instanceof THREE.Points || o instanceof THREE.Line) {
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
  }, []);

  return <div ref={box} aria-hidden className={className} />;
}

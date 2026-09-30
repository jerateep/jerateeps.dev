"use client";

import { useEffect, useRef } from "react";
import type { Material, Texture } from "three";

/**
 * ลูกโลกจุดกับวงโคจรดาวเทียมจาง ๆ หลัง hero — ของตกแต่งล้วน (aria-hidden)
 *
 * - fog สีเดียวกับพื้นหลัง ทำให้ซีกหลังของโลกจางลง อ่านเป็นทรงกลม ไม่ใช่กองจุด
 * - ดาวเทียมมีหางจางตามหลัง และมีเส้นลิงก์บาง ๆ ลงสถานีภาคพื้นที่อยู่ซีกเดียวกัน
 * - three.js โหลดหลังหน้าแรก render เสร็จ ไม่ขวางเนื้อหา
 * - reduced motion → วาดเฟรมเดียวแล้วหยุด; ไม่มี WebGL → ไม่แสดงอะไร
 * - ซ่อนบนจอแคบ (ตั้งที่ className ของผู้เรียก) เพราะจะไปทับข้อความ
 *
 * ponytail: อ่านสีจาก CSS variable ครั้งเดียวตอนสร้าง — ถ้าสลับธีมกลางคันต้อง reload
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
      const accent = new THREE.Color(css.getPropertyValue("--accent").trim());
      const bg = new THREE.Color(css.getPropertyValue("--bg").trim());

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.domElement.className = "size-full";
      el.appendChild(renderer.domElement);

      const R = 1.6;
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(bg, 8.6, 12.2); // ซีกหน้าชัด ซีกหลังกลืนหายไปกับพื้น
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 1.1, 10);
      camera.lookAt(0, 0, 0);

      const earth = new THREE.Group();
      earth.rotation.z = 0.41; // แกนเอียงของโลก
      scene.add(earth);

      // จุดกระจายบนผิวทรงกลมแบบ fibonacci — ความหนาแน่นสม่ำเสมอโดยไม่ต้องมี texture
      const N = 1400;
      const pts = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = i * Math.PI * (3 - Math.sqrt(5));
        pts.set([Math.cos(t) * r * R, y * R, Math.sin(t) * r * R], i * 3);
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      earth.add(
        new THREE.Points(
          dotGeo,
          new THREE.PointsMaterial({ color: accent, size: 0.03, transparent: true, opacity: 0.8 }),
        ),
      );

      // เส้นรุ้ง-แวงทุก 30° ให้รูปทรงชัดขึ้น (WireframeGeometry ให้ตาข่ายสามเหลี่ยม ไม่ใช่รุ้ง-แวง)
      const gridPts: InstanceType<typeof THREE.Vector3>[] = [];
      const S = 96;
      const onSphere = (lat: number, lon: number) =>
        new THREE.Vector3(Math.cos(lat) * Math.cos(lon) * R, Math.sin(lat) * R, Math.cos(lat) * Math.sin(lon) * R);
      for (let lat = -60; lat <= 60; lat += 30)
        for (let i = 0; i < S; i++)
          gridPts.push(
            onSphere((lat * Math.PI) / 180, (i / S) * Math.PI * 2),
            onSphere((lat * Math.PI) / 180, ((i + 1) / S) * Math.PI * 2),
          );
      for (let lon = 0; lon < 180; lon += 30)
        for (let i = 0; i < S; i++)
          gridPts.push(
            onSphere((i / S) * Math.PI * 2, (lon * Math.PI) / 180),
            onSphere(((i + 1) / S) * Math.PI * 2, (lon * Math.PI) / 180),
          );
      earth.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(gridPts),
          new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.18 }),
        ),
      );

      // แสงเรืองรอบโลก — sprite ไล่สีจากกลางออกขอบ ไม่ได้รับ fog จึงไม่จางตามระยะ
      const halo = document.createElement("canvas");
      halo.width = halo.height = 128;
      const hg = halo.getContext("2d")!;
      const grad = hg.createRadialGradient(64, 64, 40, 64, 64, 64);
      grad.addColorStop(0, `rgba(${accent.r * 255},${accent.g * 255},${accent.b * 255},0.08)`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      hg.fillStyle = grad;
      hg.fillRect(0, 0, 128, 128);
      const haloTex: Texture = new THREE.CanvasTexture(halo);
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: haloTex, fog: false, depthWrite: false }),
      );
      glow.scale.setScalar(R * 3.4);
      scene.add(glow);

      // สถานีภาคพื้น — จุดคงที่บนผิวโลก (หมุนไปพร้อมโลก)
      const stations = [
        [0.35, 1.9],
        [-0.2, 0.6],
        [0.7, -0.9],
        [-0.55, 2.8],
      ].map(([lat, lon]) => {
        const p = new THREE.Vector3(
          Math.cos(lat) * Math.cos(lon) * R,
          Math.sin(lat) * R,
          Math.cos(lat) * Math.sin(lon) * R,
        );
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 10, 8),
          new THREE.MeshBasicMaterial({ color: accent }),
        );
        m.position.copy(p);
        earth.add(m);
        return m;
      });

      // วงโคจรสามวง ความเอียงต่างกัน วงนอกช้ากว่า
      const TRAIL = 40;
      const orbits = [
        { radius: 2.25, tilt: 1.05, spin: 0.3, speed: 0.55, phase: 0 },
        { radius: 2.6, tilt: 0.35, spin: -0.6, speed: 0.38, phase: 2.1 },
        { radius: 3.0, tilt: -0.75, spin: 1.2, speed: 0.26, phase: 4.2 },
      ].map(({ radius, tilt, spin, speed, phase }) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(tilt, spin, 0);
        scene.add(pivot);

        const circle = (i: number, n: number) => {
          const a = (i / n) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
        };
        pivot.add(
          new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(Array.from({ length: 160 }, (_, i) => circle(i, 160))),
            new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.16 }),
          ),
        );

        const sat = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 12, 8),
          new THREE.MeshBasicMaterial({ color: accent }),
        );
        pivot.add(sat);

        // หาง: เส้นตามหลังดาวเทียม ไล่ความทึบด้วย vertex color จากสีพื้นไปสี accent
        const trailGeo = new THREE.BufferGeometry();
        trailGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
        const cols = new Float32Array(TRAIL * 3);
        for (let i = 0; i < TRAIL; i++) {
          const c = bg.clone().lerp(accent, i / (TRAIL - 1));
          cols.set([c.r, c.g, c.b], i * 3);
        }
        trailGeo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
        pivot.add(new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ vertexColors: true })));

        return { pivot, sat, trailGeo, radius, speed, phase };
      });

      // ลิงก์ดาวเทียม ↔ สถานีที่อยู่ใกล้สุด (แสดงเฉพาะตอนดาวเทียมอยู่ฝั่งเดียวกับสถานี)
      const linkGeo = new THREE.BufferGeometry();
      linkGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(orbits.length * 6), 3));
      const links = new THREE.LineSegments(
        linkGeo,
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.35 }),
      );
      scene.add(links);

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      const sw = new THREE.Vector3();
      const st = new THREE.Vector3();
      const clock = new THREE.Clock();
      const frame = () => {
        const t = clock.getElapsedTime() + 3;
        earth.rotation.y = t * 0.07;
        earth.updateMatrixWorld();
        const lp = linkGeo.attributes.position as InstanceType<typeof THREE.BufferAttribute>;

        orbits.forEach((o, k) => {
          const a = t * o.speed + o.phase;
          o.sat.position.set(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius);

          const tp = o.trailGeo.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
          for (let i = 0; i < TRAIL; i++) {
            const b = a - (TRAIL - 1 - i) * 0.018; // i สุดท้าย = ตำแหน่งดาวเทียม
            tp.setXYZ(i, Math.cos(b) * o.radius, 0, Math.sin(b) * o.radius);
          }
          tp.needsUpdate = true;

          o.pivot.updateMatrixWorld();
          o.sat.getWorldPosition(sw);
          let best = Infinity;
          for (const s of stations) {
            s.getWorldPosition(st);
            // สถานีต้องหันหาดาวเทียม (อยู่เหนือขอบฟ้าของสถานี)
            if (st.dot(sw.clone().sub(st)) <= 0) continue;
            const d = st.distanceTo(sw);
            if (d < best) best = d;
            if (d === best) lp.setXYZ(k * 2 + 1, st.x, st.y, st.z);
          }
          if (best === Infinity) lp.setXYZ(k * 2 + 1, sw.x, sw.y, sw.z); // ไม่มีสถานีเห็น → เส้นยาวศูนย์
          lp.setXYZ(k * 2, sw.x, sw.y, sw.z);
        });
        lp.needsUpdate = true;
        renderer.render(scene, camera);
      };
      if (still) frame();
      else renderer.setAnimationLoop(frame);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.Points || o instanceof THREE.Sprite) {
            o.geometry.dispose();
            (o.material as Material).dispose();
          }
        });
        haloTex.dispose();
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

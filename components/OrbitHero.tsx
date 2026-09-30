"use client";

import { useEffect, useRef } from "react";
import type { Material } from "three";

/**
 * ลูกโลกจุดกับวงโคจรดาวเทียมจาง ๆ หลัง hero — ของตกแต่งล้วน (aria-hidden)
 *
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

      const accent = new THREE.Color(
        getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.domElement.className = "size-full";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0.8, 10); // ถอยพอให้วงโคจรวงนอกไม่ชนขอบ canvas
      camera.lookAt(0, 0, 0);

      const earth = new THREE.Group();
      earth.rotation.z = 0.41; // แกนเอียงของโลก
      scene.add(earth);

      // จุดกระจายบนผิวทรงกลมแบบ fibonacci — ได้ความหนาแน่นสม่ำเสมอโดยไม่ต้องมี texture
      const N = 900;
      const pts = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = i * Math.PI * (3 - Math.sqrt(5));
        pts.set([Math.cos(t) * r * 1.6, y * 1.6, Math.sin(t) * r * 1.6], i * 3);
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      earth.add(
        new THREE.Points(
          dotGeo,
          new THREE.PointsMaterial({ color: accent, size: 0.035, transparent: true, opacity: 0.55 }),
        ),
      );

      // วงโคจรสองวง แต่ละวงมีดาวเทียมหนึ่งดวง (วงนอกช้ากว่า — ใกล้เคียงของจริงพอให้ดูไม่แปลก)
      const orbits = [
        { radius: 2.3, tilt: 1.2, spin: 0.35, speed: 0.5 },
        { radius: 2.9, tilt: 0.25, spin: -0.5, speed: 0.3 },
      ].map(({ radius, tilt, spin, speed }) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(tilt, spin, 0);
        const ring = new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(
            Array.from({ length: 128 }, (_, i) => {
              const a = (i / 128) * Math.PI * 2;
              return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
            }),
          ),
          new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.3 }),
        );
        const sat = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 8),
          new THREE.MeshBasicMaterial({ color: accent }),
        );
        pivot.add(ring, sat);
        scene.add(pivot);
        return { sat, radius, speed };
      });

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      const clock = new THREE.Clock();
      const frame = () => {
        const t = clock.getElapsedTime() + 2; // +2 ให้เฟรมนิ่ง (reduced motion) ไม่เริ่มที่ดาวเทียมทับกัน
        earth.rotation.y = t * 0.08;
        for (const o of orbits) {
          o.sat.position.set(Math.cos(t * o.speed) * o.radius, 0, Math.sin(t * o.speed) * o.radius);
        }
        renderer.render(scene, camera);
      };
      if (still) frame();
      else renderer.setAnimationLoop(frame);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.Points) {
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

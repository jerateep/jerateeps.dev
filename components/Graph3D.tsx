"use client";

import { useEffect, useRef, useState } from "react";
import graph from "@/content/graph.json";

/**
 * กราฟคลังความรู้แบบ 3D — ซ้อนทับภาพ SVG เดิม (children) เมื่อพร้อม
 *
 * - three.js โหลดแบบ dynamic import ตอนกราฟเลื่อนเข้าจอเท่านั้น หน้าแรกไม่ต้องจ่าย
 * - reduced motion / ไม่มี WebGL → ใช้ SVG เดิม ไม่โหลดอะไรเพิ่ม
 * - ปิด zoom และ pan ไว้ ไม่ให้แย่ง scroll ของหน้า; บนมือถือหมุนด้วยสองนิ้ว นิ้วเดียวยังเลื่อนหน้าได้
 * - แกน z ไม่มีในข้อมูล (layout เป็น 2D) จึงแยกความลึกตามกลุ่มระบบ ให้กลุ่มเดียวกันอยู่ชั้นเดียวกัน
 *
 * ponytail: อ่านสีจาก CSS variable ครั้งเดียวตอนสร้าง — ถ้าสลับธีมกลางคันต้อง reload
 */
export function Graph3D({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!document.createElement("canvas").getContext("webgl2")) return;

    let cleanup = () => {};
    let visible = false;
    let started = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started) {
          started = true;
          void start();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    async function start() {
      const THREE = await import("three");
      const { OrbitControls } =
        await import("three/examples/jsm/controls/OrbitControls.js");
      if (!el) return;

      const css = getComputedStyle(document.documentElement);
      const accent = new THREE.Color(css.getPropertyValue("--accent").trim());
      const line = new THREE.Color(css.getPropertyValue("--border").trim());

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      renderer.domElement.className = "absolute inset-0 size-full";
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.setAttribute("aria-hidden", "true");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 1, 5000);
      camera.position.set(0, 0, 1050);

      // ความลึกต่อกลุ่ม ±110 บวกส่ายรายจุด ±40 แบบคงที่ (ไม่สุ่ม) ภาพจึงเหมือนเดิมทุกครั้ง
      // ถ้าไม่ส่ายรายจุด แต่ละกลุ่มจะเป็นแผ่นแบนเวลามองเฉียง
      const depth = (g: number) => ((g * 0.618) % 1) * 220 - 110;
      const pos = graph.nodes.map(
        (n, i) =>
          new THREE.Vector3(
            n.x - graph.width / 2,
            graph.height / 2 - n.y,
            depth(n.g) + ((i * 37) % 81) - 40,
          ),
      );

      const world = new THREE.Group();
      scene.add(world);

      const edgeGeo = new THREE.BufferGeometry().setFromPoints(
        graph.edges.flatMap(([a, b]) => [pos[a], pos[b]]),
      );
      world.add(
        new THREE.LineSegments(
          edgeGeo,
          new THREE.LineBasicMaterial({
            color: line,
            transparent: true,
            opacity: 0.9,
          }),
        ),
      );

      const sphere = new THREE.SphereGeometry(1, 12, 8);
      const dots = new THREE.InstancedMesh(
        sphere,
        new THREE.MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.85,
        }),
        graph.nodes.length,
      );
      const m = new THREE.Matrix4();
      graph.nodes.forEach((n, i) => {
        m.makeScale(n.r, n.r, n.r).setPosition(pos[i]);
        dots.setMatrixAt(i, m);
      });
      world.add(dots);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      // จำกัดมุมมอง ไม่ให้หมุนจนเห็นด้านข้าง ซึ่งจุดจะซ้อนกันจนอ่านไม่ออก
      controls.minAzimuthAngle = -0.6;
      controls.maxAzimuthAngle = 0.6;
      controls.minPolarAngle = Math.PI / 2 - 0.4;
      controls.maxPolarAngle = Math.PI / 2 + 0.4;
      controls.touches = {
        ONE: undefined as never,
        TWO: THREE.TOUCH.DOLLY_ROTATE,
      };

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      // แกว่งช้า ๆ ±30° แทนหมุนรอบตัว — หยุดแกว่งระหว่างผู้ใช้ลากเอง
      let dragging = false;
      controls.addEventListener("start", () => (dragging = true));
      controls.addEventListener("end", () => (dragging = false));
      const clock = new THREE.Clock();
      let t = 0; // เดินเฉพาะตอนไม่ได้ลาก ปล่อยมือแล้วแกว่งต่อจากเดิม ไม่กระตุก
      renderer.setAnimationLoop(() => {
        const dt = clock.getDelta();
        if (!visible) return;
        if (!dragging) t += dt;
        world.rotation.y = Math.sin(t * 0.25) * 0.5;
        controls.update();
        renderer.render(scene, camera);
      });
      setReady(true);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        controls.dispose();
        edgeGeo.dispose();
        sphere.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => {
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div ref={box} className="relative">
      {/* SVG เดิมยังอยู่ใน DOM เพื่อกำหนดสัดส่วนกล่องและให้ screen reader อ่าน aria-label */}
      {/* opacity ไม่ใช่ visibility — visibility:hidden ตัดออกจาก accessibility tree ด้วย */}
      <div className={ready ? "opacity-0" : undefined}>{children}</div>
    </div>
  );
}

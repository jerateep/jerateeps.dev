"use client";

import { useEffect, useRef, useState } from "react";
import graph from "@/content/graph.json";

/**
 * กราฟคลังความรู้แบบ 3D — ซ้อนทับภาพ SVG เดิม (children) เมื่อพร้อม
 *
 * - three.js โหลดแบบ dynamic import ตอนกราฟเลื่อนเข้าจอเท่านั้น หน้าแรกไม่ต้องจ่าย
 * - reduced motion / ไม่มี WebGL → ใช้ SVG เดิม ไม่โหลดอะไรเพิ่ม
 * - ปิด zoom และ pan ไว้ ไม่ให้แย่ง scroll ของหน้า; บนมือถือหมุนด้วยสองนิ้ว นิ้วเดียวยังเลื่อนหน้าได้
 * - หน้าตาแบบ graph view: จุดแบน สีตามกลุ่ม เส้นจาง ลึกนิดเดียว และ hover แล้วเห็นโน้ตที่เชื่อมกัน
 *   (เดิมเป็นทรงกลมทึบบนก้านสีเทา ดูเป็นโมเลกุลมากกว่าคลังความรู้)
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
      const bg = new THREE.Color(css.getPropertyValue("--bg").trim());
      const dpr = Math.min(devicePixelRatio, 2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(dpr);
      el.appendChild(renderer.domElement);
      renderer.domElement.className = "absolute inset-0 size-full";
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.setAttribute("aria-hidden", "true");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 1, 5000);
      const DIST = 1050;
      camera.position.set(0, 0, DIST);

      // ความลึกแค่พอให้มีมิติ — ลึกกว่านี้มองเฉียงแล้วกลายเป็นโมเลกุลลอยอยู่
      // ค่าคงที่ ไม่สุ่ม ภาพจึงเหมือนเดิมทุกครั้ง
      const depth = (g: number) => ((g * 0.618) % 1) * 90 - 45;
      const pos = graph.nodes.map(
        (n, i) =>
          new THREE.Vector3(
            n.x - graph.width / 2,
            graph.height / 2 - n.y,
            depth(n.g) + ((i * 37) % 51) - 25,
          ),
      );

      // สีต่อกลุ่ม: เฉดรอบสี accent — แยกกลุ่มออกจากกันแต่ยังเป็นโทนเดียวกับเว็บ
      const hsl = { h: 0, s: 0, l: 0 };
      accent.getHSL(hsl);
      const base = graph.nodes.map((n) =>
        new THREE.Color().setHSL(
          (hsl.h + (((n.g * 0.618) % 1) - 0.5) * 0.18 + 1) % 1,
          hsl.s * 0.85,
          hsl.l,
        ),
      );

      // เพื่อนบ้านของแต่ละโน้ต — ใช้ตอน hover
      const near = graph.nodes.map(() => new Set<number>());
      for (const [a, b] of graph.edges) {
        near[a].add(b);
        near[b].add(a);
      }

      const world = new THREE.Group();
      scene.add(world);

      // เส้น: สีไล่ระหว่างสองปลายแบบจาง ๆ ผสมกับสีพื้น
      const edgeGeo = new THREE.BufferGeometry().setFromPoints(
        graph.edges.flatMap(([a, b]) => [pos[a], pos[b]]),
      );
      const edgeCol = new Float32Array(graph.edges.length * 6);
      const paintEdges = (focus: number | null) => {
        graph.edges.forEach(([a, b], i) => {
          const on = focus === null || a === focus || b === focus;
          const k = focus === null ? 0.35 : on ? 0.9 : 0.06;
          bg.clone().lerp(base[a], k).toArray(edgeCol, i * 6);
          bg.clone().lerp(base[b], k).toArray(edgeCol, i * 6 + 3);
        });
        edgeGeo.setAttribute("color", new THREE.BufferAttribute(edgeCol, 3));
      };
      paintEdges(null);
      world.add(
        new THREE.LineSegments(
          edgeGeo,
          new THREE.LineBasicMaterial({ vertexColors: true }),
        ),
      );

      // โน้ต: จุดแบนหันเข้ากล้องเสมอ (point sprite) โน้ตที่ถูกอ้างถึงบ่อยมีวงเรืองรอบ
      const nodeGeo = new THREE.BufferGeometry().setFromPoints(pos);
      nodeGeo.setAttribute(
        "size",
        new THREE.BufferAttribute(new Float32Array(graph.nodes.map((n) => n.r * 5)), 1),
      );
      const col = new Float32Array(graph.nodes.length * 3);
      base.forEach((c, i) => c.toArray(col, i * 3));
      nodeGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const alpha = new Float32Array(graph.nodes.length).fill(1);
      const alphaAttr = new THREE.BufferAttribute(alpha, 1);
      nodeGeo.setAttribute("alpha", alphaAttr);
      const paintNodes = (focus: number | null) => {
        for (let i = 0; i < alpha.length; i++)
          alpha[i] = focus === null || i === focus || near[focus].has(i) ? 1 : 0.15;
        alphaAttr.needsUpdate = true;
      };

      const nodeMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: { scale: { value: 1 } },
        vertexShader: [
          "attribute float size;",
          "attribute float alpha;",
          "attribute vec3 color;",
          "uniform float scale;",
          "varying vec3 vColor;",
          "varying float vAlpha;",
          "varying float vSize;",
          "void main() {",
          "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
          "  vColor = color; vAlpha = alpha; vSize = size;",
          `  gl_PointSize = size * scale * (${DIST.toFixed(1)} / -mv.z);`,
          "  gl_Position = projectionMatrix * mv;",
          "}",
        ].join("\n"),
        // แกนกลางทึบ + วงเรืองจาง ๆ เฉพาะโน้ตใหญ่ (vSize สูง)
        fragmentShader: [
          "varying vec3 vColor;",
          "varying float vAlpha;",
          "varying float vSize;",
          "void main() {",
          "  float d = length(gl_PointCoord - 0.5);",
          "  float core = smoothstep(0.25, 0.21, d);",
          "  float glow = smoothstep(0.5, 0.2, d) * 0.25 * smoothstep(16.0, 30.0, vSize);",
          "  float a = max(core, glow) * vAlpha;",
          "  if (a < 0.01) discard;",
          "  gl_FragColor = vec4(vColor, a);",
          // แปลงสีจาก linear เป็นสีจอ — ShaderMaterial ไม่ทำให้เอง ไม่งั้นจุดออกมาดำ
          "  #include <colorspace_fragment>",
          "}",
        ].join("\n"),
      });
      const dots = new THREE.Points(nodeGeo, nodeMat);
      // วาดจุดทับเส้นเสมอ ไม่งั้นเส้นที่วิ่งเข้าโน้ตจะผ่ากลางจุดเป็นรูปเสี้ยว
      dots.renderOrder = 1;
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
        // ขนาดจุดเป็น pixel — ปรับตามความกว้างกล่อง ให้สัดส่วนใกล้ SVG เดิม
        nodeMat.uniforms.scale.value = (width / graph.width) * dpr;
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      // hover โน้ต → ไฮไลต์ตัวมันกับโน้ตที่เชื่อมอยู่ ที่เหลือจางลง แบบ graph view ของ Obsidian
      const ray = new THREE.Raycaster();
      ray.params.Points.threshold = 6;
      const mouse = new THREE.Vector2();
      let focus: number | null = null;
      const setFocus = (next: number | null) => {
        if (next === focus) return;
        focus = next;
        paintNodes(focus);
        paintEdges(focus);
        renderer.domElement.style.cursor = focus === null ? "" : "pointer";
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = renderer.domElement.getBoundingClientRect();
        mouse.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1,
        );
        ray.setFromCamera(mouse, camera);
        setFocus(ray.intersectObject(dots)[0]?.index ?? null);
      };
      const onLeave = () => setFocus(null);
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerleave", onLeave);

      // แกว่งช้า ๆ ±17° — หยุดระหว่างผู้ใช้ลาก หรือกำลังชี้โน้ตอยู่ (ให้อ่านได้นิ่ง ๆ)
      let dragging = false;
      controls.addEventListener("start", () => (dragging = true));
      controls.addEventListener("end", () => (dragging = false));
      const clock = new THREE.Clock();
      let t = 0; // เดินเฉพาะตอนแกว่ง ปล่อยแล้วแกว่งต่อจากเดิม ไม่กระตุก
      renderer.setAnimationLoop(() => {
        const dt = clock.getDelta();
        if (!visible) return;
        if (!dragging && focus === null) t += dt;
        world.rotation.y = Math.sin(t * 0.25) * 0.3;
        controls.update();
        renderer.render(scene, camera);
      });
      setReady(true);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        controls.dispose();
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerleave", onLeave);
        edgeGeo.dispose();
        nodeGeo.dispose();
        nodeMat.dispose();
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

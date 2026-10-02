"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/** ธีมที่เห็นอยู่จริง: ที่เลือกเองไว้ (data-theme) หรือถ้าไม่ได้เลือก ก็ตามเครื่อง */
const current = (): Theme =>
  (document.documentElement.dataset.theme as Theme | undefined) ??
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

/** แจ้งเมื่อธีมเปลี่ยน: กดปุ่ม (event "themechange") หรือเครื่องเปลี่ยนธีมเอง */
const subscribe = (onChange: () => void) => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  addEventListener("themechange", onChange);
  media.addEventListener("change", onChange);
  return () => {
    removeEventListener("themechange", onChange);
    media.removeEventListener("change", onChange);
  };
};

/**
 * ปุ่มสลับโหมดสว่าง/มืด — จำไว้ใน localStorage และตั้ง data-theme บน <html>
 * (inline script ใน layout ตั้งค่าเดิมให้ก่อนหน้าแรกวาด จึงไม่กระพริบ)
 */
export function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  // รู้ธีมได้หลัง mount เท่านั้น (server ไม่รู้ว่าเครื่องคนดูตั้งอะไร) — ก่อนนั้นวาดปุ่มเปล่าขนาดเท่ากัน
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);

  const flip = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // private mode / storage ปิด — สลับได้แต่ไม่จำ
    }
    dispatchEvent(new Event("themechange"));
  };

  const label = theme === "dark" ? toLight : toDark;
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={label}
      title={label}
      className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {theme && (
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {theme === "dark" ? (
            // อยู่โหมดมืด → แสดงพระอาทิตย์ (กดแล้วไปสว่าง)
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </>
          ) : (
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          )}
        </svg>
      )}
    </button>
  );
}

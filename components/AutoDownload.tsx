"use client";

import { useEffect, useRef } from "react";

/** เริ่มดาวน์โหลดไฟล์ทันทีที่หน้าโหลด — ลิงก์เดียวกันยังกดเองได้ถ้า browser บล็อก */
export function AutoDownload({ href, label }: { href: string; label: string }) {
  const link = useRef<HTMLAnchorElement>(null);
  useEffect(() => link.current?.click(), []);
  return (
    <a ref={link} href={href} download className="text-accent underline underline-offset-4">
      {label}
    </a>
  );
}

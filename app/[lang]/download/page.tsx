import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/content/profile";
import { ui } from "@/content/ui";
import { AutoDownload } from "@/components/AutoDownload";

/**
 * ปุ่มดาวน์โหลด resume พามาหน้านี้แทนการลิงก์ไฟล์ตรง เพื่อให้นับจำนวนดาวน์โหลดได้ฟรี:
 * Vercel Web Analytics แพ็กเกจฟรีนับได้แค่ page view (custom event ต้องใช้ Pro)
 * และไฟล์ PDF ไม่ใช่หน้าเว็บ จึงนับ page view ของหน้านี้แทน
 */

const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const metadata: Metadata = { robots: { index: false } };

export default async function Download({ params }: PageProps<"/[lang]/download">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl px-6 py-24">
      <h1 className="text-2xl font-semibold">{ui.downloadTitle[lang]}</h1>
      <p className="mt-4 text-muted">
        {ui.downloadFallback[lang]}{" "}
        <AutoDownload href="/Jerateep-Saelee-Resume.pdf" label={ui.downloadLink[lang]} />
      </p>
      <Link href={`/${lang}`} className="mt-8 inline-block text-sm text-muted hover:text-accent">
        ← {ui.downloadBack[lang]}
      </Link>
    </main>
  );
}

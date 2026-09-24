import { ImageResponse } from "next/og";
import { locales, profile, type Locale } from "@/content/profile";

/**
 * ภาพที่ขึ้นเวลาแปะลิงก์ใน LINE / Slack / LinkedIn
 * ไม่มีภาพนี้แล้วตั้ง twitter:card เป็น summary_large_image จะได้การ์ดใหญ่ที่ว่างเปล่า
 * ซึ่งคนเห็นก่อนจะเห็นหน้าเว็บจริงด้วยซ้ำ
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Locale = (locales as readonly string[]).includes(raw)
    ? (raw as Locale)
    : "th";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0c0d0f",
          color: "#e9eaec",
          padding: "88px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#5eead4" }}>
          jerateeps.dev
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 600,
            marginTop: 28,
          }}
        >
          {profile.name[lang]}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#9298a2",
            marginTop: 20,
          }}
        >
          {profile.role[lang]}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            height: 4,
            width: 160,
            background: "#5eead4",
          }}
        />
      </div>
    ),
    size,
  );
}

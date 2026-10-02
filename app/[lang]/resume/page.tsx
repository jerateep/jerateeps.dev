import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, profile, type Locale } from "@/content/profile";
import { ui } from "@/content/ui";
import learn from "@/content/learn.json";

/**
 * Resume ฉบับทางการ — ต้นฉบับของ public/Jerateep-Saelee-Resume.pdf (ภาษาอังกฤษอย่างเดียว) (สร้างด้วย scripts/build-resume-pdf.mjs)
 * ดึงข้อมูลจาก profile.ts ชุดเดียวกับหน้าหลัก แก้เนื้อหาแล้วต้องสร้าง PDF ใหม่
 *
 * ขาวดำ ไม่มีกราฟิก ตามรูปแบบที่ ATS อ่านได้และ recruiter พิมพ์ได้ — สีบังคับขาวเสมอไม่ตามธีม
 */

const SITE = "https://jerateeps-dev.vercel.app";

const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/resume">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${profile.name[lang]} — Resume`,
    // เนื้อหาซ้ำกับหน้าหลัก ให้ค้นเจอหน้าหลักแทน
    robots: { index: false },
  };
}

function Heading({ children }: { children: string }) {
  return (
    <h2 className={`mt-4 mb-2 break-after-avoid border-b border-neutral-300 pb-1 text-xs font-semibold text-neutral-900 tracking-wider uppercase`}>
      {children}
    </h2>
  );
}

const strip = (href: string) => href.replace(/^mailto:|^https:\/\/(www\.)?/, "").replace(/\/$/, "");

export default async function Resume({ params }: PageProps<"/[lang]/resume">) {
  const { lang } = await params;
  // ฉบับไทยตัดออก: Chrome ฝังข้อความไทยใน PDF ไม่สะอาด (สระอำแยกตัว) ATS อ่านพลาด และ recruiter ใช้ฉบับอังกฤษอยู่แล้ว
  if (lang !== "en") notFound();

  const projects = profile.projects.filter((p) => !p.compact);
  const link = (label: string) => strip(profile.links.find((l) => l.label === label)?.href ?? "");
  // สองแถวตายตัว: ช่องทางติดต่อหลักก่อน แล้วค่อยโปรไฟล์ — ปล่อย wrap เองแล้วตัดบรรทัดไม่เป็นที่
  const contactRows = [
    [profile.location[lang], link("Email"), strip(SITE)],
    [link("LinkedIn"), link("GitHub")],
  ];

  return (
    <main
      id="main"
      tabIndex={-1}
      className={`mx-auto my-8 w-full max-w-[210mm] bg-white px-[15mm] py-[12mm] leading-snug text-neutral-800 shadow print:my-0 print:max-w-none print:p-0 print:shadow-none text-[13px]`}
    >
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">{profile.name[lang]}</h1>
        <p className="mt-0.5 font-medium">{profile.role[lang]}</p>
        <div className="mt-1.5 space-y-0.5 text-xs text-neutral-600">
          {contactRows.map((row, i) => (
            <p key={i}>{row.join("  ·  ")}</p>
          ))}
        </div>
        <p className="mt-1.5 text-xs">
          <span className="font-semibold text-neutral-900">{ui.resumeCore[lang]}:</span> {profile.coreSkills.join(" · ")}
        </p>
      </header>

      <Heading>Summary</Heading>
      <p>{profile.tagline[lang]}</p>
      <p className="mt-1.5">{profile.about[1][lang]}</p>

      <Heading>{ui.sections.experience[lang]}</Heading>
      <div className="space-y-3">
        {profile.experience.map((job, i) => {
          const shown = job.highlights.slice(0, job.resumeHighlights ?? job.highlights.length);
          return (
            // งานสั้นห้ามขาดกลางหน้า — ไม่งั้นบรรทัด stack หลุดไปขึ้นหน้าใหม่บรรทัดเดียว
            <section key={i} className={shown.length <= 2 ? "break-inside-avoid" : ""}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 break-after-avoid">
                <h3 className="font-semibold text-neutral-900">
                  {job.role[lang]} <span className="font-normal text-neutral-700">— {job.company[lang]}</span>
                </h3>
                <span className="text-xs whitespace-nowrap text-neutral-600">{job.period[lang]}</span>
              </div>
              {shown.length > 0 && (
                <>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4">
                    {shown.map((item, j) => (
                      <li key={j} className="break-inside-avoid">{item[lang]}</li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs text-neutral-600">{job.stack.join(" · ")}</p>
                </>
              )}
              {/* ผลงานเด่นทั้งหมดอยู่ที่บริษัทปัจจุบัน — วางใต้งานนี้ ไม่ใช่ท้ายประวัติงานเก่า */}
              {i === 0 && (
                <div className="mt-2.5 border-l-2 border-neutral-200 pl-3">
                  <p className="font-semibold text-neutral-900">{ui.resumeKeyProjects[lang]}</p>
                  <p className="mb-1 text-xs text-neutral-600 italic">{ui.projectsLead[lang]}</p>
                  <div className="space-y-1">
                    {projects.map((p) => (
                      <p key={p.slug} className="break-inside-avoid">
                        <span className="font-medium text-neutral-900">{p.name[lang]}</span> — {p.impact[p.resumeImpact ?? 0][lang]}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <Heading>{ui.sections.skills[lang]}</Heading>
      <dl className="space-y-0.5">
        {profile.skills.map((g, i) => (
          <div key={i} className="flex gap-3">
            <dt className="w-40 shrink-0 font-medium text-neutral-900">{g.title[lang]}</dt>
            <dd>{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>

      <Heading>{ui.education[lang]}</Heading>
      <div className="space-y-1">
        {profile.education.map((e, i) => (
          <div key={i} className="flex items-baseline justify-between gap-x-4">
            <p>
              <span className="font-medium text-neutral-900">{e.degree[lang]}</span> — {e.school[lang]}
            </p>
            <span className="shrink-0 text-xs text-neutral-600">{e.period[lang]}</span>
          </div>
        ))}
      </div>

      <Heading>{ui.certifications[lang]}</Heading>
      <p>
        <span className="font-medium text-neutral-900">{ui.microsoftLearn[lang]}:</span> {learn.courses.join(", ")}
      </p>
      <p className="mt-0.5">
        <span className="font-medium text-neutral-900">{ui.googleCloud[lang]}:</span> {ui.googleCloudSummary[lang]}
      </p>

      <Heading>{ui.languages[lang]}</Heading>
      <ul>
        {profile.languages.map((l, i) => (
          <li key={i}>
            <span className="font-medium text-neutral-900">{l.name[lang]}</span> — {l.level[lang]}
          </li>
        ))}
      </ul>
    </main>
  );
}

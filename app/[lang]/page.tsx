import { notFound } from "next/navigation";
import { locales, profile, type Locale } from "@/content/profile";
import { ui } from "@/content/ui";
import { PipelineDiagram } from "@/components/PipelineDiagram";

const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border/70 py-14">
      <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">
      {children}
    </li>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-6">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <p className="mb-4 font-mono text-sm text-accent">
          {profile.role[lang]}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {profile.name[lang]}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          {profile.tagline[lang]}
        </p>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span>{profile.location[lang]}</span>
          <span aria-hidden className="text-border">
            ·
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-accent"
            />
            {profile.available[lang]}
          </span>
        </p>
      </section>

      {/* About */}
      <Section id="about" title={ui.sections.about[lang]}>
        <div className="space-y-4 text-muted">
          {profile.about.map((paragraph, i) => (
            <p key={i}>{paragraph[lang]}</p>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title={ui.sections.skills[lang]}>
        <dl className="space-y-6">
          {profile.skills.map((group, i) => (
            <div key={i} className="sm:flex sm:gap-6">
              <dt className="mb-2 shrink-0 text-sm text-muted sm:mb-0 sm:w-44">
                {group.title[lang]}
              </dt>
              <dd className="flex-1">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Experience */}
      <Section id="experience" title={ui.sections.experience[lang]}>
        <div className="space-y-12">
          {profile.experience.map((job, i) => (
            <article key={i}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-medium">{job.role[lang]}</h3>
                <span className="text-muted">— {job.company[lang]}</span>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">
                {job.period[lang]}
              </p>
              <p className="mt-4 text-muted">{job.summary[lang]}</p>
              <ul className="mt-4 space-y-2 text-muted">
                {job.highlights.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-2">
                {job.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title={ui.sections.projects[lang]}>
        <p className="mb-8 max-w-2xl text-muted">{ui.projectsLead[lang]}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.projects.map((project) => (
            <article
              key={project.slug}
              // min-w-0 จำเป็น: grid item ไม่ยอมหดต่ำกว่าความกว้างเนื้อหา
              // ทำให้ svg ใน overflow-x-auto ดันทั้งหน้าให้เลื่อนแนวนอนแทน
              className={`flex min-w-0 flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/50 ${
                project.featured
                  ? // การ์ดที่มีแผนภาพต้องกว้างกว่าคอลัมน์ปกติ ไม่งั้นต้องเลื่อนดูทั้งภาพ
                    "sm:col-span-2 lg:-mx-24 xl:-mx-56"
                  : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{project.name[lang]}</h3>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {project.year}
                </span>
              </div>
              {/* badge รายการ์ดถูกถอดออก — ประกาศครั้งเดียวที่หัว section แทน
                  เพราะ 8 ใน 9 ใบเป็นระบบภายใน ซ้ำทุกใบแล้วอ่านเหมือนกำแพงปิดบัง */}
              <p className="mt-3 text-sm text-muted">{project.summary[lang]}</p>
              {project.diagram && (
                <PipelineDiagram
                  t={project.diagram}
                  lang={lang}
                  caption={ui.diagramCaption[lang]}
                  scrollHint={ui.scrollHint[lang]}
                />
              )}
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {project.impact.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </ul>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 font-mono text-sm text-accent hover:underline"
                >
                  {ui.viewProject[lang]} ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* Coverage — ความกว้างของงาน */}
      <Section id="domains" title={ui.sections.domains[lang]}>
        <p className="text-muted">{ui.domainsLead[lang]}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {profile.domains.map((domain, i) => (
            <div key={i}>
              <h3 className="mb-3 text-sm font-medium">{domain.title[lang]}</h3>
              <ul className="space-y-1.5 text-sm text-muted">
                {domain.items.map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-border" />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* AI ในกระบวนการทำงาน */}
      <Section id="ai" title={ui.sections.ai[lang]}>
        <p className="max-w-2xl text-muted">{ui.aiLead[lang]}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {profile.aiPractice.map((item, i) => (
            <article
              key={i}
              className="flex flex-col rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="font-medium">{item.title[lang]}</h3>
              <p className="mt-3 flex-1 text-sm text-muted">{item.body[lang]}</p>
              <p className="mt-4 border-t border-border pt-4 text-sm">
                <span className="font-mono text-xs tracking-wide text-accent uppercase">
                  {ui.aiResultLabel[lang]}
                </span>
                <br />
                <span className="text-muted">{item.result[lang]}</span>
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* การศึกษาและคุณวุฒิ */}
      <Section id="background" title={ui.sections.background[lang]}>
        <dl className="space-y-6">
          <div className="sm:flex sm:gap-6">
            <dt className="mb-2 shrink-0 text-sm text-muted sm:mb-0 sm:w-44">
              {ui.education[lang]}
            </dt>
            <dd className="flex-1 space-y-3">
              {profile.education.map((item, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">{item.school[lang]}</p>
                  <p className="text-sm text-muted">
                    {item.degree[lang]}{" "}
                    <span className="font-mono text-xs">· {item.period}</span>
                  </p>
                </div>
              ))}
            </dd>
          </div>

          <div className="sm:flex sm:gap-6">
            <dt className="mb-2 shrink-0 text-sm text-muted sm:mb-0 sm:w-44">
              {ui.certifications[lang]}
            </dt>
            <dd className="flex-1">
              <ul className="space-y-1.5 text-sm text-muted">
                {profile.certifications.map((cert) => (
                  <li key={cert} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-border" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="sm:flex sm:gap-6">
            <dt className="mb-2 shrink-0 text-sm text-muted sm:mb-0 sm:w-44">
              {ui.languages[lang]}
            </dt>
            <dd className="flex-1">
              <ul className="space-y-1.5 text-sm text-muted">
                {profile.languages.map((item, i) => (
                  <li key={i}>
                    <span className="text-fg">{item.name[lang]}</span> —{" "}
                    {item.level[lang]}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </Section>

      {/* Contact */}
      <Section id="contact" title={ui.sections.contact[lang]}>
        <p className="text-muted">{ui.contactLead[lang]}</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {profile.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer noopener"
                className="inline-block rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}

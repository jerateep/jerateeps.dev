import { notFound } from "next/navigation";
import { locales, profile, type Locale } from "@/content/profile";
import { ui } from "@/content/ui";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { MiniFlow } from "@/components/MiniFlow";
import learn from "@/content/learn.json";

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
      <h2 className="section-label mb-8 text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

const CORE = new Set<string>(profile.coreSkills);

function Tag({ children }: { children: string }) {
  // แกนหลักเด่นกว่าตัวอื่น ไม่งั้น 40+ chip น้ำหนักเท่ากันหมด จนกวาดตาแล้วจับไม่ได้ว่าถนัดอะไร
  const core = CORE.has(children);
  return (
    <li
      className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${
        core ? "border-accent/60 text-fg" : "border-border text-muted"
      }`}
    >
      {children}
    </li>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl px-6">
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
        <p className="mt-6 text-sm text-muted">{profile.location[lang]}</p>
        <a
          href={profile.links.find((l) => l.href.startsWith("mailto:"))?.href}
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm text-bg transition-opacity hover:opacity-90"
        >
          {ui.contactCta[lang]}
        </a>
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
              <dt className="mb-2 shrink-0 text-sm font-medium sm:mb-0 sm:w-44">
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
                    <span aria-hidden className="mt-[0.62em] size-1 shrink-0 rounded-full bg-accent" />
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
          {profile.projects
            .filter((project) => !project.compact)
            .map((project) => (
            <article
              key={project.slug}
              // min-w-0 จำเป็น: grid item ไม่ยอมหดต่ำกว่าความกว้างเนื้อหา
              // ทำให้ svg ใน overflow-x-auto ดันทั้งหน้าให้เลื่อนแนวนอนแทน
              className={`flex min-w-0 flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/50 ${
                // การ์ดที่มีแผนภาพกว้างกว่าคอลัมน์ปกติ โดยขยายทั้งใบพร้อมเส้นขอบ
                // ถ้าให้เฉพาะแผนภาพทะลุออก มันจะยื่นเลยขอบการ์ดจนดูเหมือนหลุดกรอบ
                // ความยาวบรรทัดข้างในคุมแยกด้วย max-w
                project.featured
                  ? "sm:col-span-2 lg:-mx-12 lg:px-12 xl:-mx-32 xl:px-32"
                  : ""
              }`}
            >
              <h3 className="font-medium">{project.name[lang]}</h3>
              {/* badge รายการ์ดถูกถอดออก — ประกาศครั้งเดียวที่หัว section แทน
                  เพราะ 8 ใน 9 ใบเป็นระบบภายใน ซ้ำทุกใบแล้วอ่านเหมือนกำแพงปิดบัง */}
              <p className={`mt-3 text-sm text-muted ${project.featured ? "max-w-[68ch]" : ""}`}>
                {project.summary[lang]}
              </p>
              {project.flow && <MiniFlow steps={project.flow} lang={lang} />}
              {project.diagram && (
                <PipelineDiagram
                  t={project.diagram}
                  lang={lang}
                  caption={ui.diagramCaption[lang]}
                  scrollHint={ui.scrollHint[lang]}
                />
              )}
              <ul
                className={`mt-4 space-y-1.5 text-sm text-muted ${
                  project.featured ? "max-w-[68ch]" : ""
                }`}
              >
                {project.impact.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
              {/* mt-auto ดันป้ายลงก้นการ์ด ไม่ให้เหลือที่ว่างตายเมื่อ grid ยืดความสูงให้เท่ากัน */}
              <ul className="mt-auto flex flex-wrap gap-2 pt-5">
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

        {/* ใบที่เหลือแสดงแบบย่อ — ชื่อ สรุปหนึ่งบรรทัด และ stack
            การ์ดเต็มสิบสามใบทำให้ใบเด่นถูกกลบ และดันปุ่มติดต่อไปไกลจนไม่มีใครเลื่อนถึง */}
        <p className="section-label mt-12 mb-4 text-muted">
          {ui.moreProjects[lang]}
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {profile.projects
            .filter((project) => project.compact)
            .map((project) => (
              <li key={project.slug} className="py-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-medium">{project.name[lang]}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-xs text-accent hover:underline"
                    >
                      {ui.viewProject[lang]} ↗
                    </a>
                  )}
                </div>
                <p className="mt-1 max-w-[68ch] text-sm text-muted">
                  {project.summary[lang]}
                </p>
                <p className="mt-1.5 font-mono text-xs text-muted">
                  {project.stack.join(" · ")}
                </p>
              </li>
            ))}
        </ul>
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
                    <span aria-hidden className="mt-[0.62em] size-1 shrink-0 rounded-full bg-muted/50" />
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
        <KnowledgeGraph
          caption={ui.graphCaption[lang]}
          label={ui.graphLabel[lang]}
        />
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
                    <span className="font-mono text-xs whitespace-nowrap">
                      · {item.period}
                    </span>
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
              {/* Microsoft Learn มี 185 รายการ ลิสต์หมดคือ noise — โชว์หลักสูตรตามแนวข้อสอบ
                  ซึ่งเป็นชั้นที่มีน้ำหนักจริง แล้วสรุปที่เหลือเป็นตัวเลข */}
              <p className="text-sm font-medium">{ui.microsoftLearn[lang]}</p>
              <p className="mt-1 text-sm text-muted">
                {learn.total} {ui.learnTotal[lang]} · {learn.counts.learningPaths}{" "}
                {ui.learnPaths[lang]} · {learn.counts.modules}{" "}
                {ui.learnModules[lang]}
              </p>
              <p className="mt-3 text-sm text-muted">
                {ui.learnCourses[lang]}
              </p>
              <ul className="mt-1.5 space-y-1.5 text-sm text-muted">
                {learn.courses.map((course) => (
                  <li key={course} className="flex gap-2">
                    <span aria-hidden className="mt-[0.62em] size-1 shrink-0 rounded-full bg-muted/50" />
                    <span>{course}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-sm font-medium">{ui.googleCloud[lang]}</p>
              {/* 16 รายการเรียงเต็มกินพื้นที่มากกว่าน้ำหนักที่ควรมี — สรุปเป็นบรรทัดเดียว
                  รายการเต็มยังตรวจได้จากลิงก์ verify ด้านล่าง */}
              <p className="mt-1 text-sm text-muted">
                {ui.googleCloudSummary[lang]}
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="text-muted">{ui.verifyAt[lang]}</span>
                {profile.credentialProfiles.map((p) => (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-accent hover:underline"
                  >
                    {p.label} ↗
                  </a>
                ))}
              </p>
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
                // อีเมลคือปลายทางที่เว็บนี้อยากให้กด จึงเป็นปุ่มทึบใบเดียว ที่เหลือเป็นเส้นขอบ
                className={`inline-block rounded-lg px-4 py-2 text-sm transition-colors ${
                  link.href.startsWith("mailto:")
                    ? "bg-accent text-bg hover:opacity-90"
                    : "border border-border hover:border-accent hover:text-accent"
                }`}
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

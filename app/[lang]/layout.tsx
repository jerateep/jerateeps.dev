import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Link from "next/link";
import "../globals.css";
import { locales, profile, type Locale } from "@/content/profile";
import { ui } from "@/content/ui";

const sansThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans-thai",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** เว็บเป็น static ทั้งหมด — สร้างล่วงหน้าทั้งสองภาษาตอน build */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const title = `${profile.name[lang]} — ${profile.role[lang]}`;
  const description = profile.tagline[lang];

  return {
    metadataBase: new URL("https://jerateeps.dev"),
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: { th: "/th", en: "/en" },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}`,
      siteName: profile.name[lang],
      locale: lang === "th" ? "th_TH" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const other: Locale = lang === "th" ? "en" : "th";

  return (
    <html
      lang={lang}
      className={`${sansThai.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="font-sans min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          {ui.skipToContent[lang]}
        </a>

        <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4 text-sm">
            <Link href={`/${lang}`} className="font-mono text-accent">
              jerateeps.dev
            </Link>
            <ul className="ml-auto hidden items-center gap-5 text-muted sm:flex">
              {(
                ["about", "experience", "projects", "ai", "contact"] as const
              ).map(
                (key) => (
                  <li key={key}>
                    <a href={`#${key}`} className="transition-colors hover:text-fg">
                      {ui.nav[key][lang]}
                    </a>
                  </li>
                ),
              )}
            </ul>
            <Link
              href={`/${other}`}
              hrefLang={other}
              aria-label={ui.switchLangLabel[lang]}
              className="ml-auto rounded-full border border-border px-3 py-1 text-muted transition-colors hover:border-accent hover:text-accent sm:ml-0"
            >
              {ui.switchLang[lang]}
            </Link>
          </nav>
        </header>

        {children}

        <footer className="mt-auto border-t border-border/70">
          <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-muted">
            <p>
              © {new Date().getFullYear()} {profile.name[lang]} ·{" "}
              {ui.builtWith[lang]}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

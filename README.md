# jerateeps.dev

เว็บ resume / portfolio ส่วนตัว — Next.js 16 (App Router) + Tailwind CSS v4, สองภาษา TH/EN, deploy บน Vercel

## แก้เนื้อหา

เนื้อหาทั้งหมดอยู่ใน [content/profile.ts](content/profile.ts) ไฟล์เดียว — หน้าเว็บอ่านจากที่นั่น ไม่ต้องแตะ JSX

ทุกข้อความเป็นคู่ `{ th, en }` ถ้าเพิ่ม field ใหม่แล้วลืมใส่ภาษาใดภาษาหนึ่ง TypeScript จะฟ้องตอน build

| อยากแก้อะไร | แก้ที่ไหน |
| --- | --- |
| ชื่อ, ตำแหน่ง, tagline, ที่อยู่ | `profile.name` / `role` / `tagline` / `location` |
| ประวัติทำงาน | `profile.experience[]` (มี template comment ไว้ให้คัดลอก) |
| ผลงาน | `profile.projects[]` |
| ทักษะ | `profile.skills[]` |
| ลิงก์ติดต่อ | `profile.links[]` |
| หัวข้อ/ปุ่มของ UI | [content/ui.ts](content/ui.ts) |
| สีของเว็บ | ตัวแปร CSS ด้านบนของ [app/globals.css](app/globals.css) |

### ข้อควรระวังเรื่อง PDPA

รายละเอียดเต็มอยู่หัวไฟล์ `content/profile.ts` สรุปสั้น ๆ:

- ห้ามใส่ชื่อ/อีเมล/เบอร์ของคนอื่น
- ระบบภายในบริษัท ตั้ง `confidential: true` แล้วใช้ชื่อกลาง ๆ — หน้าเว็บจะขึ้น badge "ระบบภายในองค์กร" ให้เอง
- ภาพหน้าจอระบบภายในห้ามขึ้นเว็บ เว้นแต่เบลอจนไม่เหลือข้อมูลจริง
- ตัวเลข impact ใช้แบบสัมพัทธ์ (`ลดเวลา ~70%`) ไม่ใช่ยอดจริงของบริษัท

## รันในเครื่อง

```bash
npm install
npm run dev     # http://localhost:3000 → redirect ไป /th
npm run build   # ตรวจ TypeScript + prerender ทั้งสองภาษา
npm run lint
```

## โครงสร้าง

```
app/
  [lang]/           ทุกหน้าอยู่ใต้ /th และ /en (prerender ตอน build)
    layout.tsx      html shell, header, ปุ่มสลับภาษา, footer, metadata
    page.tsx        หน้าเดียวจบ — hero / about / experience / projects / skills / contact
  globals.css       สี ฟอนต์ และ base style
  sitemap.ts        sitemap พร้อม hreflang
  robots.ts
content/
  profile.ts        ข้อมูลตัวตนทั้งหมด (แก้ที่นี่)
  ui.ts             ข้อความของ UI
```

เพิ่มภาษา: เติมเข้า `locales` ใน `content/profile.ts` แล้วไล่เติมข้อความตามที่ TypeScript ฟ้อง

## Deploy (Vercel)

1. vercel.com → Add New Project → import repo นี้
2. ไม่ต้องตั้งค่าอะไร Vercel ตรวจเจอ Next.js เอง (ไม่มี env var ที่ต้องใส่)
3. ผูกโดเมน `jerateeps.dev` ที่ Settings → Domains แล้วตั้ง DNS ตามที่ Vercel บอก

push เข้า `main` = deploy production, push branch อื่น = preview URL

ถ้าเปลี่ยนโดเมน ต้องแก้ `metadataBase` ใน `app/[lang]/layout.tsx` และ URL ใน `app/sitemap.ts` / `app/robots.ts` ด้วย

## CI / SonarCloud

[.github/workflows/ci.yml](.github/workflows/ci.yml) รัน `lint` + `build` ทุก push เข้า main และทุก PR

ส่วน SonarCloud จะข้ามไปเงียบ ๆ จนกว่าจะตั้งค่าครบ:

1. sonarcloud.io → เข้าด้วย GitHub → Analyze new project → เลือก repo นี้
2. ตั้ง Analysis Method เป็น **CI-based** (ไม่ใช่ Automatic) ไม่งั้นมันจะไม่อ่าน workflow
3. copy token ไปใส่ที่ repo → Settings → Secrets and variables → Actions → ชื่อ `SONAR_TOKEN`
4. เช็คว่า `sonar.projectKey` / `sonar.organization` ใน [sonar-project.properties](sonar-project.properties) ตรงกับที่ SonarCloud สร้างให้

## กันคนอื่นมาแก้

Sonar เป็นตัวตรวจคุณภาพโค้ด ไม่ได้กันสิทธิ์ ถ้า repo เป็น public ให้เปิด branch protection ที่
Settings → Branches → Add rule บน `main`: require PR before merging + require status check `build`

คนนอกจะ push ตรงไม่ได้อยู่แล้ว ทำได้แค่เปิด PR ซึ่ง merge ไม่ได้ถ้าเราไม่กด

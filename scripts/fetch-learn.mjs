/**
 * ดึงรายการ achievement จาก Microsoft Learn มาเก็บเป็น content/learn.json
 *
 * หน้าโปรไฟล์ของ Microsoft Learn render ฝั่ง client และตั้ง noindex
 * ดึงจาก HTML จึงไม่ได้อะไร แต่มี API สาธารณะสองชั้นที่ใช้ได้:
 *   1. /api/profiles/<handle>            → ได้ userId
 *   2. /api/achievements/user/<userId>   → ได้รายการทั้งหมด
 *
 * เก็บเฉพาะชื่อกับหมวด — ตัด userId, avatar url และ id ของแต่ละใบทิ้ง
 * เพราะเว็บไม่ได้ใช้ และไม่มีเหตุผลให้ค่าพวกนั้นไปอยู่ใน repo สาธารณะ
 *
 * รันมือเมื่ออยากอัปเดต:  node scripts/fetch-learn.mjs <handle>
 * ไม่ผูกกับ build เพราะไม่อยากให้เว็บ build ไม่ผ่านเวลา API ของคนอื่นล่ม
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const handle = process.argv[2] ?? "jerateepsaelee-4053";
const BASE = "https://learn.microsoft.com/api";

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
};

const profile = await get(`${BASE}/profiles/${handle}`);
if (profile.isPrivate) {
  console.error("โปรไฟล์ตั้งเป็นส่วนตัว — ดึงรายการไม่ได้");
  process.exit(1);
}

const { achievements = [] } = await get(
  `${BASE}/achievements/user/${profile.userId}`,
);

const titlesOf = (category) =>
  achievements
    .filter((a) => a.category === category)
    .map((a) => a.title)
    .sort((a, b) => a.localeCompare(b));

const out = {
  _comment:
    "สร้างโดย scripts/fetch-learn.mjs — เก็บแค่ชื่อกับจำนวน ไม่มี userId หรือ url ของรูป",
  total: achievements.length,
  counts: {
    courses: achievements.filter((a) => a.category === "courses").length,
    learningPaths: achievements.filter((a) => a.category === "learningpaths")
      .length,
    modules: achievements.filter((a) => a.category === "modules").length,
  },
  courses: titlesOf("courses"),
  learningPaths: titlesOf("learningpaths"),
};

writeFileSync(
  join(process.cwd(), "content", "learn.json"),
  JSON.stringify(out, null, 1),
);

console.log(
  `learn.json: ${out.total} achievements — ${out.counts.courses} courses, ` +
    `${out.counts.learningPaths} learning paths, ${out.counts.modules} modules`,
);

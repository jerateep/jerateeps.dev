// สร้าง public/Jerateep-Saelee-Resume.pdf จากหน้า /en/resume ด้วย Chrome/Edge headless ที่มีในเครื่อง
// ต้องเปิด server ไว้ก่อน (npm run dev หรือ build+start) แล้วรัน: npm run resume:pdf [-- http://localhost:3000]
// รันใหม่ทุกครั้งที่แก้ profile.ts — PDF เป็นไฟล์ static ที่ commit ไว้ ไม่ได้สร้างตอน build บน Vercel
// ponytail: ใช้ browser ในเครื่องแทน puppeteer เพื่อไม่เพิ่ม dependency — เครื่องอื่นตั้ง CHROME=<path> เอง
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => p && existsSync(p));
if (!browser) throw new Error("Chrome/Edge not found — set CHROME=<path to browser>");

const out = resolve("public/Jerateep-Saelee-Resume.pdf");
execFileSync(browser, [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=5000", // รอฟอนต์โหลดครบก่อนพิมพ์
  `--print-to-pdf=${out}`,
  `${base}/en/resume`,
], { stdio: "ignore" });
console.log(`${out}  ${(statSync(out).size / 1024).toFixed(0)} KB`);

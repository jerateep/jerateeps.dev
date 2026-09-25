import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // ทุกหน้าอยู่ใต้ /th และ /en — เข้า root ให้เด้งไปภาษาเริ่มต้น
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // สั่งให้ Next.js ข้ามการบีบอัดแพ็กเกจเหล่านี้
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-extra",
    "puppeteer-extra-plugin-stealth",
  ],
};

export default nextConfig;

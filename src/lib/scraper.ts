import puppeteer from "puppeteer-extra";
// ใช้ require แทน import เพื่อหลบเลี่ยงบั๊กของ Next.js Turbopack
// eslint-disable-next-line @typescript-eslint/no-require-imports
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

export async function scrapeShopee(url: string) {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium", // ใช้สำหรับ Arch Linux โดยเฉพาะ
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    await page.setViewport({ width: 1280, height: 800 });

    // โหลดหน้าเว็บ
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // รอให้ React ฝั่ง Shopee โหลดเสร็จนิดนึง
    await new Promise((r) => setTimeout(r, 5000));

    // เลื่อนจอลงเพื่อกระตุ้นให้เว็บโหลดรูป
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= 2000) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    const productData = await page.evaluate(() => {
      // 1. หาชื่อสินค้าจาก SEO Meta Tags (ชัวร์และแม่นยำกว่าดึงจาก HTML ธรรมดา)
      const ogTitle = document.querySelector('meta[property="og:title"]');
      let title = ogTitle ? ogTitle.getAttribute("content") : "";

      if (!title) {
        const titleTag = document.querySelector("title");
        title = titleTag
          ? titleTag.innerText.replace(" | Shopee Thailand", "").trim()
          : "ไม่พบชื่อสินค้า";
      }

      const images: string[] = [];

      // 2. ดึงรูปภาพจาก SEO (ดึงภาพปกหลักมาได้ 100% แน่นอน)
      const metaImg = document.querySelector('meta[property="og:image"]');
      if (metaImg && metaImg.getAttribute("content")) {
        images.push(metaImg.getAttribute("content") as string);
      }

      // 3. กวาดรูปอื่นๆ เพิ่มเติมจากหน้าเว็บ
      const imgElements = document.querySelectorAll("img");
      imgElements.forEach((img) => {
        const src = img.getAttribute("src");
        // กรองเอาเฉพาะรูปสินค้า ไม่เอาพวกไอคอนหรือโลโก้เว็บ
        if (
          src &&
          src.includes("http") &&
          !src.includes("icon") &&
          !src.includes("logo") &&
          !images.includes(src)
        ) {
          images.push(src);
        }
      });

      return { title: title || "ไม่พบชื่อสินค้า", images };
    });

    await browser.close();
    return productData;
  } catch (error) {
    await browser.close();
    console.error("Scrape Error:", error);
    throw error;
  }
}

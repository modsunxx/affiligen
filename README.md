# 🎬 AffiliGen (Affiliate Video Generator)

**AffiliGen** คือ "ผู้กำกับ AI ส่วนตัว" ที่ช่วยคุณสร้างสคริปต์วิดีโอป้ายยาสินค้า (Shopee / TikTok) แบบอัตโนมัติรวดเดียวจบ เพียงแค่แปะลิงก์สินค้า ระบบจะทำการดึงข้อมูลและใช้ AI แต่งบทพูดให้อย่างตรงจุด ประหยัดเวลาคิดคอนเทนต์ไปได้มหาศาล!

---

## ✨ Features (ฟีเจอร์เด่น)

- 🤖 **AI Script Generation:** ขับเคลื่อนด้วย **Gemini 2.5 Pro / Flash** คิดสคริปต์วิดีโอให้ครบชุด (Hook, บทพูดเนื้อหา, Call to Action, และข้อความ Overlay)
- 🕷️ **Smart Shopee Scraper:** มีหุ่นยนต์ (Puppeteer Stealth) วิ่งไปดึงข้อมูลชื่อสินค้าและรูปภาพจากลิงก์ Shopee ให้โดยอัตโนมัติ
- 🎭 **Character Prompting:** สามารถบรีฟคาแรคเตอร์ตัวละครผู้นำเสนอได้ตามใจชอบ (ค่าเริ่มต้น: สาวน้อยผมสั้นสไตล์ V-Tuber น่ารักสดใส)
- 🎛️ **Customizable Settings:** ปรับแต่งสไตล์วิดีโอ (ป้ายยาเนียนๆ, แกะกล่อง, เล่าเรื่อง) และแนวเรื่อง (รีวิวใช้งานจริง, ฮาร์ดเซลส์, แก้ปัญหา) ได้ตามแคมเปญ
- 🎨 **Muji Minimalist UI:** ออกแบบหน้าตาเว็บให้คลีน สบายตา ใช้งานง่าย

---

## 🛠️ Tech Stack (เทคโนโลยีที่ใช้)

- **Framework:** [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **AI Provider:** `@google/generative-ai` (Gemini API)
- **Web Scraping:** `puppeteer`, `puppeteer-extra`, `puppeteer-extra-plugin-stealth`

---

## 🚀 Getting Started (วิธีติดตั้งและใช้งาน)

### 1. Requirements

- Node.js (เวอร์ชัน 18 ขึ้นไป)
- เบราว์เซอร์ Chromium / Chrome (สำหรับ Puppeteer)

### 2. Installation

โคลนโปรเจกต์ลงมาที่เครื่องและติดตั้งแพ็กเกจ:

git clone https://github.com/YOUR_USERNAME/affiligen.git
cd affiligen
npm install

### 3. Environment Variables (.env)

สร้างไฟล์ `.env` ไว้ที่โฟลเดอร์นอกสุดของโปรเจกต์ (ระดับเดียวกับ `package.json`) และใส่ API Key ของ Gemini:

GEMINI*API_KEY="ใส่_API_KEY*ของคุณที่นี่"

_(สามารถรับ API Key ได้ฟรีที่ [Google AI Studio](https://aistudio.google.com/))_

### 4. Run the Development Server

เริ่มการทำงานของเซิร์ฟเวอร์:

npm run dev

เปิดเบราว์เซอร์ไปที่ http://localhost:3000 เพื่อเริ่มใช้งาน AffiliGen!

---

## ⚠️ Notes for Linux (Arch) Users

หากคุณรันโปรเจกต์นี้บน Linux (เช่น Arch Linux) และพบปัญหา Puppeteer หาเบราว์เซอร์ไม่เจอ คุณอาจต้องตรวจสอบ Path ของ Chromium ในไฟล์ `src/lib/scraper.ts`:

// src/lib/scraper.ts
const browser = await puppeteer.launch({
executablePath: '/usr/bin/chromium', // เปลี่ยน Path ให้ตรงกับเครื่องของคุณ
// ...
});

---

**Designed & Developed by Adipa (Sunny)** ☀️

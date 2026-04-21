import { NextResponse } from "next/server";
import { scrapeShopee } from "../../../lib/scraper";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "ไม่พบ URL" }, { status: 400 });
    }

    if (!url.includes("shopee")) {
      return NextResponse.json(
        { error: "กรุณาใส่ลิงก์ของ Shopee เท่านั้น" },
        { status: 400 },
      );
    }

    // เรียกหุ่นยนต์ไปดูดข้อมูล
    const data = await scrapeShopee(url);

    return NextResponse.json({
      status: "success",
      message: "ดึงข้อมูลสำเร็จ!",
      product: {
        title: data.title,
        totalImagesFound: data.images.length,
        images: data.images,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "ระบบไม่สามารถดึงข้อมูลได้ โปรดเช็กลิงก์อีกครั้ง" },
      { status: 500 },
    );
  }
}

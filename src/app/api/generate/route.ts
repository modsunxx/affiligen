import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productData,
      videoStyle,
      storyTheme,
      aiProvider,
      keywords,
      characterPrompt,
    } = body;

    if (!productData) {
      return NextResponse.json({ error: "ไม่มีข้อมูลสินค้า" }, { status: 400 });
    }

    // 💡 อัปเกรดเป็น 2.5 เพราะ Google ยกเลิก 1.5 ไปแล้วครับ
    const modelName =
      aiProvider === "gemini_1_5_flash" ? "gemini-2.5-flash" : "gemini-2.5-pro";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
    คุณคือผู้กำกับและนักเขียนสคริปต์มือทองสำหรับทำคลิป Shopee Video และ TikTok
    จงเขียนสคริปต์วิดีโอป้ายยาสินค้าความยาวประมาณ 15-30 วินาที โดยใช้ข้อมูลต่อไปนี้:
    
    1. ชื่อสินค้า: ${productData.title}
    2. คีย์เวิร์ด/จุดเด่น: ${keywords || "ไม่มีการระบุ (ให้วิเคราะห์จากชื่อสินค้าเอง)"}
    3. สไตล์ของวิดีโอ: ${videoStyle}
    4. แนวเรื่อง: ${storyTheme}
    5. บรีฟคาแรคเตอร์ตัวละครในคลิป: ${characterPrompt}

    ข้อกำหนดสำคัญ: 
    - น้ำเสียงและภาษาที่ใช้พูด ต้องสวมบทบาทตาม "บรีฟคาแรคเตอร์ตัวละคร" อย่างเคร่งครัด
    - ตอบกลับมาเป็น JSON Format เท่านั้น โดยใช้โครงสร้างดังนี้:
    {
      "hook": "ข้อความดึงดูดความสนใจใน 3 วินาทีแรก (สั้น กระชับ)",
      "body": "บทพูดเนื้อหาหลักที่ป้ายยาสินค้า",
      "callToAction": "ประโยคฮุกตอนท้ายที่กระตุ้นให้กดสั่งซื้อที่ตะกร้า",
      "overlays": ["คำสั้นๆ สำหรับแปะคลิป 1", "คำสั้นๆ สำหรับแปะคลิป 2"]
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    const cleanText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const scriptData = JSON.parse(cleanText);

    return NextResponse.json({
      status: "success",
      script: scriptData,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    // ตรวจสอบ Error ให้ปลอดภัยแบบ TypeScript
    const errorMessage =
      error instanceof Error
        ? error.message
        : "เกิดข้อผิดพลาดในการสร้างสคริปต์ด้วย AI";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

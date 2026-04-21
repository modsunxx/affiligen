"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Settings,
  ArrowLeft,
  Clapperboard,
  ChevronDown,
  Diamond,
  Book,
  Wand2,
  Play,
  Home as HomeIcon,
  Sparkles,
  Send,
  Zap,
  MonitorPlay,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Construction,
  UserCircle,
  FileText,
  Check,
} from "lucide-react";

const colors = {
  red: "#7f0019",
  bg: "#faf7eb",
  cardBg: "#ffffff",
  textDark: "#666666",
  textLight: "#999999",
  border: "#e5e5e5",
};

type ProductData = {
  title: string;
  totalImagesFound: number;
  images: string[];
};
type LogEntry = {
  time: string;
  message: string;
  type: "info" | "success" | "error" | "loading";
};
type GeneratedScript = {
  hook: string;
  body: string;
  callToAction: string;
  overlays: string[];
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("series");
  const [contextMode, setContextMode] = useState("normal");

  const [videoStyle, setVideoStyle] = useState("ป้ายยาเนียนๆ");
  const [storyTheme, setStoryTheme] = useState("รีวิวใช้งานจริง");
  const [aiProvider, setAiProvider] = useState("gemini_1_5_pro");

  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [characterPrompt, setCharacterPrompt] = useState(
    "3D animated young girl character, short wavy auburn hair with bangs, cheerful and energetic expression, casual oversized hoodie with a stylized logo, modern bedroom studio background, bright soft lighting, looking directly at the camera with a big smile and talkative hand gestures, V-Tube character style, stylized animation, vibrant yet soft colors.",
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);

  // เพิ่ม State สำหรับเก็บสคริปต์ที่ Gemini เขียนเสร็จ
  const [generatedScript, setGeneratedScript] =
    useState<GeneratedScript | null>(null);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogs([
      {
        time: new Date().toLocaleTimeString("th-TH"),
        message: "ระบบ AffiliGen พร้อมทำงาน",
        type: "success",
      },
    ]);
  }, []);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString("th-TH"), message, type },
    ]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleStartProcess = async () => {
    if (!url) {
      addLog("กรุณาใส่ลิงก์ Shopee ก่อนเริ่มทำงาน", "error");
      return;
    }

    setIsProcessing(true);
    setProductData(null);
    setGeneratedScript(null);

    addLog(`เริ่มต้นกระบวนการสูบข้อมูล...`, "info");
    addLog(`กำลังเรียกบอทไปดึงข้อมูลจาก Shopee...`, "loading");

    try {
      // 1. ดึงข้อมูลสินค้า
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const scrapeData = await scrapeRes.json();

      if (!scrapeRes.ok) {
        addLog(`Scrape Error: ${scrapeData.error}`, "error");
        setIsProcessing(false);
        return;
      }

      addLog(
        `ดึงข้อมูลสำเร็จ! พบรูปภาพ ${scrapeData.product.totalImagesFound} รูป`,
        "success",
      );
      addLog(
        `ชื่อสินค้า: ${scrapeData.product.title.substring(0, 30)}...`,
        "info",
      );
      setProductData(scrapeData.product);

      // 2. เรียก Gemini ให้เขียนสคริปต์
      const modelDisplayName =
        aiProvider === "gemini_1_5_flash"
          ? "Gemini 1.5 Flash"
          : "Gemini 1.5 Pro";
      addLog(
        `กำลังส่งบรีฟตัวละครไปให้ ${modelDisplayName} เขียนสคริปต์...`,
        "loading",
      );

      const aiRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productData: scrapeData.product,
          videoStyle,
          storyTheme,
          aiProvider,
          keywords,
          characterPrompt,
        }),
      });

      const aiData = await aiRes.json();

      if (aiRes.ok) {
        addLog(`✅ AI เขียนสคริปต์เสร็จสมบูรณ์!`, "success");
        setGeneratedScript(aiData.script);
      } else {
        addLog(`AI Error: ${aiData.error}`, "error");
      }
    } catch (error) {
      console.error("Process Error:", error);
      addLog(`เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const navItems = [
    { id: "home", icon: HomeIcon, label: "หน้าหลัก" },
    { id: "auto", icon: Sparkles, label: "Auto" },
    { id: "tiktok", icon: Send, label: "Shopee/TK" },
    { id: "turbo", icon: Zap, label: "Turbo" },
    { id: "series", icon: MonitorPlay, label: "Series" },
  ];

  return (
    <main
      className="min-h-screen flex flex-col font-sans text-[15px] transition-colors duration-300"
      style={{ backgroundColor: colors.bg, color: colors.textDark }}
    >
      {/* Navbar เหมือนเดิม */}
      <nav
        className="sticky top-0 z-50 shadow-sm border-b transition-all"
        style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: colors.red }}
            >
              A
            </div>
            <span className="font-semibold text-lg tracking-tight">
              AffiliGen
            </span>
          </div>
          <div className="hidden md:flex h-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative h-full px-5 flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <item.icon
                  size={18}
                  style={{
                    color:
                      activeTab === item.id ? colors.red : colors.textLight,
                  }}
                />
                <span
                  className="font-medium transition-colors"
                  style={{
                    color:
                      activeTab === item.id ? colors.red : colors.textLight,
                  }}
                >
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-0.5 rounded-t-sm"
                    style={{ backgroundColor: colors.red }}
                  />
                )}
              </button>
            ))}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <Settings size={20} style={{ color: colors.textLight }} />
          </button>
        </div>
      </nav>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-500">
        {activeTab === "series" && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:bg-white rounded-full transition-colors border cursor-pointer"
                  style={{ borderColor: colors.border }}
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: colors.red }}
                    >
                      <Clapperboard size={14} color="white" />
                      <span className="text-white font-medium text-xs tracking-wide">
                        SERIES MODE
                      </span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    สร้างคลิป Shopee อัตโนมัติ
                  </h1>
                </div>
              </div>
              <div className="hidden md:flex gap-3">
                <button
                  className="px-5 py-2.5 rounded-lg border font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                  style={{ borderColor: colors.border }}
                >
                  บันทึกฉบับร่าง
                </button>
                <button
                  onClick={handleStartProcess}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-lg flex items-center gap-2 text-white font-medium shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: colors.red }}
                >
                  {isProcessing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                  {isProcessing ? "กำลังทำงาน..." : "เริ่มสร้างคลิป"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20 md:pb-0">
              {/* --- Left Column: Settings --- */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. กล่องแสดงผลสคริปต์จาก AI (จะโชว์ก็ต่อเมื่อมีข้อมูล) */}
                {generatedScript && (
                  <section
                    className="rounded-xl border p-6 shadow-md bg-white animate-in slide-in-from-top-4 duration-500"
                    style={{ borderColor: colors.red }}
                  >
                    <div
                      className="flex items-center gap-2 mb-5 border-b pb-4"
                      style={{ borderColor: colors.border }}
                    >
                      <FileText size={20} style={{ color: colors.red }} />
                      <h2 className="text-lg font-semibold text-gray-800">
                        สคริปต์จาก Gemini
                      </h2>
                      <span className="ml-auto text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full font-medium flex items-center gap-1">
                        <Check size={12} /> พร้อมใช้งาน
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          💡 3 วินาทีแรก (Hook)
                        </label>
                        <div
                          className="p-3 bg-gray-50 rounded-lg border text-sm font-medium text-gray-800"
                          style={{ borderColor: colors.border }}
                        >
                          {generatedScript.hook}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          💬 บทพูด (Body)
                        </label>
                        <div
                          className="p-3 bg-gray-50 rounded-lg border text-sm text-gray-700 whitespace-pre-wrap leading-relaxed"
                          style={{ borderColor: colors.border }}
                        >
                          {generatedScript.body}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          🛒 ปิดท้าย (Call to action)
                        </label>
                        <div
                          className="p-3 bg-gray-50 rounded-lg border text-sm font-medium text-red-600"
                          style={{ borderColor: colors.border }}
                        >
                          {generatedScript.callToAction}
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          🏷️ ข้อความแปะคลิป (Overlays)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {generatedScript.overlays.map((text, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-gray-100 border rounded-md text-xs font-medium text-gray-600"
                              style={{ borderColor: colors.border }}
                            >
                              {text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* 2. ตั้งค่า Series */}
                <section
                  className={`rounded-xl border p-6 bg-white transition-all ${generatedScript ? "shadow-sm opacity-60" : "shadow-sm"}`}
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Settings size={20} style={{ color: colors.textLight }} />
                    <h2 className="text-lg font-semibold text-gray-800">
                      ตั้งค่า Series
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        สไตล์วิดีโอ
                      </label>
                      <div className="relative">
                        <select
                          value={videoStyle}
                          onChange={(e) => setVideoStyle(e.target.value)}
                          className="w-full appearance-none p-3 rounded-lg border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7f0019] focus:ring-opacity-20 cursor-pointer font-medium bg-white transition-all text-gray-700"
                          style={{ borderColor: colors.border }}
                        >
                          <option value="ป้ายยาเนียนๆ">✨ ป้ายยาเนียนๆ</option>
                          <option value="แกะกล่องโชว์ของ">
                            📦 แกะกล่องโชว์ของ
                          </option>
                          <option value="เล่าเรื่องน่าสนใจ">
                            📚 เล่าเรื่องน่าสนใจ
                          </option>
                        </select>
                        <ChevronDown
                          size={16}
                          style={{ color: colors.textLight }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        แนวเรื่อง
                      </label>
                      <div className="relative">
                        <select
                          value={storyTheme}
                          onChange={(e) => setStoryTheme(e.target.value)}
                          className="w-full appearance-none p-3 rounded-lg border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7f0019] focus:ring-opacity-20 cursor-pointer font-medium bg-white transition-all text-gray-700"
                          style={{ borderColor: colors.border }}
                        >
                          <option value="รีวิวใช้งานจริง">
                            💬 รีวิวใช้งานจริง
                          </option>
                          <option value="อวยยศสุดพลัง">🔥 อวยยศสุดพลัง</option>
                          <option value="แก้ปัญหาชีวิตประจำวัน">
                            💡 แก้ปัญหาชีวิตประจำวัน
                          </option>
                        </select>
                        <ChevronDown
                          size={16}
                          style={{ color: colors.textLight }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        AI Provider
                      </label>
                      <div className="relative">
                        <Diamond
                          size={18}
                          className="text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                          fill="currentColor"
                        />
                        <select
                          value={aiProvider}
                          onChange={(e) => setAiProvider(e.target.value)}
                          className="w-full appearance-none p-3 pl-10 rounded-lg border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7f0019] focus:ring-opacity-20 cursor-pointer font-medium bg-white transition-all text-gray-700"
                          style={{ borderColor: colors.border }}
                        >
                          <option value="gemini_1_5_pro">
                            Gemini 2.5 Pro (ฉลาดสุด)
                          </option>
                          <option value="gemini_1_5_flash">
                            Gemini 2.5 Flash (รวดเร็ว)
                          </option>
                        </select>
                        <ChevronDown
                          size={16}
                          style={{ color: colors.textLight }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Context ของสินค้า */}
                <section
                  className={`rounded-xl border p-6 bg-white transition-all ${generatedScript ? "shadow-sm opacity-60" : "shadow-sm"}`}
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Book size={20} style={{ color: colors.textLight }} />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Context ของสินค้า
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        ลิงก์สินค้า (Shopee URL)
                      </label>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://shopee.co.th/..."
                        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#7f0019] focus:ring-opacity-20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        จุดเด่น / คีย์เวิร์ด (ไม่บังคับ)
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="เช่น: ส่งฟรี, ของแท้ 100%, เล็กกะทัดรัด"
                          className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#7f0019] focus:ring-opacity-20 transition-all"
                        />
                      </div>
                    </div>
                    <div
                      className="space-y-2 pt-2 border-t"
                      style={{ borderColor: colors.border }}
                    >
                      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 pt-2">
                        <UserCircle size={14} /> บรีฟตัวละคร (Character Prompt)
                      </label>
                      <textarea
                        value={characterPrompt}
                        onChange={(e) => setCharacterPrompt(e.target.value)}
                        rows={4}
                        className="w-full p-3 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#7f0019] focus:ring-opacity-20 transition-all resize-none text-gray-600 bg-gray-50"
                        style={{ borderColor: colors.border }}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* --- Right Column: Logs --- */}
              <div className="lg:col-span-5 h-150 sticky top-24">
                <section
                  className="rounded-xl border shadow-sm bg-white h-full flex flex-col overflow-hidden"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="flex items-center justify-between p-4 border-b bg-gray-50"
                    style={{ borderColor: colors.border }}
                  >
                    <span className="text-sm font-semibold tracking-wide text-gray-600">
                      📋 ACTIVITY LOGS
                    </span>
                    <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${isProcessing ? "bg-orange-500" : "bg-green-500"} animate-pulse`}
                      ></div>
                      {isProcessing ? "Processing" : "Ready"}
                    </span>
                  </div>
                  <div
                    className="flex-1 p-5 font-mono text-sm space-y-3 overflow-y-auto"
                    style={{ backgroundColor: "#1e1e1e", color: "#d4d4d4" }}
                  >
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-gray-500 whitespace-nowrap">
                          [{log.time}]
                        </span>
                        <span>
                          {log.type === "success" && (
                            <CheckCircle2
                              size={14}
                              className="inline text-green-400 mr-1 mb-0.5"
                            />
                          )}
                          {log.type === "error" && (
                            <AlertCircle
                              size={14}
                              className="inline text-red-400 mr-1 mb-0.5"
                            />
                          )}
                          {log.type === "loading" && (
                            <Loader2
                              size={14}
                              className={`inline text-orange-400 mr-1 mb-0.5 ${isProcessing ? "animate-spin" : ""}`}
                            />
                          )}
                          {log.type === "info" && (
                            <span className="text-blue-400 mr-1">ℹ</span>
                          )}
                          <span
                            className={
                              log.type === "error"
                                ? "text-red-400"
                                : log.type === "success"
                                  ? "text-green-300"
                                  : "text-white"
                            }
                          >
                            {log.message}
                          </span>
                        </span>
                      </div>
                    ))}
                    {isProcessing && (
                      <p className="text-gray-500 border-t border-gray-700 pt-3 mt-3 animate-pulse">
                        &gt; ระบบกำลังประมวลผล โปรดรอสักครู่...
                      </p>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {activeTab !== "series" && (
          <div className="flex flex-col items-center justify-center h-[60vh] opacity-60">
            <Construction
              size={64}
              style={{ color: colors.textLight }}
              className="mb-4 animate-bounce"
            />
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: colors.textDark }}
            >
              {navItems.find((item) => item.id === activeTab)?.label}
            </h2>
            <p style={{ color: colors.textLight }}>
              กำลังอยู่ระหว่างการพัฒนา รออัปเดตเร็วๆ นี้นะครับ!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

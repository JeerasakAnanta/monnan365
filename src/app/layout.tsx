import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollRestoration } from "@/components/ScrollRestoration";

const googleSans = localFont({
  src: [
    {
      path: "../../public/fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "มนต์น่าน 365 วัน",
  description:
    "สัมผัสธรรมชาติ วัฒนธรรม และวิถีชีวิตจังหวัดน่านด้วย AI Trip Planner ที่ช่วยวางแผนทริปให้เหมาะกับทุกเดือน",
  keywords: ["น่าน", "ท่องเที่ยวน่าน", "ดอยภูคา", "วัดภูมินทร์", "ไทลื้อ", "AI Trip Planner"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${googleSans.variable} h-full`}>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--nan-cream)",
          color: "var(--nan-ink)",
          fontFamily: "var(--font-google-sans), Arial, sans-serif",
        }}
      >
        <Navbar />
        <ScrollRestoration />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

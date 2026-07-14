import type { Metadata } from "next";
import { Sarabun, Noto_Sans_Thai } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollRestoration } from "@/components/ScrollRestoration";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans",
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

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
  title: "มนต์น่าน 365 วัน (MonNan365)",
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
    <html lang="th" className={`${sarabun.variable} ${notoSansThai.variable} ${googleSans.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Noto+Serif+Thai:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--nan-cream)",
          color: "var(--nan-ink)",
          fontFamily: "var(--font-google-sans), var(--font-noto-sans), var(--font-sarabun), 'Sarabun', sans-serif",
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

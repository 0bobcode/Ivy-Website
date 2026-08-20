import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sora = localFont({
  src: "./fonts/Sora-Variable.woff2",
  variable: "--font-sora",
  weight: "600 800",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "400 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IvySchool.ai — Ivy-League learning for the AI generation",
  description:
    "Live, mentor-led courses in AI, coding and entrepreneurship for students in grades 4–12 — plus placement pathways that connect learners to universities and careers worldwide.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-ink-700">
        {children}
      </body>
    </html>
  );
}

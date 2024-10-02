import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const ru_Hero = localFont({
  src: "./fonts/ofont.ru_Hero.ttf",
  variable: "--font-geist-hero",
  weight: "100 900",
});

const ru_Hero_b = localFont({
  src: "./fonts/ofont.ru_Hero_b.ttf",
  variable: "--font-geist-hero_b",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "My Notes App",
  description: "Application for storing notes with dark purple background",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ru_Hero.variable} ${ru_Hero_b.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

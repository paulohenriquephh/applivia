import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Applivia — Maestro AI Engine v3",
  description: "AI-powered automation platform with intelligent agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

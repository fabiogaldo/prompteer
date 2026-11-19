import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompteer",
  description: "Zero-friction, intention-based prompt generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

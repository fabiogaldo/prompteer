import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { i18n } from "@/i18n/en";
import "./globals.css";

export const metadata: Metadata = {
  title: `${i18n.app.name} — ${i18n.app.tagline}`,
  description: i18n.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

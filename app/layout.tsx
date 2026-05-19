import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aaspas | Badlapur Community App",
  description: "A mobile-first hyperlocal community MVP for Badlapur, Maharashtra."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

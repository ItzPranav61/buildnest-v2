import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildNest | Student Builder Opportunities",
  description: "A modern student builder opportunity board."
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

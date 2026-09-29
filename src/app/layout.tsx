import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

import Script from "next/script";

export const metadata: Metadata = {
  title: "Furnishara — Luxury Furniture, Delivered.",
  description:
    "Premium furniture for modern living — explore curated collections with AR visualization, white-glove delivery, and bespoke customization.",
  keywords: [
    "furniture",
    "luxury furniture",
    "sofas",
    "beds",
    "dining tables",
    "home decor",
    "interior design",
    "AR furniture",
    "white-glove delivery",
  ],
  openGraph: {
    title: "Furnishara — Luxury Furniture, Delivered.",
    description:
      "Premium furniture for modern living with AR room visualization and white-glove delivery.",
    type: "website",
    locale: "en_US",
    siteName: "Furnishara",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          type="module"
          strategy="lazyOnload"
        />
        <Header />
        <main className="flex-1 pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

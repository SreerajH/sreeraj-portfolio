import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sreerajh.com"),
  title: {
    default: "Sreeraj H — UI/UX Designer & Developer",
    template: "%s — Sreeraj H",
  },
  description:
    "Freelance UI/UX designer & developer based in Bengaluru, India. Crafting websites and mobile apps with motion, type, and detail.",
  openGraph: {
    title: "Sreeraj H — UI/UX Designer & Developer",
    description:
      "Freelance UI/UX designer & developer based in Bengaluru, India.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text font-sans">{children}</body>
    </html>
  );
}

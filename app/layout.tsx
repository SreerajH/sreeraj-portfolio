import type { Metadata } from "next";
import {
  Archivo_Black,
  Inter,
  Instrument_Serif,
  Kaushan_Script,
} from "next/font/google";
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

// Display face for the hero poster headline only.
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Brush script for the one hand-lettered word in the About copy.
const kaushanScript = Kaushan_Script({
  variable: "--font-kaushan",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sreerajh.com"),
  title: {
    default: "Sreeraj H | UI/UX Designer & Developer",
    template: "%s | Sreeraj H",
  },
  description:
    "Freelance UI/UX designer & developer based in Bengaluru, India. Crafting websites and mobile apps with motion, type, and detail.",
  openGraph: {
    title: "Sreeraj H | UI/UX Designer & Developer",
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
      className={`${inter.variable} ${instrumentSerif.variable} ${archivoBlack.variable} ${kaushanScript.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text font-sans">{children}</body>
    </html>
  );
}

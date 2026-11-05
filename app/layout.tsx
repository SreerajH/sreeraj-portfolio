import type { Metadata } from "next";
import {
  Anton,
  Archivo_Black,
  Inter,
  Kaushan_Script,
} from "next/font/google";
import "./globals.css";
import { LOADER_HEAD_SCRIPT } from "@/components/layout/site-loader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display face for the hero poster headline only.
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Tall condensed grotesk for the section display headings.
const anton = Anton({
  variable: "--font-anton",
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
    "UI/UX designer & developer based in Bengaluru, India. Designing and building websites and mobile apps with motion, type, and detail.",
  openGraph: {
    title: "Sreeraj H | UI/UX Designer & Developer",
    description:
      "UI/UX designer & developer based in Bengaluru, India.",
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
      // The head script below may add data-loader before React hydrates.
      suppressHydrationWarning
      className={`${inter.variable} ${archivoBlack.variable} ${kaushanScript.variable} ${anton.variable} h-full antialiased`}
    >
      <head>
        {/* Before first paint: decides whether the homepage loader shows. */}
        <script dangerouslySetInnerHTML={{ __html: LOADER_HEAD_SCRIPT }} />
      </head>
      <body className="min-h-full bg-bg text-text font-sans">
        {/* Without JavaScript the loader is skipped altogether. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: "<style>#site-loader{display:none}</style>",
          }}
        />
        {children}
      </body>
    </html>
  );
}

import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = "https://aliran.app";
const SITE_NAME = "Aliran";
const TITLE = "Aliran — Patungan subscription, tanpa drama";
const DESCRIPTION =
  "Lacak uangmu. Bot yang nagih temanmu. Tanpa drama. Aliran lacak subscription patungan-mu dan auto-tagih temanmu lewat bot Telegram.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "patungan subscription",
    "split bill subscription",
    "tagih teman otomatis",
    "bot telegram tagih",
    "lacak langganan bersama",
    "aliran",
    "split Netflix",
    "split Spotify",
  ],
  authors: [{ name: "Aliran", url: SITE_URL }],
  creator: "Aliran",
  publisher: "Aliran",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Aliran — Patungan subscription, tanpa drama",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
    creator: "@aliranid",
    site: "@aliranid",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}

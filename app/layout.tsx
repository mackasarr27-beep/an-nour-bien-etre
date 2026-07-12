import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AN NOUR BIEN-ÊTRE | Soins premium & bien-être",
    template: "%s | AN NOUR BIEN-ÊTRE",
  },
  description:
    "Découvrez AN NOUR BIEN-ÊTRE, votre espace premium de soins, bien-être et beauté avec une expérience moderne et élégante.",
  metadataBase: new URL("https://an-nour-bien-etre.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AN NOUR BIEN-ÊTRE",
    description: "Soins premium, bien-être et expérience moderne.",
    url: "https://an-nour-bien-etre.vercel.app",
    siteName: "AN NOUR BIEN-ÊTRE",
    type: "website",
    images: ["/Bannière.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AN NOUR BIEN-ÊTRE",
    description: "Soins premium, bien-être et expérience moderne.",
    images: ["/Bannière.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

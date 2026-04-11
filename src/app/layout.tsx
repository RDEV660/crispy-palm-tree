import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const siteDescription =
  "Snack carts, fresh aguas, baby shower character animations, and unforgettable parties in the Rio Grande Valley — message us on WhatsApp.";

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Ohana Events",
    template: "%s · Ohana Events",
  },
  description: siteDescription,
  applicationName: "Ohana Events",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ohana Events",
    title: "Ohana Events",
    description: siteDescription,
    images: [
      {
        url: "/ohana-logo-v2.png",
        width: 512,
        height: 512,
        alt: "Ohana Events logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ohana Events",
    description: siteDescription,
    images: ["/ohana-logo-v2.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

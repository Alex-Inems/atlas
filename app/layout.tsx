import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { AlertProvider } from "@/components/alerts/AlertProvider";
import SiteAlertBar from "@/components/alerts/SiteAlertBar";
import { MotionPreferenceProvider } from "@/providers/MotionPreferenceProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { localBusinessJsonLd, siteUrl } from "@/lib/seo/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={localBusinessJsonLd()} />
        <MotionPreferenceProvider>
          <AuthProvider>
            <AlertProvider>
              <Navigation />
              <Suspense fallback={null}>
                <SiteAlertBar />
              </Suspense>
              {children}
              <Footer />
            </AlertProvider>
          </AuthProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { MockAuthProvider } from "@/components/MockAuthProvider";
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
  title: "ZenType - Minimal Typing Practice",
  description: "Ultimate minimal typing practice web application focused on distraction-free typing improvement.",
  keywords: ["typing", "practice", "wpm", "keyboard", "minimal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const AuthProviderComponent = isDemoMode ? MockAuthProvider : AuthProvider;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProviderComponent>{children}</AuthProviderComponent>
      </body>
    </html>
  );
}

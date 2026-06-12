import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-ui-override",
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-num-override",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Fiche de Demande de Travaux — GHU Paris",
  description: "DITMP — GHU Paris Psychiatrie & Neurosciences",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" style={{
      "--font-ui": "var(--font-ui-override), system-ui, sans-serif",
      "--font-num": "var(--font-num-override), ui-monospace, monospace",
    } as React.CSSProperties}>
      <body className={`${plusJakarta.variable} ${dmMono.variable}`}>
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}

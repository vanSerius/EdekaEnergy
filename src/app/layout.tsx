import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import { UnitProvider } from "@/lib/units/context";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "EDEKA · Energie & Nachhaltigkeit",
  description:
    "Sensor-Daten, Trends und Markt-Vergleich für die EDEKA-Märkte. Energiebewusstsein im Alltag.",
  applicationName: "EDEKA Energie",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "EDEKA Energie",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <LanguageProvider>
          <UnitProvider>{children}</UnitProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/site/theme-provider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

/* Display serif, used only for accented words in headlines.
   Instrument Serif ships a single weight. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Keizoku UI — Components with staying power",
  description:
    "A React component library for interfaces that earn a second look. Built on Tailwind CSS v4, shipped as source you own.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // next-themes writes the class before paint, so the server markup
    // never matches — the warning is expected and suppressed here only.
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

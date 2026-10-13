import { DM_Sans, Plus_Jakarta_Sans, Outfit } from "next/font/google";

export const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const fontDisplay = DM_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontLogo = Outfit({
  subsets: ["latin"],
  variable: "--font-logo",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});


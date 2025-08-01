import { Geist, Geist_Mono, Fira_Code } from "next/font/google";
import "./globals.css";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

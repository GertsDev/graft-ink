import { Geist, Geist_Mono, Barrio } from "next/font/google";
import "./globals.css";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const barrio = Barrio({
  variable: "--font-barrio",
  weight: "400",
  subsets: ["latin"],
});

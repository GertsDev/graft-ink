import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { geistSans, geistMono } from "./fonts";
import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "./convex-client-provider";
import NavBar from "../shared/components/navbar/navbar";

export const metadata: Metadata = {
  title: "Graft ink.",
  description: "Minimalist task management app.",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <NavBar />
              <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

import TRPCProvider from "@/trpc/TRPCPRovider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Viewport } from "next";
import { DM_Serif_Display } from "next/font/google";

import { cn } from "@qavite/ui";
import { ThemeProvider } from "@qavite/ui/theme";
import { Toaster } from "@qavite/ui/toast";

import "@/app/globals.css";

// export const metadata: Metadata = {
//   metadataBase: new URL(
//     process.env.VERCEL_ENV === "production"
//       ? "https://turbo.t3.gg"
//       : "http://localhost:3000",
//   ),
//   title: "Create T3 Turbo",
//   description: "Simple monorepo with shared backend for web & mobile apps",
//   openGraph: {
//     title: "Create T3 Turbo",
//     description: "Simple monorepo with shared backend for web & mobile apps",
//     url: "https://create-t3-turbo.vercel.app",
//     siteName: "Create T3 Turbo",
//   },
//   twitter: {
//     card: "summary_large_image",
//     site: "@jullerino",
//     creator: "@jullerino",
//   },
// };

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const DMSerif = DM_Serif_Display({
  weight: ["400"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
          DMSerif.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCProvider>{props.children}</TRPCProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import Script from "next/script"

import { cn } from "@/lib/utils"
import { Geist_Mono, Inter } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/providers/ui/theme-provider"
import { DirectionProvider } from "@/providers/ui/direction-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

import "@/app/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body>
        <ThemeProvider defaultTheme="light">
          <DirectionProvider dir="ltr">
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

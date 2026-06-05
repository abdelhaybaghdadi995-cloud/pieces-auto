import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pièces Auto — Gestion Clients & Ventes",
  description: "Application de gestion de pièces détachées automobiles avec système Speed-Code",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-bg text-txt">
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  )
}

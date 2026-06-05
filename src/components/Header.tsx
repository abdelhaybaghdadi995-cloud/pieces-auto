"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header className="bg-gradient-to-r from-blue-700 to-sky-500 px-4 py-4 flex items-center gap-3 flex-wrap">
      <Link href="/" className="flex items-center gap-3 no-underline">
        <span className="text-3xl">🔧</span>
        <div>
          <h1 className="text-lg font-bold text-white m-0">Pièces Auto</h1>
          {isHome && <p className="text-blue-100 text-xs">Speed-Code System</p>}
        </div>
      </Link>
    </header>
  )
}

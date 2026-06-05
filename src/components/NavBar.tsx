"use client"

import { useRouter, usePathname } from "next/navigation"

const tabs = [
  { href: "/", label: "🏠 Speed-Code", key: "home" },
  { href: "/clients", label: "👤 Clients", key: "clients" },
  { href: "/sales", label: "🛒 Ventes", key: "sales" },
  { href: "/catalog", label: "📦 Catalogue", key: "catalog" },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 flex-wrap px-4 py-3">
      {tabs.map((t) => (
        <a
          key={t.key}
          href={t.href}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            (t.key === "home" ? pathname === "/" : pathname.startsWith(t.href))
              ? "bg-acc text-white"
              : "bg-panel text-txt border border-line hover:bg-panel2"
          }`}
        >
          {t.label}
        </a>
      ))}
    </nav>
  )
}

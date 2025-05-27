"use client"

import { Phone, MessageSquare, Settings, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Phone, label: "Dialer" },
    { href: "/soundboard", icon: MessageSquare, label: "Phrases" },
    { href: "/history", icon: History, label: "History" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around py-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <Button
                variant={pathname === href ? "default" : "ghost"}
                size="sm"
                className="flex flex-col h-auto py-2 px-3"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

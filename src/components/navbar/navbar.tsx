// src/components/navbar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"

const routes = [
  {
    href: "/",
    label: "Acasă",
  },
  {
    href: "/lectii",
    label: "Lecții",
  },
  {
    href: "/quiz",
    label: "Quiz-uri",
  },
  {
    href: "/despre",
    label: "Despre",
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              MediLearn
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={pathname === route.href ? "text-foreground" : "text-foreground/60 transition-colors hover:text-foreground"}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Comutare Meniu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search functionality here if needed */}
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {isSignedIn ? (
              <UserButton/>
            ) : (
              <SignInButton>
                <Button variant="secondary">Conectare</Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <div className="flex flex-col space-y-3 p-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`${
            pathname === route.href ? "text-foreground" : "text-foreground/60"
          } transition-colors hover:text-foreground`}
        >
          {route.label}
        </Link>
      ))}
      {!isSignedIn && (
        <SignInButton mode="modal">
          <Button variant="secondary" className="w-full">Conectare</Button>
        </SignInButton>
      )}
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, Menu, UserCircle } from "lucide-react"
import { getDashboardPath, getStoredUser } from "@/lib/client-session"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [sessionState, setSessionState] = useState({
    isLoggedIn: false,
    isSeller: false,
    isAdmin: false,
    dashboardPath: "/browse-deals",
  })

  useEffect(() => {
    const user = getStoredUser()

    if (!user) {
      setSessionState({
        isLoggedIn: false,
        isSeller: false,
        isAdmin: false,
        dashboardPath: "/browse-deals",
      })
      return
    }

    setSessionState({
      isLoggedIn: true,
      isSeller: user.role === "SELLER",
      isAdmin: user.role === "ADMIN",
      dashboardPath: getDashboardPath(user),
    })
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const { isLoggedIn, isSeller, isAdmin, dashboardPath } = sessionState

  const navLinks = [
    { href: "/how-it-works", label: "How it works" },
    { href: "/browse-deals", label: "Browse Deals" },
    { href: "/partner-with-us", label: "For sellers" },
    { href: "/about", label: "About" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4">
      <div
        className={`page-shell premium-nav transition-all duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
          isScrolled
            ? "translate-y-0 rounded-[1.85rem] border border-[var(--border-inverse)] bg-[rgba(69,21,35,0.86)] shadow-[var(--shadow-lg)]"
            : "rounded-[1.6rem] border border-[rgba(255,247,241,0.08)] bg-[rgba(69,21,35,0.74)] shadow-[0_18px_50px_rgba(72,34,43,0.18)]"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-5 md:px-7">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] border border-white/10 bg-[linear-gradient(145deg,#f1d9dc,#c2868c)] text-[var(--brand-strong)] shadow-[0_12px_30px_rgba(27,10,16,0.2)]">
                <span className="text-sm font-extrabold tracking-[0.2em]">FS</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-[0.32em] text-[var(--text-inverse-muted)]">Bangladesh</span>
                <span className="text-lg font-extrabold tracking-[var(--tracking-heading)] text-[var(--text-inverse)]">FoodSaver</span>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-premium)] ${
                      isActive
                        ? "bg-white/10 text-[var(--accent-soft)]"
                        : "text-[var(--text-inverse-muted)] hover:bg-white/6 hover:text-[var(--accent-soft)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              {isLoggedIn ? (
                <Link href={dashboardPath}>
                  <Button
                    variant="ghost"
                    className="rounded-full border border-white/8 px-5 text-[var(--text-inverse-muted)] transition-all duration-[var(--duration-fast)] hover:bg-white/8 hover:text-[var(--accent-soft)]"
                  >
                    <UserCircle className="mr-2 h-5 w-5" />
                    {isAdmin ? "Admin Panel" : isSeller ? "Dashboard" : "My Account"}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="rounded-full border border-white/8 px-5 text-[var(--text-inverse-muted)] transition-all duration-[var(--duration-fast)] hover:bg-white/8 hover:text-[var(--accent-soft)]"
                  >
                    Login
                  </Button>
                </Link>
              )}
              <Link href={isLoggedIn ? dashboardPath : "/login"}>
                <Button className="rounded-full border border-white/10 bg-[var(--accent-soft)] px-6 text-[var(--brand-strong)] shadow-[0_10px_24px_rgba(20,8,12,0.18)] transition-all duration-[var(--duration-fast)] hover:bg-[#f4e1e3]">
                  {isLoggedIn ? "Open Workspace" : "Get Started"}
                </Button>
              </Link>
            </div>

            <Dialog>
              <DialogTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-white/10 bg-white/6 text-[var(--text-inverse)] hover:bg-white/10 hover:text-[var(--accent-soft)]"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="overflow-hidden border border-[var(--border-inverse)] bg-[linear-gradient(180deg,#5a2030,#451523)] p-0 text-[var(--text-inverse)] shadow-[var(--shadow-xl)] sm:max-w-[425px]">
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="text-[11px] uppercase tracking-[0.32em] text-[var(--text-inverse-muted)]">Navigation</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[var(--tracking-heading)]">FoodSaver</div>
                </div>
                <nav className="flex flex-col gap-2 px-4 py-5">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-[1.25rem] px-4 py-3 text-base font-medium transition-all duration-[var(--duration-fast)] ${
                          isActive
                            ? "bg-white/10 text-[var(--accent-soft)]"
                            : "text-[var(--text-inverse)] hover:bg-white/8 hover:text-[var(--accent-soft)]"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )
                  })}
                  {isLoggedIn ? (
                    <Link
                      href={dashboardPath}
                      className="flex items-center justify-between rounded-[1.25rem] px-4 py-3 text-base font-medium text-[var(--text-inverse)] transition-all duration-[var(--duration-fast)] hover:bg-white/8 hover:text-[var(--accent-soft)]"
                    >
                      <span>{isAdmin ? "Admin Panel" : isSeller ? "Dashboard" : "My Account"}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-between rounded-[1.25rem] px-4 py-3 text-base font-medium text-[var(--text-inverse)] transition-all duration-[var(--duration-fast)] hover:bg-white/8 hover:text-[var(--accent-soft)]"
                    >
                      <span>Login</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link href={isLoggedIn ? dashboardPath : "/login"} className="mt-3">
                    <Button className="h-12 w-full rounded-full bg-[var(--accent-soft)] text-[var(--brand-strong)] hover:bg-[#f4e1e3]">
                      {isLoggedIn ? "Open Workspace" : "Get Started"}
                    </Button>
                  </Link>
                </nav>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  )
}

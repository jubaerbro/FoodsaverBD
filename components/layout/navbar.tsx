"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, UserCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSeller, setIsSeller] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      setIsLoggedIn(true)
      try {
        const user = JSON.parse(userStr)
        if (user.role === 'SELLER') {
          setIsSeller(true)
        }
      } catch (e) {}
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-emerald-600">FoodSaver BD</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/how-it-works" className="transition-colors hover:text-emerald-600">
              How it works
            </Link>
            <Link href="/browse-deals" className="transition-colors hover:text-emerald-600">
              Browse Deals
            </Link>
            <Link href="/partner-with-us" className="transition-colors hover:text-emerald-600">
              Partner with us
            </Link>
            <Link href="/about" className="transition-colors hover:text-emerald-600">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Link href={isSeller ? "/seller/dashboard" : "/browse-deals"}>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  {isSeller ? "Dashboard" : "My Account"}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            )}
            <Link href="/browse-deals">
              <Button>Browse Deals</Button>
            </Link>
          </div>
          <Dialog>
            <DialogTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/how-it-works" className="text-lg font-medium hover:text-emerald-600">
                  How it works
                </Link>
                <Link href="/browse-deals" className="text-lg font-medium hover:text-emerald-600">
                  Browse Deals
                </Link>
                <Link href="/partner-with-us" className="text-lg font-medium hover:text-emerald-600">
                  Partner with us
                </Link>
                <Link href="/about" className="text-lg font-medium hover:text-emerald-600">
                  About
                </Link>
                {isLoggedIn ? (
                  <Link href={isSeller ? "/seller/dashboard" : "/browse-deals"} className="text-lg font-medium hover:text-emerald-600">
                    {isSeller ? "Dashboard" : "My Account"}
                  </Link>
                ) : (
                  <Link href="/login" className="text-lg font-medium hover:text-emerald-600">
                    Login
                  </Link>
                )}
                <Link href="/browse-deals" className="mt-4">
                  <Button className="w-full">Browse Deals</Button>
                </Link>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}

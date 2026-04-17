"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, MailCheck, ShieldCheck, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { getDashboardPath, getRememberedEmail, getStoredUser, resumeRememberedSession, setStoredAppToken, setStoredSession, syncStoredSessionFromSupabase } from "@/lib/client-session"
import { SocialAuth } from "@/components/shared/social-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [signupRole, setSignupRole] = useState("CUSTOMER")
  const [message, setMessage] = useState<string | null>(
    "Enter your email and we will send a secure magic link. New customer accounts are created automatically on first login."
  )

  useEffect(() => {
    const rememberedEmail = getRememberedEmail()
    const storedUser = getStoredUser()

    setEmail(rememberedEmail)

    if (storedUser) {
      router.replace(getDashboardPath(storedUser))
      return
    }

    async function resumeSession() {
      const user = await syncStoredSessionFromSupabase()
      if (user) {
        router.replace(getDashboardPath(user))
      }
    }

    resumeSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      email: formData.get("email"),
      role: "CUSTOMER",
    }

    try {
      const storedUser = getStoredUser()
      const normalizedEmail = String(payload.email).trim().toLowerCase()

      if (storedUser && storedUser.email.trim().toLowerCase() === normalizedEmail) {
        setMessage("Welcome back. Redirecting to your account...")
        router.replace(getDashboardPath(storedUser))
        return
      }

      const resumedUser = await resumeRememberedSession(String(payload.email))
      if (resumedUser) {
        setMessage("Welcome back. Redirecting to your account...")
        router.replace(getDashboardPath(resumedUser))
        return
      }

      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          mode: "login",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send magic link")
        return
      }

      const supabase = createSupabaseBrowserClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: String(payload.email),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setMessage("Magic link sent. Open the email on this device to continue.")
    } catch {
      setError("An error occurred while requesting the magic link")
    } finally {
      setLoading(false)
    }
  }

  const handleManualSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSignupLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("signupName"),
          email: formData.get("signupEmail"),
          password: formData.get("signupPassword"),
          role: signupRole,
          businessName: formData.get("businessName"),
          address: formData.get("address"),
          phone: formData.get("phone"),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to create test account")
        return
      }

      setStoredAppToken(data.token)
      setStoredSession(data.user)
      router.replace(getDashboardPath(data.user))
    } catch {
      setError("An error occurred while creating the account")
    } finally {
      setSignupLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),transparent_34%),linear-gradient(180deg,#f8fafc,#eef4ef)] px-4 py-10">
      <div className="page-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.3),transparent_55%)]" />
          <div className="relative">
            <div className="section-kicker bg-white/10 text-white">Magic link access</div>
            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight">
              One clean login flow for customers. Seller onboarding stays separate and reviewed.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Customers can enter with just an email. Seller accounts go through a dedicated application process, and admin access remains separate from the marketplace experience.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <MailCheck className="h-5 w-5 text-amber-300" />
                <div className="mt-3 text-sm font-semibold">Passwordless</div>
                <div className="mt-1 text-xs text-slate-400">Email link only</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <Store className="h-5 w-5 text-emerald-300" />
                <div className="mt-3 text-sm font-semibold">Seller gated</div>
                <div className="mt-1 text-xs text-slate-400">Application and approval</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                <div className="mt-3 text-sm font-semibold">Admin separate</div>
                <div className="mt-1 text-xs text-slate-400">Moderation workspace</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_30px_70px_rgba(148,163,184,0.25)] backdrop-blur">
          <CardHeader className="border-b border-slate-100 pb-5">
            <CardTitle className="text-2xl">Sign in to FoodSaver</CardTitle>
            <CardDescription>
              Customers can sign in instantly with a magic link. No password, no separate signup screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {message && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

            <div className="space-y-3">
              <SocialAuth onError={(value) => setError(value || null)} />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                  <span className="bg-white px-3 text-slate-400">or continue with email</span>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email address</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border-slate-200"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <Button type="submit" className="h-12 w-full rounded-xl bg-slate-950 hover:bg-slate-800" disabled={loading}>
                {loading ? "Sending link..." : "Send magic link"}
              </Button>
            </form>

            <div className="grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                <span>Want to sell on FoodSaver?</span>
                <Link href="/partner-with-us" className="inline-flex items-center gap-1 font-medium text-slate-950">
                  Apply as seller <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                <span>Platform administration</span>
                <Link href="/admin/auth" className="inline-flex items-center gap-1 font-medium text-slate-950">
                  Admin login <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-950">Test signup without verification</div>
              <p className="mt-1 text-sm text-slate-500">
                For test phase only: create a customer or seller account with email and password and enter the app immediately.
              </p>

              <form className="mt-4 space-y-4" onSubmit={handleManualSignup}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full name</Label>
                    <Input id="signup-name" name="signupName" required className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Account type</Label>
                    <Select value={signupRole} onValueChange={setSignupRole}>
                      <SelectTrigger id="signup-role" className="bg-white">
                        <SelectValue placeholder="Choose role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="SELLER">Seller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="signupEmail" type="email" required className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="signupPassword" type="password" minLength={6} required className="bg-white" />
                  </div>
                </div>

                {signupRole === "SELLER" ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="signup-businessName">Business name</Label>
                      <Input id="signup-businessName" name="businessName" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-address">Address</Label>
                      <Input id="signup-address" name="address" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone</Label>
                      <Input id="signup-phone" name="phone" className="bg-white" />
                    </div>
                  </div>
                ) : null}

                <Button type="submit" className="h-11 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700" disabled={signupLoading}>
                  {signupLoading ? "Creating account..." : "Create test account"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck, UserCog, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseBrowserClient } from "@/lib/supabase"

export default function AdminAuthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(
    "Admin access is restricted to existing platform operators. Enter your approved email to receive a magic link."
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      email: formData.get("email"),
      role: "ADMIN",
    }

    try {
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

      setMessage("Admin magic link sent. Open the email on this device to continue.")
    } catch {
      setError("An error occurred while requesting the magic link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.22),transparent_32%),linear-gradient(180deg,#f8fafc,#f1f5f9)] px-4 py-10">
      <div className="page-shell grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#0f1720,#111827,#1e293b)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          <div className="section-kicker bg-white/10 text-white">Admin operations</div>
          <h1 className="mt-6 text-4xl font-bold">Moderation, approvals, and marketplace control.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This access point is reserved for existing administrators. Seller review, account approval, and policy enforcement remain isolated from the public marketplace flow.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <div className="mt-3 text-sm font-semibold">Trust control</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
              <Workflow className="h-5 w-5 text-emerald-300" />
              <div className="mt-3 text-sm font-semibold">Approval workflow</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
              <UserCog className="h-5 w-5 text-amber-300" />
              <div className="mt-3 text-sm font-semibold">Operator access</div>
            </div>
          </div>
        </div>
        <Card className="w-full overflow-hidden border-white/70 bg-white/85 shadow-[0_30px_70px_rgba(148,163,184,0.2)] backdrop-blur">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Admin access</CardTitle>
            <CardDescription>Magic-link login for approved administrators only.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
            {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="login-email">Admin email</Label>
                <Input id="login-email" name="email" type="email" placeholder="admin@foodsaver.com" required className="h-12 rounded-xl" />
              </div>
              <Button type="submit" className="h-12 w-full rounded-xl bg-slate-950 hover:bg-slate-800" disabled={loading}>
                {loading ? "Sending link..." : "Send admin magic link"}
              </Button>
            </form>

            <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
              Need customer access instead?{" "}
              <Link href="/login" className="inline-flex items-center gap-1 font-medium text-slate-950">
                Return to marketplace login <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { getDashboardPath, setStoredSession, StoredUser } from "@/lib/client-session"

async function waitForSupabaseSession(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  timeoutMs = 4000
) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.access_token) {
      return session
    }

    await new Promise((resolve) => window.setTimeout(resolve, 150))
  }

  return null
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Completing sign-in...")

  useEffect(() => {
    async function finishAuth() {
      try {
        const code = searchParams.get("code")
        const tokenHash = searchParams.get("token_hash")
        const type = searchParams.get("type")
        const supabase = createSupabaseBrowserClient()

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            throw error
          }
        }

        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as
              | "signup"
              | "invite"
              | "magiclink"
              | "recovery"
              | "email_change"
              | "email",
          })

          if (error) {
            throw error
          }
        }

        const session = await waitForSupabaseSession(supabase)

        if (!session?.access_token) {
          throw new Error(
            "No Supabase session found. Check that the exact redirect URL is allowed in Supabase: " +
              `${window.location.origin}/auth/callback`
          )
        }

        const res = await fetch("/api/auth/session", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Failed to resolve application session")
        }

        const user = data.user as StoredUser
        setStoredSession(user)
        router.replace(getDashboardPath(user))
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Authentication failed")
      }
    }

    finishAuth()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel rounded-[2rem] px-8 py-10 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Signing you in</h1>
        <p className="mt-3 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase"

export function SocialAuth({
  compact = false,
  onError,
}: {
  compact?: boolean
  onError?: (message: string) => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    onError?.("")

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Google sign-in failed")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className={`w-full justify-between rounded-2xl border-slate-200 bg-white/80 px-4 ${compact ? "h-11" : "h-12"}`}
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900 ring-1 ring-slate-200">
            G
          </span>
          {loading ? "Redirecting to Google..." : "Continue with Google"}
        </span>
        <span className="text-xs text-slate-400">OAuth</span>
      </Button>
    </div>
  )
}

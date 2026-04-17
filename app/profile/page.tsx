"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { clearStoredSession, getStoredToken, setStoredSession, syncStoredSessionFromSupabase, type StoredUser } from "@/lib/client-session"
import { downloadReservationSlip } from "@/lib/reservation-download"
import { CalendarDays, LogOut, Mail, Save, ShoppingBag, UserCircle2 } from "lucide-react"

type Reservation = {
  id: string
  quantity: number
  status: string
  orderCode: string
  createdAt: string
  deal: {
    title: string
    seller?: {
      businessName?: string
    }
  }
}

type ProfileData = StoredUser & {
  createdAt: string
  reservations: Reservation[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      let token = await getStoredToken()

      if (!token) {
        const user = await syncStoredSessionFromSupabase()
        if (!user) {
          router.replace("/login")
          return
        }
        token = await getStoredToken()
      }

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        router.replace("/login")
        return
      }

      setProfile(data)
      setName(data.name)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    const token = await getStoredToken()
    if (!token) {
      router.replace("/login")
      return
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Failed to update profile")
      setSaving(false)
      return
    }

    const updatedUser = data.user as StoredUser
    setStoredSession(updatedUser)
    setProfile((current) =>
      current
        ? {
            ...current,
            ...updatedUser,
          }
        : null
    )
    setMessage("Profile updated.")
    setSaving(false)
  }

  async function handleLogout() {
    await clearStoredSession()
    router.replace("/login")
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>
  }

  if (!profile) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Profile not found</div>
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,#f8fafc,#eef4ef)] px-4 py-10">
      <div className="page-shell space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.3)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-slate-400">Customer profile</div>
            <h1 className="mt-3 text-4xl font-bold">{profile.name}</h1>
            <p className="mt-3 text-sm text-slate-300">
              Manage your account details, review recent reservations, and sign out from this device.
            </p>
          </div>
          <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[2rem] border-white/70 bg-white/90 shadow-xl">
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}
              {message && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

              <form className="space-y-5" onSubmit={handleSave}>
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full name</Label>
                  <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input id="profile-email" value={profile.email} readOnly className="bg-slate-50" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2 font-medium text-slate-950">
                      <UserCircle2 className="h-4 w-4" />
                      Role
                    </div>
                    <div className="mt-2">{profile.role}</div>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2 font-medium text-slate-950">
                      <CalendarDays className="h-4 w-4" />
                      Member since
                    </div>
                    <div className="mt-2">{new Date(profile.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <Button type="submit" className="rounded-xl bg-slate-950 hover:bg-slate-800" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/70 bg-white/90 shadow-xl">
            <CardHeader>
              <CardTitle>Recent reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.reservations.length > 0 ? (
                profile.reservations.map((reservation) => (
                  <div key={reservation.id} className="rounded-[1.4rem] border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-950">{reservation.deal.title}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          {reservation.deal.seller?.businessName || "Verified seller"}
                        </div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {reservation.status}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Order code</div>
                        <div className="mt-1">{reservation.orderCode}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Quantity</div>
                        <div className="mt-1">{reservation.quantity}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Reserved</div>
                        <div className="mt-1">{new Date(reservation.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={async () => {
                        try {
                          await downloadReservationSlip(reservation.id)
                        } catch (downloadError) {
                          setError(downloadError instanceof Error ? downloadError.message : "Failed to download slip")
                        }
                      }}
                    >
                      Download slip
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3">No reservations yet. Browse deals to place your first order.</p>
                </div>
              )}

              <div className="rounded-[1.4rem] border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 font-medium text-slate-950">
                  <Mail className="h-4 w-4" />
                  Returning login
                </div>
                <p className="mt-2">
                  On this device, if your Supabase session is still active, entering your remembered email will take you back in without sending another magic link.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

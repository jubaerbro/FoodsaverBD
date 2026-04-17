"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clearStoredSession, getStoredToken } from "@/lib/client-session"
import { Users, ShoppingBag, CheckCircle2, XCircle, Clock, BarChart3, Settings, LogOut, MessageSquare, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const token = await getStoredToken()
      if (!token) {
        router.push("/admin/auth")
        return
      }

      const res = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        router.push("/admin/auth")
        return
      }

      setData(await res.json())
      setLoading(false)
    }

    loadDashboard()
  }, [router])

  const handleLogout = async () => {
    await clearStoredSession()
    router.push("/admin/auth")
  }

  const moderateSeller = async (sellerId: string, action: "approve" | "reject") => {
    const token = await getStoredToken()
    if (!token) {
      return
    }

    await fetch(`/api/admin/sellers/${sellerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    })

    router.refresh()
    window.location.reload()
  }

  const deleteSeller = async (sellerId: string) => {
    const token = await getStoredToken()
    if (!token) {
      return
    }

    await fetch(`/api/admin/sellers/${sellerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    router.refresh()
    window.location.reload()
  }

  const deleteReview = async (reviewId: string) => {
    const token = await getStoredToken()
    if (!token) {
      return
    }

    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    router.refresh()
    window.location.reload()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin dashboard...</div>
  }

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" /> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-emerald-400 bg-slate-800/50 hover:bg-slate-800 hover:text-emerald-300">
            <BarChart3 className="w-5 h-5 mr-3" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 hover:text-white">
            <Users className="w-5 h-5 mr-3" /> Partners
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 hover:text-white">
            <ShoppingBag className="w-5 h-5 mr-3" /> Active Deals
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 hover:text-white">
            <AlertTriangle className="w-5 h-5 mr-3" /> Reports
          </Button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-slate-500">Last updated: Just now</span>
            <Button variant="outline" size="sm">Refresh</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Partners</CardTitle>
              <Users className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data?.stats?.totalSellers ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Active Deals</CardTitle>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data?.stats?.activeDeals ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Reviews</CardTitle>
              <MessageSquare className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data?.stats?.totalReviews ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
              <Clock className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data?.stats?.pendingSellers ?? 0}</div>
              <p className="text-xs text-slate-500 mt-1">Needs your attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals Table */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">Pending Partner Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.pendingSellers ?? []).map((partner: any) => (
                  <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{partner.businessName}</span>
                        <Badge variant="outline" className="text-[10px]">Seller</Badge>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-3">
                        <span>{partner.address}</span>
                        <span>{partner.user?.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Button size="icon" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => moderateSeller(partner.id, "approve")}>
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => moderateSeller(partner.id, "reject")}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteSeller(partner.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Moderation */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Recent Seller Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.reviews ?? []).map((review: any) => (
                  <div key={review.id} className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-white">
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">{review.seller?.businessName}</div>
                      <div className="text-sm text-slate-600">{review.comment || "No written review."}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {review.user?.name} rated {review.rating}/5
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteReview(review.id)}>
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

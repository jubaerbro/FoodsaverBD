"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingBag, Utensils, AlertTriangle, CheckCircle2, XCircle, Clock, BarChart3, Settings, LogOut } from "lucide-react"

export default function AdminDashboard() {
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
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300">
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
              <div className="text-2xl font-bold text-slate-900">1,248</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Active Deals</CardTitle>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">342</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +5% from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Meals Saved (Total)</CardTitle>
              <Utensils className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">12,543</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +842 this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
              <Clock className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">14</div>
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
                {[
                  { id: "P-1042", name: "Bismillah Biryani", area: "Mirpur 10", type: "Restaurant", time: "2 hours ago" },
                  { id: "P-1043", name: "Sweet Tooth Bakery", area: "Banani", type: "Bakery", time: "5 hours ago" },
                  { id: "P-1044", name: "Green Leaf Cafe", area: "Dhanmondi", type: "Cafe", time: "1 day ago" },
                  { id: "P-1045", name: "Daily Needs Super", area: "Uttara", type: "Grocery", time: "1 day ago" },
                ].map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{partner.name}</span>
                        <Badge variant="outline" className="text-[10px]">{partner.type}</Badge>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-3">
                        <span>{partner.area}</span>
                        <span className="text-xs text-slate-400">{partner.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-emerald-600">View all pending approvals</Button>
            </CardContent>
          </Card>

          {/* Reported Listings Table */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Reported Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "R-501", vendor: "Kacchi Bhai", issue: "Food spoiled", status: "Investigating" },
                  { id: "R-502", vendor: "Dhaka Sweets", issue: "Store closed during pickup", status: "Resolved" },
                  { id: "R-503", vendor: "Cafe 99", issue: "Wrong item given", status: "Pending" },
                ].map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">{report.vendor}</div>
                      <div className="text-sm text-slate-600">Issue: <span className="text-slate-900">{report.issue}</span></div>
                    </div>
                    <div>
                      <Badge variant={report.status === "Resolved" ? "default" : report.status === "Investigating" ? "secondary" : "destructive"} className={
                        report.status === "Resolved" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : 
                        report.status === "Investigating" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""
                      }>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-emerald-600">View all reports</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Dummy component for the icon since it's not imported at the top
function TrendingUp({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  )
}

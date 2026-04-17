"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { clearStoredSession, getStoredToken } from "@/lib/client-session"
import { Plus, Package, Clock, LogOut, Star } from "lucide-react"

async function fetchSellerDashboard(
  router: ReturnType<typeof useRouter>
) {
  const token = await getStoredToken()
  if (!token) {
    router.push('/login')
    return null
  }

  try {
    const res = await fetch('/api/seller/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      return await res.json()
    }

    if (res.status === 401 || res.status === 403) {
      router.push('/login')
    }

    return null
  } catch (error) {
    console.error("Failed to fetch seller dashboard", error)
    return null
  }
}

export default function SellerDashboard() {
  const router = useRouter()
  const [deals, setDeals] = useState<any[]>([])
  const [seller, setSeller] = useState<any | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      const data = await fetchSellerDashboard(router)
      if (data) {
        setSeller(data)
        setDeals(data.deals ?? [])
        setReviews(data.sellerReviews ?? [])
      }
      setLoading(false)
    }

    loadDashboard()
  }, [router])

  const handleAddDeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const token = await getStoredToken()
    let imageUrl = ""

    if (selectedImage) {
      const uploadFormData = new FormData()
      uploadFormData.append("file", selectedImage)

      const uploadRes = await fetch("/api/uploads/deal-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      })

      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setError(uploadData.error || "Failed to upload image")
        setSubmitting(false)
        return
      }

      imageUrl = uploadData.imageUrl
    }

    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      originalPrice: formData.get('originalPrice'),
      discountedPrice: formData.get('discountedPrice'),
      quantity: formData.get('quantity'),
      pickupStartTime: formData.get('pickupStartTime'),
      pickupEndTime: formData.get('pickupEndTime'),
      imageUrl,
      dietaryTags: formData.get('dietaryTags') ? (formData.get('dietaryTags') as string).split(',').map(t => t.trim()) : []
    }

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setShowAddForm(false)
        setLoading(true)
        const dashboardData = await fetchSellerDashboard(router)
        if (dashboardData) {
          setSeller(dashboardData)
          setDeals(dashboardData.deals ?? [])
          setReviews(dashboardData.sellerReviews ?? [])
        }
        setLoading(false)
        setSelectedImage(null)
        setImagePreview(null)
      } else {
        const errData = await res.json()
        setError(errData.error || 'Failed to create deal')
      }
    } catch (err) {
      setError('An error occurred while creating the deal')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await clearStoredSession()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Dashboard Header */}
      <div className="bg-emerald-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-emerald-100 mt-1">
              {seller?.businessName ? `${seller.businessName} seller portal` : "Manage your surplus food listings"}
            </p>
          </div>
          <Button variant="outline" className="text-slate-900 bg-white hover:bg-slate-100" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {seller && (
          <Card className="mb-8 border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Seller Status</CardTitle>
                <p className="text-sm text-slate-500 mt-2">
                  Admin approval is required before new deals can go live.
                </p>
              </div>
              <Badge
                className={
                  seller.approvalStatus === "APPROVED"
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    : seller.approvalStatus === "REJECTED"
                      ? "bg-red-100 text-red-700 hover:bg-red-100"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                }
              >
                {seller.approvalStatus}
              </Badge>
            </CardHeader>
            {seller.approvalNotes && (
              <CardContent>
                <p className="text-sm text-slate-600">Admin note: {seller.approvalNotes}</p>
              </CardContent>
            )}
          </Card>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Your Active Deals</h2>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={seller?.approvalStatus !== "APPROVED"}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add New Deal</>}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8 border-emerald-200 shadow-md">
            <CardHeader className="bg-emerald-50 border-b border-emerald-100">
              <CardTitle className="text-emerald-800">Create a New Deal</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddDeal} className="space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Deal Title *</Label>
                    <Input id="title" name="title" placeholder="e.g., Assorted Pastry Box" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Available *</Label>
                    <Input id="quantity" name="quantity" type="number" min="1" placeholder="e.g., 5" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (৳) *</Label>
                    <Input id="originalPrice" name="originalPrice" type="number" min="0" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">Discounted Price (৳) *</Label>
                    <Input id="discountedPrice" name="discountedPrice" type="number" min="0" step="0.01" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pickupStartTime">Pickup Start Time *</Label>
                    <Input id="pickupStartTime" name="pickupStartTime" type="datetime-local" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupEndTime">Pickup End Time *</Label>
                    <Input id="pickupEndTime" name="pickupEndTime" type="datetime-local" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryTags">Dietary Tags (comma separated)</Label>
                  <Input id="dietaryTags" name="dietaryTags" placeholder="e.g., Halal, Vegetarian, Vegan" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageFile">Deal image</Label>
                  <Input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null
                      setSelectedImage(file)
                      setImagePreview(file ? URL.createObjectURL(file) : null)
                    }}
                  />
                  <p className="text-xs text-slate-500">Upload from your phone or computer. JPG, PNG, or WEBP up to 5MB.</p>
                  {imagePreview ? (
                    <div className="relative h-36 overflow-hidden rounded-xl border border-slate-200">
                      <Image src={imagePreview} alt="Selected deal preview" fill className="object-cover" unoptimized />
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Describe what might be in the box..." rows={3} />
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {submitting ? "Publishing..." : "Publish Deal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Deals List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {deals.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-lg">You don&apos;t have any active deals.</p>
              <p className="text-sm mt-1">Click &quot;Add New Deal&quot; to create your first listing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-600 text-sm">
                    <th className="p-4 font-medium">Deal Title</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Quantity</th>
                    <th className="p-4 font-medium">Pickup Window</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-medium text-slate-900">{deal.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{deal.description}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-600">৳{deal.discountedPrice}</span>
                        <span className="text-xs text-slate-400 line-through ml-2">৳{deal.originalPrice}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {deal.quantity} left
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                          {new Date(deal.pickupStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(deal.pickupEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deal.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                          {deal.quantity > 0 ? 'Active' : 'Sold Out'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Latest Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">No customer reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-900">{review.user?.name ?? "Customer"}</div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{review.comment || "No written feedback."}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

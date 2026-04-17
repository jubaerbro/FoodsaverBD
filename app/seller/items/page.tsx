"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { clearStoredSession, getStoredToken } from "@/lib/client-session"
import { Edit3, ExternalLink, Package, Plus, Trash2 } from "lucide-react"

type SellerData = {
  id: string
  businessName: string
  approvalStatus: string
  approvalNotes?: string | null
  deals: any[]
}

async function fetchSellerWorkspace(router: ReturnType<typeof useRouter>) {
  const token = await getStoredToken()
  if (!token) {
    router.push("/login")
    return null
  }

  const res = await fetch("/api/seller/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    router.push("/login")
    return null
  }

  return res.json()
}

export default function SellerItemsPage() {
  const router = useRouter()
  const [seller, setSeller] = useState<SellerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await fetchSellerWorkspace(router)
      if (data) {
        setSeller(data)
      }
      setLoading(false)
    }

    load()
  }, [router])

  const handleLogout = async () => {
    await clearStoredSession()
    router.push("/")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSaving(true)

    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    const token = await getStoredToken()
    if (!token) {
      setSaving(false)
      router.push("/login")
      return
    }
    let imageUrl = editingItem?.imageUrl || ""

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
        setSaving(false)
        return
      }

      imageUrl = uploadData.imageUrl
    }

    const payload = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      originalPrice: Number(formData.get("originalPrice")),
      discountedPrice: Number(formData.get("discountedPrice")),
      quantity: Number(formData.get("quantity")),
      pickupStartTime: String(formData.get("pickupStartTime")),
      pickupEndTime: String(formData.get("pickupEndTime")),
      imageUrl,
      dietaryTags: String(formData.get("dietaryTags") || "").split(",").map((value) => value.trim()).filter(Boolean),
    }

    const endpoint = editingId ? `/api/seller/deals/${editingId}` : "/api/deals"
    const method = editingId ? "PATCH" : "POST"

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Failed to save product")
      setSaving(false)
      return
    }

    setShowForm(false)
    setEditingId(null)
    setSelectedImage(null)
    setImagePreview(null)
    const refreshed = await fetchSellerWorkspace(router)
    if (refreshed) {
      setSeller(refreshed)
    }
    setSaving(false)
  }

  const handleDelete = async (dealId: string) => {
    const token = await getStoredToken()
    if (!token) {
      return
    }

    await fetch(`/api/seller/deals/${dealId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const refreshed = await fetchSellerWorkspace(router)
    if (refreshed) {
      setSeller(refreshed)
    }
  }

  const items = seller?.deals ?? []
  const editingItem = items.find((item) => item.id === editingId)

  useEffect(() => {
    if (editingItem?.imageUrl) {
      setImagePreview(editingItem.imageUrl)
    } else {
      setImagePreview(null)
    }
    setSelectedImage(null)
  }, [editingId, editingItem?.imageUrl, showForm])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading seller workspace...</div>
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="page-shell space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-slate-400">Seller workspace</div>
            <h1 className="mt-3 text-4xl font-bold">{seller?.businessName || "Seller items"}</h1>
            <p className="mt-3 text-sm text-slate-300">Manage how your products appear in the marketplace and open each product page the way customers see it.</p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-white/10 text-white hover:bg-white/10">{seller?.approvalStatus}</Badge>
            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Inventory</h2>
            <p className="text-sm text-slate-500">A Daraz-style product flow starts with clean item cards and strong product pages.</p>
          </div>
          <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }} disabled={seller?.approvalStatus !== "APPROVED"}>
            <Plus className="mr-2 h-4 w-4" />
            Add product
          </Button>
        </div>

        {showForm && (
          <Card className="rounded-[2rem] border-white/60 bg-white/90 shadow-xl">
            <CardHeader>
              <CardTitle>{editingId ? "Edit product" : "Create product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                {error && <div className="md:col-span-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingItem?.title} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Product image</Label>
                  <Input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null
                      setSelectedImage(file)
                      setImagePreview(file ? URL.createObjectURL(file) : editingItem?.imageUrl || null)
                    }}
                  />
                  <p className="text-xs text-slate-500">Upload from your phone or computer. JPG, PNG, or WEBP up to 5MB.</p>
                  {imagePreview ? (
                    <div className="relative h-32 overflow-hidden rounded-xl border border-slate-200">
                      <Image src={imagePreview} alt="Selected product preview" fill className="object-cover" unoptimized />
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original price</Label>
                  <Input id="originalPrice" name="originalPrice" type="number" step="0.01" defaultValue={editingItem?.originalPrice} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountedPrice">Discounted price</Label>
                  <Input id="discountedPrice" name="discountedPrice" type="number" step="0.01" defaultValue={editingItem?.discountedPrice} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" defaultValue={editingItem?.quantity} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietaryTags">Dietary tags</Label>
                  <Input id="dietaryTags" name="dietaryTags" defaultValue={editingItem?.dietaryTags?.join(", ") || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupStartTime">Pickup start</Label>
                  <Input id="pickupStartTime" name="pickupStartTime" type="datetime-local" defaultValue={editingItem?.pickupStartTime?.slice(0, 16)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupEndTime">Pickup end</Label>
                  <Input id="pickupEndTime" name="pickupEndTime" type="datetime-local" defaultValue={editingItem?.pickupEndTime?.slice(0, 16)} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={4} defaultValue={editingItem?.description || ""} />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Publish product"}</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="rounded-[2rem] border-white/60 bg-white/90 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {item.imageUrl ? (
                      <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-slate-100">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" unoptimized />
                      </div>
                    ) : null}
                    <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">{item.description || "No description yet."}</p>
                  </div>
                  <Badge variant="outline">{item.quantity} left</Badge>
                </div>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-emerald-700">৳{item.discountedPrice}</span>
                  <span className="text-sm text-slate-400 line-through">৳{item.originalPrice}</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link href={`/products/${item.id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View product page
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditingId(item.id); }}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <Card className="rounded-[2rem] border-dashed border-slate-300 bg-white/70">
              <CardContent className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
                <Package className="h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-xl font-bold text-slate-900">No products yet</h3>
                <p className="mt-2 text-sm text-slate-500">Create your first product to see how it appears in the public marketplace.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

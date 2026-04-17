"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getStoredToken } from "@/lib/client-session"
import { getLivePricing } from "@/lib/live-pricing"
import { downloadReservationSlip } from "@/lib/reservation-download"
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  Leaf,
  MapPin,
  ShieldCheck,
  Star,
  Store,
  TimerReset,
} from "lucide-react"

type Review = {
  id: string
  rating: number
  comment?: string | null
  user?: {
    name?: string | null
  }
}

const takaFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
})

function formatTaka(value: number) {
  return `Tk ${takaFormatter.format(value)}`
}

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const [deal, setDeal] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reserveState, setReserveState] = useState<string | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [reviewState, setReviewState] = useState<string | null>(null)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [pricingNow, setPricingNow] = useState(() => new Date())
  const [latestReservationId, setLatestReservationId] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPricingNow(new Date())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/deals/${params.id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Failed to load product")
        }

        setDeal(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleReserve = async () => {
    const token = await getStoredToken()
    if (!token) {
      setReserveState("Sign in with a magic link to reserve this item.")
      return
    }

    const res = await fetch("/api/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dealId: deal.id, quantity: 1 }),
    })

    const data = await res.json()
    if (!res.ok) {
      setReserveState(data.error || "Reservation failed")
      return
    }

    setLatestReservationId(data.reservation.id)
    setReserveState(`Reserved successfully. Order code: ${data.reservation.orderCode}`)
  }

  const handleSlipDownload = async () => {
    if (!latestReservationId) {
      return
    }

    try {
      await downloadReservationSlip(latestReservationId)
    } catch (error) {
      setReserveState(error instanceof Error ? error.message : "Failed to download slip")
    }
  }

  const handleReviewSubmit = async () => {
    const token = await getStoredToken()
    if (!token || !deal?.seller?.id) {
      setReviewState("Sign in as a customer to review this seller.")
      return
    }

    setSubmittingReview(true)
    setReviewState(null)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sellerId: deal.seller.id,
          rating,
          comment: reviewText,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setReviewState(data.error || "Failed to submit review")
        return
      }

      setReviewText("")
      setReviewState("Review submitted. Refresh the page to see the latest public feedback.")
    } catch {
      setReviewState("Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>
  }

  if (!deal || error) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">{error || "Product not found"}</div>
  }

  const reviews: Review[] = deal.seller?.sellerReviews ?? []
  const sellerRating = reviews.length
    ? reviews.reduce((sum: number, review) => sum + review.rating, 0) / reviews.length
    : 0
  const livePricing = getLivePricing(
    Number(deal.originalPrice) || 0,
    Number(deal.discountedPrice) || 0,
    pricingNow
  )
  const savings = livePricing.savingsAmount
  const pickupWindow = `${new Date(deal.pickupStartTime).toLocaleString()} - ${new Date(deal.pickupEndTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`
  const soldBy = deal.seller?.businessName || "Verified seller"

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,#f8fafc,#eef4ef)] px-4 py-10">
      <div className="page-shell space-y-8">
        <Link href="/browse-deals" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" />
          Back to marketplace
        </Link>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-white/75 shadow-[0_30px_80px_rgba(148,163,184,0.22)] backdrop-blur">
              <CardContent className="p-0">
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={deal.imageUrl || "https://picsum.photos/seed/product-page/1200/900"}
                    alt={deal.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                  <div className="absolute left-6 top-6 flex flex-wrap gap-3">
                    <Badge className="border-0 bg-rose-500 px-4 py-1.5 text-white hover:bg-rose-500">
                      {livePricing.liveDiscountPercentage}% OFF
                    </Badge>
                    <Badge className="border-0 bg-white/90 px-4 py-1.5 text-slate-900 hover:bg-white/90">
                      {deal.quantity} available
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur">
                        <Store className="h-4 w-4" />
                        {soldBy}
                      </div>
                      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white lg:text-5xl">{deal.title}</h1>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/15 bg-white/12 p-5 text-white backdrop-blur">
                      <div className="text-xs uppercase tracking-[0.24em] text-white/70">Today&apos;s price</div>
                      <div className="mt-2 text-4xl font-semibold">{formatTaka(livePricing.liveDiscountedPrice)}</div>
                      <div className="mt-1 text-sm text-white/70 line-through">{formatTaka(Number(deal.originalPrice))}</div>
                      <div className="mt-2 text-xs text-white/70">
                        Night pricing runs in Dhaka from 8:00 PM to 6:00 AM, adding 10% per full hour.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_22px_60px_rgba(148,163,184,0.18)]">
                <CardContent className="p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                      Save {formatTaka(savings)}
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                      Pickup only
                    </div>
                  </div>

                  <p className="mt-6 text-base leading-8 text-slate-600">
                    {deal.description || "A discounted surplus food listing prepared for same-day pickup. Reserve early to secure stock before the pickup window closes."}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                      <div className="flex items-center gap-3 text-slate-900">
                        <Clock3 className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold">Pickup window</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{pickupWindow}</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                      <div className="flex items-center gap-3 text-slate-900">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold">Pickup location</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{deal.seller?.address || "Shared after reservation confirmation."}</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
                      <ShieldCheck className="h-5 w-5 text-emerald-700" />
                      <div className="mt-3 font-semibold text-slate-950">Verified seller</div>
                      <p className="mt-2 text-sm text-slate-600">Seller account is reviewed before listings go live.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50/80 p-5">
                      <Leaf className="h-5 w-5 text-amber-700" />
                      <div className="mt-3 font-semibold text-slate-950">Waste reduced</div>
                      <p className="mt-2 text-sm text-slate-600">This deal helps redirect quality food away from waste.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/80 p-5">
                      <TimerReset className="h-5 w-5 text-sky-700" />
                      <div className="mt-3 font-semibold text-slate-950">Fast redemption</div>
                      <p className="mt-2 text-sm text-slate-600">Reserve online, then show your code at pickup.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-white/80 bg-white/85 shadow-[0_22px_60px_rgba(148,163,184,0.18)]">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Seller rating</div>
                      <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-950">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        {sellerRating ? sellerRating.toFixed(1) : "New"}
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                      {reviews.length} public reviews
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-center gap-2 text-slate-900">
                      <BadgeCheck className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold">{soldBy}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {deal.seller?.address || "Pickup address is available after reservation."}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="rounded-[1.25rem] border border-slate-100 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-slate-900">{review.user?.name ?? "Customer"}</div>
                          <div className="text-sm text-amber-600">{review.rating}/5</div>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment || "No written feedback."}</p>
                      </div>
                    ))}
                    {reviews.length === 0 && (
                      <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                        No public reviews yet. Early reservations help establish seller reputation.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <Card className="rounded-[2rem] border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
              <CardContent className="p-8">
                <div className="text-xs uppercase tracking-[0.24em] text-white/60">Reserve this deal</div>
                <div className="mt-4 flex items-end gap-3">
                  <div className="text-4xl font-semibold">{formatTaka(livePricing.liveDiscountedPrice)}</div>
                  <div className="pb-1 text-sm text-white/50 line-through">{formatTaka(Number(deal.originalPrice))}</div>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-white/75">
                  <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                    <span>Available now</span>
                    <span className="font-medium text-white">{deal.quantity} units</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                    <span>You save</span>
                    <span className="font-medium text-emerald-300">{formatTaka(savings)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                    <span>Live discount</span>
                    <span className="font-medium text-amber-300">{livePricing.liveDiscountPercentage}%</span>
                  </div>
                </div>

                <Button className="mt-6 h-12 w-full rounded-xl bg-white text-slate-950 hover:bg-slate-100" onClick={handleReserve}>
                  Reserve now
                </Button>
                <p className="mt-3 text-xs leading-6 text-white/60">
                  Reservation is free. Show your order code at pickup and complete payment with the seller.
                </p>
                {reserveState ? (
                  <div className="mt-4 space-y-3 rounded-2xl bg-white/8 p-3 text-sm text-white/80">
                    <p>{reserveState}</p>
                    {latestReservationId ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/20 bg-transparent text-white hover:bg-white/10"
                        onClick={handleSlipDownload}
                      >
                        Download slip
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/80 bg-white/85 shadow-[0_22px_60px_rgba(148,163,184,0.18)]">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-slate-950">Share your seller experience</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Reviews are public and tied to the seller, helping future buyers choose more confidently.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={rating === value ? "default" : "outline"}
                      className={rating === value ? "bg-slate-950 hover:bg-slate-800" : ""}
                      onClick={() => setRating(value)}
                    >
                      {value} star{value > 1 ? "s" : ""}
                    </Button>
                  ))}
                </div>

                <Textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  placeholder="Describe pickup quality, seller responsiveness, and overall experience."
                  className="mt-4 min-h-[130px] rounded-2xl border-slate-200"
                />
                {reviewState && <p className="mt-3 text-sm text-slate-500">{reviewState}</p>}
                <Button className="mt-4 h-11 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={handleReviewSubmit} disabled={submittingReview}>
                  {submittingReview ? "Submitting review..." : "Submit seller review"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Clock, MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface DealProps {
  id: string
  title: string
  vendor: string
  distance: string
  pickupWindow: string
  originalPrice: number
  discountedPrice: number
  remainingQuantity: number
  imageUrl: string
  discountPercentage: number
  dietaryTags?: string[]
  sellerId?: string
  sellerRating?: number
  reviewCount?: number
  reviews?: Array<{
    id: string
    rating: number
    comment?: string | null
    user?: {
      name?: string
    }
  }>
}

const takaFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
})

function formatTaka(value: number) {
  return `Tk ${takaFormatter.format(value)}`
}

export function DealCard({ deal }: { deal: DealProps }) {
  const reviewLabel =
    deal.reviewCount && deal.reviewCount > 0
      ? `${deal.sellerRating?.toFixed(1) ?? "New"} · ${deal.reviewCount} reviews`
      : "New seller"

  return (
    <Card className="group h-full overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/85 shadow-[0_18px_60px_rgba(148,163,184,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,0.16)]">
      <Link href={`/products/${deal.id}`} className="flex h-full flex-col">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="border-0 bg-rose-500 text-white hover:bg-rose-500">
              {deal.discountPercentage}% OFF
            </Badge>
            <Badge className="border-0 bg-white/90 text-slate-900 hover:bg-white/90">
              {deal.remainingQuantity} left
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-white/70">Featured offer</div>
              <div className="mt-1 text-2xl font-semibold text-white">{formatTaka(deal.discountedPrice)}</div>
            </div>
            <div className="rounded-full bg-white/14 p-2 text-white backdrop-blur">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-slate-950">{deal.title}</h3>
              <p className="mt-1 line-clamp-1 text-sm font-medium text-emerald-700">{deal.vendor}</p>
            </div>
            <div className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              Save {formatTaka(Math.max(deal.originalPrice - deal.discountedPrice, 0))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(deal.dietaryTags ?? []).slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 grid gap-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="truncate">{deal.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="truncate">Pickup {deal.pickupWindow}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{reviewLabel}</span>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Original</div>
              <div className="mt-1 text-sm text-slate-400 line-through">{formatTaka(deal.originalPrice)}</div>
            </div>
            <span className="inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
              View offer
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

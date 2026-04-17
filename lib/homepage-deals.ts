import { SellerApprovalStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getLivePricing } from "@/lib/live-pricing"

export interface HomepageDeal {
  id: string
  title: string
  vendor: string
  location: string
  distance: string
  pickup: string
  price: number
  originalPrice: number
  discount: string
  stock: string
  imageUrl: string
  highlight: string
}

function formatPickupWindow(start: Date, end: Date) {
  const formatter = new Intl.DateTimeFormat("en-BD", {
    hour: "numeric",
    minute: "2-digit",
  })

  return `${formatter.format(start)} - ${formatter.format(end)}`
}

function inferHighlight(title: string, vendor: string, discountPercentage: number) {
  const haystack = `${title} ${vendor}`.toLowerCase()

  if (haystack.includes("bakery") || haystack.includes("pastry") || haystack.includes("cake")) {
    return "Fresh bakery pick"
  }

  if (haystack.includes("biryani") || haystack.includes("meal") || haystack.includes("kitchen")) {
    return "Dinner-ready favorite"
  }

  if (haystack.includes("cafe") || haystack.includes("coffee") || haystack.includes("roast")) {
    return "Cafe closing special"
  }

  if (discountPercentage >= 50) {
    return "Best value tonight"
  }

  return "Popular tonight"
}

function mapDeal(deal: any): HomepageDeal {
  const originalPrice = Number(deal.originalPrice) || 0
  const pricing = getLivePricing(originalPrice, Number(deal.discountedPrice) || 0)

  return {
    id: deal.id,
    title: deal.title,
    vendor: deal.seller?.businessName || "Unknown vendor",
    location: deal.seller?.address || "Location unavailable",
    distance: "Available for pickup",
    pickup: formatPickupWindow(new Date(deal.pickupStartTime), new Date(deal.pickupEndTime)),
    price: pricing.liveDiscountedPrice,
    originalPrice,
    discount: `${pricing.liveDiscountPercentage}% off`,
    stock: `${deal.quantity} left`,
    imageUrl: deal.imageUrl || "https://picsum.photos/seed/food/1200/900",
    highlight: inferHighlight(deal.title, deal.seller?.businessName || "", pricing.liveDiscountPercentage),
  }
}

function scoreDeal(deal: any) {
  const originalPrice = Number(deal.originalPrice) || 0
  const discountedPrice = Number(deal.discountedPrice) || 0
  const discountPercentage =
    originalPrice > 0 ? ((originalPrice - discountedPrice) / originalPrice) * 100 : 0
  const reviewCount = deal.seller?.sellerReviews?.length || 0
  const averageRating =
    reviewCount > 0
      ? deal.seller.sellerReviews.reduce(
          (sum: number, review: { rating: number }) => sum + review.rating,
          0
        ) / reviewCount
      : 0

  return discountPercentage * 0.6 + averageRating * 10 * 0.25 + Math.min(reviewCount, 20) * 0.15
}

export async function getHomepageDeals() {
  const deals = await prisma.deal.findMany({
    where: {
      quantity: {
        gt: 0,
      },
      seller: {
        approvalStatus: SellerApprovalStatus.APPROVED,
      },
    },
    include: {
      seller: {
        include: {
          sellerReviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 24,
  })

  const rankedDeals = [...deals].sort((a, b) => scoreDeal(b) - scoreDeal(a))
  const highlightedSource = rankedDeals[0] ?? null
  const featuredSources = rankedDeals.slice(0, 3)

  return {
    highlighted: highlightedSource ? mapDeal(highlightedSource) : null,
    featured: featuredSources.map(mapDeal),
    totalLiveDeals: deals.length,
  }
}

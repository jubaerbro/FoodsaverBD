"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, MapPin, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DealCard, DealProps } from "@/components/shared/deal-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getLivePricing } from "@/lib/live-pricing"

type CategoryValue = "all" | "meals" | "bakery" | "groceries" | "cafe"
type PickupValue = "any" | "morning" | "afternoon" | "evening" | "night"
type SortValue = "recommended" | "price_low" | "discount" | "rating"

const CATEGORY_OPTIONS = ["Meals", "Bakery", "Groceries", "Cafe"]
const DIETARY_OPTIONS = ["Halal", "Vegetarian", "Vegan"]

export default function BrowseDeals() {
  const [rawDeals, setRawDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pricingNow, setPricingNow] = useState(() => new Date())

  const [searchInput, setSearchInput] = useState("")
  const [locationQuery, setLocationQuery] = useState("")

  const [pickupTime, setPickupTime] = useState<PickupValue>("any")
  const [topCategory, setTopCategory] = useState<CategoryValue>("all")
  const [sortBy, setSortBy] = useState<SortValue>("recommended")

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([500])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationQuery(searchInput.trim())
    }, 250)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPricingNow(new Date())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("/api/deals")
        if (!res.ok) throw new Error("Failed to fetch deals")

        const data = await res.json()

        setRawDeals(data || [])
      } catch (error) {
        console.error("Failed to fetch deals:", error)
        setRawDeals([])
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  function toggleValue(
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  function inferCategoryFromDeal(deal: DealProps): string {
    const haystack = `${deal.title} ${deal.vendor}`.toLowerCase()

    if (
      haystack.includes("bakery") ||
      haystack.includes("cake") ||
      haystack.includes("bread") ||
      haystack.includes("sweet") ||
      haystack.includes("pastry")
    ) {
      return "Bakery"
    }

    if (
      haystack.includes("grocery") ||
      haystack.includes("groceries") ||
      haystack.includes("vegetable") ||
      haystack.includes("fruit") ||
      haystack.includes("market")
    ) {
      return "Groceries"
    }

    if (
      haystack.includes("cafe") ||
      haystack.includes("coffee") ||
      haystack.includes("snack") ||
      haystack.includes("tea")
    ) {
      return "Cafe"
    }

    return "Meals"
  }

  function matchesPickupTime(pickupWindow: string, filter: PickupValue) {
    if (filter === "any") return true

    const hourMatch = pickupWindow.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i)
    if (!hourMatch) return true

    let hour = parseInt(hourMatch[1], 10)
    const meridiem = hourMatch[3].toUpperCase()

    if (meridiem === "PM" && hour !== 12) hour += 12
    if (meridiem === "AM" && hour === 12) hour = 0

    if (filter === "morning") return hour >= 8 && hour < 12
    if (filter === "afternoon") return hour >= 12 && hour < 17
    if (filter === "evening") return hour >= 17 && hour < 21
    if (filter === "night") return hour >= 21 || hour < 8

    return true
  }

  const filteredDeals = useMemo(() => {
    let result: DealProps[] = rawDeals.map((d: any) => {
      const livePricing = getLivePricing(
        Number(d.originalPrice) || 0,
        Number(d.discountedPrice) || 0,
        pricingNow
      )

      return {
        id: d.id,
        title: d.title,
        vendor: d.seller?.businessName || "Unknown Vendor",
        distance: d.distance || "Nearby",
        pickupWindow: `${new Date(d.pickupStartTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(d.pickupEndTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        originalPrice: Number(d.originalPrice) || 0,
        discountedPrice: livePricing.liveDiscountedPrice,
        discountPercentage: livePricing.liveDiscountPercentage,
        remainingQuantity: d.quantity || 0,
        imageUrl: d.imageUrl || "https://picsum.photos/seed/food/400/300",
        dietaryTags: d.dietaryTags || [],
        sellerId: d.seller?.id,
        reviews: d.seller?.sellerReviews || [],
        reviewCount: d.seller?.sellerReviews?.length || 0,
        sellerRating: d.seller?.sellerReviews?.length
          ? d.seller.sellerReviews.reduce(
              (sum: number, review: { rating: number }) => sum + review.rating,
              0
            ) / d.seller.sellerReviews.length
          : 0,
      }
    })

    if (locationQuery) {
      const q = locationQuery.toLowerCase()
      result = result.filter((deal) => {
        return (
          deal.title.toLowerCase().includes(q) ||
          deal.vendor.toLowerCase().includes(q) ||
          deal.distance.toLowerCase().includes(q)
        )
      })
    }

    if (pickupTime !== "any") {
      result = result.filter((deal) => matchesPickupTime(deal.pickupWindow, pickupTime))
    }

    if (topCategory !== "all") {
      const topCategoryMap: Record<CategoryValue, string> = {
        all: "All",
        meals: "Meals",
        bakery: "Bakery",
        groceries: "Groceries",
        cafe: "Cafe",
      }

      result = result.filter(
        (deal) => inferCategoryFromDeal(deal) === topCategoryMap[topCategory]
      )
    }

    if (selectedCategories.length > 0) {
      result = result.filter((deal) =>
        selectedCategories.includes(inferCategoryFromDeal(deal))
      )
    }

    if (selectedDietary.length > 0) {
      result = result.filter((deal) => {
        const dealTags = (deal.dietaryTags || []).map((tag) => String(tag).toLowerCase())
        return selectedDietary.some((selectedTag) =>
          dealTags.includes(selectedTag.toLowerCase())
        )
      })
    }

    result = result.filter((deal) => deal.discountedPrice <= priceRange[0])

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.discountedPrice - b.discountedPrice)
        break
      case "discount":
        result.sort((a, b) => b.discountPercentage - a.discountPercentage)
        break
      case "rating":
        result.sort((a, b) => (b.sellerRating || 0) - (a.sellerRating || 0))
        break
      case "recommended":
      default:
        result.sort((a, b) => {
          const scoreA =
            a.discountPercentage * 0.5 +
            (a.sellerRating || 0) * 10 * 0.3 +
            (a.reviewCount || 0) * 0.2
          const scoreB =
            b.discountPercentage * 0.5 +
            (b.sellerRating || 0) * 10 * 0.3 +
            (b.reviewCount || 0) * 0.2
          return scoreB - scoreA
        })
        break
    }

    return result
  }, [
    rawDeals,
    locationQuery,
    pickupTime,
    topCategory,
    selectedCategories,
    selectedDietary,
    priceRange,
    sortBy,
    pricingNow,
  ])

  const hasActiveFilters =
    locationQuery.length > 0 ||
    pickupTime !== "any" ||
    topCategory !== "all" ||
    selectedCategories.length > 0 ||
    selectedDietary.length > 0 ||
    priceRange[0] !== 500

  function clearAllFilters() {
    setSearchInput("")
    setLocationQuery("")
    setPickupTime("any")
    setTopCategory("all")
    setSelectedCategories([])
    setSelectedDietary([])
    setPriceRange([500])
    setSortBy("recommended")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <section className="bg-emerald-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Find Surplus Food Near You
          </h1>

          <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg md:flex-row">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by location, vendor, or item"
                className="h-12 border-slate-200 pl-10 text-slate-900 focus-visible:ring-emerald-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <Select value={pickupTime} onValueChange={(v: PickupValue) => setPickupTime(v)}>
                <SelectTrigger className="h-12 text-slate-900">
                  <SelectValue placeholder="Pickup Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
                  <SelectItem value="night">Night (9PM - 12AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={topCategory}
                onValueChange={(v: CategoryValue) => setTopCategory(v)}
              >
                <SelectTrigger className="h-12 text-slate-900">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="meals">Meals & Restaurant</SelectItem>
                  <SelectItem value="bakery">Bakery & Sweets</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="cafe">Cafe & Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="h-12 px-8 font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="flex-1 py-12">
        <div className="container mx-auto flex flex-col gap-8 px-4 md:flex-row">
          <div className="mb-4 flex justify-end md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <FilterSidebarContent
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedDietary={selectedDietary}
                    setSelectedDietary={setSelectedDietary}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    toggleValue={toggleValue}
                    clearAllFilters={clearAllFilters}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <aside className="hidden w-72 shrink-0 md:block">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>

              <FilterSidebarContent
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedDietary={selectedDietary}
                setSelectedDietary={setSelectedDietary}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                toggleValue={toggleValue}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Showing {filteredDeals.length} deal{filteredDeals.length !== 1 ? "s" : ""}
                </h2>
                <p className="text-sm text-slate-500">
                  Fresh deals, smoother browsing, and real-time filters
                </p>
              </div>

              <Select value={sortBy} onValueChange={(v: SortValue) => setSortBy(v)}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price_low">Price (Low to High)</SelectItem>
                  <SelectItem value="discount">Highest Discount</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <DealsSkeletonGrid />
            ) : filteredDeals.length === 0 ? (
              <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">No deals found</h3>
                <p className="mt-2 text-slate-500">
                  Try changing your search or filters to see more results.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={clearAllFilters}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="transition-all duration-200 hover:-translate-y-1"
                  >
                    <DealCard deal={deal} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  )
}

function FilterSidebarContent({
  selectedCategories,
  setSelectedCategories,
  selectedDietary,
  setSelectedDietary,
  priceRange,
  setPriceRange,
  toggleValue,
  clearAllFilters,
}: {
  selectedCategories: string[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>
  selectedDietary: string[]
  setSelectedDietary: React.Dispatch<React.SetStateAction<string[]>>
  priceRange: number[]
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>
  toggleValue: (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => void
  clearAllFilters: () => void
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Category</h3>
        <div className="space-y-3">
          {CATEGORY_OPTIONS.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() =>
                  toggleValue(cat, selectedCategories, setSelectedCategories)
                }
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="cursor-pointer text-sm font-normal text-slate-600"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Dietary</h3>
        <div className="space-y-3">
          {DIETARY_OPTIONS.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag}`}
                checked={selectedDietary.includes(tag)}
                onCheckedChange={() =>
                  toggleValue(tag, selectedDietary, setSelectedDietary)
                }
              />
              <Label
                htmlFor={`tag-${tag}`}
                className="cursor-pointer text-sm font-normal text-slate-600"
              >
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Max Price</h3>
          <span className="text-sm font-medium text-emerald-600">৳{priceRange[0]}</span>
        </div>

        <Slider
          defaultValue={[500]}
          value={priceRange}
          onValueChange={setPriceRange}
          max={2000}
          step={50}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-slate-400">
          <span>৳0</span>
          <span>৳2000+</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={clearAllFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

function DealsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        >
          <div className="h-48 animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

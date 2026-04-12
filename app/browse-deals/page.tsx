"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Clock, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Dummy Data
const DUMMY_DEALS: DealProps[] = [
  {
    id: "1",
    title: "Assorted Pastry Box",
    vendor: "Dhaka Sweets & Bakery",
    distance: "Gulshan 2 (1.2 km)",
    pickupWindow: "8:00 PM - 10:00 PM",
    originalPrice: 500,
    discountedPrice: 250,
    discountPercentage: 50,
    remainingQuantity: 2,
    imageUrl: "https://picsum.photos/seed/bakerybd/400/300",
    dietaryTags: ["Vegetarian"]
  },
  {
    id: "2",
    title: "Chicken Biryani Pack",
    vendor: "Nawab&apos;s Kitchen",
    distance: "Dhanmondi (3.5 km)",
    pickupWindow: "10:30 PM - 11:30 PM",
    originalPrice: 300,
    discountedPrice: 180,
    discountPercentage: 40,
    remainingQuantity: 5,
    imageUrl: "https://picsum.photos/seed/biryani/400/300",
    dietaryTags: ["Halal"]
  },
  {
    id: "3",
    title: "Surprise Sandwich Box",
    vendor: "The Daily Roast",
    distance: "Banani (2.1 km)",
    pickupWindow: "7:00 PM - 8:30 PM",
    originalPrice: 300,
    discountedPrice: 120,
    discountPercentage: 60,
    remainingQuantity: 1,
    imageUrl: "https://picsum.photos/seed/cafe/400/300",
    dietaryTags: ["Halal"]
  },
  {
    id: "4",
    title: "Fresh Produce Bundle",
    vendor: "Green Mart",
    distance: "Mirpur (5.0 km)",
    pickupWindow: "All Day",
    originalPrice: 500,
    discountedPrice: 350,
    discountPercentage: 30,
    remainingQuantity: 10,
    imageUrl: "https://picsum.photos/seed/grocery/400/300",
    dietaryTags: ["Vegetarian", "Vegan"]
  },
  {
    id: "5",
    title: "Mixed Kebab Platter",
    vendor: "Kebab Express",
    distance: "Uttara (8.2 km)",
    pickupWindow: "11:00 PM - 12:00 AM",
    originalPrice: 800,
    discountedPrice: 400,
    discountPercentage: 50,
    remainingQuantity: 3,
    imageUrl: "https://picsum.photos/seed/kebab/400/300",
    dietaryTags: ["Halal"]
  },
  {
    id: "6",
    title: "End of Day Bread Bag",
    vendor: "Artisan Bakes",
    distance: "Mohakhali (2.8 km)",
    pickupWindow: "9:00 PM - 10:00 PM",
    originalPrice: 250,
    discountedPrice: 100,
    discountPercentage: 60,
    remainingQuantity: 4,
    imageUrl: "https://picsum.photos/seed/bread/400/300",
    dietaryTags: ["Vegetarian"]
  },
]

export default function BrowseDeals() {
  const [priceRange, setPriceRange] = useState([500])
  const [deals, setDeals] = useState<DealProps[]>(DUMMY_DEALS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch('/api/deals')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            // Map backend data to DealProps
            const mappedDeals = data.map((d: any) => ({
              id: d.id,
              title: d.title,
              vendor: d.seller?.businessName || "Unknown Vendor",
              distance: "Nearby", // Placeholder as we don't have location yet
              pickupWindow: `${new Date(d.pickupStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(d.pickupEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
              originalPrice: d.originalPrice,
              discountedPrice: d.discountedPrice,
              discountPercentage: Math.round(((d.originalPrice - d.discountedPrice) / d.originalPrice) * 100),
              remainingQuantity: d.quantity,
              imageUrl: d.imageUrl || "https://picsum.photos/seed/food/400/300",
              dietaryTags: d.dietaryTags || []
            }))
            setDeals(mappedDeals)
          }
        }
      } catch (error) {
        console.error("Failed to fetch deals, using dummy data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header / Search Bar */}
      <section className="bg-emerald-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Find Surplus Food Near You</h1>
          
          <div className="bg-white rounded-xl p-4 shadow-lg max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input placeholder="Enter your location (e.g., Gulshan, Dhanmondi)" className="pl-10 h-12 text-slate-900" />
            </div>
            <div className="flex-1">
              <Select>
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
              <Select>
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
            <Button className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Button */}
          <div className="md:hidden flex justify-end mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <FilterSidebarContent priceRange={priceRange} setPriceRange={setPriceRange} />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </h2>
              <FilterSidebarContent priceRange={priceRange} setPriceRange={setPriceRange} />
            </div>
          </aside>

          {/* Deals Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Showing {deals.length} deals near you</h2>
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="distance">Distance (Nearest)</SelectItem>
                  <SelectItem value="price_low">Price (Low to High)</SelectItem>
                  <SelectItem value="discount">Highest Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-10 text-slate-500">Loading deals...</div>
              ) : (
                deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))
              )}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="px-12">Load More Deals</Button>
            </div>
          </main>
        </div>
      </section>
    </div>
  )
}

function FilterSidebarContent({ priceRange, setPriceRange }: { priceRange: number[], setPriceRange: (v: number[]) => void }) {
  return (
    <div className="space-y-8">
      {/* Category */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Category</h3>
        <div className="space-y-2">
          {["Meals", "Bakery", "Groceries", "Cafe"].map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox id={`cat-${cat}`} />
              <Label htmlFor={`cat-${cat}`} className="text-sm font-normal text-slate-600">{cat}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Dietary Tags */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Dietary</h3>
        <div className="space-y-2">
          {["Halal", "Vegetarian", "Vegan"].map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox id={`tag-${tag}`} />
              <Label htmlFor={`tag-${tag}`} className="text-sm font-normal text-slate-600">{tag}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Max Price</h3>
          <span className="text-sm font-medium text-emerald-600">৳{priceRange[0]}</span>
        </div>
        <Slider
          defaultValue={[500]}
          max={2000}
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>৳0</span>
          <span>৳2000+</span>
        </div>
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Distance</h3>
        <div className="space-y-2">
          {["< 1 km", "< 3 km", "< 5 km", "< 10 km"].map((dist) => (
            <div key={dist} className="flex items-center space-x-2">
              <Checkbox id={`dist-${dist}`} />
              <Label htmlFor={`dist-${dist}`} className="text-sm font-normal text-slate-600">{dist}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Apply Filters</Button>
    </div>
  )
}

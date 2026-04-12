import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ShoppingBag, Utensils, Store, Tag, Smile } from "lucide-react"
import Link from "next/link"

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How FoodSaver BD Works</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            A simple, win-win solution to reduce food waste in Bangladesh.
          </p>
        </div>
      </section>

      {/* For Users */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">For Food Savers (Users)</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get delicious food at a fraction of the price while helping the planet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">1. Find a Deal</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Browse our platform to find surplus food from local restaurants, bakeries, and grocery stores. Filter by location, price, and dietary preferences.
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">2. Reserve & Pay</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Reserve your meal or &quot;Surprise Box&quot; at up to 70% off the regular price. Pay securely online or choose to pay at the store during pickup.
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <Utensils className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">3. Pick Up & Enjoy</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Head to the store during the specified pickup window. Show your reservation code, grab your food, and enjoy a great meal!
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/browse-deals">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">Start Browsing Deals</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Partners */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">For Partners (Businesses)</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Turn your daily surplus into revenue and attract new customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <Store className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">1. List Surplus</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                At the end of the day or shift, simply list the number of surplus meals or &quot;Surprise Boxes&quot; you have available on our partner dashboard.
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <Tag className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">2. Customers Reserve</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Local users see your deals and reserve them. You&apos;ll get notified instantly. It&apos;s a great way to bring foot traffic to your store.
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <Smile className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">3. Hand Over & Earn</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Customers arrive during your set pickup window. Verify their code, hand over the food, and recover costs that would have been lost.
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/partner-with-us">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">Become a Partner</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

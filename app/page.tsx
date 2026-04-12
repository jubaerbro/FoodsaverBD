import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MapPin, Clock, Search, ShoppingBag, Utensils, Leaf, TrendingDown, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://picsum.photos/seed/dhakafood/1920/1080"
            alt="Food background"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-emerald-800/50 text-emerald-100 border-emerald-700">
            Now available in Dhaka & Chittagong
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
            Save Food. <span className="text-emerald-400">Save Money.</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl leading-relaxed">
            Discover delicious surplus meals from local restaurants, bakeries, and cafes at up to 70% off. Join the movement to reduce food waste in Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/browse-deals">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold">
                Browse Deals Near You
              </Button>
            </Link>
            <Link href="/partner-with-us">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-emerald-500 text-emerald-50 hover:bg-emerald-800/50">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How FoodSaver BD Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Three simple steps to enjoy great food while helping the planet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">1. Discover</h3>
              <p className="text-slate-600">Find surplus food deals from your favorite local spots on our platform.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">2. Reserve</h3>
              <p className="text-slate-600">Book your meal at a massive discount. Pay securely online or at pickup.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <Utensils className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">3. Pick Up</h3>
              <p className="text-slate-600">Head to the store during the specified pickup window and enjoy your meal!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Featured Deals</h2>
              <p className="text-slate-600">Grab these hot offers before they&apos;re gone!</p>
            </div>
            <Link href="/browse-deals" className="hidden md:flex items-center text-emerald-600 font-semibold hover:text-emerald-700">
              View all deals <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dummy Deal 1 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image src="https://picsum.photos/seed/bakerybd/400/300" alt="Bakery Items" fill className="object-cover" referrerPolicy="no-referrer" />
                <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">50% OFF</Badge>
                <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-slate-900 font-bold">2 Left</Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Assorted Pastry Box</CardTitle>
                    <CardDescription className="text-emerald-700 font-medium">Dhaka Sweets & Bakery</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin className="w-4 h-4 mr-1" /> Gulshan 2 (1.2 km)
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1" /> Pickup: 8:00 PM - 10:00 PM
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-slate-900">৳250</span>
                  <span className="text-sm text-slate-400 line-through ml-2">৳500</span>
                </div>
                <Button size="sm">Reserve</Button>
              </CardFooter>
            </Card>

            {/* Dummy Deal 2 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image src="https://picsum.photos/seed/biryani/400/300" alt="Biryani" fill className="object-cover" referrerPolicy="no-referrer" />
                <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">40% OFF</Badge>
                <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-slate-900 font-bold">5 Left</Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Chicken Biryani Pack</CardTitle>
                    <CardDescription className="text-emerald-700 font-medium">Nawab&apos;s Kitchen</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin className="w-4 h-4 mr-1" /> Dhanmondi (3.5 km)
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1" /> Pickup: 10:30 PM - 11:30 PM
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-slate-900">৳180</span>
                  <span className="text-sm text-slate-400 line-through ml-2">৳300</span>
                </div>
                <Button size="sm">Reserve</Button>
              </CardFooter>
            </Card>

            {/* Dummy Deal 3 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image src="https://picsum.photos/seed/cafe/400/300" alt="Cafe Food" fill className="object-cover" referrerPolicy="no-referrer" />
                <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">60% OFF</Badge>
                <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-slate-900 font-bold">1 Left</Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Surprise Sandwich Box</CardTitle>
                    <CardDescription className="text-emerald-700 font-medium">The Daily Roast</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin className="w-4 h-4 mr-1" /> Banani (2.1 km)
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1" /> Pickup: 7:00 PM - 8:30 PM
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-slate-900">৳120</span>
                  <span className="text-sm text-slate-400 line-through ml-2">৳300</span>
                </div>
                <Button size="sm">Reserve</Button>
              </CardFooter>
            </Card>

            {/* Dummy Deal 4 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image src="https://picsum.photos/seed/grocery/400/300" alt="Groceries" fill className="object-cover" referrerPolicy="no-referrer" />
                <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">30% OFF</Badge>
                <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-slate-900 font-bold">10+ Left</Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Fresh Produce Bundle</CardTitle>
                    <CardDescription className="text-emerald-700 font-medium">Green Mart</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin className="w-4 h-4 mr-1" /> Mirpur (5.0 km)
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1" /> Pickup: All Day
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-slate-900">৳350</span>
                  <span className="text-sm text-slate-400 line-through ml-2">৳500</span>
                </div>
                <Button size="sm">Reserve</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/browse-deals">
              <Button variant="outline" className="w-full">View all deals</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Impact Together</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-emerald-800/50 border border-emerald-700/50">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <div className="text-4xl font-extrabold mb-2">12,500+</div>
              <div className="text-emerald-100 font-medium">Meals Saved</div>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-800/50 border border-emerald-700/50">
              <TrendingDown className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <div className="text-4xl font-extrabold mb-2">৳2.5M+</div>
              <div className="text-emerald-100 font-medium">Money Saved by Users</div>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-800/50 border border-emerald-700/50">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <div className="text-4xl font-extrabold mb-2">31.2</div>
              <div className="text-emerald-100 font-medium">Tons of CO2e Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">What People Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-slate-50 border-none shadow-sm">
              <CardHeader>
                <div className="flex text-amber-400 mb-2">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <CardDescription className="text-base text-slate-700 italic">
                  &quot;I love picking up a surprise bakery box on my way home from work. Great food, amazing price, and I feel good about not letting it go to waste!&quot;
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold">S</div>
                  <div>
                    <div className="font-semibold text-slate-900">Sadia R.</div>
                    <div className="text-xs text-slate-500">Dhaka</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card className="bg-slate-50 border-none shadow-sm">
              <CardHeader>
                <div className="flex text-amber-400 mb-2">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <CardDescription className="text-base text-slate-700 italic">
                  &quot;As a restaurant owner, throwing away perfectly good food at the end of the night broke my heart. FoodSaver BD helps us recover costs and find new customers.&quot;
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">T</div>
                  <div>
                    <div className="font-semibold text-slate-900">Tanvir A.</div>
                    <div className="text-xs text-slate-500">Restaurant Owner</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card className="bg-slate-50 border-none shadow-sm">
              <CardHeader>
                <div className="flex text-amber-400 mb-2">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <CardDescription className="text-base text-slate-700 italic">
                  &quot;The app is so easy to use. I check it every afternoon to see what&apos;s available for dinner. Highly recommended for students on a budget!&quot;
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">F</div>
                  <div>
                    <div className="font-semibold text-slate-900">Fahim M.</div>
                    <div className="text-xs text-slate-500">University Student</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-white rounded-xl border p-2">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-lg">Is the food safe to eat?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-600">
                Absolutely! The food listed on FoodSaver BD is fresh surplus from that day. It&apos;s the exact same high-quality food you would buy at full price, just unsold at the end of the business day or shift.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b-0 border-t">
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-lg">How do I pay?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-600">
                Currently, you can reserve a meal on the platform and pay directly at the store when you pick it up. We are working on integrating digital payments like bKash and Nagad very soon!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b-0 border-t">
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-lg">What is a &quot;Surprise Box&quot;?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-600">
                Because businesses don&apos;t always know exactly what will be left over, many offer a &quot;Surprise Box&quot;. You&apos;ll get a selection of their delicious items at a fraction of the cost. It&apos;s a fun and tasty surprise!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-b-0 border-t">
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-lg">Can I cancel my reservation?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-600">
                Yes, you can cancel up to 2 hours before the pickup window begins. This gives the store a chance to offer the food to someone else.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-emerald-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Whether you&apos;re hungry for a deal or a business looking to reduce waste, there&apos;s a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/browse-deals">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-white text-emerald-700 hover:bg-slate-100 font-bold">
                Start Saving Food
              </Button>
            </Link>
            <Link href="/partner-with-us">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-white text-white hover:bg-emerald-700">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

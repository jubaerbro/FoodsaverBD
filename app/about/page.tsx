import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, HeartHandshake, Globe } from "lucide-react"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FoodSaver BD</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            We are on a mission to eliminate food waste in Bangladesh, one meal at a time.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://picsum.photos/seed/dhakamarket/800/600" 
                alt="Dhaka Food Market" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Every day, thousands of tons of perfectly good food are thrown away by restaurants, bakeries, and grocery stores across Bangladesh. At the same time, many people are looking for affordable, high-quality meals.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                FoodSaver BD was founded with a simple idea: connect these two groups. By providing a platform for businesses to sell their daily surplus at a discount, we create a win-win-win situation. Businesses recover costs, consumers get great deals, and together, we help the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sustainability First</h3>
              <p className="text-slate-600">
                We believe that reducing food waste is one of the most effective ways to fight climate change and protect our environment.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Community Driven</h3>
              <p className="text-slate-600">
                We build strong relationships with local businesses and empower individuals to make a positive impact in their neighborhoods.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mx-auto">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Accessible to All</h3>
              <p className="text-slate-600">
                Good food shouldn&apos;t be a luxury. We strive to make high-quality meals affordable and accessible to everyone in Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Join the Movement</h2>
          <p className="text-xl text-slate-600 mb-10">
            Whether you want to save food, partner your business, or join our team, there&apos;s a place for you at FoodSaver BD.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/browse-deals">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-emerald-600 hover:bg-emerald-700">
                Start Saving Food
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { CheckCircle2, TrendingUp, Users, Leaf } from "lucide-react"

export default function PartnerWithUs() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('ownerName'),
      email: formData.get('email'),
      role: 'SELLER',
      mode: 'signup',
      businessName: formData.get('shopName'),
      phone: formData.get('phone'),
      address: formData.get('area'),
    }

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        const supabase = createSupabaseBrowserClient()
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: String(data.email),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (authError) {
          setError(authError.message)
          return
        }

        setSuccess(true)
      } else {
        const errData = await res.json()
        setError(errData.error || 'Failed to submit application')
      }
    } catch (err) {
      setError('An error occurred while submitting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner With FoodSaver BD</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Turn your daily surplus food into extra revenue, attract new customers, and help reduce food waste in Bangladesh.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Benefits Section */}
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Why join us?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Recover Sunk Costs</h3>
                      <p className="text-slate-600">Instead of throwing away perfectly good food at the end of the day, sell it at a discount and recover your production costs.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Attract New Customers</h3>
                      <p className="text-slate-600">Reach thousands of local users who might not have tried your food otherwise. Many return as full-paying customers!</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Boost Your Green Image</h3>
                      <p className="text-slate-600">Show your community that you care about the environment by actively reducing food waste and CO2 emissions.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Trust & Verification
                </h3>
                <p className="text-emerald-800 text-sm mb-4">
                  We verify all our partners to ensure food safety and quality standards are met. Once you apply, our team will contact you within 24 hours to complete the onboarding process.
                </p>
                <ul className="text-sm text-emerald-700 space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> No signup fees</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Flexible listing options</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Dedicated support team</li>
                </ul>
              </div>
            </div>

            {/* Application Form */}
            <div>
              <Card className="shadow-lg border-0 ring-1 ring-slate-200">
                <CardHeader className="bg-white border-b pb-6">
                  <CardTitle className="text-2xl text-slate-900">Apply to become a partner</CardTitle>
                  <CardDescription className="text-slate-500">
                    Fill out this quick form and we&apos;ll be in touch shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  {success ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
                      <p className="text-slate-600">We sent a magic link to your email. Open it to activate your seller account. Your shop will remain pending until admin approval.</p>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="shopName">Shop/Restaurant Name *</Label>
                            <Input id="shopName" name="shopName" placeholder="e.g. Dhaka Sweets" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ownerName">Owner/Manager Name *</Label>
                            <Input id="ownerName" name="ownerName" placeholder="e.g. Rahim Uddin" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="01XXXXXXXXX" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" name="email" type="email" placeholder="contact@shop.com" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="area">Location/Area *</Label>
                          <Input id="area" name="area" placeholder="e.g. Gulshan 2, Dhaka" required />
                        </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type">Business Type *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="restaurant">Restaurant</SelectItem>
                              <SelectItem value="bakery">Bakery & Sweets</SelectItem>
                              <SelectItem value="cafe">Cafe / Coffee Shop</SelectItem>
                              <SelectItem value="grocery">Grocery / Supermarket</SelectItem>
                              <SelectItem value="hotel">Hotel / Buffet</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="surplus">Est. Daily Surplus Meals</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select amount" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-5">1 - 5 meals</SelectItem>
                              <SelectItem value="5-10">5 - 10 meals</SelectItem>
                              <SelectItem value="10-20">10 - 20 meals</SelectItem>
                              <SelectItem value="20+">20+ meals</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Information (Optional)</Label>
                        <Textarea id="message" placeholder="Tell us a bit about what kind of food you typically have left over..." className="resize-none" rows={3} />
                      </div>
                    </div>

                      <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700">
                        {loading ? "Submitting..." : "Submit Application"}
                      </Button>
                      <p className="text-center text-xs text-slate-500 mt-4">
                        By submitting this form, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  )
}

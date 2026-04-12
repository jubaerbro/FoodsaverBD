"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
}

export function DealCard({ deal }: { deal: DealProps }) {
  const [isReserving, setIsReserving] = useState(false)
  const [reservationCode, setReservationCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReserve = async () => {
    setIsReserving(true)
    setError(null)
    try {
      // We need a token to reserve, but since we don't have a full auth flow UI,
      // we'll try to get it from localStorage or just mock it if it fails.
      const token = localStorage.getItem('token')
      
      if (!token) {
        // Mock reservation for UI purposes if no backend auth
        setTimeout(() => {
          setReservationCode("MOCK-" + Math.floor(Math.random() * 10000))
          setIsReserving(false)
        }, 1000)
        return
      }

      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dealId: deal.id, quantity: 1 })
      })

      const data = await res.json()
      
      if (res.ok) {
        setReservationCode(data.reservation.orderCode)
      } else {
        setError(data.error || "Failed to reserve")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setIsReserving(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
          <div className="relative h-48 w-full shrink-0">
            <Image 
              src={deal.imageUrl} 
              alt={deal.title} 
              fill 
              className="object-cover" 
              referrerPolicy="no-referrer" 
            />
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              {deal.discountPercentage}% OFF
            </Badge>
            <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-slate-900 font-bold">
              {deal.remainingQuantity} Left
            </Badge>
          </div>
          <CardHeader className="p-4 pb-2 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg line-clamp-1">{deal.title}</CardTitle>
                <CardDescription className="text-emerald-700 font-medium line-clamp-1">
                  {deal.vendor}
                </CardDescription>
              </div>
            </div>
            {deal.dietaryTags && deal.dietaryTags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {deal.dietaryTags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2 shrink-0">
            <div className="flex items-center text-sm text-slate-500">
              <MapPin className="w-4 h-4 mr-1 shrink-0" /> <span className="truncate">{deal.distance}</span>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              <Clock className="w-4 h-4 mr-1 shrink-0" /> <span className="truncate">Pickup: {deal.pickupWindow}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between shrink-0">
            <div>
              <span className="text-lg font-bold text-slate-900">৳{deal.discountedPrice}</span>
              <span className="text-sm text-slate-400 line-through ml-2">৳{deal.originalPrice}</span>
            </div>
            <Button size="sm">View</Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{deal.title}</DialogTitle>
          <DialogDescription className="text-emerald-700 font-medium text-base">
            {deal.vendor}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative h-64 w-full rounded-md overflow-hidden my-4">
          <Image 
            src={deal.imageUrl} 
            alt={deal.title} 
            fill 
            className="object-cover" 
            referrerPolicy="no-referrer" 
          />
          <Badge className="absolute top-3 left-3 bg-red-500 text-base px-3 py-1">
            {deal.discountPercentage}% OFF
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-slate-500 flex items-center"><MapPin className="w-4 h-4 mr-1" /> Location</span>
            <span className="font-medium">{deal.distance}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-slate-500 flex items-center"><Clock className="w-4 h-4 mr-1" /> Pickup Window</span>
            <span className="font-medium">{deal.pickupWindow}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-slate-500">Original Price</span>
            <span className="font-medium line-through text-slate-400">৳{deal.originalPrice}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-slate-500">Discounted Price</span>
            <span className="font-bold text-xl text-emerald-600">৳{deal.discountedPrice}</span>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg border mb-4">
          <h4 className="font-semibold mb-2 text-slate-900">Pickup Instructions</h4>
          <p className="text-sm text-slate-600">
            Show your reservation code at the counter. Please bring your own bag to help reduce plastic waste!
          </p>
          <div className="mt-3 text-xs text-slate-500 italic">
            * Note: Payment can be made at the store. bKash/Nagad integration coming soon!
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          {reservationCode ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center">
              <h4 className="font-bold text-emerald-800 mb-1">Reservation Confirmed!</h4>
              <p className="text-sm text-emerald-600 mb-2">Your order code is:</p>
              <div className="text-2xl font-mono font-bold tracking-widest text-slate-900 bg-white py-2 rounded border">{reservationCode}</div>
              <p className="text-xs text-slate-500 mt-3">Show this code at the store during pickup.</p>
            </div>
          ) : (
            <>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button 
                className="w-full text-lg h-12 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleReserve}
                disabled={isReserving || deal.remainingQuantity <= 0}
              >
                {isReserving ? "Reserving..." : `Reserve Now (৳${deal.discountedPrice})`}
              </Button>
              <p className="text-center text-xs text-slate-500">
                Only {deal.remainingQuantity} left! Hurry before it&apos;s gone.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

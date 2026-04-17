import { NextResponse } from "next/server"
import { getHomepageDeals } from "@/lib/homepage-deals"

export async function GET() {
  try {
    const deals = await getHomepageDeals()
    return NextResponse.json(deals)
  } catch (error) {
    console.error("Failed to fetch homepage deals:", error)
    return NextResponse.json({ error: "Failed to fetch homepage deals" }, { status: 500 })
  }
}

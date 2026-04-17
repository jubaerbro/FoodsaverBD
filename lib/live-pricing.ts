const DHAKA_TIME_ZONE = "Asia/Dhaka"
const NIGHT_START_HOUR = 20
const NIGHT_END_HOUR = 6
const HOURLY_DISCOUNT_STEP = 10
const MAX_DISCOUNT_PERCENTAGE = 90

export type LivePricing = {
  baseDiscountPercentage: number
  liveDiscountPercentage: number
  liveDiscountedPrice: number
  savingsAmount: number
  nightHoursElapsed: number
  isNightPricingActive: boolean
}

function getLocalHourAndMinute(date: Date, timeZone = DHAKA_TIME_ZONE) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  })

  const parts = formatter.formatToParts(date)
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0")
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0")

  return { hour, minute }
}

function getNightHoursElapsed(date: Date, timeZone = DHAKA_TIME_ZONE) {
  const { hour, minute } = getLocalHourAndMinute(date, timeZone)
  const totalMinutes = hour * 60 + minute

  if (hour >= NIGHT_START_HOUR) {
    return Math.floor((totalMinutes - NIGHT_START_HOUR * 60) / 60)
  }

  if (hour < NIGHT_END_HOUR) {
    return Math.floor((totalMinutes + (24 - NIGHT_START_HOUR) * 60) / 60)
  }

  return 0
}

export function getLivePricing(
  originalPrice: number,
  discountedPrice: number,
  now = new Date(),
  timeZone = DHAKA_TIME_ZONE
): LivePricing {
  const safeOriginalPrice = Number(originalPrice) || 0
  const safeDiscountedPrice = Number(discountedPrice) || 0
  const { hour } = getLocalHourAndMinute(now, timeZone)
  const baseDiscountPercentage =
    safeOriginalPrice > 0
      ? Math.round(((safeOriginalPrice - safeDiscountedPrice) / safeOriginalPrice) * 100)
      : 0

  const nightHoursElapsed = getNightHoursElapsed(now, timeZone)
  const isNightPricingActive = hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR
  const liveDiscountPercentage = Math.min(
    MAX_DISCOUNT_PERCENTAGE,
    Math.max(baseDiscountPercentage + nightHoursElapsed * HOURLY_DISCOUNT_STEP, baseDiscountPercentage)
  )
  const liveDiscountedPrice =
    safeOriginalPrice > 0
      ? Math.max(Math.round(safeOriginalPrice * (1 - liveDiscountPercentage / 100)), 1)
      : 0

  return {
    baseDiscountPercentage,
    liveDiscountPercentage,
    liveDiscountedPrice,
    savingsAmount: Math.max(safeOriginalPrice - liveDiscountedPrice, 0),
    nightHoursElapsed,
    isNightPricingActive,
  }
}

export function withLivePricing<T extends { originalPrice: number; discountedPrice: number }>(
  deal: T,
  now = new Date(),
  timeZone = DHAKA_TIME_ZONE
) {
  const pricing = getLivePricing(deal.originalPrice, deal.discountedPrice, now, timeZone)

  return {
    ...deal,
    ...pricing,
  }
}

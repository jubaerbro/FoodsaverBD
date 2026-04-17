import Image from "next/image"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, Clock3, Leaf, MapPin, Quote, Sparkles, Star, TrendingDown, UtensilsCrossed } from "lucide-react"
import { getHomepageDeals } from "@/lib/homepage-deals"

const impactStats = [
  {
    label: "Meals redirected",
    value: "12,500+",
    note: "Quality food recovered from daily surplus.",
    icon: UtensilsCrossed,
  },
  {
    label: "Customer savings",
    value: "Tk 2.5M+",
    note: "Real value returned to families, students, and commuters.",
    icon: TrendingDown,
  },
  {
    label: "CO2e avoided",
    value: "31.2 tons",
    note: "Waste reduction with measurable local impact.",
    icon: Leaf,
  },
]

const testimonials = [
  {
    quote:
      "I now check FoodSaver before dinner the same way I check maps before leaving work. The experience feels curated, not random.",
    name: "Sadia Rahman",
    role: "Regular buyer, Dhaka",
  },
  {
    quote:
      "The platform helps us move surplus without cheapening our brand. It feels premium enough to match the kind of restaurant we run.",
    name: "Tanvir Ahmed",
    role: "Restaurant partner",
  },
  {
    quote:
      "The listings are clear, pickup is simple, and the pricing makes sense. For students, it feels like finding a smart shortcut rather than a compromise.",
    name: "Fahim Mahmud",
    role: "University student",
  },
]

const faqs = [
  {
    question: "Is the food safe to eat?",
    answer:
      "Yes. Listings come from the same-day surplus of approved businesses. Food is still fresh and intended for normal sale, simply offered later in the day at a lower price.",
  },
  {
    question: "How does payment work today?",
    answer:
      "You reserve through the platform and complete payment with the seller at pickup. The reservation flow is designed to be fast, with digital payment expansion possible later.",
  },
  {
    question: "What should I expect from a surprise box?",
    answer:
      "A surprise box usually contains a curated mix of unsold items from that day. You trade exact selection for stronger pricing and a more sustainable purchase.",
  },
  {
    question: "Can I cancel a reservation?",
    answer:
      "Yes. Reservations can be cancelled before the pickup window begins, giving the seller time to release the item back into inventory.",
  },
]

function formatTaka(value: number) {
  return `Tk ${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(value)}`
}

export default async function Home() {
  const { highlighted, featured, totalLiveDeals } = await getHomepageDeals()

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <section className="relative overflow-hidden px-4 pb-14 pt-8 md:pb-20 md:pt-14">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border-strong)] bg-[linear-gradient(135deg,#5a2030_0%,#451523_52%,#f1d9dc_180%)] text-[var(--text-inverse)] shadow-[var(--shadow-xl)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,247,241,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(216,165,168,0.22),transparent_22%)]" />
            <div className="absolute -right-16 top-12 h-56 w-56 rounded-full border border-[var(--border-inverse)] bg-white/6 blur-2xl" />
            <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-white/8 blur-xl" />

            <div className="relative grid gap-12 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
              <div className="flex flex-col justify-between">
                <div className="reveal-up">
                  <div className="section-kicker border-white/10 bg-white/10 text-[var(--text-inverse)]">
                    Now serving premium surplus across Dhaka
                  </div>
                  <h1 className="mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-[0.92] tracking-[-0.05em] md:text-7xl">
                    Save beautifully made food
                    <span className="editorial-accent ml-3 inline-block text-[var(--accent-soft)]">
                      before the night ends.
                    </span>
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-inverse-muted)] md:text-lg">
                    FoodSaver turns same-day surplus into a polished discovery experience. Reserve standout meals,
                    pastry boxes, and grocery bundles from trusted local sellers at a lower price without the
                    bargain-bin feel.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row reveal-up">
                  <Link href="/browse-deals" className="premium-button px-7">
                    Browse tonight&apos;s deals
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/partner-with-us" className="premium-button premium-button-secondary px-7 !border-white/15 !bg-white/8 !text-[var(--text-inverse)]">
                    Become a partner
                  </Link>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3 reveal-up">
                  <div className="rounded-[1.5rem] border border-[var(--border-inverse)] bg-white/8 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-inverse-muted)]">Average savings</div>
                    <div className="mt-3 text-2xl font-semibold">Up to 70%</div>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--border-inverse)] bg-white/8 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-inverse-muted)]">Pickup flow</div>
                    <div className="mt-3 text-2xl font-semibold">Fast and local</div>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--border-inverse)] bg-white/8 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-inverse-muted)]">Seller quality</div>
                    <div className="mt-3 text-2xl font-semibold">Approval-gated</div>
                  </div>
                </div>
              </div>

              <div className="relative reveal-up">
                <div className="relative mx-auto max-w-[38rem]">
                  <div className="absolute -left-4 top-10 hidden rounded-[1.4rem] border border-white/10 bg-white/10 px-4 py-3 text-sm text-[var(--text-inverse)] backdrop-blur md:block">
                    <div className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[var(--accent-soft)]" />
                      Curated daily at closing hour
                    </div>
                  </div>

                  <div className="surface-card-dark hover-lift overflow-hidden rounded-[2rem] p-3">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                      <Image
                        src="https://picsum.photos/id/292/3852/2556"
                        alt="Editorial plated food arrangement"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2a0d17]/70 via-transparent to-transparent" />
                    </div>

                    <div className="-mt-20 ml-auto mr-3 max-w-[17rem] rounded-[1.6rem] border border-white/10 bg-[rgba(255,247,241,0.12)] p-5 backdrop-blur-xl">
                      <div className="premium-badge !border-white/10 !bg-white/10 !text-[var(--text-inverse)]">
                        {highlighted ? "Highlighted tonight" : "Live marketplace"}
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold leading-tight text-[var(--text-inverse)]">
                        {highlighted ? highlighted.title : "Fresh deals appear here as sellers publish them."}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-inverse-muted)]">
                        {highlighted
                          ? `${highlighted.vendor} · Pickup ${highlighted.pickup} · ${highlighted.discount}.`
                          : "The homepage now reflects real inventory only. Once approved sellers add deals, they will show up here automatically."}
                      </p>
                      {highlighted ? (
                        <Link
                          href={`/products/${highlighted.id}`}
                          className="mt-4 inline-flex text-sm font-semibold text-[var(--text-inverse)] underline-offset-4 hover:underline"
                        >
                          View highlighted deal
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-2 rounded-[1.5rem] border border-[var(--card-border-strong)] bg-[var(--card-bg-strong)] px-5 py-4 shadow-[var(--shadow-md)] md:left-[-2.5rem]">
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Tonight in Dhaka</div>
                    <div className="mt-2 flex items-center gap-2 text-[var(--text-primary)]">
                      <MapPin className="h-4 w-4 text-[var(--brand-soft)]" />
                      <span className="font-medium">
                        {totalLiveDeals} live deal{totalLiveDeals === 1 ? "" : "s"} across approved sellers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="page-shell">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="section-kicker">Featured deals</div>
              <h2 className="section-title mt-5 max-w-3xl text-[var(--text-primary)]">
                Tonight&apos;s best-value picks,
                <span className="editorial-accent ml-3 text-[var(--brand-soft)]">presented with polish.</span>
              </h2>
              <p className="section-subtitle mt-5">
                A sharper card system, stronger image treatment, and clearer pricing hierarchy make each offer feel
                deliberate instead of disposable.
              </p>
            </div>
            <Link href="/browse-deals" className="premium-button w-fit px-7">
              Explore all deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {featured.map((deal, index) => (
                <article
                  key={deal.id}
                  className={`surface-card-strong hover-lift group overflow-hidden rounded-[1.9rem] ${index === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-[1.1fr_0.9fr]" : ""}`}
                >
                  <div className={`relative overflow-hidden ${index === 0 ? "min-h-[24rem]" : "h-72"}`}>
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className="object-cover transition duration-500 ease-[var(--ease-premium)] group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a0d17]/65 via-[#2a0d17]/10 to-transparent" />
                    <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                      <span className="premium-badge !bg-[var(--accent-soft)] !text-[var(--brand-strong)]">{deal.discount}</span>
                      <span className="premium-badge !bg-white/85 !text-[var(--text-primary)]">{deal.stock}</span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-white/75">{deal.highlight}</div>
                      <div className="mt-2 flex items-end gap-3 text-white">
                        <span className="text-3xl font-semibold">{formatTaka(deal.price)}</span>
                        <span className="pb-1 text-sm text-white/65 line-through">{formatTaka(deal.originalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-6 md:p-7">
                    <div>
                      <div className="premium-badge w-fit">{deal.vendor}</div>
                      <h3 className="mt-4 text-2xl font-semibold tracking-[var(--tracking-heading)] text-[var(--text-primary)]">
                        {deal.title}
                      </h3>
                      <div className="mt-5 grid gap-3 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[var(--brand-soft)]" />
                          <span>
                            {deal.location} · {deal.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-[var(--brand-soft)]" />
                          <span>Pickup {deal.pickup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-[var(--card-border)] pt-5">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Reserve tonight</div>
                        <div className="mt-1 text-sm text-[var(--text-secondary)]">Fast pickup, lower waste, better value</div>
                      </div>
                      <Link href={`/products/${deal.id}`} className="premium-button px-6">
                        View deal
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-card-strong rounded-[1.9rem] p-8 text-center">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">No featured deals live yet</h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                Demo cards have been removed. This section now shows only real backend deals from approved sellers.
              </p>
              <Link href="/partner-with-us" className="premium-button mt-6 inline-flex px-7">
                Add seller inventory
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="page-shell">
          <div className="section-dark-elevated overflow-hidden rounded-[2.2rem] border border-[var(--border-inverse)] px-6 py-8 shadow-[var(--shadow-xl)] md:px-10 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <div className="section-kicker border-white/10 bg-white/10 text-[var(--text-inverse)]">Impact at scale</div>
                <h2 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[var(--tracking-tight)] md:text-6xl">
                  A stronger marketplace
                  <span className="editorial-accent ml-3 text-[var(--accent-soft)]">with measurable effect.</span>
                </h2>
                <p className="text-inverse-soft mt-5 max-w-xl text-base leading-8">
                  The platform works when buyers save, sellers recover value, and better food stays in circulation.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {impactStats.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="dark-glass-card rounded-[1.6rem] p-5">
                      <Icon className="h-6 w-6 text-[var(--accent-soft)]" />
                      <div className="mt-5 text-3xl font-semibold">{item.value}</div>
                      <div className="text-inverse-strong mt-2 text-sm font-medium">{item.label}</div>
                      <p className="text-inverse-soft mt-3 text-sm leading-7">{item.note}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <div className="section-kicker">Testimonials</div>
            <h2 className="section-title mt-5 text-[var(--text-primary)]">
              Trusted by buyers and sellers
              <span className="editorial-accent ml-3 text-[var(--brand-soft)]">who care about quality.</span>
            </h2>
            <p className="section-subtitle mt-5">
              The experience should feel refined enough for premium brands and practical enough for repeat daily use.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="surface-card hover-lift rounded-[1.7rem] p-6">
                <Quote className="h-6 w-6 text-[var(--brand-soft)]" />
                <div className="mt-5 flex gap-1 text-[var(--accent-strong)]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-8 text-[var(--text-secondary)]">&quot;{item.quote}&quot;</p>
                <div className="mt-6 border-t border-[var(--card-border)] pt-5">
                  <div className="font-semibold text-[var(--text-primary)]">{item.name}</div>
                  <div className="mt-1 text-sm text-[var(--text-tertiary)]">{item.role}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="max-w-xl">
              <div className="section-kicker">FAQ</div>
              <h2 className="section-title mt-5 text-[var(--text-primary)]">
                Clear answers,
                <span className="editorial-accent ml-3 text-[var(--brand-soft)]">without the startup noise.</span>
              </h2>
              <p className="section-subtitle mt-5">
                The model is simple: better presentation for surplus food, better economics for buyers and sellers.
              </p>
            </div>

            <div className="surface-card-strong rounded-[1.9rem] p-3 md:p-4">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`item-${index}`}
                    className="overflow-hidden rounded-[1.3rem] border-0 px-2 py-1 data-[state=open]:bg-[rgba(216,165,168,0.08)]"
                  >
                    <AccordionTrigger className="px-4 text-left text-base font-semibold text-[var(--text-primary)] hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-5 text-sm leading-8 text-[var(--text-secondary)]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-8 md:pb-24">
        <div className="page-shell">
          <div className="overflow-hidden rounded-[2.1rem] border border-[var(--card-border-strong)] bg-[var(--section-soft)] px-6 py-10 shadow-[var(--shadow-lg)] md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="section-kicker">Join the marketplace</div>
                <h2 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[var(--tracking-tight)] text-[var(--text-primary)] md:text-5xl">
                  Better food economics,
                  <span className="editorial-accent ml-3 text-[var(--brand-soft)]">designed for repeat use.</span>
                </h2>
                <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
                  Browse what is available tonight or onboard your business into a marketplace that treats surplus
                  inventory like a premium opportunity instead of an afterthought.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Link href="/browse-deals" className="premium-button justify-center px-7">
                  Browse deals
                </Link>
                <Link href="/partner-with-us" className="premium-button premium-button-secondary justify-center px-7">
                  Apply as seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

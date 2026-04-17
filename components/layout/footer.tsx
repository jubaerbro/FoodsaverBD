import Link from "next/link"
import { ArrowUpRight, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="premium-footer mt-16 border-t border-white/8 py-16 md:py-20">
      <div className="page-shell">
        <div className="overflow-hidden rounded-[2.2rem] border border-white/8 bg-[linear-gradient(180deg,#4a1a29,#39121d)] px-6 py-8 shadow-[var(--shadow-xl)] md:px-8 md:py-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.95fr_0.95fr_0.95fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-[linear-gradient(145deg,#f1d9dc,#c2868c)] text-[var(--brand-strong)] shadow-[0_12px_30px_rgba(27,10,16,0.2)]">
                  <span className="text-sm font-extrabold tracking-[0.2em]">FS</span>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--footer-text-muted)]">Food rescue commerce</div>
                  <h3 className="mt-1 text-2xl font-bold tracking-[var(--tracking-heading)] text-[var(--footer-text)]">
                    FoodSaver Bangladesh
                  </h3>
                </div>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[var(--footer-text-muted)]">
                A premium marketplace for verified surplus food, better nightly discovery, and smarter recovery for food businesses across Bangladesh.
              </p>
              <Link
                href="/browse-deals"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-[var(--footer-text)] transition-all duration-[var(--duration-fast)] hover:border-[var(--accent-strong)] hover:text-[var(--accent-soft)]"
              >
                Explore live deals
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="flex space-x-3">
                <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[var(--footer-text-muted)] transition-all duration-[var(--duration-fast)] hover:border-[var(--accent-strong)] hover:text-[var(--accent-soft)]">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[var(--footer-text-muted)] transition-all duration-[var(--duration-fast)] hover:border-[var(--accent-strong)] hover:text-[var(--accent-soft)]">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[var(--footer-text-muted)] transition-all duration-[var(--duration-fast)] hover:border-[var(--accent-strong)] hover:text-[var(--accent-soft)]">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--footer-text)]">Marketplace</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/browse-deals" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">Browse Deals</Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">How it works</Link>
                </li>
                <li>
                  <Link href="/about" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">About Us</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--footer-text)]">Operations</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/partner-with-us" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">Seller onboarding</Link>
                </li>
                <li>
                  <Link href="/login" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">Customer and seller login</Link>
                </li>
                <li>
                  <Link href="/admin/auth" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">Admin access</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--footer-text)]">Legal & Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/contact" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">Contact Us</Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="premium-footer-muted transition-colors hover:text-[var(--accent-soft)]">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="premium-footer-muted">&copy; {new Date().getFullYear()} FoodSaver BD. All rights reserved.</p>
            </div>
            <div className="premium-footer-muted">
              Verified sellers. Cleaner recovery. Better food economics.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

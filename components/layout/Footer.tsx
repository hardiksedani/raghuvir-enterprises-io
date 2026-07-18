
'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))] mt-0">
      {/* Main footer grid */}
      <div className="container-page pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo size="sm" />
            <p className="text-sm text-[rgb(var(--muted))] leading-relaxed max-w-xs">
              Your trusted wholesale partner for premium products — serving retailers and dealers across India with quality and speed.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))] flex items-center justify-center text-[rgb(var(--muted))] hover:text-[rgb(var(--primary))] hover:border-[rgb(var(--primary))]/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-[rgb(var(--text))]">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', href: '/' },
                { label: 'My Cart', href: '/cart' },
                { label: 'My Orders', href: '/orders' },
                { label: 'My Profile', href: '/profile' },
                { label: 'Wishlist', href: '/?tab=wishlist' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-[rgb(var(--text))]">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Login', href: '/login' },
                { label: 'Sign Up', href: '/signup' },
                { label: 'Retailer Account', href: '/signup' },
                { label: 'Dealer Account', href: '/signup' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-[rgb(var(--text))]">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[rgb(var(--primary))] mt-0.5 shrink-0" />
                <span className="text-sm text-[rgb(var(--muted))]">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[rgb(var(--primary))] mt-0.5 shrink-0" />
                <span className="text-sm text-[rgb(var(--muted))] break-all">raghuvirenterprisess@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[rgb(var(--primary))] mt-0.5 shrink-0" />
                <span className="text-sm text-[rgb(var(--muted))]">Akola, Maharashtra, India</span>
              </li>
            </ul>

            {/* Business hours */}
            <div className="p-3 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
              <p className="text-xs font-semibold text-[rgb(var(--text))] mb-1">Business Hours</p>
              <p className="text-xs text-[rgb(var(--muted))]">Mon – Sat: 9 AM – 7 PM</p>
              <p className="text-xs text-[rgb(var(--muted))]">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgb(var(--border))]">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[rgb(var(--muted))]">
            © {new Date().getFullYear()} Raghuvir Enterprises. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[rgb(var(--muted))]">Made with ❤️ in India</span>
            <div className="flex gap-3">
              <Link href="/privacy" className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


'use client';

import Link from 'next/link';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))] mt-16">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="" className="link-silent">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="link-silent">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="link-silent">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="link-silent">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="link-silent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="link-silent">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="link-silent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="link-silent">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="link-silent">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="link-silent">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="link-silent">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="link-silent">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-[rgb(var(--muted))] mb-4">
              Subscribe to get updates on new products and special offers.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
              />
              <Button intent="primary" fullWidth type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[rgb(var(--border))] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[rgb(var(--muted))]">
            © {new Date().getFullYear()} Raghuvir Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

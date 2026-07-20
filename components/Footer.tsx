import { Mail } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="aura-ring" aria-hidden="true" />
              <span className="font-display text-lg font-semibold text-ink">
                Relive
              </span>
            </Link>
            <p className="mt-3 text-sm text-ink-muted">
              Where value lives again.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="mailto:hello@relive.app"
                aria-label="Email"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cta-tint text-cta transition-standard hover:bg-cta hover:text-white"
              >
                <Mail size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cta-tint text-cta transition-standard hover:bg-cta hover:text-white"
              >
                <FaFacebook size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cta-tint text-cta transition-standard hover:bg-cta hover:text-white"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cta-tint text-cta transition-standard hover:bg-cta hover:text-white"
              >
                <FaTwitter size={15} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Explore</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-ink">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/items/add" className="hover:text-ink">
                  Sell an Item
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Account</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
              <li>
                <Link href="/login" className="hover:text-ink">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-ink">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/items/manage" className="hover:text-ink">
                  Manage Items
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-ink">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Contact</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
              <li>
                <a href="mailto:hello@relive.app" className="hover:text-ink">
                  hello@relive.app
                </a>
              </li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} Relive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

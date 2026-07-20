"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const iconHoverAnimation = {
    scale: 1.1,
    y: -3,
    transition: { duration: 0.2, ease: "easeOut" }
  };

  const textHoverAnimation = {
    x: 4,
    color: "#fff",
    transition: { duration: 0.2, ease: "easeInOut" }
  };

  const legalHoverAnimation = {
    y: -1,
    color: "#fff",
    transition: { duration: 0.2, ease: "easeInOut" }
  };

  const socialLinks = [
    {
      href: "mailto:chhoa.anika07@gmail.com",
      label: "Email",
      icon: <Mail size={15} />,
    },
    {
      href: "https://m.facebook.com/jonaki.chhoa.9/",
      label: "Facebook",
      icon: <FaFacebook size={15} />,
    },
    {
      href: "https://www.linkedin.com/in/anika-mizan-chhoa",
      label: "LinkedIn",
      icon: <FaLinkedin size={15} />,
    },
    {
      href: "https://www.instagram.com/jonakichhoa?igsh=aDFjajAzbHlibnlk",
      label: "Instagram",
      icon: <FaInstagram size={15} />,
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-ink overflow-hidden transition-all duration-300">
      {/* Signature Brand Ambient Aura */}
      <div className="aura-field opacity-40 mix-blend-screen pointer-events-none" />
      <div className="grain-overlay opacity-[0.02] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          
          {/* Brand Info & Active Socials */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="aura-ring transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                Relive
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/70 font-light">
              Where value lives again.
            </p>
            
            {/* Clickable Social Media Panel */}
            <div className="mt-5 flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.label !== "Email" ? "_blank" : undefined}
                  rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  whileHover={iconHoverAnimation}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-colors duration-200 hover:bg-cta hover:border-cta"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Link Groups */}
          <div>
            <p className="text-sm font-semibold tracking-wider text-white/90 uppercase">Explore</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60 font-light">
              <li>
                <Link href="/">
                  <motion.span whileHover={textHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                    Home
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/explore">
                  <motion.span whileHover={textHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                    Browse Items
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/items/add">
                  <motion.span whileHover={textHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                    Sell an Item
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wider text-white/90 uppercase">Account</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60 font-light">
              <li>
                <Link href="/login">
                  <motion.span whileHover={textHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                    Login
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <motion.span whileHover={textHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                    Register
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <motion.span whileHover={textHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                    Dashboard
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wider text-white/90 uppercase">Contact</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60 font-light">
              <li>
                <motion.a 
                  href="mailto:chhoa.anika07@gmail.com" 
                  whileHover={{ color: "#fff" }}
                  className="inline-block transition-colors duration-200 break-all cursor-pointer"
                >
                  chhoa.anika07@gmail.com
                </motion.a>
              </li>
              <li className="text-white/40">Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Compliance Links */}
        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-light tracking-wide">
          <div>
            © {currentYear} Relive. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/about">
              <motion.span whileHover={legalHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                About Us
              </motion.span>
            </Link>
            <Link href="/privacy">
              <motion.span whileHover={legalHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                Privacy Policy
              </motion.span>
            </Link>
            <Link href="/terms">
              <motion.span whileHover={legalHoverAnimation} className="inline-block transition-colors duration-200 cursor-pointer">
                Terms of Service
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
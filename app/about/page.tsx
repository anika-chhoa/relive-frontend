"use client";

import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AboutPage() {
  const socialLinks = [
    {
      href: "mailto:chhoa.anika07@gmail.com",
      label: "Email Support",
      detail: "chhoa.anika07@gmail.com",
      icon: <Mail className="text-cta" size={20} />,
    },
    {
      href: "https://www.linkedin.com/in/anika-mizan-chhoa",
      label: "LinkedIn Profile",
      detail: "Anika Mizan Chhoa",
      icon: <FaLinkedin className="text-[#0077B5]" size={20} />,
    },
    {
      href: "https://m.facebook.com/jonaki.chhoa.9/",
      label: "Facebook Connect",
      detail: "Jonaki Chhoa",
      icon: <FaFacebook className="text-[#1877F2]" size={20} />,
    },
    {
      href: "https://www.instagram.com/jonakichhoa?igsh=aDFjajAzbHlibnlk",
      label: "Instagram Feed",
      detail: "@jonakichhoa",
      icon: <FaInstagram className="text-[#E1306C]" size={20} />,
    },
  ];

  return (
    <main className="min-h-screen bg-bg text-ink px-6 py-20 sm:px-10 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-cta">Our Story</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Reviving Value, <br />
            <span className="bg-gradient-to-r from-amber-500 to-amber-200 bg-clip-text text-transparent font-normal italic">
              Empowering Community.
            </span>
          </h1>
          <p className="text-lg text-ink-muted font-light leading-relaxed pt-2">
            Relive is more than a pre-owned marketplace. We are a sustainable commerce ecosystem built to give quality items a second life, reduce waste, and create an economic bridge for smart consumers.
          </p>
        </div>

        <div className="h-px bg-border w-full" />

        {/* Business Mission & Vision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">The Mission</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              To drive circular economy principles forward by offering a frictionless, highly-secure, and intuitive platform where items smoothly shift ownership without losing their core value.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">The Core Vision</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              To become Bangladesh&apos;s most trusted consumer-to-consumer (C2C) ecosystem, leveraging modern verification tech stacks to eradicate secondary market fraud and inefficiencies.
            </p>
          </div>
        </div>

        {/* Connect & Social Info Section */}
        <div className="bg-surface/50 border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Connect Directly</h2>
            <p className="text-sm text-ink-muted mt-1"> Have business queries, partnership proposals, or want to track our journey? Get in touch via verified professional channels.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.label !== "Email Support" ? "_blank" : undefined}
                rel={link.label !== "Email Support" ? "noopener noreferrer" : undefined}
                whileHover={{ y: -2, border: "1px solid currentColor" }}
                className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:text-cta transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-bg rounded-lg border border-border group-hover:bg-cta-tint transition-colors">
                    {link.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink-faint uppercase tracking-wider">{link.label}</p>
                    <p className="text-sm font-semibold text-ink break-all mt-0.5">{link.detail}</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-ink-faint group-hover:text-cta transition-colors shrink-0 ml-2" />
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
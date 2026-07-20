// import Link from "next/link";
// import type { ReactNode } from "react";

// interface Stat {
//   value: string;
//   label: string;
// }

// const STATS: Stat[] = [
//   { value: "10,000+", label: "Items relisted" },
//   { value: "5,000+", label: "Members" },
//   { value: "50+", label: "Categories" },
// ];

// interface AuthLayoutProps {
//   eyebrow?: string;
//   title: string;
//   subtitle?: string;
//   children: ReactNode;
// }

// export default function AuthLayout({ eyebrow, title, subtitle, children }: AuthLayoutProps) {
//   return (
//     <div className="flex min-h-[calc(100vh-64px)] w-full">
//       {/* Branding panel — hidden below lg, this is the signature "aura" moment */}
//       <div className="relative hidden w-[44%] shrink-0 overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between">
//         <div className="aura-field" />
//         <div className="grain-overlay" />

//         <div className="relative z-10 p-12">
//           <Link href="/" className="flex items-center gap-2.5">
//             <span
//               className="aura-ring"
//               style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.25))" }}
//               aria-hidden="true"
//             />
//             <span className="font-display text-2xl font-semibold text-white">
//               Relive
//             </span>
//           </Link>
//         </div>

//         <div className="relative z-10 px-12 pb-14">
//           <h2 className="font-display text-[2.35rem] italic leading-[1.15] text-white">
//             Where value lives again.
//           </h2>
//           <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/75">
//             Every item here has a story. List what you no longer need, find
//             what someone else let go of — and give it a second life.
//           </p>

//           <div className="mt-10 flex gap-8">
//             {STATS.map((s) => (
//               <div key={s.label}>
//                 <p className="font-display text-2xl font-semibold text-white">
//                   {s.value}
//                 </p>
//                 <p className="mt-1 text-xs uppercase tracking-wide text-white/60">
//                   {s.label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Form panel */}
//       <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
//         <div className="w-full max-w-[420px]">
//           {eyebrow && (
//             <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cta">
//               {eyebrow}
//             </p>
//           )}
//           <h1 className="font-display text-[2rem] font-medium text-ink">
//             {title}
//           </h1>
//           {subtitle && (
//             <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
//           )}

//           <div className="mt-8">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// }


import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";

interface AuthLayoutProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export default function AuthLayout({ eyebrow, title, subtitle, children, style }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full bg-bg">
      {/* Branding panel — Left Side (Hero Element) */}
      <div 
        className="relative hidden w-[46%] shrink-0 overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between p-12 transition-all duration-500"
        style={style} 
      >
        {/* Ambient Effects & Micro-textures */}
        <div className="aura-field opacity-80 mix-blend-screen" />
        <div className="grain-overlay opacity-[0.03]" />

        {/* Top: Logo Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span
              className="aura-ring transition-transform duration-500 group-hover:scale-110"
              style={{ filter: "drop-shadow(0 0 15px rgba(255,255,255,0.3))" }}
              aria-hidden="true"
            />
            <span className="font-display text-2xl font-semibold tracking-tight text-white">
              Relive
            </span>
          </Link>
        </div>

        {/* Middle: Centered Bold Typography (The Hero Moment) */}
        <div className="relative z-10 flex flex-1 flex-col justify-center items-start max-w-xl mx-auto my-auto space-y-6">
          <h2 className="font-display text-[3.2rem] font-medium italic leading-[1.1] tracking-tight text-white animate-fade-in-up">
            Where value <br />
            <span className="bg-gradient-to-r from-amber-200 via-pink-300 to-lavender bg-clip-text text-transparent font-normal">
              lives again.
            </span>
          </h2>
          
          <div className="h-px w-16 bg-white/20" /> {/* Clean Visual Divider */}

          <p className="text-[16px] leading-relaxed text-white/80 font-light max-w-sm">
            Give your pre-owned items a second life. A secure, trusted space to declutter your home and shop smarter.
          </p>

          {/* Micro-features/Trust Badges for relevance */}
          <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60 font-medium tracking-wide uppercase">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">✦ Verified Sellers</span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">✦ AI Descriptions</span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">✦ Secure Chat</span>
          </div>
        </div>

        {/* Bottom: Footer note (keeps the layout grounded) */}
        <div className="relative z-10 text-xs text-white/40 font-light">
          © {new Date().getFullYear()} Relive Marketplace. All rights reserved.
        </div>
      </div>

      {/* Form panel — Right Side */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 bg-surface">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="space-y-2">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-widest text-cta">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-[2.25rem] font-semibold tracking-tight text-ink leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[15px] text-ink-muted font-normal">{subtitle}</p>
            )}
          </div>

          <div className="pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
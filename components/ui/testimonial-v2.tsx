'use client'

import React from 'react'
import { motion } from 'framer-motion'

// --- Types ---
interface Testimonial {
  text: string
  image: string
  name: string
  role: string
}

// --- Data — swap these for real quotes when you have them ---
const testimonials: Testimonial[] = [
  {
    text: "I used to spend hours chasing clients for contracts and forms. Onbrd cut that down to nothing. I send one link and everything just gets done.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sarah M.",
    role: "Brand Designer",
  },
  {
    text: "Our onboarding used to be 10 emails back and forth. Now it's one link. Clients actually comment on how professional it looks.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "James T.",
    role: "Marketing Agency Owner",
  },
  {
    text: "Simple, clean, and it works. Doesn't try to do too much. I had my first portal live in under 10 minutes.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Priya K.",
    role: "Web Developer",
  },
  {
    text: "My clients feel so taken care of from day one. The portal looks way more polished than anything I could have built myself.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Marcus R.",
    role: "Video Producer",
  },
  {
    text: "Switching to Onbrd saved me at least 3 hours a week. No more back-and-forth emails just to collect a signed contract.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Zoe H.",
    role: "UX Consultant",
  },
  {
    text: "The free plan was enough to convince me. Upgraded to Pro within a week — the white-label alone is worth it.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Alicia B.",
    role: "Copywriter",
  },
  {
    text: "Every new client I onboard with Onbrd starts the relationship on the right foot. It signals that I'm organized and professional.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Derek F.",
    role: "SEO Specialist",
  },
  {
    text: "I was skeptical about another SaaS tool. But Onbrd genuinely made my onboarding process 10x smoother. Clients love it.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Nina S.",
    role: "Social Media Manager",
  },
  {
    text: "Setup took me 5 minutes. My first client said it was the most professional onboarding experience they'd ever had.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ryan C.",
    role: "Freelance Developer",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

// --- Testimonial Card ---
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <li className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60 mb-4">
    <p className="text-sm text-gray-400 leading-relaxed mb-4">"{testimonial.text}"</p>
    <div className="flex items-center gap-3">
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
      <div>
        <p className="text-sm font-medium text-white">{testimonial.name}</p>
        <p className="text-xs text-gray-500">{testimonial.role}</p>
      </div>
    </div>
  </li>
)

// --- Scrolling Column ---
const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 15,
}: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => (
  <div className={className}>
    <motion.ul
      animate={{ translateY: '-50%' }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
      }}
      className="flex flex-col"
    >
      {[...new Array(2)].map((_, i) =>
        testimonials.map((t, j) => (
          <TestimonialCard key={`${i}-${j}`} testimonial={t} />
        ))
      )}
    </motion.ul>
  </div>
)

// --- Main Export ---
export const TestimonialsSection = () => {
  return (
    <section className="py-24 px-6 border-t border-neutral-800 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Loved by freelancers &amp; agencies
        </h2>
        <p className="text-gray-500">Here's what people are saying about Onbrd.</p>
      </div>

      <div
        className="flex justify-center gap-5 overflow-hidden"
        style={{ maxHeight: '520px' }}
      >
        <TestimonialsColumn testimonials={firstColumn} duration={18} />
        <TestimonialsColumn
          testimonials={secondColumn}
          duration={22}
          className="hidden md:block"
        />
        <TestimonialsColumn
          testimonials={thirdColumn}
          duration={16}
          className="hidden lg:block"
        />
      </div>
    </section>
  )
}

export default TestimonialsSection

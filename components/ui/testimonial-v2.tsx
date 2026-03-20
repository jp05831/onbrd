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

// --- Data ---
const testimonials: Testimonial[] = [
  {
    text: "Honestly just glad I don't have to send 'hey did you get my email?' anymore. Client gets the link, does the steps, done.",
    image: "",
    name: "Matt D.",
    role: "Freelance copywriter",
  },
  {
    text: "I tried building something like this in Notion. It worked okay until it didn't. Onbrd is just cleaner and my clients don't get confused by it.",
    image: "",
    name: "Kira B.",
    role: "Brand designer",
  },
  {
    text: "One of my clients specifically mentioned the onboarding portal in a review. Said it made the whole process feel smooth. That's not something I expected.",
    image: "",
    name: "Tom R.",
    role: "Web developer",
  },
  {
    text: "I run a small video production company. Every new client used to mean a week of email chaos before we even started. That's mostly gone now.",
    image: "",
    name: "Chris V.",
    role: "Video producer",
  },
  {
    text: "The white-label option is what got me to upgrade. I don't want my clients seeing 'powered by X' on something that's supposed to represent my business.",
    image: "",
    name: "Leila M.",
    role: "UX consultant",
  },
  {
    text: "It's not trying to be everything. It does one thing — get clients through a checklist — and it does it well. That's what I needed.",
    image: "",
    name: "Jake S.",
    role: "SEO freelancer",
  },
  {
    text: "Setup was maybe 15 minutes for my first flow. I was expecting it to take longer based on other tools I've tried.",
    image: "",
    name: "Priya N.",
    role: "Social media manager",
  },
  {
    text: "My retainer clients go through the same steps every time. Templates made that basically automatic. I just clone it, change the name, send the link.",
    image: "",
    name: "Dana K.",
    role: "Marketing consultant",
  },
  {
    text: "Not much to say — it works and it's cheap. Two things I care about.",
    image: "",
    name: "Ryan O.",
    role: "Freelance developer",
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
      <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold text-neutral-300">
          {testimonial.name.charAt(0)}
        </span>
      </div>
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
          What people are saying
        </h2>
        <p className="text-gray-500">From freelancers and small agencies who use Onbrd day to day.</p>
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

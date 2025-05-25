import { Tab } from '@headlessui/react'
import { motion } from 'framer-motion'

const quotes = [
  {
    name: 'Legal Team Beta',
    quote:
      '“WiseCipher’s semantic parser condensed our 120-page NDAs into a structured JSON in under 3 seconds—highlighting key indemnities and renewal clauses automatically.”',
  },
  {
    name: 'Strategy & Ops',
    quote:
      '“We plugged in our quarterly financial model PDFs and got back actionable KPI summaries and variance analyses without writing a single line of code.”',
  },
  {
    name: 'Engineering Lead',
    quote:
      '“Technical specs used to require hours of manual review. With WiseCipher’s AI-driven extraction, we onboard new APIs in minutes.”',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Trusted by Early Adopters
        </h2>
        <Tab.Group>
          <Tab.List className="flex justify-center space-x-4 mb-8">
            {quotes.map((q, i) => (
              <Tab
                as={motion.button}
                key={i}
                className={({ selected }) =>
                  `px-4 py-2 rounded-lg font-medium ${
                    selected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`
                }
                whileTap={{ scale: 0.95 }}
              >
                {q.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {quotes.map((q, i) => (
              <Tab.Panel key={i}>
                <motion.blockquote
                  className="max-w-2xl mx-auto italic text-gray-700 text-center leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  {q.quote}
                </motion.blockquote>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  )
}

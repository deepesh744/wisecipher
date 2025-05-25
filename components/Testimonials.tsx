import { Tab } from '@headlessui/react'
import { motion } from 'framer-motion'

const quotes = [
  { name: 'Legal Team Beta', quote: 'WiseCipher turned 50-page contracts into 3 bullet points—game changer!' },
  { name: 'Finance Lead', quote: 'Finally understand our quarterly reports in seconds.' },
  { name: 'CTO', quote: 'Technical docs used to slow us down—no more.' },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Trusted By Early Adopters</h2>
        <Tab.Group>
          <Tab.List className="flex justify-center space-x-4 mb-8">
            {quotes.map((q, i) => (
              <Tab as={motion.button}
                   key={i}
                   className={({ selected }) =>
                     `px-4 py-2 rounded-lg ${
                       selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
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
                  className="max-w-2xl mx-auto italic text-gray-700 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  “{q.quote}”
                </motion.blockquote>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  )
}

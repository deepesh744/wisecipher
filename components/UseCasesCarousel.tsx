import { Tab } from '@headlessui/react'
import { motion } from 'framer-motion'

const useCases = [
  { title: 'Contracts', desc: 'Instantly see key dates, obligations & risks.' },
  { title: 'Financial Reports', desc: 'Extract numbers & plain-English takeaways.' },
  { title: 'Medical Protocols', desc: 'Simplify jargon into actionable steps.' },
  { title: 'Tech Manuals', desc: 'Navigate complex instructions with ease.' },
]

export default function UseCasesCarousel() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Supported Document Types</h2>
        <Tab.Group>
          <Tab.List className="flex justify-center space-x-4 mb-8">
            {useCases.map((uc) => (
              <Tab as={motion.button}
                   key={uc.title}
                   className={({ selected }) =>
                     `px-4 py-2 rounded-lg ${
                       selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                     }`
                   }
                   whileTap={{ scale: 0.95 }}
              >
                {uc.title}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {useCases.map((uc) => (
              <Tab.Panel key={uc.title}>
                <motion.div
                  className="text-center max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-lg">{uc.desc}</p>
                </motion.div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  )
}

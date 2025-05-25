import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Process up to 3 documents / month',
      'Core AI-driven bullet-point summaries',
    ],
    cta: 'Coming Soon',
  },
  {
    name: 'Pro',
    price: '$29/mo',
    features: [
      'Unlimited document processing',
      'Batch uploads & priority support',
      'Structured JSON export',
    ],
    cta: 'Launch Soon',
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    features: [
      'Custom SLAs & on-prem deployment',
      'Team seats & audit logs',
      'Dedicated account engineering',
    ],
    cta: 'Get in Touch',
  },
]

export default function PricingTeaser() {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Plans &amp; Pricing</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              className="p-6 bg-white rounded-lg shadow-lg text-center flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-3xl font-bold mb-4">{p.price}</p>
              <ul className="space-y-2 mb-6 flex-1 text-gray-600">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                disabled
                className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
              >
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

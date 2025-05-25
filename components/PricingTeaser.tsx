import { motion } from 'framer-motion'

const plans = [
  { name: 'Free', price: '$0', features: ['Up to 3 docs / month', 'Basic summaries'] },
  { name: 'Pro', price: '$29/mo', features: ['Unlimited docs', 'Priority support'] },
  { name: 'Enterprise', price: 'Contact Us', features: ['Custom SLAs', 'Team seats'] },
]

export default function PricingTeaser() {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Plans & Pricing</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              className="p-6 bg-white rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-3xl font-bold mb-4">{p.price}</p>
              <ul className="space-y-2 mb-4">
                {p.features.map((f) => (
                  <li key={f} className="text-gray-600">
                    • {f}
                  </li>
                ))}
              </ul>
              <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {p.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

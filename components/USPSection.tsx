import { motion } from 'framer-motion'
import {
  BoltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const usps = [
  {
    Icon: BoltIcon,
    title: 'AI-driven Summaries',
    desc: 'Plain-English bullet points in seconds.',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Secure & Private',
    desc: 'AES-256 encryption ensures your data stays yours.',
  },
  {
    Icon: DocumentTextIcon,
    title: 'Actionable Outputs',
    desc: 'Draft emails, talking points & export to Word.',
  },
  {
    Icon: UserGroupIcon,
    title: 'Collaboration',
    desc: 'Share, compare versions & track changes.',
  },
]

export default function USPSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why WiseCipher?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {usps.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="p-6 bg-white rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Icon className="h-10 w-10 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold text-xl mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

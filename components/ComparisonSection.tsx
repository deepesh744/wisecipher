import { motion } from 'framer-motion'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

const rows = [
  { label: 'Purpose-built for documents', wise: true, generic: false },
  { label: 'Structured dashboards', wise: true, generic: false },
  { label: 'AES-256 encryption', wise: true, generic: false },
  { label: 'Generic chat interface', wise: false, generic: true },
  { label: 'Unstructured output', wise: false, generic: true },
]

export default function ComparisonSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          How We’re Different
        </h2>
        <motion.table
          className="w-full table-auto text-center border-collapse"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <thead>
            <tr>
              <th className="p-4"></th>
              <th className="p-4">WiseCipher</th>
              <th className="p-4">Generic AI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, wise, generic }) => (
              <tr key={label} className="border-t">
                <td className="p-4 text-left">{label}</td>
                <td className="p-4">
                  {wise && <CheckIcon className="h-6 w-6 text-green-600 inline" />}
                </td>
                <td className="p-4">
                  {generic && <XMarkIcon className="h-6 w-6 text-red-600 inline" />}
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </section>
  )
}
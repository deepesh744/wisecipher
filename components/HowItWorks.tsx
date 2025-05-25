import { motion } from 'framer-motion'
import {
  ArrowUpTrayIcon,
  BoltIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

const steps = [
  { Icon: ArrowUpTrayIcon, title: 'Upload', desc: 'Drag & drop your PDF, DOCX or TXT' },
  { Icon: BoltIcon, title: 'Decode',  desc: 'AI extracts & encrypts securely' },
  { Icon: EyeIcon, title: 'Review',  desc: 'View structured summary & dashboard' },
  { Icon: ChatBubbleLeftRightIcon, title: 'Ask', desc: 'Chat with your document in plain-English' },
  { Icon: ClipboardDocumentCheckIcon, title: 'Act', desc: 'Export & take action immediately' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-5">
          {steps.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h4 className="font-semibold mb-1">{title}</h4>
              <p className="text-gray-600 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

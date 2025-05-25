// components/HeroBanner.tsx
import { FC } from 'react'
import { motion } from 'framer-motion'

export const HeroBanner: FC = () => {
  const scrollToEarly = () => {
    document
      .getElementById('early-access')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-blue-800 text-white">
      <motion.div
        className="max-w-4xl mx-auto py-32 px-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          WiseCipher: AI-Powered Semantic Decoder
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Leverage transformer-based neural networks and contextual embeddings to
          convert dense legal, financial, medical & technical docs into
          actionable insights—in milliseconds.
        </p>
        <motion.a
          onClick={scrollToEarly}
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          Request Early Access
        </motion.a>
      </motion.div>
      {/* subtle animated background shapes */}
      <motion.div
        className="absolute inset-0 bg-[url('/shapes.svg')] bg-no-repeat bg-center mix-blend-overlay opacity-30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
    </section>
  )
}

export default HeroBanner

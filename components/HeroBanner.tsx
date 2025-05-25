import { motion } from 'framer-motion'

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 py-20">
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-powered Jargon Decoder
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Instantly turn complex legal, financial, medical & technical documents into actionable insights—no expertise required.
          </p>
          <a
            id="early-access"
            href="#early-access"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Request Early Access
          </a>
        </motion.div>
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/placeholder-hero.gif"
            alt="Product demo animation"
            className="w-full rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  )
}

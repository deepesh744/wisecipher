import Layout from '../components/Layout'
import RequestAccessForm from '../components/RequestAccessForm'

export default function Home() {
  return (
    <Layout>
      <div className="text-center py-16">
        <img src="/logo.svg" alt="WiseCipher" className="mx-auto w-24 h-24 mb-4"/>
        <h1 className="text-3xl font-bold mb-2">WiseCipher.com</h1>
        <h2 className="text-lg mb-6">Decode legal & business documents in plain English, instantly.</h2>
        <RequestAccessForm />
      </div>
    </Layout>
  )
}

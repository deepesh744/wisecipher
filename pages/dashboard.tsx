// pages/dashboard.tsx
import Layout from '../components/Layout'
import UploadDropzone from '../components/UploadDropzone'
import DocumentCard from '../components/DocumentCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/** Must match the shape returned from our JSON‐structured summary API */
type Summary = {
  'Key Dates': string[]
  Obligations: string[]
  'Risks or Liabilities': string[]
}

type Document = {
  id: string
  filename: string
  created_at: string
  summary?: Summary
}

export default function Dashboard() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const router = useRouter()

  // On mount: verify session and load documents
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.replace('/login')
      } else {
        setUser(session.user)
        fetchDocs(session.user.id)
      }
    })
  }, [router])

  // Fetch documents for this user
  async function fetchDocs(userId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('id, filename, created_at, enc_summary')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return
    }

    setDocs(
      (data || []).map((d: any) => ({
        id: d.id,
        filename: d.filename,
        created_at: d.created_at,
        // leaving summary undefined until the user clicks Summarize
        summary: undefined,
      }))
    )
  }

  // Handle a new file drop
  async function handleFile(file: File) {
    setUploading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      console.error('No active session—redirecting to login')
      router.replace('/login')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (!res.ok) {
      console.error('Upload failed:', await res.text())
    } else {
      await fetchDocs(session.user.id)
    }

    setUploading(false)
  }

  // Delete a document
  async function handleDelete(id: string) {
    await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchDocs(user.id)
  }

  // Summarize on demand
  async function handleSummarize(id: string) {
    setSummarizingId(id);
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId: id }),
    })
    const { summary } = await res.json()
    // Replace the matching doc's summary with our structured Summary object
    setDocs(docs.map(d => (d.id === id ? { ...d, summary } : d)))
    setSummarizingId(null);
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>

      {/* 1) Dropzone */}
      <UploadDropzone onFile={handleFile} disabled={uploading} />
      {uploading && <LoadingSpinner />}

      {/* 2) Empty state */}
      {!uploading && docs.length === 0 && (
        <p className="text-gray-600 mt-4">No uploads yet.</p>
      )}

      {/* 3) Document list */}
      {docs.map(doc => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          isSummarizing={summarizingId === doc.id}
          onSummarize={() => handleSummarize(doc.id)}
          onDelete={() => handleDelete(doc.id)}
        />
      ))}
    </Layout>
  )
}

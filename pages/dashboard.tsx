import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import DocumentCard from '../components/DocumentCard'
import UploadDropzone from '../components/UploadDropzone'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [docs, setDocs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push('/login');
      } else {
        setUser(data.user);
        fetchDocs(data.user.id);
      }
    });
  }, []);

  async function fetchDocs(userId: string) {
    let { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setDocs(data || []);
  }

  async function handleFile(file: File) {
    // Upload to /api/upload endpoint (client-side encryption happens here)
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
    fetchDocs(user.id);
  }

  async function handleDelete(id: string) {
    await fetch('/api/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchDocs(user.id);
  }

  // Summarize and chat handled inside DocumentCard in MVP
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <UploadDropzone onFile={handleFile} />
      {docs.length === 0 && <p className="text-gray-600 mt-8">No uploads yet.</p>}
      {docs.map(doc =>
        <DocumentCard
          key={doc.id}
          doc={doc}
          onDelete={() => handleDelete(doc.id)}
          onSummarize={() => {/* handle summary API call and refresh */}}
          onChat={() => {/* open chatbot modal or section */}}
        />
      )}
    </Layout>
  )
}

// components/DocumentCard.tsx
import React from 'react'
import DeleteButton from './DeleteButton'

type Summary = {
  'Key Dates': string[]
  Obligations: string[]
  'Risks or Liabilities': string[]
}

type Props = {
  doc: {
    id: string
    filename: string
    created_at: string
    summary?: Summary
  }
  onSummarize: () => void
  onDelete: () => void
  isSummarizing?: boolean
}

export default function DocumentCard({ doc, onSummarize, onDelete, isSummarizing = false }: Props) {
  return (
    <div className="p-4 border rounded mb-4 bg-white">
      <h2 className="font-semibold">{doc.filename}</h2>
      <div className="text-xs text-gray-500 mb-2">
        Uploaded {new Date(doc.created_at).toLocaleString()}
      </div>

      {doc.summary ? (
        // summary exists, render the three sections
        <div className="mt-2 space-y-4">
          {(['Key Dates', 'Obligations', 'Risks or Liabilities'] as const).map(
            (section) => (
              <div key={section}>
                <h3 className="font-bold">{section}</h3>
                <ul className="list-disc list-inside ml-4">
                  {doc.summary![section].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      ) : isSummarizing ? (
        <div className="mt-2 italic text-gray-600">
          🤖 Our models are processing the best summary for you…
        </div>
        ) : (
        // no summary yet, show Summarize button
        <button
          onClick={onSummarize}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Summarize
        </button>
      )}

      <div className="mt-2 flex space-x-2">
        {/* if you no longer need Chat, just keep Delete */}
        <DeleteButton onClick={onDelete} />
      </div>
    </div>
  )
}

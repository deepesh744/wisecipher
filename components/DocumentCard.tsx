import DeleteButton from './DeleteButton';

type Props = {
  doc: any;
  onDelete: () => void;
  onSummarize: () => void;
  onChat: () => void;
};

export default function DocumentCard({ doc, onDelete, onSummarize, onChat }: Props) {
  return (
    <div className="rounded-xl shadow p-4 bg-white my-4">
      <div className="font-semibold">{doc.filename}</div>
      <div className="text-xs text-gray-400 mb-2">Uploaded {new Date(doc.created_at).toLocaleString()}</div>
      <div className="flex space-x-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={onSummarize}>Summarize</button>
        <button className="bg-gray-600 text-white px-3 py-1 rounded" onClick={onChat}>Chat</button>
        <DeleteButton onClick={onDelete} />
      </div>
      {doc.summary && (
        <div className="mt-2 bg-gray-100 rounded p-2 text-sm">
          <strong>Summary:</strong> {doc.summary}
        </div>
      )}
    </div>
  );
}

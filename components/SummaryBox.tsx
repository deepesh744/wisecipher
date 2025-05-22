export default function SummaryBox({ summary }: { summary: string }) {
    return (
      <div className="p-4 rounded bg-blue-50 mt-4">
        <div className="font-bold mb-2">Plain English Summary</div>
        <pre className="whitespace-pre-line">{summary}</pre>
      </div>
    );
  }
  
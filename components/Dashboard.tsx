import { extractDashboardItems } from '../utils/helpers';

export default function Dashboard({ summary }: { summary: string }) {
  const { dates, obligations, risks } = extractDashboardItems(summary);

  return (
    <div className="bg-white shadow rounded-xl p-4 my-4">
      <h2 className="font-bold mb-2">Document Key Points</h2>
      <div>
        <strong>Dates:</strong>
        <ul className="list-disc pl-5">
          {dates.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </div>
      <div>
        <strong>Obligations:</strong>
        <ul className="list-disc pl-5">
          {obligations.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </div>
      <div>
        <strong>Risks:</strong>
        <ul className="list-disc pl-5">
          {risks.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </div>
  );
}

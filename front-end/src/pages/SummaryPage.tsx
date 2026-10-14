import { useEffect, useState } from "react";
import { getInspectionSummary } from "../utils/api/inspectionApi";

type Props = {
  onBack: () => void;
};

type SummaryRow = {
  severity: string;
  open: number;
  resolved: number;
};

function SummaryPage({ onBack }: Props) {
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getInspectionSummary()
      .then((data) => {
        setSummary(data);
      })
      .catch(() => {
        setError("Unable to load inspection summary.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <button onClick={onBack}>Back</button>

      <h1>Inspection summary</h1>

      {loading && <p>Loading summary...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Open</th>
              <th>Resolved</th>
            </tr>
          </thead>

          <tbody>
            {summary.map((row) => (
              <tr key={row.severity}>
                <td>
                  <span
                    className={`severity-badge severity-${row.severity.toLowerCase()}`}
                  >
                    {row.severity}
                  </span>
                </td>

                <td>
                  <span className="open-count">{row.open}</span>
                </td>

                <td>
                  <span className="resolved-count">{row.resolved}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default SummaryPage;

import { useEffect, useState } from "react";
import InspectionFilterForm, {
  type Filters,
} from "../components/InspectionListPage/Filter";
import { toast } from "react-toastify";
import {
  getInspections,
  type Inspection,
  resolveInspection,
} from "../utils/api/inspectionApi";

import ResolveInspectionForm from "./ResolveInspectionForm";

type Props = {
  onBack: () => void;
};

function InspectionListPage({ onBack }: Props) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolveError, setResolveError] = useState("");
  const [savingResolution, setSavingResolution] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function startResolving(inspectionId: string) {
    setResolvingId(inspectionId);
    setResolutionNotes("");
    setResolveError("");
  }

  function cancelResolving() {
    setResolvingId(null);
    setResolutionNotes("");
    setResolveError("");
  }

  async function saveResolution() {
    if (!resolvingId) {
      return;
    }

    if (!resolutionNotes.trim()) {
      setResolveError("A resolution note is required.");
      return;
    }

    try {
      setSavingResolution(true);
      setResolveError("");

      await resolveInspection(resolvingId, resolutionNotes);
      toast.success("Inspection resolved successfully.");
      cancelResolving();
      loadInspections();
    } catch {
      setResolveError("Unable to resolve inspection.");
    } finally {
      setSavingResolution(false);
    }
  }

  async function loadInspections(filters?: Filters) {
    try {
      setLoading(true);
      setError("");

      const data = await getInspections({
        ...filters,
        sortBy: "date",
      });

      setInspections(data);
    } catch {
      setError("Unable to load inspections.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInspections();
  }, []);

  return (
    <main>
      <button onClick={onBack}>Back</button>

      <h1>Inspections</h1>

      <InspectionFilterForm onApply={loadInspections} />

      {loading && <p>Loading inspections...</p>}

      {error && <p>{error}</p>}

      {!loading && inspections.length === 0 && <p>No inspections found.</p>}

      {inspections.map((inspection) => (
        <article key={inspection.id}>
          <h2>{inspection.machine.machineName}</h2>
          <p>{new Date(inspection.date).toLocaleDateString("en-IN")}</p>
          <p>Defect: {inspection.defectType.name}</p>
          <p>
            Severity:{" "}
            <span
              className={`severity-badge severity-${inspection.severity.toLowerCase()}`}
            >
              {inspection.severity}
            </span>
          </p>
          <p>Status: {inspection.status}</p>
          {inspection.remarks && <p>Remarks: {inspection.remarks}</p>}
          {inspection.resolutionNotes && (
            <p>Resolution: {inspection.resolutionNotes}</p>
          )}
          <p>
            Logged by: {inspection.loggedUserName ?? inspection.loggedUserId}
          </p>

          {inspection.resolvedUserId && (
            <p>
              Resolved by:{" "}
              {inspection.resolvedUserName ?? inspection.resolvedUserId}
            </p>
          )}
          {inspection.status === "Open" && (
            <div className="resolve-box">
              {resolvingId === inspection.id && (
                <>
                  <label>
                    Resolution note
                    <textarea
                      value={resolutionNotes}
                      onChange={(event) =>
                        setResolutionNotes(event.target.value)
                      }
                      placeholder="Describe what was fixed"
                    />
                  </label>

                  {resolveError && <p className="error">{resolveError}</p>}
                </>
              )}

              <button
                disabled={savingResolution}
                onClick={() => {
                  if (resolvingId === inspection.id) {
                    saveResolution();
                  } else {
                    startResolving(inspection.id);
                  }
                }}
              >
                {resolvingId === inspection.id
                  ? savingResolution
                    ? "Saving..."
                    : "Mark as resolved"
                  : "Resolve"}
              </button>

              {resolvingId === inspection.id && (
                <button type="button" onClick={cancelResolving}>
                  Cancel
                </button>
              )}
            </div>
          )}
        </article>
      ))}
    </main>
  );
}

export default InspectionListPage;

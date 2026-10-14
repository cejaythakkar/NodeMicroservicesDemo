import { useState, type FormEvent } from "react";
import { resolveInspection, type Inspection } from "../utils/api/inspectionApi";

type Props = {
  inspection: Inspection;
  onClose: () => void;
  onResolved: () => void;
};

function ResolveInspectionForm({ inspection, onClose, onResolved }: Props) {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!resolutionNotes.trim()) {
      setError("A resolution note is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resolveInspection(inspection.id, resolutionNotes);

      onResolved();
    } catch {
      setError("Unable to resolve inspection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Resolve inspection</h2>

      <p>
        {inspection.machine.machineName} — {inspection.defectType.name}
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Resolution note
          <textarea
            value={resolutionNotes}
            onChange={(event) => setResolutionNotes(event.target.value)}
            required
          />
        </label>

        {error && <p>{error}</p>}

        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button disabled={loading}>
          {loading ? "Saving..." : "Mark as resolved"}
        </button>
      </form>
    </section>
  );
}

export default ResolveInspectionForm;

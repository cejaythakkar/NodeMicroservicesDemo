import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchMetadataData } from "../store/slices/metadataSlice";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { createInspection } from "../utils/api/inspectionApi";
import type { DefectType, Machine } from "../types";
import Select from "../components/form/select";

type Props = {
  onBack: () => void;
  onCreated: () => void;
};

function CreateInspectionPage({ onBack, onCreated }: Props) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [machineName, setMachineName] = useState("");
  const [defectTypeId, setDefectTypeId] = useState("");
  const [severity, setSeverity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const metadata = useSelector((state: RootState) => state.metadata.metadata);

  function clearForm() {
    setDate("");
    setMachineName("");
    setDefectTypeId("");
    setSeverity("");
    setRemarks("");
  }

  useEffect(() => {
    if (!metadata) {
      dispatch(fetchMetadataData());
    }
  }, [metadata, dispatch]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createInspection({
        date: new Date(date).toISOString(),
        machineName,
        defectTypeId,
        severity,
        remarks,
      });

      clearForm();
      toast.success("Inspection logged successfully.");
      onCreated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.data?.message ?? "Unable to create inspection.",
        );
        setError(
          error.response?.data?.data?.message ?? "Unable to create inspection.",
        );
      } else {
        setError("Unable to create inspection.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <button onClick={onBack}>Back</button>
      {!metadata ? (
        <div>Loading Form...</div>
      ) : (
        <>
          <h1>Log new defect</h1>

          <form onSubmit={handleSubmit}>
            <label>
              Inspection date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <Select
              label="Machine / Line ID"
              defaultOption="Select machine"
              changeHandler={setMachineName}
              value={machineName}
              options={metadata?.machines.map((machine: Machine) => ({
                value: machine.machineName,
                label: machine.machineName,
              }))}
            />

            <Select
              label="Defect type"
              defaultOption="Select defect type"
              changeHandler={setDefectTypeId}
              value={defectTypeId}
              options={metadata?.defectTypes.map((defectType: DefectType) => ({
                value: defectType.id,
                label: defectType.name,
              }))}
            />
            <Select
              label="Severity"
              defaultOption="Select Severity"
              changeHandler={setSeverity}
              value={severity}
              options={metadata?.severities.map((severity) => ({
                value: severity,
                label: severity,
              }))}
            />

            <label>
              Remarks
              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Optional observations"
              />
            </label>

            {error && <p>{error}</p>}

            <button disabled={loading}>
              {loading ? "Saving..." : "Save inspection"}
            </button>
          </form>
        </>
      )}
    </main>
  );
}

export default CreateInspectionPage;

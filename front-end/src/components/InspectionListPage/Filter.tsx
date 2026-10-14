import { useState, type FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import type { Machine } from "../../types";
import Select from "../form/select";
import FormRow from "../FormRow";
import Input from "../form/Input";
import { fetchMetadataData } from "../../store/slices/metadataSlice";

export type Filters = {
  machine: string;
  severity: string;
  status: string;
  from: string;
  to: string;
  order: string;
};

type Props = {
  onApply: (filters: Filters) => void;
};

function InspectionFilterForm({ onApply }: Props) {
  const [severity, setSeverity] = useState("");
  const [machine, setMachine] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [order, setOrder] = useState("DESC");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    onApply({
      machine,
      severity,
      status,
      from,
      to,
      order,
    });
  }
  const dispatch = useDispatch<AppDispatch>();
  const metadata = useSelector((state: RootState) => state.metadata.metadata);

  useEffect(() => {
    if (!metadata) {
      dispatch(fetchMetadataData());
    }
  }, [metadata, dispatch]);

  if (!metadata) {
    return <div>Loading Filter...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        {" "}
        <Select
          changeHandler={setMachine}
          defaultOption="All machines"
          label="Machine"
          value={machine}
          options={metadata?.machines.map((machine: Machine) => ({
            value: machine.id,
            label: machine.machineName,
          }))}
        />
        <Select
          changeHandler={setSeverity}
          defaultOption="All severities"
          label="Severity"
          value={severity}
          options={metadata?.severities.map((severity) => ({
            value: severity,
            label: severity,
          }))}
        />{" "}
      </FormRow>
      <FormRow>
        <Select
          changeHandler={setOrder}
          defaultOption="Sort"
          label="Sort"
          value={order}
          options={["Newest first", "Oldest first"]}
        />
        <Select
          changeHandler={setStatus}
          defaultOption="All statuses"
          label="Status"
          value={status}
          options={metadata?.statuses.map((status) => ({
            value: status,
            label: status,
          }))}
        />
      </FormRow>
      <FormRow>
        <Input
          label="From date"
          type="date"
          value={from}
          changeHandler={setFrom}
        />

        <Input label="To date" type="date" value={to} changeHandler={setTo} />
      </FormRow>

      <button>Apply filters</button>
    </form>
  );
}

export default InspectionFilterForm;

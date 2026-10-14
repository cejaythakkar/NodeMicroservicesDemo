import React from "react";

type SelectOption = {
  label: string;
  value: string;
};

const makeOptions = (options: string[] | SelectOption[]): SelectOption[] => {
  if (typeof options[0] === "string") {
    return options.map((option) => ({
      value: option,
      label: option,
    })) as SelectOption[];
  }
  return options as SelectOption[];
};

type SelectProps = {
  label: string;
  options: string[] | { value: string; label: string }[];
  defaultOption: string;
  value: string;
  changeHandler: (value: string) => void;
};

const select = ({
  label,
  options,
  defaultOption,
  changeHandler,
  value,
}: SelectProps) => {
  const opts: SelectOption[] = makeOptions(options);
  return (
    <label>
      {label}
      <select
        value={value}
        onChange={(event) => changeHandler(event.target.value)}
      >
        <option value="">{defaultOption}</option>
        {opts.map((option: SelectOption) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default select;

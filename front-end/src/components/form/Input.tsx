type InputProps = {
  label: string;
  type: string;
  value: string;
  changeHandler: (event: any) => void;
  required?: boolean;
};

const Input = ({ label, type, value, changeHandler, required }: InputProps) => {
  return (
    <label>
      {label}

      <input
        type={type}
        value={value}
        onChange={(event) => changeHandler(event.target.value)}
        required={required}
      />
    </label>
  );
};

export default Input;

interface ChipOption {
  value: string;
  label: string;
}

interface ChipsProps {
  options: ChipOption[];
  values: string[];
  onChange: (values: string[]) => void;
}

export function Chips({ options, values, onChange }: ChipsProps) {
  const toggle = (v: string) => {
    const next = values.includes(v) ? values.filter((x) => x !== v) : [...values, v];
    onChange(next);
  };
  return (
    <div className="chips">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`chip${values.includes(opt.value) ? ' is-on' : ''}`}
          onClick={() => toggle(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

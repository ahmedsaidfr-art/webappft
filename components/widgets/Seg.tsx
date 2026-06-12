interface SegOption<T extends string> {
  value: T;
  label: string;
  sub?: string;
}

interface SegProps<T extends string> {
  options: SegOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
}

export function Seg<T extends string>({ options, value, onChange }: SegProps<T>) {
  return (
    <div className="seg">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`seg__opt${value === opt.value ? ' is-on' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <div className="t">{opt.label}</div>
          {opt.sub && <div className="s">{opt.sub}</div>}
        </button>
      ))}
    </div>
  );
}

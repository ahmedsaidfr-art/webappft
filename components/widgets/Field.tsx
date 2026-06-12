import { Icon } from '@/components/icon';

interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string | false | null;
  hint?: React.ReactNode | null;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Field({ label, required, error, hint, children, style }: FieldProps) {
  return (
    <div className="field" style={style}>
      {label && (
        <label className={`label${required ? ' req' : ''}${error ? ' has-error' : ''}`}>{label}</label>
      )}
      {children}
      {error && (
        <div className="err-msg">
          <Icon name="alertCircle" size={14} /> {error}
        </div>
      )}
      {hint && !error && (
        <div className="hint">
          <Icon name="info" size={14} />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}

import { Icon } from '@/components/icon';

interface SelectBtnProps {
  value?: string | null;
  placeholder?: string;
  subtitle?: string | null;
  onClick: () => void;
  hasError?: boolean;
  onClear?: () => void;
}

export function SelectBtn({ value, placeholder = 'Sélectionner…', subtitle, onClick, hasError, onClear }: SelectBtnProps) {
  return (
    <>
      <button
        className={`select-btn${value ? ' is-set' : ' is-empty'}${hasError ? ' has-error' : ''}`}
        onClick={onClick}
        type="button"
      >
        <div className="select-btn__body">
          <div className="select-btn__value">{value || placeholder}</div>
          {subtitle && <div className="select-btn__sub">{subtitle}</div>}
        </div>
        <span className="select-btn__chev">
          <Icon name="chevronRight" size={18} />
        </span>
      </button>
      {value && onClear && (
        <button className="clear-link" onClick={onClear} type="button">
          <Icon name="x" size={12} /> Retirer
        </button>
      )}
    </>
  );
}

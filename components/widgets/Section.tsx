'use client';

import { Icon, type IconName } from '@/components/icon';

interface SectionProps {
  id: string;
  icon: IconName;
  title: string;
  summary?: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  isComplete?: boolean;
  hasError?: boolean;
}

export function Section({ id, icon, title, summary, open, onToggle, children, isComplete, hasError }: SectionProps) {
  return (
    <div
      className={[
        'section',
        open ? 'is-open' : '',
        isComplete ? 'is-filled' : '',
        hasError ? 'has-error' : '',
      ].join(' ').trim()}
    >
      <button className="section__head" onClick={() => onToggle(id)}>
        <div className="section__icon">
          <Icon name={icon} size={19} />
        </div>
        <div className="section__meta">
          <div className="section__title">{title}</div>
          <div className="section__summary">{open ? ' ' : summary || ' '}</div>
        </div>
        <div className="section__right">
          {hasError && <span className="section__flag">À compléter</span>}
          {isComplete && !hasError && (
            <span className="section__check">
              <Icon name="check" size={13} />
            </span>
          )}
          <span className="section__chev">
            <Icon name="chevronRight" size={18} />
          </span>
        </div>
      </button>
      <div className="section__wrap">
        <div className="section__inner">
          <div className="section__content">{children}</div>
        </div>
      </div>
    </div>
  );
}

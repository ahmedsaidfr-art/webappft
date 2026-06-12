'use client';

import { useEffect } from 'react';
import { Icon } from '@/components/icon';

export interface ToastData {
  msg: string;
  type?: 'success' | 'error';
}

export function Toast({ msg, type = 'success', onDone }: ToastData & { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="toast-layer">
      <div className={`toast${type === 'error' ? ' is-error' : ''}`}>
        <Icon name={type === 'error' ? 'alertCircle' : 'checkCircle'} size={18} />
        {msg}
      </div>
    </div>
  );
}

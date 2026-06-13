'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/icon';

interface DownloadDoneSheetProps {
  onNewFiche: () => void;
  onEditFiche: () => void;
}

export function DownloadDoneSheet({ onNewFiche, onEditFiche }: DownloadDoneSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`sheet-scrim${mounted ? ' is-in' : ''}`}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        <div style={{ padding: '8px 24px 28px', textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--green-soft)',
              color: 'var(--green-ink)',
              display: 'grid',
              placeItems: 'center',
              margin: '8px auto 16px',
            }}
          >
            <Icon name="checkCircle" size={28} />
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Téléchargement terminé</h2>
          <p style={{ margin: '0 0 22px', fontSize: 14, color: 'var(--text-2)' }}>
            Que souhaitez-vous faire maintenant ?
          </p>
          <div className="btn-row" style={{ flexDirection: 'column', gap: 10 }}>
            <button className="btn btn--primary" onClick={onNewFiche}>
              <Icon name="plus" size={15} /> Créer une nouvelle fiche
            </button>
            <button className="btn btn--ghost" onClick={onEditFiche}>
              <Icon name="edit2" size={15} /> Revenir modifier cette fiche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/icon';

interface PdfPreviewSheetProps {
  url: string;
  filename: string;
  pageCount: number;
  hasDevis: boolean;
  onDownload: () => void;
  onClose: () => void;
}

export function PdfPreviewSheet({ url, filename, pageCount, hasDevis, onDownload, onClose }: PdfPreviewSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const dismiss = () => {
    setClosing(true);
    setTimeout(onClose, 310);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`sheet-scrim${mounted && !closing ? ' is-in' : ''}${closing ? ' is-out' : ''}`} onClick={dismiss}>
      <div className="sheet sheet--full" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        <div className="sheet__head">
          <div>
            <h2>Aperçu du PDF</h2>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--text-2)' }}>
              {pageCount} page{pageCount > 1 ? 's' : ''} · {hasDevis ? 'Fiche travaux + devis joint' : 'Fiche travaux uniquement'}
            </p>
          </div>
          <button className="sheet__close" onClick={dismiss}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="pdf-preview">
          <iframe src={url} title={filename} className="pdf-preview__frame" />
        </div>
        <div className="sheet__add">
          <div className="btn-row">
            <button className="btn btn--ghost" onClick={dismiss}>
              Modifier
            </button>
            <button className="btn btn--primary" onClick={onDownload}>
              <Icon name="fileText" size={15} /> Télécharger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

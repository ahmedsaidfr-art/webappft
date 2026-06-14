'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icon';

interface PdfPreviewSheetProps {
  blob: Blob;
  filename: string;
  pageCount: number;
  hasDevis: boolean;
  onDownload: () => void;
  onClose: () => void;
}

export function PdfPreviewSheet({ blob, filename, pageCount, hasDevis, onDownload, onClose }: PdfPreviewSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dismiss = () => {
    setClosing(true);
    setTimeout(onClose, 310);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const container = containerRef.current;
      if (!container) return;

      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const data = new Uint8Array(await blob.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data }).promise;
      if (cancelled) return;

      container.innerHTML = '';
      const width = container.clientWidth;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        if (cancelled) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = (width / baseViewport.width) * 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.display = 'block';
        canvas.style.marginBottom = '12px';
        canvas.style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [blob]);

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
          <div ref={containerRef} className="pdf-preview__pages" aria-label={filename} />
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

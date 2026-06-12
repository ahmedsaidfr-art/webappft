'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icon';

export interface AddField {
  key: string;
  label: string;
  placeholder?: string;
}

interface SearchSheetProps<T extends { id: number }> {
  title: string;
  items: T[];
  searchKeys: (keyof T)[];
  renderRow: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  onAddItem: (item: T) => void;
  addFields: AddField[];
  addLabel: string;
  onClose: () => void;
}

export function SearchSheet<T extends { id: number }>({
  title,
  items,
  searchKeys,
  renderRow,
  onSelect,
  onAddItem,
  addFields,
  addLabel,
  onClose,
}: SearchSheetProps<T>) {
  const [q, setQ] = useState('');
  const [phase, setPhase] = useState<'list' | 'form' | 'confirm'>('list');
  const [newEntry, setNewEntry] = useState<Record<string, string>>(() =>
    Object.fromEntries(addFields.map((f) => [f.key, '']))
  );
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dismiss = () => {
    setClosing(true);
    setTimeout(onClose, 310);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    const tid = setTimeout(() => inputRef.current?.focus(), 420);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(tid);
    };
  }, []);

  const filtered = q.trim()
    ? items.filter((item) =>
        searchKeys.some((k) => String(item[k] ?? '').toLowerCase().includes(q.toLowerCase()))
      )
    : items;

  const handleSelect = (item: T) => {
    onSelect(item);
    onClose();
  };

  const handleConfirm = () => {
    const entry = { ...newEntry, id: Date.now() } as unknown as T;
    onAddItem(entry);
    onSelect(entry);
    onClose();
  };

  return (
    <div
      className={`sheet-scrim${mounted && !closing ? ' is-in' : ''}${closing ? ' is-out' : ''}`}
      onClick={dismiss}
    >
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        <div className="sheet__head">
          <h2>{title}</h2>
          <button className="sheet__close" onClick={dismiss}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {phase === 'list' && (
          <>
            <div className="sheet__search">
              <div className="search-box">
                <Icon name="search" />
                <input
                  ref={inputRef}
                  className="input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher…"
                />
              </div>
            </div>
            <div className="sheet__list">
              {filtered.map((item) => (
                <div key={item.id} className="opt-row" onClick={() => handleSelect(item)}>
                  {renderRow(item)}
                </div>
              ))}
              {filtered.length === 0 && <div className="empty">Aucun résultat pour « {q} »</div>}
            </div>
            <div className="sheet__add">
              <button
                className="add-btn"
                onClick={() => {
                  setNewEntry((p) => ({ ...p, [addFields[0].key]: q }));
                  setPhase('form');
                }}
              >
                <Icon name="plus" size={17} />
                {q ? `Ajouter « ${q} »` : `Nouveau ${addLabel}`}
              </button>
            </div>
          </>
        )}

        {phase === 'form' && (
          <div className="sheet__list" style={{ padding: '18px 20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--accent-ink)' }}>
              Nouvelle entrée
            </h3>
            {addFields.map((f) => (
              <div key={f.key} className="field">
                <label className="label">{f.label}</label>
                <input
                  className="input"
                  value={newEntry[f.key]}
                  onChange={(e) => setNewEntry((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <div className="btn-row" style={{ marginTop: 18 }}>
              <button className="btn btn--ghost" onClick={() => setPhase('list')}>
                Annuler
              </button>
              <button className="btn btn--primary" onClick={() => setPhase('confirm')}>
                Continuer <Icon name="chevronRight" size={15} />
              </button>
            </div>
          </div>
        )}

        {phase === 'confirm' && (
          <div className="sheet__list" style={{ padding: '18px 20px' }}>
            <div className="add-confirm">
              <div className="t">
                <Icon name="info" size={16} /> Enregistrer dans la base ?
              </div>
              <div className="d">Cette entrée sera disponible dans toutes les futures fiches.</div>
              <div className="btn-row">
                <button className="btn btn--ghost" onClick={() => setPhase('form')}>
                  Modifier
                </button>
                <button className="btn btn--green" onClick={handleConfirm}>
                  <Icon name="check" size={15} /> Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

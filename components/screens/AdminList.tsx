'use client';

import { useState } from 'react';
import { Icon } from '@/components/icon';

export interface AdminColumn {
  key: string;
  label: string;
  placeholder?: string;
}

type AdminItem = { id: number };

function field(item: object, key: string): unknown {
  return (item as Record<string, unknown>)[key];
}

interface AdminListProps<T extends AdminItem> {
  title: string;
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  columns: AdminColumn[];
  newItemTemplate: Omit<T, 'id'>;
  renderRow: (item: T) => React.ReactNode;
}

const inputSt: React.CSSProperties = {
  width: '100%',
  padding: '9px 11px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

export function AdminList<T extends AdminItem>({ title, items, setItems, columns, newItemTemplate, renderRow }: AdminListProps<T>) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<Omit<T, 'id'>>(newItemTemplate);
  const [editId, setEditId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [q, setQ] = useState('');

  const filtered = q.trim()
    ? items.filter((i) => columns.some((c) => String(field(i, c.key) ?? '').toLowerCase().includes(q.toLowerCase())))
    : items;

  const saveNew = () => {
    setItems((p) => [...p, { ...newItem, id: Date.now() } as T]);
    setNewItem(newItemTemplate);
    setAdding(false);
  };
  const saveEdit = () => {
    if (!editItem) return;
    setItems((p) => p.map((i) => (i.id === editId ? editItem : i)));
    setEditId(null);
  };
  const del = (id: number) => setItems((p) => p.filter((i) => i.id !== id));

  const colGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.min(columns.length, 3)}, 1fr)`,
    gap: 8,
  };

  return (
    <div className="section" style={{ marginBottom: 12 }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{title}</span>
        <button className="btn btn--primary" style={{ flex: 'unset', padding: '8px 14px', fontSize: 13 }} onClick={() => setAdding((a) => !a)}>
          <Icon name="plus" size={14} /> Ajouter
        </button>
      </div>

      <div style={{ padding: '0 18px 14px' }}>
        <div className="search-box" style={{ marginBottom: 12 }}>
          <Icon name="search" />
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer…" />
        </div>

        {adding && (
          <div style={{ background: 'var(--accent-soft)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent-ink)', marginBottom: 10 }}>Nouvelle entrée</div>
            <div style={colGrid}>
              {columns.map((col) => (
                <div key={col.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 4 }}>{col.label}</label>
                  <input
                    style={inputSt}
                    value={String(field(newItem, col.key) ?? '')}
                    onChange={(e) => setNewItem((p) => ({ ...p, [col.key]: e.target.value }))}
                    placeholder={col.placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn btn--ghost" onClick={() => setAdding(false)}>
                Annuler
              </button>
              <button className="btn btn--green" onClick={saveNew}>
                <Icon name="check" size={14} /> Enregistrer
              </button>
            </div>
          </div>
        )}

        <div>
          {filtered.map((item) => (
            <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {editId === item.id && editItem ? (
                <div style={{ flex: 1 }}>
                  <div style={{ ...colGrid, marginBottom: 8 }}>
                    {columns.map((col) => (
                      <input
                        key={col.key}
                        style={inputSt}
                        value={String(field(editItem, col.key) ?? '')}
                        onChange={(e) => setEditItem((p) => (p ? { ...p, [col.key]: e.target.value } : p))}
                      />
                    ))}
                  </div>
                  <div className="btn-row">
                    <button className="btn btn--ghost" style={{ flex: 'unset', padding: '6px 12px' }} onClick={() => setEditId(null)}>
                      Annuler
                    </button>
                    <button className="btn btn--green" style={{ flex: 'unset', padding: '6px 12px' }} onClick={saveEdit}>
                      <Icon name="check" size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>{renderRow(item)}</div>
                  <button
                    onClick={() => {
                      setEditId(item.id);
                      setEditItem({ ...item });
                    }}
                    style={{ background: 'var(--accent-soft)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 9px', cursor: 'pointer', color: 'var(--accent-ink)' }}
                  >
                    <Icon name="edit2" size={14} />
                  </button>
                  <button
                    onClick={() => del(item.id)}
                    style={{ background: 'var(--red-soft)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 9px', cursor: 'pointer', color: 'var(--red)' }}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">Aucune entrée</div>}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/icon';
import { parseAmount, formatAmount } from '@/lib/format';
import type { Batiment, Entreprise, ExtractDevisResult, FormData, Marche } from '@/lib/types';

type Phase = 'idle' | 'scanning';

const STEPS = ['Entreprise & N° devis', 'Montants HT / TTC / TVA', 'Bâtiment, étage & dates'];

interface UploadScreenProps {
  onComplete: (data: Partial<FormData>, file: File) => void;
  onBack: () => void;
  batiments: Batiment[];
  entreprises: Entreprise[];
  setEntreprises: React.Dispatch<React.SetStateAction<Entreprise[]>>;
  marches: Marche[];
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadScreen({ onComplete, onBack, batiments, entreprises, setEntreprises, marches }: UploadScreenProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toLocaleDateString('fr-FR');

  const buildFormPatch = (extracted: ExtractDevisResult): Partial<FormData> => {
    const bat = batiments.find((b) => b.numero === extracted.batiment_numero) || null;
    const mar = marches.find((m) => m.entreprise === extracted.nom_entreprise) || null;

    let ent = entreprises.find((e) => e.nom === extracted.nom_entreprise) || null;
    if (!ent && extracted.nom_entreprise) {
      ent = { id: Date.now(), nom: extracted.nom_entreprise, specialite: '' };
      setEntreprises((p) => [...p, ent as Entreprise]);
    }

    const tva = extracted.taux_tva || bat?.tva_defaut || '20';
    const htN = parseAmount(extracted.montant_ht);
    const ttc = isNaN(htN) ? '' : formatAmount(htN * (1 + parseFloat(tva) / 100));

    return {
      natureTravaux: extracted.description_travaux || '',
      type: 'cl6',
      numDevis: extracted.numero_devis || '',
      totalHT: extracted.montant_ht || '',
      totalTTC: extracted.montant_ttc || ttc,
      tva,
      dateDebut: extracted.date_debut || '',
      dateFin: extracted.date_fin || '',
      batiment: bat,
      entreprise: ent,
      marche: mar,
      rattachement: '',
      pole: null,
      etage: '',
      ope: null,
      ger: null,
      ptr: null,
      budget: [],
      uf: '',
      compteCl2: '',
      compteCl6: '',
    };
  };

  const startExtraction = async (file: File) => {
    if (phase !== 'idle') return;
    setPhase('scanning');
    setDoneSteps([]);

    STEPS.forEach((_, i) => {
      setTimeout(() => setDoneSteps((p) => [...p, i]), 600 + i * 550);
    });

    let extracted: ExtractDevisResult = {};
    try {
      const pdfBase64 = await fileToBase64(file);
      const res = await fetch('/api/extract-devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64 }),
      });
      if (res.ok) extracted = await res.json();
    } catch {
      // fall back to an empty patch on extraction failure
    }

    setTimeout(() => {
      onComplete(buildFormPatch(extracted), file);
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startExtraction(file);
  };

  return (
    <>
      <div className="hdr" data-hdr="accent">
        <button className="hdr__back" onClick={onBack}>
          <Icon name="arrowLeft" size={18} />
        </button>
        <div className="hdr__logo">GHU</div>
        <div className="hdr__title">
          <h1>Import du devis</h1>
          <p>DITMP · {today}</p>
        </div>
        <div className="hdr__badge">
          <Icon name="sparkles" size={14} /> IA
        </div>
      </div>
      <div className="scroll">
        <div style={{ padding: '28px 22px' }}>
          <div className="banneau">
            {phase === 'idle' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                  Importez le devis PDF
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 22, lineHeight: 1.6 }}>
                  L&apos;IA extraira les informations clés automatiquement
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--accent)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '44px 20px',
                    background: 'var(--accent-soft)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Icon
                    name="fileUp"
                    size={52}
                    style={{ color: 'var(--accent)', marginBottom: 12, display: 'block', margin: '0 auto 12px' }}
                  />
                  <div style={{ fontWeight: 700, color: 'var(--accent-ink)', fontSize: 16 }}>
                    Appuyer pour sélectionner
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>Format PDF uniquement</div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 14 }}>
                  Les données extraites pourront être corrigées avant génération
                </div>
              </div>
            )}

            {phase === 'scanning' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div
                  style={{
                    position: 'relative',
                    width: 80,
                    height: 100,
                    margin: '0 auto 20px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <Icon
                    name="fileText"
                    size={40}
                    style={{ color: 'var(--accent)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: 3,
                      background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                      boxShadow: '0 0 10px var(--accent)',
                      animation: 'scanner 1.4s ease-in-out infinite',
                    }}
                  />
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent-ink)', marginBottom: 20 }}>
                  Extraction en cours…
                </div>
                {STEPS.map((step, i) => {
                  const done = doneSteps.includes(i);
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                        background: done ? 'var(--green-soft)' : 'var(--surface-2)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 8,
                        transition: 'background .3s',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: done ? 'var(--green)' : 'var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'background .3s',
                        }}
                      >
                        {done && <Icon name="check" size={13} style={{ color: '#fff' }} />}
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          color: done ? 'var(--green-ink)' : 'var(--text-3)',
                          fontWeight: done ? 600 : 400,
                          transition: 'color .3s',
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

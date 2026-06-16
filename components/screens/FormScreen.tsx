'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/icon';
import { Section } from '@/components/widgets/Section';
import { Field } from '@/components/widgets/Field';
import { SelectBtn } from '@/components/widgets/SelectBtn';
import { Seg } from '@/components/widgets/Seg';
import { Chips } from '@/components/widgets/Chips';
import { AmountCard } from '@/components/widgets/AmountCard';
import { SearchSheet, type AddField } from '@/components/ui/SearchSheet';
import { PdfPreviewSheet } from '@/components/ui/PdfPreviewSheet';
import { DownloadDoneSheet } from '@/components/ui/DownloadDoneSheet';
import { Toast, type ToastData } from '@/components/ui/Toast';
import { parseAmount, formatAmount, sanitizeAmountInput } from '@/lib/format';
import { BUDGET_OPTIONS } from '@/lib/data';
import { emptyFormData } from '@/lib/types';
import type {
  Batiment,
  Entreprise,
  FormData,
  Identifiant,
  Marche,
  Mode,
  Pole,
  Utilisateur,
  ValidePar,
} from '@/lib/types';

const SECTION_ERROR_MAP: Record<string, string> = {
  natureTravaux: 'nature',
  entreprise: 'marche',
  batiment: 'batiment',
  numDevis: 'montants',
  totalHT: 'montants',
  totalTTC: 'montants',
};

const SECTION_IDS = ['nature', 'marche', 'batiment', 'montants', 'identifiants', 'budget'];

const REQUIRED_BY_SECTION: Record<string, (keyof FormData)[]> = {
  nature: ['natureTravaux'],
  marche: ['entreprise'],
  batiment: ['batiment'],
  montants: ['numDevis', 'totalHT', 'totalTTC'],
};

type SheetKey = 'batiment' | 'entreprise' | 'marche' | 'ope' | 'ger' | 'ptr' | 'pole';

interface FormScreenProps {
  mode: Mode;
  initialData: Partial<FormData> | null;
  initialDevisFile?: File | null;
  batiments: Batiment[];
  setBatiments: React.Dispatch<React.SetStateAction<Batiment[]>>;
  entreprises: Entreprise[];
  setEntreprises: React.Dispatch<React.SetStateAction<Entreprise[]>>;
  marches: Marche[];
  setMarches: React.Dispatch<React.SetStateAction<Marche[]>>;
  opes: Identifiant[];
  setOpes: React.Dispatch<React.SetStateAction<Identifiant[]>>;
  gers: Identifiant[];
  setGers: React.Dispatch<React.SetStateAction<Identifiant[]>>;
  ptrs: Identifiant[];
  setPtrs: React.Dispatch<React.SetStateAction<Identifiant[]>>;
  poles: Pole[];
  setPoles: React.Dispatch<React.SetStateAction<Pole[]>>;
  currentUser: Utilisateur | null;
  onBack: () => void;
}

export function FormScreen({
  mode,
  initialData,
  initialDevisFile = null,
  batiments, setBatiments,
  entreprises, setEntreprises,
  marches, setMarches,
  opes, setOpes,
  gers, setGers,
  ptrs, setPtrs,
  poles, setPoles,
  currentUser,
  onBack,
}: FormScreenProps) {
  const [form, setFormState] = useState<FormData>(() => {
    const storedValidePar = currentUser
      ? (window.localStorage.getItem(`webappft_valide_par_${currentUser.id}`) as ValidePar | null)
      : null;
    return {
      ...emptyFormData,
      demandeur: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : '',
      validePar: storedValidePar || emptyFormData.validePar,
      ...initialData,
    };
  });
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['nature', 'marche', 'batiment', 'montants'])
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sheet, setSheet] = useState<SheetKey | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [ctaState, setCtaState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [devisFile, setDevisFile] = useState<File | null>(initialDevisFile);
  const devisInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ blob: Blob; filename: string; pageCount: number; devisMerged: boolean } | null>(null);
  const [downloadDone, setDownloadDone] = useState(false);

  const today = new Date().toLocaleDateString('fr-FR');

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setFormState((f) => ({ ...f, [k]: v }));
  const clearErr = (...keys: (keyof FormData)[]) =>
    setErrors((e) => {
      const n = { ...e };
      keys.forEach((k) => delete n[k]);
      return n;
    });

  // ── Number helpers ──────────────────────────────────────────────────────
  const htChange = (raw: string) => {
    const v = sanitizeAmountInput(raw);
    const ht = parseAmount(v);
    const rate = parseFloat(form.tva) / 100;
    const autoTTC = form.tva !== 'multiple' && !isNaN(ht) ? formatAmount(ht * (1 + rate)) : undefined;
    setFormState((f) => ({ ...f, totalHT: v, ...(autoTTC !== undefined ? { totalTTC: autoTTC } : {}) }));
  };
  const ttcChange = (raw: string) => {
    const v = sanitizeAmountInput(raw);
    const ttc = parseAmount(v);
    const rate = parseFloat(form.tva) / 100;
    const autoHT = form.tva !== 'multiple' && !isNaN(ttc) ? formatAmount(ttc / (1 + rate)) : undefined;
    setFormState((f) => ({ ...f, totalTTC: v, ...(autoHT !== undefined ? { totalHT: autoHT } : {}) }));
  };
  const tvaChange = (v: '10' | '20' | 'multiple') => {
    const ht = parseAmount(form.totalHT);
    if (v === 'multiple') {
      setFormState((f) => ({ ...f, tva: v }));
    } else {
      setFormState((f) => ({ ...f, tva: v, tvaAmount: '', totalTTC: !isNaN(ht) ? formatAmount(ht * (1 + parseFloat(v) / 100)) : f.totalTTC }));
    }
  };

  // ── Section helpers ──────────────────────────────────────────────────────
  const toggleSection = (id: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const isComplete = (sid: string) => {
    const fields = REQUIRED_BY_SECTION[sid];
    if (!fields) return false;
    return fields.every((f) => {
      const v = form[f];
      return v !== '' && v !== null && v !== undefined;
    });
  };
  const hasErr = (sid: string) => submitted && (REQUIRED_BY_SECTION[sid] || []).some((f) => errors[f]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.natureTravaux.trim()) errs.natureTravaux = 'Champ obligatoire';
    if (!form.entreprise) errs.entreprise = 'Sélectionnez une entreprise';
    if (!form.batiment) errs.batiment = 'Sélectionnez un bâtiment';
    if (!form.numDevis.trim()) errs.numDevis = 'N° devis requis';
    if (!form.totalHT.trim()) errs.totalHT = 'Montant HT requis';
    if (!form.totalTTC.trim()) errs.totalTTC = 'Montant TTC requis';
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      setOpenSections((prev) => {
        const next = new Set(prev);
        (Object.keys(errs) as (keyof FormData)[]).forEach((k) => {
          const sid = SECTION_ERROR_MAP[k];
          if (sid) next.add(sid);
        });
        return next;
      });
      setToast({ msg: `${Object.keys(errs).length} champ(s) obligatoire(s) manquant(s)`, type: 'error' });
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    setSubmitted(true);
    if (!validate()) return;
    setCtaState('loading');
    try {
      const { generateFichePdfBlob, mergeWithDevis } = await import('@/lib/pdf');
      const ficheBlob = await generateFichePdfBlob(form, today);
      const { blob, pageCount, devisMerged } = await mergeWithDevis(ficheBlob, devisFile);
      const filename = `Fiche-travaux-${form.numDevis || 'sans-devis'}.pdf`;
      setPreview({ blob, filename, pageCount, devisMerged });
      if (devisFile && !devisMerged) {
        setToast({ msg: "Le devis n'a pas pu être fusionné (fichier invalide), seule la fiche a été générée", type: 'error' });
      }
      setCtaState('idle');
    } catch {
      setCtaState('idle');
      setToast({ msg: 'Erreur lors de la génération du PDF', type: 'error' });
    }
  };

  const closePreview = () => {
    setPreview(null);
  };

  const handleDownload = async () => {
    if (!preview) return;
    const { downloadBlob } = await import('@/lib/pdf');
    downloadBlob(preview.blob, preview.filename);
    setCtaState('success');
    setToast({ msg: 'PDF téléchargé avec succès !', type: 'success' });
    setTimeout(() => setCtaState('idle'), 3000);
    closePreview();
    setDownloadDone(true);
  };

  const handleNewFiche = () => {
    setFormState({ ...emptyFormData });
    setDevisFile(null);
    if (devisInputRef.current) devisInputRef.current.value = '';
    setOpenSections(new Set(['nature', 'marche', 'batiment', 'montants']));
    setErrors({});
    setSubmitted(false);
    setCtaState('idle');
    setDownloadDone(false);
  };

  const handleEditFiche = () => {
    setDownloadDone(false);
  };

  const handleDevisFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const { isValidPdf } = await import('@/lib/pdf');
    if (file && !(await isValidPdf(file))) {
      setToast({ msg: 'Le fichier sélectionné n\'est pas un PDF valide', type: 'error' });
      if (devisInputRef.current) devisInputRef.current.value = '';
      return;
    }
    setDevisFile(file);
  };

  const handleCTATap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height) * 1.8;
    const cx = e.clientX - rect.left - d / 2;
    const cy = e.clientY - rect.top - d / 2;
    const rip = document.createElement('span');
    Object.assign(rip.style, {
      position: 'absolute',
      borderRadius: '50%',
      width: `${d}px`,
      height: `${d}px`,
      left: `${cx}px`,
      top: `${cy}px`,
      background: 'rgba(255,255,255,0.28)',
      transform: 'scale(0)',
      animation: 'ctaRipple .55s ease-out',
      pointerEvents: 'none',
    });
    btn.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
    handleGenerate();
  };

  // ── Sheet configs ────────────────────────────────────────────────────────
  const batimentAddFields: AddField[] = [
    { key: 'numero', label: 'N° Bâtiment', placeholder: 'Ex: 488' },
    { key: 'nom', label: 'Nom', placeholder: 'Ex: Moreau' },
    { key: 'tva_defaut', label: 'TVA (%)', placeholder: '10 ou 20' },
  ];
  const entrepriseAddFields: AddField[] = [
    { key: 'nom', label: 'Raison sociale', placeholder: "Nom de l'entreprise" },
    { key: 'specialite', label: 'Spécialité', placeholder: 'Ex: CVC, Électricité…' },
  ];
  const marcheAddFields: AddField[] = [
    { key: 'numero', label: 'N° Marché', placeholder: '2025-XXXX' },
    { key: 'entreprise', label: 'Entreprise', placeholder: 'Titulaire' },
    { key: 'objet', label: 'Objet', placeholder: 'Description' },
  ];
  const identifiantAddFields = (prefix: string): AddField[] => [
    { key: 'code', label: 'Code', placeholder: `${prefix} XX-XXX` },
    { key: 'libelle', label: 'Libellé', placeholder: 'Description' },
  ];
  const poleAddFields: AddField[] = [
    { key: 'code', label: 'Code', placeholder: 'Ex: 14e' },
    { key: 'libelle', label: 'Libellé', placeholder: 'Description complète' },
  ];

  const onSelectMarche = (item: Marche) => {
    let ent = entreprises.find((e) => e.nom.toLowerCase() === item.entreprise.toLowerCase()) || null;
    if (!ent && item.entreprise) {
      ent = { id: Date.now(), nom: item.entreprise, specialite: '' };
      setEntreprises((p) => [...p, ent as Entreprise]);
    }
    setFormState((f) => ({ ...f, marche: item, entreprise: ent || f.entreprise }));
    if (ent) clearErr('entreprise');
  };

  const onSelectBatiment = (item: Batiment) => {
    const tva = item.tva_defaut || '20';
    const ht = parseAmount(form.totalHT);
    setFormState((f) => ({
      ...f,
      batiment: item,
      tva,
      totalTTC: !isNaN(ht) ? formatAmount(ht * (1 + parseFloat(tva) / 100)) : f.totalTTC,
    }));
    clearErr('batiment');
  };

  const completedCount = SECTION_IDS.filter(isComplete).length;
  const progressPct = Math.round((completedCount / SECTION_IDS.length) * 100);

  return (
    <>
      {/* Header */}
      <div className="hdr" data-hdr="accent">
        <button className="hdr__back" onClick={onBack}>
          <Icon name="arrowLeft" size={18} />
        </button>
        <div className="hdr__logo">GHU</div>
        <div className="hdr__title">
          <h1>Nouvelle fiche</h1>
          <p>DITMP · {today}</p>
        </div>
        <div className={`hdr__badge${mode === 'simple' ? ' is-manual' : ''}`}>
          {mode === 'intelligent' ? (
            <>
              <Icon name="sparkles" size={14} /> IA
            </>
          ) : (
            <>
              <Icon name="pencil" size={14} /> Manuel
            </>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="form-progress">
        <div className="form-progress__bar">
          <div className="form-progress__fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="form-progress__label">
          <strong>{completedCount}</strong>/{SECTION_IDS.length}
        </span>
      </div>

      {/* Body */}
      <div className="scroll">
        <div className="body">
          {mode === 'intelligent' && (
            <div className="extract-ok">
              <Icon name="checkCircle" size={20} />
              Extraction réussie — vérifiez et complétez si nécessaire
            </div>
          )}

          {/* Banneau fixe */}
          <div className="banneau">
            <div className="eyebrow">
              <Icon name="info" size={13} /> Informations fixes
            </div>
            <div className="banneau__grid">
              <div className="fixed-field">
                <div className="k">Demandeur</div>
                <div className="v">{form.demandeur || 'Non sélectionné'}</div>
              </div>
              <div className="fixed-field">
                <div className="k">Validé par</div>
                <Seg<NonNullable<ValidePar>>
                  options={[
                    { value: 'Ahmed SAID', label: 'Ahmed SAID' },
                    { value: 'Jordy FEUILLAS', label: 'Jordy FEUILLAS' },
                  ]}
                  value={form.validePar}
                  onChange={(v) => {
                    set('validePar', v);
                    if (currentUser) window.localStorage.setItem(`webappft_valide_par_${currentUser.id}`, v);
                  }}
                />
              </div>
              {(
                [
                  ['IG', 'AUCOUTURIER'],
                  ['Demandé le', today],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="fixed-field">
                  <div className="k">{k}</div>
                  <div className="v">{v}</div>
                </div>
              ))}
            </div>
            <div className="note">
              <Icon name="alertCircle" size={15} />
              <span>
                Le N° 2026-<strong>XXX</strong> est à compléter manuellement après impression
              </span>
            </div>
          </div>

          {/* 1 — Nature */}
          <Section
            id="nature"
            icon="clipboard"
            title="Nature des travaux"
            summary={form.natureTravaux || 'À compléter'}
            open={openSections.has('nature')}
            onToggle={toggleSection}
            isComplete={isComplete('nature')}
            hasError={hasErr('nature')}
          >
            <Field
              label="Description"
              required
              error={submitted && errors.natureTravaux}
              hint={`${form.natureTravaux.length}/130 caractères`}
            >
              <input
                className={`input${submitted && errors.natureTravaux ? ' has-error' : ''}`}
                value={form.natureTravaux}
                maxLength={130}
                onChange={(e) => {
                  set('natureTravaux', e.target.value);
                  clearErr('natureTravaux');
                }}
                placeholder="Ex : Dépannage SERSI-LVCOM (Site Hauteville)"
              />
            </Field>
            <Field label="Type de demande" required>
              <Seg
                value={form.type}
                onChange={(v) => set('type', v)}
                options={[
                  { value: 'cl2', label: 'Classe 2', sub: 'Architectes / Ingénieurs' },
                  { value: 'cl6', label: 'Classe 6', sub: 'Techniciens / Marchés' },
                ]}
              />
            </Field>
          </Section>

          {/* 2 — Marché & Entreprise */}
          <Section
            id="marche"
            icon="tag"
            title="Marché & Entreprise"
            summary={form.entreprise ? form.entreprise.nom : 'Entreprise non renseignée'}
            open={openSections.has('marche')}
            onToggle={toggleSection}
            isComplete={isComplete('marche')}
            hasError={hasErr('marche')}
          >
            <Field label="Marché (optionnel)">
              <SelectBtn
                value={form.marche ? form.marche.numero : ''}
                subtitle={form.marche ? `${form.marche.entreprise} — ${form.marche.objet}` : null}
                onClick={() => setSheet('marche')}
                onClear={() => set('marche', null)}
              />
            </Field>
            <Field label="Entreprise" required error={submitted && errors.entreprise}>
              <SelectBtn
                value={form.entreprise ? form.entreprise.nom : ''}
                subtitle={form.entreprise ? form.entreprise.specialite : null}
                hasError={submitted && !!errors.entreprise}
                onClick={() => setSheet('entreprise')}
                onClear={() => {
                  set('entreprise', null);
                  clearErr('entreprise');
                }}
              />
            </Field>
            <Field label="Rattachement marché d'entretien">
              <Seg
                value={form.rattachement}
                onChange={(v) => set('rattachement', v)}
                options={[
                  { value: 'Oui', label: 'Oui' },
                  { value: 'Non', label: 'Non' },
                ]}
              />
            </Field>
          </Section>

          {/* 3 — Localisation */}
          <Section
            id="batiment"
            icon="building"
            title="Localisation"
            summary={form.batiment ? `Bât. ${form.batiment.numero} — ${form.batiment.nom}` : 'Bâtiment non renseigné'}
            open={openSections.has('batiment')}
            onToggle={toggleSection}
            isComplete={isComplete('batiment')}
            hasError={hasErr('batiment')}
          >
            <Field label="Bâtiment" required error={submitted && errors.batiment}>
              <SelectBtn
                value={form.batiment ? `N° ${form.batiment.numero}` : ''}
                subtitle={form.batiment ? `${form.batiment.nom} — TVA ${form.batiment.tva_defaut || '20'}%` : null}
                hasError={submitted && !!errors.batiment}
                onClick={() => setSheet('batiment')}
                onClear={() => {
                  set('batiment', null);
                  clearErr('batiment');
                }}
              />
            </Field>
            <div className="grid2">
              <Field label="Étage">
                <input className="input" value={form.etage} onChange={(e) => set('etage', e.target.value)} placeholder="Ex : Entre-SOL" />
              </Field>
              <Field label="Pôle">
                <SelectBtn
                  value={form.pole ? form.pole.libelle : ''}
                  onClick={() => setSheet('pole')}
                  onClear={() => set('pole', null)}
                />
              </Field>
            </div>
          </Section>

          {/* 4 — Devis & Montants */}
          <Section
            id="montants"
            icon="euro"
            title="Devis & Montants"
            summary={form.totalHT ? `HT ${form.totalHT} € · TTC ${form.totalTTC} €` : 'Montants non renseignés'}
            open={openSections.has('montants')}
            onToggle={toggleSection}
            isComplete={isComplete('montants')}
            hasError={hasErr('montants')}
          >
            <Field label="N° Devis" required error={submitted && errors.numDevis}>
              <input
                className={`input input--num${submitted && errors.numDevis ? ' has-error' : ''}`}
                value={form.numDevis}
                onChange={(e) => {
                  set('numDevis', e.target.value);
                  clearErr('numDevis');
                }}
                placeholder="PR2605-XXXXX"
              />
            </Field>
            <Field label="Devis PDF (optionnel)" hint="Sera fusionné avec la fiche dans le PDF final">
              <SelectBtn
                value={devisFile?.name}
                placeholder="Joindre le devis PDF…"
                onClick={() => devisInputRef.current?.click()}
                onClear={() => {
                  setDevisFile(null);
                  if (devisInputRef.current) devisInputRef.current.value = '';
                }}
              />
              <input
                ref={devisInputRef}
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleDevisFileChange}
              />
            </Field>
            <Field label="TVA" hint={form.batiment ? `Pré-rempli depuis le bâtiment ${form.batiment.numero} — modifiable` : null}>
              <Seg
                value={form.tva}
                onChange={tvaChange}
                options={[
                  { value: '10', label: '10%' },
                  { value: '20', label: '20%' },
                  { value: 'multiple', label: 'TVA multiple' },
                ]}
              />
            </Field>
            {form.tva === 'multiple' && (
              <Field label="Montant TVA" hint="Calcul automatique HT↔TTC désactivé">
                <input
                  className="input input--num"
                  inputMode="decimal"
                  value={form.tvaAmount}
                  onChange={(e) => set('tvaAmount', sanitizeAmountInput(e.target.value))}
                  placeholder="0,00"
                />
              </Field>
            )}
            <div className="grid2">
              <Field label="Total HT" required error={submitted && errors.totalHT}>
                <input
                  className={`input input--num${submitted && errors.totalHT ? ' has-error' : ''}`}
                  inputMode="decimal"
                  value={form.totalHT}
                  onChange={(e) => {
                    htChange(e.target.value);
                    clearErr('totalHT', 'totalTTC');
                  }}
                  placeholder="0,00"
                />
              </Field>
              <Field label="Total TTC" required error={submitted && errors.totalTTC}>
                <input
                  className={`input input--num${submitted && errors.totalTTC ? ' has-error' : ''}`}
                  inputMode="decimal"
                  value={form.totalTTC}
                  onChange={(e) => {
                    ttcChange(e.target.value);
                    clearErr('totalHT', 'totalTTC');
                  }}
                  placeholder="0,00"
                />
              </Field>
            </div>
            {(form.totalHT || form.totalTTC) && <AmountCard ht={form.totalHT} ttc={form.totalTTC} />}
            <div className="grid2" style={{ marginTop: 14 }}>
              <Field label="Date début">
                <input type="date" className="input" value={form.dateDebut} onChange={(e) => set('dateDebut', e.target.value)} />
              </Field>
              <Field label="Date fin">
                <input type="date" className="input" value={form.dateFin} onChange={(e) => set('dateFin', e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* 5 — Identifiants */}
          <Section
            id="identifiants"
            icon="tag"
            title="Identifiants OPE / GER / PTR"
            summary={[form.ope?.code, form.ger?.code, form.ptr?.code].filter(Boolean).join(' · ') || 'Optionnels'}
            open={openSections.has('identifiants')}
            onToggle={toggleSection}
            isComplete={!!(form.ope || form.ger || form.ptr)}
          >
            <Field label="OPE">
              <SelectBtn value={form.ope?.code || ''} subtitle={form.ope?.libelle} onClick={() => setSheet('ope')} onClear={() => set('ope', null)} />
            </Field>
            <Field label="GER">
              <SelectBtn value={form.ger?.code || ''} subtitle={form.ger?.libelle} onClick={() => setSheet('ger')} onClear={() => set('ger', null)} />
            </Field>
            <Field label="PTR">
              <SelectBtn value={form.ptr?.code || ''} subtitle={form.ptr?.libelle} onClick={() => setSheet('ptr')} onClear={() => set('ptr', null)} />
            </Field>
          </Section>

          {/* 6 — Budget */}
          <Section
            id="budget"
            icon="wallet"
            title="Budget & Comptes"
            summary={form.budget.length > 0 ? form.budget.join(', ') : 'Optionnel'}
            open={openSections.has('budget')}
            onToggle={toggleSection}
            isComplete={form.budget.length > 0}
          >
            <Field label="Budget">
              <Chips options={BUDGET_OPTIONS.map((v) => ({ value: v, label: v }))} values={form.budget} onChange={(v) => set('budget', v)} />
            </Field>
            <div className="grid2" style={{ marginTop: 4 }}>
              <Field label="UF">
                <input className="input" value={form.uf} onChange={(e) => set('uf', e.target.value)} placeholder="Code UF" />
              </Field>
              <Field label="Compte Cl2">
                <input className="input" value={form.compteCl2} onChange={(e) => set('compteCl2', e.target.value)} placeholder="—" />
              </Field>
              <Field label="Compte Cl6">
                <input className="input" value={form.compteCl6} onChange={(e) => set('compteCl6', e.target.value)} placeholder="—" />
              </Field>
            </div>
          </Section>

          {/* CTA */}
          <div className="cta-wrap">
            <button
              className={`cta${ctaState === 'loading' ? ' is-loading' : ''}${ctaState === 'success' ? ' is-success' : ''}`}
              onClick={handleCTATap}
            >
              {ctaState === 'idle' && (
                <>
                  <Icon name="fileText" size={20} /> Générer &amp; Prévisualiser le PDF
                </>
              )}
              {ctaState === 'loading' && <div className="cta__spinner" />}
              {ctaState === 'success' && (
                <>
                  <Icon name="checkCircle" size={20} /> PDF téléchargé avec succès
                </>
              )}
            </button>
            <div className="cta-sub">
              {devisFile ? 'Fiche travaux + devis original fusionnés en un seul fichier' : 'Joignez un devis PDF ci-dessus pour le fusionner avec la fiche'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheets */}
      {sheet === 'batiment' && (
        <SearchSheet<Batiment>
          title="Bâtiment"
          items={batiments}
          searchKeys={['numero', 'nom']}
          addLabel="bâtiment"
          addFields={batimentAddFields}
          onAddItem={(item) => setBatiments((p) => [...p, item])}
          onSelect={onSelectBatiment}
          onClose={() => setSheet(null)}
          renderRow={(item) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <div className="opt-row__t">N° {item.numero}</div>
                <div className="opt-row__s">{item.nom}</div>
              </div>
              <span className="tva-tag">TVA {item.tva_defaut || '20'}%</span>
            </div>
          )}
        />
      )}

      {sheet === 'entreprise' && (
        <SearchSheet<Entreprise>
          title="Entreprise"
          items={entreprises}
          searchKeys={['nom', 'specialite']}
          addLabel="entreprise"
          addFields={entrepriseAddFields}
          onAddItem={(item) => setEntreprises((p) => [...p, item])}
          onSelect={(item) => {
            set('entreprise', item);
            clearErr('entreprise');
          }}
          onClose={() => setSheet(null)}
          renderRow={(item) => (
            <div>
              <div className="opt-row__t">{item.nom}</div>
              <div className="opt-row__s">{item.specialite}</div>
            </div>
          )}
        />
      )}

      {sheet === 'marche' && (
        <SearchSheet<Marche>
          title="Marché"
          items={marches}
          searchKeys={['numero', 'entreprise', 'objet']}
          addLabel="marché"
          addFields={marcheAddFields}
          onAddItem={(item) => setMarches((p) => [...p, item])}
          onSelect={onSelectMarche}
          onClose={() => setSheet(null)}
          renderRow={(item) => (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="opt-row__t" style={{ fontFamily: 'var(--font-num)' }}>
                  {item.numero}
                </span>
                <span style={{ fontSize: 13, color: 'var(--accent-ink)', fontWeight: 600 }}>{item.entreprise}</span>
              </div>
              <div className="opt-row__s">{item.objet}</div>
            </div>
          )}
        />
      )}

      {sheet === 'ope' && (
        <SearchSheet<Identifiant>
          title="OPE"
          items={opes}
          searchKeys={['code', 'libelle']}
          addLabel="OPE"
          addFields={identifiantAddFields('OPE')}
          onAddItem={(item) => setOpes((p) => [...p, item])}
          onSelect={(item) => set('ope', item)}
          onClose={() => setSheet(null)}
          renderRow={(item) => (
            <div>
              <div className="opt-row__t" style={{ fontFamily: 'var(--font-num)' }}>
                {item.code}
              </div>
              <div className="opt-row__s">{item.libelle}</div>
            </div>
          )}
        />
      )}

      {sheet === 'ger' && (
        <SearchSheet<Identifiant>
          title="GER"
          items={gers}
          searchKeys={['code', 'libelle']}
          addLabel="GER"
          addFields={identifiantAddFields('GER')}
          onAddItem={(item) => setGers((p) => [...p, item])}
          onSelect={(item) => set('ger', item)}
          onClose={() => setSheet(null)}
          renderRow={(item) => (
            <div>
              <div className="opt-row__t" style={{ fontFamily: 'var(--font-num)' }}>
                {item.code}
              </div>
              <div className="opt-row__s">{item.libelle}</div>
            </div>
          )}
        />
      )}

      {sheet === 'ptr' && (
        <SearchSheet<Identifiant>
          title="PTR"
          items={ptrs}
          searchKeys={['code', 'libelle']}
          addLabel="PTR"
          addFields={identifiantAddFields('PTR')}
          onAddItem={(item) => setPtrs((p) => [...p, item])}
          onSelect={(item) => set('ptr', item)}
          onClose={() => setSheet(null)}
          renderRow={(item) => (
            <div>
              <div className="opt-row__t" style={{ fontFamily: 'var(--font-num)' }}>
                {item.code}
              </div>
              <div className="opt-row__s">{item.libelle}</div>
            </div>
          )}
        />
      )}

      {sheet === 'pole' && (
        <SearchSheet<Pole>
          title="Pôle"
          items={poles}
          searchKeys={['code', 'libelle']}
          addLabel="pôle"
          addFields={poleAddFields}
          onAddItem={(item) => setPoles((p) => [...p, item])}
          onSelect={(item) => set('pole', item)}
          onClose={() => setSheet(null)}
          renderRow={(item) => (
            <div>
              <div className="opt-row__t">{item.libelle}</div>
              <div className="opt-row__s">{item.code}</div>
            </div>
          )}
        />
      )}

      {/* PDF Preview */}
      {preview && (
        <PdfPreviewSheet
          blob={preview.blob}
          filename={preview.filename}
          pageCount={preview.pageCount}
          hasDevis={!!devisFile && preview.devisMerged}
          onDownload={handleDownload}
          onClose={closePreview}
        />
      )}

      {/* Download done */}
      {downloadDone && <DownloadDoneSheet onNewFiche={handleNewFiche} onEditFiche={handleEditFiche} />}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}

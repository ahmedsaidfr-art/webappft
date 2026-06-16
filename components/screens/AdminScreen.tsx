'use client';

import { useState } from 'react';
import { Icon } from '@/components/icon';
import { AdminList } from '@/components/screens/AdminList';
import type { Batiment, Entreprise, Identifiant, Marche, Pole, Utilisateur } from '@/lib/types';

type Tab = 'batiment' | 'entreprise' | 'marche' | 'ope' | 'ger' | 'ptr' | 'pole' | 'utilisateur';

interface AdminScreenProps {
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
  utilisateurs: Utilisateur[];
  setUtilisateurs: React.Dispatch<React.SetStateAction<Utilisateur[]>>;
  onBack: () => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'batiment', label: 'Bâtiments' },
  { id: 'entreprise', label: 'Entreprises' },
  { id: 'marche', label: 'Marchés' },
  { id: 'ope', label: 'OPE' },
  { id: 'ger', label: 'GER' },
  { id: 'ptr', label: 'PTR' },
  { id: 'pole', label: 'Pôles' },
  { id: 'utilisateur', label: 'Utilisateurs' },
];

export function AdminScreen({
  batiments, setBatiments,
  entreprises, setEntreprises,
  marches, setMarches,
  opes, setOpes,
  gers, setGers,
  ptrs, setPtrs,
  poles, setPoles,
  utilisateurs, setUtilisateurs,
  onBack,
}: AdminScreenProps) {
  const [tab, setTab] = useState<Tab>('batiment');
  const today = new Date().toLocaleDateString('fr-FR');

  return (
    <>
      <div className="hdr" data-hdr="accent">
        <button className="hdr__back" onClick={onBack}>
          <Icon name="arrowLeft" size={18} />
        </button>
        <div className="hdr__logo">GHU</div>
        <div className="hdr__title">
          <h1>Administration</h1>
          <p>DITMP · {today}</p>
        </div>
        <div className="hdr__badge is-manual">
          <Icon name="settings" size={14} />
        </div>
      </div>

      <div className="scroll">
        <div style={{ padding: '14px 22px 100px' }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 14 }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`chip${tab === t.id ? ' is-on' : ''}`} style={{ flexShrink: 0 }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'batiment' && (
            <AdminList<Batiment>
              title="Bâtiments"
              items={batiments}
              setItems={setBatiments}
              columns={[
                { key: 'numero', label: 'N°', placeholder: 'Ex: 488' },
                { key: 'nom', label: 'Nom', placeholder: 'Ex: Moreau' },
                { key: 'tva_defaut', label: 'TVA %', placeholder: '10 ou 20' },
              ]}
              newItemTemplate={{ numero: '', nom: '', tva_defaut: '20' }}
              renderRow={(i) => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>N° {i.numero}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{i.nom}</div>
                  </div>
                  <span className="tva-tag">TVA {i.tva_defaut || '20'}%</span>
                </div>
              )}
            />
          )}

          {tab === 'entreprise' && (
            <AdminList<Entreprise>
              title="Entreprises"
              items={entreprises}
              setItems={setEntreprises}
              columns={[
                { key: 'nom', label: 'Raison sociale', placeholder: 'Nom' },
                { key: 'specialite', label: 'Spécialité', placeholder: 'Ex: CVC' },
              ]}
              newItemTemplate={{ nom: '', specialite: '' }}
              renderRow={(i) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{i.nom}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{i.specialite}</div>
                </div>
              )}
            />
          )}

          {tab === 'marche' && (
            <AdminList<Marche>
              title="Marchés"
              items={marches}
              setItems={setMarches}
              columns={[
                { key: 'numero', label: 'N° Marché', placeholder: '2025-XXXX' },
                { key: 'entreprise', label: 'Entreprise', placeholder: 'Titulaire' },
                { key: 'objet', label: 'Objet', placeholder: 'Description' },
              ]}
              newItemTemplate={{ numero: '', entreprise: '', objet: '' }}
              renderRow={(i) => (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-num)' }}>{i.numero}</div>
                  <div style={{ fontSize: 13, color: 'var(--accent-ink)' }}>{i.entreprise}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{i.objet}</div>
                </div>
              )}
            />
          )}

          {tab === 'ope' && (
            <AdminList<Identifiant>
              title="OPE"
              items={opes}
              setItems={setOpes}
              columns={[
                { key: 'code', label: 'Code', placeholder: 'OPE 26-XXX' },
                { key: 'libelle', label: 'Libellé', placeholder: 'Description' },
              ]}
              newItemTemplate={{ code: '', libelle: '' }}
              renderRow={(i) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-num)' }}>{i.code}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{i.libelle}</div>
                </div>
              )}
            />
          )}

          {tab === 'ger' && (
            <AdminList<Identifiant>
              title="GER"
              items={gers}
              setItems={setGers}
              columns={[
                { key: 'code', label: 'Code', placeholder: 'GER 24-XXX' },
                { key: 'libelle', label: 'Libellé', placeholder: 'Description' },
              ]}
              newItemTemplate={{ code: '', libelle: '' }}
              renderRow={(i) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-num)' }}>{i.code}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{i.libelle}</div>
                </div>
              )}
            />
          )}

          {tab === 'ptr' && (
            <AdminList<Identifiant>
              title="PTR"
              items={ptrs}
              setItems={setPtrs}
              columns={[
                { key: 'code', label: 'Code', placeholder: 'PTR 26-XXX' },
                { key: 'libelle', label: 'Libellé', placeholder: 'Description' },
              ]}
              newItemTemplate={{ code: '', libelle: '' }}
              renderRow={(i) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-num)' }}>{i.code}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{i.libelle}</div>
                </div>
              )}
            />
          )}

          {tab === 'pole' && (
            <AdminList<Pole>
              title="Pôles"
              items={poles}
              setItems={setPoles}
              columns={[
                { key: 'code', label: 'Code', placeholder: 'Ex: 14e' },
                { key: 'libelle', label: 'Libellé', placeholder: 'Description complète' },
              ]}
              newItemTemplate={{ code: '', libelle: '' }}
              renderRow={(i) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{i.libelle}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{i.code}</div>
                </div>
              )}
            />
          )}

          {tab === 'utilisateur' && (
            <AdminList<Utilisateur>
              title="Utilisateurs"
              items={utilisateurs}
              setItems={setUtilisateurs}
              columns={[
                { key: 'nom', label: 'Nom', placeholder: 'Ex: SAID' },
                { key: 'prenom', label: 'Prénom', placeholder: 'Ex: Ahmed' },
                { key: 'nomComplet', label: 'Nom complet', placeholder: 'Ex: SAID Ahmed' },
                { key: 'email', label: 'Email', placeholder: 'prenom.nom@ghu-paris.fr' },
              ]}
              newItemTemplate={{ nom: '', prenom: '', nomComplet: '', email: '' }}
              renderRow={(i) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{i.nomComplet}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{i.email}</div>
                </div>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
}

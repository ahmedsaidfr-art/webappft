'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon, type IconName } from '@/components/icon';
import { SelectBtn } from '@/components/widgets/SelectBtn';
import { SearchSheet, type AddField } from '@/components/ui/SearchSheet';
import type { Mode, Utilisateur } from '@/lib/types';

const ADMIN_USER_NOM_COMPLET = 'SAID Ahmed';

interface HomeScreenProps {
  onSelect: (mode: Mode) => void;
  onAdmin: () => void;
  utilisateurs: Utilisateur[];
  setUtilisateurs: React.Dispatch<React.SetStateAction<Utilisateur[]>>;
  currentUser: Utilisateur | null;
  setCurrentUser: (user: Utilisateur | null) => void;
}

const utilisateurAddFields: AddField[] = [
  { key: 'nom', label: 'Nom', placeholder: 'Ex: SAID' },
  { key: 'prenom', label: 'Prénom', placeholder: 'Ex: Ahmed' },
  { key: 'nomComplet', label: 'Nom complet', placeholder: 'Ex: SAID Ahmed' },
  { key: 'email', label: 'Email', placeholder: 'prenom.nom@ghu-paris.fr' },
];

function ModeCard({
  onClick,
  accent,
  iconName,
  title,
  desc,
  badge,
}: {
  onClick: () => void;
  accent: 'blue' | 'green';
  iconName: IconName;
  title: string;
  desc: string;
  badge?: string | null;
}) {
  const ink = accent === 'blue' ? 'var(--accent-ink)' : 'var(--green-ink)';
  const soft = accent === 'blue' ? 'var(--accent-soft)' : 'var(--green-soft)';
  const border = accent === 'blue' ? 'var(--accent)' : 'var(--green)';

  return (
    <button
      onClick={onClick}
      className="mode-card"
      style={{
        width: '100%',
        padding: '20px 18px',
        borderRadius: 'var(--radius-lg)',
        border: `1.5px solid ${border}`,
        background: 'var(--surface)',
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: 'var(--shadow-1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 15,
        fontFamily: 'var(--font-ui)',
        color: 'var(--text)',
        transition: 'transform .14s var(--ease), box-shadow .14s var(--ease)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius)',
          flexShrink: 0,
          background: soft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={iconName} size={24} style={{ color: ink }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 5, color: ink }}>{title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</div>
        {badge && (
          <div
            style={{
              marginTop: 9,
              display: 'inline-flex',
              background: soft,
              borderRadius: 'var(--radius-pill)',
              padding: '4px 11px',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: ink }}>{badge}</span>
          </div>
        )}
      </div>
    </button>
  );
}

export function HomeScreen({ onSelect, onAdmin, utilisateurs, setUtilisateurs, currentUser, setCurrentUser }: HomeScreenProps) {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const isAdminUser = currentUser?.nomComplet === ADMIN_USER_NOM_COMPLET;
  const [userSheetOpen, setUserSheetOpen] = useState(false);
  const sortedUsers = [...utilisateurs].sort((a, b) => a.nomComplet.localeCompare(b.nomComplet));

  return (
    <div className="scroll">
      {/* Hero */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '40px 24px 28px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 22px',
            marginBottom: 20,
            boxShadow: 'var(--shadow-2)',
          }}
        >
          <Image src="/logo-ghu.png" alt="GHU Paris" width={196} height={62} style={{ width: 196, height: 'auto', display: 'block' }} priority />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: 'var(--tracking-tight)', marginBottom: 5 }}>
          Fiche de Demande de Travaux
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-3)', fontFamily: 'var(--font-num)', textTransform: 'capitalize' }}>
          {today}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '20px 20px 80px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            marginBottom: 4,
            paddingLeft: 2,
          }}
        >
          Utilisateur
        </div>

        <div style={{ marginBottom: 6 }}>
          <SelectBtn
            value={currentUser?.nomComplet || ''}
            placeholder="Sélectionner un utilisateur…"
            onClick={() => setUserSheetOpen(true)}
            onClear={() => setCurrentUser(null)}
          />
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            marginBottom: 4,
            marginTop: 10,
            paddingLeft: 2,
          }}
        >
          Nouveau document
        </div>

        {isAdminUser && (
          <ModeCard
            onClick={() => onSelect('intelligent')}
            accent="blue"
            iconName="sparkles"
            title="Mode Intelligent"
            badge="RECOMMANDÉ"
            desc="Uploadez le devis PDF — l'IA extrait automatiquement l'entreprise, les montants, le bâtiment et les dates."
          />
        )}

        <ModeCard
          onClick={() => onSelect('simple')}
          accent="green"
          iconName="pencil"
          title="Mode Manuel"
          badge={null}
          desc="Remplissez le formulaire manuellement. Listes déroulantes disponibles, aucune connexion IA requise."
        />

        {isAdminUser && (
          <div style={{ marginTop: 8, borderTop: '1px solid var(--hairline)', paddingTop: 14 }}>
            <button
              onClick={onAdmin}
              className="admin-link"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                color: 'var(--text-2)',
                fontFamily: 'var(--font-ui)',
                transition: 'background .15s',
              }}
            >
              <Icon name="settings" size={17} style={{ color: 'var(--text-3)' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Administration des listes</span>
              <Icon name="chevronRight" size={16} style={{ color: 'var(--text-3)', marginLeft: 'auto' }} />
            </button>
          </div>
        )}
      </div>

      {userSheetOpen && (
        <SearchSheet<Utilisateur>
          title="Utilisateur"
          items={sortedUsers}
          searchKeys={['nomComplet', 'nom', 'prenom', 'email']}
          addLabel="utilisateur"
          addFields={utilisateurAddFields}
          onAddItem={(item) => setUtilisateurs((p) => [...p, item])}
          onSelect={(item) => setCurrentUser(item)}
          onClose={() => setUserSheetOpen(false)}
          renderRow={(item) => (
            <div>
              <div className="opt-row__t">{item.nomComplet}</div>
              <div className="opt-row__s">{item.email}</div>
            </div>
          )}
        />
      )}
    </div>
  );
}

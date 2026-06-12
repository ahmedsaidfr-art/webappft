import type { Batiment, Entreprise, Marche, Identifiant, Pole } from './types';

export const SEED_BATIMENTS: Batiment[] = [
  { id: 1, numero: '467', nom: 'Hauteville', tva_defaut: '20' },
  { id: 2, numero: '201', nom: 'Sainte-Anne principal', tva_defaut: '20' },
  { id: 3, numero: '202', nom: 'Sainte-Anne annexe', tva_defaut: '20' },
  { id: 4, numero: '310', nom: 'Henri Ey', tva_defaut: '10' },
  { id: 5, numero: '420', nom: 'Cabanis', tva_defaut: '20' },
  { id: 6, numero: '501', nom: 'Esquirol', tva_defaut: '10' },
  { id: 7, numero: '485', nom: 'Bichat', tva_defaut: '20' },
  { id: 8, numero: '302', nom: 'Moreau', tva_defaut: '20' },
];

export const SEED_ENTREPRISES: Entreprise[] = [
  { id: 1, nom: 'SERSI - LVCOM', specialite: 'Courants faibles' },
  { id: 2, nom: 'CIEC', specialite: 'Génie climatique' },
  { id: 3, nom: 'OTIS', specialite: 'Ascenseurs' },
  { id: 4, nom: 'ENGIE COFELY', specialite: 'Maintenance CVC' },
  { id: 5, nom: 'VINCI FACILITIES', specialite: 'Multi-technique' },
  { id: 6, nom: 'ACCEO', specialite: 'AMO / Conseil' },
];

export const SEED_MARCHES: Marche[] = [
  { id: 1, numero: '2021-0374', entreprise: 'CIEC', objet: 'Génie climatique' },
  { id: 2, numero: '2021-0610', entreprise: 'ACCEO', objet: 'AMO Ascenseurs' },
  { id: 3, numero: '2022-0487', entreprise: 'OTIS', objet: 'Ascenseurs' },
  { id: 4, numero: '2023-0701', entreprise: 'SERSI - LVCOM', objet: 'Courants faibles' },
  { id: 5, numero: '2024-0822', entreprise: 'ENGIE COFELY', objet: 'Maintenance CVC' },
  { id: 6, numero: '2025-0870', entreprise: 'VINCI FACILITIES', objet: 'Multi-technique' },
];

export const SEED_OPES: Identifiant[] = [
  { id: 1, code: 'OPE 23-340', libelle: 'Réfection toiture Sainte-Anne' },
  { id: 2, code: 'OPE 24-210', libelle: 'Mise aux normes électriques' },
  { id: 3, code: 'OPE 25-450', libelle: 'Rénovation salles de bain' },
  { id: 4, code: 'OPE 26-686', libelle: 'Extension bâtiment Hauteville' },
];

export const SEED_GERS: Identifiant[] = [
  { id: 1, code: 'GER 23-001', libelle: 'Gros entretien toiture' },
  { id: 2, code: 'GER 23-450', libelle: 'Réfection peintures' },
  { id: 3, code: 'GER 24-200', libelle: 'Remplacement menuiseries' },
  { id: 4, code: 'GER 24-700', libelle: 'Mise à niveau ascenseurs' },
];

export const SEED_PTRS: Identifiant[] = [
  { id: 1, code: 'PTR 26-001', libelle: 'Maintenance préventive CVC' },
  { id: 2, code: 'PTR 26-100', libelle: 'Entretien espaces verts' },
  { id: 3, code: 'PTR 26-250', libelle: 'Nettoyage industriel' },
  { id: 4, code: 'PTR 26-700', libelle: 'Sécurité incendie' },
];

export const SEED_POLES: Pole[] = [
  { id: 1, code: '5/6/7e', libelle: '5/6/7e arrondissement' },
  { id: 2, code: '8/9/10e', libelle: '8/9/10e arrondissement' },
  { id: 3, code: '14e', libelle: '14e arrondissement' },
  { id: 4, code: 'Neuro', libelle: 'Neurosciences' },
  { id: 5, code: 'Psy adulte', libelle: 'Psychiatrie adulte' },
  { id: 6, code: 'Psy enfant', libelle: 'Psychiatrie enfant/ado' },
  { id: 7, code: 'Toxico', libelle: 'Toxicomanie' },
  { id: 8, code: 'Direction', libelle: 'Direction générale' },
];

export const SIMULATED_EXTRACTION = {
  numDevis: 'PR2605-30393',
  totalHT: '1 283,48',
  tva: '20' as const,
  dateDebut: '2026-05-27',
  dateFin: '2026-06-27',
  natureTravaux: 'Dépannage SERSI-LVCOM (Site Hauteville)',
  type: 'cl6' as const,
  batimentNumero: '467',
  entrepriseNom: 'SERSI - LVCOM',
};

export const BUDGET_OPTIONS = ['H', 'Annexe B', 'Annexe C', 'Annexe E', 'Annexe P'];

export interface Batiment {
  id: number;
  numero: string;
  nom: string;
  tva_defaut: '10' | '20';
}

export interface Entreprise {
  id: number;
  nom: string;
  specialite: string;
}

export interface Marche {
  id: number;
  numero: string;
  entreprise: string;
  objet: string;
}

export interface Identifiant {
  id: number;
  code: string;
  libelle: string;
}

export interface Pole {
  id: number;
  code: string;
  libelle: string;
}

export type TypeTravaux = 'cl2' | 'cl6';
export type Rattachement = 'Oui' | 'Non' | '';
export type Tva = '10' | '20';

export interface FormData {
  natureTravaux: string;
  type: TypeTravaux;
  marche: Marche | null;
  entreprise: Entreprise | null;
  rattachement: Rattachement;
  batiment: Batiment | null;
  etage: string;
  pole: Pole | null;
  numDevis: string;
  totalHT: string;
  totalTTC: string;
  tva: Tva;
  dateDebut: string;
  dateFin: string;
  ope: Identifiant | null;
  ger: Identifiant | null;
  ptr: Identifiant | null;
  budget: string[];
  uf: string;
  compteCl2: string;
  compteCl6: string;
}

export type Mode = 'intelligent' | 'simple';

export type Screen = 'home' | 'upload' | 'form' | 'admin';

export const emptyFormData: FormData = {
  natureTravaux: '',
  type: 'cl6',
  marche: null,
  entreprise: null,
  rattachement: '',
  batiment: null,
  etage: '',
  pole: null,
  numDevis: '',
  totalHT: '',
  totalTTC: '',
  tva: '20',
  dateDebut: '',
  dateFin: '',
  ope: null,
  ger: null,
  ptr: null,
  budget: [],
  uf: '',
  compteCl2: '',
  compteCl6: '',
};

export interface ExtractDevisResult {
  nom_entreprise?: string;
  numero_devis?: string;
  montant_ht?: string;
  montant_ttc?: string;
  taux_tva?: Tva;
  date_debut?: string;
  date_fin?: string;
  description_travaux?: string;
  batiment_numero?: string;
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Batiment, Entreprise, Marche, Identifiant, Pole } from '@/lib/types';
import {
  SEED_BATIMENTS,
  SEED_ENTREPRISES,
  SEED_MARCHES,
  SEED_OPES,
  SEED_GERS,
  SEED_PTRS,
  SEED_POLES,
} from '@/lib/data';

interface AppContextValue {
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
}

const AppContext = createContext<AppContextValue | null>(null);

function usePersistedState<T>(key: string, seed: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(seed);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore storage errors (e.g. quota)
    }
  }, [key, state]);

  return [state, setState];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [batiments, setBatiments] = usePersistedState('ghu.batiments', SEED_BATIMENTS);
  const [entreprises, setEntreprises] = usePersistedState('ghu.entreprises', SEED_ENTREPRISES);
  const [marches, setMarches] = usePersistedState('ghu.marches', SEED_MARCHES);
  const [opes, setOpes] = usePersistedState('ghu.opes', SEED_OPES);
  const [gers, setGers] = usePersistedState('ghu.gers', SEED_GERS);
  const [ptrs, setPtrs] = usePersistedState('ghu.ptrs', SEED_PTRS);
  const [poles, setPoles] = usePersistedState('ghu.poles', SEED_POLES);

  return (
    <AppContext.Provider
      value={{
        batiments, setBatiments,
        entreprises, setEntreprises,
        marches, setMarches,
        opes, setOpes,
        gers, setGers,
        ptrs, setPtrs,
        poles, setPoles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within an AppProvider');
  return ctx;
}

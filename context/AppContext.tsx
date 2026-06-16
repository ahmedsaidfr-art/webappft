'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Batiment, Entreprise, Marche, Identifiant, Pole, Utilisateur } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import {
  SEED_BATIMENTS,
  SEED_ENTREPRISES,
  SEED_MARCHES,
  SEED_OPES,
  SEED_GERS,
  SEED_PTRS,
  SEED_POLES,
  SEED_UTILISATEURS,
} from '@/lib/data';

const CURRENT_USER_STORAGE_KEY = 'webappft_current_user_id';

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
  utilisateurs: Utilisateur[];
  setUtilisateurs: React.Dispatch<React.SetStateAction<Utilisateur[]>>;
  currentUser: Utilisateur | null;
  setCurrentUser: (user: Utilisateur | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

type WithId = { id: number };

async function syncDiff<T extends WithId>(table: string, prev: T[], next: T[]) {
  const prevById = new Map(prev.map((i) => [i.id, i]));
  const nextIds = new Set(next.map((i) => i.id));

  const toDelete = prev.filter((i) => !nextIds.has(i.id));
  const toInsert = next.filter((i) => !prevById.has(i.id));
  const toUpdate = next.filter((i) => {
    const old = prevById.get(i.id);
    return old && JSON.stringify(old) !== JSON.stringify(i);
  });

  try {
    if (toDelete.length) {
      await supabase.from(table).delete().in('id', toDelete.map((i) => i.id));
    }
    if (toInsert.length) {
      await supabase.from(table).insert(toInsert);
    }
    for (const item of toUpdate) {
      await supabase.from(table).update(item).eq('id', item.id);
    }
  } catch {
    // ignore sync errors (e.g. offline)
  }
}

function useSupabaseCollection<T extends WithId>(table: string, seed: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
  const [state, setState] = useState<T[]>(seed);

  useEffect(() => {
    supabase
      .from(table)
      .select('*')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setState(data as T[]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAndSync: React.Dispatch<React.SetStateAction<T[]>> = (action) => {
    setState((prev) => {
      const next = typeof action === 'function' ? (action as (p: T[]) => T[])(prev) : action;
      syncDiff(table, prev, next);
      return next;
    });
  };

  return [state, setAndSync];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [batiments, setBatiments] = useSupabaseCollection('webappft_batiments', SEED_BATIMENTS);
  const [entreprises, setEntreprises] = useSupabaseCollection('webappft_entreprises', SEED_ENTREPRISES);
  const [marches, setMarches] = useSupabaseCollection('webappft_marches', SEED_MARCHES);
  const [opes, setOpes] = useSupabaseCollection('webappft_opes', SEED_OPES);
  const [gers, setGers] = useSupabaseCollection('webappft_gers', SEED_GERS);
  const [ptrs, setPtrs] = useSupabaseCollection('webappft_ptrs', SEED_PTRS);
  const [poles, setPoles] = useSupabaseCollection('webappft_poles', SEED_POLES);
  const [utilisateurs, setUtilisateurs] = useSupabaseCollection('webappft_utilisateurs', SEED_UTILISATEURS);

  const [currentUser, setCurrentUserState] = useState<Utilisateur | null>(null);

  useEffect(() => {
    const storedId = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedId) {
      const found = utilisateurs.find((u) => String(u.id) === storedId);
      if (found) setCurrentUserState(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilisateurs]);

  const setCurrentUser = (user: Utilisateur | null) => {
    setCurrentUserState(user);
    if (user) {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, String(user.id));
    } else {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  };

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
        utilisateurs, setUtilisateurs,
        currentUser, setCurrentUser,
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

'use client';

import { useState } from 'react';
import { AppProvider, useAppData } from '@/context/AppContext';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { UploadScreen } from '@/components/screens/UploadScreen';
import { FormScreen } from '@/components/screens/FormScreen';
import { AdminScreen } from '@/components/screens/AdminScreen';
import type { FormData, Mode, Screen } from '@/lib/types';

type NavDir = 'forward' | 'back';

function App() {
  const data = useAppData();

  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode | null>(null);
  const [formInit, setFormInit] = useState<Partial<FormData> | null>(null);
  const [navKey, setNavKey] = useState(0);
  const [navDir, setNavDir] = useState<NavDir>('forward');

  const navigate = (newScreen: Screen, newMode: Mode | null | undefined, dir: NavDir = 'forward') => {
    setNavDir(dir);
    setNavKey((k) => k + 1);
    setScreen(newScreen);
    if (newMode !== undefined) setMode(newMode);
  };

  const handleModeSelect = (m: Mode) => {
    setFormInit(null);
    navigate(m === 'intelligent' ? 'upload' : 'form', m);
  };

  const handleExtractionDone = (patch: Partial<FormData>) => {
    setFormInit(patch);
    navigate('form', mode);
  };

  const handleBack = () => {
    navigate('home', null, 'back');
    setFormInit(null);
  };

  return (
    <main className="screen">
      <div key={navKey} className={`screen-view screen-view--${navDir}`}>
        {screen === 'home' && <HomeScreen onSelect={handleModeSelect} onAdmin={() => navigate('admin', undefined)} />}

        {screen === 'upload' && (
          <UploadScreen
            onComplete={handleExtractionDone}
            onBack={handleBack}
            batiments={data.batiments}
            entreprises={data.entreprises}
            marches={data.marches}
          />
        )}

        {screen === 'form' && mode && (
          <FormScreen
            mode={mode}
            initialData={formInit}
            batiments={data.batiments}
            setBatiments={data.setBatiments}
            entreprises={data.entreprises}
            setEntreprises={data.setEntreprises}
            marches={data.marches}
            setMarches={data.setMarches}
            opes={data.opes}
            setOpes={data.setOpes}
            gers={data.gers}
            setGers={data.setGers}
            ptrs={data.ptrs}
            setPtrs={data.setPtrs}
            poles={data.poles}
            setPoles={data.setPoles}
            onBack={handleBack}
          />
        )}

        {screen === 'admin' && (
          <AdminScreen
            batiments={data.batiments}
            setBatiments={data.setBatiments}
            entreprises={data.entreprises}
            setEntreprises={data.setEntreprises}
            marches={data.marches}
            setMarches={data.setMarches}
            opes={data.opes}
            setOpes={data.setOpes}
            gers={data.gers}
            setGers={data.setGers}
            ptrs={data.ptrs}
            setPtrs={data.setPtrs}
            poles={data.poles}
            setPoles={data.setPoles}
            onBack={handleBack}
          />
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

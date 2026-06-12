import { NextResponse } from 'next/server';
import { SIMULATED_EXTRACTION } from '@/lib/data';
import type { ExtractDevisResult } from '@/lib/types';

/**
 * POST /api/extract-devis
 *
 * Stub extraction endpoint. Accepts { pdfBase64: string } and returns mocked
 * data matching the shape a multimodal LLM (Claude Sonnet / Gemini Flash)
 * would produce from a real devis PDF. Swap the body of this handler for a
 * real LLM call once an API key is configured.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.pdfBase64 !== 'string') {
    return NextResponse.json({ error: 'pdfBase64 is required' }, { status: 400 });
  }

  const result: ExtractDevisResult = {
    nom_entreprise: SIMULATED_EXTRACTION.entrepriseNom,
    numero_devis: SIMULATED_EXTRACTION.numDevis,
    montant_ht: SIMULATED_EXTRACTION.totalHT,
    taux_tva: SIMULATED_EXTRACTION.tva,
    date_debut: SIMULATED_EXTRACTION.dateDebut,
    date_fin: SIMULATED_EXTRACTION.dateFin,
    description_travaux: SIMULATED_EXTRACTION.natureTravaux,
    batiment_numero: SIMULATED_EXTRACTION.batimentNumero,
  };

  return NextResponse.json(result);
}

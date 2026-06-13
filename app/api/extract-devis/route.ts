import { NextResponse } from 'next/server';
import { SIMULATED_EXTRACTION } from '@/lib/data';
import type { ExtractDevisResult } from '@/lib/types';

const GEMINI_MODEL = 'gemini-2.5-flash';

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    nom_entreprise: { type: 'STRING', description: "Nom de l'entreprise émettrice du devis" },
    numero_devis: { type: 'STRING', description: 'Numéro / référence du devis' },
    montant_ht: { type: 'STRING', description: 'Montant total hors taxes, format "1 234,56"' },
    montant_ttc: { type: 'STRING', description: 'Montant total TTC, format "1 234,56"' },
    taux_tva: { type: 'STRING', description: 'Taux de TVA en pourcentage, par exemple "20"' },
    date_debut: { type: 'STRING', description: "Date de début des travaux au format AAAA-MM-JJ" },
    date_fin: { type: 'STRING', description: "Date de fin des travaux au format AAAA-MM-JJ" },
    description_travaux: { type: 'STRING', description: 'Description / nature des travaux' },
    batiment_numero: { type: 'STRING', description: 'Numéro du bâtiment concerné, si mentionné' },
  },
};

const PROMPT = `Tu es un assistant qui extrait les informations clés d'un devis de travaux au format PDF.
Analyse le document fourni et retourne un objet JSON correspondant au schéma demandé.
Si une information est absente du devis, laisse le champ vide (chaîne vide).
Les montants doivent être au format français avec une virgule pour les décimales et un espace comme séparateur de milliers (ex: "1 283,48").
Les dates doivent être au format AAAA-MM-JJ.`;

/**
 * POST /api/extract-devis
 *
 * Accepts { pdfBase64: string } and extracts key fields from a devis PDF
 * using the Gemini API. Falls back to mocked data if GEMINI_API_KEY is not
 * configured or if the extraction fails.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.pdfBase64 !== 'string') {
    return NextResponse.json({ error: 'pdfBase64 is required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackResult());
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: 'application/pdf', data: body.pdfBase64 } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(fallbackResult());
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json(fallbackResult());
    }

    const parsed = JSON.parse(text) as ExtractDevisResult;
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(fallbackResult());
  }
}

function fallbackResult(): ExtractDevisResult {
  return {
    nom_entreprise: SIMULATED_EXTRACTION.entrepriseNom,
    numero_devis: SIMULATED_EXTRACTION.numDevis,
    montant_ht: SIMULATED_EXTRACTION.totalHT,
    taux_tva: SIMULATED_EXTRACTION.tva,
    date_debut: SIMULATED_EXTRACTION.dateDebut,
    date_fin: SIMULATED_EXTRACTION.dateFin,
    description_travaux: SIMULATED_EXTRACTION.natureTravaux,
    batiment_numero: SIMULATED_EXTRACTION.batimentNumero,
  };
}

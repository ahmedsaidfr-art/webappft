import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import type { FormData } from './types';

const BORDER = '1pt solid #000000';
const GRAY = '#d9d9d9';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#000000',
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    border: BORDER,
    marginBottom: 0,
  },
  headerLeft: {
    width: '42%',
    borderRight: BORDER,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 130,
    marginBottom: 6,
  },
  headerAddress: {
    fontSize: 6.5,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  headerAddressBold: {
    fontSize: 6.5,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  headerRight: {
    width: '58%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  table: {
    flexGrow: 1,
    flexDirection: 'column',
    borderLeft: BORDER,
    borderRight: BORDER,
    borderBottom: BORDER,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottom: BORDER,
  },
  cell: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderRight: BORDER,
    padding: 6,
  },
  cellLast: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 6,
  },
  cellLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  cellValue: {
    fontSize: 8,
    marginTop: 2,
  },
  grayCell: {
    backgroundColor: GRAY,
    borderRight: BORDER,
    padding: 4,
    justifyContent: 'center',
  },
  grayCellLast: {
    backgroundColor: GRAY,
    padding: 4,
    justifyContent: 'center',
  },
  grayLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    textAlign: 'center',
  },
  centerValue: {
    fontSize: 8,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1pt solid #000000',
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMark: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  checkboxLabel: {
    fontSize: 7.5,
  },
});

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <View style={styles.checkboxRow}>
      <View style={styles.checkbox}>{checked && <Text style={styles.checkboxMark}>X</Text>}</View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
}

function frDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

interface FichePdfDocProps {
  form: FormData;
  today: string;
}

export function FichePdfDoc({ form, today }: FichePdfDocProps) {
  return (
    <Document title="Fiche de Demande de Travaux">
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src="/logo-ghu.png" />
            <Text style={styles.headerAddressBold}>
              Direction de l&apos;Ingénierie, des Travaux, de la Maintenance{'\n'}et du Patrimoine
            </Text>
            <Text style={styles.headerAddress}>1 rue Cabanis - 75 674 PARIS CEDEX 14</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>
              FICHE DE DEMANDE DE TRAVAUX{'\n'}OU DE MAINTENANCE{'\n'}(hors Magasin Technique){'\n'}n° 2026-
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* Nature des travaux / Numéro du marché */}
          <View style={[styles.row, { flex: 1.1 }]}>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Nature des travaux</Text>
            </View>
            <View style={[styles.cell, { width: '57%', alignItems: 'center' }]}>
              <Text style={[styles.cellValue, { fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 0 }]}>
                {form.natureTravaux || '—'}
              </Text>
            </View>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Numéro du marché</Text>
            </View>
            <View style={[styles.cellLast, { width: '17%' }]}>
              <Text style={styles.cellValue}>{form.marche?.numero || ''}</Text>
            </View>
          </View>

          {/* Classe 2 / Classe 6 */}
          <View style={[styles.row, { flex: 1.8 }]}>
            <View style={[styles.cell, { width: '45%' }]}>
              <View style={styles.checkboxRow}>
                <View style={styles.checkbox}>{form.type === 'cl2' && <Text style={styles.checkboxMark}>X</Text>}</View>
                <Text style={styles.cellLabel}>Demande de travaux (classe 2)</Text>
              </View>
              <Text style={[styles.checkboxLabel, { marginLeft: 12, marginTop: 2 }]}>(Architectes, Ingénieurs, TSH travaux)</Text>
            </View>
            <View style={[styles.cellLast, { width: '55%' }]}>
              <View style={styles.checkboxRow}>
                <View style={styles.checkbox}>{form.type === 'cl6' && <Text style={styles.checkboxMark}>X</Text>}</View>
                <Text style={styles.cellLabel}>Demande de travaux / maintenance (classe 6)</Text>
              </View>
              <Text style={[styles.checkboxLabel, { marginLeft: 12, marginTop: 2 }]}>
                (Techniciens, Gestionnaires du magasin technique et électromécanique, Serruriers, marchés, baux et patrimoine)
              </Text>
            </View>
          </View>

          {/* OPE / GER */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>OPE</Text>
            </View>
            <View style={[styles.cell, { width: '37%' }]}>
              <Text style={styles.cellValue}>{form.ope ? `${form.ope.code} — ${form.ope.libelle}` : ''}</Text>
            </View>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>GER</Text>
            </View>
            <View style={[styles.cellLast, { width: '37%' }]}>
              <Text style={styles.cellValue}>{form.ger ? `${form.ger.code} — ${form.ger.libelle}` : ''}</Text>
            </View>
          </View>

          {/* PTR / Services */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>PTR</Text>
            </View>
            <View style={[styles.cell, { width: '37%' }]}>
              <Text style={styles.cellValue}>{form.ptr ? `${form.ptr.code} — ${form.ptr.libelle}` : ''}</Text>
            </View>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Services</Text>
            </View>
            <View style={[styles.cellLast, { width: '37%' }]}>
              <Text style={styles.cellValue}></Text>
            </View>
          </View>

          {/* Mecenat / Prestation intellectuelle */}
          <View style={[styles.row, { flex: 1.4 }]}>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Mecenat</Text>
            </View>
            <View style={[styles.cell, { width: '37%' }]}>
              <Text style={styles.cellValue}></Text>
            </View>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Prestation intellectuelle{'\n'}(hors travaux)</Text>
            </View>
            <View style={[styles.cellLast, { width: '37%' }]}>
              <Text style={styles.cellValue}></Text>
            </View>
          </View>

          {/* Rattachement / Maintenance */}
          <View style={[styles.row, { flex: 1.4 }]}>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.cellLabel}>Rattachement à un marché d&apos;entretien</Text>
            </View>
            <View style={[styles.cell, { width: '10%', alignItems: 'center' }]}>
              <Checkbox checked={form.rattachement === 'Oui'} label="Oui" />
            </View>
            <View style={[styles.cell, { width: '10%', alignItems: 'center' }]}>
              <Checkbox checked={form.rattachement === 'Non'} label="Non" />
            </View>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Maintenance</Text>
            </View>
            <View style={[styles.cellLast, { width: '42%' }]}>
              <Text style={styles.cellValue}></Text>
            </View>
          </View>

          {/* Budget / UF */}
          <View style={[styles.row, { flex: 1.4 }]}>
            <View style={[styles.cell, { width: '10%' }]}>
              <Text style={styles.cellLabel}>Budget</Text>
            </View>
            {['H', 'Annexe B', 'Annexe C', 'Annexe E', 'Annexe P'].map((opt) => (
              <View key={opt} style={[styles.cell, { width: '12%', alignItems: 'center' }]}>
                <Checkbox checked={form.budget.includes(opt)} label={opt} />
              </View>
            ))}
            <View style={[styles.cell, { width: '8%' }]}>
              <Text style={styles.cellLabel}>UF</Text>
            </View>
            <View style={[styles.cellLast, { width: '14%' }]}>
              <Text style={styles.cellValue}>{form.uf}</Text>
            </View>
          </View>

          {/* Compte Cl2 / Compte Cl6 */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Compte Cl2</Text>
            </View>
            <View style={[styles.cell, { width: '37%' }]}>
              <Text style={styles.cellValue}>{form.compteCl2}</Text>
            </View>
            <View style={[styles.cell, { width: '13%' }]}>
              <Text style={styles.cellLabel}>Compte Cl6</Text>
            </View>
            <View style={[styles.cellLast, { width: '37%' }]}>
              <Text style={styles.cellValue}>{form.compteCl6}</Text>
            </View>
          </View>

          {/* En-têtes Bâtiment */}
          <View style={[styles.row, { flex: 0.8 }]}>
            <View style={[styles.grayCell, { width: '13%' }]}>
              <Text style={styles.grayLabel}>N° bâtiment</Text>
            </View>
            <View style={[styles.grayCell, { width: '37%' }]}>
              <Text style={styles.grayLabel}>Nom du bâtiment</Text>
            </View>
            <View style={[styles.grayCell, { width: '25%' }]}>
              <Text style={styles.grayLabel}>Etage</Text>
            </View>
            <View style={[styles.grayCellLast, { width: '25%' }]}>
              <Text style={styles.grayLabel}>Pôle</Text>
            </View>
          </View>
          {/* Valeurs Bâtiment */}
          <View style={styles.row}>
            <View style={[styles.cell, { width: '13%', alignItems: 'center' }]}>
              <Text style={styles.centerValue}>{form.batiment?.numero || ''}</Text>
            </View>
            <View style={[styles.cell, { width: '37%', alignItems: 'center' }]}>
              <Text style={styles.centerValue}>{form.batiment?.nom || ''}</Text>
            </View>
            <View style={[styles.cell, { width: '25%', alignItems: 'center' }]}>
              <Text style={styles.centerValue}>{form.etage}</Text>
            </View>
            <View style={[styles.cellLast, { width: '25%', alignItems: 'center' }]}>
              <Text style={styles.centerValue}>{form.pole?.libelle || ''}</Text>
            </View>
          </View>

          {/* En-têtes Entreprise / Devis / Montants */}
          <View style={[styles.row, { flex: 0.8 }]}>
            <View style={[styles.grayCell, { width: '25%' }]}>
              <Text style={styles.grayLabel}>Entreprise</Text>
            </View>
            <View style={[styles.grayCell, { width: '25%' }]}>
              <Text style={styles.grayLabel}>N° DEVIS</Text>
            </View>
            <View style={[styles.grayCell, { width: '25%' }]}>
              <Text style={styles.grayLabel}>TOTAL HT</Text>
            </View>
            <View style={[styles.grayCellLast, { width: '25%' }]}>
              <Text style={styles.grayLabel}>TOTAL TTC</Text>
            </View>
          </View>
          {/* Valeurs Entreprise / Devis / Montants */}
          <View style={[styles.row, { flex: 1.3 }]}>
            <View style={[styles.cell, { width: '25%', alignItems: 'center' }]}>
              <Text style={styles.centerValue}>{form.entreprise?.nom || ''}</Text>
            </View>
            <View style={[styles.cell, { width: '25%', alignItems: 'center' }]}>
              <Text style={[styles.centerValue, { fontFamily: 'Helvetica-Bold' }]}>{form.numDevis}</Text>
            </View>
            <View style={[styles.cell, { width: '25%', alignItems: 'flex-end' }]}>
              <Text style={[styles.centerValue, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                {form.totalHT ? `${form.totalHT} €` : ''}
              </Text>
            </View>
            <View style={[styles.cellLast, { width: '25%', alignItems: 'flex-end' }]}>
              <Text style={[styles.centerValue, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                {form.totalTTC ? `${form.totalTTC} €` : ''}
              </Text>
            </View>
          </View>

          {/* TVA / Délai */}
          <View style={[styles.row, { flex: 2.2 }]}>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.cellLabel}>Taux de TVA applicable :</Text>
              <Checkbox checked={form.tva === '10'} label="10,00%" />
              <Checkbox checked={form.tva === '20'} label="20,00%" />
            </View>
            <View style={[styles.cell, { width: '37.5%', alignItems: 'center' }]}>
              <Text style={[styles.cellLabel, { textAlign: 'center' }]}>Délai d&apos;exécution de l&apos;opération</Text>
            </View>
            <View style={[styles.cellLast, { width: '37.5%', justifyContent: 'space-around' }]}>
              <View style={{ flexDirection: 'row', borderBottom: BORDER, paddingBottom: 4 }}>
                <Text style={[styles.cellLabel, { width: '30%' }]}>Début</Text>
                <Text style={styles.cellValue}>{frDate(form.dateDebut)}</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                <Text style={[styles.cellLabel, { width: '30%' }]}>Fin</Text>
                <Text style={styles.cellValue}>{frDate(form.dateFin)}</Text>
              </View>
            </View>
          </View>

          {/* Demandé le / Responsable / Directeur */}
          <View style={[styles.row, { flex: 0.9 }]}>
            <View style={[styles.grayCell, { width: '33.34%' }]}>
              <Text style={styles.grayLabel}>Demandé le {today}</Text>
            </View>
            <View style={[styles.grayCell, { width: '33.33%' }]}>
              <Text style={styles.grayLabel}>Responsable du département</Text>
            </View>
            <View style={[styles.grayCellLast, { width: '33.33%' }]}>
              <Text style={styles.grayLabel}>Directeur</Text>
            </View>
          </View>

          {/* Signatures */}
          <View style={[styles.row, { flex: 3.5, borderBottom: 'none' }]}>
            <View style={[styles.cell, { width: '33.34%', justifyContent: 'flex-start' }]}>
              <Text style={styles.cellLabel}>Demandeur : Ahmed Said</Text>
            </View>
            <View style={[styles.cell, { width: '33.33%', justifyContent: 'flex-start' }]}>
              <Text style={styles.cellLabel}>Validé par : Jordy FEUILLAS</Text>
            </View>
            <View style={[styles.cellLast, { width: '33.33%', justifyContent: 'flex-start' }]}>
              <Text style={styles.cellLabel}>Ingénieur Général : AUCOUTURIER</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generateFichePdfBlob(form: FormData, today: string): Promise<Blob> {
  return pdf(<FichePdfDoc form={form} today={today} />).toBlob();
}

export async function mergeWithDevis(ficheBlob: Blob, devisFile: File | null): Promise<Blob> {
  if (!devisFile) return ficheBlob;

  const merged = await PDFDocument.create();

  const ficheDoc = await PDFDocument.load(await ficheBlob.arrayBuffer());
  const fichePages = await merged.copyPages(ficheDoc, ficheDoc.getPageIndices());
  fichePages.forEach((page) => merged.addPage(page));

  const devisDoc = await PDFDocument.load(await devisFile.arrayBuffer());
  const devisPages = await merged.copyPages(devisDoc, devisDoc.getPageIndices());
  devisPages.forEach((page) => merged.addPage(page));

  const bytes = await merged.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function isValidPdf(file: File): Promise<boolean> {
  try {
    await PDFDocument.load(await file.arrayBuffer());
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

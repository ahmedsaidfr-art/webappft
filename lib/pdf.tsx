import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { FormData } from './types';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a2233',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '2pt solid #1a2233',
    paddingBottom: 10,
    marginBottom: 14,
  },
  titleBlock: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: '#5b6577',
  },
  badge: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2233',
    border: '1pt solid #1a2233',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: '0.5pt solid #c7ccd6',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '50%',
    marginBottom: 6,
    paddingRight: 8,
  },
  cellFull: {
    width: '100%',
    marginBottom: 6,
  },
  label: {
    fontSize: 8,
    color: '#5b6577',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f3f8',
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
  },
  amountBlock: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 8,
    color: '#5b6577',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    fontSize: 8,
    color: '#9aa2b1',
    borderTop: '0.5pt solid #c7ccd6',
    paddingTop: 6,
    textAlign: 'center',
  },
});

function FieldCell({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <View style={full ? styles.cellFull : styles.cell}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );
}

interface FichePdfDocProps {
  form: FormData;
  today: string;
}

export function FichePdfDoc({ form, today }: FichePdfDocProps) {
  const typeLabel = form.type === 'cl2' ? 'Classe 2 — Architectes / Ingénieurs' : 'Classe 6 — Techniciens / Marchés';

  return (
    <Document title="Fiche de Demande de Travaux">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Fiche de Demande de Travaux</Text>
            <Text style={styles.subtitle}>GHU Paris Psychiatrie &amp; Neurosciences — DITMP</Text>
            <Text style={styles.subtitle}>N° 2026-XXX (à compléter manuellement) · {today}</Text>
          </View>
          <Text style={styles.badge}>{typeLabel}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations fixes</Text>
          <View style={styles.grid}>
            <FieldCell label="Demandeur" value="Ahmed Said" />
            <FieldCell label="Validé par" value="Jordy FEUILLAS" />
            <FieldCell label="IG" value="AUCOUTURIER" />
            <FieldCell label="Demandé le" value={today} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nature des travaux</Text>
          <View style={styles.grid}>
            <FieldCell label="Description" value={form.natureTravaux} full />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marché &amp; Entreprise</Text>
          <View style={styles.grid}>
            <FieldCell label="Marché" value={form.marche ? `${form.marche.numero} — ${form.marche.objet}` : ''} />
            <FieldCell label="Entreprise" value={form.entreprise ? `${form.entreprise.nom} (${form.entreprise.specialite})` : ''} />
            <FieldCell label="Rattachement marché d'entretien" value={form.rattachement} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          <View style={styles.grid}>
            <FieldCell label="Bâtiment" value={form.batiment ? `N° ${form.batiment.numero} — ${form.batiment.nom}` : ''} />
            <FieldCell label="Étage" value={form.etage} />
            <FieldCell label="Pôle" value={form.pole ? `${form.pole.code} — ${form.pole.libelle}` : ''} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Devis &amp; Montants</Text>
          <View style={styles.grid}>
            <FieldCell label="N° Devis" value={form.numDevis} />
            <FieldCell label="TVA" value={`${form.tva}%`} />
            <FieldCell label="Date début" value={form.dateDebut} />
            <FieldCell label="Date fin" value={form.dateFin} />
          </View>
          <View style={styles.amountsRow}>
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>Total HT</Text>
              <Text style={styles.amountValue}>{form.totalHT || '—'} €</Text>
            </View>
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>TVA ({form.tva}%)</Text>
              <Text style={styles.amountValue}>
                {form.totalHT && form.totalTTC
                  ? (parseFloat(form.totalTTC.replace(/\s/g, '').replace(',', '.')) - parseFloat(form.totalHT.replace(/\s/g, '').replace(',', '.'))).toFixed(2).replace('.', ',')
                  : '—'}{' '}
                €
              </Text>
            </View>
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>Total TTC</Text>
              <Text style={styles.amountValue}>{form.totalTTC || '—'} €</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identifiants OPE / GER / PTR</Text>
          <View style={styles.grid}>
            <FieldCell label="OPE" value={form.ope ? `${form.ope.code} — ${form.ope.libelle}` : ''} />
            <FieldCell label="GER" value={form.ger ? `${form.ger.code} — ${form.ger.libelle}` : ''} />
            <FieldCell label="PTR" value={form.ptr ? `${form.ptr.code} — ${form.ptr.libelle}` : ''} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget &amp; Comptes</Text>
          <View style={styles.grid}>
            <FieldCell label="Budget" value={form.budget.length > 0 ? form.budget.join(', ') : ''} />
            <FieldCell label="UF" value={form.uf} />
            <FieldCell label="Compte Cl2" value={form.compteCl2} />
            <FieldCell label="Compte Cl6" value={form.compteCl6} />
          </View>
        </View>

        <Text style={styles.footer}>
          Document généré automatiquement — GHU Paris Psychiatrie &amp; Neurosciences · DITMP · {today}
        </Text>
      </Page>
    </Document>
  );
}

export async function generateFichePdfBlob(form: FormData, today: string): Promise<Blob> {
  return pdf(<FichePdfDoc form={form} today={today} />).toBlob();
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

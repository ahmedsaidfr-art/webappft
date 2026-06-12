import { parseAmount } from '@/lib/format';

interface AmountCardProps {
  ht: string;
  ttc: string;
}

export function AmountCard({ ht, ttc }: AmountCardProps) {
  const htN = parseAmount(ht);
  const ttcN = parseAmount(ttc);
  const tva = !isNaN(htN) && !isNaN(ttcN) ? (ttcN - htN).toFixed(2).replace('.', ',') : '—';

  return (
    <div className="amount-card">
      <div className="cell">
        <div className="k">Total HT</div>
        <div className="v">{ht || '—'} €</div>
      </div>
      <div className="cell">
        <div className="k">TVA</div>
        <div className="v">{tva} €</div>
      </div>
      <div className="cell accent">
        <div className="k">Total TTC</div>
        <div className="v">{ttc || '—'} €</div>
      </div>
    </div>
  );
}

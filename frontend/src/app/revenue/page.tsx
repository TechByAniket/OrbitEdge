import { PageHeader, KpiCard, SectionCard, Badge, fmtINR } from '@/components/ui';
import { DollarSign, TrendingUp, BarChart3, Zap } from 'lucide-react';

const REVENUE_TREND = [
  { month: 'Jul', you: 1240000, market_avg: 1100000 },
  { month: 'Aug', you: 1580000, market_avg: 1350000 },
  { month: 'Sep', you: 1420000, market_avg: 1280000 },
  { month: 'Oct (partial)', you: 630000, market_avg: 570000 },
];

export default function RevenuePage() {
  return (
    <div>
      <PageHeader
        title="Revenue Intelligence"
        subtitle="Estimated revenue, RevPAR, and revenue opportunity signals"
        breadcrumb={['OrbitEdge', 'Revenue']}
      />

      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Est. Revenue Today" value={fmtINR(31500)} change={12.4} subtext="vs yesterday" icon={<DollarSign size={16} />} highlight />
        <KpiCard label="Est. Revenue This Month" value="₹6.3L" change={8.4} subtext="vs last month" icon={<TrendingUp size={16} />} />
        <KpiCard label="Est. RevPAR" value={fmtINR(3640)} change={5.1} subtext="Revenue per available room" icon={<BarChart3 size={16} />} />
        <KpiCard label="Revenue Opportunity" value={fmtINR(8400)} subtext="Estimated uplift if 90% occ." icon={<Zap size={16} />} />
      </div>

      <div className="px-8 grid grid-cols-2 gap-4 mb-8">
        <SectionCard title="Monthly Revenue Trend" subtitle="Estimated revenue vs market average">
          <div className="space-y-4 mt-2">
            {REVENUE_TREND.map(r => (
              <div key={r.month}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{r.month}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{fmtINR(r.you)}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(r.you / 1600000) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Revenue Opportunity Analysis" subtitle="Scenarios to maximize revenue">
          <div className="space-y-3 mt-2">
            {[
              { label: 'Raise rate by ₹500 on weekends', uplift: 18400, risk: 'Low' },
              { label: 'Optimize for early check-in upsell', uplift: 7200, risk: 'Low' },
              { label: 'Add breakfast package at ₹800', uplift: 12600, risk: 'Medium' },
              { label: 'Compete more aggressively Mon–Thu', uplift: 9800, risk: 'Medium' },
            ].map((opp, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{opp.label}</div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Badge variant={opp.risk === 'Low' ? 'positive' : 'warning'}>{opp.risk} Risk</Badge>
                  <span className="text-sm font-semibold" style={{ color: 'var(--positive)' }}>+{fmtINR(opp.uplift)}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

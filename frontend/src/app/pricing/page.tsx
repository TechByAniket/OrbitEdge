import { PageHeader, SectionCard, KpiCard, Badge, EmptyState, fmtINR } from '@/components/ui';
import { PriceTrendChart, AvailabilityTrendChart } from '@/components/charts';
import { TrendingUp, BarChart3, CalendarCheck, AlertCircle } from 'lucide-react';

const PRICE_DATA = [
  { date: 'Oct 1', primary: 4200, market_avg: 3900, market_min: 2900, market_max: 9200 },
  { date: 'Oct 3', primary: 4400, market_avg: 4100, market_min: 3100, market_max: 9800 },
  { date: 'Oct 5', primary: 4100, market_avg: 3850, market_min: 2900, market_max: 9000 },
  { date: 'Oct 7', primary: 4600, market_avg: 4200, market_min: 3200, market_max: 10200 },
  { date: 'Oct 9', primary: 4300, market_avg: 4050, market_min: 3000, market_max: 9500 },
  { date: 'Oct 11', primary: 4800, market_avg: 4300, market_min: 3300, market_max: 10500 },
  { date: 'Oct 13', primary: 4500, market_avg: 4150, market_min: 2900, market_max: 9200 },
];

const AVAIL_DATA = [
  { date: 'Oct 7', available: 48, sold_out: 5 },
  { date: 'Oct 8', available: 46, sold_out: 7 },
  { date: 'Oct 9', available: 44, sold_out: 9 },
  { date: 'Oct 10', available: 47, sold_out: 6 },
  { date: 'Oct 11', available: 43, sold_out: 10 },
  { date: 'Oct 12', available: 50, sold_out: 3 },
  { date: 'Oct 13', available: 47, sold_out: 6 },
];

const PRICE_BUCKETS = [
  { range: '< ₹3,000', count: 4, pct: 8 },
  { range: '₹3,000 – ₹4,000', count: 12, pct: 22 },
  { range: '₹4,000 – ₹5,000', count: 18, pct: 33 },
  { range: '₹5,000 – ₹7,000', count: 11, pct: 20 },
  { range: '₹7,000 – ₹10,000', count: 6, pct: 11 },
  { range: '> ₹10,000', count: 3, pct: 6 },
];

export default function PricingPage() {
  return (
    <div>
      <PageHeader
        title="Pricing Intelligence"
        subtitle="Price positioning, distribution, and trend analysis"
        breadcrumb={['OrbitEdge', 'Pricing']}
      />

      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Your Rate" value={fmtINR(4500)} change={5.2} subtext="vs last week" icon={<TrendingUp size={16} />} highlight />
        <KpiCard label="Market Avg" value={fmtINR(4150)} change={-2.1} subtext="54 properties" icon={<BarChart3 size={16} />} />
        <KpiCard label="Market Min" value={fmtINR(2900)} subtext="Budget tier" />
        <KpiCard label="Market Max" value={fmtINR(18000)} subtext="Luxury tier" />
      </div>

      <div className="px-8 grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <SectionCard title="Price Trend" subtitle="Your rate vs market average over time"
            actions={<Badge variant="positive">+8.4% vs market</Badge>}>
            <PriceTrendChart data={PRICE_DATA} />
          </SectionCard>
        </div>
        <SectionCard title="Price Distribution" subtitle="Market segment breakdown today">
          <div className="space-y-3 mt-2">
            {PRICE_BUCKETS.map(b => (
              <div key={b.range}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{b.range}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{b.count} props</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${b.pct}%`,
                      background: b.range.includes('4,000 – ₹5,000') ? 'var(--brand)' : 'var(--bg-elevated)',
                      border: b.range.includes('4,000 – ₹5,000') ? undefined : '1px solid var(--border)'
                    }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--brand-glow)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--brand)' }}>
            ★ Elite Hotel is in the <strong>₹4,000 – ₹5,000</strong> segment (33% of market)
          </div>
        </SectionCard>
      </div>

      <div className="px-8 grid grid-cols-2 gap-4 mb-8">
        <SectionCard title="Availability Pressure" subtitle="Properties sold out vs available per day">
          <AvailabilityTrendChart data={AVAIL_DATA} />
        </SectionCard>
        <SectionCard title="Pricing Alerts" subtitle="Rate changes requiring attention">
          {[
            { msg: "Summit Hotel increased price by ₹800 (+18.2%)", time: "2h ago", sev: "warning" },
            { msg: "6 properties are sold out for this weekend", time: "3h ago", sev: "negative" },
            { msg: "Your rate is 8.4% above market average", time: "6h ago", sev: "brand" },
          ].map((alert, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b last:border-0"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0"
                style={{ color: alert.sev === 'negative' ? 'var(--negative)' : alert.sev === 'warning' ? 'var(--warning)' : 'var(--brand)' }} />
              <div className="flex-1">
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{alert.msg}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{alert.time}</div>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

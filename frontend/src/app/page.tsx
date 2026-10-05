import {
  LayoutDashboard, TrendingUp, TrendingDown, Building2,
  Activity, DollarSign, AlertTriangle, BarChart3,
  CalendarCheck, Hotel, Satellite, Clock
} from 'lucide-react';
import { PageHeader, KpiCard, SectionCard, Badge, EmptyState, fmtINR, fmtRating, fmtCount } from '@/components/ui';
import { PriceTrendChart, CompetitorPriceChart, DemandChart } from '@/components/charts';

// Demo data — replaced with real API data once observations are collected
const DEMO_PRICE_TREND = [
  { date: 'Oct 1', primary: 4200, market_avg: 3900 },
  { date: 'Oct 3', primary: 4400, market_avg: 4100 },
  { date: 'Oct 5', primary: 4100, market_avg: 3850 },
  { date: 'Oct 7', primary: 4600, market_avg: 4200 },
  { date: 'Oct 9', primary: 4300, market_avg: 4050 },
  { date: 'Oct 11', primary: 4800, market_avg: 4300 },
  { date: 'Oct 13', primary: 4500, market_avg: 4150 },
];

const DEMO_COMPETITORS = [
  { name: 'Fern Hill', price: 3800 },
  { name: 'Dukes Retreat', price: 6500 },
  { name: 'Elite Hotel', price: 4500, is_primary: true },
  { name: 'Kundan Villa', price: 3200 },
  { name: 'Rhythm Lonavala', price: 4100 },
  { name: 'Summit', price: 5200 },
  { name: 'Citrus', price: 3700 },
  { name: 'Kolhapuri Heritage', price: 2900 },
];

const DEMO_DEMAND = [
  { date: 'Oct 1', demand: 55 },
  { date: 'Oct 3', demand: 62 },
  { date: 'Oct 5', demand: 48 },
  { date: 'Oct 7', demand: 75 },
  { date: 'Oct 9', demand: 68 },
  { date: 'Oct 11', demand: 82 },
  { date: 'Oct 13', demand: 71 },
];

const RECENT_MOVEMENTS = [
  { property: 'Dukes Retreat', change: '+₹800', direction: 'up', time: '2h ago' },
  { property: 'Fern Hill', change: '−₹400', direction: 'down', time: '4h ago' },
  { property: 'Summit Hotel', change: 'Sold out', direction: 'sold', time: '6h ago' },
  { property: 'Kundan Villa', change: '+₹200', direction: 'up', time: '8h ago' },
];

export default function OverviewPage() {
  return (
    <div>
      <PageHeader
        title="Market Overview"
        subtitle="Lonavala / Khandala competitive intelligence · Elite Hotel"
        breadcrumb={['OrbitEdge', 'Overview']}
        actions={
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
            <Clock size={12} />
            Last run: Today, 07:42 AM
          </div>
        }
      />

      {/* KPI Row */}
      <div className="px-8 grid grid-cols-5 gap-4 mb-6">
        <KpiCard
          label="Your Rate Tonight"
          value={fmtINR(4500)}
          change={5.2}
          subtext="vs last week"
          icon={<Hotel size={16} />}
          highlight
        />
        <KpiCard
          label="Market Avg Price"
          value={fmtINR(4150)}
          change={-2.1}
          subtext="54 properties"
          icon={<BarChart3 size={16} />}
        />
        <KpiCard
          label="Your Demand Score"
          value="71 / 100"
          change={8.4}
          subtext="High demand"
          icon={<Activity size={16} />}
        />
        <KpiCard
          label="Competitors Sold Out"
          value="6"
          subtext="of 53 tracked"
          icon={<AlertTriangle size={16} />}
        />
        <KpiCard
          label="Est. Revenue Today"
          value={fmtINR(31500)}
          change={12.4}
          subtext="vs yesterday"
          icon={<DollarSign size={16} />}
        />
      </div>

      {/* Charts Row */}
      <div className="px-8 grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <SectionCard
            title="Price Trend — Elite Hotel vs Market Avg"
            subtitle="Last 14 days · Weekday 1-night · 2 guests"
            actions={
              <Badge variant="brand">Live</Badge>
            }
          >
            <PriceTrendChart data={DEMO_PRICE_TREND} />
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Market Demand Signal" subtitle="Availability pressure score 0–100">
            <DemandChart data={DEMO_DEMAND} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[{ label: 'Current', value: '71', color: 'var(--demand-high)' },
                { label: '7d Avg', value: '66', color: 'var(--text-secondary)' },
                { label: 'Peak', value: '82', color: 'var(--positive)' }]
                .map(s => (
                  <div key={s.label}>
                    <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="px-8 grid grid-cols-3 gap-4 mb-8">
        {/* Competitor Price Comparison */}
        <div className="col-span-2">
          <SectionCard title="Competitor Price Comparison" subtitle="Current rates for top competitors">
            <CompetitorPriceChart data={DEMO_COMPETITORS} />
          </SectionCard>
        </div>

        {/* Recent Market Movements */}
        <SectionCard title="Recent Market Movements" subtitle="Last 24 hours">
          {RECENT_MOVEMENTS.length === 0 ? (
            <EmptyState
              icon={<Activity size={20} />}
              title="No movements detected"
              description="Run a tracking cycle to see market changes."
            />
          ) : (
            <div className="space-y-3">
              {RECENT_MOVEMENTS.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.property}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.time}</div>
                  </div>
                  <Badge variant={m.direction === 'up' ? 'negative' : m.direction === 'sold' ? 'sold-out' : 'positive'}>
                    {m.change}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Competitor Ranking Table */}
      <div className="px-8 mb-8">
        <SectionCard title="Competitor Ranking" subtitle="Sorted by price (ascending)" noPad>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['#', 'Property', 'Type', 'Price', 'Rating', 'Availability', 'vs Market'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, name: 'Kolhapuri Heritage Inn', type: 'Budget', price: 2900, rating: 3.8, avail: 'Available', isPrimary: false },
                  { rank: 2, name: 'Kundan Villa', type: 'Villa', price: 3200, rating: 4.1, avail: 'Available', isPrimary: false },
                  { rank: 3, name: 'Citrus Hotel', type: 'Hotel', price: 3700, rating: 4.0, avail: 'Available', isPrimary: false },
                  { rank: 4, name: 'Fern Hill Resort', type: 'Resort', price: 3800, rating: 4.2, avail: 'Low', isPrimary: false },
                  { rank: 5, name: 'Rhythm Lonavala', type: 'Hotel', price: 4100, rating: 4.3, avail: 'Available', isPrimary: false },
                  { rank: 6, name: 'ELITE HOTEL ★', type: 'Hotel', price: 4500, rating: 4.4, avail: 'Available', isPrimary: true },
                  { rank: 7, name: 'Summit Hotel', type: 'Hotel', price: 5200, rating: 4.5, avail: 'Sold Out', isPrimary: false },
                  { rank: 8, name: "Duke's Retreat", type: 'Resort', price: 6500, rating: 4.7, avail: 'Low', isPrimary: false },
                ].map((row) => {
                  const vsMarket = ((row.price - 4150) / 4150 * 100).toFixed(1);
                  const isAbove = row.price > 4150;
                  return (
                    <tr key={row.rank}
                      className="border-b transition-colors hover:bg-white/[0.02]"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        background: row.isPrimary ? 'rgba(59,130,246,0.05)' : undefined
                      }}>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{row.rank}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.isPrimary && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                          <span className={`text-sm font-medium`}
                            style={{ color: row.isPrimary ? 'var(--brand)' : 'var(--text-primary)' }}>
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="neutral">{row.type}</Badge></td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{fmtINR(row.price)}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{fmtRating(row.rating)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={row.avail === 'Sold Out' ? 'sold-out' : row.avail === 'Low' ? 'warning' : 'positive'}>
                          {row.avail}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium" style={{ color: isAbove ? 'var(--negative)' : 'var(--positive)' }}>
                          {isAbove ? '+' : ''}{vsMarket}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

import {
  LayoutDashboard, TrendingUp, TrendingDown, Building2,
  Activity, DollarSign, AlertTriangle, BarChart3,
  CalendarCheck, Hotel, Satellite, Clock
} from 'lucide-react';
import { PageHeader, KpiCard, SectionCard, Badge, EmptyState, fmtINR, fmtRating, fmtCount } from '@/components/ui';
import { PriceTrendChart, CompetitorPriceChart, DemandChart } from '@/components/charts';
import { api } from '@/lib/api';

// Demo data for charts until history builds up in DB
const DEMO_PRICE_TREND = [
  { date: 'Oct 1', primary: 4200, market_avg: 3900 },
  { date: 'Oct 3', primary: 4400, market_avg: 4100 },
  { date: 'Oct 5', primary: 4100, market_avg: 3850 },
  { date: 'Oct 7', primary: 4600, market_avg: 4200 },
  { date: 'Oct 9', primary: 4300, market_avg: 4050 },
  { date: 'Oct 11', primary: 4800, market_avg: 4300 },
  { date: 'Oct 13', primary: 4500, market_avg: 4150 },
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

export default async function OverviewPage() {
  const summary = await api.getDashboardSummary().catch(() => null);
  const competitorsData = await api.getCompetitorsRanking().catch(() => []);
  
  const market = summary?.market || {};
  const primaryInfo = summary?.primary?.info || {};
  const primaryMetrics = summary?.primary?.metrics || {};
  const recentMovements = summary?.recent_movements || [];
  
  const primaryPrice = primaryInfo?.price?.[0]?.price || 0;
  const marketAvg = market?.avg_market_price || 0;
  
  // Prepare Competitor chart data (top 8 by price)
  const sortedComps = [...competitorsData].sort((a, b) => (a.price || 0) - (b.price || 0)).slice(0, 8);
  const compChartData = sortedComps.map(c => ({
    name: c.name.split(' ')[0],
    price: c.price || 0,
    is_primary: c.is_primary
  }));

  return (
    <div>
      <PageHeader
        title="Market Overview"
        subtitle={`Lonavala / Khandala competitive intelligence · ${primaryInfo?.property_name || 'Primary Hotel'}`}
        breadcrumb={['OrbitEdge', 'Overview']}
        actions={
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
            <Clock size={12} />
            Last run: {market.calculated_at ? new Date(market.calculated_at).toLocaleString() : 'N/A'}
          </div>
        }
      />

      {/* KPI Row */}
      <div className="px-8 grid grid-cols-5 gap-4 mb-6">
        <KpiCard
          label="Your Rate Tonight"
          value={fmtINR(primaryPrice)}
          change={0}
          subtext="vs last week"
          icon={<Hotel size={16} />}
          highlight
        />
        <KpiCard
          label="Market Avg Price"
          value={fmtINR(marketAvg)}
          change={0}
          subtext={`${summary?.total_properties_tracked || 54} properties`}
          icon={<BarChart3 size={16} />}
        />
        <KpiCard
          label="Your Demand Score"
          value={`${market?.market_demand_score?.toFixed(0) || 0} / 100`}
          change={0}
          subtext="Market demand"
          icon={<Activity size={16} />}
        />
        <KpiCard
          label="Competitors Sold Out"
          value={market?.sold_out_competitor_count?.toString() || '0'}
          subtext="of tracked"
          icon={<AlertTriangle size={16} />}
        />
        <KpiCard
          label="Est. Revenue 7 Days"
          value={fmtINR(primaryMetrics?.estimated_gross_booking_value || 0)}
          change={0}
          subtext="Est GBV"
          icon={<DollarSign size={16} />}
        />
      </div>

      {/* Charts Row */}
      <div className="px-8 grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <SectionCard
            title={`Price Trend — ${primaryInfo?.property_name || 'Elite Hotel'} vs Market Avg`}
            subtitle="Last 14 days · Weekday 1-night · 2 guests"
            actions={
              <Badge variant="brand">Demo Data</Badge>
            }
          >
            <PriceTrendChart data={DEMO_PRICE_TREND} />
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Market Demand Signal" subtitle="Availability pressure score 0–100">
            <DemandChart data={DEMO_DEMAND} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[{ label: 'Current', value: market?.market_demand_score?.toFixed(0) || '0', color: 'var(--demand-high)' },
                { label: '7d Avg', value: '-', color: 'var(--text-secondary)' },
                { label: 'Peak', value: '-', color: 'var(--positive)' }]
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
            {compChartData.length > 0 ? (
                <CompetitorPriceChart data={compChartData} />
            ) : (
                <div className="h-64 flex items-center justify-center text-sm text-gray-500">No data available</div>
            )}
          </SectionCard>
        </div>

        {/* Recent Market Movements */}
        <SectionCard title="Recent Market Movements" subtitle="Last 24 hours">
          {recentMovements.length === 0 ? (
            <EmptyState
              icon={<Activity size={20} />}
              title="No movements detected"
              description="Run a tracking cycle to see market changes."
            />
          ) : (
            <div className="space-y-3">
              {recentMovements.map((m: any, i: number) => {
                const isUp = m.absolute_change > 0;
                const isSold = m.event_type === 'SOLD_OUT';
                return (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0"
                    style={{ borderColor: 'var(--border-subtle)' }}>
                    <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.properties?.property_name || 'Property'}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(m.detected_at).toLocaleString()}</div>
                    </div>
                    <Badge variant={isUp ? 'negative' : isSold ? 'sold-out' : 'positive'}>
                        {isSold ? 'Sold out' : `${isUp ? '+' : ''}${fmtINR(m.absolute_change)}`}
                    </Badge>
                    </div>
                );
              })}
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
                {sortedComps.map((row, idx) => {
                  const vsMarket = marketAvg ? ((row.price - marketAvg) / marketAvg * 100).toFixed(1) : '0.0';
                  const isAbove = row.price > marketAvg;
                  return (
                    <tr key={row.id}
                      className="border-b transition-colors hover:bg-white/[0.02]"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        background: row.is_primary ? 'rgba(59,130,246,0.05)' : undefined
                      }}>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.is_primary && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                          <span className={`text-sm font-medium`}
                            style={{ color: row.is_primary ? 'var(--brand)' : 'var(--text-primary)' }}>
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="neutral">{row.type}</Badge></td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{fmtINR(row.price || 0)}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{fmtRating(row.rating || 0)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={row.availability === 'Sold Out' ? 'sold-out' : row.availability === 'Low' ? 'warning' : 'positive'}>
                          {row.availability || 'Unknown'}
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

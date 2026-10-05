import { PageHeader, KpiCard, SectionCard, Badge, fmtINR, fmtRating } from '@/components/ui';
import { Building2, MapPin, Star, Globe, CalendarCheck, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api';

export default async function PropertiesPage() {
  const summary = await api.getDashboardSummary().catch(() => null);
  const properties = await api.getProperties().catch(() => []);

  const primaryInfo = summary?.primary?.info || {};
  const primaryMetrics = summary?.primary?.metrics || {};
  const market = summary?.market || {};

  // Extract primary properties from summary and latest observation data
  const primaryName = primaryInfo?.property_name || 'Primary Property';
  const primaryLocation = primaryInfo?.market_area || 'Lonavala';
  const primaryType = primaryInfo?.property_type || 'Hotel';
  const primaryUrl = primaryInfo?.mmt_url || '#';
  const primaryRating = primaryInfo?.rating || 0;
  const primaryReviews = primaryInfo?.review_count || 0;
  const primaryPrice = primaryInfo?.price?.[0]?.price || 0;

  // Extract KPIs
  const demandScore = market?.market_demand_score || 0;
  const estRevenue = primaryMetrics?.estimated_gross_booking_value || 0;

  // Calculate competitor breakdown
  const trackedCompetitors = properties.filter(p => p.tracking_enabled && !p.is_primary);
  const totalCompetitors = trackedCompetitors.length;
  const hotelCount = trackedCompetitors.filter(p => (p.property_type || '').toLowerCase().includes('hotel')).length;
  const resortVillaCount = trackedCompetitors.filter(p => 
    (p.property_type || '').toLowerCase().includes('resort') || 
    (p.property_type || '').toLowerCase().includes('villa')
  ).length;
  const otherCount = totalCompetitors - hotelCount - resortVillaCount;

  return (
    <div>
      <PageHeader
        title="Properties"
        subtitle="Primary property and tracked competitors"
        breadcrumb={['OrbitEdge', 'Properties']}
      />

      {/* Primary Property Spotlight */}
      <div className="px-8 mb-6">
        <div className="rounded-xl border p-6"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.04))', borderColor: 'rgba(59,130,246,0.25)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>Primary Property</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{primaryName}</h2>
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1"><MapPin size={13} />{primaryLocation}</span>
                <span className="flex items-center gap-1"><Star size={13} />{primaryType}</span>
                <span className="flex items-center gap-1">{fmtRating(primaryRating)} ({primaryReviews.toLocaleString()} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="brand">Tracking Active</Badge>
              <a href={primaryUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-blue-400/50"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Globe size={12} /> View on MMT
              </a>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-4 pt-5 border-t" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
            <KpiCard label="Current Rate" value={fmtINR(primaryPrice)} change={0} size="sm" />
            <KpiCard label="Rating" value={fmtRating(primaryRating)} subtext={`${primaryReviews.toLocaleString()} reviews`} size="sm" />
            <KpiCard label="Demand Score" value={`${demandScore.toFixed(0)} / 100`} change={0} size="sm" />
            <KpiCard label="Est. Revenue 7 Days" value={fmtINR(estRevenue)} change={0} size="sm" />
          </div>
        </div>
      </div>

      {/* Competitor Summary */}
      <div className="px-8 mb-8">
        <SectionCard title="Tracked Competitors" subtitle={`${totalCompetitors} competitor properties across ${primaryLocation}`} noPad>
          <div className="px-6 py-4 border-b grid grid-cols-4 gap-6 text-center" style={{ borderColor: 'var(--border)' }}>
            {[
              { label: 'Total Tracked', value: totalCompetitors.toString() },
              { label: 'Hotels', value: hotelCount.toString() },
              { label: 'Resorts & Villas', value: resortVillaCount.toString() },
              { label: 'Other / Budget', value: otherCount.toString() },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="p-6">
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
              <BarChart3 size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Full competitor data is imported from <code className="text-xs px-1 rounded" style={{ background: 'var(--bg-overlay)', color: 'var(--brand)' }}>competitor_master.csv</code>.
                Navigate to <strong style={{ color: 'var(--text-primary)' }}>Competitors</strong> for the full sortable/filterable intelligence table.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

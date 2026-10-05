import { PageHeader, KpiCard, SectionCard, Badge, fmtINR, fmtRating } from '@/components/ui';
import { Building2, MapPin, Star, Globe, CalendarCheck, BarChart3 } from 'lucide-react';

const PRIMARY = {
  name: 'ELITE HOTEL',
  location: 'Lonavala, Maharashtra',
  type: 'Hotel',
  star_rating: 3,
  mmt_url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=201712071751191534',
  rating: 4.4,
  reviews: 1015,
  price: 4500,
};

export default function PropertiesPage() {
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
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{PRIMARY.name}</h2>
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1"><MapPin size={13} />{PRIMARY.location}</span>
                <span className="flex items-center gap-1"><Star size={13} />{PRIMARY.star_rating}-Star {PRIMARY.type}</span>
                <span className="flex items-center gap-1">{fmtRating(PRIMARY.rating)} ({PRIMARY.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="brand">Tracking Active</Badge>
              <a href={PRIMARY.mmt_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-blue-400/50"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Globe size={12} /> View on MMT
              </a>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-4 pt-5 border-t" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
            <KpiCard label="Current Rate" value={fmtINR(PRIMARY.price)} change={5.2} size="sm" />
            <KpiCard label="Rating" value={fmtRating(PRIMARY.rating)} subtext={`${PRIMARY.reviews.toLocaleString()} reviews`} size="sm" />
            <KpiCard label="Demand Score" value="71 / 100" change={8.4} size="sm" />
            <KpiCard label="Est. Revenue" value="₹31,500" change={12.4} subtext="Today" size="sm" />
          </div>
        </div>
      </div>

      {/* Competitor Summary */}
      <div className="px-8 mb-8">
        <SectionCard title="Tracked Competitors" subtitle="53 competitor properties across Lonavala / Khandala" noPad>
          <div className="px-6 py-4 border-b grid grid-cols-4 gap-6 text-center" style={{ borderColor: 'var(--border)' }}>
            {[
              { label: 'Total Tracked', value: '53' },
              { label: 'Hotels', value: '24' },
              { label: 'Resorts & Villas', value: '18' },
              { label: 'Luxury / Budget', value: '11' },
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
                Navigate to <strong style={{ color: 'var(--text-primary)' }}>Competitors</strong> for the full sortable/filterable intelligence table, or visit individual property pages for deep-dive profiles.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

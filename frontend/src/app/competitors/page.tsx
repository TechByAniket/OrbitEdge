'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PageHeader, SectionCard, Badge, EmptyState, fmtINR, fmtRating, fmtCount } from '@/components/ui';
import clsx from 'clsx';

const ALL_COMPETITORS = [
  { id: 1, name: 'ELITE HOTEL', type: 'Hotel', location: 'Lonavala', price: 4500, rating: 4.4, reviews: 1015, availability: 'Available', demand: 71, change: 5.2, isPrimary: true },
  { id: 2, name: "Duke's Retreat", type: 'Resort', location: 'Khandala', price: 6500, rating: 4.7, reviews: 2340, availability: 'Low', demand: 88, change: 3.1, isPrimary: false },
  { id: 3, name: 'Summit Hotel', type: 'Hotel', location: 'Lonavala', price: 5200, rating: 4.5, reviews: 1876, availability: 'Sold Out', demand: 95, change: 12.4, isPrimary: false },
  { id: 4, name: 'Rhythm Lonavala', type: 'Hotel', location: 'Lonavala', price: 4100, rating: 4.3, reviews: 934, availability: 'Available', demand: 65, change: -2.1, isPrimary: false },
  { id: 5, name: 'Fern Hill Resort', type: 'Resort', location: 'Lonavala', price: 3800, rating: 4.2, reviews: 780, availability: 'Low', demand: 78, change: 1.5, isPrimary: false },
  { id: 6, name: 'Citrus Hotel', type: 'Hotel', location: 'Lonavala', price: 3700, rating: 4.0, reviews: 543, availability: 'Available', demand: 55, change: -4.2, isPrimary: false },
  { id: 7, name: 'Kundan Villa', type: 'Villa', location: 'Khandala', price: 3200, rating: 4.1, reviews: 321, availability: 'Available', demand: 48, change: 0, isPrimary: false },
  { id: 8, name: 'Kolhapuri Heritage Inn', type: 'Budget', location: 'Lonavala', price: 2900, rating: 3.8, reviews: 210, availability: 'Available', demand: 40, change: -1.0, isPrimary: false },
  { id: 9, name: 'Sayaji Lonavala', type: 'Hotel', location: 'Lonavala', price: 5800, rating: 4.6, reviews: 1540, availability: 'Available', demand: 82, change: 7.3, isPrimary: false },
  { id: 10, name: 'Hilton Shillim', type: 'Luxury', location: 'Shillim', price: 18000, rating: 4.9, reviews: 890, availability: 'Low', demand: 93, change: 15.2, isPrimary: false },
  { id: 11, name: 'Della Resorts', type: 'Resort', location: 'Lonavala', price: 8500, rating: 4.6, reviews: 3100, availability: 'Low', demand: 90, change: 9.4, isPrimary: false },
  { id: 12, name: 'Novotel Imagica', type: 'Luxury', location: 'Khopoli', price: 9200, rating: 4.5, reviews: 2100, availability: 'Available', demand: 77, change: 4.2, isPrimary: false },
];

type SortKey = 'price' | 'rating' | 'reviews' | 'demand' | 'change';

export default function CompetitorsPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', 'Hotel', 'Resort', 'Villa', 'Luxury', 'Budget'];

  const sorted = useMemo(() => {
    let data = ALL_COMPETITORS.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'All' || c.type === typeFilter)
    );
    data.sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return data;
  }, [search, sortKey, sortDir, typeFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors"
      style={{ color: sortKey === k ? 'var(--brand)' : 'var(--text-muted)' }}
      onClick={() => handleSort(k)}>
      <span className="flex items-center gap-1">{label} <ArrowUpDown size={10} /></span>
    </th>
  );

  return (
    <div>
      <PageHeader
        title="Competitor Intelligence"
        subtitle={`Tracking ${ALL_COMPETITORS.length} properties · Lonavala / Khandala market`}
        breadcrumb={['OrbitEdge', 'Competitors']}
      />

      {/* Summary KPIs */}
      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg Market Price', value: fmtINR(5233) },
          { label: 'Sold Out', value: '1 of 12' },
          { label: 'Avg Rating', value: '4.4 ★' },
          { label: 'Avg Demand Score', value: '73/100' },
        ].map(k => (
          <div key={k.label} className="rounded-xl border px-5 py-4"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{k.label}</div>
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="px-8 mb-8">
        <SectionCard noPad>
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none focus:ring-1"
                style={{
                  background: 'var(--bg-overlay)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', '--tw-ring-color': 'var(--brand)',
                } as React.CSSProperties}
                placeholder="Search properties..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              {types.map(t => (
                <button key={t}
                  onClick={() => setTypeFilter(t)}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', typeFilter === t ? 'text-white' : '')}
                  style={typeFilter === t ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--text-muted)', background: 'var(--bg-overlay)' }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{sorted.length} properties</div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider w-8"
                    style={{ color: 'var(--text-muted)' }}>#</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Property</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Type</th>
                  <SortHeader k="price" label="Price / Night" />
                  <SortHeader k="rating" label="Rating" />
                  <SortHeader k="reviews" label="Reviews" />
                  <SortHeader k="demand" label="Demand" />
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Availability</th>
                  <SortHeader k="change" label="7d Change" />
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr><td colSpan={9}>
                    <EmptyState title="No competitors match this filter" description="Try adjusting your search or filter." />
                  </td></tr>
                ) : sorted.map((c, i) => (
                  <tr key={c.id}
                    className="border-b transition-colors hover:bg-white/[0.02] cursor-pointer"
                    style={{ borderColor: 'var(--border-subtle)', background: c.isPrimary ? 'rgba(59,130,246,0.04)' : undefined }}>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {c.isPrimary && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--brand)' }} />}
                        <div>
                          <div className="text-sm font-medium" style={{ color: c.isPrimary ? 'var(--brand)' : 'var(--text-primary)' }}>{c.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="neutral">{c.type}</Badge></td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{fmtINR(c.price)}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{fmtRating(c.rating)}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{fmtCount(c.reviews)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${c.demand}%`, background: c.demand > 75 ? 'var(--demand-high)' : c.demand > 50 ? 'var(--demand-medium)' : 'var(--demand-low)' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.demand}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.availability === 'Sold Out' ? 'sold-out' : c.availability === 'Low' ? 'warning' : 'positive'}>
                        {c.availability}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: c.change > 0 ? 'var(--negative)' : c.change < 0 ? 'var(--positive)' : 'var(--neutral)' }}>
                        {c.change > 0 ? <TrendingUp size={12} /> : c.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                        {c.change > 0 ? '+' : ''}{c.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

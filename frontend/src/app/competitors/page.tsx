'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown, Filter, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PageHeader, SectionCard, Badge, EmptyState, fmtINR, fmtRating, fmtCount } from '@/components/ui';
import clsx from 'clsx';
import { api } from '@/lib/api';

type SortKey = 'price' | 'rating' | 'reviews' | 'demand' | 'change';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', 'Hotel', 'Resort', 'Villa', 'Luxury', 'Budget'];

  useEffect(() => {
    api.getCompetitorsRanking().then(data => {
      // Map API data to the format expected by the component
      const mapped = data.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type || 'Hotel',
        location: c.location || 'Lonavala',
        price: c.price || 0,
        rating: c.rating || 0,
        reviews: c.reviews || 0,
        availability: c.availability || 'Unknown',
        demand: c.demand || 0,
        change: 0, // We could pull this from property_metrics later
        isPrimary: c.is_primary
      }));
      setCompetitors(mapped);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const sorted = useMemo(() => {
    let data = competitors.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'All' || c.type === typeFilter)
    );
    data.sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return data;
  }, [search, sortKey, sortDir, typeFilter, competitors]);

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
        subtitle={loading ? 'Loading...' : `Tracking ${competitors.length} properties · Lonavala / Khandala market`}
        breadcrumb={['OrbitEdge', 'Competitors']}
      />

      {/* Summary KPIs */}
      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tracked', value: competitors.length.toString() },
          { label: 'Sold Out', value: competitors.filter(c => c.availability === 'Sold Out').length.toString() },
          { label: 'Avg Rating', value: competitors.length ? `${(competitors.reduce((acc, c) => acc + c.rating, 0) / competitors.length).toFixed(1)} ★` : '0 ★' },
          { label: 'Avg Demand Score', value: competitors.length ? `${(competitors.reduce((acc, c) => acc + c.demand, 0) / competitors.length).toFixed(0)}/100` : '0/100' },
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
                {loading ? (
                    <tr><td colSpan={9} className="text-center py-8 text-sm text-gray-500">Loading properties...</td></tr>
                ) : sorted.length === 0 ? (
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
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.demand.toFixed(0)}</span>
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

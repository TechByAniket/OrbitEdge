'use client';

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

// ─── Shared Tooltip ────────────────────────────────────────────────────────

const chartTooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1e2d40',
  borderRadius: '8px',
  color: '#f0f4ff',
  fontSize: '12px',
};

// ─── Price Trend Chart ─────────────────────────────────────────────────────

interface PriceTrendData {
  date: string;
  primary?: number;
  market_avg?: number;
  market_min?: number;
  market_max?: number;
}

export function PriceTrendChart({ data }: { data: PriceTrendData[] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>
      No price data available yet. Run a tracking cycle to collect data.
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#4b6080', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4b6080', fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip contentStyle={chartTooltipStyle}
          formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name]}
        />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#8da2c0' }} />
        <Area type="monotone" dataKey="market_avg" name="Market Avg" stroke="#10b981" strokeWidth={1.5}
          fill="url(#colorMarket)" strokeDasharray="4 4" dot={false} />
        <Area type="monotone" dataKey="primary" name="Elite Hotel" stroke="#3b82f6" strokeWidth={2}
          fill="url(#colorPrimary)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Competitor Price Bar Chart ─────────────────────────────────────────────

interface CompetitorPriceData {
  name: string;
  price: number;
  is_primary?: boolean;
}

export function CompetitorPriceChart({ data }: { data: CompetitorPriceData[] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>
      No competitor data available yet.
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" horizontal={true} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#4b6080', fontSize: 10 }} axisLine={false} tickLine={false}
          angle={-35} textAnchor="end" interval={0} />
        <YAxis tick={{ fill: '#4b6080', fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip contentStyle={chartTooltipStyle}
          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Price']} />
        <Bar dataKey="price" radius={[4, 4, 0, 0]}
          fill="#3b82f6"
          label={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Demand Score Chart ────────────────────────────────────────────────────

interface DemandData {
  date: string;
  demand: number;
}

export function DemandChart({ data }: { data: DemandData[] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>
      Insufficient data to display demand trends.
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#4b6080', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4b6080', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}/100`, 'Demand Score']} />
        <ReferenceLine y={70} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'High', fill: '#f97316', fontSize: 10 }} />
        <Line type="monotone" dataKey="demand" stroke="#f97316" strokeWidth={2}
          dot={false} activeDot={{ r: 4, fill: '#f97316' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Availability Trend ────────────────────────────────────────────────────

interface AvailData {
  date: string;
  available: number;
  sold_out: number;
}

export function AvailabilityTrendChart({ data }: { data: AvailData[] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>
      No availability data collected yet.
    </div>
  );
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#4b6080', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4b6080', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={chartTooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#8da2c0' }} />
        <Bar dataKey="available" name="Available" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
        <Bar dataKey="sold_out" name="Sold Out" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

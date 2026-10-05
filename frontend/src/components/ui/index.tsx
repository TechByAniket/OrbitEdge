import clsx from 'clsx';

// ─── Page Header ───────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between px-8 pt-8 pb-6">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-1.5 mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                <span>{crumb}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 mt-1">{actions}</div>}
    </div>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  change?: number;
  icon?: React.ReactNode;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function KpiCard({ label, value, subtext, change, icon, highlight, size = 'md' }: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className={clsx(
        'rounded-xl p-5 border transition-all hover:border-blue-500/20 group',
        highlight && 'ring-1 ring-blue-500/30'
      )}
      style={{
        background: highlight ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))' : 'var(--bg-surface)',
        borderColor: highlight ? 'rgba(59,130,246,0.25)' : 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
        {icon && <div style={{ color: 'var(--text-muted)' }} className="group-hover:text-blue-400 transition-colors">{icon}</div>}
      </div>
      <div className={clsx('mt-3 font-bold', size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-xl' : 'text-3xl')}
        style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {change !== undefined && (
          <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded')}
            style={{
              color: isPositive ? 'var(--positive)' : isNegative ? 'var(--negative)' : 'var(--neutral)',
              background: isPositive ? 'var(--positive-dim)' : isNegative ? 'var(--negative-dim)' : 'transparent',
            }}>
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        )}
        {subtext && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtext}</span>}
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  noPad?: boolean;
}

export function SectionCard({ title, subtitle, children, className, actions, noPad }: SectionCardProps) {
  return (
    <div
      className={clsx('rounded-xl border', className)}
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            {title && <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</div>}
            {subtitle && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={clsx(noPad ? '' : 'p-6')}>
        {children}
      </div>
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────

type BadgeVariant = 'positive' | 'negative' | 'warning' | 'neutral' | 'brand' | 'sold-out';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  positive: { color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' },
  negative: { color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' },
  warning: { color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' },
  neutral: { color: '#6b7280', background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.2)' },
  brand: { color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' },
  'sold-out': { color: '#ef4444', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' },
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={badgeStyles[variant]}>
      {children}
    </span>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('animate-pulse rounded', className)}
      style={{ background: 'var(--bg-overlay)' }} />
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>
          {icon}
        </div>
      )}
      <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</div>
      {description && <div className="text-xs max-w-xs" style={{ color: 'var(--text-muted)' }}>{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Trend Indicator ───────────────────────────────────────────────────────

export function TrendIndicator({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  return (
    <span
      className="inline-flex items-center text-xs font-semibold"
      style={{ color: isPositive ? 'var(--positive)' : isNegative ? 'var(--negative)' : 'var(--neutral)' }}
    >
      {isPositive ? '▲' : isNegative ? '▼' : '●'} {isPositive ? '+' : ''}{value.toFixed(1)}{suffix}
    </span>
  );
}

// ─── Format helpers ────────────────────────────────────────────────────────

export function fmtINR(val?: number | null): string {
  if (val == null) return '—';
  return `₹${val.toLocaleString('en-IN')}`;
}

export function fmtPercent(val?: number | null): string {
  if (val == null) return '—';
  return `${val.toFixed(1)}%`;
}

export function fmtCount(val?: number | null): string {
  if (val == null) return '—';
  return val.toLocaleString('en-IN');
}

export function fmtRating(val?: number | null): string {
  if (val == null) return '—';
  return `${val.toFixed(1)} ★`;
}

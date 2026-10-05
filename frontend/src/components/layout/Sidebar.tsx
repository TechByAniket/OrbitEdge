'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, TrendingUp, CalendarCheck,
  BarChart3, DollarSign, Bell, BrainCircuit, ChevronRight,
  Satellite, Activity, Server, Settings2
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { label: 'Overview',    href: '/',              icon: LayoutDashboard },
  { label: 'Competitors', href: '/competitors',   icon: Building2 },
  { label: 'Properties',  href: '/properties',    icon: Satellite },
  { label: 'Pricing',     href: '/pricing',       icon: TrendingUp },
  { label: 'Availability',href: '/availability',  icon: CalendarCheck },
  { label: 'Demand',      href: '/demand',        icon: Activity },
  { label: 'Revenue',     href: '/revenue',       icon: DollarSign },
  { label: 'Alerts',      href: '/alerts',        icon: Bell },
  { label: 'Tracking',    href: '/tracking',      icon: Server },
  { label: 'Scenarios',   href: '/scenarios',     icon: Settings2 },
  { label: 'AI Advisor',  href: '/ai',            icon: BrainCircuit },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}
      className="fixed inset-y-0 left-0 w-60 flex flex-col z-40"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          <BarChart3 size={16} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>OrbitEdge</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Intelligence Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'text-white'
                  : 'text-[color:var(--text-secondary)] hover:text-white hover:bg-white/5'
              )}
              style={active ? { background: 'var(--brand-glow)', color: 'var(--brand)' } : {}}
            >
              <Icon size={16} className={clsx(active ? 'text-blue-400' : 'text-[color:var(--text-muted)] group-hover:text-[color:var(--text-secondary)]')} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={12} className="text-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--positive)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Backend Connected</span>
        </div>
        <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Elite Hotel · Lonavala
        </div>
      </div>
    </aside>
  );
}

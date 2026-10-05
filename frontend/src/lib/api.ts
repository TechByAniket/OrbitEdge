// Centralized API client for the OrbitEdge FastAPI backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Property {
  id: string;
  property_name: string;
  is_primary: boolean;
  property_type: string;
  location: string;
  mmt_url: string;
  tracking_enabled: boolean;
  star_rating?: number;
  latitude?: number;
  longitude?: number;
}

export interface BookingScenario {
  id: string;
  scenario_name: string;
  stay_duration: number;
  guests: number;
  rooms: number;
  date_type: string;
  is_active: boolean;
}

export interface Observation {
  id: string;
  property_id: string;
  scenario_id: string;
  check_in: string;
  check_out: string;
  price?: number;
  rating?: number;
  review_count?: number;
  available_units?: number;
  created_at: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const api = {
  getProperties: () => apiFetch<Property[]>('/api/properties'),
  getProperty: (id: string) => apiFetch<Property>(`/api/properties/${id}`),
  getPrimaryProperty: async (): Promise<Property | null> => {
    const props = await apiFetch<Property[]>('/api/properties');
    return props.find(p => p.is_primary) ?? null;
  },
  getScenarios: () => apiFetch<BookingScenario[]>('/api/scenarios'),
};

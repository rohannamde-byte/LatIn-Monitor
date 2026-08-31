export type Theater = 'india' | 'latvia';
export type SignalDomain = 'news' | 'conflict' | 'military' | 'cyber' | 'aviation' | 'maritime' | 'infrastructure' | 'weather' | 'disaster' | 'finance' | 'health' | 'space';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Signal {
  id: string;
  domain: SignalDomain;
  title: string;
  summary?: string;
  timestamp: string;
  source: string;
  sourceUrl?: string;
  lat?: number;
  lon?: number;
  country: Theater;
  region?: string;
  severity: Severity;
  confidence: number;
  entities?: string[];
  tags?: string[];
  raw?: unknown;
}

export interface RiskBreakdown {
  overall: number;
  security: number;
  conflict: number;
  unrest: number;
  information: number;
  infrastructure: number;
  weather: number;
  trend: number;
}

export interface Correlation {
  id: string;
  country: Theater;
  title: string;
  domains: SignalDomain[];
  score: number;
  explanation: string;
  signalIds: string[];
  createdAt: string;
}

export const INDIA_FOCUS = ['LAC', 'India-Pakistan border', 'Indian Ocean', 'Arabian Sea', 'Bay of Bengal', 'Andaman & Nicobar', 'major ports', 'energy corridors'];
export const LATVIA_FOCUS = ['Russia border', 'Belarus border', 'Baltic Sea', 'Gulf of Riga', 'NATO Baltic region', 'air policing', 'energy interconnectors', 'Rail Baltica', 'ports', 'subsea infrastructure'];

export function scoreRisk(signals: Signal[], country: Theater): RiskBreakdown {
  const weights: Record<SignalDomain, number> = { news: .7, conflict: 1.4, military: 1.25, cyber: 1.15, aviation: .75, maritime: .8, infrastructure: 1.1, weather: .65, disaster: .9, finance: .7, health: .55, space: .35 };
  const relevant = signals.filter(s => s.country === country);
  const weighted = relevant.reduce((sum, s) => sum + (s.severity === 'critical' ? 100 : s.severity === 'high' ? 75 : s.severity === 'medium' ? 50 : s.severity === 'low' ? 25 : 5) * weights[s.domain] * Math.max(.1, s.confidence), 0);
  const overall = Math.min(100, Math.round(weighted / Math.max(1, relevant.length * 1.05)));
  const domain = (d: SignalDomain) => Math.min(100, Math.round((relevant.filter(s => s.domain === d).reduce((a, s) => a + (s.severity === 'critical' ? 100 : s.severity === 'high' ? 75 : s.severity === 'medium' ? 50 : 25) * s.confidence, 0) / Math.max(1, relevant.filter(s => s.domain === d).length))));
  return { overall, security: Math.round((domain('military') + domain('cyber')) / 2), conflict: domain('conflict'), unrest: domain('news'), information: domain('news'), infrastructure: domain('infrastructure'), weather: domain('weather'), trend: 0 };
}

export function correlate(signals: Signal[], country: Theater): Correlation[] {
  const scoped = signals.filter(s => s.country === country);
  const byDomain = new Map<SignalDomain, Signal[]>();
  scoped.forEach(s => byDomain.set(s.domain, [...(byDomain.get(s.domain) ?? []), s]));
  const groups: [SignalDomain, SignalDomain, string][] = [['military', 'maritime', 'Military + maritime convergence'], ['cyber', 'infrastructure', 'Cyber + infrastructure convergence'], ['weather', 'infrastructure', 'Weather + infrastructure exposure'], ['conflict', 'news', 'Conflict + information convergence'], ['finance', 'infrastructure', 'Market + infrastructure convergence']];
  return groups.flatMap(([a, b, title]) => {
    const left = byDomain.get(a) ?? [], right = byDomain.get(b) ?? [];
    if (!left.length || !right.length) return [];
    const picked = [...left.slice(0, 3), ...right.slice(0, 3)];
    return [{ id: `${country}-${a}-${b}`, country, title, domains: [a, b], score: Math.min(100, Math.round(45 + picked.length * 7)), explanation: `${picked.length} independent signals overlap across ${a} and ${b}; investigate for corroboration before escalation.` , signalIds: picked.map(s => s.id), createdAt: new Date().toISOString() }];
  });
}

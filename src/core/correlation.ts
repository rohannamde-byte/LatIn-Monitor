import type { CountryScore, Signal, Theater } from './signal';

const weight: Record<string, number> = { conflict: 1.3, military: 1.15, cyber: 1.1, infrastructure: 1, disaster: 0.9, maritime: 0.85, aviation: 0.75, weather: 0.65, news: 0.35, finance: 0.5, energy: 0.8, health: 0.55 };

export function correlate(theater: Theater, signals: Signal[]): CountryScore {
  const scoped = signals.filter(s => s.theater === theater);
  const components: Record<string, number> = {};
  for (const domain of Object.keys(weight)) {
    const ds = scoped.filter(s => s.domain === domain);
    const pressure = ds.reduce((sum, s) => sum + severityValue(s.severity) * s.confidence * weight[domain], 0);
    components[domain] = Math.min(100, Math.round(pressure));
  }
  const active = Object.values(components).filter(v => v > 0);
  const convergence = Math.min(25, Math.max(0, active.length - 2) * 4);
  const score = Math.min(100, Math.round((active.length ? active.reduce((a, b) => a + b, 0) / active.length : 0) + convergence));
  const top = Object.entries(components).sort((a, b) => b[1] - a[1]).slice(0, 3).filter(([, v]) => v > 0).map(([k, v]) => `${k}: ${v}`);
  return { theater, score, components, rationale: top.length ? [`Top pressure domains — ${top.join(', ')}`, `Convergence bonus: ${convergence}`] : ['No live signals available yet'], observedAt: new Date().toISOString() };
}

function severityValue(s: Signal['severity']) { return ({ critical: 18, high: 12, medium: 7, low: 3, info: 1 } as Record<Signal['severity'], number>)[s]; }

export function detectConvergence(signals: Signal[], theater: Theater) {
  const scoped = signals.filter(s => s.theater === theater);
  const domains = new Set(scoped.map(s => s.domain));
  const pairs = [['military','maritime'],['cyber','infrastructure'],['weather','infrastructure'],['conflict','finance'],['disaster','infrastructure'],['aviation','military']];
  return pairs.filter(([a,b]) => domains.has(a as any) && domains.has(b as any)).map(([a,b]) => ({ theater, domains: [a,b], strength: Math.min(100, scoped.filter(s => s.domain === a || s.domain === b).length * 12) }));
}

import type { Correlation, Signal, Theater } from './data/signals';

export function buildBrief(country: Theater, signals: Signal[], correlations: Correlation[]) {
  const recent = signals.slice().sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 8);
  const domains = [...new Set(recent.map(s => s.domain))];
  const countryName = country === 'india' ? 'India' : 'Latvia';
  const lead = recent[0]?.title ?? 'No recent public-source signal detected';
  const convergence = correlations[0]?.title;
  return {
    title: `${countryName} intelligence brief`,
    summary: convergence
      ? `${convergence} is the leading cross-domain watch item. ${lead}.`
      : `${countryName} currently has ${recent.length} recent public-source signals across ${domains.length || 0} domains.`,
    watch: domains.length ? `Domains active: ${domains.join(', ')}.` : 'Continue monitoring for new signals.',
    signals: recent.map(s => ({ title: s.title, source: s.source, timestamp: s.timestamp, severity: s.severity })),
    generatedAt: new Date().toISOString(),
    methodology: 'Automated public-source synthesis; corroborate before escalation or operational decisions.',
  };
}

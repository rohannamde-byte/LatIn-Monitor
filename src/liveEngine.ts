import { collectPublicSignals } from './data/sources';
import { correlate, scoreRisk, type Signal, type Theater } from './data/signals';

export interface LiveSnapshot {
  country: Theater;
  signals: Signal[];
  risk: ReturnType<typeof scoreRisk>;
  correlations: ReturnType<typeof correlate>;
  fetchedAt: string;
}

export async function loadLiveSnapshot(country: Theater): Promise<LiveSnapshot> {
  const signals = await collectPublicSignals(country);
  return {
    country,
    signals,
    risk: scoreRisk(signals, country),
    correlations: correlate(signals, country),
    fetchedAt: new Date().toISOString(),
  };
}

export async function loadBothLiveSnapshots() {
  const [india, latvia] = await Promise.all([
    loadLiveSnapshot('india'),
    loadLiveSnapshot('latvia'),
  ]);
  return { india, latvia };
}

export function filterSignals(signals: Signal[], hours: number) {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return signals.filter((signal) => Date.parse(signal.timestamp) >= cutoff);
}

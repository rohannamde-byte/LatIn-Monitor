import type { Signal, Theater } from './signals';

const endpoints = {
  india: 'https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=1d&interval=15m',
  latvia: 'https://query1.finance.yahoo.com/v8/finance/chart/%5EOMX?range=1d&interval=15m',
} as const;

export async function fetchMarketSignal(country: Theater): Promise<Signal[]> {
  try {
    const response = await fetch(endpoints[country], { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return [];
    const data = await response.json() as { chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; previousClose?: number; currency?: string } }> } };
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return [];
    const price = meta.regularMarketPrice;
    const previous = meta.previousClose ?? price;
    const change = ((price - previous) / previous) * 100;
    return [{
      id: `market-${country}-${Math.round(Date.now() / 60000)}`,
      domain: 'finance',
      title: `${country === 'india' ? 'NIFTY 50' : 'OMX Riga'} ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)}%`,
      summary: `${price.toFixed(2)} ${meta.currency ?? ''}`.trim(),
      timestamp: new Date().toISOString(),
      source: 'Yahoo Finance',
      sourceUrl: 'https://finance.yahoo.com/',
      country,
      severity: Math.abs(change) >= 2 ? 'medium' : 'low',
      confidence: 0.8,
      tags: ['finance', 'market'],
    } satisfies Signal];
  } catch {
    return [];
  }
}

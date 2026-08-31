export type Theater = 'india' | 'latvia';
export type SignalDomain = 'news' | 'conflict' | 'military' | 'aviation' | 'maritime' | 'infrastructure' | 'weather' | 'disaster' | 'cyber' | 'finance' | 'health' | 'energy';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface GeoPoint { lat: number; lon: number; }
export interface SourceRef { name: string; url?: string; retrievedAt: string; reliability?: number; }
export interface Signal {
  id: string;
  theater: Theater;
  domain: SignalDomain;
  severity: Severity;
  title: string;
  summary?: string;
  location?: GeoPoint;
  region?: string;
  observedAt: string;
  source: SourceRef;
  tags: string[];
  confidence: number;
}

export interface MarketQuote { symbol: string; name: string; value: number; changePct: number; currency: string; observedAt: string; }
export interface WeatherSnapshot { theater: Theater; temperatureC: number; windKph: number; precipitationMm: number; condition: string; observedAt: string; }
export interface CountryScore { theater: Theater; score: number; components: Record<string, number>; rationale: string[]; observedAt: string; }

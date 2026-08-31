import type { Signal, Theater } from './signals';

const INDIA_TERMS = /india|indian|delhi|mumbai|ladakh|kashmir|pakistan|china|arunachal|andaman|arabian sea|bay of bengal/i;
const LATVIA_TERMS = /latvia|riga|latgale|kurzeme|baltic|belarus|russia|nato|gulf of riga/i;

function countryFor(text: string): Theater | null {
  if (INDIA_TERMS.test(text)) return 'india';
  if (LATVIA_TERMS.test(text)) return 'latvia';
  return null;
}

export async function fetchGdelt(country: Theater, limit = 30): Promise<Signal[]> {
  const query = country === 'india' ? 'India OR Indian Ocean OR Ladakh OR Pakistan' : 'Latvia OR Baltic OR Riga OR Belarus';
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&format=json&maxrecords=${limit}&sort=datedesc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GDELT ${res.status}`);
  const data = await res.json() as { articles?: Array<{ url: string; title: string; seendate?: string; domain?: string; language?: string }> };
  return (data.articles ?? []).flatMap((a, i) => {
    const detected = countryFor(`${a.title} ${a.domain ?? ''}`);
    if (detected !== country) return [];
    return [{ id: `gdelt-${country}-${i}-${btoa(a.url).slice(0, 12)}`, domain: 'news', title: a.title, timestamp: a.seendate ? new Date(a.seendate).toISOString() : new Date().toISOString(), source: a.domain ?? 'GDELT', sourceUrl: a.url, country, severity: 'info', confidence: .55, tags: ['gdelt'] } satisfies Signal];
  });
}

export async function fetchEarthquakes(country: Theater): Promise<Signal[]> {
  const box = country === 'india' ? '68,6,98,36' : '20,55,29,59';
  const [minLon, minLat, maxLon, maxLat] = box.split(',');
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlongitude=${minLon}&minlatitude=${minLat}&maxlongitude=${maxLon}&maxlatitude=${maxLat}&orderby=time&limit=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`USGS ${res.status}`);
  const data = await res.json() as { features: Array<{ id: string; geometry: { coordinates: [number, number, number] }; properties: { mag: number; place: string; time: number; url: string } }> };
  return data.features.map(f => ({ id: `usgs-${f.id}`, domain: 'disaster', title: `M${f.properties.mag?.toFixed(1) ?? '?'} earthquake`, summary: f.properties.place, timestamp: new Date(f.properties.time).toISOString(), source: 'USGS', sourceUrl: f.properties.url, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], country, severity: f.properties.mag >= 6 ? 'high' : f.properties.mag >= 4.5 ? 'medium' : 'low', confidence: .95, tags: ['earthquake'] } satisfies Signal));
}

export async function fetchWeather(country: Theater): Promise<Signal[]> {
  const [lat, lon] = country === 'india' ? [22.5, 79.1] : [57.1, 24.6];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,precipitation,rain&hourly=precipitation_probability,wind_gusts_10m&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const d = await res.json() as { current?: { temperature_2m: number; wind_speed_10m: number; precipitation: number; rain: number } };
  const c = d.current;
  if (!c) return [];
  const severity = c.wind_speed_10m > 70 || c.rain > 30 ? 'high' : c.wind_speed_10m > 45 || c.rain > 10 ? 'medium' : 'low';
  return [{ id: `weather-${country}-${Date.now()}`, domain: 'weather', title: `Current weather: ${c.temperature_2m}°C`, summary: `Wind ${c.wind_speed_10m} km/h · rain ${c.rain} mm`, timestamp: new Date().toISOString(), source: 'Open-Meteo', sourceUrl: 'https://open-meteo.com/', lat, lon, country, severity, confidence: .9, tags: ['weather'] } satisfies Signal];
}

export async function collectPublicSignals(country: Theater): Promise<Signal[]> {
  const results = await Promise.allSettled([fetchGdelt(country), fetchEarthquakes(country), fetchWeather(country)]);
  return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
}

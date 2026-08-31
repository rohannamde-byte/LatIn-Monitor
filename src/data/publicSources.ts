import type { Signal, Theater, WeatherSnapshot } from '../core/signal';

const now = () => new Date().toISOString();

export const endpoints = {
  usgsIndia: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=50&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=98',
  usgsLatvia: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=50&minlatitude=55&maxlatitude=58.5&minlongitude=20&maxlongitude=28.5',
  openMeteoIndia: 'https://api.open-meteo.com/v1/forecast?latitude=22.5&longitude=79.1&current=temperature_2m,wind_speed_10m,precipitation,weather_code&timezone=UTC',
  openMeteoLatvia: 'https://api.open-meteo.com/v1/forecast?latitude=57.1&longitude=24.6&current=temperature_2m,wind_speed_10m,precipitation,weather_code&timezone=UTC',
  gdelt: 'https://api.gdeltproject.org/api/v2/doc/doc?query=India%20OR%20Latvia&mode=artlist&format=json&maxrecords=50&sort=datedesc'
} as const;

const weatherText = (code: number) => {
  if ([0].includes(code)) return 'Clear';
  if ([1,2,3].includes(code)) return 'Cloudy';
  if ([45,48].includes(code)) return 'Fog';
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return 'Rain';
  if ([71,73,75,77,85,86].includes(code)) return 'Snow';
  if ([95,96,99].includes(code)) return 'Thunderstorm';
  return 'Unknown';
};

export async function fetchWeather(theater: Theater): Promise<WeatherSnapshot | null> {
  const url = theater === 'india' ? endpoints.openMeteoIndia : endpoints.openMeteoLatvia;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const j = await r.json();
    const c = j.current;
    return { theater, temperatureC: c.temperature_2m, windKph: c.wind_speed_10m, precipitationMm: c.precipitation, condition: weatherText(c.weather_code), observedAt: now() };
  } catch { return null; }
}

export async function fetchEarthquakes(theater: Theater): Promise<Signal[]> {
  const url = theater === 'india' ? endpoints.usgsIndia : endpoints.usgsLatvia;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.features ?? []).map((f: any): Signal => {
      const mag = Number(f.properties?.mag ?? 0);
      const [lon, lat] = f.geometry?.coordinates ?? [0, 0];
      return { id: `usgs-${f.id}`, theater, domain: 'disaster', severity: mag >= 6 ? 'critical' : mag >= 5 ? 'high' : mag >= 4 ? 'medium' : 'low', title: `M${mag.toFixed(1)} earthquake`, summary: f.properties?.place ?? 'Earthquake detected', location: { lat, lon }, observedAt: new Date(f.properties?.time ?? Date.now()).toISOString(), source: { name: 'USGS Earthquake Hazards Program', url: 'https://earthquake.usgs.gov/', retrievedAt: now(), reliability: 0.99 }, tags: ['earthquake', theater], confidence: 0.99 };
    });
  } catch { return []; }
}

export async function fetchGdelt(): Promise<Signal[]> {
  try {
    const r = await fetch(endpoints.gdelt, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.articles ?? []).slice(0, 50).map((a: any, i: number): Signal => ({ id: `gdelt-${a.url ?? i}`, theater: /latvia/i.test(`${a.title} ${a.domain}`) ? 'latvia' : 'india', domain: 'news', severity: 'info', title: a.title ?? 'News signal', summary: a.domain ?? '', observedAt: a.seendate ? new Date(a.seendate.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6Z')).toISOString() : now(), source: { name: a.domain ?? 'GDELT', url: a.url, retrievedAt: now(), reliability: 0.7 }, tags: ['news', 'gdelt'], confidence: 0.7 }));
  } catch { return []; }
}

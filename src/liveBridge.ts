type Country = 'india' | 'latvia';
type LiveSignal = { title: string; summary: string; source: string; url?: string; time: string; severity: 'HIGH'|'MEDIUM'|'LOW'|'INFO'; lat?: number; lon?: number };

const BOXES: Record<Country, string> = {
  india: 'minlongitude=68&minlatitude=6&maxlongitude=98&maxlatitude=36',
  latvia: 'minlongitude=20&minlatitude=55&maxlongitude=29&maxlatitude=59'
};

const queryFor = (country: Country) => country === 'india'
  ? 'India OR Indian Ocean OR Ladakh OR Pakistan'
  : 'Latvia OR Baltic OR Riga OR Belarus';

async function json(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

async function collect(country: Country): Promise<LiveSignal[]> {
  const [news, quakes, weather] = await Promise.allSettled([
    json(`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(queryFor(country))}&mode=artlist&format=json&maxrecords=20&sort=datedesc`),
    json(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=25&${BOXES[country]}`),
    json(country === 'india'
      ? 'https://api.open-meteo.com/v1/forecast?latitude=22.5&longitude=79.1&current=temperature_2m,wind_speed_10m,precipitation,rain&timezone=UTC'
      : 'https://api.open-meteo.com/v1/forecast?latitude=57.1&longitude=24.6&current=temperature_2m,wind_speed_10m,precipitation,rain&timezone=UTC')
  ]);
  const out: LiveSignal[] = [];
  if (news.status === 'fulfilled') {
    for (const a of news.value.articles ?? []) out.push({ title: a.title ?? 'News signal', summary: a.domain ?? 'GDELT', source: a.domain ?? 'GDELT', url: a.url, time: a.seendate ?? new Date().toISOString(), severity: 'INFO' });
  }
  if (quakes.status === 'fulfilled') {
    for (const f of quakes.value.features ?? []) {
      const mag = Number(f.properties?.mag ?? 0); const [lon, lat] = f.geometry?.coordinates ?? [0,0];
      out.push({ title: `M${mag.toFixed(1)} earthquake`, summary: f.properties?.place ?? 'Earthquake detected', source: 'USGS', url: f.properties?.url, time: new Date(f.properties?.time ?? Date.now()).toISOString(), severity: mag >= 6 ? 'HIGH' : mag >= 4.5 ? 'MEDIUM' : 'LOW', lat, lon });
    }
  }
  if (weather.status === 'fulfilled' && weather.value.current) {
    const c = weather.value.current; const severe = Number(c.wind_speed_10m ?? 0) > 45 || Number(c.rain ?? 0) > 10;
    out.push({ title: `Weather ${c.temperature_2m}°C · wind ${c.wind_speed_10m} km/h`, summary: `Precipitation ${c.precipitation} mm`, source: 'Open-Meteo', url: 'https://open-meteo.com/', time: new Date().toISOString(), severity: severe ? 'MEDIUM' : 'LOW' });
  }
  return out.sort((a,b) => Date.parse(b.time) - Date.parse(a.time)).slice(0, 40);
}

function activeCountry(): Country { return location.hash.includes('latvia') ? 'latvia' : 'india'; }
function esc(s: string) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)); }
function paint(signals: LiveSignal[]) {
  const panel = document.querySelector('.events');
  if (!panel) return;
  const body = signals.slice(0, 10).map(s => `<article class="event"><time>${new Date(s.time).toISOString().slice(11,16)}</time><div class="eventBody"><div><b>${esc(s.title)}</b><span class="sev ${s.severity.toLowerCase()}">${s.severity}</span></div><small>${esc(s.source)} · ${esc(s.summary)}${s.url ? ` · <a href="${esc(s.url)}" target="_blank" rel="noreferrer">SOURCE</a>` : ''}</small></div></article>`).join('');
  const head = panel.querySelector('.panelHead');
  panel.innerHTML = '';
  if (head) panel.appendChild(head);
  const count = document.createElement('div'); count.className = 'liveDataBadge'; count.textContent = `${signals.length} LIVE PUBLIC-SOURCE SIGNALS`; panel.appendChild(count);
  panel.insertAdjacentHTML('beforeend', body + '<button class="timeline">OPEN FULL TIMELINE →</button>');
  const stat = document.querySelector('.mapStats div:first-child b'); if (stat) stat.textContent = String(signals.length);
}

async function refresh() { try { paint(await collect(activeCountry())); } catch { /* keep last good state */ } }

function boot() {
  refresh();
  setInterval(refresh, 120000);
  window.addEventListener('hashchange', refresh);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

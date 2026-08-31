import type { Theater } from './data/signals';

export interface WatchItem { id: string; label: string; country: Theater; query: string; enabled: boolean; }

const KEY = 'latin-monitor-watchlist';
const defaults: WatchItem[] = [
  { id: 'india-lac', label: 'India–China LAC', country: 'india', query: 'Ladakh OR Arunachal OR LAC', enabled: true },
  { id: 'india-ocean', label: 'Indian Ocean', country: 'india', query: 'Indian Ocean OR Arabian Sea OR Bay of Bengal', enabled: true },
  { id: 'latvia-baltic', label: 'Baltic security', country: 'latvia', query: 'Baltic OR Latvia OR NATO', enabled: true },
  { id: 'latvia-border', label: 'Russia / Belarus border', country: 'latvia', query: 'Russia Latvia border OR Belarus Latvia', enabled: true },
];

export function getWatchlist(): WatchItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') ?? defaults; } catch { return defaults; }
}

export function saveWatchlist(items: WatchItem[]) { localStorage.setItem(KEY, JSON.stringify(items)); }

export function matchesWatchlist(text: string, item: WatchItem) {
  return item.query.split(/\s+OR\s+/i).some(term => text.toLowerCase().includes(term.trim().toLowerCase()));
}

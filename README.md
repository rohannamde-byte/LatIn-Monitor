# LatIn Monitor

Focused real-time situational-awareness dashboard for **India + Latvia**, benchmarked against the depth and interaction model of World Monitor while remaining an independent implementation.

## v0.2 shipped
- Real MapLibre GL map using OpenFreeMap tiles
- India / Latvia theater switching with automatic fly-to
- Flat map + globe projection toggle
- Zoom, locate and navigation controls
- 16 layer controls across situation, security, flow, infrastructure, physical and space categories
- Country risk snapshot with six component signals and deltas
- Correlation engine panel for cross-signal reasoning
- 1h / 6h / 24h / 48h / 7d time windows
- Severity-coded event stream with source labels
- Command palette (`⌘K` / `Ctrl-K` style UI) for rapid navigation
- Responsive operations-room layout for mobile
- Public-source attribution language and non-classified positioning

## Run
```bash
npm install
npm run dev
```

## Benchmark
World Monitor is used as the product benchmark for map interaction, progressive intelligence panels, correlation-oriented presentation, country dossiers, event timelines and operational density. Its public site currently describes 56 map layers, 500+ curated feeds and 528+ providers. See https://www.worldmonitor.app/ and its open-source repository for reference.

## Next build phases
1. Live USGS earthquake + Open-Meteo weather adapters
2. GDELT/RSS news ingestion with source/time normalization
3. OpenSky aviation and AIS maritime adapters where access permits
4. NASA FIRMS / EONET / GDACS natural-event adapters
5. India/Latvia infrastructure and public-security datasets
6. Market radar for INR/EUR exposure, equities, energy and commodities
7. Transparent risk-scoring pipeline with historical baselines
8. AI country briefs with citations and local-model fallback
9. Watchlists, alert rules, historical playback and PWA caching
10. Server-side API layer for secrets, rate limits, normalization and feed health

All intelligence data should be source-attributed. This project does not copy proprietary World Monitor code or branding.
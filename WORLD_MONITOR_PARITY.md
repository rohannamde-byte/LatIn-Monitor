# World Monitor parity plan — LatIn Monitor

LatIn Monitor targets functional parity with the public World Monitor feature set, narrowed to India and Latvia. This is an implementation target, not a claim that every live connector is already wired.

## Core product surfaces

- [x] India / Latvia theater switching
- [x] MapLibre flat map
- [x] Globe projection foundation
- [x] Layer controls
- [x] Risk / signal panel
- [x] Event stream
- [ ] 3D globe engine with globe.gl / Three.js
- [ ] Full-screen map mode
- [ ] Saved views and dashboard tabs
- [ ] Watchlists
- [ ] Command palette with universal search
- [ ] Configurable panels / custom widgets
- [ ] Shareable URL state
- [ ] PWA / offline shell

## Intelligence and AI

- [x] Country risk concept
- [x] Signal correlation concept
- [ ] Country brief with citations
- [ ] World/theater brief
- [ ] AI situation analysis
- [ ] Focal-point detection
- [ ] Signal convergence scoring
- [ ] Scenario engine
- [ ] Forecast / prediction panel
- [ ] AI morning brief
- [ ] Flash alerts
- [ ] Local AI via Ollama
- [ ] Optional Groq / OpenRouter adapters
- [ ] Source-aware citations and freshness labels

## Map layer catalog

### Situation
- [x] Live events
- [ ] Protests / unrest
- [ ] Conflicts
- [ ] Natural disasters
- [ ] Humanitarian / displacement
- [ ] Health signals
- [ ] Focal points
- [ ] Signal convergence

### Security / military
- [x] Military activity
- [x] Military bases
- [ ] Exercises
- [ ] Air-defense / strategic systems
- [ ] Nuclear sites
- [ ] Missile / launch activity
- [ ] Border incidents
- [ ] GPS interference
- [ ] Cyber incidents / IOCs
- [ ] Sanctions
- [ ] Arms / procurement signals

### Aviation / maritime
- [x] Aviation
- [x] Maritime / AIS
- [ ] Live aircraft tracks
- [ ] Military aircraft
- [ ] Airports
- [ ] Ports
- [ ] Shipping density
- [ ] Dark-fleet signals
- [ ] Chokepoints
- [ ] Canal / strait status

### Infrastructure / supply chain
- [x] Power assets
- [ ] Power plants
- [ ] Grid outages
- [ ] Oil / gas pipelines
- [ ] LNG terminals
- [ ] Refineries
- [ ] Subsea cables
- [ ] Telecom infrastructure
- [ ] Rail
- [ ] Roads / corridors
- [ ] Warehouses / logistics hubs
- [ ] Data centers
- [ ] Semiconductor / strategic industry
- [ ] Critical minerals
- [ ] Strategic infrastructure exposure

### Physical / climate
- [x] Severe weather
- [x] Fires
- [x] Earthquakes
- [ ] Floods
- [ ] Storms / cyclones
- [ ] Heat / cold anomalies
- [ ] Air quality
- [ ] Drought / water stress
- [ ] Volcanic activity
- [ ] Satellite / remote sensing
- [ ] SAR / imagery hooks

### Finance / economy
- [ ] Equity indices
- [ ] Country equities
- [ ] FX
- [ ] Commodities
- [ ] Crypto
- [ ] Rates / bonds
- [ ] GDP
- [ ] Inflation
- [ ] Interest rates
- [ ] Central banks
- [ ] Trade / tariffs
- [ ] Consumer prices
- [ ] Market risk composite
- [ ] Finance radar

## News and sources

- [ ] 500+ feed architecture adapted to India / Latvia
- [ ] RSS / Atom ingestion
- [ ] GDELT ingestion
- [ ] Government / institutional feeds
- [ ] Local-language feeds
- [ ] News deduplication
- [ ] Story clustering
- [ ] Entity extraction
- [ ] Source reliability metadata
- [ ] Freshness monitoring
- [ ] AI-synthesized news intelligence
- [ ] Citation-preserving briefs

## India theater specialization

- [ ] India–Pakistan border / security
- [ ] India–China / LAC
- [ ] Indian Ocean
- [ ] Arabian Sea
- [ ] Bay of Bengal
- [ ] Andaman & Nicobar
- [ ] Major ports / shipping lanes
- [ ] Energy corridors
- [ ] Nuclear / strategic infrastructure
- [ ] State-level event filtering
- [ ] Monsoon / cyclone monitoring
- [ ] INR / NSE / BSE / commodities

## Latvia theater specialization

- [ ] Russia / Latvia border
- [ ] Belarus / Latvia border
- [ ] Baltic Sea
- [ ] Gulf of Riga
- [ ] NATO / Baltic regional activity
- [ ] Air-policing / aviation
- [ ] Energy interconnectors
- [ ] Rail Baltica
- [ ] Ports / shipping
- [ ] Subsea infrastructure
- [ ] Cyber resilience
- [ ] EUR / Baltic markets
- [ ] Baltic regional news clustering

## Alerts and automation

- [ ] Layer-based alerts
- [ ] Geographic radius alerts
- [ ] Threshold alerts
- [ ] Multi-signal convergence alerts
- [ ] Watchlist alerts
- [ ] Email delivery
- [ ] Telegram delivery
- [ ] Slack / webhook delivery
- [ ] Daily / twice-daily AI digest
- [ ] Alert history

## Developer / agent surface

- [ ] REST API
- [ ] Webhooks
- [ ] MCP server
- [ ] Tool discovery
- [ ] Country-risk tool
- [ ] Country-brief tool
- [ ] Market tool
- [ ] Conflict tool
- [ ] Disaster tool
- [ ] Maritime tool
- [ ] Aviation tool
- [ ] News-intelligence tool
- [ ] Forecast tool
- [ ] Situation-analysis tool
- [ ] Bulk JSON / CSV export

## Deployment / clients

- [ ] GitHub Pages web deployment
- [ ] PWA installability
- [ ] Vercel / edge deployment option
- [ ] Docker self-hosting
- [ ] Tauri desktop wrapper
- [ ] macOS Intel support
- [ ] macOS Apple Silicon support
- [ ] Windows / Linux support
- [ ] Responsive mobile UI
- [ ] SOC-wall / large-screen layout

## Data architecture

1. Public-source collectors ingest raw events.
2. Normalizers convert sources to a common signal schema.
3. Geographic resolver assigns India/Latvia regions and nearby theaters.
4. Deduplication and clustering create canonical events.
5. Freshness and source-quality metadata travel with every event.
6. A correlation engine combines independent signal domains.
7. Risk scoring produces explainable country/theater scores.
8. The UI renders map layers, timelines, briefs, alerts and watchlists.
9. AI receives structured, cited signals rather than unverified prose.

## Important licensing note

World Monitor's current source repository is AGPL-3.0-only. LatIn Monitor should not copy source code, branding, or proprietary assets unless the project is intentionally distributed under the applicable license. The benchmark is used for feature and architecture reference; our implementation should remain independently authored unless we deliberately adopt AGPL code and comply with its obligations.

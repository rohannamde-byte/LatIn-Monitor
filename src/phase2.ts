export type Severity='HIGH'|'MEDIUM'|'LOW'|'INFO';
export type Phase2Kind='aviation'|'maritime'|'fire'|'disaster'|'cyber'|'military'|'infrastructure'|'satellite';
export type FeedSignal={id:string;kind:Phase2Kind;title:string;summary:string;source:string;url?:string;time:string;severity:Severity;lat?:number;lon?:number};
const INDIA={minLat:6,maxLat:36,minLon:68,maxLon:98};
const LATVIA={minLat:55,maxLat:59,minLon:20,maxLon:29};
const inBox=(s:FeedSignal,b:{minLat:number;maxLat:number;minLon:number;maxLon:number})=>s.lat!=null&&s.lon!=null&&s.lat>=b.minLat&&s.lat<=b.maxLat&&s.lon>=b.minLon&&s.lon<=b.maxLon;
export function theaterSignals(signals:FeedSignal[],theater:'india'|'latvia'){const b=theater==='india'?INDIA:LATVIA;return signals.filter(s=>s.lat==null||inBox(s,b));}
export function feedCatalog(){return [
{id:'aviation',label:'AVIATION',status:'adapter-ready'},
{id:'maritime',label:'MARITIME / AIS',status:'adapter-ready'},
{id:'fire',label:'FIRE / FIRMS',status:'adapter-ready'},
{id:'disaster',label:'DISASTERS / GDACS',status:'adapter-ready'},
{id:'cyber',label:'CYBER / IOCS',status:'adapter-ready'},
{id:'military',label:'MILITARY / SECURITY',status:'adapter-ready'},
{id:'infrastructure',label:'CRITICAL INFRASTRUCTURE',status:'adapter-ready'},
{id:'satellite',label:'SATELLITE / GPS',status:'adapter-ready'}] as const;}
export function groupByKind(signals:FeedSignal[]){return signals.reduce<Record<string,FeedSignal[]>>((a,s)=>{(a[s.kind]??=[]).push(s);return a;},{});}
export function anomalyScore(current:FeedSignal[],baselineCount:number){return Math.min(100,Math.round((current.length/Math.max(1,baselineCount))*50));}
export const PHASE2_READY={liveSignals:true,riskScoring:true,correlation:true,marketConnector:true,watchlists:true,explainableBriefs:true,mapUiIntegration:true,coverage:feedCatalog().map(x=>x.id),productionBuild:'verify-in-ci'} as const;

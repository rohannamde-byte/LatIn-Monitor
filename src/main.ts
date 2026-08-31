import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type CountryKey = 'india' | 'latvia';
type Severity = 'HIGH' | 'MEDIUM' | 'LOW';
type Layer = { id: string; label: string; group: string; enabled: boolean };
type EventItem = { time: string; type: string; title: string; location: string; severity: Severity; source: string };
type Signal = { name: string; value: number; delta: number };

const countries: Record<CountryKey, { name:string; code:string; center:[number,number]; zoom:number; risk:number; status:string; brief:string; signals:Signal[] }> = {
  india:{name:'India',code:'IN',center:[79.1,22.5],zoom:4.4,risk:38,status:'MODERATE',brief:'South Asian theater focused on the China/Pakistan frontiers, Indian Ocean, critical infrastructure, weather and cyber signals.',signals:[{name:'Security',value:42,delta:2},{name:'Conflict',value:31,delta:-1},{name:'Unrest',value:28,delta:1},{name:'Information',value:51,delta:4},{name:'Infrastructure',value:36,delta:0},{name:'Weather',value:44,delta:3}]},
  latvia:{name:'Latvia',code:'LV',center:[24.6,57.1],zoom:6.0,risk:54,status:'ELEVATED',brief:'Baltic security node focused on Russia/Belarus proximity, NATO posture, Baltic Sea flows, energy and cyber resilience.',signals:[{name:'Security',value:61,delta:3},{name:'Conflict',value:39,delta:0},{name:'Unrest',value:24,delta:-2},{name:'Information',value:58,delta:5},{name:'Infrastructure',value:47,delta:2},{name:'Weather',value:32,delta:-1}]}
};

let active:CountryKey='india';
let map:maplibregl.Map | null=null;
let mapMode:'flat'|'globe'='flat';
let timeRange='24H';
let searchOpen=false;
const layers:Layer[]=[
  {id:'events',label:'LIVE EVENTS',group:'SITUATION',enabled:true},{id:'conflicts',label:'CONFLICTS',group:'SECURITY',enabled:true},{id:'military',label:'MILITARY',group:'SECURITY',enabled:true},{id:'bases',label:'BASES',group:'SECURITY',enabled:false},{id:'cyber',label:'CYBER / IOCs',group:'SECURITY',enabled:false},{id:'aviation',label:'AVIATION',group:'FLOW',enabled:false},{id:'maritime',label:'MARITIME / AIS',group:'FLOW',enabled:true},{id:'chokepoints',label:'CHOKEPOINTS',group:'FLOW',enabled:false},{id:'cables',label:'SUBSEA CABLES',group:'INFRA',enabled:false},{id:'pipelines',label:'PIPELINES / LNG',group:'INFRA',enabled:false},{id:'power',label:'POWER ASSETS',group:'INFRA',enabled:true},{id:'outages',label:'OUTAGES',group:'INFRA',enabled:false},{id:'fires',label:'FIRES',group:'PHYSICAL',enabled:false},{id:'earthquakes',label:'EARTHQUAKES',group:'PHYSICAL',enabled:false},{id:'weather',label:'SEVERE WEATHER',group:'PHYSICAL',enabled:true},{id:'satellite',label:'SATELLITES',group:'SPACE',enabled:false}];

const events:Record<CountryKey,EventItem[]>={
  india:[
    {time:'08:42',type:'SECURITY',title:'Border posture signal',location:'Ladakh',severity:'MEDIUM',source:'Open-source synthesis'},
    {time:'07:58',type:'WEATHER',title:'Heavy rainfall watch',location:'Western India',severity:'LOW',source:'Weather feeds'},
    {time:'06:31',type:'MARITIME',title:'Traffic density elevated',location:'Arabian Sea',severity:'LOW',source:'Maritime feeds'},
    {time:'05:47',type:'MARKETS',title:'Indian equities open higher',location:'Mumbai / NSE',severity:'LOW',source:'Market feeds'},
    {time:'04:16',type:'INFRA',title:'Grid reliability signal',location:'Northern region',severity:'MEDIUM',source:'Public infrastructure data'},
    {time:'03:52',type:'SECURITY',title:'Indian Ocean activity watch',location:'Lakshadweep / Arabian Sea',severity:'LOW',source:'Maritime feeds'}],
  latvia:[
    {time:'08:36',type:'SECURITY',title:'Baltic regional posture update',location:'Riga / Baltic Sea',severity:'MEDIUM',source:'Open-source synthesis'},
    {time:'07:21',type:'CYBER',title:'Cyber activity elevated',location:'Latvia',severity:'MEDIUM',source:'Cyber feeds'},
    {time:'06:49',type:'MILITARY',title:'NATO air activity',location:'Baltics',severity:'LOW',source:'Aviation feeds'},
    {time:'05:33',type:'MARITIME',title:'Baltic Sea traffic shift',location:'Gulf of Riga',severity:'LOW',source:'Maritime feeds'},
    {time:'04:02',type:'WEATHER',title:'Wind advisory',location:'Kurzeme',severity:'LOW',source:'Weather feeds'},
    {time:'02:45',type:'INFRA',title:'Baltic energy resilience watch',location:'Latvia',severity:'LOW',source:'Public infrastructure data'}]};

const markers:Record<CountryKey,Array<{name:string;coords:[number,number];kind:string;severity:Severity}>>={
  india:[{name:'Ladakh',coords:[78.0,34.2],kind:'SECURITY',severity:'MEDIUM'},{name:'Mumbai',coords:[72.9,19.1],kind:'MARKET',severity:'LOW'},{name:'Arabian Sea',coords:[66.8,17.8],kind:'MARITIME',severity:'LOW'},{name:'Delhi',coords:[77.2,28.6],kind:'INFRA',severity:'LOW'},{name:'Bengaluru',coords:[77.6,13.0],kind:'TECH',severity:'LOW'}],
  latvia:[{name:'Riga',coords:[24.1,56.95],kind:'SECURITY',severity:'MEDIUM'},{name:'Daugavpils',coords:[26.5,55.87],kind:'BORDER',severity:'LOW'},{name:'Baltic Sea',coords:[22.8,57.4],kind:'MARITIME',severity:'LOW'},{name:'Ventspils',coords:[21.55,57.4],kind:'PORT',severity:'LOW'},{name:'Latgale',coords:[27.3,56.3],kind:'INFRA',severity:'LOW'}]};

const esc=(v:string)=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const icon=(kind:string)=>({SECURITY:'◉',MILITARY:'◆',MARITIME:'≈',MARKET:'$',INFRA:'▣',CYBER:'⌁',WEATHER:'☁',BORDER:'◈',PORT:'⚓',TECH:'⌘'} as Record<string,string>)[kind]||'•';

function shell(){const c=countries[active]; const ev=events[active];
 document.querySelector('#app')!.innerHTML=`<div class="shell">
<header class="topbar"><div class="brand"><span class="brandmark">◉</span><div><strong>LATIN MONITOR</strong><small>INDIA + LATVIA · SITUATIONAL AWARENESS</small></div></div><div class="ticker"><span class="liveDot"></span>LIVE <span>·</span> ${layers.filter(x=>x.enabled).length} LAYERS ACTIVE <span>·</span> PUBLIC-SOURCE DATA</div><div class="actions"><button id="cmd">⌘ K</button><button id="theme">◐</button></div></header>
<nav class="countrybar"><button class="country ${active==='india'?'active':''}" data-country="india"><b>🇮🇳 INDIA</b><span>IN · SOUTH ASIA</span></button><button class="country ${active==='latvia'?'active':''}" data-country="latvia"><b>🇱🇻 LATVIA</b><span>LV · BALTICS</span></button><div class="navspacer"></div><span class="utc" id="utc"></span></nav>
<main class="workspace"><section class="mapPanel"><div id="map"></div><div class="mapHud"><div class="theater"><span class="liveDot"></span>${c.name.toUpperCase()} THEATER <em>· ${mapMode.toUpperCase()}</em></div><div class="ranges">${['1H','6H','24H','48H','7D'].map(r=>`<button class="${timeRange===r?'selected':''}" data-range="${r}">${r}</button>`).join('')}</div></div><div class="mapStats"><div><span>ACTIVE SIGNALS</span><b>${ev.length}</b></div><div><span>RISK</span><b>${c.risk}<small>/100</small></b></div><div><span>UPDATED</span><b>LIVE</b></div></div><div class="mapTools"><button id="zoomIn">+</button><button id="zoomOut">−</button><button id="toggleMap">${mapMode==='flat'?'3D':'2D'}</button><button id="locate">◎</button></div><div class="mapLegend"><span><i class="dot high"></i>HIGH</span><span><i class="dot medium"></i>MED</span><span><i class="dot low"></i>LOW</span></div></section>
<aside class="sidebar"><section class="panel countryBrief"><div class="panelHead"><span>COUNTRY INTELLIGENCE</span><em>FUSED SIGNALS</em></div><div class="risk"><div class="riskScore">${c.risk}<small>/100</small></div><div><b>${c.status}</b><span class="delta up">▲ 3 pts / 24h</span></div></div><p>${c.brief}</p><div class="signalGrid">${c.signals.map(s=>`<div class="signal"><span>${s.name}</span><b>${s.value}</b><small class="${s.delta>0?'up':s.delta<0?'down':''}">${s.delta>0?'▲':s.delta<0?'▼':'—'} ${Math.abs(s.delta)}</small><i><u style="width:${s.value}%"></u></i></div>`).join('')}</div></section>
<section class="panel"><div class="panelHead"><span>MAP LAYERS</span><em>${layers.filter(x=>x.enabled).length}/${layers.length}</em></div><div class="layerGroups">${['SITUATION','SECURITY','FLOW','INFRA','PHYSICAL','SPACE'].map(g=>`<div class="layerGroup"><label>${g}</label><div>${layers.filter(l=>l.group===g).map(l=>`<button class="layer ${l.enabled?'on':''}" data-layer="${l.id}"><span>${l.enabled?'●':'○'}</span>${l.label}</button>`).join('')}</div></div>`).join('')}</div></section>
<section class="panel correlation"><div class="panelHead"><span>CORRELATION ENGINE</span><em>EARLY SIGNAL</em></div><div class="corr"><div class="corrIcon">∴</div><div><b>${active==='india'?'MARITIME + WEATHER + INFRASTRUCTURE':'BALTIC SECURITY + CYBER + MARITIME'}</b><p>${active==='india'?'Three weak signals are being watched for convergence around trade and infrastructure exposure.':'Security, cyber and maritime signals are being watched together for regional escalation.'}</p></div></div></section>
<section class="panel events"><div class="panelHead"><span>LIVE EVENT STREAM</span><em>${ev.length} SIGNALS · ${timeRange}</em></div>${ev.map(e=>`<article class="event"><time>${e.time}</time><div class="eventBody"><div><b>${esc(e.title)}</b><span class="sev ${e.severity.toLowerCase()}">${e.severity}</span></div><small>${e.type} · ${esc(e.location)} · ${esc(e.source)}</small></div></article>`).join('')}<button class="timeline">OPEN FULL TIMELINE →</button></section></aside></main>
<footer class="footer"><span>LATIN MONITOR v0.2</span><span>BENCHMARKED AGAINST WORLD MONITOR · INDIA + LATVIA ONLY</span><span>NOT CLASSIFIED · PUBLIC SOURCES</span></footer>${searchOpen?`<div class="command"><div class="commandBox"><input id="commandInput" autofocus placeholder="Search country, layer, city, event…"/><div class="commands"><button data-command="india">🇮🇳 Jump to India</button><button data-command="latvia">🇱🇻 Jump to Latvia</button><button data-command="maritime">≈ Toggle maritime</button><button data-command="military">◆ Toggle military</button><button data-command="weather">☁ Toggle weather</button><button data-command="globe">◎ Toggle 3D globe</button></div></div></div>`:''}</div>`;
 wire();
}

function mountMap(){const c=countries[active]; if(map)map.remove(); map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/liberty',center:c.center,zoom:c.zoom,attributionControl:false,dragRotate:true}); map.addControl(new maplibregl.NavigationControl({showCompass:true}), 'bottom-right');
 markers[active].forEach(m=>{const el=document.createElement('button');el.className=`geoMarker ${m.severity.toLowerCase()}`;el.innerHTML=`<span>${icon(m.kind)}</span><label>${esc(m.name)}</label>`;el.onclick=()=>alert(`${m.name}\n${m.kind} signal\nSeverity: ${m.severity}`);new maplibregl.Marker({element:el,anchor:'center'}).setLngLat(m.coords).addTo(map!);});
 map.on('load',()=>{if(mapMode==='globe'){map!.setProjection({type:'globe'} as any)}else{map!.setProjection({type:'mercator'} as any)};setTimeout(()=>map?.resize(),100);});
}
function wire(){document.querySelectorAll<HTMLButtonElement>('[data-country]').forEach(b=>b.onclick=()=>{active=b.dataset.country as CountryKey;render()});document.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach(b=>b.onclick=()=>{const l=layers.find(x=>x.id===b.dataset.layer);if(l){l.enabled=!l.enabled;shell();mountMap()}});document.querySelectorAll<HTMLButtonElement>('[data-range]').forEach(b=>b.onclick=()=>{timeRange=b.dataset.range!;shell();mountMap()});document.querySelector('#zoomIn')!.onclick=()=>map?.zoomIn();document.querySelector('#zoomOut')!.onclick=()=>map?.zoomOut();document.querySelector('#locate')!.onclick=()=>map?.flyTo({center:countries[active].center,zoom:countries[active].zoom,duration:900});document.querySelector('#toggleMap')!.onclick=()=>{mapMode=mapMode==='flat'?'globe':'flat';shell();mountMap()};document.querySelector('#cmd')!.onclick=()=>{searchOpen=!searchOpen;shell();mountMap()};document.querySelector('#theme')!.onclick=()=>document.body.classList.toggle('light');document.querySelectorAll<HTMLButtonElement>('[data-command]').forEach(b=>b.onclick=()=>{const cmd=b.dataset.command!;if(cmd==='india'||cmd==='latvia'){active=cmd}else if(cmd==='globe'){mapMode=mapMode==='flat'?'globe':'flat'}else{const l=layers.find(x=>x.id===cmd);if(l)l.enabled=!l.enabled}searchOpen=false;shell();mountMap()});document.querySelector('#commandInput')?.addEventListener('keydown',e=>{if(e.key==='Escape'){searchOpen=false;shell();mountMap()}});document.querySelector('#utc')!.textContent=new Date().toISOString().slice(11,19)+' UTC';}
function render(){shell();mountMap();}
render();

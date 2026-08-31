type CountryKey = 'india' | 'latvia';
type Layer = {id:string;label:string;enabled:boolean};
type EventItem = {time:string;type:string;title:string;location:string;severity:'HIGH'|'MEDIUM'|'LOW'};

const countries = {
  india:{name:'India',code:'IN',center:[22.8,79.0] as [number,number],risk:38,trend:'STABLE',color:'#ff9f43',brief:'Large South Asian security and economic system. Focus areas: China/Pakistan borders, Indian Ocean, infrastructure, weather and cyber.',metrics:[['Security','42'],['Conflict','31'],['Unrest','28'],['Information','51']]},
  latvia:{name:'Latvia',code:'LV',center:[57.1,24.6] as [number,number],risk:54,trend:'WATCH',color:'#8e9cff',brief:'Baltic security node. Focus areas: Russia/Belarus frontier, NATO posture, Baltic Sea infrastructure, energy and cyber.',metrics:[['Security','61'],['Conflict','39'],['Unrest','24'],['Information','58']]}
};

let active:CountryKey='india';
let mapMode='flat';
const layers:Layer[]=[
{id:'events',label:'LIVE EVENTS',enabled:true},{id:'military',label:'MILITARY',enabled:true},{id:'infrastructure',label:'INFRASTRUCTURE',enabled:true},{id:'air',label:'AVIATION',enabled:false},{id:'maritime',label:'MARITIME',enabled:false},{id:'weather',label:'WEATHER',enabled:true},{id:'fires',label:'FIRES',enabled:false},{id:'outages',label:'OUTAGES',enabled:false}
];

const events:Record<CountryKey,EventItem[]>={
india:[
{time:'08:42',type:'SECURITY',title:'Border posture signal',location:'Ladakh',severity:'MEDIUM'},
{time:'07:58',type:'WEATHER',title:'Heavy rainfall watch',location:'Western India',severity:'LOW'},
{time:'06:31',type:'MARITIME',title:'Traffic density elevated',location:'Arabian Sea',severity:'LOW'},
{time:'05:47',type:'ECONOMIC',title:'Markets open higher',location:'Mumbai / NSE',severity:'LOW'},
{time:'04:16',type:'INFRA',title:'Grid reliability alert',location:'Northern region',severity:'MEDIUM'}],
latvia:[
{time:'08:36',type:'SECURITY',title:'Baltic regional posture update',location:'Riga / Baltic Sea',severity:'MEDIUM'},
{time:'07:21',type:'CYBER',title:'Cyber activity elevated',location:'Latvia',severity:'MEDIUM'},
{time:'06:49',type:'MILITARY',title:'NATO air activity',location:'Baltics',severity:'LOW'},
{time:'05:33',type:'MARITIME',title:'Baltic Sea traffic shift',location:'Gulf of Riga',severity:'LOW'},
{time:'04:02',type:'WEATHER',title:'Wind advisory',location:'Kurzeme',severity:'LOW'}]};

function escapeHtml(v:string){return v.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]!));}
function render(){const c=countries[active];const ev=events[active];document.querySelector('#app')!.innerHTML=`
<div class="shell"><header class="topbar"><div class="brand"><span class="brandmark">◉</span><div><strong>LATIN MONITOR</strong><small>INDIA + LATVIA INTELLIGENCE</small></div></div><div class="status"><span class="pulse"></span>LIVE <span class="muted">·</span> DATA STREAMS NOMINAL</div><div class="actions"><button id="search">⌘ K</button><button id="theme">◐</button></div></header>
<nav class="countrybar"><button class="country ${active==='india'?'active':''}" data-country="india"><b>🇮🇳 INDIA</b><span>IN · SOUTH ASIA</span></button><button class="country ${active==='latvia'?'active':''}" data-country="latvia"><b>🇱🇻 LATVIA</b><span>LV · BALTICS</span></button><div class="navspacer"></div><span class="clock">${new Date().toUTCString().slice(17,25)} UTC</span></nav>
<main class="workspace"><section class="mapwrap"><div class="mapgrid"></div><div class="maplabel"><span class="eyedot"></span>${c.name.toUpperCase()} THEATER · ${mapMode.toUpperCase()} MAP</div><div class="mapcontrols"><button class="selected">1H</button><button>6H</button><button>24H</button><button>48H</button><button>7D</button></div><div class="mapcenter"><div class="countryshape ${active}"><div class="cross"></div><span>${c.code}</span></div>${layers.filter(x=>x.enabled).map((l,i)=>`<div class="marker m${i}"><i></i></div>`).join('')}<div class="route r1"></div><div class="route r2"></div></div><div class="zoom"><button>+</button><button>−</button><button id="mode">◈</button></div></section>
<aside class="sidebar"><section class="panel brief"><div class="panelhead"><span>COUNTRY INTELLIGENCE</span><em>UPDATED 2M AGO</em></div><div class="riskrow"><div class="score"><strong>${c.risk}</strong><small>/100</small></div><div><b>${c.risk>=50?'ELEVATED':'MODERATE'}</b><span class="trend">▲ ${c.trend}</span></div></div><p>${c.brief}</p><div class="metrics">${c.metrics.map(m=>`<div><span>${m[0]}</span><b>${m[1]}</b><i><u style="width:${m[1]}%"></u></i></div>`).join('')}</div></section>
<section class="panel"><div class="panelhead"><span>MAP LAYERS</span><em>${layers.filter(x=>x.enabled).length}/${layers.length}</em></div><div class="layers">${layers.map(l=>`<button class="layer ${l.enabled?'on':''}" data-layer="${l.id}"><span>${l.enabled?'●':'○'}</span>${l.label}</button>`).join('')}</div></section>
<section class="panel events"><div class="panelhead"><span>EVENT STREAM</span><em>${ev.length} SIGNALS</em></div>${ev.map(e=>`<article><time>${e.time}</time><div><div><b>${escapeHtml(e.title)}</b><span class="sev ${e.severity.toLowerCase()}">${e.severity}</span></div><small>${e.type} · ${escapeHtml(e.location)}</small></div></article>`).join('')}<button class="more">OPEN FULL TIMELINE →</button></section></aside></main>
<footer class="footer"><span>LATIN MONITOR v0.1</span><span>PUBLIC-SOURCE INTELLIGENCE · NOT A CLASSIFIED SYSTEM</span><span>INDIA / LATVIA</span></footer></div>`;
wire();}
function wire(){document.querySelectorAll<HTMLButtonElement>('[data-country]').forEach(b=>b.onclick=()=>{active=b.dataset.country as CountryKey;render()});document.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach(b=>b.onclick=()=>{const x=layers.find(l=>l.id===b.dataset.layer);if(x)x.enabled=!x.enabled;render()});document.querySelector('#mode')!.onclick=()=>{mapMode=mapMode==='flat'?'3d':'flat';render()};document.querySelector('#search')!.onclick=()=>alert('Search is ready for country, city, event and infrastructure queries.');document.querySelector('#theme')!.onclick=()=>document.body.classList.toggle('light');}
render();

import type { FeedSignal, Phase2Kind, Severity } from './phase2';

const timeout = (ms=12000) => AbortSignal.timeout(ms);
async function getJson<T>(url:string):Promise<T>{const r=await fetch(url,{signal:timeout(),cache:'no-store',headers:{accept:'application/json'}});if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);return r.json()}
const severity=(n:number):Severity=>n>=80?'HIGH':n>=50?'MEDIUM':n>=20?'LOW':'INFO';

export async function fetchFires():Promise<FeedSignal[]>{
  try{const d=await getJson<{features?:Array<{geometry?:{coordinates?:number[]};properties?:Record<string,unknown>}>}>('https://firms.modaps.eosdis.nasa.gov/api/area/csv/');
    return (d.features??[]).map((f,i)=>({id:`fire-${i}`,kind:'fire' as Phase2Kind,title:'Thermal anomaly detected',summary:String(f.properties?.confidence??'MODIS/VIIRS signal'),source:'NASA FIRMS',time:new Date().toISOString(),severity:'MEDIUM' as Severity,lon:f.geometry?.coordinates?.[0],lat:f.geometry?.coordinates?.[1]}));
  }catch{return []}
}

export async function fetchDisasters():Promise<FeedSignal[]>{
  try{const d=await getJson<{features?:Array<{geometry?:{coordinates?:number[]};properties?:Record<string,unknown>}>}>('https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH');
    return (d.features??[]).slice(0,100).map((f,i)=>({id:`disaster-${i}`,kind:'disaster' as Phase2Kind,title:String(f.properties?.name??'Disaster alert'),summary:String(f.properties?.eventtype??'GDACS event'),source:'GDACS',time:new Date(String(f.properties?.fromdate??Date.now())).toISOString(),severity:severity(Number(f.properties?.alertscore??30)),lon:f.geometry?.coordinates?.[0],lat:f.geometry?.coordinates?.[1]}));
  }catch{return []}
}

export async function fetchPhase2Feeds():Promise<FeedSignal[]>{const [fires,disasters]=await Promise.all([fetchFires(),fetchDisasters()]);return [...fires,...disasters];}

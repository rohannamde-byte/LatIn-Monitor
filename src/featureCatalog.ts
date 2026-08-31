export type FeatureStatus = 'live' | 'planned' | 'adapter-required';

export type MonitorFeature = {
  id: string;
  label: string;
  group: string;
  status: FeatureStatus;
  india: boolean;
  latvia: boolean;
};

/** Functional feature catalog used by the UI and future data adapters. */
export const monitorFeatures: MonitorFeature[] = [
  ['events','Live events','Situation','live'],
  ['unrest','Protests / unrest','Situation','planned'],
  ['conflicts','Conflicts','Security','live'],
  ['military','Military activity','Security','live'],
  ['bases','Military bases','Security','planned'],
  ['exercises','Exercises','Security','planned'],
  ['border','Border incidents','Security','planned'],
  ['cyber','Cyber / IOCs','Security','planned'],
  ['sanctions','Sanctions','Security','planned'],
  ['nuclear','Nuclear / strategic','Security','planned'],
  ['aviation','Aviation','Aviation','live'],
  ['airports','Airports','Aviation','planned'],
  ['maritime','Maritime / AIS','Maritime','live'],
  ['ports','Ports','Maritime','planned'],
  ['chokepoints','Chokepoints','Maritime','planned'],
  ['shipping','Shipping density','Maritime','planned'],
  ['cables','Subsea cables','Infrastructure','planned'],
  ['pipelines','Pipelines / LNG','Infrastructure','live'],
  ['power','Power assets','Infrastructure','live'],
  ['outages','Outages','Infrastructure','planned'],
  ['rail','Rail / logistics','Infrastructure','planned'],
  ['roads','Road corridors','Infrastructure','planned'],
  ['datacenters','Data centers','Infrastructure','planned'],
  ['industry','Strategic industry','Infrastructure','planned'],
  ['fires','Fires','Physical','live'],
  ['earthquakes','Earthquakes','Physical','live'],
  ['floods','Floods','Physical','planned'],
  ['storms','Storms / cyclones','Physical','planned'],
  ['weather','Severe weather','Physical','live'],
  ['heat','Heat / cold anomalies','Physical','planned'],
  ['drought','Water stress','Physical','planned'],
  ['satellite','Satellite / remote sensing','Space','planned'],
  ['sar','SAR imagery','Space','adapter-required'],
  ['equities','Equity markets','Finance','planned'],
  ['fx','FX','Finance','planned'],
  ['commodities','Commodities','Finance','planned'],
  ['crypto','Crypto','Finance','planned'],
  ['rates','Rates / bonds','Finance','planned'],
  ['gdp','GDP / growth','Economy','planned'],
  ['inflation','Inflation','Economy','planned'],
  ['central-banks','Central banks','Economy','planned'],
  ['tariffs','Trade / tariffs','Economy','planned'],
  ['health','Health signals','Humanitarian','planned'],
  ['displacement','Displacement','Humanitarian','planned'],
  ['news','News intelligence','News','planned'],
  ['focal-points','Focal points','Intelligence','planned'],
  ['convergence','Signal convergence','Intelligence','planned'],
  ['forecast','Forecasts','Intelligence','planned'],
  ['prediction-markets','Prediction markets','Intelligence','planned'],
  ['watchlists','Watchlists','Workflow','planned'],
  ['alerts','Alert rules','Workflow','planned'],
  ['briefs','AI briefs','AI','planned'],
  ['scenario','Scenario engine','AI','planned'],
  ['analyst','AI analyst','AI','planned'],
  ['mcp','MCP / agent API','Developer','planned'],
  ['rest','REST API','Developer','planned'],
  ['exports','CSV / JSON export','Developer','planned'],
] .map(([id,label,group,status]) => ({
  id, label, group, status,
  india: true,
  latvia: true,
} as MonitorFeature));

export const INDIA_FOCUS = [
  'India–Pakistan border', 'India–China / LAC', 'Indian Ocean',
  'Arabian Sea', 'Bay of Bengal', 'Andaman & Nicobar',
  'major ports', 'energy corridors', 'strategic infrastructure',
  'monsoon / cyclone risk', 'NSE / BSE / INR'
];

export const LATVIA_FOCUS = [
  'Russia / Latvia border', 'Belarus / Latvia border', 'Baltic Sea',
  'Gulf of Riga', 'NATO / Baltic activity', 'Baltic air policing',
  'energy interconnectors', 'Rail Baltica', 'ports / shipping',
  'subsea infrastructure', 'cyber resilience', 'EUR / Baltic markets'
];

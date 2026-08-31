import type { Theater } from './signals';

export const THEATERS: Record<Theater, { center: [number, number]; zoom: number; regions: string[]; priorities: string[] }> = {
  india: {
    center: [79.1, 22.5], zoom: 4.4,
    regions: ['Ladakh', 'Jammu & Kashmir', 'Punjab', 'Rajasthan', 'Gujarat', 'Mumbai', 'Kochi', 'Chennai', 'Kolkata', 'Andaman & Nicobar'],
    priorities: ['India-Pakistan border', 'India-China LAC', 'Indian Ocean', 'Arabian Sea', 'Bay of Bengal', 'energy corridors', 'strategic infrastructure', 'NSE/BSE']
  },
  latvia: {
    center: [24.6, 57.1], zoom: 6,
    regions: ['Riga', 'Kurzeme', 'Vidzeme', 'Zemgale', 'Latgale', 'Ventspils', 'Liepaja', 'Daugavpils'],
    priorities: ['Russia border', 'Belarus border', 'Baltic Sea', 'Gulf of Riga', 'NATO Baltic region', 'air policing', 'energy interconnectors', 'Rail Baltica', 'subsea infrastructure']
  }
};

export const LAYERS = [
  'events','protests','conflicts','disasters','health','focal-points','military','bases','exercises','air-defense','nuclear','missiles','border-incidents','gps-interference','cyber','sanctions','aviation','military-aircraft','airports','maritime','ports','shipping-density','dark-fleet','chokepoints','cables','pipelines','lng','power','grid-outages','rail','roads','logistics','datacenters','strategic-industry','critical-minerals','fires','earthquakes','floods','storms','heat-cold','air-quality','drought','volcanoes','satellite','sar','equities','fx','commodities','crypto','rates','central-banks','trade','finance-radar'
] as const;

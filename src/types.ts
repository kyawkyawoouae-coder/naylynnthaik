export type ScenarioId = "green" | "middle" | "fossil";

export interface ClimateScenario {
  id: ScenarioId;
  name: string;
  ipccCode: string;
  tagline: string;
  tempAnomaly: number; // in Celsius e.g. 1.7
  seaLevelRiseMeters: number; // e.g. 0.45
  co2Ppm: number; // e.g. 390
  globalPopulationBillion: number; // e.g. 8.8
  cleanEnergyShare: number; // e.g. 98%
  arcticSummerIce: "Intact / Recovered" | "Nearly Ice-Free" | "Completely Extinct";
  climateMigrantsMillions: number;
  description: string;
  primaryColor: string;
  accentColor: string;
}

export interface Hotspot {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  category: "megacity" | "tipping-point" | "innovation" | "ecology";
  year2100Summary: {
    green: string;
    middle: string;
    fossil: string;
  };
  population2100?: {
    current: string;
    projected: string;
  };
  keyThreats: string[];
  breakthroughs: string[];
  statusTag: string;
}

export interface YearMetricSnapshot {
  year: number;
  co2Ppm: Record<ScenarioId, number>;
  tempAnomaly: Record<ScenarioId, number>;
  seaLevelRiseCm: Record<ScenarioId, number>;
  worldPopBillion: Record<ScenarioId, number>;
  renewableSharePct: Record<ScenarioId, number>;
}

export interface CitySimulationResult {
  city: string;
  climateZone?: string;
  temperatureChange: string;
  seaLevelImpact: string;
  populationOutlook: string;
  extremeWeatherRisks?: string[];
  keyAdaptations: string[];
  dailyLifeSnapshot: string;
  waterAndFood?: string;
  notableLandmarkTransformation?: string;
  fallback?: boolean;
}

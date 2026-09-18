import React, { useState } from "react";
import { ScenarioId, CitySimulationResult } from "../types";
import {
  Sparkles,
  Search,
  Building,
  Thermometer,
  Droplets,
  Users,
  Compass,
  Loader2,
  RefreshCw,
  Landmark,
  ShieldAlert,
} from "lucide-react";

interface CitySimulationInspectorProps {
  scenario: ScenarioId;
  year: number;
  initialCity?: string;
}

const PRESET_CITIES = [
  "New York",
  "Singapore",
  "Nairobi",
  "Amsterdam",
  "Reykjavik",
  "Seoul",
  "Cairo",
  "Sydney",
  "Sao Paulo",
];

export const CitySimulationInspector: React.FC<CitySimulationInspectorProps> = ({
  scenario,
  year,
  initialCity = "New York",
}) => {
  const [cityInput, setCityInput] = useState<string>(initialCity);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CitySimulationResult | null>(null);

  const handleSimulate = async (cityToQuery: string) => {
    if (!cityToQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/city-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityToQuery.trim(),
          scenario,
          year,
        }),
      });

      if (!response.ok) {
        throw new Error(`Simulation request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("City simulation error:", err);
      setError("Unable to generate simulation at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-100 font-sans">
              City Simulator 2100 • Gemini Deep Projection
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate what ANY city or region on Earth will look like in 2100 under the selected climate pathway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Year {year} • {scenario.toUpperCase()}
          </span>
        </div>
      </div>

      {/* City Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="input-city-query"
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSimulate(cityInput)}
            placeholder="Type any city (e.g. Amsterdam, Singapore, Nairobi, Miami, Tokyo, Paris)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all font-sans"
          />
        </div>

        <button
          id="btn-run-city-simulation"
          onClick={() => handleSimulate(cityInput)}
          disabled={loading || !cityInput.trim()}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer font-sans shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Simulating 2100...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Simulate City</span>
            </>
          )}
        </button>
      </div>

      {/* Preset quick chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        <span className="text-[11px] text-slate-500 font-mono">Quick load:</span>
        {PRESET_CITIES.map((c) => (
          <button
            key={c}
            id={`btn-preset-city-${c.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => {
              setCityInput(c);
              handleSimulate(c);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => handleSimulate(cityInput)}
            className="text-rose-200 underline font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results View */}
      {result ? (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-5 animate-fade-in">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-slate-100">{result.city} in 2100</h3>
                {result.climateZone && (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    {result.climateZone}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated under {scenario.toUpperCase()} pathway • Projection date: 2100 CE
              </p>
            </div>

            <button
              onClick={() => handleSimulate(cityInput)}
              title="Regenerate projection"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono mb-1">
                <Thermometer className="w-4 h-4" />
                <span>Thermal Change:</span>
              </div>
              <div className="text-sm font-semibold text-slate-200 font-mono">
                {result.temperatureChange}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
                <Droplets className="w-4 h-4" />
                <span>Sea Level / Water:</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {result.seaLevelImpact}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono mb-1">
                <Users className="w-4 h-4" />
                <span>Demographics:</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {result.populationOutlook}
              </div>
            </div>
          </div>

          {/* Daily Life Snapshot */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/25">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>A Day in the Life (2100 CE):</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {result.dailyLifeSnapshot}
            </p>
          </div>

          {/* Adaptations and Landmarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-xs font-mono font-semibold uppercase text-emerald-400 mb-2.5 flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>Key Urban Adaptations:</span>
              </div>
              <ul className="space-y-2">
                {result.keyAdaptations?.map((item, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-xs font-mono font-semibold uppercase text-amber-400 mb-2.5 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                <span>Landmark Transformation:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {result.notableLandmarkTransformation ||
                  "Historic architecture has been fortified with cathodic anti-salinity shielding and integrated atmospheric humidity collectors."}
              </p>
              {result.waterAndFood && (
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Food & Water Security: </span>
                  {result.waterAndFood}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-3">
            <Building className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">Ready to simulate any world city in 2100</p>
          <p className="text-xs text-slate-500 max-w-md mt-1">
            Enter any city name above or choose a preset to inspect its future climate, architecture, and daily lifestyle.
          </p>
        </div>
      )}
    </div>
  );
};

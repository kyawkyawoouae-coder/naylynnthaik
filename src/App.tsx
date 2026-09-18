import React, { useState } from "react";
import { ScenarioId, Hotspot } from "./types";
import { SCENARIOS, HOTSPOTS } from "./data/earthData";
import { EarthGlobeCanvas } from "./components/EarthGlobeCanvas";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { TimelineSlider } from "./components/TimelineSlider";
import { PillarsView } from "./components/PillarsView";
import { HotspotModal } from "./components/HotspotModal";
import { CitySimulationInspector } from "./components/CitySimulationInspector";
import { FutureOracle } from "./components/FutureOracle";
import { AudioAmbience } from "./components/AudioAmbience";
import {
  Globe,
  Layers,
  Sparkles,
  MessageSquare,
  Scale,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame,
  AlertTriangle,
  Info,
} from "lucide-react";

type ActiveTab = "globe" | "pillars" | "simulator" | "oracle" | "comparison";

export default function App() {
  const [scenario, setScenario] = useState<ScenarioId>("middle");
  const [year, setYear] = useState<number>(2100);
  const [activeTab, setActiveTab] = useState<ActiveTab>("globe");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showSeaLevelRise, setShowSeaLevelRise] = useState<boolean>(false);
  const [showHeatAnomaly, setShowHeatAnomaly] = useState<boolean>(false);
  const [simulatedCity, setSimulatedCity] = useState<string>("Tokyo");

  const currentScenarioData = SCENARIOS[scenario];

  const handleOpenCitySimulation = (cityName: string) => {
    setSimulatedCity(cityName);
    setActiveTab("simulator");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  <span>EARTH</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    2100
                  </span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  IPCC Simulation Matrix
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive Planetary Explorer • Climate, Oceans, Megacities & Biosphere
              </p>
            </div>
          </div>

          {/* Right Header Status & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Active Pathway pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Pathway:</span>
              <span
                className={`font-semibold ${
                  scenario === "green"
                    ? "text-emerald-400"
                    : scenario === "middle"
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {currentScenarioData.ipccCode}
              </span>
            </div>

            {/* Current year pill */}
            <div className="px-2.5 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              Year {year}
            </div>

            {/* Ambient sound synthesizer */}
            <AudioAmbience />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="tab-globe"
            onClick={() => setActiveTab("globe")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "globe"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Interactive 3D Globe</span>
          </button>

          <button
            id="tab-pillars"
            onClick={() => setActiveTab("pillars")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "pillars"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Five Scientific Pillars</span>
          </button>

          <button
            id="tab-simulator"
            onClick={() => setActiveTab("simulator")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "simulator"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>City Simulator (Gemini)</span>
          </button>

          <button
            id="tab-oracle"
            onClick={() => setActiveTab("oracle")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "oracle"
                ? "bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask 2100 Oracle</span>
          </button>

          <button
            id="tab-comparison"
            onClick={() => setActiveTab("comparison")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "comparison"
                ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Scenario Comparison</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* TAB 1: GLOBE & HOTSPOTS */}
        {activeTab === "globe" && (
          <div className="space-y-6 animate-fade-in">
            {/* Globe Viewport + Hotspots Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Globe Canvas */}
              <div className="lg:col-span-8 min-h-[500px] flex flex-col">
                <EarthGlobeCanvas
                  scenario={scenario}
                  year={year}
                  hotspots={HOTSPOTS}
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
                  showSeaLevelRise={showSeaLevelRise}
                  showHeatAnomaly={showHeatAnomaly}
                  onToggleSeaLevel={() => setShowSeaLevelRise((prev) => !prev)}
                  onToggleHeatAnomaly={() => setShowHeatAnomaly((prev) => !prev)}
                />
              </div>

              {/* Hotspots Quick Explorer Sidebar */}
              <div className="lg:col-span-4 flex flex-col bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl max-h-[560px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-100">Global Focus Points</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{HOTSPOTS.length} Nodes</span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Click any location to inspect projected 2100 transformations, seawall networks, or climate stress.
                </p>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {HOTSPOTS.map((spot) => {
                    const isSelected = selectedHotspot?.id === spot.id;
                    let tagColor = "text-purple-400 bg-purple-500/10 border-purple-500/20";
                    if (spot.category === "tipping-point") tagColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
                    if (spot.category === "ecology") tagColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                    if (spot.category === "innovation") tagColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";

                    return (
                      <button
                        key={spot.id}
                        id={`btn-hotspot-item-${spot.id}`}
                        onClick={() => setSelectedHotspot(spot)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between group ${
                          isSelected
                            ? "bg-cyan-950/40 border-cyan-500/50 shadow-sm"
                            : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-200 group-hover:text-white">
                              {spot.name}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${tagColor}`}>
                              {spot.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[210px] mt-0.5">
                            {spot.statusTag}
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timeline Slider with Year Metrics & Playback */}
            <TimelineSlider
              currentYear={year}
              onYearChange={(newYear) => setYear(newYear)}
              scenario={scenario}
            />

            {/* Scenario Selector: Green vs Middle vs Fossil */}
            <ScenarioSelector
              currentScenario={scenario}
              onSelectScenario={(newScenario) => setScenario(newScenario)}
            />
          </div>
        )}

        {/* TAB 2: FIVE SCIENTIFIC PILLARS */}
        {activeTab === "pillars" && (
          <div className="space-y-6 animate-fade-in">
            <PillarsView scenario={scenario} />
            <ScenarioSelector
              currentScenario={scenario}
              onSelectScenario={(newScenario) => setScenario(newScenario)}
            />
          </div>
        )}

        {/* TAB 3: CITY SIMULATOR (GEMINI) */}
        {activeTab === "simulator" && (
          <div className="space-y-6 animate-fade-in">
            <CitySimulationInspector
              scenario={scenario}
              year={year}
              initialCity={simulatedCity}
            />
            <ScenarioSelector
              currentScenario={scenario}
              onSelectScenario={(newScenario) => setScenario(newScenario)}
            />
          </div>
        )}

        {/* TAB 4: FUTURE ORACLE */}
        {activeTab === "oracle" && (
          <div className="space-y-6 animate-fade-in">
            <FutureOracle scenario={scenario} />
          </div>
        )}

        {/* TAB 5: SCENARIO COMPARISON */}
        {activeTab === "comparison" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-100 font-sans">
                  The Three Possible Earths in 2100: Side-by-Side Comparison
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  How human choices in the 2020s through 2050s determine the physical state of the planet in 2100.
                </p>
              </div>

              {/* Comparison Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-3 px-4">Planetary Metric</th>
                      <th className="py-3 px-4 text-emerald-400 bg-emerald-950/20 rounded-t-xl">
                        SSP1-2.6: Regenerative Harmony
                      </th>
                      <th className="py-3 px-4 text-amber-400 bg-amber-950/20 rounded-t-xl">
                        SSP2-4.5: Current Trajectory
                      </th>
                      <th className="py-3 px-4 text-rose-400 bg-rose-950/20 rounded-t-xl">
                        SSP5-8.5: Planetary Stress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Global Warming Anomaly</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-300 bg-emerald-950/10">
                        +1.7°C (Peak & Drawdown)
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300 bg-amber-950/10">
                        +2.7°C (Substantial Shift)
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-300 bg-rose-950/10">
                        +4.4°C (Runaway Feedbacks)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Global Sea Level Rise</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-300 bg-emerald-950/10">
                        +0.44m (Managed Buffers)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-300 bg-amber-950/10">
                        +0.82m (Heavy Dykes Needed)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-rose-300 bg-rose-950/10">
                        +1.58m+ (Ice Cliff Collapse)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Atmospheric CO₂ Level</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-300 bg-emerald-950/10">
                        388 ppm (Net-Negative)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-300 bg-amber-950/10">
                        538 ppm (Gradual Plateau)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-rose-300 bg-rose-950/10">
                        870 ppm (High Saturation)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">World Human Population</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-300 bg-emerald-950/10">
                        8.8 Billion (Post-peak stabilized)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-300 bg-amber-950/10">
                        10.1 Billion (High urbanization)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-rose-300 bg-rose-950/10">
                        9.3 Billion (Stressed by shortages)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Arctic Summer Sea Ice</td>
                      <td className="py-3.5 px-4 text-emerald-300 bg-emerald-950/10">
                        Intact & Beginning Recovery
                      </td>
                      <td className="py-3.5 px-4 text-amber-300 bg-amber-950/10">
                        Nearly Ice-Free in Late Summer
                      </td>
                      <td className="py-3.5 px-4 text-rose-300 bg-rose-950/10">
                        Completely Extinct Year-Round
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Primary Energy Matrix</td>
                      <td className="py-3.5 px-4 text-emerald-300 bg-emerald-950/10">
                        Fusion + Perovskite Solar + Geothermal (98%)
                      </td>
                      <td className="py-3.5 px-4 text-amber-300 bg-amber-950/10">
                        Renewables + Nuclear + Carbon Capture (82%)
                      </td>
                      <td className="py-3.5 px-4 text-rose-300 bg-rose-950/10">
                        Fragmented Coal/Gas + Solar Geoengineering (52%)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Food & Agriculture</td>
                      <td className="py-3.5 px-4 text-emerald-300 bg-emerald-950/10">
                        Precision Fermentation, Cultured Proteins & 35% Rewilding
                      </td>
                      <td className="py-3.5 px-4 text-amber-300 bg-amber-950/10">
                        Vertical Urban Farms, Northward Migration to Canada/Siberia
                      </td>
                      <td className="py-3.5 px-4 text-rose-300 bg-rose-950/10">
                        Severe Crop Failure in Tropics, Algal Protein Rations
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Hotspot Detailed Inspector Modal */}
      <HotspotModal
        hotspot={selectedHotspot}
        scenario={scenario}
        onClose={() => setSelectedHotspot(null)}
        onSimulateWithGemini={handleOpenCitySimulation}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 lg:px-8 py-5 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Earth 2100 Planetary Simulation Engine • IPCC AR6/AR7 & UN Population Models</span>
          <span className="text-slate-400">Powered by Gemini 3.8 Flash • AI Studio</span>
        </div>
      </footer>
    </div>
  );
}

import React from "react";
import { SCENARIOS } from "../data/earthData";
import { ScenarioId } from "../types";
import { ShieldCheck, AlertTriangle, Flame, Info } from "lucide-react";

interface ScenarioSelectorProps {
  currentScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenario,
  onSelectScenario,
}) => {
  const scenariosList = Object.values(SCENARIOS);

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-400 font-mono flex items-center gap-2">
            <span>Climate Trajectory Pathways</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 normal-case font-sans">IPCC AR6/AR7 Models</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a pathway to simulate how Earth's biosphere, coastlines, and civilization diverge by 2100.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenariosList.map((sc) => {
          const isSelected = currentScenario === sc.id;
          let icon = <ShieldCheck className="w-4 h-4 text-emerald-400" />;
          let activeBorder = "border-emerald-500 bg-emerald-950/20 text-emerald-100 ring-1 ring-emerald-500/30";
          let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";

          if (sc.id === "middle") {
            icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
            activeBorder = "border-amber-500 bg-amber-950/20 text-amber-100 ring-1 ring-amber-500/30";
            badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
          } else if (sc.id === "fossil") {
            icon = <Flame className="w-4 h-4 text-rose-400" />;
            activeBorder = "border-rose-500 bg-rose-950/20 text-rose-100 ring-1 ring-rose-500/30";
            badgeColor = "bg-rose-500/20 text-rose-300 border-rose-500/30";
          }

          return (
            <button
              key={sc.id}
              id={`btn-scenario-${sc.id}`}
              onClick={() => onSelectScenario(sc.id)}
              className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? activeBorder
                  : "border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-bold text-sm text-slate-100">{sc.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {sc.ipccCode}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {sc.tagline}
                </p>
              </div>

              {/* Key Metrics Bar */}
              <div className="pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-center font-mono">
                <div className="p-1 rounded bg-slate-950/40">
                  <div className="text-[10px] text-slate-400 uppercase">Warming</div>
                  <div className="text-xs font-bold text-slate-100">+{sc.tempAnomaly}°C</div>
                </div>
                <div className="p-1 rounded bg-slate-950/40">
                  <div className="text-[10px] text-slate-400 uppercase">Sea Rise</div>
                  <div className="text-xs font-bold text-slate-100">+{sc.seaLevelRiseMeters}m</div>
                </div>
                <div className="p-1 rounded bg-slate-950/40">
                  <div className="text-[10px] text-slate-400 uppercase">CO₂ PPM</div>
                  <div className="text-xs font-bold text-slate-100">{sc.co2Ppm}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from "react";
import { Hotspot, ScenarioId } from "../types";
import { X, AlertOctagon, Sparkles, MapPin, Users, ShieldAlert, Cpu } from "lucide-react";

interface HotspotModalProps {
  hotspot: Hotspot | null;
  scenario: ScenarioId;
  onClose: () => void;
  onSimulateWithGemini: (cityName: string) => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({
  hotspot,
  scenario,
  onClose,
  onSimulateWithGemini,
}) => {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        id="hotspot-modal-content"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with coordinates and close button */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-slate-100">{hotspot.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300">
                  {hotspot.region}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  {hotspot.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Lat: {hotspot.lat.toFixed(2)}°, Lng: {hotspot.lng.toFixed(2)}° • {hotspot.statusTag}
              </p>
            </div>
          </div>

          <button
            id="btn-close-hotspot-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Population card if available */}
          {hotspot.population2100 && (
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-purple-300">
                <Users className="w-4 h-4" />
                <span>Demographic Projection (2025 → 2100):</span>
              </div>
              <div className="text-slate-200 font-bold">
                <span className="text-slate-400">{hotspot.population2100.current}</span>
                <span className="mx-2 text-purple-400">➔</span>
                <span className="text-purple-300">{hotspot.population2100.projected}</span>
              </div>
            </div>
          )}

          {/* 2100 Outlook for Current Scenario */}
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <span>2100 Planetary Outlook:</span>
              <span className="text-slate-400">
                ({scenario === "green" ? "SSP1-2.6 Green" : scenario === "middle" ? "SSP2-4.5 Middle" : "SSP5-8.5 Stress"})
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-200 leading-relaxed">
              {hotspot.year2100Summary[scenario]}
            </div>
          </div>

          {/* Alternative Pathway Comparisons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-[11px] font-mono text-emerald-400 mb-1">Under Green Transition:</div>
              <p className="text-xs text-slate-300 line-clamp-3">
                {hotspot.year2100Summary.green}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-[11px] font-mono text-rose-400 mb-1">Under Fossil Stress:</div>
              <p className="text-xs text-slate-300 line-clamp-3">
                {hotspot.year2100Summary.fossil}
              </p>
            </div>
          </div>

          {/* Threats & Breakthroughs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold uppercase text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Primary Vulnerabilities:</span>
              </div>
              <ul className="space-y-1.5">
                {hotspot.keyThreats.map((threat, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 flex items-start gap-2 bg-rose-950/10 p-2 rounded-lg border border-rose-500/10"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold uppercase text-cyan-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Adaptations & Infrastructure:</span>
              </div>
              <ul className="space-y-1.5">
                {hotspot.breakthroughs.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 flex items-start gap-2 bg-cyan-950/10 p-2 rounded-lg border border-cyan-500/10"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Click simulate to run a live AI projection for this location in 2100.
          </span>
          <button
            id="btn-simulate-hotspot"
            onClick={() => {
              onClose();
              onSimulateWithGemini(hotspot.name);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate 2100 AI Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};

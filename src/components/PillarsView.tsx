import React, { useState } from "react";
import { PILLARS_OF_2100 } from "../data/earthData";
import { ScenarioId } from "../types";
import {
  ThermometerSun,
  Waves,
  Building2,
  Zap,
  TreePine,
  ChevronRight,
  Sparkles,
  Shield,
  ArrowUpRight,
} from "lucide-react";

interface PillarsViewProps {
  scenario: ScenarioId;
}

export const PillarsView: React.FC<PillarsViewProps> = ({ scenario }) => {
  const [activePillarId, setActivePillarId] = useState<string>(PILLARS_OF_2100[0].id);

  const activePillar =
    PILLARS_OF_2100.find((p) => p.id === activePillarId) || PILLARS_OF_2100[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ThermometerSun":
        return <ThermometerSun className="w-5 h-5 text-rose-400" />;
      case "Waves":
        return <Waves className="w-5 h-5 text-cyan-400" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-purple-400" />;
      case "Zap":
        return <Zap className="w-5 h-5 text-amber-400" />;
      case "TreePine":
        return <TreePine className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>The Five Pillars of Earth in 2100</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Peer-reviewed scientific syntheses spanning atmospheric physics, marine dynamics, demographics, and technology.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Pillar Selector Tabs */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {PILLARS_OF_2100.map((pillar) => {
            const isSelected = activePillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                id={`btn-pillar-${pillar.id}`}
                onClick={() => setActivePillarId(pillar.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30"
                    : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-cyan-500/20" : "bg-slate-800/80 group-hover:bg-slate-700/80"
                    }`}
                  >
                    {getIcon(pillar.iconName)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-200">{pillar.title}</div>
                    <div className="text-[11px] text-slate-400">{pillar.subtitle}</div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? "text-cyan-400 translate-x-1" : "text-slate-600 group-hover:text-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right column: In-depth Detail Card */}
        <div className="lg:col-span-8 bg-slate-950/60 rounded-xl border border-slate-800/80 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                  {getIcon(activePillar.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{activePillar.title}</h3>
                  <p className="text-xs text-slate-400">{activePillar.subtitle}</p>
                </div>
              </div>

              {/* Metric badges */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">
                    {activePillar.metric1.label}
                  </div>
                  <div className="text-xs font-bold font-mono text-cyan-300">
                    {activePillar.metric1.value}
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">
                    {activePillar.metric2.label}
                  </div>
                  <div className="text-xs font-bold font-mono text-emerald-300">
                    {activePillar.metric2.value}
                  </div>
                </div>
              </div>
            </div>

            {/* Core insight callout */}
            <div className="mb-5 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-3">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{activePillar.highlight}</span>
            </div>

            {/* Scientific Bullet Points */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Key 2100 Realities & Systems:
              </div>
              {activePillar.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs text-slate-300 leading-relaxed hover:border-slate-700/80 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Sources: IPCC WG1 & WG2, UN Population Prospects, IEA Net Zero 2050-2100</span>
            <span className="flex items-center gap-1 text-cyan-400 hover:underline cursor-pointer">
              <span>Scientific consensus</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

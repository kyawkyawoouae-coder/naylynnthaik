import React, { useState, useEffect } from "react";
import { ScenarioId } from "../types";
import { TIMELINE_METRICS } from "../data/earthData";
import { Play, Pause, RotateCcw, Calendar, Users, Zap, Droplets, Thermometer } from "lucide-react";

interface TimelineSliderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  scenario: ScenarioId;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  currentYear,
  onYearChange,
  scenario,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const years = [2025, 2050, 2075, 2100];

  // Auto-play progression
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        onYearChange(
          currentYear >= 2100 ? 2025 : currentYear === 2025 ? 2050 : currentYear === 2050 ? 2075 : 2100
        );
      }, 2400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentYear, onYearChange]);

  // Current metric snapshot for interpolated year
  const snapshot =
    TIMELINE_METRICS.find((m) => m.year === currentYear) ||
    TIMELINE_METRICS[TIMELINE_METRICS.length - 1];

  const tempVal = snapshot.tempAnomaly[scenario];
  const seaVal = snapshot.seaLevelRiseCm[scenario];
  const co2Val = snapshot.co2Ppm[scenario];
  const popVal = snapshot.worldPopBillion[scenario];
  const cleanVal = snapshot.renewableSharePct[scenario];

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-sm tracking-wider">{currentYear}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              {currentYear === 2025
                ? "Present Day Baseline"
                : currentYear === 2050
                ? "The Mid-Century Transition"
                : currentYear === 2075
                ? "Accelerated Planetary Adaptation"
                : "Earth at the Turn of the 22nd Century"}
            </h3>
            <p className="text-xs text-slate-400">
              Scrub the timeline to observe planetary divergence across the 21st century.
            </p>
          </div>
        </div>

        {/* Play / Reset controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-play-timelapse"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-sm ${
              isPlaying
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause Timelapse" : "Play Timelapse"}</span>
          </button>
          <button
            id="btn-reset-year"
            onClick={() => {
              setIsPlaying(false);
              onYearChange(2100);
            }}
            title="Reset to 2100"
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Year Step Buttons & Track */}
      <div className="relative mb-5 px-2">
        <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-slate-800 rounded-full"></div>
        <div
          className="absolute top-1/2 left-4 h-1 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
          style={{
            width: `${((currentYear - 2025) / (2100 - 2025)) * 100}%`,
          }}
        ></div>

        <div className="relative flex justify-between">
          {years.map((y) => {
            const isActive = currentYear === y;
            return (
              <button
                key={y}
                id={`btn-year-${y}`}
                onClick={() => {
                  setIsPlaying(false);
                  onYearChange(y);
                }}
                className="group flex flex-col items-center cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-cyan-400 border-slate-950 ring-4 ring-cyan-500/30 scale-125"
                      : currentYear > y
                      ? "bg-emerald-500 border-slate-900"
                      : "bg-slate-800 border-slate-700 group-hover:border-slate-500"
                  }`}
                />
                <span
                  className={`mt-2 font-mono text-xs transition-colors ${
                    isActive ? "font-bold text-cyan-300" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {y}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Dynamic Metrics for Year & Scenario */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Warming</div>
            <div className="text-sm font-bold font-mono text-slate-100">+{tempVal}°C</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Sea Rise</div>
            <div className="text-sm font-bold font-mono text-slate-100">+{seaVal} cm</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Atm. CO₂</div>
            <div className="text-sm font-bold font-mono text-slate-100">{co2Val} ppm</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Global Pop</div>
            <div className="text-sm font-bold font-mono text-slate-100">{popVal} Billion</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70 flex items-center gap-2.5 col-span-2 sm:col-span-1">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Clean Energy</div>
            <div className="text-sm font-bold font-mono text-slate-100">{cleanVal}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

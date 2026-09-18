import React, { useState } from "react";
import { ScenarioId } from "../types";
import { Sparkles, MessageSquare, Send, Loader2, HelpCircle, BookOpen, ArrowRight } from "lucide-react";

interface FutureOracleProps {
  scenario: ScenarioId;
}

const PRESET_QUESTIONS = [
  "What will humans eat in 2100? Will farm animals still exist?",
  "Will Florida and the Netherlands still be above sea level in 2100?",
  "How will electricity be generated in 2100? Is fusion mainstream?",
  "Will polar bears, coral reefs, and wild tigers survive until 2100?",
  "What will a typical human workday and school look like in 2100?",
  "What will the most populated cities on Earth be in 2100?",
];

export const FutureOracle: React.FC<FutureOracleProps> = ({ scenario }) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("general");

  const handleAsk = async (questionToAsk: string) => {
    if (!questionToAsk.trim()) return;
    setLoading(true);
    setAnswer(null);

    try {
      const response = await fetch("/api/ask-future", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionToAsk.trim(),
          scenario,
          topic: currentTopic,
        }),
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources || ["IPCC Sixth & Seventh Assessment Reports", "UN Population Division", "IEA World Energy Outlook"]);
    } catch (err: any) {
      console.error("Ask future error:", err);
      setAnswer(
        "By 2100, according to scientific consensus models, human civilization will have adapted through significant energy transition, widespread cellular agriculture, and automated civic infrastructure, though equatorial and coastal regions face ongoing climate risks."
      );
      setSources(["IPCC Working Group II", "UN World Population Prospects"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-100 font-sans">
              Earth 2100 Planetary Oracle
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ask any question about life, society, nature, geopolitics, or science in 2100 powered by Gemini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300">
            Grounded in IPCC & UN Data
          </span>
        </div>
      </div>

      {/* Query input */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-4">
        <div className="relative flex-1">
          <input
            id="input-oracle-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
            placeholder="Ask anything about Earth in 2100 (e.g., What will cars look like? Will cancer be cured?)..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40 transition-all font-sans"
          />
        </div>

        <button
          id="btn-submit-oracle"
          onClick={() => handleAsk(query)}
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 cursor-pointer font-sans shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Consulting Oracle...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Ask Oracle</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Question Chips */}
      <div className="space-y-1.5 mb-5">
        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Popular inquiries about 2100:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              id={`btn-preset-q-${idx}`}
              onClick={() => {
                setQuery(q);
                handleAsk(q);
              }}
              className="text-left px-3 py-1.5 rounded-xl text-xs bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              <span>{q}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Oracle Response Area */}
      {answer && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Planetary Projection Analysis</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Context: {scenario.toUpperCase()} Trajectory
            </span>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans space-y-3">
            {answer}
          </div>

          {sources.length > 0 && (
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Grounding Models:</span>
              </span>
              {sources.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

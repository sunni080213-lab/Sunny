import React from "react";
import { SimulationResult, RiskLevel } from "../types";
import {
  Moon,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Flame,
  Clock,
  Brain,
  BedDouble,
  Waves,
  Sparkles,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface SimulationSummaryCardsProps {
  result: SimulationResult;
}

export const SimulationSummaryCards: React.FC<SimulationSummaryCardsProps> = ({
  result,
}) => {
  const getRiskConfig = (level: RiskLevel) => {
    switch (level) {
      case "LOW":
        return {
          title: "Low Sleep Disruption",
          subtitle:
            "Plasma concentration is near basal levels. Adenosine receptors are unobstructed, facilitating delta-wave slow-wave sleep.",
          badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          dotColor: "bg-emerald-500",
          accentColor: "text-emerald-400",
          barColor: "bg-emerald-500",
        };
      case "MODERATE":
        return {
          title: "Moderate Sleep Disruption",
          subtitle:
            "Mild receptor blockade detected. Expect moderate latency delay and minor reduction in Stage N3 deep sleep.",
          badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
          dotColor: "bg-amber-500",
          accentColor: "text-amber-400",
          barColor: "bg-amber-500",
        };
      case "HIGH":
        return {
          title: "High Sleep Disruption",
          subtitle:
            "Over 30% of central adenosine receptors are competitively blocked. Significant delay in sleep onset and deep sleep suppression expected.",
          badgeBg: "bg-red-500/10 border-red-500/20 text-red-400",
          dotColor: "bg-red-500",
          accentColor: "text-red-400",
          barColor: "bg-red-500",
        };
      case "VERY_HIGH":
      default:
        return {
          title: "Critical Sleep Disruption",
          subtitle:
            "Severe CNS receptor saturation. Chemical sleep pressure is heavily masked; sleep architecture will experience acute fragmentation.",
          badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
          dotColor: "bg-rose-500",
          accentColor: "text-rose-400",
          barColor: "bg-rose-500",
        };
    }
  };

  const riskConfig = getRiskConfig(result.riskLevel);

  // Approximate relative percentage of remaining caffeine vs benchmark 150mg peak
  const residualPercent = Math.min(
    100,
    Math.round((result.bedtimeResidualMg / 150) * 100)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-1">
            Projection Model
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white italic tracking-tight">
            Simulation Results
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            State at target bedtime ({result.bedtime}) • Half-life t₁/₂ = {result.halfLifeHours}h
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`border px-4 py-2 rounded-full flex items-center gap-2.5 shadow-sm ${riskConfig.badgeBg}`}
          >
            <div className={`w-2 h-2 rounded-full ${riskConfig.dotColor} animate-pulse`}></div>
            <span className="text-xs font-bold uppercase tracking-widest">
              {riskConfig.title}
            </span>
          </div>

          <div className="bg-[#16181D] border border-slate-800/60 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              Score
            </span>
            <span className={`font-mono font-bold text-sm ${riskConfig.accentColor}`}>
              {result.riskScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero 2-Column Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Residual Caffeine */}
        <div className="bg-[#16181D] rounded-3xl p-6 sm:p-8 border border-slate-800/50 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/60 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-500 text-xs uppercase font-bold tracking-widest">
              Residual Caffeine
            </div>
            <span className="text-[11px] text-indigo-400/80 font-mono bg-[#1F2229] px-2.5 py-1 rounded-lg border border-slate-700/40">
              Plasma: {result.bedtimePlasmaConcMgL} mg/L
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-light text-white tracking-tighter">
              {result.bedtimeResidualMg}
            </span>
            <span className="text-slate-400 text-xl font-medium uppercase">
              mg
            </span>
          </div>

          <div className="mt-6">
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366F1] transition-all duration-700 rounded-full"
                style={{ width: `${Math.max(5, residualPercent)}%` }}
              ></div>
            </div>
            <p className="text-slate-500 text-xs mt-3.5 flex items-center justify-between">
              <span>{residualPercent}% of standard peak concentration.</span>
              <span className="text-slate-400 font-mono">{result.bedtimeMicroMolar} µM</span>
            </p>
          </div>
        </div>

        {/* Card 2: Adenosine Receptor Blockade */}
        <div className="bg-[#16181D] rounded-3xl p-6 sm:p-8 border border-slate-800/50 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/60 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-500 text-xs uppercase font-bold tracking-widest">
              Receptor Blockade
            </div>
            <span className="text-[11px] text-[#22D3EE]/80 font-mono bg-[#1F2229] px-2.5 py-1 rounded-lg border border-slate-700/40">
              A₁ / A₂A Hill Model
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-light text-[#22D3EE] tracking-tighter">
              {result.bedtimeAdenosineBlockadePercent}
            </span>
            <span className="text-slate-400 text-xl font-medium">
              %
            </span>
          </div>

          <div className="mt-6">
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22D3EE] transition-all duration-700 rounded-full"
                style={{ width: `${result.bedtimeAdenosineBlockadePercent}%` }}
              ></div>
            </div>
            <p className="text-slate-500 text-xs mt-3.5 flex items-center justify-between">
              <span>Adenosine competitive inhibition index.</span>
              <span className={result.bedtimeAdenosineBlockadePercent > 30 ? "text-rose-400" : "text-emerald-400"}>
                {result.bedtimeAdenosineBlockadePercent > 30 ? "High Barrier" : "Normal Clearance"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Neurophysiological Feedback & Sleep Architecture Breakdown */}
      <div className="bg-gradient-to-br from-[#16181D] to-[#0A0B0E] rounded-3xl p-6 sm:p-8 border border-slate-800/50 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[#6366F1]">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg text-white font-medium">
              Neurophysiological Feedback & Sleep Architecture
            </h3>
          </div>
          <span className="text-slate-500 text-xs font-mono">
            Circadian Window: {result.bedtime} — {result.wakeTime}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="text-slate-400 text-xs sm:text-sm leading-relaxed space-y-3">
            <p>
              The current bedtime concentration of <strong className="text-white">{result.bedtimeResidualMg}mg</strong> is sufficient to significantly inhibit <span className="text-white font-medium">Adenosine</span> accumulation in the basal forebrain and cortex. While physical fatigue persists, biochemical sleep pressure (Process S) is actively blocked.
            </p>
            <p>
              Expect <span className="text-white font-medium">Sleep Onset Latency (SOL)</span> to increase by approximately <strong className="text-[#22D3EE]">+{result.sleepLatencyIncreaseMin} minutes</strong> beyond your standard baseline.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Estimated Deep Sleep Reduction (N3 Delta)</span>
              <span className="text-rose-400 font-bold font-mono">-{result.deepSleepReductionPercent}%</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Expected Sleep Latency Delay</span>
              <span className="text-amber-400 font-bold font-mono">+{result.sleepLatencyIncreaseMin} min</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Melatonin Onset Phase Shift</span>
              <span className="text-white font-bold font-mono">~40 min delay</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Safe Clearance Hour (&lt;15mg threshold)</span>
              <span className="text-emerald-400 font-bold font-mono">{result.clearanceTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

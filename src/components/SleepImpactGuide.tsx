import React from "react";
import { SimulationResult } from "../types";
import { Bed, HeartPulse, SunMedium, Moon, Sparkles, Droplets, Thermometer, Eye } from "lucide-react";

interface SleepImpactGuideProps {
  result: SimulationResult;
}

export const SleepImpactGuide: React.FC<SleepImpactGuideProps> = ({ result }) => {
  return (
    <div className="bg-[#16181D] border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#1F2229] border border-slate-700/50 flex items-center justify-center text-[#6366F1] shadow-md">
          <Bed className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-0.5">
            Architecture & Recovery
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Sleep Architecture Analysis & Recovery Protocol
          </h3>
        </div>
      </div>

      {/* 1. Sleep Architecture Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* NREM Stage 3 */}
        <div className="bg-[#1F2229] p-5 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-indigo-300 font-semibold">
            <span className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#6366F1]" />
              N3 Deep Slow-Wave Sleep
            </span>
            <span className="font-mono text-rose-400 font-bold bg-[#16181D] px-2.5 py-1 rounded-xl border border-rose-500/30">
              -{result.deepSleepReductionPercent}%
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Essential for cellular repair, growth hormone pulse, and synaptic homeostasis. Residual caffeine attenuates 0.5–4Hz delta wave spectral power, causing non-restorative sleep.
          </p>
        </div>

        {/* REM Sleep */}
        <div className="bg-[#1F2229] p-5 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-cyan-300 font-semibold">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#22D3EE]" />
              REM & Micro-Arousals
            </span>
            <span className="font-mono text-amber-400 font-bold bg-[#16181D] px-2.5 py-1 rounded-xl border border-amber-500/30">
              Risk {result.remSleepSuppressionPercent}%
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Crucial for emotional calibration and memory consolidation. High caffeine elevates sympathetic tone, creating nocturnal micro-arousals and fragmented wake-after-sleep onset (WASO).
          </p>
        </div>

        {/* Circadian & Melatonin */}
        <div className="bg-[#1F2229] p-5 rounded-2xl border border-slate-700/50 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-purple-300 font-semibold">
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              Melatonin Phase Shift
            </span>
            <span className="font-mono text-purple-300 font-bold bg-[#16181D] px-2.5 py-1 rounded-xl border border-purple-500/30">
              +40 min Delay
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Caffeine dampens pineal melatonin secretion signaling, causing a 40-minute circadian phase delay that shifts the natural sleep-onset window.
          </p>
        </div>
      </div>

      {/* 2. Actionable Night Recovery Checklist */}
      <div className="bg-[#1F2229] p-5 sm:p-6 rounded-2xl border border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6366F1]" />
            Tonight's Evidence-Based Mitigation Protocol
          </h4>
          <span className="text-[11px] text-[#6366F1] font-mono font-medium uppercase tracking-wider">
            Neuro-Interventions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          {/* Action 1 */}
          <div className="p-4 rounded-2xl bg-[#16181D] border border-slate-800/80 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-[#22D3EE] shrink-0 mt-0.5 border border-cyan-500/20">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">90-Minute Pre-Bed Warm Shower</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Stimulates peripheral vasodilation, dropping <span className="text-[#22D3EE] font-medium">core body temperature by 1°C</span> upon exiting to mimic biological somnolence.
              </p>
            </div>
          </div>

          {/* Action 2 */}
          <div className="p-4 rounded-2xl bg-[#16181D] border border-slate-800/80 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-[#6366F1] shrink-0 mt-0.5 border border-indigo-500/20">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">L-Theanine (200mg) or Magnesium</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Counteracts caffeine-induced glutamatergic hyperarousal, inducing occipital alpha waves and stabilizing resting autonomic heart rate.
              </p>
            </div>
          </div>

          {/* Action 3 */}
          <div className="p-4 rounded-2xl bg-[#16181D] border border-slate-800/80 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5 border border-amber-500/20">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Strict 0-Lux Blue Light Management</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Eliminate screens and short-wavelength light 60 minutes before bed to allow melatonin synthesis to overcome caffeine blockade.
              </p>
            </div>
          </div>

          {/* Action 4 */}
          <div className="p-4 rounded-2xl bg-[#16181D] border border-slate-800/80 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">4-7-8 Parasympathetic Breathing</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                4s inhale, 7s hold, 8s extended exhale stimulates vagal tone, lowering sympathetically elevated blood pressure and anxiety.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tomorrow's Next Cup Timing Strategy */}
      <div className="p-5 rounded-2xl bg-[#1F2229] border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <SunMedium className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Tomorrow's Optimal First Cup Window</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Delay morning intake until 90–120 minutes post-waking ({result.wakeTime}) to preserve the Cortisol Awakening Response (CAR).
            </div>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#16181D] text-[#6366F1] border border-slate-700/60 font-mono text-xs font-bold whitespace-nowrap">
          Curfew: {result.caffeineCurfewTime}
        </div>
      </div>
    </div>
  );
};

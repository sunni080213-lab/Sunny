import React, { useState } from "react";
import { Brain, ShieldAlert, Zap, Layers, CheckCircle } from "lucide-react";

export const AdenosineMechanismVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "synapse" | "adenosine" | "caffeine" | "crash"
  >("synapse");

  return (
    <div className="bg-[#16181D] border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1F2229] border border-slate-700/50 flex items-center justify-center text-[#6366F1] shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-0.5">
              Neuropharmacology
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Adenosine Mechanism & Receptor Antagonism
            </h3>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <button
            type="button"
            id="mech-tab-synapse"
            onClick={() => setActiveTab("synapse")}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "synapse"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/20"
                : "bg-[#1F2229] text-slate-400 hover:text-white border border-slate-700/40"
            }`}
          >
            Synapse Visualizer
          </button>
          <button
            type="button"
            id="mech-tab-adenosine"
            onClick={() => setActiveTab("adenosine")}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "adenosine"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/20"
                : "bg-[#1F2229] text-slate-400 hover:text-white border border-slate-700/40"
            }`}
          >
            Process S Sleep Pressure
          </button>
          <button
            type="button"
            id="mech-tab-caffeine"
            onClick={() => setActiveTab("caffeine")}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "caffeine"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/20"
                : "bg-[#1F2229] text-slate-400 hover:text-white border border-slate-700/40"
            }`}
          >
            Competitive Antagonism
          </button>
          <button
            type="button"
            id="mech-tab-crash"
            onClick={() => setActiveTab("crash")}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === "crash"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/20"
                : "bg-[#1F2229] text-slate-400 hover:text-white border border-slate-700/40"
            }`}
          >
            Adenosine Flood Crash
          </button>
        </div>
      </div>

      {/* Interactive Mechanism Content */}
      <div className="bg-[#1F2229] rounded-2xl border border-slate-700/50 p-5 sm:p-6">
        {activeTab === "synapse" && (
          <div className="space-y-5">
            {/* Visual Synapse Canvas Simulation */}
            <div className="bg-[#16181D] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
              {/* Presynaptic Terminal */}
              <div className="flex flex-col items-center">
                <div className="px-5 py-2 rounded-t-2xl bg-[#1F2229] border-t border-x border-slate-700/50 text-[#6366F1] text-xs font-bold tracking-wide">
                  Pre-synaptic Terminal (시냅스 전 신경 말단)
                </div>
                <div className="w-full h-12 bg-[#1F2229]/40 border-b border-slate-800 rounded-b-2xl flex items-center justify-around px-4">
                  <span className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] inline-block animate-pulse"></span>
                    ATP Breakdown → Basal Adenosine Release
                  </span>
                </div>
              </div>

              {/* Synaptic Cleft (The gap where molecules float) */}
              <div className="py-10 my-3 border-y border-dashed border-slate-800/80 flex items-center justify-around relative">
                {/* Adenosine floating molecules */}
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-[#22D3EE] text-[#22D3EE] flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/10">
                    A
                  </div>
                  <span className="text-xs text-[#22D3EE] font-semibold">Adenosine</span>
                  <span className="text-[10px] text-slate-500">Sleep Soporific Signal</span>
                </div>

                {/* VS Indicator */}
                <div className="px-3.5 py-1.5 rounded-full bg-[#1F2229] text-[11px] font-bold text-slate-400 border border-slate-700/50 uppercase tracking-wider">
                  Receptor Binding Competition
                </div>

                {/* Caffeine floating molecules */}
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-[#6366F1] text-[#6366F1] flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/10">
                    C
                  </div>
                  <span className="text-xs text-[#6366F1] font-semibold">Caffeine</span>
                  <span className="text-[10px] text-slate-500">Purine Ring Antagonist</span>
                </div>
              </div>

              {/* Postsynaptic Membrane & Receptors */}
              <div>
                <div className="w-full h-14 bg-[#1F2229]/60 border-t border-slate-700/50 rounded-t-2xl flex items-center justify-around px-4">
                  {/* Receptor 1: A1 Receptor */}
                  <div className="px-4 py-2 rounded-xl bg-[#16181D] border border-indigo-500/40 text-center">
                    <div className="text-xs font-bold text-indigo-300">A₁ Receptor</div>
                    <div className="text-[10px] text-slate-400">Neuronal Hyperpolarization & Sedation</div>
                  </div>

                  {/* Receptor 2: A2A Receptor */}
                  <div className="px-4 py-2 rounded-xl bg-[#16181D] border border-cyan-500/40 text-center">
                    <div className="text-xs font-bold text-[#22D3EE]">A₂A Receptor</div>
                    <div className="text-[10px] text-slate-400">Dopamine D₂ Striatal Co-modulation</div>
                  </div>
                </div>
                <div className="px-5 py-2 rounded-b-2xl bg-[#1F2229] border-b border-x border-slate-700/50 text-center text-slate-400 text-xs font-medium">
                  Post-synaptic Receptor Membrane
                </div>
              </div>
            </div>

            {/* Scientific Explanation Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="bg-[#16181D] p-4 rounded-2xl border border-slate-800/80">
                <div className="font-semibold text-white mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                  A₁ Receptor Blockade Dynamics
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Abundant throughout the neocortex and hippocampus. Caffeine prevents adenosine from activating Gi protein cascades, sustaining baseline neuronal firing and delaying sleep induction.
                </p>
              </div>

              <div className="bg-[#16181D] p-4 rounded-2xl border border-slate-800/80">
                <div className="font-semibold text-white mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
                  A₂A Receptor & Dopaminergic Tone
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Concentrated in the dorsal and ventral striatum. Blockade relieves tonic inhibition on dopamine D₂ receptors, elevating alertness, psychomotor speed, and subjective arousal.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "adenosine" && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6366F1]" />
              Adenosine & Homeostatic Sleep Pressure (Process S)
            </h4>
            <p className="text-slate-400">
              Human sleep architecture is regulated by the interaction between the circadian clock (Process C) and the homeostatic accumulation of adenosine (Process S).
            </p>
            <div className="bg-[#16181D] p-4 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">ATP Consumption & Chemical Pressure:</strong> During wakefulness, neural cellular metabolism hydrolyzes ATP, yielding extracellular adenosine which steadily increases over 14–16 consecutive hours.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Somnogenic Threshold:</strong> When adenosine binds undisturbed to central A₁ receptors, it suppresses wake-promoting ascending reticular systems (ARAS), creating irresistible sleepiness.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "caffeine" && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Caffeine's Competitive Antagonism Mechanism
            </h4>
            <p className="text-slate-400">
              Caffeine (1,3,7-trimethylxanthine) shares high structural homology with adenosine's purine ring, allowing it to occupy receptor binding pockets without triggering downstream sedative signaling.
            </p>
            <div className="bg-[#16181D] p-4 rounded-2xl border border-slate-800/80 space-y-2 text-slate-300">
              <div className="font-semibold text-white">Key Pharmacodynamic Principles:</div>
              <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-400">
                <li>Caffeine exerts zero intrinsic agonist activity—it purely acts as a physical plug.</li>
                <li>The brain remains biochemically exhausted (accumulating adenosine), but is deceived into sensing wakefulness.</li>
                <li>Receptor occupancy &gt;30% at bedtime disrupts entry into Stage N3 delta slow-wave sleep.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "crash" && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              The Caffeine Crash: Adenosine Flood Phenomenon
            </h4>
            <p className="text-slate-400">
              Throughout caffeine's duration of action, cerebral metabolic activity continues generating adenosine, which accumulates in the extracellular interstitial fluid.
            </p>
            <div className="bg-[#16181D] p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-semibold text-rose-400">Why Sudden Overwhelming Exhaustion Hits:</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                As hepatic CYP1A2 enzymes metabolize and clear caffeine, unoccupied receptors suddenly become flooded by the massive reservoir of accumulated adenosine, creating an acute, severe wave of drowsiness.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

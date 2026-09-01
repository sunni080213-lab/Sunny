import React, { useState } from "react";
import { MetabolicFactors } from "../types";
import { calculateHalfLife } from "../utils/pharmacokinetics";
import { Dna, Cigarette, Pill, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

interface MetabolicSettingsProps {
  factors: MetabolicFactors;
  onChange: (factors: MetabolicFactors) => void;
}

export const MetabolicSettings: React.FC<MetabolicSettingsProps> = ({ factors, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const calculatedHalfLife = calculateHalfLife(factors);

  const updateFactor = <K extends keyof MetabolicFactors>(key: K, value: MetabolicFactors[K]) => {
    onChange({
      ...factors,
      [key]: value,
    });
  };

  return (
    <div className="bg-[#16181D] border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1F2229] border border-slate-700/50 flex items-center justify-center text-[#6366F1] shadow-md">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-0.5">
              Enzyme Genetics & Kinetics
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Metabolic Factors & CYP1A2 Clearance
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#1F2229] text-[#22D3EE] border border-cyan-500/30">
                t₁/₂ = {calculatedHalfLife}h
              </span>
            </div>
          </div>
        </div>

        <button
          id="toggle-metabolic-details"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 rounded-xl bg-[#1F2229] hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-all border border-slate-700/50 shadow-sm w-fit"
        >
          <span>{isExpanded ? "Collapse" : "Adjust Phenotype"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick Summary Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Active Profiles:</span>
        <span className="px-3 py-1 rounded-xl bg-[#1F2229] text-slate-300 border border-slate-700/40">
          Metabolizer: {factors.cyp1a2Type === "fast" ? "Fast (3.5h)" : factors.cyp1a2Type === "slow" ? "Slow (7.5h)" : "Normal (5.0h)"}
        </span>
        {factors.isSmoker && (
          <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Smoker (+Induction)
          </span>
        )}
        {factors.takesOralContraceptives && (
          <span className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30">
            Oral Contraceptives (+75% t₁/₂)
          </span>
        )}
        {factors.isPregnant && (
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Pregnancy (Delayed)
          </span>
        )}
        <span className="px-3 py-1 rounded-xl bg-[#1F2229] text-slate-400 border border-slate-700/40">
          Sensitivity: {factors.toleranceLevel === "high" ? "High Tolerance" : factors.toleranceLevel === "low" ? "Sensitive" : "Moderate"}
        </span>
      </div>

      {/* Expandable Advanced Options */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-800/60 space-y-5">
          {/* CYP1A2 Genotype Selector */}
          <div>
            <label className="text-xs text-slate-500 uppercase font-medium mb-2.5 block">
              Genetic CYP1A2 Clearance Rate
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                id="cyp-fast"
                onClick={() => updateFactor("cyp1a2Type", "fast")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  factors.cyp1a2Type === "fast"
                    ? "bg-[#1F2229] border-[#6366F1] shadow-lg shadow-indigo-500/10 text-white"
                    : "bg-[#1F2229]/50 border-slate-700/40 text-slate-400 hover:bg-[#1F2229]"
                }`}
              >
                <div className="text-xs font-bold text-white tracking-wide">Fast Metabolizer (빠름)</div>
                <div className="text-[11px] text-slate-400 mt-1">CYP1A2*1A Allele</div>
                <div className="text-[11px] text-[#6366F1] font-mono mt-1.5">Baseline t₁/₂ ≈ 3.5h</div>
              </button>

              <button
                type="button"
                id="cyp-normal"
                onClick={() => updateFactor("cyp1a2Type", "normal")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  factors.cyp1a2Type === "normal"
                    ? "bg-[#1F2229] border-[#6366F1] shadow-lg shadow-indigo-500/10 text-white"
                    : "bg-[#1F2229]/50 border-slate-700/40 text-slate-400 hover:bg-[#1F2229]"
                }`}
              >
                <div className="text-xs font-bold text-white tracking-wide">Normal Metabolizer (표준)</div>
                <div className="text-[11px] text-slate-400 mt-1">~45–50% of adult population</div>
                <div className="text-[11px] text-[#6366F1] font-mono mt-1.5">Baseline t₁/₂ ≈ 5.0h</div>
              </button>

              <button
                type="button"
                id="cyp-slow"
                onClick={() => updateFactor("cyp1a2Type", "slow")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  factors.cyp1a2Type === "slow"
                    ? "bg-[#1F2229] border-[#6366F1] shadow-lg shadow-indigo-500/10 text-white"
                    : "bg-[#1F2229]/50 border-slate-700/40 text-slate-400 hover:bg-[#1F2229]"
                }`}
              >
                <div className="text-xs font-bold text-white tracking-wide">Slow Metabolizer (느림)</div>
                <div className="text-[11px] text-slate-400 mt-1">CYP1A2*1F Variant</div>
                <div className="text-[11px] text-[#6366F1] font-mono mt-1.5">Baseline t₁/₂ ≈ 7.5h</div>
              </button>
            </div>
          </div>

          {/* Biological Modifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              htmlFor="toggle-smoker"
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                factors.isSmoker
                  ? "bg-[#1F2229] border-amber-500/50 text-white"
                  : "bg-[#1F2229]/50 border-slate-700/40 text-slate-400 hover:bg-[#1F2229]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Cigarette className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-medium text-white">Smoker (흡연)</div>
                  <div className="text-[10px] text-slate-500">CYP1A2 induction (-32% t₁/₂)</div>
                </div>
              </div>
              <input
                id="toggle-smoker"
                type="checkbox"
                checked={factors.isSmoker}
                onChange={(e) => updateFactor("isSmoker", e.target.checked)}
                className="w-4 h-4 rounded text-[#6366F1] focus:ring-indigo-500 border-slate-600 bg-slate-800"
              />
            </label>

            <label
              htmlFor="toggle-pill"
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                factors.takesOralContraceptives
                  ? "bg-[#1F2229] border-rose-500/50 text-white"
                  : "bg-[#1F2229]/50 border-slate-700/40 text-slate-400 hover:bg-[#1F2229]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Pill className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="text-xs font-medium text-white">Oral Contraceptives</div>
                  <div className="text-[10px] text-slate-500">Estrogen inhibition (+75% t₁/₂)</div>
                </div>
              </div>
              <input
                id="toggle-pill"
                type="checkbox"
                checked={factors.takesOralContraceptives}
                onChange={(e) => updateFactor("takesOralContraceptives", e.target.checked)}
                className="w-4 h-4 rounded text-[#6366F1] focus:ring-indigo-500 border-slate-600 bg-slate-800"
              />
            </label>

            <label
              htmlFor="toggle-pregnant"
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                factors.isPregnant
                  ? "bg-[#1F2229] border-purple-500/50 text-white"
                  : "bg-[#1F2229]/50 border-slate-700/40 text-slate-400 hover:bg-[#1F2229]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-medium text-white">Pregnancy (임신)</div>
                  <div className="text-[10px] text-slate-500">Substantial clearance reduction</div>
                </div>
              </div>
              <input
                id="toggle-pregnant"
                type="checkbox"
                checked={factors.isPregnant}
                onChange={(e) => updateFactor("isPregnant", e.target.checked)}
                className="w-4 h-4 rounded text-[#6366F1] focus:ring-indigo-500 border-slate-600 bg-slate-800"
              />
            </label>
          </div>

          {/* Tolerance */}
          <div className="pt-2">
            <label className="text-xs text-slate-500 uppercase font-medium mb-2 block">
              Central Receptor Sensitivity / Habituation
            </label>
            <div className="flex items-center space-x-3">
              {(["low", "medium", "high"] as const).map((lvl) => (
                <button
                  key={lvl}
                  id={`tolerance-${lvl}`}
                  type="button"
                  onClick={() => updateFactor("toleranceLevel", lvl)}
                  className={`flex-1 py-2.5 px-3.5 rounded-xl border text-xs font-semibold transition-all ${
                    factors.toleranceLevel === lvl
                      ? "bg-[#1F2229] border-[#6366F1] text-white shadow-sm"
                      : "bg-[#1F2229]/50 border-slate-700/40 text-slate-400 hover:bg-[#1F2229]"
                  }`}
                >
                  {lvl === "low" ? "Sensitive (민감)" : lvl === "medium" ? "Standard (보통)" : "High Tolerance (내성)"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

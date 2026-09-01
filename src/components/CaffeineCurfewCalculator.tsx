import React, { useState } from "react";
import { MetabolicFactors } from "../types";
import { calculateHalfLife, hoursToTimeString, timeStringToHours } from "../utils/pharmacokinetics";
import { BEVERAGE_PRESETS } from "../data/beverages";
import { Clock, Calculator } from "lucide-react";

interface CaffeineCurfewCalculatorProps {
  factors: MetabolicFactors;
  weightKg: number;
}

export const CaffeineCurfewCalculator: React.FC<CaffeineCurfewCalculatorProps> = ({
  factors,
}) => {
  const [targetBedtime, setTargetBedtime] = useState<string>("23:30");
  const [targetCaffeineMg, setTargetCaffeineMg] = useState<number>(150);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("americano-tall");

  const halfLife = calculateHalfLife(factors);
  const ke = Math.LN2 / halfLife;

  // Calculate required hours to drop below 15mg safe threshold
  const safeThreshold = 15;
  const hoursNeeded = targetCaffeineMg > safeThreshold
    ? Math.log(targetCaffeineMg / safeThreshold) / ke
    : 0;

  const bedHour = timeStringToHours(targetBedtime);
  const curfewHour = bedHour - hoursNeeded;
  const curfewTimeString = hoursToTimeString(curfewHour);

  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const preset = BEVERAGE_PRESETS.find((p) => p.id === id);
    if (preset) {
      setTargetCaffeineMg(preset.caffeineMg);
    }
  };

  return (
    <div className="bg-[#16181D] border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#1F2229] border border-slate-700/50 flex items-center justify-center text-[#22D3EE] shadow-md">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-0.5">
            Temporal Clearance
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Caffeine Curfew Reverse Calculator
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Desired Bedtime */}
        <div className="bg-[#1F2229] p-4 rounded-2xl border border-slate-700/50 space-y-2 shadow-sm">
          <label htmlFor="curfew-bedtime" className="block text-xs font-semibold text-slate-300">
            Target Bedtime
          </label>
          <input
            id="curfew-bedtime"
            type="time"
            value={targetBedtime}
            onChange={(e) => setTargetBedtime(e.target.value)}
            className="w-full bg-[#16181D] border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#6366F1]"
          />
        </div>

        {/* Target Beverage Selection */}
        <div className="bg-[#1F2229] p-4 rounded-2xl border border-slate-700/50 space-y-2 shadow-sm">
          <label htmlFor="curfew-drink" className="block text-xs font-semibold text-slate-300">
            Target Beverage
          </label>
          <select
            id="curfew-drink"
            value={selectedPresetId}
            onChange={(e) => handlePresetSelect(e.target.value)}
            className="w-full bg-[#16181D] border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6366F1]"
          >
            {BEVERAGE_PRESETS.slice(0, 8).map((p) => (
              <option key={p.id} value={p.id} className="bg-[#16181D]">
                {p.name} ({p.caffeineMg}mg)
              </option>
            ))}
          </select>
        </div>

        {/* Custom Mg */}
        <div className="bg-[#1F2229] p-4 rounded-2xl border border-slate-700/50 space-y-2 shadow-sm">
          <label htmlFor="curfew-mg" className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Caffeine Dose</span>
            <span className="text-[#22D3EE] font-mono font-bold">{targetCaffeineMg} mg</span>
          </label>
          <input
            id="curfew-mg"
            type="number"
            min="5"
            max="600"
            value={targetCaffeineMg}
            onChange={(e) => setTargetCaffeineMg(Number(e.target.value) || 50)}
            className="w-full bg-[#16181D] border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#6366F1]"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-[#1F2229] p-6 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-inner">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#16181D] border border-slate-700/60 flex items-center justify-center text-[#22D3EE] font-bold shadow-md">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              Calculated Final Cutoff Time for {targetCaffeineMg}mg
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 font-mono">
              {curfewTimeString}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Must consume at least <strong className="text-[#22D3EE]">{hoursNeeded.toFixed(1)} hours prior</strong> to bedtime ({targetBedtime}).
            </div>
          </div>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-[#16181D] border border-slate-800/80 text-xs space-y-1.5 w-full sm:w-auto shadow-sm">
          <div className="flex items-center justify-between gap-6 text-slate-400">
            <span>Metabolic Half-life:</span>
            <span className="font-mono text-white font-semibold">{halfLife}h</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-slate-400">
            <span>Bedtime Safe Cap:</span>
            <span className="font-mono text-[#22D3EE] font-semibold">&le; 15 mg</span>
          </div>
        </div>
      </div>
    </div>
  );
};


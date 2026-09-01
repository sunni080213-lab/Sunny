import React, { useState } from "react";
import { IntakeRecord } from "../types";
import { BEVERAGE_PRESETS } from "../data/beverages";
import { Coffee, Plus, Trash2, Clock, Moon, Sun, Scale, Zap } from "lucide-react";

interface IntakeFormProps {
  weightKg: number;
  onWeightChange: (weight: number) => void;
  bedtime: string;
  onBedtimeChange: (bedtime: string) => void;
  wakeTime: string;
  onWakeTimeChange: (wakeTime: string) => void;
  intakes: IntakeRecord[];
  onAddIntake: (record: Omit<IntakeRecord, "id">) => void;
  onRemoveIntake: (id: string) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  weightKg,
  onWeightChange,
  bedtime,
  onBedtimeChange,
  wakeTime,
  onWakeTimeChange,
  intakes,
  onAddIntake,
  onRemoveIntake,
}) => {
  // New intake draft state
  const [selectedPresetId, setSelectedPresetId] = useState<string>("americano-tall");
  const [customName, setCustomName] = useState<string>("");
  const [customMg, setCustomMg] = useState<number>(150);
  const [intakeTime, setIntakeTime] = useState<string>("14:00");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const totalCaffeineMg = intakes.reduce((sum, item) => sum + item.caffeineMg, 0);

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomMode(true);
      setCustomName("커스텀 음료");
      setCustomMg(100);
    } else {
      setIsCustomMode(false);
      setSelectedPresetId(val);
      const preset = BEVERAGE_PRESETS.find((p) => p.id === val);
      if (preset) {
        setCustomName(preset.name);
        setCustomMg(preset.caffeineMg);
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = isCustomMode
      ? customName.trim() || "직접 입력 음료"
      : BEVERAGE_PRESETS.find((p) => p.id === selectedPresetId)?.name || customName;

    onAddIntake({
      beverageName: finalName,
      caffeineMg: Math.max(1, customMg),
      intakeTime: intakeTime || "12:00",
    });
  };

  return (
    <div className="bg-[#16181D] border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* 1. Body Weight & Sleep Window Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-1">
              Simulation Parameters
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#6366F1]" />
              Body Metrics & Circadian Target
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Weight */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-weight" className="text-xs text-slate-500 uppercase font-medium ml-1">
              Body Weight (V_d calculation)
            </label>
            <div className="bg-[#1F2229] border border-slate-700/50 rounded-xl p-3 flex items-center justify-between">
              <input
                id="input-weight"
                type="number"
                min="35"
                max="180"
                value={weightKg}
                onChange={(e) => onWeightChange(Number(e.target.value) || 60)}
                className="w-full bg-transparent text-white font-medium text-base focus:outline-none"
              />
              <span className="text-slate-500 text-sm font-medium">kg</span>
            </div>
          </div>

          {/* Target Bedtime */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-bedtime" className="text-xs text-slate-500 uppercase font-medium ml-1 flex items-center gap-1">
              <Moon className="w-3 h-3 text-[#6366F1]" />
              Target Bedtime
            </label>
            <div className="bg-[#1F2229] border border-slate-700/50 rounded-xl p-3 flex items-center justify-between">
              <input
                id="input-bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => onBedtimeChange(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-base focus:outline-none"
              />
              <span className="text-[#6366F1] text-xs font-bold">PM</span>
            </div>
          </div>

          {/* Wake Time */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-waketime" className="text-xs text-slate-500 uppercase font-medium ml-1 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              Wake Time
            </label>
            <div className="bg-[#1F2229] border border-slate-700/50 rounded-xl p-3 flex items-center justify-between">
              <input
                id="input-waketime"
                type="time"
                value={wakeTime}
                onChange={(e) => onWakeTimeChange(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-base focus:outline-none"
              />
              <span className="text-amber-400 text-xs font-bold">AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Caffeine Intake Logger */}
      <div className="pt-5 border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-1">
              Caffeine Ingestion Log
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              Beverages & Timing Records
            </h2>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-slate-500 uppercase text-xs font-medium">Total Dose:</span>
            <div
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                totalCaffeineMg > 400
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  : totalCaffeineMg > 250
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              <span className="font-mono text-sm">{totalCaffeineMg}</span>
              <span>mg</span>
            </div>
          </div>
        </div>

        {/* Add Drink Form */}
        <form
          onSubmit={handleAddSubmit}
          className="bg-gradient-to-br from-[#1F2229] to-[#16181D] p-4 sm:p-5 rounded-2xl border border-slate-700/50 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Drink Selection */}
            <div className="sm:col-span-5 flex flex-col gap-1.5">
              <label htmlFor="select-beverage" className="text-xs text-slate-500 uppercase font-medium ml-1">
                Caffeine Source / Preset
              </label>
              <select
                id="select-beverage"
                value={isCustomMode ? "custom" : selectedPresetId}
                onChange={handlePresetSelect}
                className="w-full bg-[#16181D] border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6366F1] transition-colors"
              >
                <optgroup label="커피 (Coffee)">
                  {BEVERAGE_PRESETS.filter((p) => p.category === "coffee").map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.caffeineMg}mg)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="에너지 드링크 (Energy Drink)">
                  {BEVERAGE_PRESETS.filter((p) => p.category === "energy").map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.caffeineMg}mg)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="차 / 티 (Tea)">
                  {BEVERAGE_PRESETS.filter((p) => p.category === "tea").map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.caffeineMg}mg)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="보충제 / 기타 (Supplements)">
                  {BEVERAGE_PRESETS.filter(
                    (p) => p.category === "supplement" || p.category === "other"
                  ).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.caffeineMg}mg)
                    </option>
                  ))}
                </optgroup>
                <option value="custom">✏️ 직접 입력 (Custom mg)</option>
              </select>
            </div>

            {/* Custom Name (if custom mode) */}
            {isCustomMode && (
              <div className="sm:col-span-3 flex flex-col gap-1.5">
                <label htmlFor="input-custom-name" className="text-xs text-slate-500 uppercase font-medium ml-1">
                  Custom Name
                </label>
                <input
                  id="input-custom-name"
                  type="text"
                  placeholder="예: 더블샷 바닐라라떼"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#16181D] border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            )}

            {/* Caffeine Mg Input */}
            <div className={isCustomMode ? "sm:col-span-2" : "sm:col-span-3"} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label htmlFor="input-caffeine-mg" className="text-xs text-slate-500 uppercase font-medium ml-1 flex items-center justify-between">
                <span>Amount</span>
                <span className="text-[#6366F1] font-mono">{customMg}mg</span>
              </label>
              <input
                id="input-caffeine-mg"
                type="number"
                min="1"
                max="1000"
                value={customMg}
                onChange={(e) => setCustomMg(Number(e.target.value) || 0)}
                className="w-full bg-[#16181D] border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Intake Time */}
            <div className={isCustomMode ? "sm:col-span-2" : "sm:col-span-4"} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label htmlFor="input-intake-time" className="text-xs text-slate-500 uppercase font-medium ml-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Ingestion Time</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="input-intake-time"
                  type="time"
                  value={intakeTime}
                  onChange={(e) => setIntakeTime(e.target.value)}
                  className="w-full bg-[#16181D] border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
                <button
                  type="submit"
                  id="btn-add-drink"
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20 uppercase tracking-widest text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Intake List Items */}
        <div className="mt-4 space-y-2.5">
          {intakes.length === 0 ? (
            <div className="p-5 rounded-2xl bg-[#1F2229]/50 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
              No caffeine records registered today. Add your consumed drinks above.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {intakes.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1F2229] p-3.5 rounded-2xl border border-slate-700/50 flex items-center justify-between group hover:border-[#6366F1]/50 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#16181D] border border-slate-700/60 flex items-center justify-center text-[#6366F1] font-mono font-bold text-xs">
                      {item.caffeineMg}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-[170px] sm:max-w-[210px]">
                        {item.beverageName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.intakeTime}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[#22D3EE]">{item.caffeineMg} mg</span>
                      </div>
                    </div>
                  </div>

                  <button
                    id={`btn-remove-${item.id}`}
                    onClick={() => onRemoveIntake(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="항목 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

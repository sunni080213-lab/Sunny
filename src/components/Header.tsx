import React from "react";
import { Activity, RefreshCw, Zap } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  onLoadDemo: (presetName: "heavy" | "moderate" | "safe") => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onLoadDemo }) => {
  return (
    <header className="border-b border-slate-800/60 bg-[#0A0B0E]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#16181D] border border-slate-800/60 flex items-center justify-center text-[#6366F1] shadow-lg shadow-indigo-500/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-[#6366F1] text-[11px] font-bold tracking-[0.2em] uppercase">
                Pharmacokinetics v2.4
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1F2229] text-slate-400 border border-slate-700/50">
                A₁/A₂A Receptor Model
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Caffeine Pharmacokinetics & Sleep Disruption Simulator
            </h1>
          </div>
        </div>

        {/* Quick actions & Demo profiles */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs">
          <span className="text-slate-500 uppercase text-[11px] font-medium tracking-wider hidden md:inline">
            Presets:
          </span>
          <button
            id="preset-heavy"
            onClick={() => onLoadDemo("heavy")}
            className="px-3 py-1.5 rounded-xl bg-[#1F2229] text-rose-300 border border-rose-500/30 hover:bg-rose-950/40 transition-all flex items-center gap-1.5 font-medium shadow-sm"
            title="오후 늦게 몬스터+커피 섭취 (고위험)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            오후 과다
          </button>
          <button
            id="preset-moderate"
            onClick={() => onLoadDemo("moderate")}
            className="px-3 py-1.5 rounded-xl bg-[#1F2229] text-amber-300 border border-amber-500/30 hover:bg-amber-950/40 transition-all flex items-center gap-1.5 font-medium shadow-sm"
            title="점심 식후 아메리카노 1잔 (보통 위험)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            식후 커피
          </button>
          <button
            id="preset-safe"
            onClick={() => onLoadDemo("safe")}
            className="px-3 py-1.5 rounded-xl bg-[#1F2229] text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950/40 transition-all flex items-center gap-1.5 font-medium shadow-sm"
            title="오전 일찍 녹차 1잔 (안전)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            오전 안전
          </button>
          <button
            id="btn-reset-all"
            onClick={onReset}
            className="p-2 rounded-xl bg-[#1F2229] text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-700/50 shadow-sm"
            title="초기화"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

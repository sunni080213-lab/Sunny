import React, { useState } from "react";
import { PKCalculationPoint } from "../types";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Activity, Clock, Sliders } from "lucide-react";

interface PharmacokineticChartProps {
  timeline: PKCalculationPoint[];
  bedtime: string;
  wakeTime: string;
  halfLifeHours: number;
}

export const PharmacokineticChart: React.FC<PharmacokineticChartProps> = ({
  timeline,
  bedtime,
  wakeTime,
  halfLifeHours,
}) => {
  const [showSleepPressure, setShowSleepPressure] = useState<boolean>(true);
  const [showBlockade, setShowBlockade] = useState<boolean>(true);
  const [scrubberHour, setScrubberHour] = useState<number>(23.5); // default bedtime scrubber

  // Find scrubber point
  const scrubberPoint =
    timeline.find((pt) => Math.abs(pt.decimalHours - scrubberHour) < 0.3) ||
    timeline[Math.min(timeline.length - 1, Math.round(scrubberHour * 2))];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: PKCalculationPoint = payload[0].payload;
      return (
        <div className="bg-[#16181D]/95 border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl text-xs space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6366F1]" />
              Time: {data.timeLabel}
            </span>
            {data.isBedtimeZone && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[#6366F1] text-[10px] font-mono font-bold">
                Sleep Window
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between gap-6 text-white">
              <span className="text-slate-400">Residual Caffeine:</span>
              <span className="font-mono font-bold text-[#6366F1]">{data.residualCaffeineMg} mg</span>
            </div>
            <div className="flex items-center justify-between gap-6 text-slate-400">
              <span>Plasma Concentration:</span>
              <span className="font-mono text-slate-200">{data.plasmaConcentrationMgL} mg/L ({data.plasmaConcentrationMicroMolar} µM)</span>
            </div>
            <div className="flex items-center justify-between gap-6 text-slate-300">
              <span className="text-slate-400">Adenosine Blockade:</span>
              <span className="font-mono font-bold text-[#22D3EE]">{data.adenosineBlockadePercent}%</span>
            </div>
            <div className="flex items-center justify-between gap-6 text-slate-300">
              <span className="text-slate-400">Sleep Pressure (Process S):</span>
              <span className="font-mono font-bold text-purple-400">{data.sleepPressureProcessS}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#16181D] border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header & Series Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-1">
            Dynamic Chrono-Curves
          </div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6366F1]" />
              24-Hour Pharmacokinetic & Receptor Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">
            1-Compartment open model (k_a=3.0/h, t₁/₂={halfLifeHours}h) & Hill receptor kinetics
          </p>
        </div>

        {/* Visibility Toggles */}
        <div className="flex items-center space-x-2.5 text-xs">
          <button
            type="button"
            id="toggle-blockade"
            onClick={() => setShowBlockade(!showBlockade)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 font-medium ${
              showBlockade
                ? "bg-[#1F2229] border-cyan-500/50 text-[#22D3EE] shadow-sm"
                : "bg-[#1F2229]/40 border-slate-800 text-slate-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
            Blockade %
          </button>

          <button
            type="button"
            id="toggle-process-s"
            onClick={() => setShowSleepPressure(!showSleepPressure)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 font-medium ${
              showSleepPressure
                ? "bg-[#1F2229] border-purple-500/50 text-purple-300 shadow-sm"
                : "bg-[#1F2229]/40 border-slate-800 text-slate-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Process S
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-84 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timeline} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="caffeineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke="#475569"
              tick={{ fontSize: 11, fill: "#64748b" }}
              interval={3}
              tickLine={{ stroke: "#1e293b" }}
            />

            {/* Left Y Axis: Residual Caffeine (mg) */}
            <YAxis
              yAxisId="left"
              stroke="#6366F1"
              tick={{ fontSize: 11, fill: "#818cf8" }}
              unit="mg"
              domain={[0, "auto"]}
              tickLine={{ stroke: "#1e293b" }}
            />

            {/* Right Y Axis: Percentage (0-100%) for Blockade & Sleep Pressure */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#22D3EE"
              tick={{ fontSize: 11, fill: "#22D3EE" }}
              unit="%"
              domain={[0, 100]}
              tickLine={{ stroke: "#1e293b" }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Bedtime reference line */}
            <ReferenceLine
              x={bedtime}
              yAxisId="left"
              stroke="#6366F1"
              strokeDasharray="4 4"
              label={{
                value: `Bedtime (${bedtime})`,
                fill: "#818cf8",
                fontSize: 11,
                position: "top",
              }}
            />

            {/* Safe Caffeine Threshold Reference Line (15mg) */}
            <ReferenceLine
              y={15}
              yAxisId="left"
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: "Safe (<15mg)",
                fill: "#34d399",
                fontSize: 10,
                position: "insideBottomLeft",
              }}
            />

            {/* Area & Curves */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="residualCaffeineMg"
              name="Residual Caffeine (mg)"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#caffeineGradient)"
            />

            {showBlockade && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="adenosineBlockadePercent"
                name="Adenosine Blockade (%)"
                stroke="#22D3EE"
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 3"
              />
            )}

            {showSleepPressure && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sleepPressureProcessS"
                name="Sleep Pressure (Process S)"
                stroke="#A855F7"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 5"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Time Scrubber Slider */}
      <div className="bg-[#1F2229] p-4 sm:p-5 rounded-2xl border border-slate-700/50 space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="font-semibold text-white">Instantaneous Timeline Scrubber</span>
          </div>
          <span className="text-[#6366F1] font-mono font-bold text-sm bg-[#16181D] px-3 py-1 rounded-xl border border-slate-700/50">
            {scrubberPoint ? scrubberPoint.timeLabel : "23:30"}
          </span>
        </div>

        <input
          id="slider-time-scrubber"
          type="range"
          min="0"
          max="24"
          step="0.5"
          value={scrubberHour}
          onChange={(e) => setScrubberHour(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
        />

        {/* Instantaneous Scrubber Inspection Cards */}
        {scrubberPoint && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-[#16181D] p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Residual</div>
              <div className="text-base font-bold text-[#6366F1] font-mono mt-0.5">
                {scrubberPoint.residualCaffeineMg} mg
              </div>
            </div>
            <div className="bg-[#16181D] p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Plasma Conc</div>
              <div className="text-base font-bold text-slate-200 font-mono mt-0.5">
                {scrubberPoint.plasmaConcentrationMgL} mg/L
              </div>
            </div>
            <div className="bg-[#16181D] p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Blockade Rate</div>
              <div className="text-base font-bold text-[#22D3EE] font-mono mt-0.5">
                {scrubberPoint.adenosineBlockadePercent}%
              </div>
            </div>
            <div className="bg-[#16181D] p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Sleep Pressure</div>
              <div className="text-base font-bold text-purple-400 font-mono mt-0.5">
                {scrubberPoint.sleepPressureProcessS}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

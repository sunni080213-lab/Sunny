import React, { useState } from "react";
import { SimulationResult, IntakeRecord, MetabolicFactors } from "../types";
import { Sparkles, Send, Bot, User, Loader2, MessageSquare, BookOpen } from "lucide-react";

interface AiNeuroConsultantProps {
  result: SimulationResult;
  intakes: IntakeRecord[];
  weightKg: number;
  factors: MetabolicFactors;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export const AiNeuroConsultant: React.FC<AiNeuroConsultantProps> = ({
  result,
  intakes,
  weightKg,
  factors,
}) => {
  const [report, setReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // 1. Generate Full Deep AI Report
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: weightKg,
          intakes: intakes.map((i) => ({
            name: i.beverageName,
            mg: i.caffeineMg,
            time: i.intakeTime,
          })),
          bedtime: result.bedtime,
          residualCaffeine: result.bedtimeResidualMg,
          plasmaConcentration: result.bedtimePlasmaConcMgL,
          adenosineBlockade: result.bedtimeAdenosineBlockadePercent,
          riskLevel: result.riskLevel,
          sleepLatencyIncrease: result.sleepLatencyIncreaseMin,
          deepSleepReduction: result.deepSleepReductionPercent,
          metabolicProfile: {
            halfLifeHours: result.halfLifeHours,
            cyp1a2Type: factors.cyp1a2Type,
            smoker: factors.isSmoker,
            oralContraceptives: factors.takesOralContraceptives,
            pregnant: factors.isPregnant,
            tolerance: factors.toleranceLevel,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setReport(generateDeterministicReport(result, weightKg));
      } else {
        setReport(data.analysis);
      }
    } catch (err: any) {
      console.error(err);
      setReport(generateDeterministicReport(result, weightKg));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 2. Chat Question Handler
  const handleSendQuestion = async (textToSend?: string) => {
    const query = (textToSend || inputQuestion).trim();
    if (!query || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          context: {
            weightKg,
            bedtime: result.bedtime,
            residualCaffeineMg: result.bedtimeResidualMg,
            adenosineBlockadePercent: result.bedtimeAdenosineBlockadePercent,
            riskLevel: result.riskLevel,
            halfLifeHours: result.halfLifeHours,
            intakes,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const botReply = getDeterministicAnswer(query, result);
        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "assistant",
            text: botReply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "assistant",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err: any) {
      const botReply = getDeterministicAnswer(query, result);
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="bg-[#16181D] border border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1F2229] border border-slate-700/50 flex items-center justify-center text-[#6366F1] shadow-md">
            <Sparkles className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <div className="text-[#6366F1] text-xs font-bold tracking-[0.2em] uppercase mb-0.5">
              Generative Intelligence
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              AI Neuro-Sleep Consultant
            </h3>
          </div>
        </div>

        <button
          type="button"
          id="btn-generate-ai-report"
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isGeneratingReport ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Pharmacokinetics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>{report ? "Refresh Analysis" : "Generate Deep AI Report"}</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Report Card */}
      {report && (
        <div className="bg-[#1F2229] rounded-2xl border border-indigo-500/30 p-5 sm:p-6 space-y-3.5 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-[#6366F1] flex items-center gap-2 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              Pharmacokinetic Sleep Assessment
            </span>
            <span className="text-[10px] font-mono text-slate-500">Gemini Neuro-Engine</span>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-sans">
            {report}
          </div>
        </div>
      )}

      {/* Interactive AI Sleep Q&A Section */}
      <div className="bg-[#1F2229] rounded-2xl border border-slate-700/50 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-white">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#22D3EE]" />
            Real-Time Caffeine & Sleep Pharmacology Q&A
          </span>
          <span className="text-slate-500 font-mono text-[11px]">Interactive</span>
        </div>

        {/* Preset Prompt Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            "What is the neurochemical mechanism of a Coffee Nap?",
            "Does decaf coffee still impair Stage N3 delta waves?",
            "What are the best immediate strategies for bedtime hyperarousal?",
            "How do pre-workout supplements affect sleep architecture?",
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuestion(chip)}
              className="px-3 py-1.5 rounded-xl bg-[#16181D] hover:bg-slate-800 text-slate-300 border border-slate-800/80 text-[11px] text-left transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        {chatMessages.length > 0 && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#22D3EE] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#6366F1] text-white rounded-tr-none shadow-md shadow-indigo-500/10"
                      : "bg-[#16181D] border border-slate-800/80 text-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[9px] text-slate-400/80 text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-[#16181D] border border-slate-700/60 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center space-x-2 text-xs text-[#6366F1] pl-2 font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Consulting neuropharmacology index...</span>
              </div>
            )}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center space-x-2.5"
        >
          <input
            id="input-ai-question"
            type="text"
            placeholder="Ask about adenosine kinetics, receptor down-regulation, clearance..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            className="flex-1 bg-[#16181D] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
          />
          <button
            type="submit"
            id="btn-submit-ai-question"
            disabled={isChatLoading || !inputQuestion.trim()}
            className="p-2.5 rounded-xl bg-[#6366F1] hover:bg-indigo-600 text-white disabled:opacity-40 transition-colors shadow-md shadow-indigo-500/20"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

// Deterministic scientific fallback generator in case network or API is offline
function generateDeterministicReport(result: SimulationResult, weight: number): string {
  return `### 🔬 Personalized Pharmacokinetic Sleep Analysis Report

**1. Neurochemical Receptor Status (Adenosine A₁/A₂A)**
- Based on a body weight of **${weight}kg** and individual volume of distribution ($V_d$), residual caffeine at bedtime is **${result.bedtimeResidualMg}mg** (Plasma concentration: **${result.bedtimePlasmaConcMgL}mg/L** / ${result.bedtimeMicroMolar}µM).
- Calculated central **adenosine receptor occupancy is ${result.bedtimeAdenosineBlockadePercent}%**.
- This competitive blockade impedes somnogenic homeostatic pressure (Process S), sustaining high-frequency electroencephalographic activity.

**2. Sleep Architecture Trajectory**
- **Sleep Latency:** Estimated sleep onset delay of **+${result.sleepLatencyIncreaseMin} minutes**.
- **Stage N3 Slow-Wave Sleep:** Delta-wave spectral intensity reduced by **-${result.deepSleepReductionPercent}%**, impairing physical recovery.
- **Sleep Quality Index:** Overall restorative sleep score estimated at **${result.sleepEfficiencyScore} / 100**.

**3. Tonight's Recommended Interventions**
- Take a 40°C warm bath 90 minutes before sleep to trigger a 1°C drop in core body temperature.
- Consider 200mg L-Theanine or Magnesium Glycinate to modulate neuronal excitability.
- Dim ambient lighting below 10 lux to counteract caffeine-induced melatonin inhibition.

**4. Optimal Caffeine Curfew**
- Safe clearance threshold (<15mg) projected for **${result.clearanceTime}**.
- Tomorrow, delay morning intake until 90 minutes post-waking (${result.wakeTime}) and maintain a strict curfew after **${result.caffeineCurfewTime}**.`;
}

function getDeterministicAnswer(query: string, result: SimulationResult): string {
  const q = query.toLowerCase();
  if (q.includes("coffee nap") || q.includes("커피냅") || q.includes("nap")) {
    return `☕ **The Neurobiology of the Coffee Nap:**
Consuming caffeine immediately before a 20-minute nap leverages kinetic timing:
1. Caffeine requires 20–30 minutes to transit the gastrointestinal tract and cross the blood-brain barrier.
2. During the 20-minute nap, non-REM sleep naturally clears endogenous adenosine from central receptors.
3. Upon waking, caffeine reaches peak receptor binding just as receptors are unoccupied, maximizing alertness without sleep inertia.`;
  }
  if (q.includes("decaf") || q.includes("디카페인")) {
    return `🌱 **Decaffeinated Beverages & Delta Power:**
Decaffeinated coffee typically retains 3–8mg of residual caffeine per serving.
At bedtime, residual caffeine below 15mg maintains adenosine blockade under 5%, which does not significantly alter Stage N3 slow-wave sleep architecture for most individuals.`;
  }
  if (q.includes("strategy") || q.includes("대처법") || q.includes("sleep")) {
    return `🌙 **Immediate Interventions for Caffeine-Induced Hyperarousal:**
1. **Core Thermoregulation:** Warm peripheral extremities (warm shower or socks) to facilitate central heat dissipation.
2. **4-7-8 Parasympathetic Pacing:** Inhale 4s, hold 7s, exhale 8s to stimulate vagal nerve transmission and reduce heart rate.
3. **Stimulus Control:** If unable to sleep after 20 minutes, leave bed to engage in low-light reading until somnolence returns.`;
  }
  return `💡 **Pharmacokinetic Context:**
Your projected bedtime residual caffeine is **${result.bedtimeResidualMg}mg** (${result.bedtimeAdenosineBlockadePercent}% adenosine receptor occupancy).
CYP1A2 enzymes are currently clearing caffeine into paraxanthine (84%), theobromine (12%), and theophylline (4%). Hydration and L-Theanine can assist in attenuating adrenergic stimulation.`;
}

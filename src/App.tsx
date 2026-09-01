import React, { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { IntakeForm } from "./components/IntakeForm";
import { MetabolicSettings } from "./components/MetabolicSettings";
import { SimulationSummaryCards } from "./components/SimulationSummaryCards";
import { PharmacokineticChart } from "./components/PharmacokineticChart";
import { AdenosineMechanismVisualizer } from "./components/AdenosineMechanismVisualizer";
import { SleepImpactGuide } from "./components/SleepImpactGuide";
import { AiNeuroConsultant } from "./components/AiNeuroConsultant";
import { CaffeineCurfewCalculator } from "./components/CaffeineCurfewCalculator";
import { IntakeRecord, MetabolicFactors } from "./types";
import { runSimulation } from "./utils/pharmacokinetics";
import { Activity, Brain, Moon, Sparkles, Calculator } from "lucide-react";

export default function App() {
  // 1. Core user input states
  const [weightKg, setWeightKg] = useState<number>(65);
  const [bedtime, setBedtime] = useState<string>("23:30");
  const [wakeTime, setWakeTime] = useState<string>("07:30");

  // Intake list state
  const [intakes, setIntakes] = useState<IntakeRecord[]>([
    {
      id: "1",
      beverageName: "Americano (Tall, 2 Shots)",
      caffeineMg: 150,
      intakeTime: "14:30",
    },
    {
      id: "2",
      beverageName: "Energy Drink (355ml)",
      caffeineMg: 100,
      intakeTime: "18:00",
    },
  ]);

  // Metabolic & CYP1A2 Profile
  const [factors, setFactors] = useState<MetabolicFactors>({
    cyp1a2Type: "normal",
    isSmoker: false,
    takesOralContraceptives: false,
    isPregnant: false,
    toleranceLevel: "medium",
  });

  // Active view section tab
  const [activeSection, setActiveSection] = useState<"dashboard" | "mechanism" | "guide" | "curfew" | "ai">("dashboard");

  // 2. Real-time Pharmacokinetic & Neuropharmacology Simulation
  const simulationResult = useMemo(() => {
    return runSimulation(weightKg, intakes, bedtime, wakeTime, factors);
  }, [weightKg, intakes, bedtime, wakeTime, factors]);

  // Handlers
  const handleAddIntake = (record: Omit<IntakeRecord, "id">) => {
    const newRecord: IntakeRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setIntakes((prev) => [...prev, newRecord]);
  };

  const handleRemoveIntake = (id: string) => {
    setIntakes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setWeightKg(65);
    setBedtime("23:30");
    setWakeTime("07:30");
    setIntakes([]);
    setFactors({
      cyp1a2Type: "normal",
      isSmoker: false,
      takesOralContraceptives: false,
      isPregnant: false,
      toleranceLevel: "medium",
    });
  };

  const handleLoadDemo = (presetName: "heavy" | "moderate" | "safe") => {
    if (presetName === "heavy") {
      setWeightKg(60);
      setBedtime("23:00");
      setWakeTime("07:00");
      setIntakes([
        { id: "1", beverageName: "Cold Brew", caffeineMg: 205, intakeTime: "13:30" },
        { id: "2", beverageName: "Pre-Workout Booster", caffeineMg: 250, intakeTime: "18:30" },
        { id: "3", beverageName: "Energy Drink", caffeineMg: 100, intakeTime: "20:00" },
      ]);
      setFactors({
        cyp1a2Type: "slow",
        isSmoker: false,
        takesOralContraceptives: false,
        isPregnant: false,
        toleranceLevel: "high",
      });
    } else if (presetName === "moderate") {
      setWeightKg(70);
      setBedtime("23:30");
      setWakeTime("07:30");
      setIntakes([
        { id: "1", beverageName: "Americano (Tall, 2 Shots)", caffeineMg: 150, intakeTime: "13:00" },
        { id: "2", beverageName: "Green Tea", caffeineMg: 30, intakeTime: "17:30" },
      ]);
      setFactors({
        cyp1a2Type: "normal",
        isSmoker: false,
        takesOralContraceptives: false,
        isPregnant: false,
        toleranceLevel: "medium",
      });
    } else {
      setWeightKg(65);
      setBedtime("23:00");
      setWakeTime("07:00");
      setIntakes([
        { id: "1", beverageName: "Drip Coffee (1 Cup)", caffeineMg: 120, intakeTime: "08:30" },
      ]);
      setFactors({
        cyp1a2Type: "fast",
        isSmoker: false,
        takesOralContraceptives: false,
        isPregnant: false,
        toleranceLevel: "low",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-200 font-sans antialiased selection:bg-[#6366F1] selection:text-white">
      {/* Top App Header */}
      <Header onReset={handleReset} onLoadDemo={handleLoadDemo} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Section Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 text-xs sm:text-sm">
          <button
            type="button"
            id="nav-dashboard"
            onClick={() => setActiveSection("dashboard")}
            className={`px-4 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === "dashboard"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/25"
                : "bg-[#16181D] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60"
            }`}
          >
            <Activity className="w-4 h-4" />
            Simulation Dashboard
          </button>

          <button
            type="button"
            id="nav-mechanism"
            onClick={() => setActiveSection("mechanism")}
            className={`px-4 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === "mechanism"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/25"
                : "bg-[#16181D] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60"
            }`}
          >
            <Brain className="w-4 h-4" />
            Adenosine Mechanism
          </button>

          <button
            type="button"
            id="nav-guide"
            onClick={() => setActiveSection("guide")}
            className={`px-4 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === "guide"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/25"
                : "bg-[#16181D] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60"
            }`}
          >
            <Moon className="w-4 h-4" />
            Sleep Architecture Guide
          </button>

          <button
            type="button"
            id="nav-curfew"
            onClick={() => setActiveSection("curfew")}
            className={`px-4 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === "curfew"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/25"
                : "bg-[#16181D] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60"
            }`}
          >
            <Calculator className="w-4 h-4" />
            Curfew Calculator
          </button>

          <button
            type="button"
            id="nav-ai"
            onClick={() => setActiveSection("ai")}
            className={`px-4 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === "ai"
                ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/25"
                : "bg-[#16181D] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60"
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            AI Sleep Consultant
          </button>
        </div>

        {/* Dynamic View Sections */}
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            {/* Top Inputs: Weight, Bedtime, Drinks Logger */}
            <IntakeForm
              weightKg={weightKg}
              onWeightChange={setWeightKg}
              bedtime={bedtime}
              onBedtimeChange={setBedtime}
              wakeTime={wakeTime}
              onWakeTimeChange={setWakeTime}
              intakes={intakes}
              onAddIntake={handleAddIntake}
              onRemoveIntake={handleRemoveIntake}
            />

            {/* CYP1A2 Metabolic Profile & Genetics */}
            <MetabolicSettings factors={factors} onChange={setFactors} />

            {/* Main Risk & Key Neuro-Metrics Result Cards */}
            <SimulationSummaryCards result={simulationResult} />

            {/* 24-Hour Pharmacokinetic & Receptor Blockade Curve */}
            <PharmacokineticChart
              timeline={simulationResult.timeline}
              bedtime={bedtime}
              wakeTime={wakeTime}
              halfLifeHours={simulationResult.halfLifeHours}
            />
          </div>
        )}

        {activeSection === "mechanism" && (
          <div className="space-y-8">
            <AdenosineMechanismVisualizer />
            <SimulationSummaryCards result={simulationResult} />
          </div>
        )}

        {activeSection === "guide" && (
          <div className="space-y-8">
            <SleepImpactGuide result={simulationResult} />
            <PharmacokineticChart
              timeline={simulationResult.timeline}
              bedtime={bedtime}
              wakeTime={wakeTime}
              halfLifeHours={simulationResult.halfLifeHours}
            />
          </div>
        )}

        {activeSection === "curfew" && (
          <div className="space-y-8">
            <CaffeineCurfewCalculator factors={factors} weightKg={weightKg} />
            <SimulationSummaryCards result={simulationResult} />
          </div>
        )}

        {activeSection === "ai" && (
          <div className="space-y-8">
            <AiNeuroConsultant
              result={simulationResult}
              intakes={intakes}
              weightKg={weightKg}
              factors={factors}
            />
            <SleepImpactGuide result={simulationResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-[#0A0B0E] py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p>
            This simulator utilizes standard 1-compartment open pharmacokinetic equations and Hill receptor occupancy models.
          </p>
          <p className="text-[11px] text-slate-600">
            For academic and educational purposes only. Individual pharmacokinetics may vary according to hepatic and genetic factors.
          </p>
        </div>
      </footer>
    </div>
  );
}


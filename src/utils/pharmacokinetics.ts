import { IntakeRecord, MetabolicFactors, PKCalculationPoint, RiskLevel, SimulationResult } from "../types";

/**
 * Molecular weight of caffeine: 194.19 g/mol
 * Bioavailability (F): 0.99
 * Absorption rate constant (ka): 3.0 h^-1 (Tmax ~ 30-45min)
 * Apparent Adenosine Ki: ~10.0 uM (competitive antagonism at A1 and A2A receptors)
 */
const CAFFEINE_MW = 194.19;
const KA = 3.0; // Absorption rate (1/h)
const BIOAVAILABILITY = 0.99;

/**
 * Calculates individualized caffeine elimination half-life based on CYP1A2 genetics & physiology
 */
export function calculateHalfLife(factors: MetabolicFactors): number {
  let baseHalfLife = 5.0; // Standard average (hours)

  switch (factors.cyp1a2Type) {
    case "fast":
      baseHalfLife = 3.5;
      break;
    case "slow":
      baseHalfLife = 7.5;
      break;
    case "normal":
    default:
      baseHalfLife = 5.0;
      break;
  }

  // Modifiers
  if (factors.isSmoker) {
    baseHalfLife *= 0.68; // CYP1A2 induction accelerates clearance (~32% shorter)
  }
  if (factors.takesOralContraceptives) {
    baseHalfLife *= 1.75; // Estrogen/progestin CYP1A2 competitive inhibition
  }
  if (factors.isPregnant) {
    baseHalfLife *= 2.1; // Significant hepatic clearance reduction
  }

  // Bound to biologically realistic limits (2.0h ~ 18.0h)
  return Math.min(18.0, Math.max(2.0, Number(baseHalfLife.toFixed(2))));
}

/**
 * Converts HH:mm string to decimal hours (0.0 to 24.0)
 */
export function timeStringToHours(timeStr: string): number {
  if (!timeStr || !timeStr.includes(":")) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) + (m || 0) / 60;
}

/**
 * Converts decimal hours to formatted string "HH:mm"
 */
export function hoursToTimeString(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  const finalH = m === 60 ? (h + 1) % 24 : h;
  const finalM = m === 60 ? 0 : m;
  return `${String(finalH).padStart(2, "0")}:${String(finalM).padStart(2, "0")}`;
}

/**
 * Calculates Single dose plasma concentration and residual mg at time deltaT (hours)
 */
function getDosePK(
  doseMg: number,
  deltaTHours: number,
  vdLiters: number,
  ka: number,
  ke: number
): { plasmaMgL: number; residualMg: number } {
  if (deltaTHours < 0) return { plasmaMgL: 0, residualMg: 0 };

  // One-compartment open model with first-order absorption
  const cMaxCoeff = (doseMg * BIOAVAILABILITY) / vdLiters;
  const rateDiff = ka - ke;
  if (Math.abs(rateDiff) < 0.0001) {
    // Avoid division by zero
    const conc = cMaxCoeff * ka * deltaTHours * Math.exp(-ke * deltaTHours);
    return {
      plasmaMgL: Math.max(0, conc),
      residualMg: Math.max(0, conc * vdLiters),
    };
  }

  const conc = (cMaxCoeff * (ka / rateDiff)) * (Math.exp(-ke * deltaTHours) - Math.exp(-ka * deltaTHours));
  const validConc = Math.max(0, conc);
  return {
    plasmaMgL: validConc,
    residualMg: validConc * vdLiters,
  };
}

/**
 * Converts plasma concentration (mg/L) to micromolar (uM) and calculates
 * Adenosine A1 & A2A Receptor Occupancy / Blockade (%) using competitive binding model
 */
export function calculateAdenosineBlockade(
  plasmaMgL: number,
  tolerance: "low" | "medium" | "high" = "medium"
): { microMolar: number; blockadePercent: number } {
  // mg/L -> g/m^3 -> (mg/194.19) mmol/m^3 = uM
  const microMolar = (plasmaMgL * 1000) / CAFFEINE_MW;

  // Apparent Ki modulated slightly by neuro-receptor sensitivity/tolerance
  let kiApp = 10.0; // uM
  if (tolerance === "low") kiApp = 8.0; // Higher sensitivity -> blocks more easily
  if (tolerance === "high") kiApp = 13.0; // Lower sensitivity / receptor downregulation

  // Hill / Michaelis-Menten competitive occupancy: Occupancy = [C] / ([C] + Ki) * 100
  const occupancy = (microMolar / (microMolar + kiApp)) * 100;

  return {
    microMolar: Number(microMolar.toFixed(2)),
    blockadePercent: Number(Math.min(100, Math.max(0, occupancy)).toFixed(1)),
  };
}

/**
 * Calculates Homeostatic Sleep Pressure (Process S) across 24h
 * Rising during waking hours (07:00 -> 23:00) and dropping during sleep
 */
function getSleepPressureProcessS(currentHour: number, wakeHour: number, bedHour: number): number {
  let awakeDuration = currentHour - wakeHour;
  if (awakeDuration < 0) awakeDuration += 24;

  let totalDayDuration = bedHour - wakeHour;
  if (totalDayDuration <= 0) totalDayDuration += 24;

  if (awakeDuration <= totalDayDuration) {
    // Awake phase: exponential accumulation of sleep pressure (adenosine buildup)
    const fraction = awakeDuration / totalDayDuration;
    // S-curve from ~15% at wake to ~95% at bedtime
    return Math.min(100, Math.max(10, Math.round(15 + 80 * Math.pow(fraction, 0.85))));
  } else {
    // Sleep phase: exponential discharge of sleep pressure
    const sleepDuration = awakeDuration - totalDayDuration;
    const totalSleepDuration = 24 - totalDayDuration;
    const fraction = sleepDuration / (totalSleepDuration || 8);
    return Math.max(10, Math.round(95 - 80 * Math.pow(fraction, 0.7)));
  }
}

/**
 * Evaluates Sleep Disruption Risk Level
 */
export function evaluateRisk(residualMg: number, blockadePercent: number): {
  riskLevel: RiskLevel;
  riskScore: number;
  sleepLatencyIncreaseMin: number;
  deepSleepReductionPercent: number;
  remSleepSuppressionPercent: number;
  sleepEfficiencyScore: number;
} {
  // Composite score 0 to 100
  const score = Math.min(100, Math.round(blockadePercent * 1.35 + residualMg * 0.25));

  let riskLevel: RiskLevel = "LOW";
  if (blockadePercent < 15 && residualMg < 18) {
    riskLevel = "LOW";
  } else if (blockadePercent < 30 || residualMg < 45) {
    riskLevel = "MODERATE";
  } else if (blockadePercent < 50 || residualMg < 90) {
    riskLevel = "HIGH";
  } else {
    riskLevel = "VERY_HIGH";
  }

  // Sleep Latency Delay (minutes added to falling asleep)
  // Based on clinical sleep EEG meta-analyses
  const sleepLatencyIncreaseMin = Math.min(
    120,
    Math.round(residualMg * 0.28 + blockadePercent * 0.38)
  );

  // Deep Sleep (Stage N3 Slow-Wave Delta power) reduction %
  const deepSleepReductionPercent = Math.min(
    65,
    Math.round(blockadePercent * 0.58 + residualMg * 0.08)
  );

  // REM sleep fragmentation risk %
  const remSleepSuppressionPercent = Math.min(
    70,
    Math.round(blockadePercent * 0.45 + (residualMg > 40 ? 15 : 0))
  );

  // Expected Sleep Efficiency Score (100 = optimal, <75 = fragmented)
  const sleepEfficiencyScore = Math.max(
    38,
    Math.round(96 - blockadePercent * 0.72 - residualMg * 0.05)
  );

  return {
    riskLevel,
    riskScore: score,
    sleepLatencyIncreaseMin,
    deepSleepReductionPercent,
    remSleepSuppressionPercent,
    sleepEfficiencyScore,
  };
}

/**
 * Core Simulator Engine: Runs full Pharmacokinetic & Pharmacodynamic Simulation
 */
export function runSimulation(
  weightKg: number,
  intakes: IntakeRecord[],
  bedtimeStr: string,
  wakeTimeStr: string,
  factors: MetabolicFactors
): SimulationResult {
  const safeWeight = Math.max(30, Math.min(200, weightKg || 65));
  const halfLifeHours = calculateHalfLife(factors);
  const ke = Math.LN2 / halfLifeHours;
  const ka = KA;
  const vdLiters = 0.65 * safeWeight; // Volume of distribution (L)

  const bedHour = timeStringToHours(bedtimeStr);
  const wakeHour = timeStringToHours(wakeTimeStr);

  // Generate 24-hour / 48-point timeline curve (every 30 mins from 00:00 to 24:00)
  const timeline: PKCalculationPoint[] = [];

  // Parse intake times relative to day
  const normalizedIntakes = intakes.map((item) => ({
    ...item,
    decimalHour: timeStringToHours(item.intakeTime),
  }));

  for (let i = 0; i <= 48; i++) {
    const currentHour = i * 0.5;
    const timeLabel = hoursToTimeString(currentHour);

    let totalPlasmaMgL = 0;
    let totalResidualMg = 0;

    for (const item of normalizedIntakes) {
      if (item.caffeineMg <= 0) continue;

      // Calculate time delta. If intake was today:
      let deltaT = currentHour - item.decimalHour;
      if (deltaT < 0) {
        // Assume daily repetition or previous day intake if examining early morning
        // We can treat it as previous day: deltaT += 24
        deltaT += 24;
      }

      if (deltaT >= 0) {
        const pk = getDosePK(item.caffeineMg, deltaT, vdLiters, ka, ke);
        totalPlasmaMgL += pk.plasmaMgL;
        totalResidualMg += pk.residualMg;
      }
    }

    const { microMolar, blockadePercent } = calculateAdenosineBlockade(
      totalPlasmaMgL,
      factors.toleranceLevel
    );

    const sleepPressure = getSleepPressureProcessS(currentHour, wakeHour, bedHour);

    // Bedtime window is from bedHour to wakeHour
    let isBedtimeZone = false;
    if (bedHour < wakeHour) {
      isBedtimeZone = currentHour >= bedHour && currentHour <= wakeHour;
    } else {
      isBedtimeZone = currentHour >= bedHour || currentHour <= wakeHour;
    }

    timeline.push({
      timeLabel,
      decimalHours: currentHour,
      residualCaffeineMg: Number(totalResidualMg.toFixed(1)),
      plasmaConcentrationMgL: Number(totalPlasmaMgL.toFixed(2)),
      plasmaConcentrationMicroMolar: microMolar,
      adenosineBlockadePercent: blockadePercent,
      sleepPressureProcessS: sleepPressure,
      isBedtimeZone,
    });
  }

  // Calculate exact values at Bedtime
  let bedtimeResidualMg = 0;
  let bedtimePlasmaConcMgL = 0;

  for (const item of normalizedIntakes) {
    if (item.caffeineMg <= 0) continue;
    let deltaT = bedHour - item.decimalHour;
    if (deltaT < 0) deltaT += 24; // Intake earlier in day, bedtime next night

    const pk = getDosePK(item.caffeineMg, deltaT, vdLiters, ka, ke);
    bedtimePlasmaConcMgL += pk.plasmaMgL;
    bedtimeResidualMg += pk.residualMg;
  }

  const { microMolar: bedtimeMicroMolar, blockadePercent: bedtimeAdenosineBlockadePercent } =
    calculateAdenosineBlockade(bedtimePlasmaConcMgL, factors.toleranceLevel);

  const {
    riskLevel,
    riskScore,
    sleepLatencyIncreaseMin,
    deepSleepReductionPercent,
    remSleepSuppressionPercent,
    sleepEfficiencyScore,
  } = evaluateRisk(bedtimeResidualMg, bedtimeAdenosineBlockadePercent);

  // Clearance Time (when residual caffeine drops below 15 mg threshold)
  let clearanceTime = "체내 안전 수준";
  if (bedtimeResidualMg > 15) {
    const hoursNeeded = Math.log(bedtimeResidualMg / 15) / ke;
    const clearanceDecimal = bedHour + hoursNeeded;
    clearanceTime = hoursToTimeString(clearanceDecimal);
  } else {
    // Find earliest clearance time after last intake
    const latestIntake = normalizedIntakes.reduce(
      (max, curr) => (curr.decimalHour > max.decimalHour ? curr : max),
      normalizedIntakes[0] || { decimalHour: 12 }
    );
    const totalDose = normalizedIntakes.reduce((sum, curr) => sum + curr.caffeineMg, 0);
    if (totalDose > 15) {
      const hoursToClear = Math.log(totalDose / 15) / ke;
      clearanceTime = hoursToTimeString(latestIntake.decimalHour + hoursToClear);
    } else {
      clearanceTime = "현재 안전 수준";
    }
  }

  // Safe Bedtime Recommendation (when residual <= 15mg)
  let safeBedtimeRecommended = bedtimeStr;
  if (bedtimeResidualMg > 15) {
    const hoursDelayNeeded = Math.log(bedtimeResidualMg / 15) / ke;
    safeBedtimeRecommended = hoursToTimeString(bedHour + hoursDelayNeeded);
  }

  // Caffeine Curfew Time: For tonight's bedHour, the latest time a standard 150mg beverage can be consumed
  // 150 * exp(-ke * deltaT) <= 15 => deltaT = ln(10) / ke = 2.3026 / ke hours before bedtime
  const curfewHoursBeforeBed = Math.log(150 / 15) / ke;
  const caffeineCurfewDecimal = bedHour - curfewHoursBeforeBed;
  const caffeineCurfewTime = hoursToTimeString(caffeineCurfewDecimal);

  return {
    bedtime: bedtimeStr,
    wakeTime: wakeTimeStr,
    bedtimeResidualMg: Number(bedtimeResidualMg.toFixed(1)),
    bedtimePlasmaConcMgL: Number(bedtimePlasmaConcMgL.toFixed(2)),
    bedtimeMicroMolar: bedtimeMicroMolar,
    bedtimeAdenosineBlockadePercent: bedtimeAdenosineBlockadePercent,
    riskLevel,
    riskScore,
    sleepLatencyIncreaseMin,
    deepSleepReductionPercent,
    remSleepSuppressionPercent,
    sleepEfficiencyScore,
    clearanceTime,
    safeBedtimeRecommended,
    caffeineCurfewTime,
    halfLifeHours,
    volumeOfDistributionLiters: Number(vdLiters.toFixed(1)),
    eliminationRateKe: Number(ke.toFixed(4)),
    absorptionRateKa: ka,
    timeline,
  };
}

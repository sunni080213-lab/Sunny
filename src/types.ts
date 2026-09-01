export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";

export interface BeveragePreset {
  id: string;
  name: string;
  category: "coffee" | "energy" | "tea" | "supplement" | "other";
  caffeineMg: number;
  defaultVolumeMl?: number;
  description: string;
  iconName: string;
}

export interface IntakeRecord {
  id: string;
  beverageName: string;
  caffeineMg: number;
  intakeTime: string; // "HH:mm" e.g. "14:30"
  notes?: string;
}

export interface MetabolicFactors {
  cyp1a2Type: "fast" | "normal" | "slow"; // 반감기 기본 속도
  isSmoker: boolean; // 흡연 (CYP1A2 유도, 반감기 단축 ~35%)
  takesOralContraceptives: boolean; // 피임약 (CYP1A2 억제, 반감기 연장 ~80%)
  isPregnant: boolean; // 임신 (반감기 크게 연장)
  toleranceLevel: "low" | "medium" | "high"; // 수용체 민감도/내성
}

export interface PKCalculationPoint {
  timeLabel: string; // "14:00"
  decimalHours: number; // 14.0
  residualCaffeineMg: number;
  plasmaConcentrationMgL: number;
  plasmaConcentrationMicroMolar: number;
  adenosineBlockadePercent: number;
  sleepPressureProcessS: number; // 0~100 수면 압력
  isBedtimeZone: boolean;
}

export interface SimulationResult {
  // Bedtime specific metrics
  bedtime: string;
  wakeTime: string;
  bedtimeResidualMg: number;
  bedtimePlasmaConcMgL: number;
  bedtimeMicroMolar: number;
  bedtimeAdenosineBlockadePercent: number;
  
  // Risk & Disruption Indices
  riskLevel: RiskLevel;
  riskScore: number; // 0~100
  sleepLatencyIncreaseMin: number; // 예상 입면 지연 (+분)
  deepSleepReductionPercent: number; // 서파 수면(N3) 감소율 (%)
  remSleepSuppressionPercent: number; // 렘수면 지연 및 분절 위험도 (%)
  sleepEfficiencyScore: number; // 0~100 예상 수면 효율 점수
  
  // Timings
  clearanceTime: string; // 카페인 잔류량 < 15mg 도달 시각
  safeBedtimeRecommended: string; // 안전 수면 권장 시각
  caffeineCurfewTime: string; // 오늘 목표 수면을 위한 최종 카페인 마감 권장 시각
  
  // Biological parameters used
  halfLifeHours: number;
  volumeOfDistributionLiters: number;
  eliminationRateKe: number;
  absorptionRateKa: number;
  
  // 24-hour timeline curve data
  timeline: PKCalculationPoint[];
}

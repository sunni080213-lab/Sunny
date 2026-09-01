import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI client with user-agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Sleep & Neurophysiology In-Depth Report Endpoint
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const {
      weight,
      intakes,
      bedtime,
      residualCaffeine,
      plasmaConcentration,
      adenosineBlockade,
      riskLevel,
      sleepLatencyIncrease,
      deepSleepReduction,
      metabolicProfile,
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        fallback: true,
      });
    }

    const prompt = `
당신은 수면 의학 및 신경생리학(Neurophysiology & Chronobiology) 전문 의과학자입니다.
다음 사용자의 카페인 섭취 데이터와 약동학/수용체 시뮬레이션 결과를 바탕으로, 친절하고 과학적으로 깊이 있는 '신경생리학적 수면 영향 분석 및 맞춤 솔루션'을 마크다운 형식으로 작성해주세요.

[사용자 프로필 & 시뮬레이션 지표]
- 체중: ${weight} kg
- 섭취 내역: ${JSON.stringify(intakes)}
- 목표 수면 시각: ${bedtime}
- 대사 특성: 반감기 보정 요인 (${JSON.stringify(metabolicProfile)})
- 취침 시점 체내 잔류 카페인: ${residualCaffeine} mg
- 취침 시점 혈중 농도: ${plasmaConcentration} mg/L (약 ${(Number(plasmaConcentration) * 1000 / 194.19).toFixed(2)} µM)
- 아데노신 A1/A2A 수용체 차단율: ${adenosineBlockade}%
- 종합 수면 방해 위험도: ${riskLevel}
- 예상 입면 지연: +${sleepLatencyIncrease} 분
- 델타파(서파/깊은 수면) 감소율 추정: -${deepSleepReduction}%

[작성 요구사항]
1. **뇌 신경 회로 메커니즘 설명**: 아데노신(Adenosine)이 수면 압력(Process S)을 형성하는 과정에서 카페인이 A1 및 A2A 수용체를 경쟁적으로 차단하여 발생하는 각성 작용 및 취침 시 신경계 상태.
2. **수면 구조(Sleep Architecture) 변화 분석**: 서파 수면(N3 Delta wave) 및 렘수면(REM)에 미치는 영향.
3. **오늘 밤 실천 가능한 과학적 회복 가이드**: 취침 전 심부체온 조절(뜨거운 샤워/족욕), 조명/멜라토닌 관리, 보충 영양(L-테아닌, 마그네슘, 글리신 등) 또는 이완 요법.
4. **내일 카페인 최적 섭취 타이밍 (Caffeine Curfew)**: 아침 기상 후 코르티솔 각성 반응(CAR)을 방해하지 않는 첫 커피 섭취 시점 및 오후 마감 시각 제안.

정중하고 전문적이며 명쾌한 한국어로 구성해주세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 신경과학 및 수면 약리학 최고 전문가입니다. 최신 과학적 사실에 기반하여 신뢰도 높은 피드백을 제공합니다.",
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      analysis: response.text,
    });
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate analysis",
    });
  }
});

// AI Interactive Neuro Q&A endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `
[사용자 현재 카페인 시뮬레이션 상태]
${JSON.stringify(context, null, 2)}

[사용자 질문]
${message}

위 시뮬레이션 맥락과 최신 신경생리학/수면과학 지식을 결합하여 정확하고 실용적인 답변을 2~4문단 내외로 명확하게 답변해주세요.
`,
      config: {
        systemInstruction: "당신은 카페인 약동학 및 수면 신경생리학 AI 컨설턴트입니다.",
        temperature: 0.6,
      },
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to process chat message",
    });
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Caffeine Sleep Simulator server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

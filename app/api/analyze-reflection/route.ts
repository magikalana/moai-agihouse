import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🧠 === REFLECTION ANALYSIS API CALLED ===")

  try {
    const { reflection, personName } = await request.json()

    console.log("📝 Analyzing reflection:", reflection)
    console.log("👤 For person:", personName)

    if (!reflection || !personName) {
      return NextResponse.json({ error: "Missing reflection or person name" }, { status: 400 })
    }

    const analysisPrompt = `
You are an expert relationship coach analyzing a user's reflection about their interaction with ${personName}. 

User's reflection: "${reflection}"

Analyze this reflection using the "Reflection-to-Growth" framework with these four steps:

1. EMOTION MAPPING
- Identify 2-3 key emotions from the reflection
- Rate their intensity (1-10 scale)
- Look for feeling words like: warmth, guardedness, excitement, anxiety, comfort, skepticism, joy, frustration, etc.

2. TRIGGER & BELIEF EXPLORATION  
- Identify what specifically triggered these emotions
- Look for underlying beliefs or past experiences mentioned
- Connect present feelings to potential past patterns

3. SKILL ALIGNMENT
- Suggest 1-2 specific relational skills they could practice
- Choose from: active listening, vulnerability pacing, boundary-setting, empathy expression, conflict resolution, gratitude expression, curiosity cultivation, emotional regulation
- Match the skill to their emotional triggers

4. ACTIONABLE MICRO-EXPERIMENT
- Create a specific, small action they can try in their next interaction with ${personName}
- Make it concrete and measurable
- Include what to observe or notice

IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no extra text):

{
  "emotions": [
    {"name": "emotion_name", "intensity": 8, "description": "why this emotion"}
  ],
  "triggers": {
    "primary_trigger": "what specifically caused the main emotion",
    "underlying_belief": "deeper belief or past experience if mentioned"
  },
  "recommended_skills": [
    {"skill": "skill_name", "reason": "why this skill helps"}
  ],
  "micro_experiment": {
    "action": "specific thing to try next time",
    "what_to_observe": "what to pay attention to",
    "success_indicator": "how they'll know it worked"
  },
  "summary": "2-3 sentence summary of the key insight"
}

Be empathetic, insightful, and practical. Focus on growth and learning rather than judgment.
`

    console.log("🤖 Sending to OpenAI for analysis...")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: analysisPrompt,
      temperature: 0.7,
    })

    console.log("📊 AI Analysis received (raw):", text)

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim()

    // Remove markdown code blocks
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    // Remove any leading/trailing whitespace again
    cleanedText = cleanedText.trim()

    console.log("🧹 Cleaned text:", cleanedText)

    // Parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(cleanedText)
      console.log("✅ Successfully parsed JSON:", analysis)
    } catch (parseError) {
      console.error("❌ Failed to parse AI response as JSON:", parseError)
      console.error("📄 Cleaned text that failed to parse:", cleanedText)

      // Try to extract JSON from the text if it's embedded
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0])
          console.log("✅ Successfully extracted and parsed JSON from text:", analysis)
        } catch (extractError) {
          console.error("❌ Failed to parse extracted JSON:", extractError)
          // Fallback: create a basic analysis
          analysis = createFallbackAnalysis(reflection, personName)
        }
      } else {
        console.error("❌ No JSON found in response")
        // Fallback: create a basic analysis
        analysis = createFallbackAnalysis(reflection, personName)
      }
    }

    // Validate the analysis structure
    if (!analysis.emotions || !analysis.triggers || !analysis.recommended_skills || !analysis.micro_experiment) {
      console.warn("⚠️ Analysis missing required fields, using fallback")
      analysis = createFallbackAnalysis(reflection, personName)
    }

    console.log("✅ Final analysis:", analysis)

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error("💥 Analysis API error:", error)
    return NextResponse.json({ error: `Analysis failed: ${error.message}` }, { status: 500 })
  }
}

function createFallbackAnalysis(reflection: string, personName: string) {
  console.log("🔄 Creating fallback analysis")

  // Simple keyword-based emotion detection
  const emotions = []
  const lowerReflection = reflection.toLowerCase()

  if (
    lowerReflection.includes("amazing") ||
    lowerReflection.includes("great") ||
    lowerReflection.includes("wonderful")
  ) {
    emotions.push({ name: "joy", intensity: 8, description: "Positive language suggests a joyful experience" })
  }
  if (lowerReflection.includes("understood") || lowerReflection.includes("heard")) {
    emotions.push({ name: "connection", intensity: 7, description: "Feeling heard and understood" })
  }
  if (lowerReflection.includes("rushed") || lowerReflection.includes("disconnected")) {
    emotions.push({ name: "frustration", intensity: 5, description: "Sense of being rushed or disconnected" })
  }

  // Default emotion if none detected
  if (emotions.length === 0) {
    emotions.push({ name: "reflection", intensity: 6, description: "Thoughtful consideration of the interaction" })
  }

  return {
    emotions,
    triggers: {
      primary_trigger: "The interaction dynamics and communication style",
      underlying_belief: "Relationships require mutual understanding and presence",
    },
    recommended_skills: [{ skill: "active listening", reason: "To deepen mutual understanding and connection" }],
    micro_experiment: {
      action: `In your next conversation with ${personName}, practice reflecting back what you hear them say before sharing your own thoughts`,
      what_to_observe: "How they respond when you demonstrate active listening",
      success_indicator: "They seem more engaged and the conversation flows more naturally",
    },
    summary: `Your reflection shows thoughtful consideration of your interaction with ${personName}. Focus on building deeper connection through active listening.`,
  }
}

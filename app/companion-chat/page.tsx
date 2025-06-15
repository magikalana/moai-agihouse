"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { MarkdownMessage } from "@/components/markdown-message"

interface CompanionData {
  animal: {
    id: string
    name: string
    emoji: string
  }
  name: string
}

interface Message {
  id: string
  text: string
  sender: "user" | "companion"
  timestamp: Date
  type?: "normal"
  metadata?: any
}

interface LearningSession {
  phase: "modeling" | "scaffolded" | "articulation" | "fading" | "integration"
  skill: "curiosity" | "active-listening" | "empathy" | "communication"
  step: number
  userProgress: {
    initialInputReceived: boolean
    modelingComplete: boolean
    practiceAttempts: number
    reflectionComplete: boolean
    autonomyLevel: number // 0-3, higher = less support needed
  }
}

const MODELING_EXAMPLES = [
  {
    scenario: "I loved studying abroad",
    demonstration: {
      openEnded: "What was one moment abroad that shifted how you see the world?",
      probing: "When you say 'shifted,' what new belief or feeling emerged?",
      affirmation: "That's fascinating—thanks for sharing!",
      explanation:
        "Notice the pattern: open question → probing follow-up → validation. This creates psychological safety for deeper sharing.",
    },
  },
  {
    scenario: "I've been biking every morning",
    demonstration: {
      openEnded: "What draws you to start your day with biking?",
      probing: "How does that morning energy carry through your day?",
      affirmation: "I love how intentional you are about your mornings!",
      explanation: "See how we moved from activity → motivation → impact? This helps people reflect on their 'why.'",
    },
  },
  {
    scenario: "Work has been really stressful lately",
    demonstration: {
      openEnded: "What part of the stress feels most overwhelming right now?",
      probing: "When you imagine that stress lifting, what would feel different?",
      affirmation: "Thank you for trusting me with something so personal.",
      explanation:
        "With sensitive topics, we validate first, then gently explore. The future-focused question helps them envision relief.",
    },
  },
]

const PRACTICE_SCENARIOS = [
  "I just finished reading an amazing book",
  "I'm thinking about changing careers",
  "My family had a big reunion last weekend",
  "I started learning guitar recently",
  "I've been volunteering at the animal shelter",
]

export default function CompanionChatPage() {
  const router = useRouter()
  const [companion, setCompanion] = useState<CompanionData | null>(null)
  const [userName, setUserName] = useState("Friend")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [learningSession, setLearningSession] = useState<LearningSession>({
    phase: "modeling",
    skill: "curiosity",
    step: 0,
    userProgress: {
      initialInputReceived: false,
      modelingComplete: false,
      practiceAttempts: 0,
      reflectionComplete: false,
      autonomyLevel: 0,
    },
  })
  const [currentScenario, setCurrentScenario] = useState<string>("")
  const [awaitingUserPractice, setAwaitingUserPractice] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    setIsVisible(true)

    // Load companion data
    const companionData = localStorage.getItem("moai-companion")
    if (companionData) {
      setCompanion(JSON.parse(companionData))
    }

    // Load user name
    const userData = localStorage.getItem("moai-user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.name || "Friend")
    }
  }, [])

  useEffect(() => {
    // Initialize chat with companion's greeting - wait for user input
    if (companion && messages.length === 0) {
      const greetingMessage: Message = {
        id: "greeting",
        text: `Hey ${userName}! I'm here to help you develop your conversation skills. 

What's on your mind today? Share anything - a recent conversation, a relationship challenge, or just tell me about your day. I'll listen and help you practice curiosity! 😊`,
        sender: "companion",
        timestamp: new Date(),
        type: "normal",
      }
      setMessages([greetingMessage])
    }
  }, [companion, userName, messages.length])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const analyzeUserInput = (userInput: string) => {
    const input = userInput.toLowerCase()

    // Detect conversation-related topics
    const conversationKeywords = [
      "conversation",
      "talk",
      "chat",
      "said",
      "told",
      "asked",
      "friend",
      "family",
      "colleague",
    ]
    const relationshipKeywords = ["relationship", "friend", "partner", "family", "coworker", "boss", "neighbor"]
    const emotionKeywords = [
      "feel",
      "felt",
      "emotion",
      "happy",
      "sad",
      "angry",
      "frustrated",
      "excited",
      "nervous",
      "anxious",
    ]
    const challengeKeywords = ["difficult", "hard", "struggle", "problem", "issue", "challenge", "conflict", "awkward"]

    const hasConversationTopic = conversationKeywords.some((keyword) => input.includes(keyword))
    const hasRelationshipTopic = relationshipKeywords.some((keyword) => input.includes(keyword))
    const hasEmotionalContent = emotionKeywords.some((keyword) => input.includes(keyword))
    const hasChallenges = challengeKeywords.some((keyword) => input.includes(keyword))

    // Determine appropriate response strategy
    if (hasConversationTopic || hasRelationshipTopic) {
      if (hasChallenges) {
        return "conversation_challenge"
      } else {
        return "conversation_sharing"
      }
    } else if (hasEmotionalContent) {
      return "emotional_sharing"
    } else if (input.length > 50) {
      return "detailed_sharing"
    } else {
      return "general_sharing"
    }
  }

  const provideInitialResponse = (userInput: string, analysisType: string) => {
    let responseText = ""
    let nextPhase: LearningSession["phase"] = "modeling"

    switch (analysisType) {
      case "conversation_challenge":
        responseText = `Thanks for sharing that conversation challenge! I can hear this is something you're thinking about.

That sounds tricky! When someone shares something challenging, a helpful approach is to acknowledge their experience and then ask an open question to explore further. For example, you could say, "That sounds really difficult, what part of that conversation felt most challenging for you?" How does that approach resonate with you?`
        nextPhase = "scaffolded"
        break

      case "conversation_sharing":
        responseText = `That's wonderful that you're sharing about your conversations! It's great to connect with others.

I notice you mentioned a conversation - to deepen connections, try reflecting what you heard and then asking about their experience. For instance, you could say, "It sounds like that conversation was meaningful to you, what made it special?" What do you think about that approach?`
        nextPhase = "scaffolded"
        break

      case "emotional_sharing":
        responseText = `I appreciate you sharing how you're feeling. Emotions are such important information!

When someone shares feelings, try validating the emotion and then gently exploring it. For example, you could say, "That sounds like a lot to handle, what's been the hardest part about feeling this way?" How does that sound as a way to respond?`
        nextPhase = "scaffolded"
        break

      case "detailed_sharing":
        responseText = `Thank you for sharing so thoughtfully! I can tell you put real thought into what you're telling me.

Since you're comfortable sharing details, to invite that same openness from others, show genuine interest and ask for specifics. For example, you could say, "Tell me more about that, what was that moment like for you?" What do you think about trying that?`
        nextPhase = "scaffolded"
        break

      default:
        responseText = `Thanks for sharing with me! I'm here to help you become more curious in your conversations.

Let's start with the foundation of great conversations: curiosity. A simple but powerful pattern is to listen fully and then ask an open question about their experience. For example, if someone says "I had a good weekend," instead of just saying "That's nice," try: "What made it good for you?" or "What was the highlight?" What do you think about that approach?`
        nextPhase = "scaffolded"
    }

    const responseMessage: Message = {
      id: `initial-response-${Date.now()}`,
      text: responseText,
      sender: "companion",
      timestamp: new Date(),
      type: "normal",
    }

    setMessages((prev) => [...prev, responseMessage])

    setLearningSession((prev) => ({
      ...prev,
      phase: nextPhase,
      userProgress: {
        ...prev.userProgress,
        initialInputReceived: true,
      },
    }))
  }

  const startModelingPhase = () => {
    const example = MODELING_EXAMPLES[learningSession.step]

    const modelingMessage: Message = {
      id: `modeling-${Date.now()}`,
      text: `🎯 **MODELING: Watch me demonstrate curiosity**

Let's say someone tells you: *"${example.scenario}"*

Here's how I'd respond:

1. **Open-Ended Question:**
"${example.demonstration.openEnded}"

2. **Probing Follow-Up:**
"${example.demonstration.probing}"

3. **Affirmation:**
"${example.demonstration.affirmation}"

**Why this works:** ${example.demonstration.explanation}

Ready to try it yourself? Type 'ready' when you want to practice!`,
      sender: "companion",
      timestamp: new Date(),
      type: "normal",
      metadata: { example },
    }

    setMessages((prev) => [...prev, modelingMessage])
  }

  const startScaffoldedPractice = () => {
    const scenario = PRACTICE_SCENARIOS[Math.floor(Math.random() * PRACTICE_SCENARIOS.length)]
    setCurrentScenario(scenario)
    setAwaitingUserPractice(true)

    const practiceMessage: Message = {
      id: `practice-${Date.now()}`,
      text: `Okay, I'll share something: *"${scenario}"*

Now, what's a question you could ask me to show you're curious? Don't worry, I'm here to help if you need it!`,
      sender: "companion",
      timestamp: new Date(),
      type: "normal",
      metadata: { scenario },
    }

    setMessages((prev) => [...prev, practiceMessage])
    setLearningSession((prev) => ({
      ...prev,
      phase: "scaffolded",
    }))
  }

  const providePracticeCoaching = (userQuestion: string) => {
    const feedback = analyzeUserQuestion(userQuestion)

    let coachingText = ""

    if (feedback.score >= 3) {
      coachingText = `That's a really insightful question! It makes me want to share more. ${feedback.companionResponse} Want to try another scenario?`
    } else {
      coachingText = `That's a good start! To make it even better, ${feedback.improvements.join(
        ", ",
      )}. ${feedback.companionResponse} What do you think? Want to try another question with this scenario?`
    }

    const coachingMessage: Message = {
      id: `coaching-${Date.now()}`,
      text: coachingText,
      sender: "companion",
      timestamp: new Date(),
      type: "normal",
      metadata: { feedback },
    }

    setMessages((prev) => [...prev, coachingMessage])
    setAwaitingUserPractice(false)

    // Update progress
    setLearningSession((prev) => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        practiceAttempts: prev.userProgress.practiceAttempts + 1,
      },
    }))

    // Move to articulation phase after good performance
    if (feedback.score >= 3 && learningSession.userProgress.practiceAttempts >= 2) {
      setTimeout(() => {
        startArticulationPhase()
      }, 3000)
    }
  }

  const analyzeUserQuestion = (
    question: string,
  ): {
    strengths: string[]
    improvements: string[]
    companionResponse: string
    score: number
  } => {
    const strengths: string[] = []
    const improvements: string[] = []
    let score = 0

    // Check for open-ended starters
    if (/^(what|how|why|when|where|tell me|describe|explain)/i.test(question.trim())) {
      strengths.push("Started with an open-ended word")
      score += 1
    } else {
      improvements.push("Try starting with 'What...', 'How...', or 'Why...' for more open responses")
    }

    // Check for yes/no questions
    if (!/^(do|did|are|is|can|could|would|will|have|has)/i.test(question.trim())) {
      strengths.push("Avoided yes/no format")
      score += 1
    } else {
      improvements.push("Rephrase to avoid yes/no answers")
    }

    // Check for emotional/experiential focus
    if (/(feel|experience|impact|affect|mean|matter|important)/i.test(question)) {
      strengths.push("Asked about feelings or experiences")
      score += 1
    }

    // Check for specificity
    if (/(most|specific|particular|example|moment|time)/i.test(question)) {
      strengths.push("Asked for specific details")
      score += 1
    }

    // Generate appropriate companion response
    const responses = [
      "That's such a thoughtful question! It really makes me want to share more.",
      "I love how you asked that - it shows you're genuinely curious about my experience.",
      "What a great follow-up! That question helps me reflect deeper.",
      "Perfect! That's exactly the kind of question that builds connection.",
    ]

    return {
      strengths,
      improvements,
      companionResponse: responses[Math.min(score, responses.length - 1)],
      score,
    }
  }

  const startArticulationPhase = () => {
    const articulationMessage: Message = {
      id: `articulation-${Date.now()}`,
      text: `Now, let's pause and think about what we've been doing.

Out of curiosity, why do you think asking "How did that feel?" is often more revealing than asking "Did you enjoy it?" Also, what's one thing you've noticed about asking good questions?`,
      sender: "companion",
      timestamp: new Date(),
      type: "normal",
    }

    setMessages((prev) => [...prev, articulationMessage])
    setLearningSession((prev) => ({
      ...prev,
      phase: "articulation",
    }))
  }

  const handleReflectionResponse = (response: string) => {
    const reflectionFeedback: Message = {
      id: `reflection-feedback-${Date.now()}`,
      text: `That's a great reflection! It sounds like you're understanding the importance of creating a safe space for others to share.

Ready to try this out on your own now? I'll still be here to support you, but I'll chime in a little less. How does that sound?`,
      sender: "companion",
      timestamp: new Date(),
      type: "normal",
    }

    setMessages((prev) => [...prev, reflectionFeedback])

    setLearningSession((prev) => ({
      ...prev,
      phase: "fading",
      userProgress: {
        ...prev.userProgress,
        reflectionComplete: true,
        autonomyLevel: 1,
      },
    }))
  }

  const provideFadedSupport = (userInput: string) => {
    const autonomyLevel = learningSession.userProgress.autonomyLevel

    let supportMessage = ""

    if (autonomyLevel === 1) {
      supportMessage = "Remember to ask 'How...' or 'What...' questions!"
    } else if (autonomyLevel === 2) {
      supportMessage = "You're doing great - trust your instincts!"
    } else {
      supportMessage = "You've got this! I'm just here to celebrate your progress."
    }

    const fadedMessage: Message = {
      id: `faded-${Date.now()}`,
      text: supportMessage,
      sender: "companion",
      timestamp: new Date(),
      type: "normal",
    }

    setMessages((prev) => [...prev, fadedMessage])

    // Gradually increase autonomy
    setLearningSession((prev) => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        autonomyLevel: Math.min(3, prev.userProgress.autonomyLevel + 1),
      },
    }))
  }

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      let mimeType = "audio/webm;codecs=opus"
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm"
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/mp4"
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ""
          }
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType || "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())

        // Auto-transcribe the audio
        await transcribeAudio(blob)
      }

      recorder.start(1000)
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
    } catch (err: any) {
      console.error("Error starting recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true)

    try {
      const formData = new FormData()
      const fileName = `recording.${blob.type.includes("mp4") ? "mp4" : "webm"}`
      formData.append("file", blob, fileName)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const data = JSON.parse(responseText)
      if (data.text) {
        setInputText(data.text)
      }
    } catch (err: any) {
      console.error("Transcription error:", err)
    } finally {
      setIsTranscribing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const sendMessage = () => {
    if (!inputText.trim() || !companion) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputText.trim()
    setInputText("")

    // Handle different learning phases
    setTimeout(
      () => {
        // First user input - analyze and provide appropriate framework response
        if (!learningSession.userProgress.initialInputReceived) {
          const analysisType = analyzeUserInput(currentInput)
          provideInitialResponse(currentInput, analysisType)
        }
        // Handle trigger words for different phases
        else if (awaitingUserPractice && learningSession.phase === "scaffolded") {
          providePracticeCoaching(currentInput)
        } else if (learningSession.phase === "articulation") {
          handleReflectionResponse(currentInput)
        } else if (learningSession.phase === "fading") {
          provideFadedSupport(currentInput)
        } else {
          // Regular conversation with contextual learning
          provideContextualResponse(currentInput)
        }
      },
      1000 + Math.random() * 2000,
    )
  }

  const provideContextualResponse = (userInput: string) => {
    const responses = [
      "That's a great observation! How might you apply this curiosity approach in your next conversation?",
      "I love your thinking! What's one relationship where you'd like to practice this?",
      "Excellent insight! Which part of the curiosity pattern feels most natural to you?",
      "You're really getting it! What questions are you most excited to try with friends?",
    ]

    const contextualMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responses[Math.floor(Math.random() * responses.length)],
      sender: "companion",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, contextualMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getPhaseIcon = () => {
    return null
  }

  const getPhaseLabel = () => {
    return null
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No companion selected</p>
          <button
            onClick={() => router.push("/select-companion")}
            className="bg-orange-500 text-white px-6 py-3 rounded-2xl hover:bg-orange-600 transition-colors"
          >
            Choose Companion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[900px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-red-400 px-6 py-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {/* Learning Phase Indicator */}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div className="text-2xl">{companion.animal.emoji}</div>
              </div>
              <div>
                <h1 className="text-xl font-bold">{companion.name}</h1>
                <p className="text-sm opacity-90">Your Curiosity Coach</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-yellow-50 to-orange-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs rounded-2xl ${
                    message.sender === "user"
                      ? "bg-orange-500 text-white rounded-br-md px-4 py-3"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm px-4 py-3"
                  }`}
                >
                  {message.sender === "companion" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm">{companion.animal.emoji}</div>
                      <span className="text-xs font-medium text-gray-600">{companion.name}</span>
                    </div>
                  )}

                  {message.sender === "user" ? (
                    <div className="text-sm leading-relaxed whitespace-pre-line">{message.text}</div>
                  ) : (
                    <MarkdownMessage content={message.text} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            {/* Recording Status */}
            {isRecording && (
              <div className="mb-3 flex items-center justify-center gap-2 text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording... {formatTime(recordingTime)}</span>
              </div>
            )}

            {/* Transcription Status */}
            {isTranscribing && (
              <div className="mb-3 flex items-center justify-center gap-2 text-blue-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Converting speech to text...</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  !learningSession.userProgress.initialInputReceived
                    ? "Share what's on your mind..."
                    : awaitingUserPractice
                      ? "Ask your curiosity question..."
                      : learningSession.phase === "articulation"
                        ? "Share your reflection..."
                        : `Message ${companion.name}...`
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                maxLength={500}
                disabled={isRecording || isTranscribing}
              />

              {/* Voice Recording Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`p-3 rounded-2xl transition-colors ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : isTranscribing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? (
                  <div className="w-5 h-5 bg-white rounded-sm"></div>
                ) : isTranscribing ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isRecording || isTranscribing}
                className={`p-3 rounded-2xl transition-colors ${
                  inputText.trim() && !isRecording && !isTranscribing
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Recording Tip */}
            {!isRecording && !isTranscribing && (
              <div className="mt-2 text-center">
                <span className="text-xs text-gray-500">
                  💡 Tip: Use voice recording for more natural conversations
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

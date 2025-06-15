"use client"

import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  Play,
  MessageSquare,
  Volume2,
  Pause,
  Brain,
  Target,
  Lightbulb,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"

// Sample interaction data - in a real app this would come from your database
const interactionData = {
  1: { name: "Sarah", avatar: "👩🏻‍🦰" },
  2: { name: "Mike", avatar: "👨🏻" },
  3: { name: "Lisa", avatar: "👩🏻‍🦱" },
  4: { name: "David", avatar: "👨🏻‍🦲" },
  5: { name: "Emma", avatar: "👩🏼" },
  6: { name: "James", avatar: "👨🏽" },
  7: { name: "Anna", avatar: "👩🏻‍🦳" },
  8: { name: "Carlos", avatar: "👨🏽‍🦱" },
  9: { name: "Maya", avatar: "👩🏾" },
  10: { name: "Tom", avatar: "👨🏼‍🦰" },
}

// Sample interactions with heart ratings and reflections
const sampleInteractions = [
  {
    id: 1,
    date: "Today",
    activity: "Coffee Chat",
    hearts: 5,
    reflection: "Had an amazing deep conversation about life goals. Felt truly understood.",
    color: "bg-green-100 border-green-200",
  },
  {
    id: 2,
    date: "Yesterday",
    activity: "Team Meeting",
    hearts: 3,
    reflection: "Good collaboration but felt a bit rushed. Need more time to connect.",
    color: "bg-yellow-100 border-yellow-200",
  },
  {
    id: 3,
    date: "3 days ago",
    activity: "Lunch Together",
    hearts: 4,
    reflection: "Enjoyed sharing stories. Learned about their passion for photography.",
    color: "bg-blue-100 border-blue-200",
  },
  {
    id: 4,
    date: "1 week ago",
    activity: "Phone Call",
    hearts: 5,
    reflection: "They called when I was feeling down. Such a caring friend.",
    color: "bg-purple-100 border-purple-200",
  },
  {
    id: 5,
    date: "2 weeks ago",
    activity: "Group Hangout",
    hearts: 2,
    reflection: "Felt disconnected in the group setting. Prefer one-on-one time.",
    color: "bg-red-100 border-red-200",
  },
  {
    id: 6,
    date: "3 weeks ago",
    activity: "Movie Night",
    hearts: 4,
    reflection: "Great choice of movie! We laughed so much together.",
    color: "bg-orange-100 border-orange-200",
  },
]

// Types for AI analysis
interface Emotion {
  name: string
  intensity: number
  description: string
}

interface ReflectionAnalysis {
  emotions: Emotion[]
  triggers: {
    primary_trigger: string
    underlying_belief: string
  }
  recommended_skills: Array<{
    skill: string
    reason: string
  }>
  micro_experiment: {
    action: string
    what_to_observe: string
    success_indicator: string
  }
  summary: string
}

// Audio Recording and Transcription Component
function ReflectModal({ person, onClose }: { person: { name: string; avatar: string }; onClose: () => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [error, setError] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualText, setManualText] = useState("")
  const [analysis, setAnalysis] = useState<ReflectionAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  useEffect(() => {
    // Create audio URL when audioBlob changes
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [audioBlob])

  const startRecording = async () => {
    try {
      setError("")

      // Check if browser supports MediaRecorder
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support audio recording")
      }

      console.log("🎤 Requesting microphone access...")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      console.log("✅ Microphone access granted, starting recording...")

      // Use different MIME types based on browser support
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

      console.log("🎵 Using MIME type:", mimeType)

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
          console.log("📦 Audio chunk received:", event.data.size, "bytes")
        }
      }

      recorder.onstop = () => {
        console.log("⏹️ Recording stopped, creating blob...")
        const blob = new Blob(chunks, { type: mimeType || "audio/webm" })
        console.log("🎵 Audio blob created:", {
          size: blob.size,
          type: blob.type,
          sizeKB: (blob.size / 1024).toFixed(2),
        })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event)
        setError("Recording failed. Please try again.")
      }

      recorder.start(1000) // Collect data every second
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)

      console.log("🔴 Recording started successfully")
    } catch (err: any) {
      console.error("❌ Error starting recording:", err)
      setError(`Could not access microphone: ${err.message}`)
    }
  }

  const stopRecording = () => {
    console.log("⏹️ Stopping recording...")
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const transcribeAudio = async () => {
    if (!audioBlob) {
      setError("No audio recording found")
      return
    }

    console.log("🔄 Starting transcription process...")
    setIsTranscribing(true)
    setError("")

    try {
      const formData = new FormData()
      const fileName = `recording.${audioBlob.type.includes("mp4") ? "mp4" : "webm"}`
      formData.append("file", audioBlob, fileName)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || `HTTP ${response.status}`)
        } catch (parseError) {
          throw new Error(`Server error: ${responseText}`)
        }
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error("Invalid response format from server")
      }

      if (data.text) {
        setTranscription(data.text)
        console.log("🎉 Transcription successful!")
      } else {
        throw new Error("No transcription text received")
      }
    } catch (err: any) {
      console.error("💥 Transcription error:", err)
      setError(`Transcription failed: ${err.message}`)
    } finally {
      setIsTranscribing(false)
    }
  }

  const analyzeReflection = async () => {
    if (!transcription) {
      setError("No reflection text to analyze")
      return
    }

    console.log("🧠 Starting reflection analysis...")
    setIsAnalyzing(true)
    setError("")

    try {
      console.log("📤 Sending analysis request:", {
        reflection: transcription,
        personName: person.name,
      })

      const response = await fetch("/api/analyze-reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reflection: transcription,
          personName: person.name,
        }),
      })

      console.log("📥 Analysis response status:", response.status)

      const responseText = await response.text()
      console.log("📄 Analysis response text:", responseText)

      if (!response.ok) {
        let errorMessage = responseText
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || responseText
        } catch (parseError) {
          // Use responseText as is
        }
        throw new Error(errorMessage)
      }

      let data
      try {
        data = JSON.parse(responseText)
        console.log("✅ Parsed analysis response:", data)
      } catch (parseError) {
        console.error("❌ Failed to parse analysis response:", parseError)
        throw new Error("Invalid response format from analysis API")
      }

      if (data.analysis) {
        setAnalysis(data.analysis)
        setShowAnalysis(true)
        console.log("✅ Analysis complete:", data.analysis)
      } else {
        throw new Error("No analysis data received")
      }
    } catch (err: any) {
      console.error("💥 Analysis error:", err)
      setError(`Analysis failed: ${err.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const saveReflection = async () => {
    if (transcription) {
      // Here you would save the reflection and analysis to your database
      console.log("💾 Saving reflection:", transcription)
      if (analysis) {
        console.log("💾 Saving analysis:", analysis)
      }
      onClose()
    }
  }

  const getEmotionColor = (intensity: number) => {
    if (intensity >= 8) return "bg-red-100 text-red-800 border-red-200"
    if (intensity >= 6) return "bg-orange-100 text-orange-800 border-orange-200"
    if (intensity >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-blue-100 text-blue-800 border-blue-200"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Reflect on {person.name}</h3>
        <p className="text-sm text-gray-600 mb-4">Record your thoughts and feelings about your interaction:</p>

        {/* Recording Interface */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer transition-all duration-200 ${
              isRecording ? "bg-red-500 animate-pulse" : audioBlob ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            ) : audioBlob ? (
              <div className="text-white text-xl">✓</div>
            ) : (
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {isRecording
              ? `Recording... ${formatTime(recordingTime)}`
              : audioBlob
                ? `Recording complete! (${(audioBlob.size / 1024).toFixed(1)}KB)`
                : "Tap to start recording"}
          </p>

          {/* Audio Playback Controls */}
          {audioBlob && !isRecording && (
            <div className="flex items-center justify-center gap-3 mb-3">
              <button
                onClick={playAudio}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => {
                  setAudioBlob(null)
                  setAudioUrl(null)
                  setTranscription("")
                  setRecordingTime(0)
                  setIsPlaying(false)
                  setAnalysis(null)
                  setShowAnalysis(false)
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Record again
              </button>
            </div>
          )}

          {/* Hidden audio element for playback */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              style={{ display: "none" }}
            />
          )}
        </div>

        {/* Transcription Section */}
        {audioBlob && !isRecording && (
          <div className="mb-4 space-y-3">
            <button
              onClick={transcribeAudio}
              disabled={isTranscribing}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isTranscribing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              {isTranscribing ? "Transcribing..." : "Convert to Text"}
            </button>

            <div className="text-center">
              <span className="text-xs text-gray-500">or</span>
            </div>

            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {showManualInput ? "Hide Manual Input" : "Type Manually"}
            </button>
          </div>
        )}

        {/* Manual Text Input */}
        {showManualInput && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Type Your Reflection:</h4>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Type your thoughts about this interaction..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <button
              onClick={() => {
                setTranscription(manualText)
                setShowManualInput(false)
              }}
              disabled={!manualText.trim()}
              className={`mt-2 w-full py-2 px-4 rounded-lg transition-colors ${
                manualText.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Use This Text
            </button>
          </div>
        )}

        {/* Transcription Display */}
        {transcription && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Reflection:</h4>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-3">
              <p className="text-sm text-gray-800 leading-relaxed italic">"{transcription}"</p>
            </div>

            {/* AI Analysis Button */}
            <div className="flex gap-2">
              <button
                onClick={analyzeReflection}
                disabled={isAnalyzing}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isAnalyzing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                }`}
              >
                <Brain className="w-4 h-4" />
                {isAnalyzing ? "Analyzing..." : "Get AI Insights"}
              </button>

              {analysis && (
                <button
                  onClick={analyzeReflection}
                  disabled={isAnalyzing}
                  className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                  title="Re-analyze"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* AI Analysis Display */}
        {showAnalysis && analysis && (
          <div className="mb-4 space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <h4 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Growth Insights
              </h4>

              {/* Summary */}
              <div className="mb-4">
                <p className="text-sm text-purple-700 italic">{analysis.summary}</p>
              </div>

              {/* Emotion Mapping */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  Emotion Mapping
                </h5>
                <div className="space-y-2">
                  {analysis.emotions.map((emotion, index) => (
                    <div key={index} className={`p-2 rounded-lg border ${getEmotionColor(emotion.intensity)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{emotion.name}</span>
                        <span className="text-xs font-bold">{emotion.intensity}/10</span>
                      </div>
                      <p className="text-xs">{emotion.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triggers & Beliefs */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4 text-orange-500" />
                  Triggers & Beliefs
                </h5>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 mb-2">
                    <strong>Trigger:</strong> {analysis.triggers.primary_trigger}
                  </p>
                  <p className="text-sm text-orange-800">
                    <strong>Belief:</strong> {analysis.triggers.underlying_belief}
                  </p>
                </div>
              </div>

              {/* Recommended Skills */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Skill Development
                </h5>
                <div className="space-y-2">
                  {analysis.recommended_skills.map((skill, index) => (
                    <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="font-medium text-yellow-800 capitalize">{skill.skill}</p>
                      <p className="text-sm text-yellow-700">{skill.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro Experiment */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Your Next Experiment
                </h5>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Try this:</strong> {analysis.micro_experiment.action}
                  </p>
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Observe:</strong> {analysis.micro_experiment.what_to_observe}
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>Success looks like:</strong> {analysis.micro_experiment.success_indicator}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            {error.includes("Analysis failed") && (
              <button onClick={analyzeReflection} className="mt-2 text-xs text-red-700 underline hover:text-red-900">
                Try again
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveReflection}
            disabled={!transcription}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              transcription
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InteractionsPage() {
  const router = useRouter()
  const params = useParams()
  const [isVisible, setIsVisible] = useState(false)
  const [showReflectModal, setShowReflectModal] = useState(false)

  const personId = Number.parseInt(params.personId as string)
  const person = interactionData[personId as keyof typeof interactionData]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }

  const handlePlay = () => {
    router.push(`/task-letter/${personId}`)
  }

  const renderHearts = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Heart key={i} className={`w-4 h-4 ${i < count ? "text-red-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (!person) {
    return <div>Person not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl h-[800px] flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-orange-500" />
              </button>
            </div>

            {/* Person Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center text-3xl">
                {person.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-800">{person.name}</h1>
                  <button
                    onClick={handlePlay}
                    className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors shadow-md"
                  >
                    <Play className="w-4 h-4 text-white fill-current" />
                  </button>
                  <button
                    onClick={() => setShowReflectModal(true)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">Interaction History</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-orange-50 rounded-lg p-2">
                <div className="text-lg font-bold text-orange-600">{sampleInteractions.length}</div>
                <div className="text-xs text-gray-600">Interactions</div>
              </div>
              <div className="bg-red-50 rounded-lg p-2">
                <div className="text-lg font-bold text-red-600">
                  {(sampleInteractions.reduce((sum, i) => sum + i.hearts, 0) / sampleInteractions.length).toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Avg Rating</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600">
                  {sampleInteractions.filter((i) => i.hearts >= 4).length}
                </div>
                <div className="text-xs text-gray-600">Great Times</div>
              </div>
            </div>
          </div>

          {/* Interactions Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-4">
              {sampleInteractions.map((interaction, index) => (
                <div
                  key={interaction.id}
                  className={`${interaction.color} rounded-2xl p-4 border-2 shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? "slideInUp 0.6s ease-out forwards" : "none",
                  }}
                >
                  {/* Interaction Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{interaction.activity}</h3>
                      <p className="text-xs text-gray-600">{interaction.date}</p>
                    </div>
                    <div className="flex gap-1">{renderHearts(interaction.hearts)}</div>
                  </div>

                  {/* Reflection */}
                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <p className="text-xs text-gray-700 leading-relaxed italic">"{interaction.reflection}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Interaction Button */}
          <div className="p-4 bg-white border-t border-gray-100">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-medium transition-colors">
              Add New Interaction
            </button>
          </div>
        </div>
      </div>

      {/* Reflect Modal */}
      {showReflectModal && <ReflectModal person={person} onClose={() => setShowReflectModal(false)} />}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

"use client"

import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

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

const curiosityPrompts = [
  "What's a small choice you made recently that changed your day?",
  "Tell me about a belief you held as a kid—do you still?",
  "What's a moment when you felt truly seen?",
  "Describe someone who influenced you in college—and why.",
  "What's a question you wish people asked you more often?",
]

export default function TaskLetterPage() {
  const router = useRouter()
  const params = useParams()
  const [isVisible, setIsVisible] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [completedPrompts, setCompletedPrompts] = useState<number[]>([])

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

  const handlePromptComplete = () => {
    setCompletedPrompts([...completedPrompts, currentPrompt])
    if (currentPrompt < curiosityPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    }
  }

  const handlePromptSelect = (index: number) => {
    setCurrentPrompt(index)
  }

  if (!person) {
    return <div>Person not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Letter Container */}
        <div className="relative">
          {/* Letter Background */}
          <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-3xl shadow-2xl border-4 border-yellow-200 p-6 relative overflow-hidden">
            {/* Wax Seal */}
            <div className="absolute -top-4 right-8 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-700">
              <div className="text-white text-xs font-bold">M</div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={handleBack} className="p-2 hover:bg-yellow-200 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-orange-600" />
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-orange-800 mb-1">Task Letter</h1>
                <p className="text-sm text-orange-600">
                  For {person.name} {person.avatar}
                </p>
              </div>
              <div className="w-8"></div>
            </div>

            {/* Letter Content */}
            <div className="bg-white bg-opacity-60 rounded-2xl p-4 mb-6 border-2 border-orange-200">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-orange-800 mb-2">Curiosity Sparks!</h2>
                <p className="text-sm text-orange-700">Deepen your connection with meaningful conversation prompts.</p>
              </div>

              {/* Instructions */}
              <div className="bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200">
                <p className="text-xs text-orange-800 leading-relaxed">
                  <strong>How to play:</strong> Take turns asking these prompts. After each answer, spend 30 seconds
                  saying "That makes me wonder..." and share your thoughts!
                </p>
              </div>

              {/* Current Prompt */}
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-4 border-2 border-pink-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-700">PROMPT {currentPrompt + 1}/5</span>
                  {completedPrompts.includes(currentPrompt) && (
                    <CheckCircle className="w-4 h-4 text-green-600 fill-current" />
                  )}
                </div>
                <p className="text-sm font-medium text-purple-800 leading-relaxed">
                  "{curiosityPrompts[currentPrompt]}"
                </p>
              </div>

              {/* Prompt Navigation */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {curiosityPrompts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptSelect(index)}
                    className={`aspect-square rounded-lg text-xs font-bold transition-all duration-200 ${
                      index === currentPrompt
                        ? "bg-purple-500 text-white scale-110"
                        : completedPrompts.includes(index)
                          ? "bg-green-400 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePromptComplete}
                  disabled={completedPrompts.includes(currentPrompt)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    completedPrompts.includes(currentPrompt)
                      ? "bg-green-400 text-white cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 active:scale-95"
                  }`}
                >
                  {completedPrompts.includes(currentPrompt) ? "✓ Completed" : "Mark Complete"}
                </button>
                {currentPrompt < curiosityPrompts.length - 1 && (
                  <button
                    onClick={() => setCurrentPrompt(currentPrompt + 1)}
                    className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="text-center">
              <div className="bg-orange-200 rounded-full h-2 mb-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedPrompts.length / curiosityPrompts.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-700">
                {completedPrompts.length} of {curiosityPrompts.length} prompts completed
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-6 h-6 bg-yellow-300 rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 bg-pink-300 rounded-full opacity-60"></div>
            <div className="absolute top-1/2 left-2 w-3 h-3 bg-purple-300 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

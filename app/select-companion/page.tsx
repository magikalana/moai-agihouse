"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { useEffect, useState } from "react"

const animals = [
  { id: "cat", name: "Cat", emoji: "🐱" },
  { id: "dog", name: "Dog", emoji: "🐶" },
  { id: "fox", name: "Fox", emoji: "🦊" },
  { id: "rabbit", name: "Rabbit", emoji: "🐰" },
  { id: "elephant", name: "Elephant", emoji: "🐘" },
  { id: "whale", name: "Whale", emoji: "🐋" },
  { id: "bird", name: "Bird", emoji: "🐦" },
  { id: "turtle", name: "Turtle", emoji: "🐢" },
  { id: "penguin", name: "Penguin", emoji: "🐧" },
  { id: "bear", name: "Bear", emoji: "🐻" },
  { id: "frog", name: "Frog", emoji: "🐸" },
  { id: "giraffe", name: "Giraffe", emoji: "🦒" },
]

export default function SelectCompanionPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1) // 1: Select animal, 2: Name companion
  const [selectedAnimal, setSelectedAnimal] = useState<(typeof animals)[0] | null>(null)
  const [companionName, setCompanionName] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Check if we're editing an existing companion
    const companionData = localStorage.getItem("moai-companion")
    if (companionData) {
      const existing = JSON.parse(companionData)
      setSelectedAnimal(existing.animal)
      setCompanionName(existing.name)
      setIsEditing(true)
      setCurrentStep(2) // Go directly to naming step for editing
    }
  }, [])

  const handleBack = () => {
    if (currentStep === 1) {
      router.back()
    } else {
      setCurrentStep(1)
    }
  }

  const handleAnimalSelect = (animal: (typeof animals)[0]) => {
    setSelectedAnimal(animal)
    setCurrentStep(2)
  }

  const handleComplete = () => {
    if (selectedAnimal && companionName.trim()) {
      // Save companion data to localStorage
      const companionData = {
        animal: selectedAnimal,
        name: companionName.trim(),
      }
      localStorage.setItem("moai-companion", JSON.stringify(companionData))
      router.push("/journey")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[800px] flex flex-col">
          {/* Step 1: Select Animal */}
          {currentStep === 1 && (
            <>
              {/* Header */}
              <div className="bg-white px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {isEditing ? "Change Your Companion" : "Choose Your Companion"}
                </h1>
                <p className="text-gray-600 text-sm">Select an animal friend to accompany you on your journey</p>
              </div>

              {/* Animal Selection */}
              <div className="flex-1 bg-gradient-to-b from-yellow-50 to-orange-50 p-6 flex flex-col justify-center">
                {/* Animal Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {animals.map((animal) => (
                    <button
                      key={animal.id}
                      onClick={() => handleAnimalSelect(animal)}
                      className="aspect-square bg-white rounded-2xl flex flex-col items-center justify-center hover:bg-orange-100 hover:scale-105 transition-all duration-200 shadow-sm border-2 border-transparent hover:border-orange-300 p-3"
                    >
                      <div className="text-4xl mb-1">{animal.emoji}</div>
                      <span className="text-xs font-medium text-gray-600">{animal.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2: Name Companion */}
          {currentStep === 2 && selectedAnimal && (
            <>
              {/* Header */}
              <div className="bg-white px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {isEditing ? "Customize Your Companion" : "Name Your Companion"}
                </h1>
                <p className="text-gray-600 text-sm">Give your {selectedAnimal.name.toLowerCase()} friend a name</p>
              </div>

              {/* Name Input */}
              <div className="flex-1 flex flex-col justify-center bg-gradient-to-b from-yellow-50 to-orange-50 p-8">
                {/* Selected Animal Preview */}
                <div className="flex justify-center mb-8">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
                    <div className="text-6xl">{selectedAnimal.emoji}</div>
                  </div>
                </div>

                {/* Name input field */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="companionName" className="block text-sm font-medium text-gray-700 mb-2">
                      Companion Name
                    </label>
                    <input
                      type="text"
                      id="companionName"
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                      placeholder={`Name your ${selectedAnimal.name.toLowerCase()}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-center"
                      maxLength={20}
                      autoFocus
                    />
                  </div>

                  {/* Character count */}
                  <div className="text-center">
                    <span className="text-xs text-gray-500">{companionName.length}/20 characters</span>
                  </div>

                  {/* Change Animal Button */}
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-orange-600 hover:text-orange-800 underline"
                    >
                      Change animal
                    </button>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <div className="p-6 bg-white">
                <button
                  onClick={handleComplete}
                  disabled={!companionName.trim()}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                    companionName.trim()
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-5 h-5" />
                  {isEditing ? "Save Changes" : "Complete"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

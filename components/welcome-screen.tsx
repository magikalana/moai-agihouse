"use client"

import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onContinue: () => void
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl h-[800px] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="relative mb-16">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 flex items-center justify-center shadow-2xl">
            <div className="w-52 h-52 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <h1 className="text-6xl font-bold text-gray-800">Moai</h1>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-gray-700 text-lg text-center font-medium">Learn to build deeper relationships</p>
      </div>

      {/* Continue button */}
      <div className="p-8">
        <Button
          onClick={onContinue}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg rounded-2xl"
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function WelcomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleContinue = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.push("/journey")
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl h-[800px] flex flex-col">
          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            {/* Logo */}
            <div className="relative mb-16">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 flex items-center justify-center shadow-2xl animate-pulse">
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
              onClick={handleContinue}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

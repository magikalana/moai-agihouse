"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Search, Grid3X3, Circle } from "lucide-react"
import { useEffect, useState } from "react"

// Sample people data organized by relationship closeness (inner to outer circles)
const moaiCircles = {
  center: [{ id: 1, name: "You", avatar: "👩🏻‍🦰", x: 50, y: 50 }],
  innerCircle: [
    { id: 2, name: "Sarah", avatar: "👨🏻", x: 45, y: 35 },
    { id: 3, name: "Mike", avatar: "👩🏻‍🦱", x: 65, y: 40 },
    { id: 4, name: "Lisa", avatar: "👨🏻‍🦲", x: 55, y: 65 },
  ],
  middleCircle: [
    { id: 5, name: "Emma", avatar: "👩🏼", x: 30, y: 25 },
    { id: 6, name: "James", avatar: "👨🏽", x: 70, y: 20 },
    { id: 7, name: "Anna", avatar: "👩🏻‍🦳", x: 80, y: 45 },
    { id: 8, name: "Carlos", avatar: "👨🏽‍🦱", x: 75, y: 70 },
    { id: 9, name: "Maya", avatar: "👩🏾", x: 45, y: 80 },
    { id: 10, name: "Tom", avatar: "👨🏼‍🦰", x: 25, y: 70 },
    { id: 11, name: "Zoe", avatar: "👩🏽", x: 20, y: 45 },
    { id: 12, name: "Alex", avatar: "👨🏻‍🦱", x: 25, y: 25 },
  ],
  outerCircle: [
    { id: 13, name: "Nina", avatar: "👩🏻", x: 15, y: 15 },
    { id: 14, name: "Ryan", avatar: "👨🏼", x: 50, y: 10 },
    { id: 15, name: "Sophia", avatar: "👩🏽‍🦱", x: 85, y: 15 },
    { id: 16, name: "Ben", avatar: "👨🏾", x: 90, y: 50 },
    { id: 17, name: "Grace", avatar: "👩🏼‍🦳", x: 85, y: 85 },
    { id: 18, name: "Leo", avatar: "👨🏽‍🦲", x: 50, y: 90 },
    { id: 19, name: "Mia", avatar: "👩🏾‍🦱", x: 15, y: 85 },
    { id: 20, name: "Jake", avatar: "👨🏻‍🦳", x: 10, y: 50 },
    { id: 21, name: "Olivia", avatar: "👩🏼‍🦱", x: 35, y: 12 },
    { id: 22, name: "Ethan", avatar: "👨🏽‍🦰", x: 65, y: 12 },
    { id: 23, name: "Ava", avatar: "👩🏻‍🦰", x: 88, y: 30 },
    { id: 24, name: "Noah", avatar: "👨🏻‍🦲", x: 88, y: 70 },
    { id: 25, name: "Emma", avatar: "👩🏽", x: 65, y: 88 },
    { id: 26, name: "Liam", avatar: "👨🏾‍🦱", x: 35, y: 88 },
    { id: 27, name: "Chloe", avatar: "👩🏾‍🦳", x: 12, y: 70 },
    { id: 28, name: "Mason", avatar: "👨🏼‍🦳", x: 12, y: 30 },
  ],
}

export default function MyMoaiCirclesPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }

  const handlePersonClick = (person: any) => {
    if (person.id === 1) return // Don't navigate for center person (you)
    setSelectedPerson(person)
    setTimeout(() => {
      router.push(`/interactions/${person.id}`)
    }, 200)
  }

  const handleProfileClick = () => {
    router.push("/create-avatar")
  }

  const getCircleSize = (circle: string) => {
    switch (circle) {
      case "center":
        return "w-16 h-16 text-2xl"
      case "innerCircle":
        return "w-12 h-12 text-lg"
      case "middleCircle":
        return "w-10 h-10 text-base"
      case "outerCircle":
        return "w-8 h-8 text-sm"
      default:
        return "w-10 h-10 text-base"
    }
  }

  const getCircleColor = (circle: string) => {
    switch (circle) {
      case "center":
        return "bg-gradient-to-br from-red-400 to-red-500 ring-4 ring-red-300"
      case "innerCircle":
        return "bg-gradient-to-br from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500"
      case "middleCircle":
        return "bg-gradient-to-br from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500"
      case "outerCircle":
        return "bg-gradient-to-br from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400"
      default:
        return "bg-gradient-to-br from-yellow-300 to-yellow-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[800px] flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-orange-500" />
              </button>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <button
                  onClick={handleProfileClick}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="text-lg">👩🏻‍🦰</div>
                </button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-red-400">My Moai</h1>
          </div>

          {/* Circular Moai Display */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100">
            {/* Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer circle background */}
              <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 opacity-60"></div>
              {/* Middle circle background */}
              <div className="absolute w-60 h-60 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300 opacity-70"></div>
              {/* Inner circle background */}
              <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 opacity-80"></div>
              {/* Center circle background */}
              <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-500 opacity-90"></div>
            </div>

            {/* People positioned in circles */}
            <div className="absolute inset-0">
              {/* Center person (You) */}
              {moaiCircles.center.map((person) => (
                <div
                  key={person.id}
                  className={`absolute ${getCircleSize("center")} ${getCircleColor("center")} rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200`}
                  style={{
                    left: `${person.x}%`,
                    top: `${person.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => handlePersonClick(person)}
                >
                  <div>{person.avatar}</div>
                </div>
              ))}

              {/* Inner Circle */}
              {moaiCircles.innerCircle.map((person, index) => (
                <div
                  key={person.id}
                  className={`absolute ${getCircleSize("innerCircle")} ${getCircleColor("innerCircle")} rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-200 hover:scale-110 ${
                    selectedPerson?.id === person.id ? "ring-2 ring-blue-400" : ""
                  }`}
                  style={{
                    left: `${person.x}%`,
                    top: `${person.y}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? "bounceIn 0.6s ease-out forwards" : "none",
                  }}
                  onClick={() => handlePersonClick(person)}
                >
                  <div>{person.avatar}</div>
                </div>
              ))}

              {/* Middle Circle */}
              {moaiCircles.middleCircle.map((person, index) => (
                <div
                  key={person.id}
                  className={`absolute ${getCircleSize("middleCircle")} ${getCircleColor("middleCircle")} rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-200 hover:scale-110 ${
                    selectedPerson?.id === person.id ? "ring-2 ring-blue-400" : ""
                  }`}
                  style={{
                    left: `${person.x}%`,
                    top: `${person.y}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${(index + 4) * 80}ms`,
                    animation: isVisible ? "bounceIn 0.6s ease-out forwards" : "none",
                  }}
                  onClick={() => handlePersonClick(person)}
                >
                  <div>{person.avatar}</div>
                </div>
              ))}

              {/* Outer Circle */}
              {moaiCircles.outerCircle.map((person, index) => (
                <div
                  key={person.id}
                  className={`absolute ${getCircleSize("outerCircle")} ${getCircleColor("outerCircle")} rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200 hover:scale-110 ${
                    selectedPerson?.id === person.id ? "ring-2 ring-blue-400" : ""
                  }`}
                  style={{
                    left: `${person.x}%`,
                    top: `${person.y}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${(index + 12) * 60}ms`,
                    animation: isVisible ? "bounceIn 0.6s ease-out forwards" : "none",
                  }}
                  onClick={() => handlePersonClick(person)}
                >
                  <div>{person.avatar}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-md">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500"></div>
                  <span>You</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-300 to-orange-400"></div>
                  <span>Close Friends</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400"></div>
                  <span>Good Friends</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300"></div>
                  <span>Acquaintances</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-around">
              <div
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                onClick={() => router.push("/")}
              >
                <Search className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Home</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                <Grid3X3 className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Discover</span>
              </div>
              <div className="flex flex-col items-center">
                <Circle className="w-6 h-6 text-orange-500 fill-current mb-1" />
                <span className="text-xs text-orange-500 font-medium">My Moai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

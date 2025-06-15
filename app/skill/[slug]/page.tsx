"use client"

import { useRouter, useParams } from "next/navigation"
import { Bell, ArrowLeft, MessageCircle, TrendingUp, Heart } from "lucide-react"
import { useEffect, useState } from "react"

const skillData = {
  "interpersonal-curiosity": {
    title: "Interpersonal Curiosity",
    color: "text-red-400",
  },
  "active-listening": {
    title: "Active Listening",
    color: "text-red-400",
  },
  empathy: {
    title: "Empathy",
    color: "text-red-400",
  },
  "effective-communication": {
    title: "Effective Communication",
    color: "text-red-400",
  },
  "culture-of-care": {
    title: "Culture of Care",
    color: "text-red-400",
  },
}

const levels = [
  { id: 1, completed: true, x: 20, y: 15 },
  { id: 2, completed: true, x: 70, y: 25 },
  { id: 3, completed: false, x: 30, y: 45 },
  { id: 4, completed: false, x: 75, y: 60 },
  { id: 5, completed: false, x: 25, y: 80 },
]

export default function SkillPage() {
  const router = useRouter()
  const params = useParams()
  const [isVisible, setIsVisible] = useState(false)

  const skillSlug = params.slug as string
  const skill = skillData[skillSlug as keyof typeof skillData]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.push("/journey")
    }, 300)
  }

  if (!skill) {
    return <div>Skill not found</div>
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
            <div className="flex items-center justify-between mb-2">
              <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-orange-500" />
              </button>
              <Bell className="w-6 h-6 text-gray-400" />
            </div>
            <h1 className={`text-xl font-bold ${skill.color}`}>{skill.title}</h1>
          </div>

          {/* Skill Path */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-yellow-50 to-yellow-100">
            {/* Path Background */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 20,15 Q 50,20 70,25 Q 60,35 30,45 Q 50,50 75,60 Q 40,70 25,80"
                stroke="#FDE68A"
                strokeWidth="8"
                fill="none"
                className="opacity-60"
              />
            </svg>

            {/* Level Circles */}
            {levels.map((level, index) => (
              <div
                key={level.id}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 ${
                  level.completed
                    ? "bg-gradient-to-br from-yellow-300 to-orange-400"
                    : level.id === 3 // Next available level
                      ? "bg-gradient-to-br from-yellow-300 to-orange-400 ring-4 ring-orange-300 ring-opacity-50"
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                }`}
                style={{
                  left: `${level.x}%`,
                  top: `${level.y}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${index * 200}ms`,
                  animation: isVisible ? "bounceIn 0.6s ease-out forwards" : "none",
                }}
                onClick={() => {
                  if (level.completed || level.id === 3) {
                    router.push("/my-moai")
                  }
                }}
              >
                <div className="text-white text-xl">⭐</div>
              </div>
            ))}

            {/* Character Illustrations */}
            <div className="absolute left-4 top-32 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="text-2xl">👥</div>
            </div>

            <div className="absolute right-4 bottom-32 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="text-2xl">🎉</div>
            </div>

            {/* Speech Bubble */}
            <div className="absolute right-8 top-40 bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-700 font-medium">{"Let's keep practicing"}</div>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-yellow-200 px-6 py-4">
            <div className="flex items-center justify-around">
              <div
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                onClick={() => router.push("/memories")}
              >
                <Heart className="w-6 h-6 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Memories</span>
              </div>
              <div
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                onClick={() => router.push("/my-moai-circles")}
              >
                <div className="w-6 h-6 bg-orange-400 rounded-full mb-1"></div>
                <span className="text-xs text-gray-600">My Moai</span>
              </div>
              <div
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                onClick={() => router.push("/journey")}
              >
                <TrendingUp className="w-6 h-6 text-orange-500 mb-1" />
                <span className="text-xs text-orange-500 font-medium">My Journey</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                <MessageCircle className="w-6 h-6 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Chat</span>
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

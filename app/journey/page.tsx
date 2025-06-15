"use client"

import { useRouter } from "next/navigation"
import { Bell, MessageCircle, TrendingUp, ArrowLeft, Plus, Settings, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { LogoutButton } from "@/components/logout-button"

const journeyItems = [
  {
    title: "Interpersonal Curiosity",
    subtitle: "Asking meaningful Questions",
    color: "bg-yellow-200",
    illustration: "👥",
  },
  {
    title: "Active Listening",
    subtitle: "Paying attention",
    color: "bg-yellow-300",
    illustration: "👂",
  },
  {
    title: "Empathy",
    subtitle: "Perspective taking",
    color: "bg-yellow-200",
    illustration: "🤝",
  },
  {
    title: "Effective Communication",
    subtitle: "Respectful expression",
    color: "bg-orange-300",
    illustration: "💬",
  },
  {
    title: "Culture of Care",
    subtitle: "Inclusivity and adaptability",
    color: "bg-red-300",
    illustration: "❤️",
  },
]

interface CompanionData {
  animal: {
    id: string
    name: string
    emoji: string
  }
  name: string
}

export default function JourneyPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [companion, setCompanion] = useState<CompanionData | null>(null)

  useEffect(() => {
    setIsVisible(true)

    // Load companion data
    const companionData = localStorage.getItem("moai-companion")
    if (companionData) {
      setCompanion(JSON.parse(companionData))
    }
  }, [])

  // Reload companion data when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      const companionData = localStorage.getItem("moai-companion")
      if (companionData) {
        setCompanion(JSON.parse(companionData))
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.push("/")
    }, 300)
  }

  const handleCompanionCustomize = () => {
    router.push("/select-companion")
  }

  const handleChatClick = () => {
    if (companion) {
      router.push("/companion-chat")
    } else {
      router.push("/select-companion")
    }
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
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-gray-400" />
                <LogoutButton showText={false} />
                {/* Companion Icon */}
                <div className="relative">
                  <button
                    onClick={handleCompanionCustomize}
                    className="relative w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                  >
                    {companion ? (
                      <div className="text-2xl">{companion.animal.emoji}</div>
                    ) : (
                      <Plus className="w-6 h-6 text-white" />
                    )}

                    {/* Settings overlay on hover */}
                    {companion && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>

                  {!companion && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-red-400 mb-1">My Journey</h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">{"Let's keep expanding your Moai!"}</p>
              {companion && <p className="text-xs text-orange-600 font-medium">with {companion.name}</p>}
            </div>
          </div>

          {/* Journey Cards */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {journeyItems.map((item, index) => (
                <div
                  key={index}
                  className={`${item.color} rounded-2xl p-4 h-32 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95`}
                  onClick={() => {
                    const skillSlug = item.title.toLowerCase().replace(/\s+/g, "-")
                    router.push(`/skill/${skillSlug}`)
                  }}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? "slideInUp 0.6s ease-out forwards" : "none",
                  }}
                >
                  {/* Illustration placeholder */}
                  <div className="absolute top-2 right-2 text-2xl opacity-60">{item.illustration}</div>

                  <div className="flex-1 flex flex-col justify-end">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-tight">{item.subtitle}</p>
                  </div>
                </div>
              ))}
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
              <div className="flex flex-col items-center">
                <TrendingUp className="w-6 h-6 text-orange-500 mb-1" />
                <span className="text-xs text-orange-500 font-medium">My Journey</span>
              </div>
              <div
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                onClick={handleChatClick}
              >
                <MessageCircle className={`w-6 h-6 mb-1 ${companion ? "text-orange-500" : "text-gray-600"}`} />
                <span className={`text-xs ${companion ? "text-orange-500 font-medium" : "text-gray-600"}`}>Chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

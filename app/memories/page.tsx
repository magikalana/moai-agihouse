"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

// All 6 uploaded photos as polaroid memories
const memories = [
  {
    id: 1,
    personName: "Sarah & Emma",
    personAvatar: "👩🏻‍🦰👩🏼",
    memory: "Late night heart-to-heart",
    description:
      "One of those perfect nights where we talked until 3am about everything and nothing. These are the moments that matter most.",
    date: "2 days ago",
    hearts: 5,
    photo: "/memory-photos/friends-embrace.png",
    backgroundColor: "bg-amber-50",
  },
  {
    id: 2,
    personName: "The Squad",
    personAvatar: "👥",
    memory: "Epic group hangout",
    description:
      "When we all decided to lie in a circle and just laugh until our stomachs hurt. Pure joy captured in a moment.",
    date: "1 week ago",
    hearts: 5,
    photo: "/memory-photos/group-circle.png",
    backgroundColor: "bg-blue-50",
  },
  {
    id: 3,
    personName: "Lisa & Me",
    personAvatar: "👩🏻‍🦱👩🏻‍🦰",
    memory: "Getting ready together",
    description:
      "Those quiet moments getting ready, doing each other's makeup, and just being completely ourselves. Friendship at its purest.",
    date: "2 weeks ago",
    hearts: 4,
    photo: "/memory-photos/kitchen-moment.png",
    backgroundColor: "bg-pink-50",
  },
  {
    id: 4,
    personName: "Brunch Squad",
    personAvatar: "🥐👥",
    memory: "Sunday brunch picnic",
    description:
      "Perfect morning sharing food and stories outdoors. Everyone reaching for the same dish, flowers everywhere, pure happiness.",
    date: "3 weeks ago",
    hearts: 4,
    photo: "/memory-photos/picnic-brunch.png",
    backgroundColor: "bg-green-50",
  },
  {
    id: 5,
    personName: "Birthday Crew",
    personAvatar: "🎂👥",
    memory: "22nd Birthday Magic",
    description:
      "The most perfect birthday celebration with my favorite people. String lights, cake, and endless hugs. 22.08.21 forever.",
    date: "22.08.21",
    hearts: 5,
    photo: "/memory-photos/birthday-celebration.png",
    backgroundColor: "bg-orange-50",
  },
  {
    id: 6,
    personName: "Anna",
    personAvatar: "👩🏻‍🦳",
    memory: "Quiet portrait moment",
    description:
      "Sometimes the most beautiful memories are the quiet ones. Just being present with each other in perfect light.",
    date: "1 month ago",
    hearts: 4,
    photo: "/memory-photos/portrait-moment.png",
    backgroundColor: "bg-purple-50",
  },
]

export default function MemoriesPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }

  const nextMemory = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % memories.length)
      setIsFlipping(false)
    }, 150)
  }

  const prevMemory = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length)
      setIsFlipping(false)
    }, 150)
  }

  const currentMemory = memories[currentIndex]

  const renderHearts = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Heart key={i} className={`w-3 h-3 ${i < count ? "text-red-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
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
              <div className="text-center">
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} of {memories.length}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-orange-500 mb-1">Memories</h1>
            <p className="text-gray-600 text-sm">Your special moments together</p>
          </div>

          {/* Polaroid Stack */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50 p-6">
            {/* Background polaroids (stack effect) */}
            <div className="absolute inset-6">
              {/* Third polaroid (bottom) */}
              <div
                className="absolute inset-0 bg-white rounded-lg shadow-lg transform rotate-2 translate-x-1 translate-y-2"
                style={{ zIndex: 1 }}
              ></div>
              {/* Second polaroid (middle) */}
              <div
                className="absolute inset-0 bg-white rounded-lg shadow-lg transform -rotate-1 translate-x-0.5 translate-y-1"
                style={{ zIndex: 2 }}
              ></div>
              {/* Top polaroid (current) */}
              <div
                className={`absolute inset-0 bg-white rounded-lg shadow-xl transform transition-all duration-300 ${
                  isFlipping ? "scale-95 rotate-3" : "rotate-0"
                }`}
                style={{ zIndex: 3 }}
              >
                {/* Polaroid Content */}
                <div className="p-4 h-full flex flex-col">
                  {/* Photo Area - Authentic Polaroid Style */}
                  <div className="bg-white rounded-sm flex-1 mb-4 relative overflow-hidden shadow-inner">
                    {/* Actual Photo */}
                    <div className="absolute inset-2 rounded-sm overflow-hidden bg-gray-100">
                      <img
                        src={currentMemory.photo || "/placeholder.svg"}
                        alt={currentMemory.memory}
                        className="w-full h-full object-cover"
                        style={{
                          filter: "sepia(8%) saturate(108%) contrast(103%) brightness(101%)",
                        }}
                      />

                      {/* Vintage Photo Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-3"></div>

                      {/* Photo Corner Curl Effect */}
                      <div className="absolute top-1 right-1 w-3 h-3 bg-white opacity-15 transform rotate-45"></div>
                    </div>

                    {/* Polaroid Shadow/Depth */}
                    <div className="absolute inset-0 shadow-inner rounded-sm"></div>
                  </div>

                  {/* Polaroid Caption Area - Handwritten Style */}
                  <div className="bg-white px-2 py-3 min-h-[80px] flex flex-col justify-center">
                    {/* Handwritten-style memory title */}
                    <div className="text-center mb-2">
                      <h3
                        className="font-handwriting text-gray-800 text-base leading-relaxed"
                        style={{ fontFamily: "cursive" }}
                      >
                        {currentMemory.memory}
                      </h3>
                    </div>

                    {/* Memory details */}
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-xs text-gray-600">{currentMemory.personName}</span>
                        <div className="flex gap-0.5">{renderHearts(currentMemory.hearts)}</div>
                      </div>
                      <p className="text-xs text-gray-500 italic leading-relaxed px-1">{currentMemory.description}</p>
                      <span className="text-xs text-gray-400 block mt-2">{currentMemory.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
              <button
                onClick={prevMemory}
                disabled={isFlipping}
                className="p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 text-orange-500" />
              </button>
            </div>

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
              <button
                onClick={nextMemory}
                disabled={isFlipping}
                className="p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex gap-2">
                {memories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isFlipping) {
                        setIsFlipping(true)
                        setTimeout(() => {
                          setCurrentIndex(index)
                          setIsFlipping(false)
                        }, 150)
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex ? "bg-orange-500 scale-125" : "bg-white bg-opacity-60 hover:bg-opacity-80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Vintage Dust/Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-3">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-amber-100 to-transparent"></div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-around">
              <div
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                onClick={() => router.push("/")}
              >
                <div className="w-6 h-6 bg-gray-400 rounded-full mb-1"></div>
                <span className="text-xs text-gray-500">Home</span>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="w-6 h-6 text-orange-500 fill-current mb-1" />
                <span className="text-xs text-orange-500 font-medium">Memories</span>
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
                <div className="w-6 h-6 bg-gray-400 rounded-full mb-1"></div>
                <span className="text-xs text-gray-600">Journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flipCard {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
        
        .font-handwriting {
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
        }
      `}</style>
    </div>
  )
}

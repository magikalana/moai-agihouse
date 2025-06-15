"use client"

import { useRouter } from "next/navigation"
import { Camera, ArrowLeft, Check } from "lucide-react"
import { useEffect, useState, useRef } from "react"

export default function CreateAvatarPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1) // 1: Take selfie, 2: Add name, 3: Creating, 4: Complete
  const [userName, setUserName] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (currentStep === 1) {
      startCamera()
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [currentStep])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        // Flip the image horizontally for selfie effect
        context.scale(-1, 1)
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)

        // Stop camera
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }

        // Move to name input step
        setCurrentStep(2)
      }
    }
  }

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setCurrentStep(3)
      setIsProcessing(true)

      // Simulate processing time
      setTimeout(() => {
        setIsProcessing(false)
        setCurrentStep(4)
      }, 3000)
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      router.back()
    } else if (currentStep === 2) {
      setCurrentStep(1)
      startCamera()
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    router.push("/my-moai-circles")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[800px] flex flex-col">
          {/* Step 1: Take Selfie */}
          {currentStep === 1 && (
            <>
              {/* Header */}
              <div className="bg-white px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Take a selfie</h1>
              </div>

              {/* Camera View */}
              <div className="flex-1 relative bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }} // Mirror effect for selfie
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />

                {/* Camera overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-white border-opacity-50 rounded-3xl"></div>
                </div>
              </div>

              {/* Capture Button */}
              <div className="p-6 bg-white">
                <button
                  onClick={takeSelfie}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  Capture
                </button>
              </div>
            </>
          )}

          {/* Step 2: Add Name */}
          {currentStep === 2 && (
            <>
              {/* Header */}
              <div className="bg-white px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">What's your name?</h1>
                <p className="text-gray-600 text-sm">This will be displayed in your profile</p>
              </div>

              {/* Name Input */}
              <div className="flex-1 flex flex-col justify-center bg-gradient-to-b from-yellow-50 to-orange-50 p-8">
                {/* Preview of captured selfie */}
                {capturedImage && (
                  <div className="flex justify-center mb-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={capturedImage || "/placeholder.svg"}
                        alt="Your selfie"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Name input field */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-center"
                      maxLength={30}
                      autoFocus
                    />
                  </div>

                  {/* Character count */}
                  <div className="text-center">
                    <span className="text-xs text-gray-500">{userName.length}/30 characters</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="p-6 bg-white">
                <button
                  onClick={handleNameSubmit}
                  disabled={!userName.trim()}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors ${
                    userName.trim()
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Creating Avatar */}
          {currentStep === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50 p-8">
              <div className="relative mb-8">
                {/* Animated loading circle */}
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
                  <div className="text-white text-lg font-bold">Creating your character</div>
                </div>
              </div>

              {/* Processing text */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <p className="text-gray-600">This might take a moment...</p>
              </div>
            </div>
          )}

          {/* Step 4: Avatar Complete */}
          {currentStep === 4 && (
            <>
              {/* Header */}
              <div className="bg-white px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
              </div>

              {/* Avatar Display */}
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50 p-8">
                <div className="relative mb-8">
                  {/* Avatar circle */}
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-2xl">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center overflow-hidden">
                      {/* Show the actual captured selfie or fallback to emoji */}
                      {capturedImage ? (
                        <img
                          src={capturedImage || "/placeholder.svg"}
                          alt="Your avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl">👩🏻‍🦰</div>
                      )}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full opacity-80"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-300 rounded-full opacity-60"></div>
                </div>

                {/* Greeting with user's name */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Hello, {userName}!</h2>
                  <p className="text-gray-600">Your avatar is ready</p>
                </div>
              </div>

              {/* Get Started Button */}
              <div className="p-6 bg-white">
                <button
                  onClick={handleComplete}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg transition-colors"
                >
                  Get started
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

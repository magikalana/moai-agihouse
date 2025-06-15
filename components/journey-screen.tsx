import { Bell, Gift, MessageCircle, TrendingUp } from "lucide-react"

interface JourneyScreenProps {
  onBack: () => void
}

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

export default function JourneyScreen({ onBack }: JourneyScreenProps) {
  return (
    <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl h-[800px] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div></div>
          <Bell className="w-6 h-6 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-red-400 mb-1">My Journey</h1>
        <p className="text-gray-600 text-sm">{"Let's keep expanding your Moai!"}</p>
      </div>

      {/* Journey Cards */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {journeyItems.map((item, index) => (
            <div
              key={index}
              className={`${item.color} rounded-2xl p-4 h-32 flex flex-col justify-between relative overflow-hidden`}
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
          <div className="flex flex-col items-center">
            <Gift className="w-6 h-6 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Rewards</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-orange-400 rounded-full mb-1"></div>
            <span className="text-xs text-gray-600">My Moai</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="w-6 h-6 text-orange-500 mb-1" />
            <span className="text-xs text-orange-500 font-medium">My Journey</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="w-6 h-6 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Chat</span>
          </div>
        </div>
      </div>
    </div>
  )
}

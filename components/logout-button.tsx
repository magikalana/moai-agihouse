"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  className?: string
  showText?: boolean
}

export function LogoutButton({ className = "", showText = true }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("moai-authenticated")
    localStorage.removeItem("moai-companion")
    localStorage.removeItem("moai-user")
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ${className}`}
      title="Sign out"
    >
      <LogOut className="w-5 h-5" />
      {showText && <span className="text-sm">Sign out</span>}
    </button>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem("moai-authenticated")
      const isLoginPage = pathname === "/login"

      if (authenticated === "true") {
        setIsAuthenticated(true)
        // If user is authenticated and on login page, redirect to home
        if (isLoginPage) {
          router.push("/")
        }
      } else {
        setIsAuthenticated(false)
        // If user is not authenticated and not on login page, redirect to login
        if (!isLoginPage) {
          router.push("/login")
        }
      }
    }

    checkAuth()

    // Listen for storage changes (in case user logs out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "moai-authenticated") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router, pathname])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 flex items-center justify-center shadow-2xl mx-auto mb-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">M</span>
            </div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated && pathname !== "/login") {
    return null // Router will handle redirect
  }

  // Show children if authenticated or on login page
  return <>{children}</>
}

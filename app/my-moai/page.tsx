"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Search, Grid3X3, Circle, UserPlus, Move, X } from "lucide-react"
import { useEffect, useState } from "react"

// Sample avatar data organized by relationship type
const initialPeople = {
  loves: [
    { id: 1, name: "Sarah", avatar: "👩🏻‍🦰" },
    { id: 2, name: "Mike", avatar: "👨🏻" },
    { id: 3, name: "Lisa", avatar: "👩🏻‍🦱" },
  ],
  sympathy: [
    { id: 4, name: "David", avatar: "👨🏻‍🦲" },
    { id: 5, name: "Emma", avatar: "👩🏼" },
    { id: 6, name: "James", avatar: "👨🏽" },
    { id: 7, name: "Anna", avatar: "👩🏻‍🦳" },
  ],
  "social-group": [
    { id: 8, name: "Carlos", avatar: "👨🏽‍🦱" },
    { id: 9, name: "Maya", avatar: "👩🏾" },
    { id: 10, name: "Tom", avatar: "👨🏼‍🦰" },
    { id: 11, name: "Zoe", avatar: "👩🏽" },
    { id: 12, name: "Alex", avatar: "👨🏻‍🦱" },
  ],
  network: [
    { id: 13, name: "Nina", avatar: "👩🏻" },
    { id: 14, name: "Ryan", avatar: "👨🏼" },
    { id: 15, name: "Sophia", avatar: "👩🏽‍🦱" },
    { id: 16, name: "Ben", avatar: "👨🏾" },
    { id: 17, name: "Grace", avatar: "👩🏼‍🦳" },
    { id: 18, name: "Leo", avatar: "👨🏽‍🦲" },
    { id: 19, name: "Mia", avatar: "👩🏾‍🦱" },
    { id: 20, name: "Jake", avatar: "👨🏻‍🦳" },
  ],
}

const availableAvatars = [
  { name: "Jordan", avatar: "👨🏽‍🦰" },
  { name: "Chloe", avatar: "👩🏼‍🦱" },
  { name: "Marcus", avatar: "👨🏾‍🦲" },
  { name: "Elena", avatar: "👩🏽‍🦰" },
  { name: "Tyler", avatar: "👨🏻‍🦱" },
  { name: "Aria", avatar: "👩🏻‍🦳" },
  { name: "Diego", avatar: "👨🏽‍🦳" },
  { name: "Ruby", avatar: "👩🏾‍🦰" },
]

type ColumnType = "loves" | "sympathy" | "social-group" | "network"
type Person = { id: number; name: string; avatar: string }

const columnLabels = {
  loves: "Loves",
  sympathy: "Sympathy",
  "social-group": "Social Group",
  network: "Network",
}

const columnColors = {
  loves: "bg-red-100 border-red-200",
  sympathy: "bg-orange-100 border-orange-200",
  "social-group": "bg-yellow-100 border-yellow-200",
  network: "bg-blue-100 border-blue-200",
}

export default function MyMoaiPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [people, setPeople] = useState(initialPeople)
  const [selectedPerson, setSelectedPerson] = useState<{ person: Person; column: ColumnType } | null>(null)
  const [moveMode, setMoveMode] = useState(false)
  const [showAddPeople, setShowAddPeople] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }

  const handlePersonClick = (person: Person, column: ColumnType) => {
    if (moveMode && selectedPerson) {
      // Move person to new column
      if (selectedPerson.column !== column) {
        movePerson(selectedPerson.person, selectedPerson.column, column)
      }
      setMoveMode(false)
      setSelectedPerson(null)
    } else {
      // Navigate to interaction history
      router.push(`/interactions/${person.id}`)
    }
  }

  const handleMoveClick = () => {
    if (selectedPerson) {
      setMoveMode(true)
    }
  }

  const movePerson = (person: Person, fromColumn: ColumnType, toColumn: ColumnType) => {
    setPeople((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((p) => p.id !== person.id),
      [toColumn]: [...prev[toColumn], person],
    }))
  }

  const addPersonToColumn = (newPerson: (typeof availableAvatars)[0], column: ColumnType) => {
    const newId =
      Math.max(
        ...Object.values(people)
          .flat()
          .map((p) => p.id),
      ) + 1
    const person = {
      id: newId,
      name: newPerson.name,
      avatar: newPerson.avatar,
    }

    setPeople((prev) => ({
      ...prev,
      [column]: [...prev[column], person],
    }))
    setShowAddPeople(false)
  }

  const cancelMove = () => {
    setMoveMode(false)
    setSelectedPerson(null)
  }

  const handlePersonSelect = (person: Person, column: ColumnType) => {
    if (!moveMode) {
      setSelectedPerson({ person, column })
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
                <ArrowLeft className="w-5 h-5 text-orange-500" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddPeople(!showAddPeople)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <UserPlus className="w-5 h-5 text-orange-500" />
                </button>
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-red-400">My Moai</h1>
            <p className="text-xs text-gray-500 mt-1">
              {moveMode ? "Click a column to move person" : "Click people to view interactions"}
            </p>
          </div>

          {/* Action Bar */}
          {selectedPerson && !moveMode && (
            <div className="bg-orange-50 px-6 py-3 border-b border-orange-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-lg">{selectedPerson.person.avatar}</div>
                  <span className="text-sm font-medium text-gray-700">{selectedPerson.person.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMoveClick}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-200 text-orange-700 rounded-full text-xs hover:bg-orange-300 transition-colors"
                  >
                    <Move className="w-3 h-3" />
                    Move
                  </button>
                </div>
              </div>
            </div>
          )}

          {moveMode && selectedPerson && (
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-lg">{selectedPerson.person.avatar}</div>
                  <span className="text-sm font-medium text-gray-700">Moving {selectedPerson.person.name}</span>
                </div>
                <button
                  onClick={cancelMove}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add People Panel */}
          {showAddPeople && (
            <div className="bg-white border-b border-gray-100 px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Add People to Your Moai</h3>
              <div className="space-y-2">
                {availableAvatars.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="text-lg">{person.avatar}</div>
                      <span className="text-sm text-gray-700">{person.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {(Object.keys(columnLabels) as ColumnType[]).map((column) => (
                        <button
                          key={column}
                          onClick={() => addPersonToColumn(person, column)}
                          className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          {columnLabels[column]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relationship Columns */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 h-full">
              {(Object.keys(columnLabels) as ColumnType[]).map((column) => (
                <div
                  key={column}
                  className={`border-r border-gray-200 last:border-r-0 flex flex-col ${
                    moveMode ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                  onClick={() => {
                    if (moveMode && selectedPerson && selectedPerson.column !== column) {
                      movePerson(selectedPerson.person, selectedPerson.column, column)
                      setMoveMode(false)
                      setSelectedPerson(null)
                    }
                  }}
                >
                  {/* Column Header */}
                  <div className={`p-3 border-b border-gray-200 ${columnColors[column]}`}>
                    <h3 className="text-sm font-semibold text-gray-700 text-center">{columnLabels[column]}</h3>
                    <p className="text-xs text-gray-500 text-center">{people[column].length} people</p>
                  </div>

                  {/* People List */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {people[column].map((person) => (
                      <div
                        key={person.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                          selectedPerson?.person.id === person.id && !moveMode
                            ? "bg-orange-200 ring-2 ring-orange-400"
                            : "bg-white hover:bg-gray-50"
                        } ${moveMode && selectedPerson?.person.id === person.id ? "opacity-50" : ""}`}
                        onClick={() => {
                          if (moveMode) return
                          handlePersonSelect(person, column)
                        }}
                        onDoubleClick={() => {
                          if (moveMode) return
                          router.push(`/interactions/${person.id}`)
                        }}
                      >
                        <div className="text-lg">{person.avatar}</div>
                        <span className="text-xs font-medium text-gray-700 truncate">{person.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
    </div>
  )
}

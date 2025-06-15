import type React from "react"

interface MarkdownMessageProps {
  content: string
  className?: string
}

export function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
  // Simple markdown parser for chat messages
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Skip empty lines but add spacing
      if (line.trim() === "") {
        elements.push(<div key={key++} className="h-2" />)
        continue
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={key++} className="text-base font-bold text-gray-800 mt-3 mb-2">
            {line.substring(4)}
          </h3>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key++} className="text-lg font-bold text-gray-800 mt-4 mb-2">
            {line.substring(3)}
          </h2>,
        )
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={key++} className="text-xl font-bold text-gray-800 mt-4 mb-3">
            {line.substring(2)}
          </h1>,
        )
      }
      // Bold text with emojis (like **MODELING: Watch me demonstrate**)
      else if (
        line.includes("**") &&
        (line.includes("🎯") || line.includes("📝") || line.includes("🧠") || line.includes("✨"))
      ) {
        const parts = line.split("**")
        const processedParts = parts.map((part, index) => {
          if (index % 2 === 1) {
            // This is bold text
            return (
              <strong key={`bold-${key}-${index}`} className="font-bold text-gray-900">
                {part}
              </strong>
            )
          }
          return part
        })
        elements.push(
          <div
            key={key++}
            className="text-sm font-medium text-gray-800 mb-3 p-2 bg-gray-50 rounded-lg border-l-3 border-orange-400"
          >
            {processedParts}
          </div>,
        )
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const number = line.match(/^(\d+)\.\s/)?.[1]
        const content = line.replace(/^\d+\.\s/, "")
        elements.push(
          <div key={key++} className="flex gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {number}
            </span>
            <span className="text-sm text-gray-700">{parseInlineMarkdown(content)}</span>
          </div>,
        )
      }
      // Bullet points
      else if (line.startsWith("• ") || line.startsWith("- ")) {
        const content = line.substring(2)
        elements.push(
          <div key={key++} className="flex gap-2 mb-1">
            <span className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2"></span>
            <span className="text-sm text-gray-700">{parseInlineMarkdown(content)}</span>
          </div>,
        )
      }
      // Bold standalone lines (like **Great work:** or **Try this:**)
      else if (line.startsWith("**") && line.endsWith("**")) {
        const content = line.substring(2, line.length - 2)
        elements.push(
          <div key={key++} className="font-bold text-gray-800 text-sm mb-2">
            {content}
          </div>,
        )
      }
      // Quoted text (italic)
      else if (line.startsWith('*"') && line.endsWith('"*')) {
        const content = line.substring(2, line.length - 2)
        elements.push(
          <div key={key++} className="italic text-gray-600 text-sm mb-2 pl-3 border-l-2 border-gray-300">
            "{content}"
          </div>,
        )
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={key++} className="text-sm text-gray-700 mb-2 leading-relaxed">
            {parseInlineMarkdown(line)}
          </p>,
        )
      }
    }

    return elements
  }

  // Parse inline markdown (bold, italic, code)
  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    let key = 0

    // Handle bold text
    const boldRegex = /\*\*(.*?)\*\*/g
    let match

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index))
      }

      // Add bold text
      parts.push(
        <strong key={`inline-bold-${key++}`} className="font-semibold text-gray-800">
          {match[1]}
        </strong>,
      )

      currentIndex = match.index + match[0].length
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex))
    }

    // If no bold text was found, return original
    if (parts.length === 0) {
      return text
    }

    return <>{parts}</>
  }

  return <div className={`markdown-content ${className}`}>{parseMarkdown(content)}</div>
}

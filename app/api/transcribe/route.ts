import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🚀 === TRANSCRIPTION API CALLED ===")
  console.log("⏰ Timestamp:", new Date().toISOString())

  try {
    // Check if OpenAI API key exists
    const apiKey = process.env.OPENAI_API_KEY
    console.log("🔑 API Key check:")
    console.log("- Exists:", !!apiKey)
    console.log("- Length:", apiKey?.length || 0)
    console.log("- Prefix:", apiKey?.substring(0, 15) + "...")
    console.log("- Suffix:", "..." + apiKey?.substring(apiKey.length - 10))

    if (!apiKey) {
      console.error("❌ No OpenAI API key found in environment")
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Validate API key format
    if (!apiKey.startsWith("sk-")) {
      console.error("❌ Invalid OpenAI API key format - should start with 'sk-'")
      return NextResponse.json({ error: "Invalid OpenAI API key format" }, { status: 500 })
    }

    if (apiKey.length < 40) {
      console.error("❌ OpenAI API key appears to be too short")
      return NextResponse.json({ error: "OpenAI API key appears to be invalid" }, { status: 500 })
    }

    // Log request headers
    console.log("📥 Request headers:")
    for (const [key, value] of request.headers.entries()) {
      console.log(`- ${key}: ${value}`)
    }

    // Get the form data
    console.log("📦 Parsing form data...")
    const formData = await request.formData()

    console.log("📋 FormData entries:")
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`- ${key}: File {`)
        console.log(`    name: "${value.name}"`)
        console.log(`    size: ${value.size} bytes (${(value.size / 1024).toFixed(2)} KB)`)
        console.log(`    type: "${value.type}"`)
        console.log(`    lastModified: ${value.lastModified}`)
        console.log(`  }`)
      } else {
        console.log(`- ${key}: "${value}"`)
      }
    }

    const file = formData.get("file") as File

    if (!file) {
      console.error("❌ No file provided in form data")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("📄 File validation:")
    console.log("- File exists:", !!file)
    console.log("- File name:", file.name)
    console.log("- File size:", file.size, "bytes")
    console.log("- File type:", file.type)

    // Check file size (OpenAI limit is 25MB)
    if (file.size > 25 * 1024 * 1024) {
      console.error("❌ File too large:", file.size, "bytes")
      return NextResponse.json({ error: "File too large. Maximum size is 25MB." }, { status: 400 })
    }

    if (file.size === 0) {
      console.error("❌ Empty file provided")
      return NextResponse.json({ error: "Empty file provided" }, { status: 400 })
    }

    // Prepare the form data for OpenAI
    console.log("🔄 Preparing OpenAI request...")
    const openaiFormData = new FormData()
    openaiFormData.append("file", file)
    openaiFormData.append("model", "whisper-1")
    openaiFormData.append("response_format", "json")

    console.log("📤 OpenAI FormData being sent:")
    for (const [key, value] of openaiFormData.entries()) {
      if (value instanceof File) {
        console.log(`- ${key}: File { name: "${value.name}", size: ${value.size}, type: "${value.type}" }`)
      } else {
        console.log(`- ${key}: "${value}"`)
      }
    }

    console.log("🌐 Making request to OpenAI API...")
    console.log("- URL: https://api.openai.com/v1/audio/transcriptions")
    console.log("- Method: POST")
    console.log("- Authorization: Bearer " + apiKey.substring(0, 15) + "...")

    // Make the request to OpenAI
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: openaiFormData,
    })

    console.log("📥 OpenAI response received:")
    console.log("- Status:", response.status)
    console.log("- Status text:", response.statusText)
    console.log("- OK:", response.ok)

    console.log("📋 OpenAI response headers:")
    for (const [key, value] of response.headers.entries()) {
      console.log(`- ${key}: ${value}`)
    }

    // Get the response text first to see what we're dealing with
    const responseText = await response.text()
    console.log("📄 OpenAI response body:")
    console.log("- Length:", responseText.length, "characters")
    console.log("- First 200 chars:", JSON.stringify(responseText.substring(0, 200)))
    console.log("- Full response:", JSON.stringify(responseText))

    if (!response.ok) {
      console.error("❌ OpenAI API request failed")
      console.error("- Status:", response.status)
      console.error("- Response:", responseText)

      // Try to parse as JSON for structured error, but handle plain text too
      let errorMessage = responseText
      try {
        const errorData = JSON.parse(responseText)
        console.error("📋 Parsed error data:", errorData)
        errorMessage = errorData.error?.message || errorData.message || responseText
      } catch (parseError) {
        console.error("⚠️ Error response is not JSON, using plain text:", parseError)
        // responseText is already assigned to errorMessage
      }

      return NextResponse.json({ error: `OpenAI API error: ${errorMessage}` }, { status: response.status })
    }

    // Try to parse the successful response
    console.log("✅ OpenAI request successful, parsing response...")

    // First check if the response looks like JSON
    const trimmedResponse = responseText.trim()
    if (!trimmedResponse.startsWith("{") && !trimmedResponse.startsWith("[")) {
      console.error("❌ Response doesn't look like JSON:")
      console.error("- Starts with:", trimmedResponse.substring(0, 50))
      console.error("- Full response:", responseText)

      // If it's an error message in plain text
      if (trimmedResponse.toLowerCase().includes("error")) {
        return NextResponse.json({ error: `OpenAI API error: ${trimmedResponse}` }, { status: 500 })
      }

      return NextResponse.json({ error: "Invalid response format from OpenAI API" }, { status: 500 })
    }

    try {
      const data = JSON.parse(responseText)
      console.log("📋 Parsed response data:")
      console.log("- Keys:", Object.keys(data))
      console.log("- Text exists:", !!data.text)
      console.log("- Text length:", data.text?.length || 0)
      console.log("- Text content:", JSON.stringify(data.text))
      console.log("- Full data:", data)

      console.log("🎉 Transcription successful!")

      return NextResponse.json({
        text: data.text || "",
        success: true,
      })
    } catch (parseError) {
      console.error("❌ Failed to parse OpenAI success response as JSON:", parseError)
      console.error("- Parse error:", parseError)
      console.error("- Response text:", responseText)

      // If parsing fails but we got a 200 response, there might be an issue with the response format
      return NextResponse.json(
        {
          error: "Invalid JSON response from OpenAI API",
          details: `Response: ${responseText.substring(0, 200)}...`,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("💥 Transcription API error:", error)
    console.error("- Error name:", error.name)
    console.error("- Error message:", error.message)
    console.error("- Error stack:", error.stack)

    return NextResponse.json(
      {
        error: `Server error: ${error.message}`,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}

"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { FaCheck } from "react-icons/fa"

const IDLE_TIMEOUT = 15 * 60 * 1000 // 15 minutes

const TestResultPage = () => {
  const [student, setStudent] = useState(null)
  const idleTimer = useRef(null)

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("student")
    window.location.href = "/"
  }

  // Reset idle timer
  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT)
  }

  // Load student data
  useEffect(() => {
    if (typeof window === "undefined") return

    const data = localStorage.getItem("student")
    if (!data) {
      window.location.href = "/"
      return
    }

    setStudent(JSON.parse(data))
  }, [])

  // Set up idle timer for auto-logout
  useEffect(() => {
    if (!student) return

    const events = ["mousemove", "keydown", "scroll", "touchstart"]

    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer)
    })

    // Start timer initially
    resetIdleTimer()

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer)
      })
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [student])

  if (!student)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    )

  const overallScore =
    student.tests.find((t) => t.name === "Overall")?.score || "N/A"
  const testDetails = student.testDetails || {}

  return (
    <div className="bg-gray-50 text-gray-800 font-sans mt-6 px-4 sm:px-8 md:px-20 overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 bg-white shadow-lg h-auto sm:h-16 py-3 sm:py-0 gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-16 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-600">IELTS</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <Link
            href="/home"
            className="text-red-600 font-semibold hover:underline text-sm sm:text-base"
          >
            Home
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:underline text-sm sm:text-base"
          >
            Logout
          </button>

          <a
            href="https://takeielts.britishcouncil.org/take-ielts/book"
            className="flex items-center justify-center gap-2 px-4 sm:px-5 h-10 sm:h-16 text-sm sm:text-base text-white font-semibold bg-linear-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition w-full sm:w-auto"
          >
            <i className="fa-regular fa-calendar"></i>
            Book a Test
          </a>
        </div>
      </header>

      <section className="px-4 sm:px-8 py-10 sm:py-20">
        {/* Student Info */}
        <div className="flex items-center mb-10">
          <i className="fa-regular fa-user text-sm sm:text-base"></i>
          <span className="font-semibold text-base text-gray-700 ml-2">
            {student.name}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
          Past Tests
        </h2>

        {/* Result Box */}
        <div className="mt-4 w-full bg-linear-to-r from-[#0FA99E] via-[#54B96D] to-[#90C843] text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left shadow gap-2 sm:gap-0 overflow-x-hidden">
          <p className="font-semibold whitespace-nowrap flex items-center">
            Result Available
            <FaCheck className="ml-1" />
          </p>

          <div className="flex items-center gap-2 text-sm sm:text-sm">
            <p className="font-semibold text-base max-w-full">
              IELTS on Computer General Training {testDetails.date}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-5">
          <button className="flex items-center justify-center gap-2 border border-red-600 text-red-600 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium hover:bg-red-600 hover:text-white transition w-full sm:w-auto">
            <i className="fa-solid fa-rotate-right"></i>
            Rebook Test
          </button>

          <button className="border border-red-600 text-red-600 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium hover:bg-red-600 hover:text-white transition w-full sm:w-auto">
            Request Re-mark
          </button>

          <Link
            href={`/file/${student.pdfFileName}`}
            download={student.pdfFileName}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition w-full sm:w-auto"
          >
            <i className="fa-solid fa-download"></i>
            Download Result
          </Link>
        </div>

        {/* Scores */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Overall */}
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold">
              Overall Score
            </h3>
            <p className="text-6xl font-semibold mt-2 text-red-600">
              {overallScore?.toFixed(1)}
            </p>
          </div>

          {/* Individual Scores */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
            {student.tests
              .filter((t) => t.name !== "Overall")
              .map((test, index) => (
                <div
                  key={test.name ? test.name : index}
                  className="bg-white text-gray-800 p-3 sm:p-4 text-center shadow"
                >
                  <h3 className="text-sm sm:text-base font-semibold">
                    {test.name}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-red-600">
                    {test.score?.toFixed(1)}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold text-gray-800 border-b-4 border-red-600 inline-block pb-1 text-base sm:text-lg">
            Past tests
          </h2>
          <p className="text-xs sm:text-sm mt-2 leading-relaxed text-justify sm:text-left">
            The test taker conveys and understands only general meaning in very
            familiar situations. There are frequent breakdowns in
            <span className="text-red-600">show more</span>
          </p>
        </div>
      </section>
    </div>
  )
}

export default TestResultPage

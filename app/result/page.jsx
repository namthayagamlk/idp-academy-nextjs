"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import {
  FaCheck,
  FaUser,
  FaChevronRight,
  FaChevronDown,
  FaUniversity,
  FaEdit,
  FaFileAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa"
import { HiCursorClick } from "react-icons/hi";
import { CiUser } from "react-icons/ci"
import { HiCalendarDateRange } from "react-icons/hi2"
import Image from "next/image"

const IDLE_TIMEOUT = 15 * 60 * 1000

const TestResultPage = () => {
  const [student, setStudent] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const idleTimer = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem("student")
    window.location.href = "/"
  }

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const data = localStorage.getItem("student")
    if (!data) {
      window.location.href = "/"
      return
    }

    setStudent(JSON.parse(data))
  }, [])

  useEffect(() => {
    if (!student) return

    const events = ["mousemove", "keydown", "scroll", "touchstart"]

    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer)
    })

    resetIdleTimer()

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
    <div className="bg-gray-50 text-gray-800 font-sans mt-6 px-4 0sm:px-8 md: overflow-x-hidden">
      {/* Header */}
      <header className="flex mt-4 flex-row justify-between items-center px-4 sm:px-8 bg-white shadow-lg h-auto sm:h-16 py-3 sm:py-0 gap-4 sm:gap-0">
        
        {/* Mobile Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button (Mobile Only) */}
          <button
            className="sm:hidden text-gray-700"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* Logo */}
          <Link href="https://www.idp.com/australia/study-to-migrate/skilled-occupation-list-australia/">
            <h1 className="text-xl sm:text-4xl font-bold text-red-600">
              IELTS
            </h1>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex flex-row border-l pl-6 border-gray-300 sm:flex-row items-center gap-3 sm:gap-6">
          <Link href="/home">
            <CiUser size={24} />
          </Link>

          <Link
            href="https://www.idp.com/australia/ielts/book-a-test/"
            className="flex items-center justify-center px-2 sm:px-5 h-10 sm:h-16 text-sm sm:text-base text-gray-200 font-semibold bg-linear-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition w-full sm:w-auto"
          >
            <HiCalendarDateRange />
            Book a Test
          </Link>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenu && (
        <div className="sm:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-4 animate-slide-down">
          <Link
            href="/home"
            className="text-gray-700 font-medium border-b pb-2"
            onClick={() => setMobileMenu(false)}
          >
            Dashboard
          </Link>

          <Link
            href="#"
            className="text-gray-700 font-medium"
            onClick={() => setMobileMenu(false)}
          >
            Test
          </Link>
          <Link
            href="/"
            className="text-gray-700 font-medium"
            onClick={() => setMobileMenu(false)}
          >
            Logout
          </Link>
        </div>
      )}

      <section className="px-4 sm:px-8 py-10 sm:py-20">
        <div className="flex items-center mb-10">
          <i className="fa-regular fa-user text-sm sm:text-base"></i>
        </div>

        <div className="px- sm:px-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
            Past Tests
          </h2>

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

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-5">
            <Link
              href="https://www.idp.com/srilanka/"
              className="flex items-center justify-center gap-2 border border-red-600 text-red-600 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium hover:bg-red-600 hover:text-white transition w-full sm:w-auto"
            >
            <HiCursorClick />
              Rebook Test
            </Link>

            <Link
              href="https://www.idp.com/srilanka/"
              className="border border-red-600 text-red-600 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium hover:bg-red-600 hover:text-white transition w-full sm:w-auto"
            >
              Request Re-mark
            </Link>

            <Link
              href={`/file/${student.pdfFileName}`}
              download={student.pdfFileName}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition w-full sm:w-auto"
            >
              <i className="fa-solid fa-download"></i>
              Download Result
            </Link>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Overall */}
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold">Overall Score</h3>
              <p className="text-6xl font-semibold mt-2 text-red-600">
                {overallScore?.toFixed(1)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
              {student.tests
                .filter((t) => t.name !== "Overall")
                .map((test, index) => (
                  <div
                    key={test.name ? test.name : index}
                    className="bg-white text-gray-800 p-3 sm:p-4 text-center shadow-2xl"
                  >
                    <button className="border text-[#0FA99E] px-2 text-base sm:px-3 py-1 font-bold mb-2 sm:text-base">
                      Retake
                    </button>
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
              Your score explained
            </h2>
            <p className="text-xs sm:text-sm mt-2 leading-relaxed text-justify sm:text-left">
              The test taker conveys and understands only general meaning in very familiar situations. There are frequent breakdowns in{" "}
              {isExpanded ? (
                <span>
                  more complex or unfamiliar situations. These breakdowns can lead to difficulties with communication and comprehension.
                </span>
              ) : (
                <span>more familiar situations.</span>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-600 ml-1 focus:outline-none hover:underline"
              >
                {isExpanded ? "show less" : "show more"}
              </button>
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 font-semibold text-red-600 text-base sm:text-lg focus:outline-none"
            >
              {open ? (
                <FaChevronDown className="transition-transform duration-300" />
              ) : (
                <FaChevronRight className="transition-transform duration-300" />
              )}
              <span>View options for test</span>
            </button>

            {open && (
              <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-gray-700 text-sm">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md hover:shadow-md transition cursor-pointer">
                  <FaEnvelope className="text-[#0FA99E]" />
                  <span>Notify Institution</span>
                </div>

                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md hover:shadow-md transition cursor-pointer">
                  <FaEdit className="text-[#0FA99E]" />
                  <span>Update Details</span>
                </div>

                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md hover:shadow-md transition cursor-pointer">
                  <FaFileAlt className="text-[#0FA99E]" />
                  <span>Terms & Conditions</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TestResultPage

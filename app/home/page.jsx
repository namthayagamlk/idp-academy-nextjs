"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  FaUser,
  FaClock,
  FaDesktop,
  FaCalendar,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa"
import { students } from "@/lib/data"

const IDLE_TIMEOUT = 15 * 60 * 1000

const Dashboard = () => {
  const [student, setStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const idleTimer = useRef(null)

  const logout = () => {
    localStorage.removeItem("student")
    window.location.href = "/"
  }

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      logout()
    }, IDLE_TIMEOUT)
  }

  useEffect(() => {
    const loadStudent = () => {
      try {
        const data = localStorage.getItem("student")
        if (data) {
          setStudent(JSON.parse(data))
        } else if (students.length > 0) {
          setStudent(students[0])
        }
      } catch (err) {
        console.error("Error loading student:", err)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(loadStudent, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      const data = localStorage.getItem("student")
      setStudent(data ? JSON.parse(data) : null)
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    if (!student) return

    const events = ["mousemove", "keydown", "scroll", "touchstart"]

    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer)
    })

    resetIdleTimer()

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer)
      })
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [student])

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No student data found</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 text-gray-800 font-sans px-4 md:px-20 min-h-screen">
      <header className="flex justify-between items-center p-4 bg-white shadow relative flex-wrap">
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <Link href="https://www.idp.com/australia/study-to-migrate/skilled-occupation-list-australia/">
            <Image
              src="/idp_ielts_logo.svg"
              alt="Logo"
              width={160}
              height={160}
              className="rounded-full"
            />
          </Link>
        </div>
        <div className="ml-auto w-10 h-10 flex items-center justify-center bg-gray-500 text-white rounded-full font-bold cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {student?.name?.charAt(0)?.toUpperCase()}
        </div>
        {dropdownOpen && (
          <div className="absolute right-4 mt-20 w-20 bg-white border-gray-50 rounded-sm shadow-md">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <section className="p-4 md:p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold">Hello {student.name}</h2>
            <p className="text-gray-600">{student.email}</p>
          </div>
          <Link
            href="https://www.idp.com/australia/ielts/book-a-test/"
            className="bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-red-700 text-center transition"
          >
            Book Now
          </Link>
        </div>
      </section>

      <section className="md:p-6">
        <div
          className="bg-white p-5 rounded-lg shadow w-full md:w-1/2 border border-transparent hover:border-black focus:border-black transition-colors duration-300 cursor-pointer"
          tabIndex={0} // enables focus for click/keyboard
        >
          <h3 className="text-lg font-bold mb-1 text-red-600">
            Your test result is available
          </h3>
          <p className="text-gray-600 font-semibold">
            Go to My Test & Results to view your score and detailed results.
          </p>

          <div className="mt-6 bg-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              IELTS {student.testType || "General Training"}
            </h3>

            <div className="space-y-2 text-gray-700 text-sm py-10">
              {/* Date & Time */}
              <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>{student.testDetails.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{student.testDetails.time}</span>
                </div>
              </div>

              {/* Mode & Center */}
              <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <FaDesktop />
                  <span>{student.testDetails.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBuilding />
                  <span>{student.testDetails.center}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt />
                  <span>{student.testDetails.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row gap-4 md:gap-6 pt-10">
            <Link href="/result">
              <span className="flex items-center gap-2 underline text-sm">
                View Results
              </span>
            </Link>
            <Link
              href={`/file/${student.pdfFileName}`}
              download={student.pdfFileName}
            >
              <span className="flex items-center gap-2 underline text-sm">
                Download eTRF
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="p-4 md:p-6 mt-8">
        <div className="border-s-4 border-red-600 pl-4">
          <h3 className="text-xl font-bold mb-6">Services</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition relative">
            <Image
              src="/dashboard-calendar.svg"
              alt="icon"
              width={40}
              height={40}
              className="mb-3"
            />
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              My tests and results
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Access your IELTS test results and manage your upcoming test
              bookings.
            </p>
            <div className="mt-4 text-right">
              <Link href="/result">
                {" "}
                <span className="font-bold text-4xl">→</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition relative">
            <Image
              src="/dashboard-books.svg"
              alt="icon"
              width={40}
              height={40}
              className="mb-3"
            />
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              My IELTS preparation
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get ready for IELTS and prepare with these free resources.
            </p>
            <div className="mt-4 text-right">
              <Link href="https://www.idp.com/australia/ielts/prepare-for-ielts/">
                <span className="font-bold text-4xl">→</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition relative">
            <Image
              src="/community-icon.svg"
              alt="icon"
              width={40}
              height={40}
              className="mb-3"
            />
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              My IELTS community
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Join the IELTS community and connect with IELTS and test takers.
            </p>
            <div className="mt-4 text-right">
              <Link href="https://www.idp.com/australia/blog/latest-visa-news/">
                <span className="font-bold text-4xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard

"use client" 
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

import { students } from "@/lib/data"
import Link from "next/link"
export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

 
  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const user = students.find(
        (s) => s.email === email && s.password === password
      )

      if (user) {
        localStorage.setItem("student", JSON.stringify(user))
        // toast.success("Login successful!")
        router.push("/home")
      } else {
        toast.error("Invalid email or password!")
      }

      setLoading(false)
    }, 6000) 
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-6 pt-32">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "12px",
            padding: "12px 20px",
            borderRadius: "10px",
          },
        }}
      />
      <div className="flex items-center gap-2 mb-6">
        <Image
          src="/idp_ielts_logo.svg"
          alt="Logo"
          width={200}
          height={100}
          className="rounded-full"
        />
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Welcome Back! 
        </h2>
        

        <form className="space-y-5 " onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } flex items-center justify-center gap-2`}
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="https://www.idp.com/australia/ielts/book-a-test/"
            className="text-red-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

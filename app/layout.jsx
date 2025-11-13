import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Head from "next/head"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title:
    "Best Study Abroad & Overseas Education Consultancy in Sri Lanka Free Counselling",
  description:
    "IDP Sri Lanka - Top Study Abroad Consultancy in Sri Lanka. Free counseling for Australia, USA, Canada, UK, and New Zealand. Trusted overseas guidance for 50+ years.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}

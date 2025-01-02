"use client"

import { LayoutProps } from "@/type"
import Header from "./Header"
import Footer from "./Footer"

const HomeLayout = ({ children }: LayoutProps) => {
  return (
    <div
      style={{ width: 1024 }}
      className="mx-auto"
    >
      <Header />
      <div className="bg-white px-4 py-1">{children}</div>
      <Footer />
    </div>
  )
}
export default HomeLayout

import { Outlet } from "react-router"

import Header from "./Header"
import Footer from "./Footer"


const HomeLayout = () => {

  return (
    <div
      style={{ width: 1024 }}
      className="mx-auto"
    >
      <Header />
      <div className="bg-white px-4 py-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
export default HomeLayout
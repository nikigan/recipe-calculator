import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <main>
      <div className="container py-3">
        <Outlet />
      </div>
    </main>
  )
}

export default RootLayout

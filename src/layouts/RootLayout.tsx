import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.tsx'
import { ChevronLeft, HomeIcon } from 'lucide-react'
import { paths } from '@/lib/router.tsx'

const RootLayout = () => {
  const navigate = useNavigate()

  return (
    <main className="overflow-y-auto max-h-[calc(100vh-75px)] h-screen overscroll-none">
      <div className="container py-3 h-full">
        <Outlet />
      </div>
      <nav className="fixed left-0 bottom-0 w-full right-0 px-3 py-3 flex justify-between pb-safe-or-8">
        <Button size="icon" variant="outline" className="h-12 w-12" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <Button asChild size="icon" variant="outline" className="h-12 w-12">
          <Link to={paths.recipe.list}>
            <HomeIcon />
          </Link>
        </Button>
      </nav>
    </main>
  )
}

export default RootLayout

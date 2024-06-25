import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout.tsx'
import { include } from 'named-urls'
import RecipeListPage from '@/pages/RecipeListPage.tsx'
import RecipeId from '@/pages/RecipeId.tsx'

export const paths = {
  home: '/',
  recipe: include('/recipes', {
    list: '',
    create: 'create',
    recipe: ':id',
  }),
}

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <RootLayout />,
    children: [
      {
        path: paths.recipe.list,
        element: <RecipeListPage />,
      },
      {
        path: paths.recipe.recipe,
        element: <RecipeId />,
      },
    ],
  },
])

import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout.tsx'
import { include } from 'named-urls'
import RecipeListPage from '@/pages/RecipeListPage.tsx'
import RecipeId from '@/pages/RecipeId.tsx'
import RecipeCreatePage from '@/pages/RecipeCreatePage'

export const paths = {
  home: '/',
  recipe: include('/recipes', {
    list: '',
    create: 'create',
    recipe: ':id',
  }),
}

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: paths.recipe.list,
          element: <RecipeListPage />,
        },
        {
          path: paths.recipe.create,
          element: <RecipeCreatePage />,
        },
        {
          path: paths.recipe.recipe,
          element: <RecipeId />,
        },
        {
          path: '*',
          element: <Navigate to={paths.recipe.list} replace={true} />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.VITE_BASE,
  },
)

import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db.ts'
import { useState } from 'react'

export const useRecipeList = () => {
  const [isLoading, setIsLoading] = useState(false)

  const recipes = useLiveQuery(() => {
    setIsLoading(true)
    try {
      return db.recipes.toArray()
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { recipes, isLoading }
}

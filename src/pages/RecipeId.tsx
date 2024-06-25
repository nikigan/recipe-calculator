import { useParams } from 'react-router-dom'
import { useRecipeId } from '@/lib/hooks/useRecipeId.tsx'
import RecipeForm from '@/components/RecipeForm.tsx'
import { createContext, Dispatch, SetStateAction, useState } from 'react'

type EditingContextType = {
  isEditing: boolean
  setIsEditing: Dispatch<SetStateAction<boolean>>
}
export const EditingContext = createContext<EditingContextType>({
  isEditing: false,
  setIsEditing: () => {},
})

const RecipeId = () => {
  const { id } = useParams<{ id: string }>()

  const { recipe, isLoading } = useRecipeId({ id: Number(id) })

  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <EditingContext.Provider value={{ isEditing, setIsEditing }}>
        <RecipeForm recipe={recipe} />
      </EditingContext.Provider>
    </div>
  )
}

export default RecipeId

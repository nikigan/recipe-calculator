import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db.ts'

export enum Status {
  PENDING = 'pending',
  RESOLVED = 'resolved',
}

export const useRecipeId = ({ id }: { id: number }) => {
  const [recipe, status] = useLiveQuery(
    async () => {
      const recipe = await db.recipes.get(id)
      return [recipe, Status.RESOLVED]
    },
    [],
    [undefined, Status.PENDING],
  )

  return { recipe, isLoading: status === Status.PENDING, isSuccess: status === Status.RESOLVED }
}

import { useRecipeList } from '@/lib/hooks/useRecipeList.tsx'
import { Link } from 'react-router-dom'
import { reverse } from 'named-urls'
import { paths } from '@/lib/router.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Recipe } from '@/db.ts'

function RecipeListItem(props: { recipe: Recipe }) {
  return (
    <Button
      asChild
      className="flex flex-col items-start gap-2 rounded-lg border p-3 pt-10 pb-5 text-left text-sm transition-all"
    >
      <Link to={reverse(paths.recipe.recipe, { id: props.recipe.id })}>
        <span className="capitalize font-bold text-lg">{props.recipe.title}</span>
      </Link>
    </Button>
  )
}

const RecipeListPage = () => {
  const { recipes, isLoading } = useRecipeList()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-screen-md">
      <Button asChild>
        <Link to={paths.recipe.create}>Создать</Link>
      </Button>
      <div className="flex flex-col gap-3 py-3 max-h-screen overflow-y-auto">
        {recipes?.map((recipe) => <RecipeListItem key={recipe.id} recipe={recipe} />)}
      </div>
    </div>
  )
}

export default RecipeListPage

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import RecipeItems from '@/components/RecipeItems.tsx'
import { db, Recipe } from '@/db.ts'
import { Button } from '@/components/ui/button.tsx'
import { useContext, useEffect } from 'react'
import { EditingContext } from '@/pages/RecipeId.tsx'
import { Pencil } from 'lucide-react'
import { paths } from '@/lib/router.tsx'
import { reverse } from 'named-urls'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  title: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.coerce.number(),
    }),
  ),
})

export type Inputs = z.infer<typeof schema>

const RecipeForm = ({ recipe }: { recipe?: Recipe }) => {
  const { isEditing, setIsEditing } = useContext(EditingContext)

  const navigate = useNavigate()

  const disabled = !isEditing && !!recipe

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      items: [],
    },
    disabled: disabled,
  })

  useEffect(() => {
    if (recipe) {
      form.reset({
        title: recipe.title,
        items: recipe.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
      })
    }
  }, [form, recipe])

  const submitHandler = async (data: Inputs) => {
    if (isEditing) {
      if (recipe) {
        await db.recipes.update(recipe.id, {
          title: data.title,
          items: data.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
        })
      }

      setIsEditing(false)
      return
    }

    const id = await db.recipes.add({
      title: data.title,
      items: data.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    })

    navigate(reverse(paths.recipe.recipe, { id }))
  }
  return (
    <div>
      <div className="flex justify-end">
        {recipe && (
          <Button
            variant={isEditing ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setIsEditing((prev: boolean) => !prev)}
          >
            <Pencil strokeWidth={1.5} />
          </Button>
        )}
      </div>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(submitHandler, console.error)}>
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название рецепта</FormLabel>
                <FormControl>
                  <Input placeholder="Название" {...field} className="disabled:!pointer-events-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="title"
          />
          <RecipeItems recipe={recipe} />
          {!disabled && (
            <Button type="submit" disabled={!form.formState.isDirty}>
              Сохранить
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}

export default RecipeForm

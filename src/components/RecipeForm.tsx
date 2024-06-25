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
import { Pencil, PencilOff } from 'lucide-react'

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

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant={isEditing ? 'default' : 'ghost'}
          size="icon"
          onClick={() => setIsEditing((prev: boolean) => !prev)}
        >
          <Pencil strokeWidth={1.5} />
        </Button>
      </div>
      <Form {...form}>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit(async (data) => {
            const id = await db.recipes.add({
              title: data.title,
              items: data.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
              })),
            })
            console.log('Recipe added with id', id)
          }, console.error)}
        >
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название рецепта</FormLabel>
                <FormControl>
                  <Input placeholder="Название" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="title"
          />
          <RecipeItems />
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

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import RecipeItems from '@/components/RecipeItems.tsx'
import { db, Recipe } from '@/db.ts'
import { Button } from '@/components/ui/button.tsx'
import { useContext, useEffect, useState } from 'react'
import { EditingContext } from '@/pages/RecipeId.tsx'
import { Pencil } from 'lucide-react'
import { paths } from '@/lib/router.tsx'
import { reverse } from 'named-urls'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'

const RATIOS = [0.3, 0.5, 0.6, 1, 1.5, 2.0]

const schema = z.object({
  title: z.string().min(1, 'Введите название рецепта'),
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Введите название ингредиента'),
        quantity: z.coerce.number().gt(0, 'Введите количество'),
      }),
    )
    .min(1, 'Добавьте хотя бы один ингредиент'),
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

  const [ratio, setRatio] = useState(1)

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
      setRatio(1)
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

  const onEdit = () => {
    setRatio(1)
    setIsEditing((prev: boolean) => !prev)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end">
        {recipe && (
          <Button variant={isEditing ? 'default' : 'ghost'} size="icon" onClick={onEdit}>
            <Pencil strokeWidth={1.5} />
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          className="flex flex-col flex-1 space-y-3 relative"
          onSubmit={form.handleSubmit(submitHandler, console.error)}
        >
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
          <RecipeItems recipe={recipe} ratio={ratio} setRatio={setRatio} />
          {!isEditing && (
            <DropdownMenu>
              <div className="flex flex-1 items-end justify-center">
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="h-14 w-14 text-xl tracking-wider">
                    {ratio.toFixed(1)}
                  </Button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent side="top" className="flex gap-3">
                {RATIOS.map((r) => (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Button type="button" variant="outline" onClick={() => setRatio(r)}>
                      {r.toFixed(1)}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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

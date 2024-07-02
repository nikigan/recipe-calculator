import { useFieldArray, useFormContext } from 'react-hook-form'
import { Inputs } from '@/components/RecipeForm.tsx'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { MinusCircle, PlusCircle } from 'lucide-react'
import DragInput from '@/components/DragInput.tsx'
import { Recipe } from '@/db.ts'
import { useContext, useEffect } from 'react'
import { EditingContext } from '@/pages/RecipeId.tsx'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const RecipeItems = ({
  recipe,
  ratio,
  setRatio,
}: {
  recipe?: Recipe
  ratio: number
  setRatio: (ratio: number) => void
}) => {
  const { formState, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray<Inputs>({
    name: 'items',
  })

  const { isEditing } = useContext(EditingContext)

  const handleInputChange = (index: number, value: number) => {
    if (isEditing || !recipe) return

    const newValue = value
    const oldValue = recipe.items[index].quantity
    const ratio = newValue / oldValue

    if (isNaN(ratio)) {
      return
    }

    setRatio(ratio)
  }

  useEffect(() => {
    if (recipe) {
      fields.forEach((_, i) => {
        const old = recipe.items[i].quantity
        const updatedValue = old * ratio
        setValue(`items.${i}.quantity`, Number(updatedValue.toFixed(1)))
      })
    }
  }, [fields, ratio, recipe, setValue])

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <motion.div layout key={field.id} className="flex gap-3 items-center">
          <span className="flex-shrink-1">{index + 1}.</span>
          <FormField
            render={({ field }) => (
              <FormItem>
                <motion.div layout>
                  <FormControl>
                    <Input
                      placeholder="Ингредиент"
                      readOnly={field.disabled}
                      className={clsx('disabled:!pointer-events-none')}
                      {...field}
                    />
                  </FormControl>
                </motion.div>
              </FormItem>
            )}
            name={`items.${index}.name`}
          />
          <FormField
            render={({ field }) => (
              <FormControl>
                <DragInput
                  placeholder="Количество"
                  className={clsx('disabled:!pointer-events-none')}
                  {...field}
                  disabled={false}
                  onChange={(value) => {
                    handleInputChange(index, value)
                    field.onChange(value)
                  }}
                />
              </FormControl>
            )}
            name={`items.${index}.quantity`}
          />
          {!formState.disabled && (
            <Button
              type="button"
              variant="dashed"
              size="icon"
              className="flex-shrink-0"
              tabIndex={-1}
              onClick={() => remove(index)}
            >
              <MinusCircle size="15" />
            </Button>
          )}
        </motion.div>
      ))}
      {!formState.disabled && (
        <Button
          type="button"
          variant="outline"
          className="flex space-x-3 border-dashed"
          // @ts-ignore
          onClick={() => append({ name: '', quantity: '' })}
        >
          <PlusCircle size="15" /> <span>Добавить</span>
        </Button>
      )}
      <FormField render={() => <FormMessage />} name="items" />
    </div>
  )
}

export default RecipeItems

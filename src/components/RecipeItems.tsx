import { useFieldArray, useFormContext } from 'react-hook-form'
import { Inputs } from '@/components/RecipeForm.tsx'
import { FormControl, FormField, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { MinusCircle, PlusCircle } from 'lucide-react'
import DragInput from '@/components/DragInput.tsx'
import { Recipe } from '@/db.ts'
import { useContext } from 'react'
import { EditingContext } from '@/pages/RecipeId.tsx'
import { clsx } from 'clsx'

const RecipeItems = ({ recipe }: { recipe?: Recipe }) => {
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

    fields.forEach((_, i) => {
      if (i !== index) {
        const old = recipe.items[i].quantity
        const updatedValue = old * ratio
        setValue(`items.${i}.quantity`, Number(updatedValue.toFixed(1)))
      }
    })
  }

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-3 items-center">
          <span className="flex-shrink-1">{index + 1}.</span>
          <FormField
            render={({ field }) => (
              <FormControl>
                <Input
                  placeholder="Ингредиент"
                  readOnly={field.disabled}
                  className={clsx('disabled:!pointer-events-none')}
                  {...field}
                />
              </FormControl>
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
        </div>
      ))}
      {!formState.disabled && (
        <Button
          type="button"
          variant="outline"
          className="flex space-x-3 border-dashed"
          onClick={() => append({ name: '', quantity: 0 })}
        >
          <PlusCircle size="15" /> <span>Добавить</span>
        </Button>
      )}
      <FormField render={() => <FormMessage />} name="items" />
    </div>
  )
}

export default RecipeItems

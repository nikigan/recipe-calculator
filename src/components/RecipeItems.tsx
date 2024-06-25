import { useFieldArray, useFormContext } from 'react-hook-form'
import { Inputs } from '@/components/RecipeForm.tsx'
import { FormField } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { MinusCircle, PlusCircle } from 'lucide-react'
import DragInput from '@/components/DragInput.tsx'

const RecipeItems = () => {
  const { formState } = useFormContext()
  const { fields, append, remove } = useFieldArray<Inputs>({
    name: 'items',
  })

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-3 items-center">
          <span className="flex-shrink-1">{index + 1}.</span>
          <FormField
            render={({ field }) => (
              <>
                <Input placeholder="Ингредиент" readOnly={field.disabled} {...field} />
              </>
            )}
            name={`items.${index}.name`}
          />
          {/*<FormField
            render={({ field }) => <Input placeholder="Количество" {...field} />}
            name={`items.${index}.quantity`}
          />*/}
          <FormField
            render={({ field }) => <DragInput placeholder="Количество" {...field} />}
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
    </div>
  )
}

export default RecipeItems

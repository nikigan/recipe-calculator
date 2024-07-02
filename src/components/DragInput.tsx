import { Input, InputProps } from '@/components/ui/input.tsx'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { cn } from '@/lib/utils.ts'
import { useFormField } from '@/components/ui/form.tsx'

type DragInputProps = Omit<InputProps, 'onChange'> & {
  onChange?: (value: number) => void
}

// const DRAG_SPEED = 0.7

const variants: Variants = {
  modal: {
    opacity: 0,
  },
  input: {
    opacity: 1,
  },
}

const DragInput = forwardRef<HTMLInputElement, DragInputProps>((props, ref) => {
  const localRef = useRef<HTMLInputElement | null>(null)
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [snapshot, setSnapshot] = useState(Number(props.value) || 0)

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0)

  const [isModal, setIsModal] = useState(false)

  // Start the drag to change operation when the mouse button is down.
  const onStart = useCallback(
    (event: MouseEvent | TouchEvent) => {
      console.log('onStart', props.value)
      let clientX = 0
      if ('clientX' in event) {
        clientX = event.clientX
      } else if ('touches' in event) {
        clientX = event.touches[0].clientX
      }

      setStartVal(clientX)
      if (props.value) {
        setSnapshot(Number(props.value))
      }
    },
    [props.value],
  )

  // We use document events to update and end the drag operation
  // because the mouse may not be present over the label during
  // the operation..
  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event: MouseEvent | TouchEvent) => {
      if (startVal) {
        let clientX = 0
        if ('clientX' in event) {
          clientX = event.clientX
        } else if ('touches' in event) {
          clientX = event.touches[0].clientX
        }

        /*let ratio = (startVal - clientX) / (startVal || 1)
        ratio *= -1 * DRAG_SPEED
        ratio += 1
        if (props.onChange) {
          props.onChange(Math.ceil((snapshot || 0.1) * ratio))
        }*/
        const move = (clientX - startVal) / 5
        if (props.onChange) {
          props.onChange(Math.ceil(snapshot + move))
        }
      }
    }

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(0)
    }

    document.addEventListener('mousemove', onUpdate)
    document.addEventListener('touchmove', onUpdate)

    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchend', onEnd)
    return () => {
      document.removeEventListener('mousemove', onUpdate)
      document.removeEventListener('touchmove', onUpdate)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchend', onEnd)
    }
  }, [startVal, snapshot, props.onChange])

  const { name } = useFormField()

  return (
    <>
      <motion.div
        variants={variants}
        layoutId={name}
        layout
        animate={isModal ? 'modal' : 'input'}
        onPanStart={(event) => {
          event.stopPropagation()
          setIsModal(true)
        }}
        onPanEnd={(event) => {
          event.stopPropagation()
          setIsModal(false)
          localRef.current?.blur()
        }}
        initial={false}
        transition={{ type: 'spring', bounce: 0.2 }}
      >
        <Input
          // @ts-ignore
          onMouseDown={onStart}
          // @ts-ignore
          onTouchStart={onStart}
          style={{
            touchAction: 'none',
          }}
          step="0.1"
          type="number"
          min="0"
          ref={(r) => {
            localRef.current = r
            if (ref) {
              if (typeof ref === 'function') {
                ref(r)
              } else {
                // @ts-ignore
                ref.current = r
              }
            }
          }}
          {...props}
          onChange={(event) => {
            if (props.onChange) {
              props.onChange(parseFloat(event.target.value))
            }
          }}
          className={cn(
            {
              'cursor-grab': !startVal,
              'cursor-col-resize': startVal,
            },
            'bg-background',
            props.className,
          )}
        />
      </motion.div>
      <AnimatePresence>
        {isModal && (
          <motion.div className="fixed inset-0 flex justify-center items-center w-full px-5">
            <motion.div
              layoutId={name}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="w-full max-w-screen-md"
            >
              <Input
                readOnly
                value={props.value}
                className={cn('bg-background h-16 text-2xl', props.className)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})

export default DragInput

import { Input, InputProps } from '@/components/ui/input.tsx'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { cn } from '@/lib/utils.ts'

type DragInputProps = Omit<InputProps, 'onChange'> & {
  onChange?: (value: number) => void
}

const DRAG_SPEED = 0.7

const variants: Variants = {
  modal: {
    scale: 1.05,
    flexBasis: '200%',
  },
  input: {
    scale: 1,
    flexBasis: '100%',
  },
}

const DragInput = forwardRef<HTMLInputElement, DragInputProps>((props, ref) => {
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

        let ratio = (startVal - clientX) / (startVal || 1)
        ratio *= -1 * DRAG_SPEED
        ratio += 1
        if (props.onChange) {
          props.onChange(Math.ceil(snapshot * ratio))
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

  return (
    <motion.div
      variants={variants}
      layout
      animate={isModal ? 'modal' : 'input'}
      onPanStart={() => {
        setIsModal(true)
      }}
      onPanEnd={() => {
        setIsModal(false)
      }}
    >
      <Input
        // @ts-ignore
        onMouseDown={onStart}
        // @ts-ignore
        onTouchStart={onStart}
        style={{
          touchAction: 'none',
        }}
        ref={ref}
        {...props}
        onChange={(event) => {
          if (props.onChange) {
            props.onChange(Number(event.target.value))
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
  )
})

export default DragInput

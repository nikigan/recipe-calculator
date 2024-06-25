import { Input, InputProps } from '@/components/ui/input.tsx'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { clsx } from 'clsx'

const DragInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [snapshot, setSnapshot] = useState(props)

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0)

  // Start the drag to change operation when the mouse button is down.
  const onStart = useCallback(
    (event) => {
      console.log('onStart', props.value)
      let clientX = 0
      if ('clientX' in event) {
        clientX = event.clientX
      } else if ('touches' in event) {
        clientX = event.touches[0].clientX
      }

      setStartVal(clientX)
      if (props.value) {
        setSnapshot(props.value)
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
        ratio *= -1
        ratio *= 10 * 0.3
        ratio += 1
        props.onChange((snapshot * ratio).toFixed(0))
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
    <Input
      onMouseDown={onStart}
      onTouchStart={onStart}
      className={clsx({
        'cursor-grab': !startVal,
        'cursor-col-resize': startVal,
      })}
      {...props}
      ref={ref}
    />
  )
})

export default DragInput

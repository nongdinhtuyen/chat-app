import { watchEffect, type Ref } from 'vue'
import { useToggle } from './useToggle'

export type BooleanHandlers = {
  toggle: (arg?: boolean) => void
  on: () => void
  off: () => void
}

function useBoolean(initialValue = false): [Ref<boolean>, BooleanHandlers] {
  const [value, toggle] = useToggle(initialValue)
  const handlers = {
    toggle,
    on: () => toggle(true),
    off: () => toggle(false),
  }

  return [value, handlers]
}

export default useBoolean

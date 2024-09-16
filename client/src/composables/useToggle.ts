import { isBoolean } from 'lodash'
import { ref, type Ref } from 'vue'

export function useToggle(initialValue = false): [Ref<boolean>, (arg?: boolean) => void] {
  const _value = ref(initialValue)

  function toggle(arg?: boolean) {
    if (isBoolean(arg)) {
      _value.value = arg
    } else {
      _value.value = !_value.value
    }
  }
  return [_value, toggle]
}

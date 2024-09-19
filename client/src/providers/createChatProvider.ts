import utils from '@/common/utils'
import { useAuthStore } from '@/stores/auth'
import type { ListChannelType } from '@/stores/channel'
import { useChatStore } from '@/stores/chat'
import { createInjectionState } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, toRaw, watchEffect } from 'vue'
type SelectChatType = {
  name: string
  image: string
} & ListChannelType
const authStore = useAuthStore()
const chatStore = useChatStore()

const { profile } = storeToRefs(authStore)
const [useChatProvide, useInjectStore] = createInjectionState((initialValue?: SelectChatType) => {
  // state
  const selectedChat = ref<Partial<SelectChatType>>(initialValue || {})

  // getters
  const renderNameChat = computed(() => (chat: Partial<SelectChatType>) => {
    if (chat.isGroup) {
      return {
        name: chat.nameChannel,
        image: chat.imageChannel,
      }
    }
    const user = utils.parseJwt(utils.getAccessToken() || '')
    const otherPart = chat.participants?.find((participant) => participant._id !== user._id)
    return {
      name: otherPart?.username,
      image: otherPart?.image,
    }
  })

  // actions
  function handleSelectChat(newValue: ListChannelType) {
    selectedChat.value = newValue
    chatStore.getMessage(newValue._id)
  }

  return { selectedChat, renderNameChat, handleSelectChat }
})

function useChatContext() {
  const counterStore = useInjectStore()
  if (counterStore == null)
    throw new Error('Please call `useProvideCounterStore` on the appropriate parent component')
  return counterStore
}

export { useChatProvide, useChatContext }

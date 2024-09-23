import useBoolean from '@/composables/useBoolean'
import { baseRequest } from '@/requests/baseRequest'
import { axiosRequest } from '@/requests/helpers'
import { chatEndpoints } from '@/requests/url_apis'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaginationType } from '@/types/global'
import type { MessageType } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<{ meta: Partial<PaginationType>; result: MessageType[] }>({
    meta: {},
    result: [],
  })
  const [loading, setLoading] = useBoolean()

  const getMessage = async (id: string) => {
    setLoading.on()
    try {
      const response = await axiosRequest(baseRequest.get, chatEndpoints.getMessage(id), {
        params: {
          current: 1,
          limit: 20,
        },
      })
      messages.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    } finally {
      setLoading.off()
    }
  }

  return {
    messages,
    getMessage,
  }
})

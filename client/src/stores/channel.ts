import useBoolean from '@/composables/useBoolean'
import { baseRequest } from '@/requests/baseRequest'
import { axiosRequest } from '@/requests/helpers'
import { channelEndpoints } from '@/requests/url_apis'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaginationType } from '@/types/global'

export type ChatType = {
  text: string
  user: {
    _id: string
    name: string
  }
}

export type DetailChannellType = {
  _id: string
  name: string
  admins: string[]
  members: string[]
  lastMessage: ChatType
  isGroup: boolean
  chatId: string
  nameChannel: Record<string, string>
  imageChannel: Record<string, string>
}
export type ListChannelType = {
  _id: string
  nameChannel: string
  imageChannel: string
  lastMessage: ChatType
  isGroup: boolean
}

export const useChannelStore = defineStore('channels', () => {
  const channels = ref<{ meta?: PaginationType; result?: ListChannelType[] }>({})
  const [loading, setLoading] = useBoolean()

  const getChannels = async () => {
    setLoading.on()
    try {
      const response = await axiosRequest(baseRequest.get, channelEndpoints.getChannels)
      channels.value = await response.data.data
    } catch (error) {
      console.error('Failed to fetch channels:', error)
    } finally {
      setLoading.off()
    }
  }

  const getOneChannels = async (id: string) => {
    setLoading.on()
    try {
      const response = await axiosRequest(baseRequest.get, channelEndpoints.getChannels)
      channels.value = await response.data.data
    } catch (error) {
      console.error('Failed to fetch channels:', error)
    } finally {
      setLoading.off()
    }
  }

  const createChannel = async ({ name, password }: { name: string; password: string }) => {
    setLoading.on()
    await axiosRequest(baseRequest.post, channelEndpoints.createChannels, {
      name,
      password,
    })
    await getChannels()
    setLoading.off()
  }

  const deleteChannels = async (channels: string[]) => {
    setLoading.on()
    await getChannels()
    setLoading.off()
  }

  return {
    channels,
    getOneChannels,
    createChannel,
    getChannels,
    loading,
    deleteChannels,
  }
})

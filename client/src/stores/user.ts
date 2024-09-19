import useBoolean from '@/composables/useBoolean'
import { baseRequest } from '@/requests/baseRequest'
import { axiosRequest } from '@/requests/helpers'
import { userEndpoints } from '@/requests/url_apis'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type UserType = {
  _id: string
  username: string
  refreshToken: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export const useUserStore = defineStore('users', () => {
  const users = ref<UserType[]>([])
  const [loading, setLoading] = useBoolean()

  const getUsers = async () => {
    setLoading.on()
    try {
      const response = await axiosRequest(baseRequest.get, userEndpoints.getUsers)
      users.value = await response.data.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading.off()
    }
  }

  const createUser = async ({ name, password }: { name: string; password: string }) => {
    console.log('🚀 ~ createUser ~ name, password:', name, password)
    setLoading.on()
    await axiosRequest(baseRequest.post, userEndpoints.createUsers, {
      name,
      password,
    })
    await getUsers()
    setLoading.off()
  }

  const deleteUsers = async (users: string[]) => {
    setLoading.on()
    await getUsers()
    setLoading.off()
  }

  return {
    users,
    createUser,
    getUsers,
    loading,
    deleteUsers,
  }
})

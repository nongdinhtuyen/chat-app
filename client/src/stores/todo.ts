import useBoolean from '@/composables/useBoolean'
import { baseRequest } from '@/requests/baseRequest'
import { axiosRequest } from '@/requests/helpers'
import { taskEndpoints } from '@/requests/url_apis'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<{ _id: string; name: string }[]>([])
  const [loading, setLoading] = useBoolean()

  const fetchTasks = async () => {
    setLoading.on()
    try {
      const response = await axiosRequest(baseRequest.get, taskEndpoints.getTasks)
      tasks.value = await response.data
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading.off()
    }
  }

  const createTask = async (name: string) => {
    setLoading.on()
    await axiosRequest(baseRequest.post, taskEndpoints.getTasks, {
      name,
    })
    await fetchTasks()
    setLoading.off()
  }

  const deleteTasks = async (tasks: string[]) => {
    setLoading.on()
    await axiosRequest(baseRequest.patch, taskEndpoints.deleteTask, tasks)
    await fetchTasks()
    setLoading.off()
  }

  return {
    tasks,
    fetchTasks,
    createTask,
    loading,
    deleteTasks,
  }
})

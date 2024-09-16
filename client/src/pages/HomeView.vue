<script setup lang="ts">
import useBoolean from '@/composables/useBoolean'
import { useTasksStore } from '@/stores/todo'
import { isEmpty } from 'lodash'
import { storeToRefs } from 'pinia'
import { onMounted, onRenderTriggered, ref, toRaw, toValue, watch, watchEffect } from 'vue'

const store = useTasksStore()
const newTask = ref()
const checkList = ref<string[]>([])
const { tasks, loading } = storeToRefs(store)

const createTask = () => {
  store.createTask(newTask.value).then(() => {
    newTask.value = ''
  })
}

const deleteTask = () => {
  store.deleteTasks(checkList.value).then(() => {
    newTask.value = ''
  })
}
const getData = () => {
  store.fetchTasks()
}

watchEffect(() => {
  console.log('🚀 ~ watch ~ loading:', checkList.value, isEmpty(checkList.value))
})

onMounted(() => {
  // store.fetchTasks()
})

onRenderTriggered((event) => {
  // console.log('🚀 ~ onRenderTriggered ~ event:', event)
})
</script>

<template>
  <main>
    <div class="flex items-center justify-center h-screen font-medium">
      <div class="flex flex-grow items-center justify-center h-full">
        <div class="max-w-full p-8 bg-white rounded-lg shadow-lg w-96">
          <div class="flex justify-between items-center mb-6">
            <h4>{{ loading }}</h4>
            <h4 class="font-semibold ml-3 text-lg">Frodo's Jobs</h4>
            <button
              v-if="!isEmpty(toValue(checkList))"
              class="bg-blue-500 text-blue-100 hover:bg-blue-600 duration-300 px-2 font-medium rounded"
              @click="deleteTask"
            >
              Delete
            </button>
          </div>
          <ul>
            <li v-for="item in tasks" :key="item._id">
              <input
                class="hidden"
                type="checkbox"
                :id="item._id"
                v-model="checkList"
                :value="item._id"
              />
              <label
                class="flex items-center h-10 px-2 rounded cursor-pointer hover:bg-gray-100"
                :for="item._id"
              >
                <span
                  class="flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-300 rounded-full"
                >
                  <svg
                    class="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <span class="ml-4 text-sm">{{ item.name }}</span>
              </label>
            </li>
          </ul>
          <button class="flex items-center w-full h-8 px-2 mt-2 text-sm font-medium rounded">
            <svg
              @click="createTask"
              class="w-5 h-5 text-gray-400 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <input
              class="flex-grow h-8 ml-4 bg-transparent focus:outline-none font-medium"
              type="text"
              placeholder="add a new task"
              @keypress.enter="createTask"
              v-model="newTask"
            />
          </button>
        </div>
        <!-- Component End  -->
      </div>
    </div>
  </main>
</template>

<style scoped>
input[type='checkbox']:checked + label span:first-of-type {
  background-color: #10b981;
  border-color: #10b981;
  color: #fff;
}

input[type='checkbox']:checked + label span:nth-of-type(2) {
  text-decoration: line-through;
  color: #9ca3af;
}
</style>

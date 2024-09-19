<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { onMounted, reactive, toRaw, toValue, watchEffect } from 'vue'
import { Button, Modal } from 'ant-design-vue'
import useBoolean from '@/composables/useBoolean'
import CreateUser from '@/components/CreateUser.vue'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const [_open, setOpen] = useBoolean()

const formState = reactive({
  name: '',
  password: '',
})
watchEffect(() => {
  console.log('🚀 ~ watchEffect ~ users:', toRaw(users.value))
})
onMounted(() => {
  userStore.getUsers()
})

const createUser = () => {
  setOpen.on()
}
</script>

<template>
  <div class="relative overflow-x-auto">
    <Button @click="createUser">Create User</Button>
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Id</th>
          <th scope="col" class="px-6 py-3">Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ user._id }}
          </th>

          <td class="px-6 py-4">{{ user.username }}</td>
        </tr>
      </tbody>
    </table>
    <CreateUser :open="_open" :setOpen="setOpen" :formState="formState" />
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

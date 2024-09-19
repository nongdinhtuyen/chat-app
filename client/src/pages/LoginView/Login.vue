<script setup lang="ts">
import consts, { ROUTES } from '@/constants/consts'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Button } from 'ant-design-vue'

const { isCreateUser } = defineProps<{
  isCreateUser?: any
}>()

const store = useAuthStore()
const { isAuth } = storeToRefs(store)
const loginName = ref('q')
const loginPass = ref('q')
const router = useRouter()
const route = useRoute()

const onSubmit = (event: Event) => {
  event.preventDefault()
  if (route.name === ROUTES.CREATE) {
    store.create(loginName.value, loginPass.value)
  } else {
    store.login(loginName.value, loginPass.value).then(() => {
      router.push(ROUTES.MESSENGER)
    })
  }
}
</script>

<template>
  <main>
    <div class="flex min-h-full flex-col justify-center p-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit="onSubmit">
          <div>
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
            <div class="mt-2">
              <input
                v-model="loginName"
                id="name"
                name="name"
                required
                class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
                >Password</label
              >
            </div>
            <div class="mt-2">
              <input
                v-model="loginPass"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <Button type="primary" html-type="submit">
              {{ isCreateUser ? 'Create' : 'Sign In' }}
            </Button>
          </div>
          <RouterLink to="/create" class="block font-semibold text-indigo-600 hover:text-indigo-500"
            >Register</RouterLink
          >
        </form>
      </div>
    </div>
  </main>
</template>

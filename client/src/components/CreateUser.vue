<script lang="ts" setup>
import { reactive, ref, watchEffect, type Reactive, type Ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { Form, Modal } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import type { BooleanHandlers } from '@/composables/useBoolean'

const { formState, setOpen, open } = defineProps<{
  formState: Reactive<{
    name: string
    password: string
  }>
  setOpen: BooleanHandlers
  open: boolean
}>()
const userStore = useUserStore()

watchEffect(() => {
  console.log('🚀 ~ watchEffect ~ open:', open)
})

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please enter user name' }],
  pass: [{ required: true, message: 'Please enter pass' }],
}

const onOk = () => {
  userStore.createUser({
    name: formState.name,
    password: formState.password,
  })
}

const onCancel = () => {
  setOpen.off()
}
</script>

<template>
  <Modal :open="open" @cancel="onCancel" title="Create a new user" @ok="onOk">
    <Form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      :rules="rules"
    >
      <a-form-item
        label="name"
        name="name"
        :rules="[{ required: true, message: 'Please input your name!' }]"
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
    </Form>
  </Modal>
</template>

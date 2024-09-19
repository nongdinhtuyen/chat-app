<template>
  <Modal :open="open" title="Basic Modal">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </Modal>
</template>
<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { Modal } from 'ant-design-vue'
import { ref, type Ref } from 'vue'
const props = defineProps<{
  open: boolean
}>()
const emit = defineEmits(['update:open'])

const open = useVModel(props, 'open', emit)
</script>

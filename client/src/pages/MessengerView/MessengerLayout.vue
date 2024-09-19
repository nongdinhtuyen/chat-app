<script setup lang="ts">
import SideBar from './SideBar.vue'
import { useChatProvide } from '../../providers/createChatProvider'
import ChatWindow from './ChatWindow.vue'

useChatProvide()
</script>

<template>
  <div class="flex-1 flex bg-gray-100 dark:bg-neutral-800">
    <SideBar />
    <ChatWindow />
  </div>
</template>

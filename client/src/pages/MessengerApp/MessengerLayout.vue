<template>
  <div class="layout">
    <SideBar @chat-selected="selectChat" :channels="channels" />
    <div class="flex-1">
      <ChatWindow :selected-chat="selectedChat" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SideBar from './SideBar.vue'
import ChatWindow from './ChatWindow.vue'
import { useChannelStore } from '@/stores/channel'
import { storeToRefs } from 'pinia'

const selectedChat = ref(undefined)
const channelStore = useChannelStore()
const { channels } = storeToRefs(channelStore)
const selectChat = (chat) => {
  selectedChat.value = chat
}

// onMounted(() => {
//   channelStore.getChannels()
// })
</script>

<style scoped>
.layout {
  display: flex;
  height: 100%;
}
</style>

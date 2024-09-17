<template>
  <div class="w-80 bg-gray-100 border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800">Chats</h2>
    </div>

    <!-- Search Bar -->
    <div class="p-4">
      <div class="relative">
        <input
          type="text"
          placeholder="Search Messenger"
          class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <Icon icon="mdi:magnify" class="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
      </div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="chat in channels.result"
        :key="chat._id"
        @click="selectChat(chat)"
        class="p-3 hover:bg-gray-200 cursor-pointer transition-colors duration-150 ease-in-out"
        :class="{ 'bg-gray-200': selectedChatId === chat._id }"
      >
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img
              src="https://i.pravatar.cc/"
              :alt="chat.imageChannel"
              class="w-12 h-12 rounded-full object-cover"
            />
            <!-- <div
              v-if="chat.online"
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            ></div> -->
          </div>
          <div class="flex-1 flex flex-col gap-y-1 min-w-0">
            <span class="text-sm font-medium text-gray-900 truncate">{{ chat.nameChannel }}</span>
            <span class="text-sm text-gray-500 truncate">{{ chat.lastMessage }}</span>
          </div>
          <!-- <div
            v-if="chat.unreadCount"
            class="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ chat.unreadCount }}
          </div> -->
        </div>
      </div>
    </div>

    <!-- New Message Button -->
    <div class="p-4 border-t border-gray-200">
      <button
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center justify-center"
      >
        <Icon icon="mdi:pencil" class="w-5 h-5 mr-2" />
        New Message
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useChannelStore } from '@/stores/channel'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const emit = defineEmits(['chatSelected'])

const channelStore = useChannelStore()
const userAuth = useAuthStore()
const { channels } = storeToRefs(channelStore)
const selectedChatId = ref(null)

const selectChat = (chat) => {
  selectedChatId.value = chat.id
  emit('chatSelected', chat)
}

onMounted(() => {
  channelStore.getChannels()
})
</script>

<style scoped>
/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

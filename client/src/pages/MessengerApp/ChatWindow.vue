<template>
  <div v-if="selectedChat" class="flex flex-col bg-white h-full">
    <!-- Chat Header -->
    <div class="flex items-center p-4 border-b border-gray-200">
      <img
        :src="selectedChat.avatar"
        :alt="selectedChat.name"
        class="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <h2 class="text-lg font-semibold text-gray-800">{{ selectedChat.name }}</h2>
        <p class="text-sm text-gray-500">{{ selectedChat.online ? 'Online' : 'Offline' }}</p>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{ 'flex justify-end': message.sender === 'user' }"
      >
        <div
          :class="[
            'max-w-xs rounded-lg p-3 text-sm',
            message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800',
          ]"
        >
          {{ message.text }}
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center space-x-2">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="sendMessage"
          class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icon icon="mdi:send" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center bg-gray-100">
    <p class="text-xl text-gray-500">Select a chat to start messaging</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  selectedChat: Object,
})

const messages = ref([])
const newMessage = ref('')

// Simulated messages for demonstration
watch(
  () => props.selectedChat,
  (newChat) => {
    if (newChat) {
      messages.value = [
        { id: 1, sender: 'other', text: 'Hey there!' },
        { id: 2, sender: 'user', text: 'Hi! How are you?' },
        { id: 3, sender: 'other', text: "I'm doing great, thanks for asking. How about you?" },
        { id: 4, sender: 'user', text: "I'm good too. Just working on a project." },
      ]
    }
  },
  { immediate: true },
)

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      sender: 'user',
      text: newMessage.value,
    })
    newMessage.value = ''
  }
}
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

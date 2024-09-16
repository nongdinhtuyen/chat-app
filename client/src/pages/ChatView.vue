<template>
  <div class="chat">
    <header class="chat-header">
      <h1 class="text-3xl font-bold text-gray-900">Chat Room</h1>
    </header>
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow-xl rounded-lg overflow-hidden h-full flex flex-col">
        <div class="p-4 bg-gray-200 flex justify-between items-center">
          <span class="font-semibold text-gray-700"> Status: {{ connectionStatus }} </span>
          <button
            @click="reconnect"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="connectionStatus === 'connected'"
          >
            Reconnect
          </button>
        </div>
        <div class="chat-message-list flex-1" ref="chatContainer">
          <div
            v-for="message in messages"
            :key="message.date"
            class="chat-message"
            :class="{ outgoing: message.isOwn }"
          >
            <div className="chat-message-wrapper">
              <span v-show="!message.isOwn" className="chat-message-username">{{
                message.username
              }}</span>
              <div className="chat-message-bubble">
                <span className="chat-message-body">{{ message.text }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, watchEffect, toRaw } from 'vue'
import { io, Socket } from 'socket.io-client'
import utils from '@/common/utils'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

type Message = {
  date: number
  text: string
  isOwn: boolean
  username: string
  idUser: string
}

const store = useAuthStore()
const { user } = storeToRefs(store)
const socket = ref<Socket | null>(null)
const connectionStatus = ref('disconnected')
const messages = ref<Message[]>([])
const newMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)

watchEffect(() => {
  console.log('🚀 ~ watchEffect ~ messages:', toRaw(user.value))
})

const connectSocket = () => {
  socket.value = io('http://localhost:8080', {
    extraHeaders: {
      authorization: `${utils.getAccessToken()}`,
    },
  })

  socket.value.on('connect', () => {
    console.log('Socket connected')
    connectionStatus.value = 'connected'
  })

  socket.value.on('disconnect', () => {
    connectionStatus.value = 'disconnect'
  })

  socket.value.on('chat', (data: any) => {
    if (user.value._id !== data.idUser) {
      messages.value.push({
        date: Date.now(),
        text: data.text,
        isOwn: false,
        username: data.name,
        idUser: data._id,
      })
    }
    scrollToBottom()
  })

  socket.value.on('connect_error', (error) => {
    console.error('Connection error:', error)
    connectionStatus.value = 'error'
  })
}

const sendMessage = () => {
  if (newMessage.value.trim() && socket.value) {
    const mess = {
      idUser: user.value._id,
      username: user.value.name,
      date: Date.now(),
      text: newMessage.value.trim(),
    }
    socket.value.emit('chat', mess)
    messages.value.push({ ...mess, isOwn: true })
    newMessage.value = ''
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const reconnect = () => {
  if (socket.value) {
    socket.value.disconnect()
  }
  connectSocket()
}

onMounted(() => {
  connectSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('connect')
    socket.value.off('disconnect')
    socket.value.off('chat')
  }
})
</script>

<template>
  <div v-if="selectedChat._id" class="flex flex-col h-full flex-1">
    <div class="flex items-center justify-between p-4 border-b border-slate-600">
      <div class="flex items-center">
        <Avatar class="w-10 h-10">
          <AvatarImage :src="renderNameChat(selectedChat).image || ''" :alt="selectedChat.name" />
          <AvatarFallback>{{ renderNameChat(selectedChat).image?.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div class="ml-3">
          <h2 class="text-lg font-semibold">{{ selectedChat.name }}</h2>
          <p class="text-sm text-muted-foreground">{{ connectionStatus }}</p>
        </div>
      </div>
      <div class="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Icon icon="mdi:phone" class="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon icon="mdi:video" class="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon icon="mdi:information-outline" class="w-5 h-5" />
        </Button>
      </div>
    </div>
    <ScrollArea class="p-4 scroll-area">
      <div ref="scrollAreaRef" class="space-y-4 flex flex-1 flex-col h-full">
        <div
          v-for="(message, index) in groupedMessages"
          :key="message._id"
          class="flex items-center space-x-2"
          :class="[message.userId === profile._id ? 'justify-end' : 'justify-start']"
        >
          <Avatar v-if="shouldShowAvatar(index)" class="w-8 h-8 flex-shrink-0">
            <AvatarImage :src="renderNameChat(selectedChat).image || ''" :alt="message.userName" />
            <AvatarFallback>{{ message.userName.charAt(0) }}</AvatarFallback>
          </Avatar>
          <div v-else class="w-8 h-8 flex-shrink-0"></div>
          <div
            class="flex flex-col max-w-[70%]"
            :class="[
              'inline-block p-3 rounded-lg',
              message.userId === profile._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white',
            ]"
          >
            {{ message.text }}
          </div>
          <div class="text-xs text-muted-foreground mt-1">{{ formatTime(message.createdAt!) }}</div>
        </div>
      </div>
    </ScrollArea>

    <CardFooter class="p-4 border-t">
      <form @submit.prevent="sendMessage" class="flex items-center space-x-2 w-full">
        <Input v-model="newMessage" type="text" placeholder="Type a message..." class="flex-1" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Icon icon="mdi:emoticon" class="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div class="grid grid-cols-5 gap-2">
              <Button
                v-for="emoji in emojis"
                :key="emoji"
                @click="addEmoji(emoji)"
                class="p-2 hover:bg-muted rounded h-auto text-lg"
              >
                {{ emoji }}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button type="submit" size="icon">
          <Icon icon="mdi:send" class="w-5 h-5" />
        </Button>
      </form>
    </CardFooter>
  </div>
  <Card v-else class="flex items-center justify-center h-full flex-1">
    <CardContent>
      <p class="text-xl text-muted-foreground">Select a chat to start messaging</p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatContext } from '../../providers/createChatProvider'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { io, Socket } from 'socket.io-client'
import utils from '@/common/utils'
import consts from '@/constants/consts'
import type { MessageType } from '@/types/chat'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import dayjs from 'dayjs'
import { useInfiniteScroll } from '@vueuse/core'

const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '🎉', '🔥', '💯', '🙏', '❤️', '😎']
const { selectedChat, renderNameChat } = useChatContext()!
const chatStore = useChatStore()
const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)
const { messages } = storeToRefs(chatStore)
const newMessage = ref('')
const socket = ref<Socket | null>(null)
const connectionStatus = ref('Disconnected')
const scrollAreaRef = ref<HTMLElement | null>(null)

const groupedMessages = computed(() => {
  return messages.value.result.map((message, index, array) => {
    const isLastInSequence =
      index === array.length - 1 || array[index + 1].userId !== message.userId
    return { ...message, isLastInSequence }
  })
})
const connectSocket = () => {
  socket.value = io('http://localhost:8080', {
    extraHeaders: {
      authorization: `${utils.getAccessToken()}`,
    },
  })

  socket.value.on('connect', () => {
    console.log('Socket connected')
    connectionStatus.value = 'Connected'
  })

  socket.value.on('disconnect', () => {
    connectionStatus.value = 'Disconnected'
    reconnect()
  })

  socket.value.on(consts.CHAT_GATEWAY, (data: MessageType) => {
    if (profile.value._id !== data.userId) {
      messages.value.result.push(data)
      scrollToBottom()
    }
  })

  socket.value.on('connect_error', (error) => {
    console.error('Connection error:', error)
    connectionStatus.value = 'Error'
  })
}

const shouldShowAvatar = (index: number) => {
  if (groupedMessages.value[index].userId !== profile.value._id) {
    return groupedMessages.value[index].isLastInSequence
  }
  return false
}

const sendMessage = () => {
  if (newMessage.value.trim() && socket.value) {
    const mess = {
      userId: profile.value._id,
      userName: profile.value.name,
      text: newMessage.value.trim(),
      createdAt: new Date().toISOString(),
    }
    socket.value.emit(consts.CHAT_GATEWAY, mess)
    messages.value.result.push(mess)
    newMessage.value = ''
    scrollToBottom()
  }
}

// const scrollToBottom = () => {
//   nextTick(() => {
//     if (el.value) {
//       el.value.scrollIntoView({
//         behavior: 'auto',
//         block: 'end',
//         inline: 'nearest',
//       })
//     }
//   })
// }
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollAreaRef.value) {
      scrollAreaRef.value.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'nearest',
      })
    }
  })
}

const reconnect = () => {
  if (socket.value) {
    socket.value.disconnect()
  }
  connectSocket()
}

const formatTime = (dateString: string) => {
  return dayjs(dateString).format('HH:mm')
}

const addEmoji = (emoji: string) => {
  newMessage.value += emoji
}

watch(
  () => selectedChat.value._id,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
)

watch(
  () => messages.value.meta.current,
  () => {
    scrollToBottom()
  },
)

onMounted(() => {
  connectSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('connect')
    socket.value.off('disconnect')
    socket.value.off(consts.CHAT_GATEWAY)
    socket.value.disconnect()
  }
})
</script>

<style scoped>
.scroll-area {
  height: calc(87vh - 149px);
}
</style>

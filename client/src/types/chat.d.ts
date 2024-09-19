export type ChatType = {
  text: string
  user: {
    _id: string
    name: string
  }
}

export type DetailChatType = {
  _id: string
  name: string
  admins: string[]
  members: string[]
  lastMessage: ChatType
  isGroup: boolean
  chatId: string
  nameChat: Record<string, string>
  imageChat: Record<string, string>
}
export type ListChatType = {
  _id: string
  nameChat: string
  imageChat: string
  lastMessage: ChatType
  isGroup: boolean
  participants: {
    _id: string
    username: string
    image: string
  }[]
}

export type MessageType = {
  _id?: string
  userId: string
  userName: string
  text: string
  createdAt?: string
  updatedAt?: string
}

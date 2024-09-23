<template>
  <Modal :open="open" title="Create Channel" @ok="handleCreateChannel">
    <div class="user-selector">
      <List itemLayout="horizontal" :dataSource="selectedUsers">
        <template #renderItem="{ item: user, index }: { item: SelectUserType; index: number }">
          <List.Item
            @click="toggleSelection(user, index)"
            class="hover:bg-gray-800 cursor-pointer transition-colors duration-200 ease-in-out user-selector"
          >
            <List.Item.Meta :title="user.username">
              <template #avatar>
                <div class="relative">
                  <Avatar :src="user.avatar" :size="40" />
                  <CheckCircleFilled
                    v-if="user.selected"
                    class="absolute -top-1 -right-1 text-blue-500 rounded-full"
                    size="16"
                  />
                </div>
              </template>
            </List.Item.Meta>
          </List.Item>
        </template>
      </List>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { Avatar, Checkbox, List, Modal } from 'ant-design-vue'
import { CheckCircleFilled } from '@ant-design/icons-vue'
import { useUserStore, type UserType } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref, toRaw, watch } from 'vue'
import { useChannelStore } from '@/stores/channel'
import { useAuthStore } from '@/stores/auth'
import utils from '@/common/utils'
import { baseRequest } from '@/requests/baseRequest'
import { userEndpoints } from '@/requests/url_apis'
import { axiosRequest } from '@/requests/helpers'
import _ from 'lodash'

type SelectUserType = UserType & { selected?: boolean }

const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)
const selectedUsers = ref<SelectUserType[]>([])
const channelStore = useChannelStore()
const { channels } = storeToRefs(channelStore)
const open = defineModel<boolean>()

const fetchUsers = async () => {
  try {
    const response = await axiosRequest(baseRequest.get, userEndpoints.getUsers, {
      params: {
        notIncludeMySelf: true,
      },
    })
    const { data } = await response.data
    selectedUsers.value = data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})

const handleCreateChannel = () => {
  const groupSelectedUser = selectedUsers.value.filter((u) => u.selected)
  const isGroup = groupSelectedUser.length > 1
  const newChannel = {}
  if (isGroup) {
    Object.assign(newChannel, {
      admins: [profile.value._id],
      members: _.map(groupSelectedUser, '_id'),
      isGroup,
      nameChannel: utils.ellipsisString(
        profile.value.name + ',' + _.map(groupSelectedUser, 'username').join(','),
      ),
    })
  } else {
    const findOther = _.find(groupSelectedUser, (user) => user._id !== profile.value._id)
    Object.assign(newChannel, {
      admins: [profile.value._id, findOther?._id],
      members: [],
      isGroup,
    })
  }
  channelStore.createChannel(newChannel)
}

const toggleSelection = (user: SelectUserType, index: number) => {
  selectedUsers.value[index].selected = !selectedUsers.value[index].selected
}
</script>

<style scoped>
.ant-list .ant-list-item .ant-list-item-meta {
  align-items: center;
}
</style>

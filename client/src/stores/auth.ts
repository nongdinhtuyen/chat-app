import utils from '@/common/utils'
import consts from '@/constants/consts'
import { baseRequest } from '@/requests/baseRequest'
import { axiosRequest } from '@/requests/helpers'
import { authEndpoints } from '@/requests/url_apis'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type IUser = {
  _id: string
  name: string
  role: string
  image: string
  exp: number
  iat: number
}

export const useAuthStore = defineStore('profile', () => {
  const isAuth = ref(!!utils.getAccessToken())
  const profile = ref<IUser>(utils.parseJwt(utils.getAccessToken() || ''))

  const login = async (username: string, password: string) => {
    return axiosRequest(baseRequest.post, authEndpoints.login, {
      username,
      password,
    }).then((value) => {
      isAuth.value = true
      const { accessToken, refreshToken } = value.data.data
      profile.value = utils.parseJwt(accessToken)
      localStorage.setItem(consts.ACCESS_TOKEN, accessToken)
      localStorage.setItem(consts.REFRESH_TOKEN, refreshToken)
    })
  }

  const create = async (username: string, password: string) => {
    return axiosRequest(baseRequest.post, authEndpoints.create, {
      username,
      password,
    })
  }

  return {
    profile,
    login,
    isAuth,
    create,
  }
})

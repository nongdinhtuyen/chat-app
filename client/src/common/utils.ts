import consts from '@/constants/consts'

const getAccessToken = () => localStorage.getItem(consts.ACCESS_TOKEN)
const setAccessToken = (value: string) => localStorage.setItem(consts.ACCESS_TOKEN, value)
const setRefreshToken = (value: string) => localStorage.setItem(consts.ACCESS_TOKEN, value)

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )

    return JSON.parse(jsonPayload || '{}')
  } catch (e) {
    return JSON.parse('{}')
  }
}

export default {
  setAccessToken,
  setRefreshToken,
  parseJwt,
  getAccessToken,
}

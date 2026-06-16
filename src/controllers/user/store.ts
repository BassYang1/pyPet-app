// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, getUserInfo } from './request'
import { type LoginParams, type UserInfo } from './types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value)

  /** 登录 */
  const loginAction = async (params: LoginParams) => {
    try {
      const res = await login(params)
      token.value = res.token
      userInfo.value = res.userInfo
      // 存储 token 到本地
      uni.setStorageSync('token', res.token)
      return { success: true, data: res }
    } catch (error) {
      console.error('登录失败', error)
      return { success: false, error }
    }
  }

  /** 获取用户信息 */
  const fetchUserInfo = async () => {
    try {
      const info = await getUserInfo()
      userInfo.value = info
      return info
    } catch (error) {
      console.error('获取用户信息失败', error)
      throw error
    }
  }

  /** 退出登录 */
  const logout = () => {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('token')
    uni.reLaunch({ url: '/pages/login/index' })
  }

  /** 从本地恢复 token */
  const restoreToken = () => {
    const storedToken = uni.getStorageSync('token')
    if (storedToken) {
      token.value = storedToken
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    loginAction,
    fetchUserInfo,
    logout,
    restoreToken,
  }
})
// api/modules/user.ts
import http from '@/utils/request'
import type { LoginParams, UserInfo, LoginResponse } from './types'

/**
 * 用户登录
 */
export const login = (data : LoginParams) => {
	return http.post<LoginResponse>('/auth/login', data, {
		showLoading: true,
		loadingText: '登录中...',
		showError: true,
	})
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
	return http.get<UserInfo>('/user/info', undefined, {
		showLoading: false,
		withToken: true,
	})
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data : Partial<UserInfo>) => {
	return http.put<UserInfo>('/user/info', data, {
		showLoading: true,
		loadingText: '保存中...',
	})
}

/**
 * 上传头像
 */
export const uploadAvatar = (filePath : string) => {
	return http.upload<string>('/user/avatar', filePath, 'avatar')
}
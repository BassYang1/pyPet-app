/**
 * 用户信息
 */
export interface UserInfo {
	id : number
	username : string
	nickname : string
	avatar : string
	email : string
}

/**
 * 登录请求参数
 */
export interface LoginParams {
	username : string
	password : string
}

/**
 * 登录响应
 */
export interface LoginResponse {
	token : string
	userInfo : UserInfo
}
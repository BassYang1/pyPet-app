interface ImportMetaEnv {
   // 应用基础
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_VERSION_CODE: number
  readonly VITE_APP_DESC: string
  readonly VITE_APP_CHARSET: string
  
  // 应用环境
  readonly VITE_APP_ENV?: 'dev' | 'test' | 'prod' | 'pre' // 接口地址，全端请求统一域名
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_DEBUG: boolean // 开发调试开关
}

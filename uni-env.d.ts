interface ImportMetaEnv {
  // 自定义变量
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_UPLOAD_URL?: string
  // 如果你需要非标准的模式标识（比如 'pre'），可以保留，否则直接使用 MODE
  readonly VITE_APP_ENV?: 'dev' | 'test' | 'prod' | 'pre'
}
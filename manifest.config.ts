import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'

// 多环境配置
const isProduction = process.env.NODE_ENV === 'production'

const appid = isProduction
  ? '__UNI__PROD_APPID'   // 生产环境 appid（请替换为真实值）
  : '__UNI__DEV_APPID'    // 开发环境 appid（请替换为真实值）

// 公共配置
const commonConfig = {
  name: 'pyPet-app',
  description: '全端开发框架',
  versionName: 'v26.0.0.1',
  versionCode: 1,                     // Number 类型[reference:0]
  transformPx: false,                 // Boolean 类型[reference:1]
  networkTimeout: {
    request: 15000,
    downloadFile: 30000,
  },
}

// App 端配置 (app-plus)
const appPlusConfig = {
  usingComponents: true,
  splashscreen: {
    autoclose: true,                   // Boolean 类型[reference:2]
    delay: 2000,                       // Number 类型（单位毫秒），官方推荐使用 delay[reference:3]
    alwaysShowBeforeRender: true,      // Boolean 类型，等待首页渲染完毕后关闭启动界面[reference:4]
    // ⚠️ 注意：waiting、event、target、dealy 已在官方文档中标记为废弃，新项目不应使用[reference:5]
  },
  statusbar: {
    immersed: 'none' as const,         // ✅ 字符串类型，可取值 'none' | 'suggestedDevice' | 'supportedDevice'[reference:6]
    background: '#ffffff' as const,    // 状态栏背景颜色
  },
  popGesture: 'close' as const,        // 可取值 'close' | 'none' | 'hide'【8†L11-L12?】
  error: {
    url: '_www/error.html',
  },
  icon: '',
  launch_path: '',
  permissions: {},
  // optimization: {}  // 如需分包优化，参考下方说明
}

// H5 端配置
const h5Config = {
  devServer: {
    port: 8084,
    host: '0.0.0.0',
    https: false,
  },
  router: {
    mode: 'history' as const,          // 可取值 'history' | 'hash'[reference:7]
    base: '/',
  },
  title: 'pyPet-ai',
  // optimization: {}  // H5 平台也支持 optimization 配置[reference:8]
  csp: false,
}

// 微信小程序配置
const mpWeixinConfig = {
  appid: '',   // 微信小程序的 AppID[reference:9]
  setting: {
    urlCheck: false,
    es6: true,
    enhance: true,
    postcss: true,
    preloadBackgroundData: false,
    minified: true,
  },
  lazyCodeLoading: 'requiredComponents' as const,   // 按需注入【?†?】
  requiredBackgroundModes: [],
  permission: {
    'scope.userLocation': {
      desc: '用于定位服务',
    },
  },
  privacy: {
    required: false,
  },
}

// 支付宝小程序配置
const mpAlipayConfig = {
  appid: '',
  setting: {},
}

// 抖音小程序配置
const mpToutiaoConfig = {
  appid: '',
}

// 主配置导出
export default defineManifestConfig({
  ...commonConfig,
  appid,
  'app-plus': appPlusConfig,
  h5: h5Config,
  'mp-weixin': mpWeixinConfig,
  'mp-alipay': mpAlipayConfig,
  'mp-toutiao': mpToutiaoConfig,
  vueVersion: '3',                     // 指定 Vue 版本，支持 '2' 或 '3'【?†?】
})
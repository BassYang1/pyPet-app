import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'pypet-app-v26.0.0.1',
    navigationBarBackgroundColor: '#FFFFFF',
    backgroundColor: '#FDFBF7', // 与首页背景色统一
  },
  tabBar: {
    color: '#9D8975',          // 未选中状态：暖灰色（与首页辅助文字色一致）
    selectedColor: '#F2B84E',  // 选中状态：暖橙色（首页主色调）
    backgroundColor: '#FFFFFF', // 背景白色，简洁干净
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'static/tab/home.svg',
        selectedIconPath: 'static/tab/home_active.svg',
      },
      {
        pagePath: 'pages/ai/recognize',
        text: 'AI识别',
        iconPath: 'static/tab/ai.svg',
        selectedIconPath: 'static/tab/ai_active.svg',
      },
      {
        pagePath: 'pages/train/plan',
        text: '训练计划',
        iconPath: 'static/tab/plan.svg',
        selectedIconPath: 'static/tab/plan_active.svg',
      },
      {
        pagePath: 'pages/train/review',
        text: '复盘',
        iconPath: 'static/tab/review.svg',
        selectedIconPath: 'static/tab/review_active.svg',
      },
      {
        pagePath: 'pages/pet/profile',
        text: '我的',
        iconPath: 'static/tab/profile.svg',
        selectedIconPath: 'static/tab/profile_active.svg',
      },
    ],
  },
})
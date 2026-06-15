import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
	globalStyle: {
		navigationBarTextStyle: 'black',
		navigationBarTitleText: 'pypet-app-v26.0.0.1',
		navigationBarBackgroundColor: '#FFFFFF',
		backgroundColor: '#F3F4F6',
	},
	tabBar: {
		color: '#8E8E93',
		selectedColor: '#8B5CF6',
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
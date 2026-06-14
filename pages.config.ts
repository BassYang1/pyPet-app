import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
	globalStyle: {
		navigationBarTextStyle: 'black',
		navigationBarTitleText: 'pyPet-ai',
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
				iconPath: 'static/tab/home.png',
				selectedIconPath: 'static/tab/home_active.png',
			},
			{
				pagePath: 'pages/ai/recognize',
				text: 'AI识别',
				iconPath: 'static/tab/ai.png',
				selectedIconPath: 'static/tab/ai_active.png',
			},
			{
				pagePath: 'pages/train/plan',
				text: '训练计划',
				iconPath: 'static/tab/plan.png',
				selectedIconPath: 'static/tab/plan_active.png',
			},
			{
				pagePath: 'pages/train/review',
				text: '复盘',
				iconPath: 'static/tab/review.png',
				selectedIconPath: 'static/tab/review_active.png',
			},
			{
				pagePath: 'pages/pet/profile',
				text: '我的',
				iconPath: 'static/tab/profile.png',
				selectedIconPath: 'static/tab/profile_active.png',
			},
		],
	},
})
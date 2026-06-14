<template>
	<view class="app-root">
		<router-view />
	</view>
</template>

<script setup lang="ts">	
	onLaunch((options) => {
		// 检查是否首次登录，未登录则跳转登录页
		const hasLoggedIn = uni.getStorageSync('hasLoggedIn')
		if (!hasLoggedIn) {
			// uni.reLaunch({ url: '/pages/login/login' })
			uni.reLaunch({ url: '/pages/home/index' })
		}
	})

	onShow(() => {
		console.log('App Show 切入前台')
	})

	onHide(() => {
		console.log('App Hide 切入后台')
	})

	// H5 端专属
	// #ifdef H5
	console.log('【环境】当前运行在 H5 移动端')
	// #endif

	// 全小程序通用
	// #ifdef MP
	console.log('【环境】当前运行在 小程序端')
	// #endif

	// 仅微信小程序
	// #ifdef MP-WEIXIN
	console.log('【环境】当前运行在 微信小程序')
	// #endif

	// App 原生端
	// #ifdef APP-PLUS
	console.log('【环境】当前运行在 App 原生端')
	// #endif

	// 非 App 端
	// #ifndef APP-PLUS
	console.log('【环境】非 App 端执行')
	// #endif
</script>

<style lang="scss">
	.app-root {
		width: 100%;
		height: 100%;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	page {
		background-color: #f7f8fa;
	}

	#ifdef H5 page {
		font-size: 14px;
		padding-top: env(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-bottom);
	}

	#endif #ifdef MP page {
		font-size: 15px;
	}

	#endif #ifdef APP-PLUS page {
		padding-top: var(--status-bar-height);
	}
</style>
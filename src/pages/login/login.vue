<template>
	<view class="login-container">
		<view class="logo-area">
			<text class="logo-icon">🐾</text>
			<text class="app-name">pyPet-ai</text>
			<text class="slogan">AI 精准识别 · 科学行为训练</text>
		</view>
		<view class="login-card">
			<view class="agree-line">
				<label class="checkbox-label">
					<checkbox :checked="agreed" @click="toggleAgree" /> 同意《用户协议》和《隐私政策》
				</label>
			</view>
			<button class="btn-wechat" @click="wechatLogin">
				微信一键登录
			</button>
			<button class="btn-phone" @click="phoneLogin">
				手机号登录
			</button>
			<view class="tips">无需注册，首次登录引导完善宠物档案</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	definePage({
		style: {
			navigationBarTitleText: '登录',
			navigationStyle: 'custom',
		}
	})

	const agreed = ref(true)
	const toggleAgree = () => {
		agreed.value = !agreed.value
	}

	const wechatLogin = () => {
		if (!agreed.value) {
			uni.showToast({ title: '请先同意协议', icon: 'none' })
			return
		}
		uni.setStorageSync('hasLoggedIn', true)
		const petInfo = uni.getStorageSync('petInfo')
		if (!petInfo) {
			uni.showModal({
				title: '完善宠物档案',
				content: '请为您的爱宠填写基本信息',
				confirmText: '去填写',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({ url: '/pages/pet-profile?firstTime=true' })
					} else {
						uni.switchTab({ url: '/pages/home' })
					}
				}
			})
		} else {
			uni.switchTab({ url: '/pages/home' })
		}
	}

	const phoneLogin = () => {
		if (!agreed.value) {
			uni.showToast({ title: '请先同意协议', icon: 'none' })
			return
		}
		uni.showModal({
			title: '手机号登录',
			content: '请输入手机号',
			editable: true,
			placeholderText: '13812345678',
			success: (res) => {
				if (res.confirm && res.content) {
					uni.setStorageSync('hasLoggedIn', true)
					const petInfo = uni.getStorageSync('petInfo')
					if (!petInfo) {
						uni.navigateTo({ url: '/pages/pet-profile?firstTime=true' })
					} else {
						uni.switchTab({ url: '/pages/home' })
					}
				}
			}
		})
	}
</script>

<style scoped>
	.login-container {
		min-height: 100vh;
		background: #f3f4f6;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 40rpx;
	}

	.logo-area {
		text-align: center;
		margin-bottom: 100rpx;
	}

	.logo-icon {
		font-size: 100rpx;
	}

	.app-name {
		display: block;
		font-size: 56rpx;
		font-weight: bold;
		color: #1e293b;
		margin-top: 20rpx;
	}

	.slogan {
		font-size: 28rpx;
		color: #64748b;
		margin-top: 12rpx;
	}

	.login-card {
		background: white;
		border-radius: 48rpx;
		padding: 48rpx 32rpx;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	}

	.agree-line {
		margin-bottom: 40rpx;
	}

	.btn-wechat {
		background: #07c160;
		color: white;
		border-radius: 80rpx;
		margin-bottom: 24rpx;
	}

	.btn-phone {
		background: #f3e8ff;
		color: #8b5cf6;
		border-radius: 80rpx;
	}

	.tips {
		text-align: center;
		font-size: 24rpx;
		color: #94a3b8;
		margin-top: 32rpx;
	}
</style>
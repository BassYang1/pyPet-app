<template>
	<view class="feedback-page">
		<!-- 统计栏：白色卡片风格 -->
		<view class="stats-bar">
			<text>⏱️ 时长: {{ formatTime(timer) }}</text>
			<text>✅ 成功率: {{ successRate }}%</text>
		</view>

		<!-- 相机/训练画面区域 -->
		<view class="camera-box">
			<image src="/static/training-placeholder.jpg" mode="aspectFill" class="camera-img"></image>
			<view class="recognition-tag">{{ recognitionText }}</view>
			<view class="voice-toast">{{ voiceText }}</view>
		</view>

		<!-- 控制按钮组：使用首页主色 -->
		<view class="control-buttons">
			<button class="btn-pause" @click="pauseTraining">{{ isPaused ? '继续' : '暂停' }}</button>
			<button class="btn-end" @click="endTraining">结束训练</button>
			<button class="btn-reward" @click="reward">🎁 奖励</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from 'vue'

	definePage({
		style: {
			navigationBarTitleText: '实时训练',
			navigationStyle: 'custom',
		}
	})

	const timer = ref(0)
	const successCount = ref(0)
	const totalCount = ref(0)
	const isPaused = ref(false)
	const recognitionText = ref('识别: 等待指令')
	const voiceText = ref('请发出口令「坐」')
	let interval : any = null
	let step = 0

	const formatTime = (seconds : number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}
	const successRate = ref(0)

	const startTraining = () => {
		interval = setInterval(() => {
			if (!isPaused.value) {
				timer.value++
				step++
				if (step === 4) {
					recognitionText.value = '识别: 坐 ✓'
					voiceText.value = '做得好！继续'
					successCount.value++
					totalCount.value++
				} else if (step === 8) {
					recognitionText.value = '识别: 等待'
					voiceText.value = '保持等待5秒'
					totalCount.value++
				} else if (step === 12) {
					step = 0
				}
				if (totalCount.value > 0) {
					successRate.value = Math.floor((successCount.value / totalCount.value) * 100)
				}
			}
		}, 2500)
	}

	const pauseTraining = () => {
		isPaused.value = !isPaused.value
		uni.showToast({ title: isPaused.value ? '已暂停' : '继续训练', icon: 'none' })
	}

	const endTraining = () => {
		if (interval) clearInterval(interval)
		uni.showModal({
			title: '训练结束',
			content: `本次训练成功率 ${successRate.value}%，是否保存并返回？`,
			success: (res) => {
				if (res.confirm) {
					let completed = uni.getStorageSync('planCompleted') || 1
					completed = Math.min(4, completed + 1)
					uni.setStorageSync('planCompleted', completed)
					uni.navigateBack()
				}
			}
		})
	}

	const reward = () => {
		uni.showToast({ title: '🎉 奖励零食！', icon: 'success' })
		successCount.value++
	}

	onMounted(() => {
		startTraining()
	})
	onUnmounted(() => {
		if (interval) clearInterval(interval)
	})
</script>

<style scoped>
	/* 统一暖白米色背景，与首页一致 */
	.feedback-page {
		background: #FDFBF7;
		min-height: 100vh;
		padding: 20rpx 30rpx 40rpx;
	}

	/* 统计栏：白色卡片风格，柔和阴影 */
	.stats-bar {
		display: flex;
		justify-content: space-between;
		background: white;
		padding: 28rpx 32rpx;
		border-radius: 60rpx;
		color: #2C2418;
		font-size: 28rpx;
		font-weight: 500;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.02);
		border: 1px solid #F0E2D2;
	}

	/* 相机/训练区域卡片 */
	.camera-box {
		position: relative;
		border-radius: 48rpx;
		overflow: hidden;
		margin-bottom: 32rpx;
		background: white;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
	}

	.camera-img {
		width: 100%;
		height: 500rpx;
		display: block;
	}

	/* 识别标签：半透深色，保持辨识度 */
	.recognition-tag {
		position: absolute;
		left: 24rpx;
		bottom: 24rpx;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(8px);
		padding: 12rpx 28rpx;
		border-radius: 60rpx;
		color: white;
		font-size: 26rpx;
		font-weight: 500;
	}

	/* 语音提示气泡：使用暖白背景，橙色文字 */
	.voice-toast {
		position: absolute;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
		background: white;
		color: #C57F2F;
		padding: 12rpx 28rpx;
		border-radius: 60rpx;
		white-space: nowrap;
		font-size: 26rpx;
		font-weight: 500;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		border: 1px solid #FFE9D4;
	}

	/* 控制按钮组：与首页快捷入口风格统一 */
	.control-buttons {
		display: flex;
		gap: 20rpx;
		margin-top: 8rpx;
	}

	.btn-pause,
	.btn-end,
	.btn-reward {
		flex: 1;
		border-radius: 80rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		text-align: center;
	}

	/* 暂停/继续按钮：橙色系（首页主色） */
	.btn-pause {
		background: #F2B84E;
		color: white;
		box-shadow: 0 4rpx 12rpx rgba(242, 184, 78, 0.2);
	}

	/* 结束训练：柔和红色调但不过于刺眼 */
	.btn-end {
		background: #FFE8E8;
		color: #E5625E;
		border: 1px solid #FFD4D4;
	}

	/* 奖励按钮：暖橙边框，浅橙底 */
	.btn-reward {
		background: #FFF6ED;
		color: #C57F2F;
		border: 1px solid #FFE9D4;
	}
</style>
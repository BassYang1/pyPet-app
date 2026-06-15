<template>
	<view class="feedback-page">
		<view class="stats-bar">
			<text>⏱️ 时长: {{ formatTime(timer) }}</text>
			<text>✅ 成功率: {{ successRate }}%</text>
		</view>

		<view class="camera-box">
			<image src="/static/training-placeholder.jpg" mode="aspectFill" class="camera-img"></image>
			<view class="recognition-tag">{{ recognitionText }}</view>
			<view class="voice-toast">{{ voiceText }}</view>
		</view>

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
	let interval = null
	let step = 0

	const formatTime = (seconds) => {
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
	.feedback-page {
		background: #1a1a1a;
		min-height: 100vh;
		padding: 30rpx;
	}

	.stats-bar {
		display: flex;
		justify-content: space-between;
		background: #2c2c2e;
		padding: 30rpx;
		border-radius: 60rpx;
		color: white;
		margin-bottom: 30rpx;
	}

	.camera-box {
		position: relative;
		border-radius: 48rpx;
		overflow: hidden;
		margin-bottom: 40rpx;
	}

	.camera-img {
		width: 100%;
		height: 500rpx;
	}

	.recognition-tag {
		position: absolute;
		left: 20rpx;
		bottom: 20rpx;
		background: rgba(0, 0, 0, 0.6);
		padding: 12rpx 24rpx;
		border-radius: 60rpx;
		color: white;
	}

	.voice-toast {
		position: absolute;
		bottom: 80rpx;
		left: 50%;
		transform: translateX(-50%);
		background: white;
		color: #1e293b;
		padding: 12rpx 24rpx;
		border-radius: 60rpx;
		white-space: nowrap;
	}

	.control-buttons {
		display: flex;
		gap: 20rpx;
	}

	.btn-pause,
	.btn-end,
	.btn-reward {
		flex: 1;
		border-radius: 80rpx;
		line-height: 88rpx;
	}

	.btn-pause {
		background: #ff9f0a;
		color: white;
	}

	.btn-end {
		background: #ef4444;
		color: white;
	}

	.btn-reward {
		background: #8b5cf6;
		color: white;
	}
</style>
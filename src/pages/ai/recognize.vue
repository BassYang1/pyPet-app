<template>
	<view class="ai-page">
		<view class="camera-header">
			<text>摄像头</text>
			<view class="camera-switch" @click="switchCamera">
				{{ cameraType }} 📷
			</view>
		</view>
		<view class="camera-box">
			<image v-if="!isRealCamera" src="/static/camera-placeholder.jpg" mode="aspectFill" class="camera-img">
			</image>
			<camera v-else device-position="back" flash="off" class="camera-img"></camera>
			<view class="recognition-tag">
				🐕 识别: {{ currentBehavior }} ({{ confidence }}%)
			</view>
			<view class="emotion-tag">
				情绪指数: {{ emotionIndex }}
			</view>
		</view>
		<view class="info-card">
			<view class="flex-between">
				<text>📋 行为记录</text>
				<text @click="toggleWarning">⚠️ 异常预警 {{ warningEnabled ? '开' : '关' }}</text>
			</view>
			<view class="behavior-logs">
				<text v-for="(log, idx) in behaviorLogs" :key="idx">{{ log }}</text>
			</view>
		</view>
		<button class="exit-btn" @click="goHome">退出</button>
	</view>
</template>

<script setup lang="ts">
	definePage({
		style: {
			navigationBarTitleText: 'AI识别',
			navigationStyle: 'custom',
		}
	})
	
	import { ref, onUnmounted } from 'vue'

	const cameraType = ref('手机摄像头')
	const isRealCamera = ref(false)
	const currentBehavior = ref('坐')
	const confidence = ref(92)
	const emotionIndex = ref(82)
	const warningEnabled = ref(true)
	const behaviorLogs = ref(['坐 (10:32)', '卧 (10:28)', '叫 (10:15)'])

	let interval = null

	const switchCamera = () => {
		if (cameraType.value === '手机摄像头') {
			cameraType.value = '网络摄像头'
			isRealCamera.value = false
			uni.showToast({ title: '切换到网络摄像头（模拟）', icon: 'none' })
		} else {
			cameraType.value = '手机摄像头'
			isRealCamera.value = true
		}
	}
	const toggleWarning = () => {
		warningEnabled.value = !warningEnabled.value
		uni.showToast({ title: `异常预警${warningEnabled.value ? '开启' : '关闭'}`, icon: 'none' })
	}
	const goHome = () => {
		uni.switchTab({ url: '/pages/home' })
	}

	// 模拟随机识别
	interval = setInterval(() => {
		const behaviors = ['坐', '卧', '站立', '叫', '等待']
		const random = Math.floor(Math.random() * behaviors.length)
		currentBehavior.value = behaviors[random]
		confidence.value = Math.floor(Math.random() * 30) + 70
		emotionIndex.value = Math.floor(Math.random() * 40) + 60
		const time = new Date().toLocaleTimeString()
		behaviorLogs.value.unshift(`${currentBehavior.value} (${time})`)
		if (behaviorLogs.value.length > 5) behaviorLogs.value.pop()
	}, 5000)

	onUnmounted(() => {
		if (interval) clearInterval(interval)
	})
</script>

<style scoped>
	.ai-page {
		padding: 30rpx;
		background: #1a1a1a;
		min-height: 100vh;
	}

	.camera-header {
		display: flex;
		justify-content: space-between;
		color: white;
		margin-bottom: 30rpx;
	}

	.camera-switch {
		background: #333;
		padding: 10rpx 24rpx;
		border-radius: 60rpx;
	}

	.camera-box {
		position: relative;
		border-radius: 48rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
	}

	.camera-img {
		width: 100%;
		height: 500rpx;
		background: #2c2c2e;
	}

	.recognition-tag,
	.emotion-tag {
		position: absolute;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(8px);
		padding: 8rpx 24rpx;
		border-radius: 40rpx;
		color: white;
		font-size: 24rpx;
	}

	.recognition-tag {
		left: 20rpx;
		bottom: 20rpx;
	}

	.emotion-tag {
		right: 20rpx;
		top: 20rpx;
	}

	.info-card {
		background: #2c2c2e;
		border-radius: 48rpx;
		padding: 30rpx;
		color: white;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.behavior-logs {
		font-size: 26rpx;
		color: #ccc;
		line-height: 1.6;
	}

	.exit-btn {
		margin-top: 40rpx;
		background: #ef4444;
		color: white;
		border-radius: 80rpx;
	}
</style>
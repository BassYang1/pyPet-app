<template>
	<view class="ai-page">
		<view class="camera-header">
			<text class="title">📷 摄像头</text>
			<view class="camera-switch" @click="switchCamera">
				{{ cameraType }} ▾
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
				😊 情绪: {{ emotionIndex }}
			</view>
		</view>

		<!-- 上传按钮区域 -->
		<view class="upload-buttons">
			<button class="btn-primary" @click="chooseImage">🖼️ 上传图片分析</button>
			<button class="btn-secondary" @click="chooseVideo">🎥 上传视频分析</button>
		</view>

		<!-- 识别结果卡片 -->
		<view class="result-card" v-if="recognitionResult">
			<text class="result-title">✨ AI分析报告</text>
			<view class="section">
				<text class="section-title">行为识别</text>
				<view class="tag-group">
					<view class="tag" v-for="b in recognitionResult.behaviors" :key="b.name">
						{{ b.name }} <text class="conf">{{ b.confidence }}%</text>
					</view>
				</view>
			</view>
			<view class="section">
				<text class="section-title">情绪状态</text>
				<view class="emotion-item" v-for="e in recognitionResult.emotions" :key="e.type">
					<text>{{ e.type }}</text>
					<view class="bar-bg">
						<view class="bar-fill" :style="{ width: e.score + '%' }"></view>
					</view>
					<text>{{ e.score }}%</text>
				</view>
			</view>
			<view class="section">
				<text class="section-title">健康评估</text>
				<view class="health-info">
					<text>体态评分: {{ recognitionResult.health.postureScore || '--' }}</text>
					<text>压力指数: {{ recognitionResult.health.stressLevel }}</text>
					<text>活跃度: {{ recognitionResult.health.activityLevel }}</text>
				</view>
				<view class="suggestions">
					<text class="subtitle">📝 建议</text>
					<view v-for="(s, idx) in recognitionResult.health.suggestions" :key="idx">• {{ s }}</view>
				</view>
			</view>
			<view class="summary">
				<text class="subtitle">📌 总结</text>
				<text>{{ recognitionResult.summary }}</text>
			</view>
			<button class="share-btn" @click="shareResult">分享报告</button>
		</view>

		<!-- 行为记录卡片 -->
		<view class="info-card">
			<view class="flex-between">
				<text class="card-title">📋 行为记录</text>
				<text class="warning-switch" @click="toggleWarning">⚠️ 异常预警 {{ warningEnabled ? '开' : '关' }}</text>
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
	import type { RecognitionResult } from '@/types'

	// 模拟识别API
	async function uploadAndRecognize(filePath : string, type : 'image' | 'video') : Promise<RecognitionResult> {
		uni.showLoading({ title: 'AI分析中...', mask: true })
		await new Promise(resolve => setTimeout(resolve, 2000))
		uni.hideLoading()
		return {
			behaviors: [
				{ name: '坐', confidence: 92 },
				{ name: '安静', confidence: 85 }
			],
			emotions: [
				{ type: '开心', score: 88 },
				{ type: '平静', score: 72 }
			],
			health: {
				postureScore: 82,
				jointWarning: '无明显异常',
				weightStatus: '正常',
				activityLevel: '活跃',
				stressLevel: 25,
				suggestions: ['体态良好，建议每日互动游戏', '多进行正向激励训练']
			},
			summary: '宠物状态良好，情绪积极，继续保持现有训练节奏。'
		}
	}

	const cameraType = ref('手机摄像头')
	const isRealCamera = ref(false)
	const currentBehavior = ref('坐')
	const confidence = ref(92)
	const emotionIndex = ref(82)
	const warningEnabled = ref(true)
	const behaviorLogs = ref(['坐 (10:32)', '卧 (10:28)', '叫 (10:15)'])
	const recognitionResult = ref<RecognitionResult | null>(null)

	let interval : any = null

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

	const chooseImage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				const tempFilePath = res.tempFilePaths[0]
				const result = await uploadAndRecognize(tempFilePath, 'image')
				recognitionResult.value = result
			}
		})
	}

	const chooseVideo = () => {
		uni.chooseVideo({
			sourceType: ['album', 'camera'],
			maxDuration: 60,
			success: async (res) => {
				const tempFilePath = res.tempFilePath
				const result = await uploadAndRecognize(tempFilePath, 'video')
				recognitionResult.value = result
			}
		})
	}

	const shareResult = () => {
		if (!recognitionResult.value) return
		uni.share({
			title: '宠物AI健康报告',
			content: recognitionResult.value.summary,
			path: '/pages/behavior/index'
		})
	}

	// 模拟实时识别
	const startRecognitionInterval = () => {
		if (interval) clearInterval(interval)
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
	}

	onShow(() => {
		startRecognitionInterval()
	})

	onUnmounted(() => {
		if (interval) clearInterval(interval)
	})
</script>

<style scoped>
	.ai-page {
		padding: 30rpx;
		background: #F7F5F0;
		min-height: 100vh;
	}

	.camera-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.camera-header .title {
		font-size: 36rpx;
		font-weight: bold;
		color: #2C2418;
	}

	.camera-switch {
		background: #f1f5f9;
		padding: 12rpx 24rpx;
		border-radius: 60rpx;
		font-size: 28rpx;
		color: #475569;
	}

	.camera-box {
		position: relative;
		border-radius: 48rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
		background: white;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
	}

	.camera-img {
		width: 100%;
		height: 500rpx;
		background: #F0E8DD;
	}

	.recognition-tag,
	.emotion-tag {
		position: absolute;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(8px);
		padding: 8rpx 24rpx;
		border-radius: 40rpx;
		font-size: 24rpx;
		color: #2C2418;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.recognition-tag {
		left: 20rpx;
		bottom: 20rpx;
	}

	.emotion-tag {
		right: 20rpx;
		top: 20rpx;
	}

	.upload-buttons {
		display: flex;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.btn-primary {
		flex: 1;
		background: #8b5cf6;
		color: white;
		border-radius: 80rpx;
		line-height: 88rpx;
		font-size: 28rpx;
	}

	.btn-secondary {
		flex: 1;
		background: #f3e8ff;
		color: #8b5cf6;
		border-radius: 80rpx;
		line-height: 88rpx;
		font-size: 28rpx;
	}

	.result-card {
		background: white;
		border-radius: 48rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
	}

	.result-title {
		font-size: 36rpx;
		font-weight: 700;
		display: block;
		margin-bottom: 20rpx;
		color: #2C2418;
	}

	.section {
		margin-bottom: 24rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 600;
		margin-bottom: 12rpx;
		display: block;
		color: #2C2418;
	}

	.tag-group {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}

	.tag {
		background: #F9F1E8;
		padding: 8rpx 24rpx;
		border-radius: 40rpx;
		font-size: 26rpx;
		color: #2C2418;
	}

	.conf {
		color: #F2B84E;
		margin-left: 8rpx;
	}

	.emotion-item {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin: 12rpx 0;
		font-size: 26rpx;
	}

	.bar-bg {
		flex: 1;
		height: 16rpx;
		background: #F0E4D8;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		background: #F2B84E;
		border-radius: 20rpx;
		width: 0%;
	}

	.health-info {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		background: #FEFAF5;
		padding: 20rpx;
		border-radius: 24rpx;
		font-size: 26rpx;
		color: #2C2418;
	}

	.suggestions,
	.summary {
		margin-top: 20rpx;
		background: #F9F5EE;
		padding: 20rpx;
		border-radius: 24rpx;
		font-size: 26rpx;
		color: #2C2418;
	}

	.subtitle {
		font-weight: 600;
		display: block;
		margin-bottom: 10rpx;
	}

	.share-btn {
		background: #8b5cf6;
		color: white;
		border-radius: 80rpx;
		margin-top: 24rpx;
		line-height: 88rpx;
	}

	.info-card {
		background: white;
		border-radius: 48rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.card-title {
		font-weight: 600;
		font-size: 30rpx;
		color: #2C2418;
	}

	.warning-switch {
		color: #f59e0b;
		font-size: 26rpx;
	}

	.behavior-logs {
		font-size: 26rpx;
		color: #64748b;
		line-height: 1.6;
	}

	.exit-btn {
		margin-top: 40rpx;
		background: transparent;
		border: 1px solid #d1d5db;
		color: #475569;
		border-radius: 80rpx;
		line-height: 88rpx;
	}
</style>
<template>
	<view class="review-page">
		<view class="date-filter">
			<view v-for="range in ['今日', '本周', '本月']" :key="range"
				:class="['filter-item', { active: currentRange === range }]" @click="changeRange(range)">
				{{ range }}
			</view>
		</view>

		<view class="card">
			<text class="chart-title">📈 数据趋势</text>
			<view class="chart-area">
				<text>📊 {{ chartData[currentRange].text }}</text>
			</view>
			<view class="stats-row">
				<view class="stat-item">
					<text class="stat-value">{{ chartData[currentRange].improveRate }}</text>
					<text>行为改善率</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ chartData[currentRange].emotion }}</text>
					<text>情绪曲线</text>
				</view>
			</view>
		</view>

		<view class="action-buttons">
			<button class="btn-report" @click="generateReport">📄 复盘报告</button>
			<button class="btn-share" @click="shareReport">分享</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	definePage({
		style: {
			navigationBarTitleText: '进度复盘',
			navigationStyle: 'custom',
		}
	})


	const currentRange = ref('今日')
	const chartData = {
		'今日': { text: '成功率 +8% · 改善率 +12%', improveRate: '+12%', emotion: '😌 平稳' },
		'本周': { text: '成功率 +15% · 改善率 +22%', improveRate: '+22%', emotion: '😊 愉悦' },
		'本月': { text: '成功率 +30% · 改善率 +35%', improveRate: '+35%', emotion: '😃 非常稳定' }
	}

	const changeRange = (range) => {
		currentRange.value = range
	}
	const generateReport = () => {
		uni.showModal({
			title: '生成报告',
			content: '报告已生成，可分享或保存',
			showCancel: false
		})
	}
	const shareReport = () => {
		uni.share({
			title: '我的宠物训练报告',
			content: `本周训练成功率提升${chartData[currentRange.value].improveRate}`,
			success: () => {
				uni.showToast({ title: '分享成功', icon: 'success' })
			}
		})
	}
</script>

<style scoped>
	.review-page {
		padding: 30rpx;
	}

	.date-filter {
		display: flex;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.filter-item {
		flex: 1;
		text-align: center;
		padding: 16rpx 0;
		background: #f1f5f9;
		border-radius: 60rpx;
	}

	.filter-item.active {
		background: #8b5cf6;
		color: white;
	}

	.card {
		background: white;
		border-radius: 48rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
	}

	.chart-title {
		font-weight: bold;
		font-size: 32rpx;
	}

	.chart-area {
		height: 240rpx;
		background: #f8fafe;
		border-radius: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 24rpx 0;
		color: #64748b;
	}

	.stats-row {
		display: flex;
		gap: 20rpx;
	}

	.stat-item {
		flex: 1;
		text-align: center;
		background: #f8fafe;
		border-radius: 32rpx;
		padding: 24rpx 0;
	}

	.stat-value {
		font-size: 44rpx;
		font-weight: bold;
		display: block;
	}

	.action-buttons {
		display: flex;
		gap: 20rpx;
	}

	.btn-report,
	.btn-share {
		flex: 1;
		border-radius: 80rpx;
		line-height: 88rpx;
	}

	.btn-report {
		background: #f3e8ff;
		color: #8b5cf6;
	}

	.btn-share {
		background: #8b5cf6;
		color: white;
	}
</style>
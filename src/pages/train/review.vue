<template>
	<view class="review-page">
		<!-- 日期筛选栏：改成类似首页话题标签风格 -->
		<view class="date-filter">
			<view v-for="range in ['今日', '本周', '本月']" :key="range"
				:class="['filter-item', { active: currentRange === range }]" @click="changeRange(range)">
				{{ range }}
			</view>
		</view>

		<!-- 数据卡片：统一卡片样式 -->
		<view class="card">
			<text class="chart-title">📈 数据趋势</text>
			<view class="chart-area">
				<text>📊 {{ chartData[currentRange].text }}</text>
			</view>
			<view class="stats-row">
				<view class="stat-item">
					<text class="stat-value">{{ chartData[currentRange].improveRate }}</text>
					<text class="stat-label">行为改善率</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ chartData[currentRange].emotion }}</text>
					<text class="stat-label">情绪曲线</text>
				</view>
			</view>
		</view>

		<!-- 按钮组：统一按钮风格 -->
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

	const changeRange = (range : string) => {
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
	/* 统一页面背景色，与首页一致 */
	.review-page {
		background: #FDFBF7;
		min-height: 100vh;
		padding: 20rpx 30rpx 40rpx;
	}

	/* 日期筛选栏：模仿首页话题标签 chips 样式 */
	.date-filter {
		display: flex;
		gap: 20rpx;
		margin-bottom: 24rpx;
		flex-wrap: wrap;
	}

	.filter-item {
		background: white;
		border: 1px solid #F0E2D2;
		border-radius: 60rpx;
		padding: 12rpx 32rpx;
		font-size: 26rpx;
		color: #5A4230;
		text-align: center;
		flex: 1;
	}

	.filter-item.active {
		background: #FEF3E4;
		border-color: #F2B84E;
		color: #B95F1A;
	}

	/* 数据卡片：与首页 post-card 风格一致 */
	.card {
		background: white;
		border-radius: 40rpx;
		padding: 28rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
	}

	.chart-title {
		font-weight: 700;
		font-size: 32rpx;
		color: #2C2418;
		display: block;
		margin-bottom: 16rpx;
	}

	/* 图表区域：保持简洁但融入暖色调 */
	.chart-area {
		background: #FEFAF5;
		border-radius: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200rpx;
		margin: 16rpx 0 24rpx;
		color: #8E7A67;
		font-size: 28rpx;
		text-align: center;
		padding: 30rpx 20rpx;
	}

	/* 数据统计行 */
	.stats-row {
		display: flex;
		gap: 20rpx;
	}

	.stat-item {
		flex: 1;
		text-align: center;
		background: #FEFAF5;
		border-radius: 32rpx;
		padding: 24rpx 12rpx;
	}

	.stat-value {
		font-size: 44rpx;
		font-weight: 700;
		color: #C57F2F;
		display: block;
		margin-bottom: 8rpx;
	}

	.stat-label {
		font-size: 24rpx;
		color: #8E7A67;
	}

	/* 操作按钮组 */
	.action-buttons {
		display: flex;
		gap: 20rpx;
		margin-top: 8rpx;
	}

	.btn-report,
	.btn-share {
		flex: 1;
		border-radius: 80rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		text-align: center;
	}

	.btn-report {
		background: #FFF6ED;
		color: #C57F2F;
		border: 1px solid #FFE9D4;
	}

	.btn-share {
		background: #F2B84E;
		color: white;
		box-shadow: 0 4rpx 12rpx rgba(242, 184, 78, 0.2);
	}
</style>
<template>
	<view class="plan-page">
		<!-- 头部：类似首页 pet-bar 风格 -->
		<view class="plan-header">
			<view class="header-left">
				<text class="title">🎯 训练目标</text>
			</view>
			<view class="target-switch" @click="switchTarget">
				{{ currentTarget }} ▾
			</view>
			<view class="custom-btn" @click="customPlan">自定义计划</view>
		</view>

		<!-- 计划列表：类似首页 feed 卡片 -->
		<view class="plan-list">
			<view v-for="(plan, idx) in plans" :key="idx" class="plan-item">
				<view class="plan-info">
					<text class="plan-name">{{ plan.name }}</text>
					<text class="plan-target">{{ plan.target }}</text>
				</view>
				<view :class="['status-badge', plan.status === 'done' ? 'done' : 'pending']">
					{{ plan.status === 'done' ? '已完成' : '待训练' }}
				</view>
			</view>
		</view>

		<!-- 操作按钮组 -->
		<view class="action-buttons">
			<button class="btn-primary" @click="startTraining">▶ 开启训练</button>
			<button class="btn-secondary" @click="historyPlan">📜 历史计划</button>
		</view>
		<button class="report-btn" @click="goToReview">📋 复盘报告</button>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	definePage({
		style: {
			navigationBarTitleText: '训练计划',
			navigationStyle: 'custom',
		}
	})

	const currentTarget = ref('基础服从')
	const plans = ref([
		{ name: '坐下训练', target: '10次 · 成功率≥80%', status: 'done' },
		{ name: '随行训练', target: '8分钟 · 成功率≥70%', status: 'pending' },
		{ name: '等待训练', target: '5次 · 成功率≥75%', status: 'pending' },
		{ name: '召回训练', target: '6次 · 成功率≥85%', status: 'pending' }
	])

	const loadPlanStatus = () => {
		const completed = uni.getStorageSync('planCompleted') || 1
		plans.value.forEach((p, idx) => {
			p.status = idx < completed ? 'done' : 'pending'
		})
	}
	const switchTarget = () => {
		uni.showActionSheet({
			itemList: ['基础服从', '纠正恶习', '互动训练'],
			success: (res) => {
				if (res.tapIndex === 0) {
					currentTarget.value = '基础服从'
					plans.value = [
						{ name: '坐下训练', target: '10次 · 成功率≥80%', status: 'done' },
						{ name: '随行训练', target: '8分钟 · 成功率≥70%', status: 'pending' },
						{ name: '等待训练', target: '5次 · 成功率≥75%', status: 'pending' }
					]
				} else if (res.tapIndex === 1) {
					currentTarget.value = '纠正恶习'
					plans.value = [
						{ name: '禁止扑人', target: '12次 · 成功率≥75%', status: 'pending' },
						{ name: '不乱叫', target: '10分钟 · 成功率≥70%', status: 'pending' }
					]
				} else {
					currentTarget.value = '互动训练'
					plans.value = [
						{ name: '握手训练', target: '8次 · 成功率≥85%', status: 'pending' },
						{ name: '飞盘互动', target: '5次 · 成功率≥90%', status: 'pending' }
					]
				}
			}
		})
	}
	const customPlan = () => uni.showToast({ title: '自定义计划开发中', icon: 'none' })
	const startTraining = () => uni.navigateTo({ url: '/pages/training-feedback' })
	const historyPlan = () => uni.showToast({ title: '历史计划：上周完成率78%', icon: 'none' })
	const goToReview = () => uni.switchTab({ url: '/pages/progress-review' })

	onShow(() => {
		loadPlanStatus()
	})
</script>

<style scoped>
	/* 统一页面背景色，与首页一致 */
	.plan-page {
		background: #FDFBF7;
		min-height: 100vh;
		padding: 20rpx 30rpx 40rpx;
	}

	/* 头部容器：类似首页的 pet-bar / 氛围条风格 */
	.plan-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		padding: 16rpx 24rpx;
		border-radius: 60rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.02);
	}

	.header-left {
		flex: 1;
	}

	.title {
		font-weight: 700;
		font-size: 32rpx;
		color: #2C2418;
	}

	.target-switch {
		background: #FDFBF7;
		border: 1px solid #F0E2D2;
		border-radius: 60rpx;
		padding: 8rpx 24rpx;
		font-size: 26rpx;
		color: #5A4230;
		margin: 0 16rpx;
	}

	.custom-btn {
		background: #FFF6ED;
		border: 1px solid #FFE9D4;
		border-radius: 60rpx;
		padding: 8rpx 24rpx;
		font-size: 26rpx;
		color: #D68B3A;
	}

	/* 计划列表：卡片样式与首页 post-card 完全一致 */
	.plan-list {
		background: white;
		border-radius: 40rpx;
		padding: 8rpx 28rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
	}

	.plan-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 0;
		border-bottom: 1px solid #F7EFE6;
	}

	.plan-item:last-child {
		border-bottom: none;
	}

	.plan-info {
		flex: 1;
	}

	.plan-name {
		font-weight: 700;
		font-size: 30rpx;
		color: #2C2418;
		display: block;
		margin-bottom: 8rpx;
	}

	.plan-target {
		font-size: 24rpx;
		color: #8E7A67;
	}

	/* 状态徽章：暖色调调整 */
	.status-badge {
		padding: 8rpx 24rpx;
		border-radius: 40rpx;
		font-size: 24rpx;
		font-weight: 500;
	}

	.done {
		background: #E9F7EF;
		color: #2D8C5A;
	}

	.pending {
		background: #FFF3E0;
		color: #D68B3A;
	}

	/* 按钮组布局 */
	.action-buttons {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.btn-primary,
	.btn-secondary,
	.report-btn {
		border-radius: 80rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		text-align: center;
	}

	.btn-primary {
		flex: 1;
		background: #F2B84E;
		color: white;
		box-shadow: 0 4rpx 12rpx rgba(242, 184, 78, 0.2);
	}

	.btn-secondary {
		flex: 1;
		background: #FFF6ED;
		color: #C57F2F;
		border: 1px solid #FFE9D4;
	}

	.report-btn {
		width: 100%;
		background: white;
		color: #9D8975;
		border: 1px solid #F0E2D2;
		margin-top: 8rpx;
	}
</style>
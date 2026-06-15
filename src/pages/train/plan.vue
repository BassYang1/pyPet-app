
<template>
	<view class="plan-page">
		<view class="plan-header">
			<text class="title">🎯 训练目标</text>
			<view class="target-switch" @click="switchTarget">
				{{ currentTarget }} ▾
			</view>
			<view class="custom-btn" @click="customPlan">自定义计划</view>
		</view>

		<view class="plan-list">
			<view v-for="(plan, idx) in plans" :key="idx" class="plan-item">
				<view>
					<text class="plan-name">{{ plan.name }}</text>
					<text class="plan-target">{{ plan.target }}</text>
				</view>
				<view :class="['status-badge', plan.status === 'done' ? 'done' : 'pending']">
					{{ plan.status === 'done' ? '已完成' : '待训练' }}
				</view>
			</view>
		</view>

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
	.plan-page {
		padding: 30rpx;
	}

	.plan-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.target-switch {
		background: #f1f5f9;
		padding: 12rpx 24rpx;
		border-radius: 60rpx;
	}

	.custom-btn {
		color: #8b5cf6;
	}

	.plan-list {
		background: white;
		border-radius: 48rpx;
		padding: 20rpx;
		margin-bottom: 40rpx;
	}

	.plan-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.plan-name {
		font-weight: bold;
		display: block;
		font-size: 32rpx;
	}

	.plan-target {
		font-size: 24rpx;
		color: #64748b;
	}

	.status-badge {
		padding: 8rpx 24rpx;
		border-radius: 40rpx;
		font-size: 24rpx;
	}

	.done {
		background: #e6f7ec;
		color: #10b981;
	}

	.pending {
		background: #fef3c7;
		color: #f59e0b;
	}

	.action-buttons {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.btn-primary,
	.btn-secondary {
		flex: 1;
		border-radius: 80rpx;
		line-height: 88rpx;
	}

	.btn-primary {
		background: #8b5cf6;
		color: white;
	}

	.btn-secondary {
		background: #f3e8ff;
		color: #8b5cf6;
	}

	.report-btn {
		background: transparent;
		border: 1px solid #d1d5db;
		color: #475569;
		border-radius: 80rpx;
	}
</style>
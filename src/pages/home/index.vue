<template>
	<view class="home-page">
		<view class="pet-header" @click="showPetSelector">
			<view class="pet-info">
				<image class="pet-avatar" :src="currentPet.avatar || '/static/default-avatar.png'" mode="aspectFill">
				</image>
				<view>
					<text class="pet-name">{{ currentPet.name }} <text class="switch-icon">▾</text></text>
					<text class="pet-detail">{{ currentPet.breed }} · {{ currentPet.age }}</text>
				</view>
			</view>
			<view class="exchange-icon">⇄</view>
		</view>

		<view class="double-btn">
			<button class="btn-primary" @click="goToAi">📷 AI行为识别</button>
			<button class="btn-secondary" @click="goToPlan">📋 我的训练计划</button>
		</view>

		<view class="stats-row">
			<view class="stat-item">
				<text class="stat-value">{{ currentPet.behaviorCount || 0 }}</text>
				<text class="stat-label">今日行为</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ currentPet.successRate || 0 }}%</text>
				<text class="stat-label">训练成功率</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ currentPet.mood || '平静' }}</text>
				<text class="stat-label">情绪状态</text>
			</view>
		</view>

		<view class="card">
			<view class="flex-between">
				<text>今日训练进度</text>
				<text>{{ currentPet.planCompleted || 0 }}/{{ currentPet.planTotal || 4 }} 完成</text>
			</view>
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
			</view>
		</view>

		<view class="grid-4">
			<view class="entry-item" @click="goToReview">
				<view class="entry-icon">📈</view><text>进度复盘</text>
			</view>
			<view class="entry-item" @click="goToProfile">
				<view class="entry-icon">📄</view><text>宠物档案</text>
			</view>
			<view class="entry-item" @click="showVip">
				<view class="entry-icon">💎</view><text>增值服务</text>
			</view>
			<view class="entry-item" @click="showHardware">
				<view class="entry-icon">🔗</view><text>硬件联动</text>
			</view>
		</view>

		<!-- 新增宠物按钮 -->
		<view class="add-pet-btn" @click="addPet">+ 新增宠物</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	// import { usePetStore } from '@/stores/pet' // 后面会实现store

	definePage({
		type: "home",
		style: {
			navigationBarTitleText: '首页',
			navigationStyle: 'custom',
		}
	})

	// 简化版：直接从storage读取
	const pets = ref([])
	const currentPetId = ref(1)

	const loadData = () => {
		const stored = uni.getStorageSync('pets')
		if (stored && stored.length) {
			pets.value = stored
			const id = uni.getStorageSync('currentPetId')
			if (id) currentPetId.value = id
		} else {
			pets.value = [
				{ id: 1, name: '团团', breed: '柴犬', age: '1岁半', avatar: '', behaviorCount: 24, successRate: 82, mood: '愉悦', planCompleted: 2, planTotal: 4 }
			]
			saveToStorage()
		}
	}
	const saveToStorage = () => {
		uni.setStorageSync('pets', pets.value)
		uni.setStorageSync('currentPetId', currentPetId.value)
	}
	const currentPet = computed(() => pets.value.find(p => p.id === currentPetId.value) || {})
	const progressPercent = computed(() => {
		if (!currentPet.value.planTotal) return 0
		return (currentPet.value.planCompleted / currentPet.value.planTotal) * 100
	})

	const goToAi = () => uni.switchTab({ url: '/pages/ai/recognize' })
	const goToPlan = () => uni.switchTab({ url: '/pages/train/plan' })
	const goToReview = () => uni.switchTab({ url: '/pages/train/review' })
	const goToProfile = () => uni.switchTab({ url: '/pages/pet/profile' })
	const showVip = () => uni.showToast({ title: '增值服务开发中', icon: 'none' })
	const showHardware = () => uni.showToast({ title: '硬件联动开发中', icon: 'none' })

	// 宠物切换弹窗（简单模拟，不使用uni-popup，避免依赖）
	const showPetSelector = () => {
		const list = pets.value.map(p => `${p.name} · ${p.breed}`)
		uni.showActionSheet({
			itemList: list,
			success: (res) => {
				const selected = pets.value[res.tapIndex]
				if (selected) {
					currentPetId.value = selected.id
					saveToStorage()
					uni.showToast({ title: '切换成功', icon: 'success' })
				}
			}
		})
	}

	const addPet = () => {
		uni.showModal({
			title: '新增宠物',
			content: '请输入宠物名字',
			editable: true,
			placeholderText: '如：小咪',
			success: (res) => {
				if (res.confirm && res.content) {
					const newId = Date.now()
					pets.value.push({
						id: newId,
						name: res.content,
						breed: '未知',
						age: '0岁',
						avatar: '',
						behaviorCount: 0,
						successRate: 0,
						mood: '平静',
						planCompleted: 0,
						planTotal: 4
					})
					saveToStorage()
					currentPetId.value = newId
					saveToStorage()
					uni.showToast({ title: '添加成功', icon: 'success' })
				}
			}
		})
	}

	onShow(() => {
		loadData()
	})
	
	loadData()
</script>

<style scoped>
	.home-page {
		padding: 30rpx;
	}

	.pet-header {
		background: white;
		border-radius: 60rpx;
		padding: 20rpx;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pet-info {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.pet-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: #e0c3ff;
	}

	.pet-name {
		font-weight: bold;
		font-size: 36rpx;
	}

	.switch-icon {
		font-size: 28rpx;
		color: #94a3b8;
	}

	.pet-detail {
		font-size: 26rpx;
		color: #6c6c70;
	}

	.exchange-icon {
		background: #f1f5f9;
		padding: 12rpx;
		border-radius: 50%;
	}

	.double-btn {
		display: flex;
		gap: 20rpx;
		margin: 30rpx 0;
	}

	.btn-primary,
	.btn-secondary {
		flex: 1;
		border-radius: 80rpx;
		line-height: 88rpx;
		font-size: 32rpx;
	}

	.btn-primary {
		background: #8b5cf6;
		color: white;
	}

	.btn-secondary {
		background: #f3e8ff;
		color: #8b5cf6;
	}

	.stats-row {
		display: flex;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.stat-item {
		flex: 1;
		background: #f8fafe;
		border-radius: 40rpx;
		padding: 30rpx 0;
		text-align: center;
	}

	.stat-value {
		font-size: 44rpx;
		font-weight: bold;
		display: block;
	}

	.stat-label {
		font-size: 24rpx;
		color: #64748b;
	}

	.card {
		background: white;
		border-radius: 48rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
	}

	.progress-bar {
		height: 12rpx;
		background: #e2e8f0;
		border-radius: 12rpx;
		margin-top: 16rpx;
	}

	.progress-fill {
		height: 100%;
		background: #8b5cf6;
		border-radius: 12rpx;
	}

	.grid-4 {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24rpx;
		text-align: center;
	}

	.entry-icon {
		width: 80rpx;
		height: 80rpx;
		background: #f1f5f9;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		margin: 0 auto 12rpx;
	}

	.add-pet-btn {
		margin-top: 30rpx;
		text-align: center;
		padding: 20rpx;
		background: #f3e8ff;
		color: #8b5cf6;
		border-radius: 80rpx;
	}
</style>
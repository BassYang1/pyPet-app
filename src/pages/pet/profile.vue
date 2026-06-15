<template>
	<view class="profile-page">
		<view class="card">
			<view class="avatar-area">
				<image class="avatar" :src="pet.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
				<button class="change-avatar" @click="changeAvatar">更换头像</button>
			</view>
			<view class="form-item">
				<text>名字</text>
				<input v-model="pet.name" placeholder="请输入名字" />
			</view>
			<view class="form-item">
				<text>品种</text>
				<input v-model="pet.breed" placeholder="请输入品种" />
			</view>
			<view class="form-item">
				<text>年龄</text>
				<input v-model="pet.age" placeholder="请输入年龄" />
			</view>
			<button class="save-btn" @click="saveProfile">保存修改</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	definePage({
		style: {
			navigationBarTitleText: '宠物档案',
			navigationStyle: 'custom',
		}
	})

	const pet = ref({
		id: 1,
		name: '',
		breed: '',
		age: '',
		avatar: ''
	})

	const loadPet = () => {
		const pets = uni.getStorageSync('pets')
		const currentId = uni.getStorageSync('currentPetId')
		if (pets && currentId) {
			const found = pets.find(p => p.id === currentId)
			if (found) pet.value = { ...found }
		} else {
			pet.value = { id: 1, name: '团团', breed: '柴犬', age: '1岁半', avatar: '' }
		}
	}

	const changeAvatar = () => {
		uni.chooseImage({
			count: 1,
			success: (res) => {
				pet.value.avatar = res.tempFilePaths[0]
				uni.showToast({ title: '头像已更换', icon: 'success' })
			}
		})
	}

	const saveProfile = () => {
		let pets = uni.getStorageSync('pets') || []
		const index = pets.findIndex(p => p.id === pet.value.id)
		if (index !== -1) {
			pets[index] = pet.value
		} else {
			pets.push(pet.value)
		}
		uni.setStorageSync('pets', pets)
		uni.setStorageSync('petInfo', pet.value)
		uni.showToast({ title: '保存成功', icon: 'success' })
		setTimeout(() => {
			uni.switchTab({ url: '/pages/home' })
		}, 1500)
	}

	onLoad((options) => {
		loadPet()
		if (options?.firstTime === 'true') {
			uni.showToast({ title: '请完善档案信息', icon: 'none' })
		}
	})
</script>

<style scoped>
	.profile-page {
		padding: 30rpx;
	}

	.card {
		background: white;
		border-radius: 48rpx;
		padding: 40rpx;
	}

	.avatar-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		background: #e0c3ff;
		margin-bottom: 20rpx;
	}

	.change-avatar {
		background: #f3e8ff;
		color: #8b5cf6;
		border-radius: 60rpx;
		font-size: 28rpx;
		padding: 12rpx 30rpx;
	}

	.form-item {
		margin-bottom: 30rpx;
	}

	.form-item text {
		display: block;
		font-size: 28rpx;
		margin-bottom: 12rpx;
		color: #475569;
	}

	.form-item input {
		border: 1px solid #e2e8f0;
		border-radius: 30rpx;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.save-btn {
		background: #8b5cf6;
		color: white;
		border-radius: 80rpx;
		margin-top: 30rpx;
	}
</style>
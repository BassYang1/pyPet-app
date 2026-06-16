<template>
	<view class="profile-page">
		<!-- 多宠物切换栏 -->
		<view class="pet-tabs">
			<scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
				<view class="tab-item" v-for="pet in pets" :key="pet.id" @click="switchPet(pet.id)">
					<image class="tab-avatar" :src="pet.avatar || '/static/default-avatar.png'" mode="aspectFill">
					</image>
					<text class="tab-name">{{ pet.name }}</text>
					<view class="tab-badge" v-if="currentPetId === pet.id">当前</view>
				</view>
				<view class="tab-item add-tab" @click="addNewPet">
					<text class="add-icon">+</text>
					<text class="tab-name">新增</text>
				</view>
			</scroll-view>
		</view>

		<!-- 宠物档案卡片 -->
		<view class="card">
			<!-- 头像区域 -->
			<view class="avatar-area">
				<image class="avatar" :src="currentPet.avatar || '/static/default-avatar.png'" mode="aspectFill">
				</image>
				<button class="change-avatar-btn" @click="changeAvatar">📷 更换头像</button>
			</view>

			<!-- 表单信息 -->
			<view class="form-section">
				<view class="form-row">
					<view class="form-item half">
						<text class="label">🐾 昵称</text>
						<input v-model="formData.name" placeholder="请输入宠物名字" class="input" />
					</view>
					<view class="form-item half">
						<text class="label">🐕 品种</text>
						<input v-model="formData.breed" placeholder="如：柴犬、布偶猫" class="input" />
					</view>
				</view>

				<view class="form-row">
					<view class="form-item half">
						<text class="label">🎂 年龄（月）</text>
						<input v-model.number="formData.age" type="number" placeholder="数字" class="input" />
					</view>
					<view class="form-item half">
						<text class="label">⚥ 性别</text>
						<view class="gender-group">
							<view class="gender-option" :class="{ active: formData.gender === 'male' }"
								@click="formData.gender = 'male'">公 ♂</view>
							<view class="gender-option" :class="{ active: formData.gender === 'female' }"
								@click="formData.gender = 'female'">母 ♀</view>
						</view>
					</view>
				</view>

				<view class="form-row">
					<view class="form-item half">
						<text class="label">⚖️ 体重（kg）</text>
						<input v-model.number="formData.weight" type="digit" placeholder="数字" class="input" />
					</view>
					<view class="form-item half">
						<text class="label">💭 性格</text>
						<view class="select-box" @click="showPersonalityPicker">
							<text>{{ formData.personalityLabel || '请选择' }}</text>
							<text class="arrow">▾</text>
						</view>
					</view>
				</view>

				<view class="form-item">
					<text class="label">📋 过往行为（可选多选）</text>
					<view class="tag-group">
						<view class="tag" v-for="item in behaviorOptions" :key="item.value"
							:class="{ active: formData.pastBehaviors.includes(item.value) }"
							@click="toggleBehavior(item.value)">
							{{ item.label }}
						</view>
					</view>
				</view>

				<view class="form-item">
					<text class="label">❤️ 健康状态</text>
					<textarea v-model="formData.healthStatus" placeholder="如：疫苗齐全，无慢性病" class="textarea"
						auto-height></textarea>
				</view>
			</view>

			<button class="save-btn" @click="saveProfile">💾 保存档案</button>
		</view>

		<!-- 删除宠物按钮（非默认宠物时显示） -->
		<button class="delete-btn" v-if="pets.length > 1 && currentPet" @click="deleteCurrentPet">删除
			{{ currentPet.name }}</button>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'

	definePage({
		style: {
			navigationBarTitleText: '我的宠物',
			navigationStyle: 'custom',
		}
	})

	interface Pet {
		id : number
		name : string
		breed : string
		age : number
		gender : 'male' | 'female'
		weight : number
		personality : string
		pastBehaviors : string[]
		healthStatus : string
		avatar : string
	}

	// ---------- 静态选项 ----------
	const personalityMap : Record<string, string> = {
		gentle: '温顺',
		active: '活泼',
		timid: '胆小'
	}
	const behaviorOptions = [
		{ label: '乱叫', value: 'bark' },
		{ label: '拆家', value: 'destroy' },
		{ label: '随地大小便', value: 'pee' },
		{ label: '护食', value: 'foodGuard' },
		{ label: '抓沙发', value: 'scratch' }
	]

	// ---------- 数据 ----------
	const pets = ref<Pet[]>([])
	const currentPetId = ref<number>(0)
	const currentPet = computed(() => pets.value.find(p => p.id === currentPetId.value))
	const formData = ref<Pet>({
		id: 0,
		name: '',
		breed: '',
		age: 0,
		gender: 'male',
		weight: 0,
		personality: 'gentle',
		pastBehaviors: [],
		healthStatus: '',
		avatar: ''
	})
	const personalityLabel = computed(() => personalityMap[formData.value.personality] || '温顺')

	// 加载数据
	const loadData = () => {
		const stored = uni.getStorageSync('pets')
		if (stored && stored.length) {
			pets.value = stored
			const id = uni.getStorageSync('currentPetId')
			if (id && pets.value.some(p => p.id === id)) {
				currentPetId.value = id
			} else {
				currentPetId.value = pets.value[0].id
			}
			loadCurrentPetToForm()
		} else {
			// 默认演示宠物
			const defaultPet : Pet = {
				id: Date.now(),
				name: '团团',
				breed: '柴犬',
				age: 18,
				gender: 'male',
				weight: 12,
				personality: 'active',
				pastBehaviors: ['bark', 'destroy'],
				healthStatus: '健康，已接种疫苗',
				avatar: ''
			}
			pets.value = [defaultPet]
			currentPetId.value = defaultPet.id
			saveToStorage()
			loadCurrentPetToForm()
		}
	}

	const loadCurrentPetToForm = () => {
		const pet = currentPet.value
		if (pet) {
			formData.value = { ...pet }
		}
	}

	const saveToStorage = () => {
		uni.setStorageSync('pets', pets.value)
		uni.setStorageSync('currentPetId', currentPetId.value)
	}

	// 切换宠物
	const switchPet = (id : number) => {
		if (currentPetId.value === id) return
		// 检查当前表单是否有未保存更改（简单弹窗提醒）
		uni.showModal({
			title: '提示',
			content: '切换宠物会丢失未保存的修改，确定切换？',
			success: (res) => {
				if (res.confirm) {
					currentPetId.value = id
					loadCurrentPetToForm()
					uni.showToast({ title: '已切换', icon: 'success' })
				}
			}
		})
	}

	// 新增宠物
	const addNewPet = () => {
		const newPet : Pet = {
			id: Date.now(),
			name: '新伙伴',
			breed: '未知',
			age: 0,
			gender: 'male',
			weight: 0,
			personality: 'gentle',
			pastBehaviors: [],
			healthStatus: '',
			avatar: ''
		}
		pets.value.push(newPet)
		currentPetId.value = newPet.id
		loadCurrentPetToForm()
		saveToStorage()
		uni.showToast({ title: '已添加新宠物，请完善信息', icon: 'none' })
	}

	// 删除当前宠物
	const deleteCurrentPet = () => {
		uni.showModal({
			title: '确认删除',
			content: `确定删除 ${currentPet.value?.name} 的档案吗？数据不可恢复。`,
			success: (res) => {
				if (res.confirm) {
					const index = pets.value.findIndex(p => p.id === currentPetId.value)
					if (index !== -1) {
						pets.value.splice(index, 1)
						if (pets.value.length) {
							currentPetId.value = pets.value[0].id
							loadCurrentPetToForm()
						}
						saveToStorage()
						uni.showToast({ title: '删除成功', icon: 'success' })
					}
				}
			}
		})
	}

	// 更换头像
	const changeAvatar = () => {
		uni.chooseImage({
			count: 1,
			success: (res) => {
				const tempPath = res.tempFilePaths[0]
				formData.value.avatar = tempPath
				uni.showToast({ title: '头像已更换', icon: 'success' })
			}
		})
	}

	// 性格选择器
	const showPersonalityPicker = () => {
		uni.showActionSheet({
			itemList: ['温顺', '活泼', '胆小'],
			success: (res) => {
				const map = ['gentle', 'active', 'timid']
				formData.value.personality = map[res.tapIndex]
			}
		})
	}

	// 切换过往行为标签
	const toggleBehavior = (value : string) => {
		const idx = formData.value.pastBehaviors.indexOf(value)
		if (idx === -1) {
			formData.value.pastBehaviors.push(value)
		} else {
			formData.value.pastBehaviors.splice(idx, 1)
		}
	}

	// 保存档案
	const saveProfile = () => {
		// 基础验证
		if (!formData.value.name) {
			uni.showToast({ title: '请填写宠物名字', icon: 'none' })
			return
		}
		if (!formData.value.breed) {
			uni.showToast({ title: '请填写品种', icon: 'none' })
			return
		}
		// 更新 pets 列表中的对应项
		const index = pets.value.findIndex(p => p.id === currentPetId.value)
		if (index !== -1) {
			pets.value[index] = { ...formData.value }
			saveToStorage()
			uni.showToast({ title: '保存成功', icon: 'success' })
			// 延迟返回首页
			setTimeout(() => {
				uni.switchTab({ url: '/pages/home' })
			}, 1200)
		} else {
			uni.showToast({ title: '保存失败', icon: 'error' })
		}
	}

	onShow(() => {
		loadData()
	})
</script>

<style scoped>
	.profile-page {
		background: #FDFBF7;
		min-height: 100vh;
		padding: 20rpx 30rpx 60rpx;
	}

	/* 宠物切换栏 */
	.pet-tabs {
		background: white;
		border-radius: 60rpx;
		padding: 16rpx 0;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.02);
	}

	.tabs-scroll {
		white-space: nowrap;
		padding: 0 20rpx;
	}

	.tab-item {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		margin-right: 32rpx;
		width: 120rpx;
		position: relative;
	}

	.tab-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: #F2E4D6;
		border: 2px solid transparent;
	}

	.tab-item.active .tab-avatar {
		border-color: #F2B84E;
	}

	.tab-name {
		font-size: 24rpx;
		margin-top: 6rpx;
		color: #5A4230;
	}

	.tab-badge {
		position: absolute;
		top: -8rpx;
		right: -8rpx;
		background: #F2B84E;
		color: white;
		font-size: 18rpx;
		padding: 2rpx 10rpx;
		border-radius: 30rpx;
	}

	.add-tab {
		background: #F9F5EE;
		border-radius: 40rpx;
		padding: 12rpx 0;
		width: 100rpx;
	}

	.add-icon {
		font-size: 40rpx;
		color: #C27E3A;
	}

	/* 主卡片 */
	.card {
		background: white;
		border-radius: 48rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);
	}

	.avatar-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 32rpx;
	}

	.avatar {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		background: #F8E1C0;
		border: 4rpx solid #FFE9D4;
	}

	.change-avatar-btn {
		background: #F9F1E8;
		color: #C27E3A;
		border-radius: 60rpx;
		font-size: 26rpx;
		padding: 8rpx 30rpx;
		margin-top: 16rpx;
	}

	/* 表单 */
	.form-section {
		margin-top: 10rpx;
	}

	.form-row {
		display: flex;
		gap: 20rpx;
		margin-bottom: 24rpx;
	}

	.form-item {
		flex: 1;
		margin-bottom: 24rpx;
	}

	.half {
		flex: 1;
	}

	.label {
		display: block;
		font-size: 26rpx;
		font-weight: 500;
		color: #594C3C;
		margin-bottom: 12rpx;
	}

	.input,
	.select-box,
	.textarea {
		width: 100%;
		background: #FEFAF5;
		border: 1px solid #F0E2D2;
		border-radius: 32rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #2C2418;
	}

	.select-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.arrow {
		color: #BAA78F;
	}

	.gender-group {
		display: flex;
		gap: 16rpx;
	}

	.gender-option {
		flex: 1;
		background: #FEFAF5;
		border: 1px solid #F0E2D2;
		border-radius: 32rpx;
		text-align: center;
		padding: 16rpx 0;
		font-size: 28rpx;
	}

	.gender-option.active {
		background: #FFF2E6;
		border-color: #F2B84E;
		color: #B95F1A;
	}

	.tag-group {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}

	.tag {
		background: #F9F5EE;
		padding: 12rpx 24rpx;
		border-radius: 60rpx;
		font-size: 26rpx;
		color: #5A4230;
	}

	.tag.active {
		background: #F2B84E;
		color: white;
	}

	.textarea {
		min-height: 120rpx;
	}

	.save-btn {
		background: #F2B84E;
		color: white;
		border-radius: 80rpx;
		margin-top: 30rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

	.delete-btn {
		background: transparent;
		border: 1px solid #F0DCC4;
		color: #C27E3A;
		border-radius: 80rpx;
		margin-top: 24rpx;
	}
</style>
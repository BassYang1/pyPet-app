<template>
	<view class="home-page">
		<!-- 顶部宠物切换栏（简洁） -->
		<view class="pet-bar" @click="showPetSelector">
			<image class="pet-avatar" :src="currentPet.avatar || '/static/default-avatar.png'" mode="aspectFill">
			</image>
			<view class="pet-info">
				<text class="pet-name">{{ currentPet.name }}</text>
				<text class="pet-breed">{{ currentPet.breed }} · {{ currentPet.age }}</text>
			</view>
			<view class="switch-icon">▾</view>
		</view>

		<!-- 社区互动氛围条 -->
		<view class="community-strip">
			<view class="strip-left">
				<text class="hot-icon">🔥</text>
				<text class="strip-text">今日 {{ activeUsers }} 位宠友正在分享训练日常</text>
			</view>
			<view class="strip-number">热聊中 ></view>
		</view>

		<!-- 热门话题标签 -->
		<scroll-view scroll-x class="hot-topics" :show-scrollbar="false">
			<view class="topic-chip" :class="{ active: currentTopic === 'recommend' }"
				@click="switchTopic('recommend')">🔥 推荐</view>
			<view class="topic-chip" :class="{ active: currentTopic === 'dog' }" @click="switchTopic('dog')">🐕 狗狗指令
			</view>
			<view class="topic-chip" :class="{ active: currentTopic === 'cat' }" @click="switchTopic('cat')">🐈 猫咪行为
			</view>
			<view class="topic-chip" :class="{ active: currentTopic === 'challenge' }"
				@click="switchTopic('challenge')">🎯 21天打卡</view>
			<view class="topic-chip" :class="{ active: currentTopic === 'rank' }" @click="switchTopic('rank')">🏆 进步达人榜
			</view>
		</scroll-view>

		<!-- 动态信息流 Feed -->
		<scroll-view scroll-y class="feed-list" :style="{ height: feedHeight }">
			<view class="post-card" v-for="post in feedPosts" :key="post.id">
				<view class="post-header">
					<image class="user-avatar" :src="post.userAvatar || '/static/default-avatar.png'" mode="aspectFill">
					</image>
					<view class="user-info">
						<text class="user-name">{{ post.userName }}</text>
						<view class="pet-tag">
							<text class="pet-icon">🐾</text>
							<text>{{ post.petName }} · {{ post.petType }}</text>
						</view>
					</view>
					<text class="post-time">{{ post.timeAgo }}</text>
				</view>

				<view class="post-content">
					<text class="post-text">{{ post.content }}</text>
					<view class="training-tag" v-if="post.tag">
						<text>🏷️ {{ post.tag }}</text>
					</view>
					<!-- 训练进度条（如有） -->
					<view class="progress-block" v-if="post.progress">
						<text class="progress-label">{{ post.progress.label }}</text>
						<view class="progress-bar-bg">
							<view class="progress-fill" :style="{ width: post.progress.value + '%' }"></view>
						</view>
						<text class="progress-value">{{ post.progress.value }}%</text>
					</view>
					<!-- 图片/视频占位 -->
					<view class="media-placeholder" v-if="post.media">
						<text>{{ post.media }}</text>
					</view>
				</view>

				<view class="interaction-bar">
					<view class="interaction-item" @click="likePost(post.id)">
						<text class="like-icon">{{ post.isLiked ? '❤️' : '🤍' }}</text>
						<text>{{ post.likes }}</text>
					</view>
					<view class="interaction-item" @click="commentPost(post.id)">
						<text>💬</text>
						<text>{{ post.comments }}</text>
					</view>
					<view class="interaction-item" @click="sharePost(post.id)">
						<text>↗️</text>
						<text>分享</text>
					</view>
				</view>
			</view>

			<!-- 加载更多提示 -->
			<view class="load-more" v-if="hasMore">下拉加载更多...</view>
		</scroll-view>

		<!-- 快捷功能入口（悬浮或底部固定，根据设计放在feed下方） -->
		<view class="quick-actions">
			<view class="action-btn" @click="goToAi">
				<text class="action-icon">📷</text>
				<text>AI识别</text>
			</view>
			<view class="action-btn" @click="goToPlan">
				<text class="action-icon">📋</text>
				<text>训练计划</text>
			</view>
			<view class="action-btn" @click="showVip">
				<text class="action-icon">💎</text>
				<text>增值服务</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'

	definePage({
		type: "home",
		style: {
			navigationBarTitleText: '宠习院',
			navigationStyle: 'custom',
		}
	})

	// ---------- 宠物相关 ----------
	const pets = ref<any[]>([])
	const currentPetId = ref<number>(1)
	const currentPet = computed(() => pets.value.find(p => p.id === currentPetId.value) || { name: '团团', breed: '柴犬', age: '1岁半' })

	const loadPets = () => {
		const stored = uni.getStorageSync('pets')
		if (stored && stored.length) {
			pets.value = stored
			const id = uni.getStorageSync('currentPetId')
			if (id) currentPetId.value = id
		} else {
			// 默认演示宠物
			pets.value = [
				{ id: 1, name: '团团', breed: '柴犬', age: '1岁半', avatar: '' },
				{ id: 2, name: '年糕', breed: '柯基', age: '2岁', avatar: '' }
			]
			savePets()
		}
	}
	const savePets = () => {
		uni.setStorageSync('pets', pets.value)
		uni.setStorageSync('currentPetId', currentPetId.value)
	}
	const showPetSelector = () => {
		const list = pets.value.map(p => `${p.name} · ${p.breed}`)
		uni.showActionSheet({
			itemList: list,
			success: (res) => {
				const selected = pets.value[res.tapIndex]
				if (selected) {
					currentPetId.value = selected.id
					savePets()
					uni.showToast({ title: '已切换', icon: 'success' })
				}
			}
		})
	}

	// ---------- 社区动态数据 ----------
	const activeUsers = ref(2183)
	const currentTopic = ref('recommend')
	const hasMore = ref(true)
	const feedHeight = ref('calc(100vh - 520rpx)') // 动态计算，后续自适应

	interface FeedPost {
		id : number
		userName : string
		userAvatar : string
		petName : string
		petType : string
		timeAgo : string
		content : string
		tag ?: string
		progress ?: { label : string, value : number }
		media ?: string
		likes : number
		comments : number
		isLiked : boolean
	}

	const feedPosts = ref<FeedPost[]>([
		{
			id: 1,
			userName: '柯基麻麻_小鱼',
			userAvatar: '',
			petName: '年糕',
			petType: '柯基 · 1岁半',
			timeAgo: '25分钟前',
			content: '🎉 年糕终于学会“趴下”啦！配合AI推荐的口令节奏，三天见效～之前完全不理我，用了智能训练计划里的正向强化法，现在成功率92%！太开心啦🥳',
			tag: '#训练打卡',
			progress: { label: '指令“趴下”完成度', value: 92 },
			media: '📸 年糕训练萌照 + 视频',
			likes: 342,
			comments: 48,
			isLiked: false
		},
		{
			id: 2,
			userName: '布偶控_小一',
			userAvatar: '',
			petName: '团子',
			petType: '布偶猫 · 2岁',
			timeAgo: '1小时前',
			content: '用了「抓板引导+气味训练」7天，团子已经完全不抓沙发了！AI行为预警真的神❗️现在抓板使用率提升76%，感谢社区大神分享经验~',
			tag: '#行为纠正',
			progress: { label: '破坏行为下降', value: 96 },
			media: '🎬 抓板前后对比视频 · 团子超乖',
			likes: 587,
			comments: 102,
			isLiked: false
		},
		{
			id: 3,
			userName: '边牧教练_阿飞',
			userAvatar: '',
			petName: '闪电',
			petType: '边境牧羊犬 · 3岁',
			timeAgo: '3小时前',
			content: '闪电的敏捷赛绕杆成绩进入全国前10%！全靠AI训练模型精准分析步态偏差🥇每天配合智能项圈数据调整训练量，进步可视化，一起加油~',
			tag: '#高阶训练',
			progress: { label: '敏捷赛训练完成度', value: 89 },
			media: '🎥 闪电绕杆精彩瞬间',
			likes: 1023,
			comments: 156,
			isLiked: false
		},
		{
			id: 4,
			userName: '奶茶和小丸子',
			userAvatar: '',
			petName: '奶茶',
			petType: '橘猫+贵宾',
			timeAgo: '5小时前',
			content: '折磨我三个月的乱尿问题，用AI个性方案+正确奖励，一周解决😭 现在每天自动生成训练进度报告，狗子也自信多了！',
			tag: '#定点排便',
			progress: { label: '定点成功率', value: 98 },
			media: '📷 干净阳台照片+训练时间表',
			likes: 921,
			comments: 203,
			isLiked: false
		},
		{
			id: 5,
			userName: '它它宠物乐园',
			userAvatar: '',
			petName: '官方机构',
			petType: '训练基地',
			timeAgo: '昨日',
			content: '引入AI行为分析系统后，学员狗狗行为纠正效率提升45%！公开课限时免费～欢迎来园区体验智能训练计划，提供定制化方案。',
			tag: '#机构入驻',
			media: '📅 本周六线下体验活动 · 前10位赠AI项圈试用',
			likes: 435,
			comments: 78,
			isLiked: false
		}
	])

	// 切换话题（简单过滤，实际可请求不同数据）
	const switchTopic = (topic : string) => {
		currentTopic.value = topic
		uni.showToast({ title: `切换到${topic}`, icon: 'none' })
		// 可重新加载数据，这里演示不变
	}

	const likePost = (id : number) => {
		const post = feedPosts.value.find(p => p.id === id)
		if (post) {
			post.isLiked = !post.isLiked
			post.likes += post.isLiked ? 1 : -1
			uni.showToast({ title: post.isLiked ? '已点赞' : '取消点赞', icon: 'none' })
		}
	}
	const commentPost = (id : number) => {
		uni.showToast({ title: '评论功能开发中', icon: 'none' })
	}
	const sharePost = (id : number) => {
		uni.showToast({ title: '分享链接已复制', icon: 'success' })
	}

	// ---------- 页面跳转 ----------
	const goToAi = () => uni.switchTab({ url: '/pages/ai/recognize' })
	const goToPlan = () => uni.switchTab({ url: '/pages/train/plan' })
	const showVip = () => uni.showToast({ title: '增值服务开发中', icon: 'none' })

	// 动态计算feed高度（简单计算）
	const calcFeedHeight = () => {
		const systemInfo = uni.getSystemInfoSync()
		const windowHeight = systemInfo.windowHeight
		// 减去顶部pet-bar(约140rpx)、氛围条(100rpx)、话题栏(100rpx)、快捷入口(120rpx) 转换为px
		const rpxToPx = systemInfo.windowWidth / 750
		const otherHeight = (140 + 100 + 100 + 120) * rpxToPx
		feedHeight.value = (windowHeight - otherHeight - 20) + 'px'
	}

	onMounted(() => {
		calcFeedHeight()
	})
	onShow(() => {
		loadPets()
	})
	loadPets()
</script>

<style scoped>
	.home-page {
		background: #FDFBF7;
		min-height: 100vh;
		padding: 20rpx 30rpx 0;
	}

	/* 顶部宠物栏 */
	.pet-bar {
		display: flex;
		align-items: center;
		gap: 20rpx;
		background: white;
		padding: 16rpx 24rpx;
		border-radius: 60rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.02);
	}

	.pet-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: #F2E4D6;
	}

	.pet-info {
		flex: 1;
	}

	.pet-name {
		font-weight: 700;
		font-size: 32rpx;
		display: block;
	}

	.pet-breed {
		font-size: 24rpx;
		color: #8E7A67;
	}

	.switch-icon {
		font-size: 32rpx;
		color: #BAA78F;
		padding: 10rpx;
	}

	/* 氛围条 */
	.community-strip {
		background: #FFF6ED;
		border-radius: 60rpx;
		padding: 16rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		border: 1px solid #FFE9D4;
	}

	.strip-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.hot-icon {
		font-size: 32rpx;
	}

	.strip-text {
		font-size: 26rpx;
		color: #7C5E3E;
	}

	.strip-number {
		background: white;
		padding: 6rpx 20rpx;
		border-radius: 40rpx;
		font-size: 24rpx;
		color: #D68B3A;
	}

	/* 热门话题横向滚动 */
	.hot-topics {
		white-space: nowrap;
		margin-bottom: 24rpx;
	}

	.topic-chip {
		display: inline-block;
		background: white;
		border: 1px solid #F0E2D2;
		border-radius: 60rpx;
		padding: 12rpx 32rpx;
		font-size: 26rpx;
		margin-right: 20rpx;
		color: #5A4230;
	}

	.topic-chip.active {
		background: #FEF3E4;
		border-color: #F2B84E;
		color: #B95F1A;
	}

	/* 动态列表 */
	.feed-list {
		padding-bottom: 20rpx;
	}

	.post-card {
		background: white;
		border-radius: 40rpx;
		padding: 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
	}

	.post-header {
		display: flex;
		align-items: center;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: #F8E1C0;
	}

	.user-info {
		flex: 1;
	}

	.user-name {
		font-weight: 700;
		font-size: 30rpx;
		display: block;
	}

	.pet-tag {
		font-size: 22rpx;
		color: #B9783A;
		background: #F9F1E8;
		display: inline-flex;
		align-items: center;
		gap: 6rpx;
		padding: 4rpx 16rpx;
		border-radius: 30rpx;
		margin-top: 6rpx;
	}

	.post-time {
		font-size: 22rpx;
		color: #A3927E;
	}

	.post-content {
		margin-bottom: 20rpx;
	}

	.post-text {
		font-size: 28rpx;
		line-height: 1.45;
		color: #2C2418;
		display: block;
		margin-bottom: 12rpx;
	}

	.training-tag {
		background: #F2EBE2;
		border-radius: 30rpx;
		padding: 6rpx 20rpx;
		display: inline-block;
		font-size: 22rpx;
		color: #C27E3A;
		margin-bottom: 12rpx;
	}

	.progress-block {
		background: #FEFAF5;
		border-radius: 30rpx;
		padding: 16rpx 20rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin: 12rpx 0;
	}

	.progress-label {
		font-size: 24rpx;
		font-weight: 500;
		color: #594C3C;
		flex-shrink: 0;
	}

	.progress-bar-bg {
		flex: 1;
		height: 10rpx;
		background: #EADDCB;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #F2B84E;
		border-radius: 20rpx;
	}

	.progress-value {
		font-size: 24rpx;
		font-weight: 600;
		color: #C57F2F;
	}

	.media-placeholder {
		background: #F5EFE6;
		border-radius: 30rpx;
		padding: 20rpx;
		text-align: center;
		color: #A2815E;
		font-size: 24rpx;
		margin-top: 12rpx;
	}

	.interaction-bar {
		display: flex;
		gap: 40rpx;
		padding-top: 16rpx;
		border-top: 1px solid #F7EFE6;
	}

	.interaction-item {
		display: flex;
		align-items: center;
		gap: 8rpx;
		font-size: 26rpx;
		color: #9D8975;
	}

	.like-icon {
		font-size: 30rpx;
	}

	.load-more {
		text-align: center;
		padding: 20rpx;
		color: #BAA78F;
		font-size: 24rpx;
	}

	/* 快捷入口 */
	.quick-actions {
		display: flex;
		justify-content: space-around;
		background: white;
		border-radius: 80rpx;
		padding: 16rpx 20rpx;
		margin: 20rpx 0 40rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
	}

	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6rpx;
		font-size: 24rpx;
		color: #5A4230;
	}

	.action-icon {
		font-size: 40rpx;
	}
</style>
<template>
  <view class="home">
    <text class="title">uni-app 全端适配架构</text>
    <button @click="testToast">测试全端API</button>
  </view>
</template>

<script setup lang="ts">
const testToast = () => {
  // uni API 全端统一调用
  uni.showToast({ title: '运行正常', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.home {
  padding: 50rpx;
  text-align: center;
}
.title {
  font-size: 30rpx;
  color: #409eff;
  margin-bottom: 40rpx;
}
</style>
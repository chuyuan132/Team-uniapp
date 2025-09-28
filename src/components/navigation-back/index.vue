<template>
  <view class="navigation-back-wrap">
    <van-icon @click="goBack" name="arrow-left" :size="20" />
  </view>
</template>

<script setup lang="ts">
function goBack() {
  uni.navigateBack();
}
</script>

<style lang="less" scoped>
.navigation-back-wrap {
  padding-bottom: 60rpx;
}
</style>

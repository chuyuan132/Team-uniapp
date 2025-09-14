<template>
  <view class="home-page">
    <view class="btn-wrap">
      <view class="btn dark-btn">Login</view>
      <view class="btn light-btn">Register</view>
    </view>
  </view>
</template>

<script setup lang="ts">

</script>


<style scoped lang="less">
.home-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  background: url('/static/images/bg.png') 0 0/cover;
}
.btn-wrap {
  padding: 0 10% 20%;
}
.btn {
  padding: 30rpx;
  text-align: center;
  line-height: 40rpx;
  border-radius: 45rpx;
  margin-bottom: 20rpx;
}
.dark-btn {
  background-color: #000;
  color: #fff;
}
.light-btn {
  background-color: transparent;
  color: #000;
}
</style>

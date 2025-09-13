<template>
  <view class="loading-btn" :style="cssStyle"></view>
</template>

<script setup lang="ts">
const props = defineProps({
  bgColor: {
    type: String,
    default: "#409eff",
  },
});

const cssStyle = {
  "--bg-color": props.bgColor,
};
</script>

<style lang="less">
.loading-btn {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    animation: rotateAnim 0.5s linear infinite;
    border-radius: 20rpx;
  }
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 20rpx;
    top: 110rpx;
    opacity: 0.3;
    animation: shadowAnim 0.5s linear infinite;
    background-color: #000;
    border-radius: 50%;
  }
}

@keyframes rotateAnim {
  17% {
    border-bottom-right-radius: 6rpx;
  }
  25% {
    transform: translateY(18rpx) rotate(22.5deg);
  }
  50% {
    transform: translateY(36rpx) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 80rpx;
  }
  75% {
    transform: translateY(18rpx) rotate(67.5deg);
  }
  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes shadowAnim {
  0%,
  100% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.2, 1);
  }
}
</style>

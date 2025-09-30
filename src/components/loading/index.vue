<template>
  <view class="loading-btn">
    <view class="inner" :style="cssStyle"></view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  bgColor: {
    type: String,
    default: "#409eff",
  },
  size: {
    type: String,
    default: "small",
  },
});

const sizeMap: any = {
  small: 50,
  large: 100,
};

const cssStyle = {
  "--bg-color": props.bgColor,
  "--icon-size": sizeMap[props.size] + "rpx",
  "--icon-bottom": sizeMap[props.size] + 10 + "rpx",
  "--icon-right-radius": 0.6 * sizeMap[props.size] + 10 + "rpx",
};
</script>

<style lang="less" scoped>
.loading-btn {
  padding: 40rpx;
}
.inner {
  position: relative;
  width: var(--icon-size);
  height: var(--icon-size);
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    animation: rotateAnim 0.5s linear infinite;
    border-radius: 6rpx;
  }
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 20rpx;
    top: var(--icon-bottom);
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
    transform: translateY(32rpx) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: var(--icon-right-radius);
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

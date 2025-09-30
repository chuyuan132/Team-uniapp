<template>
  <view class="user-info-card-item">
    <view class="avatar-wrap">
      <van-image class="image" :src="item.avatar" />
    </view>
    <view class="info-wrap">
      <view class="name">{{ item.username || '' }}</view>
      <view class="profile">{{ item.profile || '' }}</view>
      <view class="tag-wrap">
        <van-tag
          class="tag"
          v-for="(tag, index) in item.tag_list"
          :key="index"
          type="primary"
          >{{ tag }}</van-tag
        >
      </view>
    </view>
    <view class="operation-wrap"> </view>
  </view>
</template>

<script lang="ts" setup>
import type { IGetUserListItem } from '@/typing';
import type { PropType } from 'vue';
defineProps({
  item: {
    type: Object as PropType<IGetUserListItem>,
    default: () => ({}),
  },
});
</script>

<style scoped lang="less">
.user-info-card-item {
  display: flex;
  justify-content: space-between;
  border-radius: 20rpx;
  background-color: #fff;
  padding: 20rpx;
  height: 100%;
}
.avatar-wrap {
  .image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
  }
}
.info-wrap {
  flex: 1;
  padding: 0 40rpx;
  .name {
    font-size: 36rpx;
  }
  .profile {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 24rpx;
    color: #ccc;
    margin: 10rpx 0;
  }
  .tag-wrap .tag {
    margin-right: 20rpx;

    &:last-child {
      margin-right: 0;
    }
  }
}
.operation-wrap {
  display: flex;
  flex-direction: column;
}
</style>

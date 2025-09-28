<template>
  <view class="virtual-container">
    <view class="empty-block" :style="{ height: listHeight + 'px' }"></view>
    <view class="virtual-list">
      <view class="virtual-item" v-for="(item, index) in value" :key="index">
        <slot name="default">
          {{ item }}
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  itemHeight: {
    type: Number,
    default: 20,
  },
  buffRate: {
    type: Number,
    default: 0.5,
  },
});

const listHeight = computed(() => {
  console.log(props.value.length * props.itemHeight);

  return props.value.length * props.itemHeight;
});

const containerHeight = ref(0);

const visibleCount = computed(() => {
  return Math.ceil(containerHeight.value / props.itemHeight);
});

onMounted(() => {
  uni
    .createSelectorQuery()
    .select(".virtual-container")
    .boundingClientRect()
    .exec((res) => {
      containerHeight.value = res.height;
    });
});
</script>

<style scoped lang="less">
.virtual-container {
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.virtual-list {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
}
</style>

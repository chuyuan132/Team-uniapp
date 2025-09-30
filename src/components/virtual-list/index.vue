<template>
  <scroll-view
    scroll-y="true"
    class="virtual-container"
    @scroll="handleScroll"
    :show-scrollbar="false"
  >
    <view class="empty-block" :style="{ height: totalHeight + 'px' }"></view>
    <view
      class="virtual-list"
      :style="{ transform: 'translateY(' + offsetY + 'px)' }"
    >
      <view
        class="virtual-item"
        v-for="item in renderList"
        :id="item._index"
        :key="item._index"
        :data-index="item._index"
      >
        <slot name="default" :item="item.origin">
          <view>{{ item.origin }}</view>
        </slot>
      </view>
    </view>
    <view v-show="loading">
      <slot name="loading">
        <view class="loading-wrap">
          <Loading />
        </view>
      </slot>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import Loading from '@/components/loading/index.vue';
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  // 预估高度对于不定高虚拟列表至关重要
  itemHeight: {
    type: Number,
    default: 80,
  },
  buffCount: {
    type: Number,
    default: 1,
  },
});

const emits = defineEmits(['loadMore']);

interface IPositionItem {
  height: number;
  top: number;
  bottom: number;
}

interface IVirtualItem {
  origin: any;
  _index: number;
}

const virtualList = ref<IVirtualItem[]>([]);
const positions = ref<IPositionItem[]>([]);
const screenHeight = ref(0);

const visibleCount = ref(0);
const startIndex = ref(0);
const endIndex = ref(0);
const offsetY = ref(0);

const totalHeight = computed(() => {
  return positions.value[positions.value.length - 1]?.bottom || 0;
});

const renderList = computed(() => {
  return (virtualList.value || []).slice(
    startIndex.value - aboveCount.value,
    endIndex.value + belowCount.value,
  );
});

const aboveCount = computed(() => {
  return Math.min(startIndex.value, visibleCount.value * props.buffCount);
});

const belowCount = computed(() => {
  return Math.min(
    (virtualList.value || []).length - endIndex.value,
    visibleCount.value * props.buffCount,
  );
});

// 计算所有项的预估位置信息
function setPositions(arr: any[]) {
  if (!arr || !arr.length || !Array.isArray(arr)) return;
  if (positions.value.length > 0) {
    let currentTop = 0;
    positions.value = arr.map((item, index) => {
      const existingPos = positions.value[index];
      const itemHeight = existingPos ? existingPos.height : props.itemHeight;
      const newItem = {
        height: itemHeight,
        top: currentTop,
        bottom: currentTop + itemHeight,
      };
      currentTop = newItem.bottom;
      return newItem;
    });
  } else {
    positions.value = arr.reduce((acc, item, index) => {
      const itemHeight = props.itemHeight;
      const newItem = {
        height: itemHeight,
        top: index * itemHeight,
        bottom: (index + 1) * itemHeight,
      };
      acc.push(newItem);
      return acc;
    }, []);
  }
}

function formatVirtualList(arr: any) {
  if (!arr || !arr.length || !Array.isArray(arr)) return;
  return arr.map((item, index) => {
    return {
      origin: item,
      _index: index,
    };
  });
}

// 二分法查找startIndex
function getStartIndex(scrollTop: number) {
  let left = 0;
  let right = positions.value.length - 1;
  let result = null;
  while (left <= right) {
    const middle = Math.floor(left + (right - left) / 2);
    const middleValue = positions.value[middle].bottom;
    if (middleValue === scrollTop) {
      return middle + 1;
    } else if (middleValue < scrollTop) {
      left = middle + 1;
    } else {
      if (result == null || result > middle) {
        result = middle;
      }
      right = middle - 1;
    }
  }
  return result;
}

function setOffet() {
  if (startIndex.value >= 1) {
    const size =
      positions.value[startIndex.value - 1].bottom -
      positions.value[startIndex.value - aboveCount.value].top;
    offsetY.value = positions.value[startIndex.value].top - size;
  } else {
    offsetY.value = 0;
  }
}

let isMeasuring = false;
const bottomThreshold = 50; // 触底阈值
const loading = ref(false);
function handleScroll(e: any) {
  const scrollTop = e.detail.scrollTop;
  const newStart = getStartIndex(scrollTop) as number;

  if (startIndex.value !== newStart) {
    startIndex.value = newStart;
    endIndex.value = startIndex.value + visibleCount.value;
    setOffet();
  }

  if (!isMeasuring) {
    isMeasuring = true;
    nextTick(() => {
      updatePositions();

      setTimeout(() => {
        isMeasuring = false;
      }, 100);
    });
  }
  if (
    totalHeight.value - (scrollTop + screenHeight.value) <= bottomThreshold &&
    !loading.value &&
    virtualList.value.length
  ) {
    loading.value = true;
    emits('loadMore', () => {
      loading.value = false;
    });
  }
}

function updatePositions() {
  uni
    .createSelectorQuery()
    .selectAll('.virtual-item')
    .boundingClientRect((res: any) => {
      if (!res || res.length === 0) return;

      let hasPositionChanged = false;

      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        const index = Number(item.id);

        if (!positions.value[index]) continue;

        const oldHeight = positions.value[index].height;
        const newHeight = item.height;

        const diff = newHeight - oldHeight;
        if (Math.abs(diff) > 1) {
          positions.value[index].height = newHeight;
          hasPositionChanged = true;
        }
      }

      if (hasPositionChanged) {
        let currentTop = 0;
        for (let j = 0; j < positions.value.length; j++) {
          const item = positions.value[j];
          item.top = currentTop;
          item.bottom = currentTop + item.height;
          currentTop = item.bottom;
        }
        setOffet();
      }
    })
    .exec();
}

watch(
  () => props.dataSource,
  (nVal) => {
    virtualList.value = formatVirtualList(nVal) as IVirtualItem[];
    setPositions(nVal);
  },
  {
    deep: true,
    immediate: true,
  },
);

onMounted(() => {
  uni
    .createSelectorQuery()
    .select('.virtual-container')
    .boundingClientRect((res: any) => {
      screenHeight.value = res.height;
      visibleCount.value = Math.ceil(screenHeight.value / props.itemHeight);
      endIndex.value = startIndex.value + visibleCount.value;
    })
    .exec();
});
</script>

<style scoped lang="less">
.virtual-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.virtual-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  will-change: transform;
}

.loading-wrap {
  display: flex;
  justify-content: center;
}
</style>

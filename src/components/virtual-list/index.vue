<!-- <template>
  <scroll-view scroll-y="true" class="virtual-container" @scroll="handleScroll">
    <view class="empty-block" :style="{ height: totalHeight + 'px' }"></view>
    <view class="virtual-list" :style="{ top: offsetY + 'px' }">
      <view
        class="virtual-item"
        v-for="item in renderList"
        :id="item._index"
        :key="item._index"
      >
        <slot name="default" :item="item.origin"> </slot>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
/**
 * 1、对外接收一个数据源
 * 2、初始化位置信息
 * 3、计算初始总体长度
 * 4、获取可视窗口高度
 * 5、计算当前窗口可容纳多少节点
 * 6、得出开始时索引和结束索引
 * 7、滑动事件，更新索引值，计算偏移值
 * 8、更新预估高度数组
 */
import { onMounted, ref, computed, watch, onUpdated, nextTick } from "vue";

const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  itemHeight: {
    type: Number,
    default: 80,
  },
});

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
  return virtualList.value.slice(startIndex.value, endIndex.value);
});

function setPositions(arr: any[]) {
  if (!arr || !arr.length || !Array.isArray(arr)) return;
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

function formatVirtualList(arr: any) {
  if (!arr || !arr.length || !Array.isArray(arr)) return;
  return arr.map((item, index) => {
    return {
      origin: item,
      _index: index,
    };
  });
}

function getDOMInfo(val: string) {
  return new Promise((resolve, reject) => {
    uni
      .createSelectorQuery()
      .select(val)
      .boundingClientRect((res) => {
        resolve(res);
      })
      .exec();
  });
}

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
  offsetY.value =
    startIndex.value >= 1 ? positions.value[startIndex.value].top : 0;
}

function handleScroll(e: any) {
  const scrollTop = e.detail.scrollTop;
  const newStart = getStartIndex(scrollTop) as number;
  if (startIndex.value !== newStart) {
    startIndex.value = newStart;
    endIndex.value = startIndex.value + visibleCount.value;
    setOffet();
    nextTick(() => {
      updatePositions();
    });
  }
}

function updatePositions() {
  uni
    .createSelectorQuery()
    .selectAll(".virtual-item")
    .boundingClientRect((res: any) => {
      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        const index = Number(item.id);
        const oldHeight = positions.value[index].height;
        const diff = oldHeight - item.height;
        if (Math.abs(diff) < 1) return;
        positions.value[index].height = item.height;
        positions.value[index].bottom -= diff;
        for (let j = index + 1; j < positions.value.length; j++) {
          positions.value[j].top = positions.value[j].bottom;
          positions.value[j].bottom -= diff;
        }
      }
      setOffet();
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
  }
);

onMounted(() => {
  getDOMInfo(".virtual-container").then((res: any) => {
    screenHeight.value = res.height;
    visibleCount.value = Math.ceil(screenHeight.value / props.itemHeight);
    endIndex.value = startIndex.value + visibleCount.value;
  });
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
}
</style> -->

<template>
  <scroll-view scroll-y="true" class="virtual-container" @scroll="handleScroll">
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
        <slot name="default" :item="item.origin"> </slot>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from "vue";

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
  bufferScale: {
    type: Number,
    default: 0.5,
  },
});

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
let isMeasuring = false;
const totalHeight = computed(() => {
  return positions.value[positions.value.length - 1]?.bottom || 0;
});

const belowCount = computed(() => {
  return Math.min(
    virtualList.value.length - endIndex.value,
    Math.floor(props.bufferScale * visibleCount.value)
  );
});

const aboveCount = computed(() => {
  return Math.min(
    startIndex.value,
    Math.floor(props.bufferScale * visibleCount.value)
  );
});

const renderList = computed(() => {
  return virtualList.value.slice(aboveCount.value, belowCount.value);
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
    // 首次初始化
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

function getDOMInfo(val: string) {
  return new Promise((resolve) => {
    uni
      .createSelectorQuery()
      .select(val)
      .boundingClientRect((res) => {
        resolve(res);
      })
      .exec();
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
}

function updatePositions() {
  uni
    .createSelectorQuery()
    .selectAll(".virtual-item")
    .boundingClientRect((res: any) => {
      if (!res || res.length === 0) return;
      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        const index = Number(item.id);
        if (!positions.value[index]) continue;
        const oldHeight = positions.value[index].height;
        const newHeight = item.height;
        const diff = newHeight - oldHeight;
        if (Math.abs(diff) > 1) {
          positions.value[index].height = item.height;
          positions.value[index].bottom -= diff;
          for (let j = index + 1; j < positions.value.length; j++) {
            positions.value[j].top = positions.value[j].bottom;
            positions.value[j].bottom -= diff;
          }
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
  }
);

onMounted(() => {
  getDOMInfo(".virtual-container").then((res: any) => {
    screenHeight.value = res.height;
    visibleCount.value = Math.ceil(screenHeight.value / props.itemHeight);
    endIndex.value = startIndex.value + visibleCount.value;
  });
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
</style>

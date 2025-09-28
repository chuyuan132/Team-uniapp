<template>
  <view class="virtual-container">
    <view class="empty-block" :style="{height: totalHeight + 'rpx'}"></view>
    <view class="virtual-list">
      <view class="virtual-item">
        <slot name="default">

        </slot>
      </view>
    </view>
  </view>
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
import {onMounted, ref} from "vue";
import {computed, watch} from "@vue/runtime-core";


const props = defineProps({
  dataSource: {
    type: Array,
    default:() => []
  },
  itemHeight: {
    type: Number,
    default: 80
  }
})

interface IPositionItem {
  height: number;
  top: number;
  bottom: number;
}


const positions = ref<IPositionItem[]>([]);
const screenHeight = ref(0);

const totalHeight = computed(() => {
  return positions.value[positions.value.length - 1].bottom;
})


function setPositions(arr: any[]) {
  if(!arr || !arr.length || !Array.isArray(arr)) return;
  positions.value = arr.reduce((acc, item, index) => {
    const itemHeight = props.itemHeight;
    const newItem = {
      height: itemHeight,
      top: index * itemHeight,
      bottom: (index + 1) * itemHeight
    }
    acc.push(newItem);
    return acc;
  }, [])
}

function getDOMInfo(val: string) {
  return new Promise((resolve, reject) => {
    uni.createSelectorQuery().select(val).boundingClientRect().exec(res => {
      resolve(res)
    })
  })
}



watch(() => props.dataSource, (nVal) => {
  setPositions(nVal)
})

onMounted(() => {
  getDOMInfo(".virtual-container").then(res => {
    console.log(res)
  })
})


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

</style>

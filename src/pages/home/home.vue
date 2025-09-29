<template>
  <view class="common-page">
<!--    <view class="header-wrap">-->
<!--      <text>快来寻找志同道合的伙伴吧</text>-->
<!--      <van-icon :size="30" name="search" />-->
<!--    </view>-->
    <view class="content-wrap">
      <VirtualList :dataSource="list" @load-more="loadMore">
        <template #default="{item}">
          <view class="item">
            <view>{{item.label}} - {{item.value}}</view>
          </view>
        </template>
      </VirtualList>
    </view>
  </view>
</template>

<script lang="ts" setup>
import VirtualList from "@/components/virtual-list/index.vue";
import faker from 'faker'
import {getUserList} from "@/api";
import {onMounted, ref} from "vue";

const list = ref<any[]>([]);

async function getList() {
  const { data } = await getUserList({
    page_no: 2,
    page_size: 10,
  });
}

function mockData() {
  for(let i=0; i<10; i++) {
    list.value.push({
      label: i + 1,
      value:faker.lorem.sentences()
    })
  }
}


function loadMore(done:() => void) {
  const addList:any[] = [];
  const length = list.value.length;
  setTimeout(() => {
    for(let i=0; i<10; i++) {
      addList.push({
        label: length + i,
        value:faker.lorem.sentences()
      })
    }
    list.value.push(...addList);
    done()
  }, 2000)

}

onMounted(() => {
  mockData()
});
</script>

<style lang="less" scoped>
.content-wrap {
  height: 100%;
}
.item {
  padding: 20rpx 0;
  border-bottom: 1px solid #eee;
}
</style>

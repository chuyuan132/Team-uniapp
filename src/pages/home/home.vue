<template>
  <view class="common-page">
<!--    <view class="header-wrap">-->
<!--      <text>快来寻找志同道合的伙伴吧</text>-->
<!--      <van-icon :size="30" name="search" />-->
<!--    </view>-->
    <view class="content-wrap">
      <VirtualList v-model:value="list" />
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
  console.log(data);
}

function mockData() {
  for(let i=0; i<1000; i++) {
    list.value.push(faker.lorem.sentences())
  }
}

onMounted(() => {
  mockData()
});
</script>

<style lang="scss" scoped></style>

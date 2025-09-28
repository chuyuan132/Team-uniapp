<template>
  <view class="common-page">
    <view class="header-wrap">
      <text>快来寻找志同道合的伙伴吧</text>
      <van-icon :size="30" name="search" />
    </view>
    <view class="content-wrap">
      <VirtualList v-model:value="list" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import VirtualList from "@/components/virtual-list/index.vue";
import { getUserList } from "@/api";
import { onMounted, ref } from "vue";

const list = ref<any[]>([]);

async function getList() {
  const { data } = await getUserList({
    page_no: 2,
    page_size: 10,
  });
  console.log(data);
}

onMounted(() => {
  // getList();

  for (let i = 0; i < 1000; i++) {
    list.value.push(i + 1);
  }
});
</script>

<style lang="scss" scoped></style>

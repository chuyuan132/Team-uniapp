<template>
  <view class="common-page">
    <view class="content-wrap">
      <VirtualList :dataSource="list" @load-more="loadMore">
        <template #default="{ item }">
          <view class="item">
            <UserInfoCard :item="item" />
          </view>
        </template>
      </VirtualList>
    </view>
  </view>
</template>

<script lang="ts" setup>
import VirtualList from '@/components/virtual-list/index.vue';
import UserInfoCard from './components/user-info-card.vue';
import { getUserList } from '@/api';
import { onMounted, ref } from 'vue';

const list = ref<any[]>([]);
const queryParams = {
  page_no: 2,
  page_size: 10,
};
async function getListByPage() {
  const { data } = await getUserList(queryParams);
  return data.records || [];
}

function loadMore(done: () => void) {
  queryParams.page_no++;
  getListByPage().then((res) => {
    list.value.push(...res);
    done();
  });
}

onMounted(() => {
  getListByPage().then((res) => {
    list.value = res;
  });
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

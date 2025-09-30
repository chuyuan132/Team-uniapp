<template>
  <view class="common-page curr-page">
    <view class="content-wrap">
      <view class="top">
        <view class="title">哈喽！注册开始使用吧</view>
        <view class="form-wrap">
          <van-cell-group>
            <van-field
              v-model="formState.phone"
              :clearable="true"
              class="form-item"
              placeholder="输入手机号码"
              size="large"
            >
            </van-field>
            <van-field
              v-model="formState.password"
              :clearable="true"
              class="form-item"
              placeholder="输入密码"
              size="large"
            />
            <van-field
              v-model="formState.username"
              :clearable="true"
              class="form-item"
              placeholder="输入用户名"
              size="large"
            />
          </van-cell-group>
        </view>

        <van-button
          :loading="loading"
          class="btn"
          color="#000"
          @click="handleRegister"
          >注册</van-button
        >
      </view>
      <view class="bottom">
        已有账号?
        <text class="spec-text" @click="toLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { closeToast, showToast } from 'vant';
import { userRegister } from '@/api';

const loading = ref(false);
const formState = ref({
  phone: '',
  password: '',
  username: '',
});

/**
 * 去登录
 */
function toLogin() {
  closeToast();
  uni.redirectTo({
    url: '/pages/login/login',
  });
}

/**
 * 用户注册
 */
async function handleRegister() {
  const { phone, password, username } = formState.value;
  if (!phone || !password || !username) {
    showToast('请填写完整信息');
    return;
  }
  if (!/^1[3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
    showToast('手机号码格式错误');
    return;
  }
  if (password.trim().length < 8) {
    showToast('密码不能小于八位');
    return;
  }
  try {
    loading.value = true;
    await userRegister({
      phone,
      password,
      username,
    });
    showToast('注册成功');
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/login/login',
      });
    }, 1000);
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="less" scoped>
.curr-page {
  background-color: #fff;
}
.content-wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 100rpx 0 0;
  justify-content: space-between;
  height: 100%;
}
.title {
  font-size: 48rpx;
  line-height: 70rpx;
  margin-bottom: 80rpx;
  font-weight: bold;
}

.form-wrap {
  .form-item {
    margin-bottom: 50rpx;
    background-color: #f7f8f9;
    border-radius: 10rpx;
  }
}

.btn {
  width: 100%;
  border-radius: 40rpx;
  margin-top: 40rpx;
}
.bottom {
  text-align: center;
  padding: 40rpx 0;

  .spec-text {
    font-weight: bold;
  }
}

:deep(.van-field__control) {
  font-size: 30rpx;
}
</style>

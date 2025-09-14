<template>
  <view class="common-page">
    <navigation-back/>
    <view class="content-wrap">
      <view class="top">
        <view class="title">欢迎回来！很高兴再见到你</view>
        <view class="form-wrap">
          <van-cell-group>
            <van-field v-model="formState.phone" :clearable="true" class="form-item" placeholder="输入手机号码"
                       size="large">
            </van-field>
            <van-field v-model="formState.password" :clearable="true" class="form-item" placeholder="输入密码"
                       size="large"/>
          </van-cell-group>

        </view>
        <view class="assist-wrap" @click="findPassword">
          忘记密码？
        </view>
        <view class="btn-wrap">
          <van-button :loading="loading" class="btn" color="#000" @click="handleLogin">登录</van-button>
        </view>
      </view>
      <view class="bottom">
        没有账号?
        <text class="spec-text">现在注册</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import NavigationBack from "@/components/navigation-back/index.vue";
import {showNotify} from 'vant';
import {userLogin} from "@/api";

const loading = ref(false);
const formState = ref({
  phone: '',
  password: ''
})

/**
 * 用户登录
 */
async function handleLogin() {
  const {phone, password} = formState.value;
  if (!phone || !password) {
    showNotify({
      type: 'warning',
      message: '请完整输入手机号或密码',
    })
    return;
  }
  if (!/^1[3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
    showNotify({
      type: 'warning',
      message: '手机号码格式错误'
    })
    return;
  }
  if (password.trim().length < 8) {
    showNotify({
      type: 'warning',
      message: '密码不能小于八位'
    })
    return;
  }
  try {
    loading.value = true;
    await userLogin({
      phone,
      password
    })
    showNotify({type: 'success', message: '登录成功'});
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/home/home'
      })
    }, 1000)
  } finally {
    loading.value = false;
  }
}

/**
 * 找回密码
 */
function findPassword() {
  showNotify({type: 'primary', message: '该功能暂未开放'});
}
</script>

<style lang="less" scoped>
.content-wrap {
  display: flex;
  height: calc(100% - 80rpx);
  flex-direction: column;
  justify-content: space-between;

  .top {
    .title {
      font-size: 48rpx;
      line-height: 70rpx;
      margin-bottom: 80rpx;
      font-weight: bold;
    }

    .form-wrap {
      .form-item {
        margin-bottom: 50rpx;
        background-color: #F7F8F9;
        border-radius: 10rpx;
      }
    }

    .assist-wrap {
      text-align: right;
      color: #6A707C;
      margin-bottom: 80rpx;
    }
  }

  .bottom {
    text-align: center;
    padding: 40rpx 0;

    .spec-text {
      font-weight: bold;
    }
  }
}

.btn {
  width: 100%;
  border-radius: 40rpx;
  margin: 0;
}

:deep(.van-field__control) {
  font-size: 30rpx;
}
</style>
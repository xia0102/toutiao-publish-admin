<!-- login -->
<template>
  <div class="login-container">
    <!-- <div class="login-head"></div> -->
    <el-form class="login-form"
             ref="form"
             :model="user">
      <el-form-item>
        <el-input v-model="user.mobile"
                  placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.code"
                  placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn"
                   type="primary"
                   :loading="loginLoading"
                   @click="onLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      checked: false, // 是否同意协议的选中状态
      loginLoading: false // 登录的 loading 状态（防止网络请求慢出现用户多次点击触发登录请求）
    }
  },

  components: {},

  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      const user = this.user

      // 表单验证

      // 验证通过，提交登录
      // 开启登录中
      this.loginLoading = true
      request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        // data 用来设置 POST 请求体
        data: user
      }).then(res => {
        // 处理后端响应结果   成功：xxx
        console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭 loading
        this.loginLoading = false
      }).catch(err => {
        // 处理后端响应结果   失败：xxx
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误')
        // 关闭 loading
        this.loginLoading = false
      })
    }
  }
}

</script>
<style scoped lang="less">
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  // .login-head {
  //   width: 300px;
  //   height: 57px;
  //   background: url("./logo_index.png") no-repeat;
  //   margin-bottom: 30px;
  // }
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>

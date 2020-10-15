<!-- login 登录 -->
<template>
  <div class="login-container">
    <!-- <div class="login-head"></div> -->
    <el-form class="login-form"
             ref="login-form"
             :model="user"
             :rules="formRules">
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile"
                  placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code"
                  placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
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
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议
      },
      loginLoading: false, // 登录的 loading 状态（防止网络请求慢出现用户多次点击触发登录请求）
      formRules: { // 表单验证规则配置
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              // console.log(rule, value)
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },

  components: {},

  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user

      // 表单验证
      this.$refs['login-form'].validate(valid => {
        // 表单验证失败，停止请求提交
        if (!valid) {
          return
        }

        // 验证通过，请求登录
        this.login()
      })
    },
    login () {
      // 验证通过，提交登录
      // 开启登录中
      this.loginLoading = true
      login(this.user).then(res => {
        // 处理后端响应结果   成功：xxx
        console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭 loading
        this.loginLoading = false

        // 跳转到首页
        // this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
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

<!-- layout 布局 -->
<template>
  <el-container class="layout-container">
    <el-aside class="aside"
              width="auto">
      <app-aside class="aside-menu"
                 :is-collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i :class="{
              'el-icon-s-fold':isCollapse,
              'el-icon-s-unfold':!isCollapse
            }"
             @click="isCollapse = !isCollapse"></i>
          <span>头条内容管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="user.photo"
                 alt=""
                 class="avatar">
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!--
              组件默认市不识别原生事件的，除非内部做了处理
              .native 修饰符：将原生事件绑定到组件
            -->
            <el-dropdown-item @click.native="onLogout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'

// 通信   注册自定义事件
import globalBus from '@/utils/global-bus'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边菜单栏的展示状态
    }
  },

  computed: {},
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()

    globalBus.$on('update-user', data => {
      // this.user = data // 注意：不要这么做，对象之间赋值的是引用，会导致相互影响的问题
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  watch: {},
  methods: {
    // 获取用户资料
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    // 退出
    onLogout () {
      // 弹框
      this.$confirm('确认退出吗', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除用户登录状态
        window.localStorage.removeItem('user')

        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}

</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.main {
  background-color: #e9eef3;
}

.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>

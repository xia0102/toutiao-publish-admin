<!-- layout 布局 -->
<template>
  <el-container class="layout-container">
    <el-aside class="aside"
              width="200px">
      <app-aside class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">顶部导航栏</el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
    }
  },

  computed: {},
  watch: {},
  methods: {}
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
  background-color: #b3c0d1;
}

.main {
  background-color: #e9eef3;
}
</style>

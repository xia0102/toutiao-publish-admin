<!-- fans 粉丝管理 -->
<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs v-model="activeName"
               type="card">
        <el-tab-pane label="粉丝列表"
                     name="first">
          <!-- 粉丝列表 -->
          <el-row :gutter="10">
            <el-col :lg="2"
                    :sm="3"
                    :md="6"
                    :xs="12"
                    v-for="(val,index) in fans"
                    :key="index"
                    class="fans-item">
              <el-image :src="val.photo"
                        class="img-item"
                        fit="cover"></el-image>
              <p>{{val.name}}</p>
              <el-button size="mini"
                         type="primary"
                         icon="el-icon-plus">关注</el-button>
            </el-col>
          </el-row>
          <!-- 列表分页 -->
          <el-pagination background
                         layout="prev, pager, next"
                         :total="totalCount"
                         :page-size="pageSize"
                         :current-page.sync="page"
                         @current-change="onPageChange">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝面像"
                     name="second">
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div ref="main"
               style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getFans } from '@/api/fans'

// 加载 echarts
import echarts from 'echarts'

export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {
      activeName: 'first',
      fans: [],
      // 总数据条数
      totalCount: 0,
      // 每页显示条目个数
      pageSize: 20,
      // 当前页码
      page: 1
    }
  },

  computed: {},
  watch: {},
  created () {
    this.loadFans(1)
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '第一个 ECharts 实例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {
    // 渲染页面
    loadFans (page = 1) {
      this.page = page
      getFans({
        page,
        per_page: this.pageSize
      }).then(res => {
        this.fans = res.data.data.results
        // 总数据条数
        this.totalCount = res.data.data.total_count
      })
    },
    // 点击页码
    onPageChange (page) {
      this.loadFans(page)
    }
  }
}

</script>

<style scoped lang="less">
.fans-item {
  border: 1px solid #eee;
  padding: 20px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img-item {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  p {
    font-size: 12px;
  }
}
</style>

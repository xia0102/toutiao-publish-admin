<!-- article 首页 -->
<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 数据筛选表单 -->
      <el-form ref="form"
               :model="form"
               label-width="40px"
               size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId"
                     placeholder="请选择频道">
            <el-option label="全部"
                       :value="null"></el-option>
            <el-option :label="channel.name"
                       :value="channel.id"
                       v-for="(channel,index) in channels"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="rangeDate"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :disabled="loading"
                     @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        根据筛选条件共查询到 {{totalCount}} 条结果：
      </div>

      <!-- 数据列表 -->
      <el-table :data="articles"
                stripe
                style="width: 100%"
                class="list-table"
                size="mini"
                v-loading="loading">
        <el-table-column prop="cover"
                         label="封面">
          <template slot-scope="scope">
            <el-image style="width:100px;height:100px"
                      :src="scope.row.cover.images[0]"
                      fit="cover"
                      lazy></el-image>
            <!-- <img v-if="scope.row.cover.images[0]"
                 class="article-cover"
                 :src="scope.row.cover.images[0]"
                 alt="">
            <img v-else
                 class="article-cover"
                 src="./no-cover.jpg"
                 alt=""> -->
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="标题">
        </el-table-column>
        <el-table-column label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据，那么就在 template 上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate"
                         label="发布时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       circle
                       icon="el-icon-edit"
                       @click="$router.push('/publish?id=' + scope.row.id.toString())"></el-button>
            <el-button size="mini"
                       type="danger"
                       circle
                       icon="el-icon-delete"
                       @click="onDeleteArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 列表分页 -->
      <el-pagination background
                     layout="prev, pager, next"
                     :total="totalCount"
                     :page-size="pageSize"
                     :disabled="loading"
                     :current-page.sync="page"
                     @current-change="onCurrentChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {},
      // 文章内容列表
      articles: [],
      // 状态
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      // 总数据条数
      totalCount: 0,
      // 每页显示条目个数
      pageSize: 10,
      // 查询文章的状态
      status: null,
      // 文章频道列表
      channels: [],
      // 查询文章的频道id
      channelId: null,
      // 筛选的范围日期
      rangeDate: null,
      // 表格数据加载中
      loading: true,
      // 当前页码
      page: 1
    }
  },

  computed: {},
  watch: {},
  created () {
    this.loadArticles(1)
    this.loadChannels()
  },
  methods: {
    loadArticles (page = 1) {
      // 显示加载中
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        // 数据
        this.articles = results
        // 总数据条数
        this.totalCount = totalCount

        // 关闭加载中
        this.loading = false
      })
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      // 弹框
      this.$confirm('确认删除吗', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
  background-size: cover;
}
</style>

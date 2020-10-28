<!-- comment 评论管理 -->
<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表格数据 -->
      <el-table class="table-list"
                :data="articles"
                style="width: 100%"
                stripe>
        <el-table-column prop="title"
                         label="标题">
        </el-table-column>
        <el-table-column prop="total_comment_count"
                         label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count"
                         label="粉丝评论数">
        </el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.comment_status"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       :disabled="scope.row.statusDisabled"
                       @change="onStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="page"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size.sync="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"
                     background />
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章数据列表
      totalCount: 0, // 总数据
      pageSize: 10, // 每页条数
      page: 1 // 页码
    }
  },

  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () { },
  methods: {
    // 渲染页面
    loadArticles (page = 1) {
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    // 每页条数改变
    handleSizeChange () {
      this.loadArticles(1)
    },
    // 页码改变
    handleCurrentChange (page) {
      this.loadArticles(page)
    },
    // 修改文章评论状态
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // 启动开关
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    }
  }
}

</script>

<style scoped lang="less">
.table-list {
  margin-bottom: 30px;
}
</style>

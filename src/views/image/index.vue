<!-- image 素材管理 -->
<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect"
                        size="mini"
                        @change="loadImages(1)">
          <el-radio-button label="false">全部</el-radio-button>
          <el-radio-button label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button type="success"
                   size="mini"
                   @click="dialogUploadVisible = true">上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col :lg="4"
                :sm="6"
                :md="6"
                :xs="12"
                v-for="(img,index) in images"
                :key="index"
                class="image-item">
          <el-image style="height: 100px"
                    :src="img.url"
                    fit="cover"></el-image>
          <div class="image-action">
            <el-button type="warning"
                       :icon="img.is_collected ?'el-icon-star-on':'el-icon-star-off'"
                       circle
                       size="small"
                       @click="onCollect(img)"
                       :loading="img.loading"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete-solid"
                       circle
                       size="small"
                       @click="onDelete(img)"
                       :loading="img.loading"></el-button>
          </div>
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
    </el-card>

    <!-- 上传素材的弹出层 -->
    <el-dialog title="上传素材"
               :visible.sync="dialogUploadVisible"
               :append-to-body="true">
      <el-upload class="upload-demo"
                 drag
                 action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                 :headers="uploadHeaders"
                 name="image"
                 multiple
                 :show-file-list="false"
                 :on-success="onUploadSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip"
             slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'

export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      // 上传素材请求头
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
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
    this.loadImages(1)
  },
  mounted () { },
  methods: {
    // 渲染素材
    loadImages (page = 1) {
      // 重置高亮页码，防止数据的页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // 添加一个字段 收藏 loading 的状态
          img.loading = false
        })
        this.images = results
        // 总数据条数
        this.totalCount = res.data.data.total_count
      })
    },
    // 全部 收藏 的筛选
    // onCollectChange () {
    //   this.loadImages(1)
    // },
    // 上传素材成功
    onUploadSuccess () {
      // 关闭弹出层
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    // 收藏
    onCollect (img) {
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        img.loading = false
      })
    },
    // 删除
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
        img.loading = false
      })
    }
  }
}

</script>

<style scoped lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.image-item {
  position: relative;
}

.image-action {
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}
</style>

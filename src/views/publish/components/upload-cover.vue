<!-- upload-cover 文章封面 -->
<template>
  <div class="upload-cover"
       @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-image"
           ref="cover-image"
           :src="value">
      <i class="el-icon-plus icon-image"></i>
    </div>

    <el-dialog title="选择封面"
               :visible.sync="dialogVisible"
               append-to-body>
      <el-tabs v-model="activeName"
               type="card">
        <el-tab-pane label="素材库"
                     name="first">
          <!-- ref 有两个作用：
            1、作用到普通 HTML 标签上可以获取 DOM
            2、作用到组件上可以获取组件 -->
          <image-list :is-show-add="false"
                      :is-show-selected="true"
                      ref="image-list" />
        </el-tab-pane>
        <el-tab-pane label="上传图片"
                     name="second">
          <img width="100"
               ref="preview-image"
               style="display:block;">
          <button @click="$refs.file.click()">选择封面</button>
          <input id="file"
                 type="file"
                 ref="file"
                 hidden
                 @change="onFileChange">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/components/image-list'

export default {
  name: 'UploadCover',
  components: {
    ImageList
  },
  props: ['value'],
  // props: ['cover-image'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },

  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    showCoverSelect () {
      // 显示弹出层
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]

      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob

      // 防止用户选择同一个文件 不触发 change 事件
      // this.$refs.file.value = ''
    },
    onCoverConfirm () {
      // 如果 tab 是上传图片，并且 input-file 有选择的图片，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 上传文件
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          this.dialogVisible = false
          // 展示上传的图片
          // this.$refs['cover-image'].src = res.data.data.url

          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 父组件访问子组件中的数据
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (!selected) {
          this.$message('请选择封面图片')
          return
        }
        this.dialogVisible = false
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}

</script>

<style scoped lang="less">
.upload-cover {
  margin-right: 5px;
  .cover-wrap {
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px solid #eee;
    .cover-image {
      height: 120px;
      max-width: 100%;
    }
    .icon-image {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>

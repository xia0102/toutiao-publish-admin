<!-- settings 个人设置 -->
<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <!-- 表单数据 -->
          <el-form ref="form"
                   :model="user"
                   label-width="70px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea"
                        v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-avatar shape="square"
                     :size="150"
                     fit="cover"
                     :src="user.photo">
          </el-avatar>
          <p @click="$refs.file.click()">点击修改头像</p>
          <!-- <label for="file">点击修改头像</label> -->
          <input id="file"
                 type="file"
                 hidden
                 ref="file"
                 @change="onFileChange()">
        </el-col>
      </el-row>
    </el-card>
    <!-- 上传图片截切预览 -->
    <el-dialog title="修改头像"
               :visible.sync="dialogVisible"
               append-to-body
               @opened="onDialogOpened"
               @closed="onDialogClosed">
      <div class="preview-image-wrap">
        <img class="preview-image"
             :src="previewImage"
             ref="preview-image"
             alt="">
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   :loading="updatePhotoLoading"
                   @click="onUpdatePhoto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto } from '@/api/user'

import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      // 用户资料
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片截切预览的显示状态
      previewImage: '', // 预览图片
      cropper: null, // 裁切器示例
      updatePhotoLoading: false // 更新用户头像 loading 状态
    }
  },

  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () { },
  methods: {
    // 页面渲染
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    // 选中图片，图片发生改变
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])

      this.previewImage = blobData

      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true

      // 选择相同文件不触发 change 事件
      this.$ref.file.value = ''
    },
    // 弹出层的打开事件
    onDialogOpened () {
      // 图片裁切(图片裁切器必须基于 img 进行初始化,img 必须是可见状态才能正常完成初始化)
      const image = this.$refs['preview-image']
      // 初始化裁切器（第一次初始化好以后，如果预览裁切的图片发生了变化，裁切器默认不会更新）
      // 方式一：裁切器 .replace 方法
      // 方式二：销毁裁切器，重新初始化 .destroy()
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        // 裁切框比例
        aspectRatio: 1,
        // 限制裁切框不超过画布的大小，默认为0
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false
        // 移动裁切器时触发
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    // 弹出层的关闭事件
    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      // this.cropper.destroy()
    },
    // 修改图片成功
    onUpdatePhoto () {
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像
        updateUserPhoto(fd).then(res => {
          this.dialogVisible = false
          // 更新视图展示
          this.user.photo = window.URL.createObjectURL(file)
          // this.user.photo = res.data.data.photo
          this.updatePhotoLoading = false
        })
      })
    }
  }
}

</script>

<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>

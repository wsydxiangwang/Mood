<template>
  <section>
    <div class="header">
			<h2 class="tit">网站信息</h2>
		</div>
    <el-form-item 
      v-for="(v, k, i) in list"
      :label="v" 
      :key="i" 
      :class="['fileUploadType', 'emailType'].includes(k) ? 'form-radio' : ''"
    >
      <Upload
        icon="el-icon-user"
        class="avatar"
        name="avatar"
        @uploadImage="uploadImage"
        :url="form['adminAvatar']"
        v-if="k == 'adminAvatar'"
      />
      <el-radio-group 
        v-else-if="['fileUploadType', 'emailType'].includes(k)" 
        v-model="form[k]"
      >
        <el-radio
          v-for="(item, index) in typeList[k].list"
          :label="item"
          :key="index"
        ></el-radio>
        <div
          class="oss-list"
          v-if="k === 'fileUploadType' && form[k] == '阿里云'"
        >
          <el-input
            v-for="(val, key, idx) in typeList['fileUploadType']['阿里云']"
            v-model="ossAliyun[key]"
            :class="{ red: key != 'domain' }"
            :placeholder="val"
            :key="idx"
          ></el-input>
        </div>
      </el-radio-group>  
      <el-input v-model="form[k]" v-else></el-input>
      <el-popover
        placement="top"
        width="300"
        trigger="hover"
      >
        <p>
          与邮箱一致的通行码,
          在邮箱设置开启SMTP服务器可获取（邮件通知必填）
        </p>
        <span
          class="email-pass"
          v-if="k == 'emailPass'"
          slot="reference"
        >(view)</span>
      </el-popover>
    </el-form-item>
  </section>
</template>
<script>
import Upload from '@/components/Upload'
export default {
  name: 'Base',
  components: {
    Upload
  },
  props: {
    data: {
      type: Object || null,
      default: () => {}
    }
  },
  data() {
    return {
      list: {
        adminAvatar: '管理员头像',
        adminName: '管理员昵称',
        websiteName: '网站名字',
        websiteAddress: '网站域名',
        websiteDescribe: '网站描述',
        seo: 'SEO关键词',
        fileUploadType: '文件上传',
        emailType: '邮箱类型',
        emailPass: '邮箱PASS'
      },
      typeList: {
        'fileUploadType': {
					list: ['服务器', '阿里云'],
					阿里云: {
						bucket: 'bucket',
						region: 'region',
						accessKeySecret: 'accessKeySecret',
						accessKeyId: 'accessKeyId',
						domain: '自定义文件域名，非必填'
					}
				},
				'emailType': {
					list: ['QQ', '163'],
					pass: ''
				}
      },
      form: {},
      ossAliyun: {}
    }
  },
  watch: {
    data(val, originVal){
      if (originVal == null) {
        this.form = JSON.parse(JSON.stringify(val))
      }
    },
    form: {
      handler(data){
        this.$emit('updateForm', {
          type: 'base',
          data
        })
      },
      deep: true
    }
  },
  methods: {
    uploadImage(file) {
      this.$emit('uploadImage', {
        type: 'adminAvatar',
        file
      })
		}
  }
}
</script>

<style scoped lang="scss">
.form-radio{
  margin-bottom: 10px;
}
.email-pass {
	position: absolute;
	left: -58px;
	top: 16px;
	font-size: 12px;
	color: #b3b3b3;
}
.avatar {
	height: 100px;
	::v-deep .el-upload {
		height: 100px;
		width: 100px;
		overflow: hidden;
		border: 4px solid #dce7ff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		i {
			font-size: 30px;
			color: #dcdfe6;
		}
		img {
			width: 100%;
		}
	}
}
.oss-list {
  margin-top: 6px;
  .el-input {
    margin-top: 10px;
    position: relative;
    &.red::before {
      content: '*';
      color: red;
      position: absolute;
      top: 15px;
      left: -12px;
      font-size: 16px;
    }
	}
}
</style>
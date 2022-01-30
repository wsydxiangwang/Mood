<template>
  <div>
    <div class="upload-box" v-if="isUploadType">
      <el-upload
        v-for="(item, index) in ['music', 'image']"
        :key="index"
        :show-file-list="false"
        :http-request="uploadChange"
        :name="item"
        class="upload-item"
        ref="upload"
        action
        drag
      >
        <template v-if="item == 'music'">
          <i class="el-icon-headset"></i>
          <div class="el-upload__text">{{ music.name || '背景音乐' }}</div>
        </template>
        <template v-else>
          <img v-if="image.url" :src="image.url" />
          <template v-else>
            <i class="el-icon-picture-outline-round"></i>
            <div class="el-upload__text">
              封面图片 (680*440)
            </div>
          </template>
        </template>
      </el-upload>
    </div>

    <template v-else>
      <el-input
        placeholder="音乐地址"
        v-model="music.url"
        prefix-icon="el-icon-headset"
        clearable
      ></el-input>
      <el-input
        placeholder="封面图片"
        v-model="image.url"
        prefix-icon="el-icon-picture-outline-round"
        clearable
      ></el-input>
    </template>

    <el-switch
      v-model="isUploadType"
      active-text="文件上传"
      inactive-text="输入链接"
    ></el-switch>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    music: {
      type: Object,
      default: () => {}
    },
    image: {
      type: Object,
      default: () => {}
    },
    uploadType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isUploadType: true
    }
  },
  watch: {
    isUploadType(val) {
      this.$emit('changeMediaType', val)
    }
  },
  methods: {
    uploadChange(data) {
			const list = ['audio', 'image']
			const name = data.filename == 'music' ? 'audio' : data.filename
			const index = list.indexOf(data.file.type.split('/')[0])

			if (name != list[index]) {
				this.$message.error(`请选择${name}格式的文件!`)
				return
			}

      const type = data.filename
      const file = data.file
      const form = this.$formData({
				file,
				type: this.uploadType,
			})
      this.$emit('uploadComponentChange', {
        type,
        data: {
          url: URL.createObjectURL(file),
          name: file.name,
          form
        }
      })
		}
  }
}
</script>

<style scoped lang="scss">
.el-switch, .el-input {
  width: 100%;
  height: 38px;
  margin: 8px 0;
}
.upload-box {
	display: flex;
	margin: 10px -7px 5px;
	.upload-item {
		width: 50%;
		max-width: 360px;
		margin: 0 7px;
		::v-deep .el-upload {
			width: 100%;
			.el-upload-dragger {
				width: 100%;
				.el-icon-picture-outline-round,
				.el-icon-headset {
					font-size: 46px;
					color: #c0c4cc;
					margin: 42px 0 14px;
					line-height: 50px;
					transition: all 0.3s;
				}
				.el-upload__text {
					color: #98999c;
					transition: all 0.3s;
				}
				&:hover {
					.el-icon-picture-outline-round,
					.el-upload__text,
					.el-icon-headset {
						color: #409eff;
					}
				}
			}
		}
	}
	img {
		width: 100%;
	}
}
@media screen and (max-width: 600px) {
  .upload-box .upload-item ::v-deep .el-upload .el-upload-dragger {
		height: 130px;
		.el-icon-picture-outline-round,
		.el-icon-headset {
			font-size: 36px;
			margin: 22px 0 10px;
		}
	}
}
</style>
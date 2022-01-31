<template>
  <section>
    <h2 class="tit hint-tit">
      首屏效果
      <el-popover placement="top" width="300" trigger="hover">
        <p>遮罩颜色请选择与图片相对应的色彩</p>
        <img src="@/assets/cover.png" />
        <span slot="reference">(view)</span>
      </el-popover>
    </h2>

    <template v-for="(v, k, i) in info">
      <el-form-item :label="v" :key="i" v-if="k == 'image'">
        <Upload
          icon="el-icon-picture"
          class="cover"
          name="cover"
          @change="uploadChange"
          :url="form[k]"
          :color="form['color']"
        />
        <span class="upload-image-size">(1920*1080)</span>
      </el-form-item>

      <el-form-item :label="v" :key="i" v-else-if="k != 'color'">
        <el-input v-model="form[k]"></el-input>
      </el-form-item>
      <el-form-item :label="v" :key="i" v-else>
        <el-color-picker
          show-alpha
          :key="i"
          v-model="form['color']"
        ></el-color-picker>
      </el-form-item>
    </template>
  </section>
</template>

<script>
import Upload from '@/components/Upload'
export default {
  name: 'CoverInfo',
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
      info: {
        image: '图片',
        title: '标题',
        describe: '描述',
        date: '时间',
        link: '链接',
        color: '遮罩',
      },
      form: {}
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
          type: 'cover',
          data
        })
      },
      deep: true
    }
  },
  methods: {
    fileUploadType(name) {
			return name == 'adminAvatar' ? 'avatar' : 'cover'
		},
    uploadChange(){}
  }
}
</script>

<style scoped lang="scss">
h2.tit {
	margin: 50px 0 30px;
	justify-content: flex-start;
	span {
		font-size: 12px;
		color: #b3b3b3;
    margin-left: 4px;
	}
}
.el-popover {
	p {
		margin-bottom: 5px;
	}
	img {
		width: 100%;
		border-radius: 4px;
	}
}
.cover {
	overflow: hidden;
	::v-deep .el-upload {
		width: 300px;
		height: 170px;
		border-radius: 4px;
		overflow: hidden;
		border: 6px solid #dce7ff;
		display: flex;
		justify-content: center;
		align-items: center;
		img {
			width: 100%;
			height: 100%;
			border-radius: 2px;
		}
		i {
			font-size: 30px;
			color: #dcdfe6;
			vertical-align: middle;
		}
	}
}
.upload-image-size {
	position: absolute;
	top: 20px;
	font-size: 12px;
	right: calc(100% + 14px);
	color: #b3b3b3;
}
</style>
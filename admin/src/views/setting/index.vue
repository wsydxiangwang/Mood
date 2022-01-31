<template>
	<div v-loading.fullscreen.lock="fullscreenLoading">
		<el-form label-width="100px">
      <component 
        v-for="(v, k, i) in componentList" 
        :is="v" 
        :key="i"
        :data="form[k]"
        @uploadImage="uploadImage"
        @updateForm="updateForm"
      ></component>
			<el-form-item>
				<el-button class="submit" type="primary" @click="onSubmit">立即保存</el-button>
				<span class="hint">
          <i class="el-icon-warning"></i>信息需填写完整才能正常使用
        </span>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import Upload from '@/components/Upload'
import CoverInfo from './cover.vue'
import BgMusic from './bgMusic.vue'
import Website from './website.vue'
import Base from './base.vue'
import Other from './other.vue'
export default {
	components: {
		Upload,
    CoverInfo,
    BgMusic,
    Website,
    Base,
    Other
	},
	data() {
		return {
      componentList: {
        base: Base,
        website: Website,
        cover: CoverInfo,
        bgMusic: BgMusic,
        other: Other
      },
			form: {
				base: null,
				website: null,
				cover: null,
				bgMusic: null,
				other: null,
				ossAliyun: null,
			},
			uploadFile: {},
			fullscreenLoading: false,
		}
	},
	watch: {
		$info: {
			handler(val) {
				if (val) {
          setTimeout(() => {
            this.init()
          }, 2000)
        }
			},
			immediate: true,
		},
	},
	computed: {
		$info() {
			return this.$store.state.$data ? this.$store.state.$data.info : {}
		},
	},
	methods: {
    uploadImage(){

    },
    updateForm({ type, data }){
      this.form[type] = data
    },
		init() {
			for (let key in this.$info) {
				this.$set(this.form, key, this.$info[key])
			}
      console.log('data', this.form)
		},
		async onSubmit() {

      console.log('submit', this.form)
      return 
			const fileUploadType = this.form['base']['fileUploadType']
			const ossAliyun = this.form['ossAliyun']

			if (fileUploadType == '阿里云') {
				for (let i in ossAliyun) {
					if (i != 'domain' && !ossAliyun[i]) {
						this.$message.error('请填写阿里云上传模式的必填信息！')
						return
					}
				}
			}

			/**
			 * Password
			 */
			// const [p1, p2] = ['password', 'password_new'].map(
			// 	i => this.form['other'][i]
			// )
			// if (p1 && !p2) {
			// 	this.$message.error('请填写新密码!')
			// 	return
			// } else if (p2 && !p1) {
			// 	this.$message.error('请填写原密码!')
			// 	return
			// }

			// if (p2 && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(p2)) {
			// 	this.$message.error('请填写6~18位包含数字和字母的密码!')
			// 	return
			// }

			this.fullscreenLoading = true

			/**
			 * Password Submit
			 */
			if (p1 && p2) {
				const result = await this.$http.post('/password', { p1, p2 })
				if (result.data.status === 2) {
					this.popupHint(result.data.message)
					return
				}
			}

			/**
			 * Upload Image
			 */
			for (let key in this.uploadFile) {
				const form = new FormData()
				form.append('type', fileUploadType)
				form.append('file', this.uploadFile[key])

				if (fileUploadType == '阿里云') {
					const oss = JSON.stringify(ossAliyun)
					form.append('oss', oss)
				}

				const res = await this.$http.post('/upload', form)
				const msg = res.data.body

				if (res.data.status === 1) {
					if (key === 'avatar') {
						this.form['base']['adminAvatar'] = msg.url
					} else {
						this.form['cover']['image'] = msg.url
					}
				} else {
					this.popupHint(msg.message)
					return
				}
			}

			/**
			 * SUBMIT
			 */
			this.$http
				.post('/info', this.form)
				.then(res => {
					this.uploadFile = {}
					this.popupHint('success', true)
					this.$store.commit('updataInfo', res.data.body)
					document.querySelector('.content').scrollTop = 0
				})
				.catch(err => {
					this.popupHint(err.message)
				})
		},
		popupHint(msg, type) {
			if (type) {
				this.$message.success(msg)
			} else {
				this.$message.error(msg)
			}
			this.fullscreenLoading = false
		},
	},
}
</script>

<style lang="scss" scoped>
.el-form {
	max-width: 600px;
}
.submit:hover + .hint {
	opacity: 1;
}
.hint {
	font-size: 12px;
	color: #ff4444;
	margin-left: 10px;
	letter-spacing: 2px;
	opacity: 0;
	transition: all 0.3s;
}
@media screen and (max-width: 600px) {
	.cover {
		::v-deep .el-upload {
			width: 100%;
		}
	}
	.hint {
		opacity: 1;
		display: block;
	}
	::v-deep .el-form-item {
		label {
			width: 90px !important;
		}
		.el-form-item__content {
			margin-left: 90px !important;
		}
	}
}
</style>
<template>
	<div class="article-new" v-loading.fullscreen.lock="fullscreenLoading">
		<section>
			<h2 class="tit">无人问津的心情，在黑纸白字间游荡！</h2>
			<el-input
				placeholder="标题"
				v-model="data.title"
				clearable
				ref="refTitleInput"
			></el-input>
		</section>
		<mavon-editor
			v-model="data.content"
			:subfield="false"
			@imgAdd="editorImage"
			@imgDel="$imgDel"
			ref="markdown"
		/>
		<section>
			<Date @getDate="getDate" :originalDate="data.time" />
			<el-input
				placeholder="文章摘要"
				v-model="data.describe"
				prefix-icon="el-icon-document"
				clearable
			></el-input>
			<Upload 
				:music="data.music" 
				:image="data.image" 
				:uploadType="uploadType"
				@changeMediaType="changeMediaType"
				@uploadComponentChange="uploadComponentChange"
			></Upload>
			<el-switch
				v-model="data.hide"
				inactive-text="发布文章"
				active-text="隐藏文章"
			></el-switch>
		</section>

		<el-button type="primary" class="submit" @click="submit">SUBMIT</el-button>
	</div>
</template>

<script>
import Date from '@/components/Date'
import Upload from './upload.vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
	components: {
		Date,
		mavonEditor,
		Upload
	},
	data() {
		return {
			id: '', // 当前文章id（编辑）
			data: {
				title: '', // 标题
				content: '', // 内容
				contentHtml: '', // 内容解析html
				describe: '', // 文章摘要
				time: '', // 时间
				image: {}, // 图片
				music: {}, // 音乐
				hide: false, // 隐藏
			},
			markdownImage: [], // 编辑器的图片集合
			isUpload: false, // 是否上传 取反

			fullscreenLoading: false,
			mediaType: 'upload'
		}
	},
	created() {
		this.id = this.$route.query.id
		this.id && this.loadData(this.id)
	},
	mounted(){
		this.$refs.refTitleInput.focus()
	},
	computed: {
		uploadType() {
			return this.$store.state.$data.info.base.uploadType
		},
		musicName() {
			return this.data['music'].url
				? this.data['music'].name || this.data['music'].url
				: '背景音乐'
		},
	},
	methods: {
		// 获取当前文章的数据
		loadData(id) {
			this.$request(() =>
				this.$http.get(`article/${id}`).then(res => {
					if (res.data.status === 1) {
						this.data = res.data.body
					} else {
						this.$message.error(res.data.body.message)
					}
				})
			)
		},
		// 上传组件临时数据缓存
		uploadComponentChange({ type, data }){
			this.$set(this.data, type, data)
		},
		changeMediaType(status){
			this.mediaType = status ? 'upload' : 'text'
		},
		editorImage(type, file) {
			const form = this.$formData({
				file: file,
				type: this.uploadType,
			})
			// 缓存内容区图片
			this.markdownImage.push({
				index: type,
				form,
			})
		},
		$imgDel(index) {
			this.markdownImage.splice(index, 1)
		},
		async submit() {
			const markdown = this.$refs.markdown
			this.data.content = markdown.d_value // 内容

			const map = {
				title: '请输入标题',
				content: '请输入内容',
				time: '请选择时间',
			}
			for (let i in map) {
				if (!this.data[i]) {
					this.$message.error(`${map[i]}`)
					return
				}
			}

			this.fullscreenLoading = true

			const textarea = {
				contentHtml: markdown.d_render,
				content: markdown.d_value,
				words: markdown.d_value.length,
			}
			for (let i in textarea) {
				this.data[i] = textarea[i]
			}

			// 摘要默认内容
			const describe = this.data.describe
			this.data.describe = !describe
				? this.data.content.slice(0, 60) + '...'
				: describe

			const articleType = this.id ? `article/${this.data._id}` : 'article'
			const articleMesg = this.id ? '更新' : '发表'

			const fileRes = await this.uploadFile()

			console.log('fileRes', fileRes)

			this.$http.post(articleType, { data: this.data }).then(res => {
				if (res.data.status === 1) {
					this.$message.success(`${articleMesg}成功`)
					this.$router.push('/article')
					this.$infoUpdate()
				} else {
					this.$message.error(`${articleMesg}失败，请检查网络问题!`)
				}
				this.fullscreenLoading = false
			})
		},
		// 获取时间
		getDate(timestamp) {
			this.data.time = timestamp
		},
		uploadFile(){
			return new Promise(async (resolve, reject) => {
				// 上传内容区图片
				const conImgList = this.markdownImage
				for (let i = 0; i < conImgList.length; i++) {
					const result = await this.$http.post('/upload', conImgList[i]['form'])
					const body = result.data.body
					if (result.data.status == 1) {
						markdown.$img2Url(i + 1, body.url)
					} else {
						this.fullscreenLoading = false
						this.$message.error(body.message)
						break
					}
				}

				// 上传背景音乐 & 封面图
				if (this.mediaType == 'upload') {
					for (let i of ['image', 'music']) {
						const data = this.data[i]
						if (data.form) {
							const res = await this.$http.post('/upload', data.form)
							if (res.data.status == 1) {
								data.url = res.data.body.url
								delete data.form
							} else {
								this.$message.error(res.data.body.message)
								this.fullscreenLoading = false
								reject(res.data.body.message)
								return
							}
						}
					}
				}
				resolve('File upload completed')
			})
		}
	},
}
</script>

<style lang="scss" scoped>
section {
	margin: 15px 0;
	.el-switch,
	.el-input {
		width: 100%;
		height: 38px;
		margin: 8px 0;
	}
}
.markdown-body {
	height: 65vh;
	box-shadow: none !important;
	border: 1px solid #eee !important;
}
.submit {
	width: 200px;
	height: 40px;
	font-size: 14px;
	color: #fff;
}

::v-deep .el-switch__label {
	color: #98999c;
	font-weight: 400;
	&.is-active {
		color: #409eff;
	}
}
@media screen and (max-width: 600px) {
	.markdown-body {
		height: 90vh !important;
		box-shadow: none !important;
	}
	section {
		margin: 10px 0;
		box-shadow: none;
	}
	.submit {
		width: 150px;
		height: 36px;
		margin: 0 0 20px;
		line-height: 36px;
		padding: 0;
	}
}
</style>

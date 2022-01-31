<template>
	<el-upload
		action=""
		:auto-upload="false"
		:show-file-list="false"
		:on-change="upload"
	>
		<img v-if="url || newURL" :src="newURL || url" />
		<i v-else :class="icon"></i>
		<span 
			v-if="name == 'cover'" 
			class="mask-color" 
			:style="{ backgroundColor: color }
		"></span>
	</el-upload>
</template>

<script>
export default {
	name: 'upload',
	props: {
		name: {
			type: String,
			default: '',
		},
		icon: {
			type: String,
			default: 'el-icon-plus',
		},
		url: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			newURL: ''
		}
	},
	methods: {
		upload(file) {
			if (!file.raw.type.includes('image')) {
				this.$message.error('请选择图片格式的文件！')
				return
			}
			this.newURL = URL.createObjectURL(file.raw)
			this.$emit('uploadImage', file.raw)
		},
	},
}
</script>

<style scoped>
.mask-color{
	position: absolute;
	top: 6px;
	left: 6px;
	bottom: 6px;
	width: 100%;
	clip-path: polygon(0 0,18% 0,40% 100%,0 100%);
}
</style>
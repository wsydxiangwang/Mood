<template>
    <el-upload
        action=""
        :auto-upload="false"
        :show-file-list="false"
        :on-change="upload"
    >
        <img v-if="url || newURL" :src="newURL || url">
        <i v-else :class="icon"></i>
    </el-upload>
</template>

<script>
export default {
    name: 'upload',
    props: {
        name: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'el-icon-plus'
        },
        url: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            newURL: '',
            form: null
        }
    },
    methods: {
        getFile() {
            return this.form.get('file')
        },
        upload(file) {
            if (!file.raw.type.includes('image')) {
                this.$message.error('请选择图片格式的文件！')
                return
            }

            this.form = new FormData()
            this.form.append('file', file.raw)

            this.newURL = URL.createObjectURL(file.raw)
            this.$emit('change', this.name, this.form)
        }
    }
}
</script>
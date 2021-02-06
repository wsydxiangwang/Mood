<template>
    <div>
        <h2 class="tit">个人信息页，来让陌生人认识一下自己吧！！</h2>
        <mavon-editor 
            v-model="data.content" 
            style="height: 69vh" 
            :subfield="false"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
            ref="markdown" 
        />
        <el-button class="submit" type="primary" @click="submit">SUBMIT</el-button>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        mavonEditor
    },
    data() {
        return {
            data: {
                content: '',            // 内容
                contentHtml: '',        // 内容解析html
            },
            markdownImage: []
        }
    },
    computed: {
        uploadType() {
            return this.$store.state.$data.info.base.upload_type
        }
    },
    mounted(){
        this.$http.get('myself').then(res => {
            if (res.data.status == 1) {
                this.data = res.data.body || {}
            } else {
                this.$message.error(res.data.body.message)
            }
        })
    },
    methods: {
        $imgAdd(index, $file){
            const form = this.$formData({
                'file': $file,
                'type': this.uploadType
            })
            this.markdownImage.push({
                index,
                form
            })
        },
        $imgDel(index){
            this.markdownImage.splice(index, 1)
        },
        async submit(){
            const markdown = this.$refs.markdown
            const textarea = {
                'contentHtml': markdown.d_render,
                'content': markdown.d_value,
            }
            for (let i in textarea) {
                this.data[i] = textarea[i]
            }

            // 上传内容区图片
            const conImgList = this.markdownImage
            for (let i = 0; i< conImgList.length; i++) {
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

            this.$request(() => this.$http.post('myself', this.data)
                .then(res => {
                    this.$message.success('success')
                }))
        }
    }
}
</script>

<style lang="scss" scoped>
section{
    margin: 15px 0;
    .el-input{
        width: 100%;
        height: 38px;
        margin: 5px 0;
        ::v-deep input{
            border-color: #eee !important;
        }
    }
}
.markdown-body{
    height: 70vh;
    box-shadow: none !important;
    border: 1px solid #eee !important;
}
.submit{
    width: 200px;
    height: 40px;
    font-size: 14px;
    color: #fff;
    margin-top: 15px;
}
@media screen and (max-width: 600px) {
    .markdown-body{
        height: 100vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 20px 0 20px;
        line-height: 36px;
        padding: 0;
    }
}

</style>
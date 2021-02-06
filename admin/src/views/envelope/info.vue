<template>
    <div>
        
        <h2 class="tit">一字一句，无人知晓！</h2>

        <mavon-editor 
            v-model="data.content" 
            ref="markdown" 
            style="height: 60vh" 
            :subfield="false"
            @change="change"
            :toolbars="toolbars"
        />

        <section>
            <Date @getDate="getDate" :originalDate="data.time" />
        </section>

        <el-button class="submit" type="primary" @click="submit">SUBMIT</el-button>
    </div>
</template>

<script>
import Date from '@/components/Date'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        Date,
        mavonEditor
    },
    data() {
        return {
            data: {
                content: '',            // 内容
                contentHtml: '',        // 内容解析html
                time: '',               // 时间
            },
            id: null,
            toolbars: {
                bold: true,         // 粗体
                italic: true,       // 斜体
                header: true,       // 标题
                underline: true,    // 下划线
                strikethrough: true,// 中划线
                mark: true,         // 标记
                superscript: true,  // 上角标
                subscript: true,    // 下角标
                quote: true,        // 引用
                ol: true,           // 有序列表
                ul: true,           // 无序列表
                link: true,         // 链接
                alignleft: true,    // 左对齐
                aligncenter: true,  // 居中
                alignright: true,   // 右对齐
                subfield: true,     // 单双栏模式
            }
        }
    },
    created() {
        this.id = this.$route.query.id
        this.id && this.load(this.id)
    },
    methods: {
        load(id) {
            this.$request(() => this.$http.get(`envelope/${id}`)
                .then(res => {
                    if (res.data.status === 1) {
                        this.data = res.data.body
                    } else {
                        this.$message.error(res.data.body.message)
                    }
                })
            )
        },
        getDate(time) {
            this.data.time = time
        },
        change(value, render) {
            this.data.contentHtml = render;     // render 为 markdown 解析后的结果[html]
            this.data.content = value;          // 输入的内容
        },
        submit() {
            if (!this.data.content || !this.data.time) {
                this.$message.error('请填写完整的信息')
                return
            }
            const type = this.id ? `/envelope/${this.data._id}` : '/envelope'
            const message = this.id ? '修改成功' : '发布成功'

            this.$request(() => this.$http.post(type, this.data).then(res => {
                this.$message.success(message)
                this.$router.push('/envelope')
                this.$infoUpdate()
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
}
@media screen and (max-width: 600px) {
    .markdown-body{
        height: 60vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 0 0 20px;
        line-height: 36px;
        padding: 0;
    }
}

</style>
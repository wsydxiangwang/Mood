<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        
        <h2 class="tit">无人问津的心情，在黑纸白字间游荡！</h2>

        <mavon-editor 
            @change="change" 
            v-model="data.content" 
            ref="md" 
            style="height: 60vh" 
            :toolbars="markdownOption" 
            :subfield="false"
        />

        <section>
            <date @getDate="getDate" :originalDate="data.time" v-if="hackReset"></date>
        </section>

        <el-button class="submit" type="primary" @click="submit">SUBMIT</el-button>
    </div>
</template>

<script>
import date from '@/components/date'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        date,
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
            hackReset: true,

            markdownOption: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
            },

            fullscreenLoading: false,
            loading: ''
        }
    },
    created(){
        this.id = this.$route.query.id;
        if(this.id) this.loadData(this.id);
    },
    mounted(){
        this.$store.commit('setMenu', this.$route.path)
    },
    methods: {
        async loadData(id){
            this.loading = this.$loading({target: '.container'})
            
            let res = await this.$http.get(`envelope/${id}`)

            setTimeout(() => {
                this.data = res.data;
                this.hackReset = false;
                this.$nextTick(() => { this.hackReset = true; })
                this.loading.close()
            }, 500)
        },
        getDate(time){
            this.data.time = time;
        },
        change(value, render){
            this.data.contentHtml = render;     // render 为 markdown 解析后的结果[html]
            this.data.content = value;          // 输入的内容
        },
        submit(){
            if(!this.data.content || !this.data.time){
                this.$message.error('请填写完整的信息');
                return;
            }

            this.fullscreenLoading = true;

            /**
             * 编辑或发布
             */
            const type = this.id ? `/envelope/${this.data._id}` : '/envelope';
            const mesg = this.id ? '修改成功' : '发布成功';

            this.$http.post(type, this.data).then(res => {
                setTimeout(() => {
                    this.$message({
                        message: mesg,
                        type: 'success'
                    });
                    this.$router.push('/envelope')
                    this.fullscreenLoading = false;
                    this.$infoUpdate() // 刷新状态
                }, 500)
            })
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
        /deep/ input{
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
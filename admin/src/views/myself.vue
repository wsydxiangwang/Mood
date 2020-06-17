<template>
    <div v-loading.fullscreen.lock="loading">
        
        <h2 class="tit">个人信息页，来让陌生人认识一下自己吧！！</h2>

        <mavon-editor 
            @change="change" 
            v-model="data.content" 
            ref="md" 
            style="height: 69vh" 
            :subfield="false"
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
            loading: false
        }
    },
    mounted(){
        this.$http.get('myself').then(res => {
            if(res.data.status == 1){
                this.data = res.data.body
            }
        })

    },
    methods: {
        change(value, render){
            this.data.contentHtml = render;     // render 为 markdown 解析后的结果[html]
            this.data.content = value;          // 输入的内容
        },
        submit(){
            this.loading = true;
            this.$http.post('myself', this.data).then(res => {
                setTimeout(() => {
                    this.$message({
                        message: 'success',
                        type: 'success'
                    });
                    this.$router.push('/')
                    this.loading = false;
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
    margin-top: 15px;
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
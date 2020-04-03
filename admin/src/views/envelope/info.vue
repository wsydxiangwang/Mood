<template>
    <div v-loading.fullscreen.lock="loading">
        
        <h2>无人问津的心情，在黑纸白字间游荡！</h2>

        <mavon-editor 
            @change="change" 
            v-model="data.content" 
            ref="md" 
            style="height: 60vh" 
            :subfield="false"
        />

        <section>
            <date @getDate="getDate" :originalDate="data.time" v-if="isReset"></date>
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
            loading: false,
            isReset: true,
            id: '',
        }
    },
    methods: {
        // get Time
        getDate(e){
            this.data.time = e;
        },
        change(value, render){
            this.data.contentHtml = render;     // render 为 markdown 解析后的结果[html]
            this.data.content = value;          // 输入的内容
        },
        submit(){
            this.loading = true;
            if(this.id){
                this.$http.put(`/envelope/${this.data._id}`, this.data).then(res => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$router.push('/envelope')
                    }, 1000)
                })
            }else{
                this.$http.post('/envelope', this.data).then(res => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.$router.push('/envelope')
                    }, 1000)
                })
            }
        },
        async loadData(id){
            let res = await this.$http.get(`envelope/${id}`)

            this.data = res.data;
            console.log(this.data)
            this.isReset = false;
            this.$nextTick(() => {
                this.isReset = true;
            })
        },
    },
    created(){
        this.id = this.$route.query.id;
        if(this.id) this.loadData(this.id);
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
h2{
    margin: 10px 0 20px;
    font-size: 16px;
    color: #606060;
}

@media screen and (max-width: 600px) {
    .markdown-body{
        height: 80vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 0;
    }
}

</style>
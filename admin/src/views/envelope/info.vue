<template>
    <div class="content" v-loading.fullscreen.lock="loading">
        
        <mavon-editor @change="change" v-model="data.content" ref="md" style="height: 60vh"/>

        <section>
            <date @getDate="getDate" :originalDate="data.time" v-if="isReset"></date>
        </section>

        <button class="submit" @click="submit">提交</button>
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
    padding: 10px;
    margin: 20px 0;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    input{
        width: 100%;
        height: 38px;
        padding: 0 10px;
        border: 1px solid #eee;
        margin: 10px 0;
    }
}
.submit{
    width: 200px;
    height: 40px;
    font-size: 14px;
    margin-top: 20px;
    border: none;
    background: #2196F3;
    color: #fff;
}
</style>
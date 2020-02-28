<template>
    <div class="edit">
        <h1>标题</h1>

        <section>
            <h2>标题</h2>
            <input type="text" v-model="dataAll.title" placeholder="标题">
        </section>

        <mavon-editor @change="change" v-model="dataAll.content" ref="md" style="height: 70vh"/>

        <section>
            <div class="state">
                <div>时间</div>
                <input type="text" v-model="dataAll.time">
            </div>
        </section>

        <button class="submit" @click="submit">提交</button>
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
            dataAll: ''
        }
    },
    methods: {
        change(value, render){
            this.dataAll.contentHtml = render;     // render 为 markdown 解析后的结果[html]
        },
        async submit(){
            const res = await this.$http.put(`/phrase/${this.dataAll._id}`, this.dataAll)
            console.log(res)
        }
    },
    created() {
        this.dataAll = this.$route.params;
        console.log(this.dataAll)
    },
    
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
<template>
    <div class="edit">
        <h1>标题</h1>

        <section>
            <h2>标题</h2>
            <input type="text" v-model="dataAll.title" placeholder="标题">
        </section>

        <mavon-editor :ishljs="true" codeStyle="monokai-sublime"  @change="change" v-model="dataAll.content" ref="md" style="height: 70vh"/>
        
        <section>
            <div class="state">
                <div>时间</div>
                <input type="text" v-model="dataAll.time">
                <h2>文章置顶</h2>
                <div>保存草稿</div>
            </div>
        </section>

        <section>
            <h2>文章分类</h2>
            <div class="category">
                <div>342342423</div>
                <div>342342423</div>
                <div>342342423</div>
            </div>
        </section>

        <section>
            <h2>摘要</h2>
            <div class="intro">
                <input type="text" v-model="dataAll.describe" placeholder="简介">
            </div>
        </section>

        <section>
            <h2>封面图</h2>
            <div class="picture">
                <input type="text" v-model="dataAll.image" placeholder="图片链接">
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
        // 提交更新文章
        async submit(){
            const res = await this.$http.put(`article/${this.dataAll._id}`, this.dataAll)
            console.log(res)
        },
        // 获取当前文章的数据
        async loadData(){
            let id = this.$route.query.id;
            const res = await this.$http.get(`article/${id}`)
            this.dataAll = res.data;
        }
    },
    created() {
        this.loadData()
    },
}
</script>

<style lang="scss">
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
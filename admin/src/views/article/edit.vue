<template>
    <div class="edit">
        <h1>标题</h1>

        <section>
            <h2>标题</h2>
            <input type="text" v-model="dataAll.title" placeholder="标题">
        </section>

        <mavon-editor @change="change" ref="md" style="min-height: 70vh"/>

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
        change(){

        },
        submit(){
            this.$http.post('updateArticle', this.data).then(res => {
                console.log(res)
            })
        }
    },
    created() {
        this.dataAll = this.$route.params;
        console.log(this.dataAll)
    },
    
}
</script>

<style lang="scss">

</style>
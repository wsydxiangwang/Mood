<template>
    <div class="article-new">
        <h1>标题</h1>

        <section>
            <h2>标题</h2>
            <input type="text" v-model="data.title" placeholder="标题">
        </section>

        <mavon-editor :ishljs="true" codeStyle="monokai-sublime" @change="change" ref="md" style="height: 70vh"/>

        <section>
            <date @getDate="getDate"></date>
        </section>

        <section>
            <h2>摘要</h2>
            <div class="intro">
                <input type="text" v-model="data.describe" placeholder="简介">
            </div>
        </section>

        <section>
            <h2>音乐</h2>
            <div class="picture">
                <input type="text" v-model="data.music" placeholder="音乐地址">
            </div>
        </section>

        <section>
            <h2>封面图</h2>
            <div class="picture">
                <input type="text" v-model="data.image" placeholder="图片链接">
            </div>
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
                title: '',              // 标题
                content: '',            // 内容
                contentHtml: '',        // 内容解析html
                time: {},               // 时间
                category: '',           // 分类
                image: '',              // 图片
                music: '',              // 音乐
            }
        }
    },
    methods: {
        change(value, render){
            this.data.contentHtml = render;     // 解析的html
            this.data.content = value;          // 输入的内容
            this.data.words = value.length;     // 字数
        },
        submit(){
            console.log(this.data.time)
            for(let key in this.data){
                if(this.data[key] == ''){
                    this.$delete(this.data, key)
                }
            }
            this.$http.post('article', this.data).then(res => {
                console.log(res)
                alert('成功')
            })
        },
        getDate(e){
            this.data.time = e;
        }
    }
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
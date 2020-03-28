<template>
    <div class="article-new">

        <section>
            <el-input
                placeholder="标题"
                v-model="data.title"
                clearable>
            </el-input>
        </section>

        <mavon-editor :ishljs="true" codeStyle="monokai-sublime" @change="change" ref="md" style="height: 70vh"/>

        <section>
            <date @getDate="getDate"></date>

            <div class="intro">
                <el-input
                    placeholder="文章摘要"
                    v-model="data.describe"
                    clearable>
                </el-input>
            </div>
            <div class="picture">
                <el-input
                    placeholder="音乐地址"
                    v-model="data.music"
                    clearable>
                </el-input>
            </div>
            <div class="picture">
                <el-input
                    placeholder="封面图片"
                    v-model="data.image"
                    clearable>
                </el-input>
            </div>
        </section>

        <el-button type="primary" @click="submit">提交</el-button>
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
            for(let key in this.data){
                if(this.data[key] == ''){
                    this.$delete(this.data, key)
                }
            }

            console.log(this.data)

            return;
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
<template>
    <div class="edit">
        <h1>标题</h1>

        <section>
            <h2>标题</h2>
            <input type="text" v-model="dataAll.title" placeholder="标题">
        </section>

        <mavon-editor :ishljs="true" codeStyle="monokai-sublime"  @change="change" v-model="isData" ref="md" style="height: 70vh"/>
        
        <section>
            <date v-if="isReset" @getDate="getDate" :originalDate="originalDate"></date>
        </section>

        <section>
            <h2>摘要</h2>
            <div class="intro">
                <input type="text" v-model="dataAll.describe" placeholder="简介">
            </div>
        </section>

        <section>
            <h2>音乐</h2>
            <div class="picture">
                <input type="text" v-model="dataAll.music" placeholder="音乐地址">
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
            dataAll: '',
            originalDate: '',
            isReset: true
        }
    },
    computed: {
        isData: {
            get(){
                if(this.dataAll){
                    return this.dataAll.content
                }else{
                    return ''
                }
            },
            set(v){}
        }
    },
    methods: {
        change(value, render){
            this.dataAll.content = value;     // render 为 markdown 解析后的结果[html]
            this.dataAll.contentHtml = render;     // render 为 markdown 解析后的结果[html]
        },
        // 提交更新文章
        async submit(){            
            this.dataAll.time = this.originalDate;
            const res = await this.$http.put(`article/${this.dataAll._id}`, this.dataAll)
            if(res.data.status == 1){
                alert('1')
            }else{
                alert('2')
            }
        },
        // 获取当前文章的数据
        async loadData(){
            let id = this.$route.query.id;
            const res = await this.$http.get(`article/${id}`)
            this.dataAll = res.data;
            this.originalDate = res.data.time;
            this.isReset = false;
            this.$nextTick(() => {
                this.isReset = true;
            })
        },
        getDate(e){
            console.log(e)
            this.originalDate = e;
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
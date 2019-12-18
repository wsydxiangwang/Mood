<template>
    <div class="phrase-new">
        <h1>标题</h1>

        <section>
            <h2>标题</h2>
            <input type="text" v-model="data.title" placeholder="标题">
        </section>

        <mavon-editor @change="change" ref="md" style="min-height: 70vh"/>

        <section>
            <div class="state">
                <div>时间</div>
                <input type="text" v-model="data.time">
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
                <input type="text" v-model="data.describe" placeholder="简介">
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
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        mavonEditor
    },
    data() {
        return {
            data: {
                title: '',              // 标题
                content: '',            // 内容
                describe: '',           // 描述
                time: '',               // 时间
                stick: false,           // 置顶
                category: '',           // 分类
                image: '',              // 封面图
            }
        }
    },
    created() {
        this.data.time = this.dateFormat('YYYY-MM-DD HH:mm')
    },
    methods: {
        change(value, render){
            this.data.content = render;     // render 为 markdown 解析后的结果[html]
        },
        submit(){
            console.log(this.data)
            // const res = await this.$http.post('NewArticle', this.data)
            this.$http.post('NewArticle', this.data).then(res => {
                console.log(res)
            })
        },
        dateFormat(fmt){
            let date = new Date();
            let opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "M+": (date.getMonth() + 1).toString(),     // 月
            "D+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "m+": date.getMinutes().toString(),         // 分
            "s+": date.getSeconds().toString()          // 秒
            };
            for(let k in opt) {
                let ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
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
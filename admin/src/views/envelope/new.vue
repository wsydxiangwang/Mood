<template>
    <div class="content">
        
        <mavon-editor @change="change" ref="md" style="height: 60vh"/>

        <date></date>

        <button class="submit" @click="submit">提交</button>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import date from '@/components/date'
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
            }
        }
    },
    created() {
        this.data.time = this.dateFormat('YYYY-MM-DD HH:mm')
    },
    methods: {
        change(value, render){
            this.data.contentHtml = render;     // render 为 markdown 解析后的结果[html]
            this.data.content = value;          // 输入的内容
        },
        submit(){
            console.log(this.data)

            return;

            this.$http.post('/phrase', this.data).then(res => {
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
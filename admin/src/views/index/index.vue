<template>
    <div>
        <h4>原本这个世界就有很多东西是并没有什么意义</h4>

        <section>
            重新认识一下自己吧，你觉得你是个怎样的人
        </section>

        <section>
            <template v-if="$data.article">
                文章数量: {{$data.articleQty}}
                <br>
                {{dateDiff($data.article.time)}} 发布了新文章

            </template>
            <template v-else>
                快来写文章啦
            </template>
        </section>

        <section>
            字里行间
            
        </section>

        <section>
            过故人庄
            收获了多少评论 {{$data.commentQty}}
        </section>
        <section class="book">
            三味书屋
            <div class="book-list">
                <span>
                    <img src="https://lh3.googleusercontent.com/proxy/KCeCEuhH_XxQMcSd_gZynUS2puAEy1Sef0qf9Dkss17w4kk86gnABb5tk2i5dttBOD1y592aM6qXzaA-YSOL-FiI_uFyx4LfLtRjTM3QlRv1N8AnJ3O79A" alt="">
                </span>
                <span>
                    <img src="https://lh3.googleusercontent.com/proxy/KCeCEuhH_XxQMcSd_gZynUS2puAEy1Sef0qf9Dkss17w4kk86gnABb5tk2i5dttBOD1y592aM6qXzaA-YSOL-FiI_uFyx4LfLtRjTM3QlRv1N8AnJ3O79A" alt="">
                </span>
                <span>
                    <img src="https://lh3.googleusercontent.com/proxy/KCeCEuhH_XxQMcSd_gZynUS2puAEy1Sef0qf9Dkss17w4kk86gnABb5tk2i5dttBOD1y592aM6qXzaA-YSOL-FiI_uFyx4LfLtRjTM3QlRv1N8AnJ3O79A" alt="">
                </span>
                <span>
                    <img src="https://lh3.googleusercontent.com/proxy/KCeCEuhH_XxQMcSd_gZynUS2puAEy1Sef0qf9Dkss17w4kk86gnABb5tk2i5dttBOD1y592aM6qXzaA-YSOL-FiI_uFyx4LfLtRjTM3QlRv1N8AnJ3O79A" alt="">
                </span>
                <span>
                    <img src="https://lh3.googleusercontent.com/proxy/KCeCEuhH_XxQMcSd_gZynUS2puAEy1Sef0qf9Dkss17w4kk86gnABb5tk2i5dttBOD1y592aM6qXzaA-YSOL-FiI_uFyx4LfLtRjTM3QlRv1N8AnJ3O79A" alt="">
                </span>
            </div>
        </section>
    </div>
</template>

<script>
import sidebar from "@/components/sidebar"
import { mapState } from 'vuex'
export default {
	components: {
		sidebar
	},
    computed: {
        ...mapState(['$data'])
    },
    mounted(){
        console.log(this.$data)
    },
    methods: {
        dateDiff(time) {
            const timestemp = new Date(time).getTime();
 
            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const halfamonth = day * 15;
            const month = day * 30;
            const now = new Date().getTime();
            const diffValue = now - timestemp;

            // 如果本地时间反而小于变量时间
            if (diffValue < 0) {
                return 'Just Now';
            }

            // 计算差异时间的量级
            const monthC = diffValue / month;
            const weekC = diffValue / (7 * day);
            const dayC = diffValue / day;
            const hourC = diffValue / hour;
            const minC = diffValue / minute;

            const map = {
                [monthC]: "月",
                [weekC]: "周",
                [dayC]: "天",
                [hourC]: "小时",
                [minC]: "分钟",
            }
            for(let i in map){
                if(i >= 1){
                    return `${parseInt(i)}${map[i]}前`
                }
            }
            return '片刻之前';        
        }
    }
}
</script>

<style lang="scss" scoped>
section{
    width: 300px;
    display: inline-block;
    height: 300px;
    box-shadow: 0 2px 20px #eee;
    border-radius: 8px;
    margin: 10px;
    background: #fff;
    padding: 10px;
}
.book{
    .book-list{
        span{
            width: 50px;
            height: 50px;
            display: inline-block;
            border-radius: 4px;
            margin-right: 6px;
            border: 2px solid #c5e3ff;
            transition: all .3s;
            cursor: pointer;
            img{
                width: 100%;
                border-radius: 2px;
            }
        }
    }
}
.main{
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .content{
        width: 100%;
        height: 100vh;
        overflow: auto;
        padding: 20px;
    }
}
</style>
<template>
    <div>
        <h4>原本这个世界就有很多东西是并没有什么意义</h4>
        <section>
            重新认识一下自己吧，你觉得你是个怎样的人
        </section>
        <section>
            已发布文章20篇，距上一次发表文章已超过20天了，赶紧来发表新文章吧
        </section>
        <section>
            字里行间
        </section>
        <section>
            过故人庄
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
import sidebar from "@/components/sidebar";
export default {
	components: {
		sidebar
	},
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
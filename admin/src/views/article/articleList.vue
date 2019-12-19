<template>
    <div class="article">
        <div class="header">
            <h1>文章列表</h1>
            <div class="info">
                <div>全部(2)</div>
                <div>全部(2)</div>
                <div>全部(2)</div>
                <div>全部(2)</div>
            </div>
        </div>
        <table class="article-list">
            <thead>
                <tr>
                    <td>标题</td>
                    <td>分类</td>
                    <td>评论</td>
                    <td>日期</td>
                    <td>操作</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in articleList">
                    <td class="title">{{item.title}}</td>
                    <td class="classify">{{item.classify}}</td>
                    <td class="comment">{{item.comment}}</td>
                    <td class="date">{{item.time}}</td>
                    <td @click="edit(item)" class="edit">编辑</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            articleList: []
        }
    },
    created(){
        this.fetch()
    },
    methods: {
        async fetch(){
            const res = await this.$http.get('article');
            this.articleList = res.data;
        },
        edit(item){
            this.$router.push({
                path: `article/edit/${item}`,
                name: 'edit',
                params: item
            })
        }
    }
}
</script>

<style lang="scss">
.article{
    box-shadow: 0 0 10px #eee;
    padding: 20px;
    .header{
        h1{
            font-size: 20px;
        }
        .info{
            display: flex;
            margin: 15px 0;
            div{
                margin-right: 10px;
            }
        }
    }
    .article-list{
        width: 100%;
        thead tr{
            height: 40px;
        }
        tbody{
            tr{
                height: 50px;
            }
            .edit{
                color: red;
                cursor: pointer;
            }
        }
    }
}
</style>
<template>
    <div class="phrase">
        <div class="header">
            <h1>短语列表</h1>
            <div class="info">
                <div>全部(2)</div>
                <div>全部(2)</div>
                <div>全部(2)</div>
                <div>全部(2)</div>
            </div>
        </div>
        <table class="phrase-list">
            <thead>
                <tr>
                    <td>标题</td>
                    <td>分类</td>
                    <td>评论</td>
                    <td>日期</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in phraseList">
                    <td class="title">{{item.title}}</td>
                    <td class="classify">{{item.classify}}</td>
                    <td class="comment">{{item.comment}}</td>
                    <td class="date">{{item.date}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            phraseList: [
                {
                    title: '放宽心，坚持住，一切都是最好的安排！！',
                    classify: '心情小镇',
                    comment: '21',
                    date: '2019/12/12'
                },
                {
                    title: '放宽心，坚持住，一切都是最好的安排！！',
                    classify: '心情小镇',
                    comment: '21',
                    date: '2019/12/12'
                }
            ]
        }
    }
}
</script>

<style lang="scss">
.phrase{
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
    .phrase-list{
        width: 100%;
        thead tr{
            height: 40px;
        }
        tbody{
            tr{
                height: 50px;
            }
        }
    }
}
</style>
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
                    <td>日期</td>
                    <td>操作</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in phraseList">
                    <td class="title">{{item.title}}</td>
                    <td class="date">{{item.date}}</td>
                    <td>
                        <span @click="edit(item)">编辑</span>
                        <span @click="remove(item)">删除</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            phraseList: []
        }
    },
    created(){
        this.fetch();
    },
    methods: {
        async fetch(){
            const res = await this.$http.get('/envelope');
            this.phraseList = res.data;
        },
        async remove(item){
            const res = await this.$http.delete(`/envelope/${item._id}`);
            this.fetch()
        },
        edit(item){
            this.$router.push({
                path: `/envelope/edit/${item}`,
                name: 'phraseEdit',
                params: item
            })
        },
    }
}
</script>

<style lang="scss" scoped>
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
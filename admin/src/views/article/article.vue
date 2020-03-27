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
        
        <el-table :data="articleList" style="width: 100%">
            <el-table-column label="Name">
                <template slot-scope="scope">
                    <p>{{scope.row.title}}</p>
                </template>
            </el-table-column>
            <el-table-column label="Date">
                <template slot-scope="scope">
                    <span>{{scope.row.time.year}}-{{scope.row.time.monthNum}}-{{scope.row.time.day}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="edit(scope.row.id)">Edit</el-button>
                    <el-button size="mini" type="danger" @click="remove(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
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
        this.loadData()
    },
    methods: {
        async loadData(){
            const res = await this.$http.get('article');
            if(res.data){
                this.articleList = res.data;
            }
        },
        edit(id){
            this.$router.push({
                name: 'articleEdit',
                query: {
                    id: id
                }
            })
        },
        remove(item){
            this.$confirm('删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`article/${item._id}`).then(res => {
                    this.loadData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            
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
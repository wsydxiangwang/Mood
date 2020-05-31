<template>
    <div class="article">
        <div class="header">
            <h1>文章列表</h1>
        </div>
        
        <el-table :data="articleList" style="width: 100%">
            <el-table-column label="Title">
                <template slot-scope="scope">
                    <p>{{scope.row.title}}</p>
                </template>
            </el-table-column>
            <el-table-column label="Date" :width="Width" class="hidden">
                <template slot-scope="scope">
                    <span>{{(scope.row.time).slice(0, 10)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="options" :width="Width">
                <template slot-scope="scope">
                    <i class="el-icon-edit" @click="edit(scope.row.id)"></i>
                    <i class="el-icon-delete" @click="remove(scope.row)"></i>
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
            articleList: [],
            Width: 180
        }
    },
    created(){
        this.loadData();
    },
    methods: {
        async loadData(){
            const res = await this.$http.get('article');
            if(res.data.status === 1){
                this.articleList = res.data.body;
            }
        },
        edit(id){
            this.$router.push({
                name: 'info',
                query: { id: id }
            })
        },
        remove(item){
            this.$confirm('删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`article/${item._id}`).then(res => {
                    setTimeout(() => {
                        this.loadData()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }, 1000)
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
    padding: 20px;
    .header{
        h1{
            border-left: 2px solid #0084ff;
            padding-left: 16px;
            font-size: 18px;
            font-weight: 400;
            margin: 20px 0 30px;
            color: #0084ff;
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
    .el-icon-edit, .el-icon-delete{
        display: none;
    }
}

@media screen and (max-width: 600px) {
    .article{
        padding: 0;
        box-shadow: none;
        .header h1{
            font-size: 16px;
            margin: 10px 0 20px;
        }
    }
    .el-table__header, .el-table__body{
        width: 100% !important;
        display: block;
        tbody{
            display: block;
        }
        thead{
            display: block;
            tr{
                display: flex;
                th{
                    padding: 6px 0;
                    &:nth-of-type(2){
                        display: none;
                    }
                    &:nth-of-type(1){
                        flex: 1;
                    }
                    &:nth-of-type(3){
                        width: 68px;
                        text-align: right;
                    }
                    .cell{
                        padding: 0;
                    }
                } 
            }
        }
        .el-table__row{
            display: flex;
            width: 100%;
            justify-content: space-between;
            td{
                &:nth-of-type(2){
                    display: none;
                }
                &:nth-of-type(1){
                    flex: 1;
                }
                &:nth-of-type(3){
                    width: 68px;
                    text-align: right;
                }
                div{
                    padding: 0;
                }
            }
            .el-button{
                display: none;
            } 
            .el-icon-edit, .el-icon-delete{
                display: inline-block;
                margin: 4px;
                color: #0084ff;
                font-size: 16px;
                &.el-icon-delete{
                    color: red;
                }
            }
        } 
    }
    
}
</style>
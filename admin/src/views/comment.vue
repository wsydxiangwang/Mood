<template>
    <div class="phrase">
        <div class="header">
            <h1>评论列表</h1>
        </div>

        <el-table :data="data" style="width: 100%">
            <el-table-column label="Title">
                <template slot-scope="scope">
                    <p>{{scope.row.content}}</p>
                </template>
            </el-table-column>
            <el-table-column label="Date" width=180>
                <template slot-scope="scope">
                    <span>{{scope.row.time.time}} {{scope.row.time.month.en}} {{scope.row.time.day.on}}, {{scope.row.time.year}}</span>
                </template>
            </el-table-column>
            <el-table-column label="options" width=180>
                <template slot-scope="scope">
                    <i class="el-icon-edit" @click="edit(scope.row._id)"></i>
                    <i class="el-icon-delete" @click="remove(scope.row)"></i>
                    <el-button size="mini" @click="edit(scope.row._id)">Edit</el-button>
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
            data: [],
        }
    },
    created(){
        this.load();
    },
    methods: {
        async load(){
            const res = await this.$http.get('/comment');
            this.data = res.data.body.data;
        },
        remove(item){
            this.$confirm('删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`envelope/${item._id}`).then(res => {
                    setTimeout(() => {
                        this.load()
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
        },
        edit(id){
            this.$router.push({
                name: 'envelopeInfo',
                query: { id: id }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.phrase{
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
    .el-icon-edit, .el-icon-delete{
        display: none;
    }
}
@media screen and (max-width: 600px) {
    .phrase{
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
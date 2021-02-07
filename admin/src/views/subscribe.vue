<template>
    <div class="phrase">
        <h2 class="tit">订阅用户 ({{ total }})</h2>

        <el-table :data="data" style="width: 100%"  height="calc(800px - 240px)">
            
            <el-table-column label="Title">
                <template slot-scope="scope">
                    <p>{{ scope.row.email }}</p>
                </template>
            </el-table-column>

            <el-table-column label="Date" width=140>
                <template slot-scope="scope">
                    <span>{{ $getDate(scope.row.time) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Status" width=140>
                <template slot-scope="scope">
                    <span style="color:#ff7b7b">{{ scope.row.active }}</span>
                </template>
            </el-table-column>

            <el-table-column label="options" width=100>
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="Delete" placement="top">
                        <i class="el-icon-delete" @click="remove(scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <Pagination :data="total" :page="page" @update="load" />

    </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
    components: { 
        Pagination
    },
    data() {
        return {
            data: [],
            total: 0,
            page: 1,
        }
    },
    created(){
        this.load()
    },
    methods: {
        load(page){
            this.$request(() => this.$http.get('/subscribe', {
                params: { page }
            }).then(res => {
                ['data', 'total', 'page'].map(i => this[i] = res.data.body[i])
            }))
        },
        remove(item){
            this.$confirm('删除订阅用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request(() => this.$http.delete(`subscribe/${item._id}`)
                    .then(res => {
                        this.$message.success('删除成功!')
                        this.load()
                    })
                )
            }).catch(() => {
                this.$message('已取消删除')
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.phrase{
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
    i[class*=el-icon-]{
        cursor: pointer;
        margin: 2px;
        padding: 2px;
        font-size: 14px;
        color: #cfcfcf;
        transition: all .2s;
        &:hover{
            color: #0e8bff;
        }
        &.el-icon-delete:hover{
            color: red;
        }
    }
    ::v-deep .el-table__body-wrapper{
        &::-webkit-scrollbar-track {
            background: #fff;
        }
        &::-webkit-scrollbar-thumb {
            background: #eef7ff;
        }
        &::-webkit-scrollbar {
            width: 6px;
        }
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
     ::v-deep .el-table__header{
        width: 100% !important;
        display: block;
        thead{
            display: block;
            tr{
                display: flex;
                th{
                    padding: 6px 0;
                    &:nth-of-type(2){
                        width: 100px;
                        text-align: center;
                    }
                    &:nth-of-type(1){
                        flex: 1;
                    }
                    &:nth-of-type(3){
                        width: 68px;
                        text-align: center;
                    }
                    &:nth-of-type(4){
                        width: 48px;
                        text-align: right;
                    }
                    .cell{
                        padding: 0;
                    }
                } 
            }
        }
    }
    ::v-deep .el-table__body{
        width: 100% !important;
        display: block;
        tbody{
            display: block;
        }
        .el-table__row{
            display: flex;
            width: 100%;
            justify-content: space-between;
            td{
                &:nth-of-type(2){
                    width: 100px;
                    text-align: center;
                }
                &:nth-of-type(1){
                    flex: 1;
                }
                &:nth-of-type(3){
                    width: 68px;
                    text-align: center;
                }
                &:nth-of-type(4){
                    width: 48px;
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
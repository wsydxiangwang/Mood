<template>
    <div class="phrase">
        <h2 class="tit">
            短语列表 ({{ data.length }})
            <span @click="newEnvelope" class="add"><span class="el-icon-plus"></span> 新短语</span>    
        </h2>

        <el-table :data="data" style="width: 100%"  height="calc(800px - 240px)">
            
            <el-table-column label="Title">
                <template slot-scope="scope">
                    <p>{{ scope.row.content }}</p>
                </template>
            </el-table-column>

            <el-table-column label="Date" width=140>
                <template slot-scope="scope">
                    <span>{{ $getDate(scope.row.time) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="options" width=100>
                <template slot-scope="scope">
                    <el-tooltip 
                        effect="dark" 
                        content="Edit"
                        placement="top"
                        v-for="(item, index) in list"
                        :key="index"
                    >
                        <i :class="index.icon" @click="option(scope.row, index)"></i>
                    </el-tooltip>
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
            list: [
                {
                    type: '',
                    icon: ''
                },
                {
                    type: '',
                    icon: ''
                }
            ]
        }
    },
    created(){
        this.load();
    },
    methods: {
        option(data, index) {
            const o = {
                0: () => {

                }
            }            
        },
        newEnvelope() {
            this.$router.push('/envelope/info')
        },
        load(){
            this.$request(() => this.$http.get('/envelope').then(res => {
                this.data = res.data.body
            }))
        },
        remove(item){
            this.$confirm('删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`envelope/${item._id}`).then(res => {
                    this.load()
                    this.$message.success('删除成功!')
                    this.$infoUpdate() // 刷新状态
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
                query: { id }
            })
        },
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
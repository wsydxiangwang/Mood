<template>
    <div class="article">
        <h2 class="tit">文章列表 ({{ total }})</h2>
        
        <el-table :data="data">
            <el-table-column label="Title">
                <template slot-scope="scope">
                    <p>{{ scope.row.title }}</p>
                </template>
            </el-table-column>
            <el-table-column label="Date" width=140 class="hidden">
                <template slot-scope="scope">
                    <span>{{ $getDate(scope.row.time) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="options" width=100>
                <template slot-scope="scope">
                    <el-tooltip 
                        class="item" 
                        effect="dark" 
                        :content="item.text" 
                        placement="top"
                        v-for="(item, index) in options"
                        :key="index"
                    >
                        <i :class="item.icon" @click="option(scope.row, index)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <Pagination 
            :data="total"
            :page="page"
            @update="load" 
        />
    </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
    components: { 
        Pagination
    },
    data() {
        return {
            data: [],
            total: 0,
            page: 1,
            options: [
                {
                    icon: 'el-icon-view',
                    text: 'View Article'
                },
                {
                    icon: 'el-icon-edit',
                    text: 'Edit Article'
                },
                {
                    icon: 'el-icon-delete',
                    text: 'Delete'
                }
            ]
        }
    },
    created(){
        this.load()
    },
    methods: {
        load(page){
            /**
             * vuex 存在当前页数据
             */
            const article = this.$store.state.article;
            if (article[page]) {
                this.data = article[page];
                return
            }

            this.$request(() => this.$http.get('/article', {
                    params: { page }
                }).then(res => {
                    const data = res.data.body;
                    /**
                     * 当前页面数据
                     * 添加数据到vuex，优化请求
                     */
                    ['data', 'total', 'page'].map(i => this[i] = data[i])
                    this.$store.commit('setCache', {
                        type: 'article',
                        page: page || 1,
                        data: this.data,
                        total: this.total
                    })
                }))
        },
        option(data, index) {
            const o = {
                0: () => {
                    window.open(`${window.location.origin}/${data.id}`)
                },
                1: () => {
                    this.$router.push({ 
                        name: 'info', 
                        query: { 
                            id: data.id 
                        }
                    })
                },
                2: () => {
                    this.$confirm('删除该文章, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$request(() => this.$http.delete(`article/${data._id}`)
                            .then(res => {
                                this.$store.commit('resetCache', 'article')
                                this.load()
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            }))
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
                }
            }
            o[index]()
        }
    }
}
</script>

<style lang="scss" scoped>
.article{
    height: 100%;
    display: flex;
    flex-direction: column;
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
    ::v-deep 
        .el-table__body-wrapper{
            height: calc(100% - 80px);
            overflow: auto;
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
    .article{
        padding: 0;
        box-shadow: none;
        .header h1{
            font-size: 16px;
            margin: 10px 0 20px;
        }
    }
    ::v-deep .el-table__body-wrapper{
        height: calc(100vh - 212px) !important;
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
        } 
    }
    
}
</style>
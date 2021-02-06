<template>
    <div class="comment">
        <div class="header">
            <h1>
                评论列表 ({{ total }}) 
                <span @click="onRead" class="read-btn" v-if="unread">
                    <i class="el-icon-refresh"></i>
                    一键已读 ({{ unread }})
                </span>
            </h1>
        </div>
        <el-table :data="data">
            <el-table-column label="Name" width=140>
                <p slot-scope="scope">
                    <span v-if="scope.row.status == 1" class="read">1</span> {{ scope.row.name }}
                </p>
            </el-table-column>
            <el-table-column label="Content">
                <p slot-scope="scope">{{ scope.row.content }}</p>
            </el-table-column>
            <el-table-column label="Date" width=130>
                <span slot-scope="scope">
                    {{ $getDate(scope.row.time) }}
                </span>
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
        <Comment 
            :message="replyData" 
            @Load="load" 
            ref="comment"
        ></Comment>
    </div>
</template>

<script>
import Comment from '@/components/Comment'
import Pagination from '@/components/Pagination'
export default {
    components: { 
        Comment,
        Pagination
    },
    data() {
        return {
            data: [],
            total: 0,
            page: 1,
            replyData: '',
            options: [
                {
                    icon: 'el-icon-view',
                    text: 'View Article'
                },
                {
                    icon: 'el-icon-chat-line-round',
                    text: 'Reply'
                },
                {
                    icon: 'el-icon-delete',
                    text: 'Delete'
                }
            ]
        }
    },
    computed: {
        unread() {
            return this.$store.state.$data.unread
        }
    },
    created(){
        this.load()
    },
    methods: {
        load(page) {
            this.$request(() => this.$http.get('/comment', {
                    params: { page }
                }).then(res => {
                    ['data', 'total', 'page'].map(i => this[i] = res.data.body[i])
                })
            )  
        },
        option(data, index) {
            const o = {
                0: () => {
                    window.open(`${window.location.origin}/${data.topic_id}`)
                },
                1: () => {
                    this.replyData = data
                    this.$refs.comment.close()
                },
                2: () => {
                    const message = data.parent_id ? '删除该评论, 是否继续?' : '当前为一级评论, 会连同子评论一块删除哦~'
                    this.$confirm(message, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$request(() => this.$http.delete(`/comment`, { 
                            params: {
                                id: data.id,
                                parent_id: data.parent_id
                            }
                        }).then(res => {
                            if (res.data.status === 1) {
                                this.load()
                                this.$message.success('删除成功!')
                            } else {
                                this.$message.error(res.data.body.message)
                            }
                        }))
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            }
            o[index]()
        },
        onRead() {
            this.$http.post(`comment_read`).then(res => {
                if (res.data.status === 1) {
                    this.load()
                    this.$store.commit('updateUnread')
                } else {
                    this.$message.error(res.data.body.message)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.content{
    position: relative;
}
.comment{
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
            .read-btn{
                float: right;
                cursor: pointer;
                color: #ff9797;
                i{
                    color: #ff9797;
                }
                &:hover, &:hover i{
                    color:red
                }
            }
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
    .read{
        background: #ff5656;
        color: #fff;
        font-size: 12px;
        border-radius: 50%;
        height: 14px;
        width: 14px;
        display: inline-block;
        text-align: center;
        line-height: 15px;
    }
    ::v-deep .el-table{
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
                height: 6px;
            }
        }
    }
    //  height="calc(800px - 240px)"
}
@media screen and (max-width: 600px) {
    .comment{
        padding: 0;
        box-shadow: none;
        i[class*=el-icon-]{
            display: block;
            text-align: right;
        }
        .el-pagination{
            bottom: 5px !important;
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
                        &:nth-of-type(1){
                            // display: none;
                            width: 100px;
                        }
                        &:nth-of-type(2){
                            flex: 1;
                            display: block;
                        }
                        &:nth-of-type(3){
                            display: none;
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
                tr{
                    display: flex;
                    align-items: center;
                    transition: all .3s;
                    border-bottom: 1px solid #ebeef5;
                    &:hover{
                        background: #F5F7FA;
                        td{
                            background: none;
                        }
                    }
                    td{
                        border: none;
                        &:nth-of-type(1){
                            // display: none;
                            width: 100px;
                        }
                        &:nth-of-type(2){
                            flex: 1;
                            display: block;
                        }
                        &:nth-of-type(3){
                            display: none;
                        }
                        &:nth-of-type(4){
                            width: 46px;
                        }
                    }
                } 
            } 
        }
    }
}
</style>
<template>
    <div class="comment">
        <div class="header">
            <h1>
                评论列表 ({{total}}) 
                <span @click="onRead" class="read-btn" v-if="$data.unread">
                    <i class="el-icon-refresh"></i>
                    一键已读
                </span>
            </h1>
        </div>
        <el-table :data="data" style="width: 100%;" height="calc(100vh - 340px)">
            <el-table-column label="Name" width=140>
                <template slot-scope="scope">
                    <p><span v-if="scope.row.status == 1" class="read">1</span> {{scope.row.name}}</p>
                </template>
            </el-table-column>
            <el-table-column label="Content">
                <template slot-scope="scope">
                    <p>{{scope.row.content}}</p>
                </template>
            </el-table-column>
            <el-table-column label="Date" width=130>
                <template slot-scope="scope">
                    <span>{{scope.row.time.time}} {{scope.row.time.month.en}} {{scope.row.time.day.on}}</span>
                </template>
            </el-table-column>
            <el-table-column label="options" width=100>
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="View Article" placement="top">
                        <i class="el-icon-view" @click="view(scope.row.topic_id)"></i>
                    </el-tooltip>
                    
                    <el-tooltip class="item" effect="dark" content="Reply" placement="top">
                        <i class="el-icon-chat-line-round" @click="reply(scope.row)"></i>
                    </el-tooltip>
                    <i class="el-icon-delete" @click="remove(scope.row)"></i>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            :page-size="count"
            :pager-count="11"
            :total="total"
            :current-page="page"
            @current-change="load"
            layout="prev, pager, next"
        >
        </el-pagination>

        <Comment :message="replyData" @Load="resetLoad" ref="comment"></Comment>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Comment from '@/components/comment'
export default {
    components: { Comment },
    data() {
        return {
            data: [],
            total: 0,
            count: 10,
            page: 1,
            replyData: ''
        }
    },
    created(){
        this.load();
    },
    watch: {
        $page_size(val){
            this.count = val
            this.load();
        }
    },
    computed: {
        ...mapState(['$data']),
        $page_size(){
            return Object.keys(this.$data).length > 0 ? this.$data.info.page_size : 10
        }
    },
    methods: {
        // 回复
        reply(data){
            this.replyData = data;
            this.$refs.comment.close();
        },
        load(page){
            /**
             * vuex 存在当前页数据
             */
            const comment = this.$store.state.comment;
            if(comment[page]){
                this.data = comment[page];
                return
            }
            
            this.$http.get('/comment', {
                params: {
                    page, 
                    count: this.count
                }
            }).then(res => {
                const data = res.data.body;
                const item = ['data', 'total', 'page']

                item.map(i => this[i] = data[i])
                /**
                 * 添加数据到vuex，请求优化
                 */
                this.$store.commit('setCache', {
                    type: 'comment',
                    page: page || 1,
                    data: this.data,
                    total: this.total
                })
            })
        },
        resetLoad(){
            this.$store.commit('resetCache', 'comment')
            this.load()
        },
        // 新窗口打开文章
        view(id){
            window.open(`${window.location.host}/${id}`)
        },
        remove(item){
           
            const message = item.parent_id ? '删除该评论, 是否继续?' : '当前为一级评论, 会连同子评论一块删除哦~'

            this.$confirm(message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const data = {
                    id: item.id,
                    parent_id: item.parent_id
                }
                this.$http.delete(`/comment`, { data }).then(res => {
                    if(res.data.status === 1){
                        setTimeout(() => {
                            this.$store.commit('resetCache', 'comment')
                            this.load()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.$infoUpdate() // 刷新状态
                        }, 1000)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 一键已读
        onRead(){
            this.$http.post(`comment_read`).then(res => {
                this.load()
                this.$store.commit('updateUnread')
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
}
</style>
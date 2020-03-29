<template>
    <div class="phrase" v-loading.fullscreen.lock="loading">
        <div class="header">
            <h1>短语列表</h1>
        </div>

        <el-table :data="phraseList" style="width: 100%">
            <el-table-column label="Content">
                <template slot-scope="scope">
                    <p>{{scope.row.content}}</p>
                </template>
            </el-table-column>
            <el-table-column label="Date">
                <template slot-scope="scope">
                    <span>{{scope.row.time.year}}-{{scope.row.time.month}}-{{scope.row.time.day}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
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
            phraseList: [],
            loading: false
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
        remove(item){
            this.$confirm('删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$http.delete(`envelope/${item._id}`).then(res => {
                    setTimeout(() => {
                        this.fetch()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.loading = false;
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
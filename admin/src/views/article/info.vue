<template>
    <div class="article-new" v-loading.fullscreen.lock="fullscreenLoading">

        <section>
            <h2>无人问津的心情，在黑纸白字间游荡！</h2>
            <el-input
                placeholder="标题"
                v-model="data.title"
                clearable>
            </el-input>
        </section>

        <mavon-editor 
            :ishljs="true" 
            @change="change" 
            v-model="data.content" 
            ref="md" 
            :subfield="false"
        />

        <section>
            <date @getDate="getDate" :originalDate="data.time" v-if="isReset"></date>
            <el-input
                placeholder="文章摘要"
                v-model="data.describe"
                clearable>
            </el-input>
            <el-input
                placeholder="音乐地址"
                v-model="data.music"
                clearable>
            </el-input>
            <el-input
                placeholder="封面图片"
                v-model="data.image"
                clearable>
            </el-input>
        </section>

        <el-button type="primary" class="submit" @click="submit">SUBMIT</el-button>
    </div>
</template>

<script>
import date from '@/components/date'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        date,
        mavonEditor
    },
    data() {
        return {
            data: {
                title: '',              // 标题
                content: '',            // 内容
                contentHtml: '',        // 内容解析html
                time: {},               // 时间
                category: '',           // 分类
                image: '',              // 图片
                music: '',              // 音乐
            },
            fullscreenLoading: false,
            isReset: true,
            id: ''                      // 当前文章id（编辑）
        }
    },
    methods: {
        change(value, render){
            this.data.contentHtml = render;     // 解析的html
            this.data.content = value;          // 输入的内容
            this.data.words = value.length;     // 字数
        },
        submit(){
            // 时间
            if(!this.data.time || JSON.stringify(this.data.time) == '{}'){
                this.$message.error('请选择时间');
                return;
            }
            for(let key in this.data){
                if(this.data[key] == ''){
                    this.$delete(this.data, key)
                }
            }

            this.fullscreenLoading = true;
            
            if(this.id){
                this.$http.put(`article/${this.data._id}`, this.data).then(res => {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        if(res.data.status == 1){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$router.push('/article')
                        }else{
                            this.$message.error('修改失败，请重新提交');
                        }
                    }, 1000)
                })
            }else{
                this.$http.post('article', this.data).then(res => {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            message: '发表成功',
                            type: 'success'
                        });
                        this.$router.push('/article')
                    }, 1000)
                })
            }
        },
        // 获取时间
        getDate(e){
            this.data.time = e;
        },
        // 获取当前文章的数据
        async loadData(id){
            const res = await this.$http.get(`article/${id}`)
            this.data = res.data;
            this.isReset = false;
            this.$nextTick(() => {
                this.isReset = true;
            })
        },
    },
    created(){
        this.id = this.$route.query.id;
        if(this.id) this.loadData(this.id);
    }
}
</script>

<style lang="scss" scoped>
section{
    margin: 15px 0;
    .el-input{
        width: 100%;
        height: 38px;
        margin: 5px 0;
        /deep/ input{
            border-color: #eee !important;
        }
    }
}
.markdown-body{
    height: 70vh;
    box-shadow: none !important;
    border: 1px solid #eee !important;
}
.submit{
    width: 200px;
    height: 40px;
    font-size: 14px;
    color: #fff;
}
h2{
    margin: 10px 0 15px;
    font-size: 16px;
    color: #606060;
}

@media screen and (max-width: 600px) {
    .markdown-body{
        height: 100vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 0;
    }
}
</style>
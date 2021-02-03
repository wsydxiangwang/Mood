<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        
        <h2 class="tit">无人问津的心情，在黑纸白字间游荡！</h2>

        <mavon-editor 
            v-model="data.content" 
            ref="markdown" 
            style="height: 60vh" 
            :subfield="false"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
        />

        <section>
            <Date @getDate="getDate" :originalDate="data.time" v-if="isReset" />
        </section>

        <el-button class="submit" type="primary" @click="submit">SUBMIT</el-button>
    </div>
</template>

<script>
import Date from '@/components/Date'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        Date,
        mavonEditor
    },
    data() {
        return {
            data: {
                content: '',            // 内容
                contentHtml: '',        // 内容解析html
                time: '',               // 时间
            },
            id: null,
            isReset: true,
            fullscreenLoading: false,
            markdownImage: [],
            loading: ''
        }
    },
    created(){
        this.id = this.$route.query.id;
        if(this.id) this.loadData(this.id);
    },
    mounted(){
        this.$store.commit('setMenu', this.$route.path)
    },
    methods: {
        async loadData(id){
            this.loading = this.$loading({target: '.container'})
            
            let res = await this.$http.get(`envelope/${id}`)

            this.data = res.data
            this.isReset = false
            this.$nextTick(() => { this.isReset = true })
            this.loading.close()
        },
        getDate(time){
            this.data.time = time;
        },
        change(value, render){
            this.data.contentHtml = render;     // render 为 markdown 解析后的结果[html]
            this.data.content = value;          // 输入的内容
        },
        submit(){
            if(!this.data.content || !this.data.time){
                this.$message.error('请填写完整的信息');
                return;
            }

            this.fullscreenLoading = true;

            /**
             * 编辑或发布
             */
            const type = this.id ? `/envelope/${this.data._id}` : '/envelope';
            const mesg = this.id ? '修改成功' : '发布成功';

            this.$http.post(type, this.data).then(res => {
                setTimeout(() => {
                    this.$message({
                        message: mesg,
                        type: 'success'
                    });
                    this.$router.push('/envelope')
                    this.fullscreenLoading = false;
                    this.$infoUpdate() // 刷新状态
                }, 500)
            })
        }
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
        ::v-deep input{
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
@media screen and (max-width: 600px) {
    .markdown-body{
        height: 60vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 0 0 20px;
        line-height: 36px;
        padding: 0;
    }
}

</style>
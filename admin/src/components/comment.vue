<template>
    <div class="comment-form" :class="isShow?'active':''">
        <div class="content">
            <p>回复：{{message.name}}</p>
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="content">
            </el-input>
            <el-button type="primary" @click="submit">提交评论</el-button>
            <i class="el-icon-close" @click="close"></i>
        </div>
    </div>
</template>

<script>
export default {
    props: ['message'],
    data(){
        return{
            content: '',
            isShow: false
        }
    },
    methods: {
        submit(){
            if(!this.content){
                this.$message.error('请填写回复的内容');
                return;
            }
            const data = {
                name: 'Libai',
                email: '1915398623@qq.com',
                content: this.content,
                time: this.dateFormat(),
                image: 1,
                status: 2,
                topic_id: this.message.topic_id,
                reply_name: this.message.name,
                reply_email: this.message.email,
                parent_id: this.message.parent_id || this.message.id,
            }
            data.type = this.message.type == 1 ? 2 : 3;

            this.$http.post('comment', data).then(res => {
                if(res.data.status === 1){
                    this.$message({
                        message: '评论发表成功',
                        type: 'success'
                    });
                    this.$emit('Load')
                }
                this.close()
            }).catch(err => {
                this.$message.error('出错了，刷新重试一下');
                this.close()
            })
        },
        close(){
            this.content = ''
            this.isShow = !this.isShow
        },
        // 时间
        dateFormat(){
            const date = new Date();
            const opt = {
                "Y": date.getFullYear().toString(),        // 年
                "M": (date.getMonth() + 1).toString(),     // 月
                "D": date.getDate().toString(),            // 日
                "H": date.getHours().toString(),           // 时
                "m": date.getMinutes().toString(),         // 分
            }
            for(let i in opt){
                opt[i] = opt[i].length == 1 ? opt[i].padStart(2, "0") : opt[i]
            }
            const time = `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`
            return time
        }
    }
}
</script>>

<style lang="scss" scoped>
.comment-form{
    &::before{
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4);
        transition: all .6s;
        z-index: 9;
        opacity: 0;
        visibility: hidden;
    }
    .content{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        height: 260px;
        width: 500px;
        padding: 20px;
        background: white;
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        z-index: 10;
        opacity: 0;
        visibility: hidden;
        transition: all .4s;
        transform: translateY(20px);
    }
    p{
        color: #666;
        margin-bottom: 14px;
    }
    /deep/ textarea{
        height: 130px !important;
        padding: 12px !important;
    }
    button{
        margin-top: 15px;
    }
    .el-icon-close{
        position: absolute;
        right: 10px;
        top: 10px;
        color: #999;
        font-size: 13px;
        padding: 2px;
        cursor: pointer;
        &:hover{
            color: #409EFF;
        }
    }
    &.active{
        &::before{
            opacity: 1;
            visibility: visible;
        }
        .content{
            opacity: 1;
            visibility: visible;
            transform: translateY(-10px);
        }
    }
}

</style>
<template>
    <div class="comment-form" :class="isShow?'active':''">
        <div class="content">
            <div class="img"><img :src="$data.info ? $data.info.avatar : ''"></div>
            <p class="name">回复：{{message.name}}</p>
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="content">
            </el-input>
            <div class="bottom-btn">
                <el-button type="primary" @click="submit">提交评论</el-button>
                <p><span class="el-icon-phone-outline"></span> 文明用语, 弘扬中华文明传统美德</p>
            </div>
            <i class="el-icon-circle-close" @click="close"></i>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props: ['message'],
    data(){
        return{
            content: '',
            isShow: false,
        }
    },
    computed: {
        ...mapState(['$data'])
    },
    methods: {
        submit(){
            if(!this.content){
                this.$message.error('请填写回复的内容');
                return;
            }

            const data = {
                name: this.$data.info.email.name,
                email: this.$data.info.email.address,
                content: this.content,
                time: this.dateFormat(),
                image: 1,
                status: 2,
                topic_id: this.message.topic_id,
                reply_name: this.message.name,
                reply_email: this.message.email,
                parent_id: this.message.parent_id || this.message.id,
                admin: true
            }
            data.type = this.message.type == 1 ? 2 : 3;

            // 网站和管理员的信息
            const email = this.$data.info['email']
            email.web_name = this.$data.info['web_name']
            email.web_address = this.$data.info['address']

            this.$http.post('comment', {data, email}).then(res => {
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
        background: rgba(0,0,0,.65);
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
        height: 284px;
        width: 500px;
        padding: 16px 22px 0;
        background: white;
        border-radius: 8px 22px 22px;
        border: 1px solid #EBEEF5;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.35);
        z-index: 10;
        opacity: 0;
        visibility: hidden;
        transition: all .4s;
        transform: translateY(20px);
        .img{
            height: 80px;
            width: 80px;
            padding: 10px;
            background: #fff;
            border-radius: 40px;
            position: absolute;
            top: -30px;
            left: -1px;
            z-index: 99;
            overflow: hidden;
            img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
            }
        }
    }
    .name{
        color: #409eff;
        font-size: 16px;
        margin-bottom: 14px;
        padding-left: 64px;
    }
    /deep/ textarea{
        height: 150px !important;
        padding: 12px !important;
        background: #f1f1f1;
        border: none;
        border-radius: 10px;
        padding-left: 16px !important;
    }
    .bottom-btn{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 18px;
        button{
            border-radius: 20px;
            height: 38px;
            padding: 0 30px;
            line-height: 38px;
        }
        p{
            font-size: 12px;
            color: #ff8282;
        }
    }
    .el-icon-circle-close{
        position: absolute;
        right: 16px;
        top: 15px;
        color: #c7c7c7;
        font-size: 22px;
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

@media screen and (max-width: 600px) {
    .comment-form .content{
        max-width: 90%;
    }
}
</style>
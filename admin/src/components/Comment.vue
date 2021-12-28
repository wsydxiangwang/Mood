<template>
    <div class="comment-form" :class="showClass">
        <div class="content">
            <div class="img"><img :src="avatarURL"></div>
            <p class="name">回复：{{ message.name }}</p>
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
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
export default {
    name: 'Comment',
    props: ['message'],
    data(){
        return{
            content: '',
            isShow: false,
        }
    },
    computed: {
        info() {
            return this.$store.state.$data.info
        },
        showClass() {
            return this.isShow ? 'active' : ''
        },
        avatarURL() {
            return this.info ? this.info.base.admin_avatar : ''
        }
    },
    methods: {
        submit(){
            if (!this.content) {
                this.$message.error('请填写回复的内容');
                return;
            }

            const getAdminInfo = (name) => this.info.administrator[name]

            const data = {
                name: getAdminInfo('name'),
                email: getAdminInfo('email'),
                content: this.content,
                time: this.$dateFormat(),
                image: 1,
                status: 2,
                topic_id: this.message.topic_id,
                reply_name: this.message.name,
                reply_email: this.message.email,
                parent_id: this.message.parent_id || this.message.id,
                type: this.message.type == 1 ? 2 : 3,
                admin: true
            }

            // 网站和管理员的信息
            const email = {
                name: data.reply_name,
                email: data.reply_email,
                isEmail: getAdminInfo('comment'),
                url: `${this.info.base['address']}/${data.topic_id}`,
            }

            this.$request(() => this.$http.post('comment', { 
                    data, 
                    email 
                }).then(res => {
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
                }))
        },
        close(){
            this.content = ''
            this.isShow = !this.isShow
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
    ::v-deep textarea{
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
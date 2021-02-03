<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <div class="header">
            <h2 class="tit">网站信息</h2>
        </div>
        <el-form label-width="100px">
            <section
                v-for="(val, key, index) in formList"
                :key="index"
            >
                <h2 class="tit" v-if="key != 'cover'">{{ val.value }}</h2>
                <h2 class="tit hint-tit" v-else>
                    首屏效果 
                    <el-popover
                        placement="top"
                        width="300"
                        trigger="hover"
                    >
                        <p>遮罩颜色请选择与图片相对应的色彩</p>
                        <img src="../assets/cover.png">
                        <span slot="reference">(view)</span>
                    </el-popover>
                </h2>
                
                <template v-for="(v, k, i) in val">
                    <el-form-item 
                        v-if="k != 'value'"
                        :label="v"
                        :key="i" 
                    >
                        <template v-if="k == 'admin_avatar'">
                            <Upload 
                                class="avatar-uploader" 
                                :url="form[key][k]" 
                                name="avatar"
                                ref="upload"
                                @change="uploadChange"
                                icon="el-icon-user"
                            />
                        </template>

                        <template v-else-if="k == 'image'">
                            <Upload 
                                class="cover" 
                                name="cover"
                                ref="upload"
                                @change="uploadChange"
                                :url="form[key][k]" 
                            />
                            <span class="upload-image-size">(1920*1080)</span>
                        </template>

                        <template v-else-if="k == 'upload_type' || k == 'email_type'">
                            <el-radio-group v-model="form[key][k]">     
                                <el-radio 
                                    :label="item"
                                    v-for="(item, index) in type[k].list"
                                    :key="index"
                                ></el-radio>
                            </el-radio-group>
                            <!-- 阿里云 -->
                            <div v-if="form[key][k] == '阿里云'" class="oss-list">
                                <el-input 
                                    v-for="(val, key, idx) in type[k]['阿里云']"
                                    :key="idx"
                                    :placeholder="val"
                                    v-model="form['aliyun_oss'][key]"
                                    :class="{ red: key != 'domain' }"
                                ></el-input>
                            </div>
                        </template>

                        <template v-else-if="k == 'color'">
                            <el-color-picker v-model="form[key][k]" show-alpha></el-color-picker>
                        </template>

                        <template v-else-if="key == 'administrator' && (k == 'comment' || k == 'subscribe' || k == 'message')">
                            <el-switch v-model="form[key][k]"></el-switch>
                        </template>

                        <template v-else>
                            <el-popover
                                placement="top"
                                width="300"
                                trigger="hover"
                            >
                                <p>与邮箱一致的通行码, 在邮箱设置开启SMTP服务器可获取（邮件通知必填）</p>
                                <span class="email-pass" v-if="k == 'email_pass'" slot="reference">(view)</span>
                            </el-popover>
                            <el-input v-model="form[key][k]"></el-input>
                        </template>
                    </el-form-item>
                </template>            
            </section>

            <el-form-item>
                <el-button class="submit" type="primary" @click="onSubmit">立即保存</el-button>
                <span class="hint"><i class="el-icon-warning"></i>信息需填写完整才能正常使用</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Upload from '@/components/Upload'
export default {
    components: {
        Upload
    },
    data() {
        return {
            formList: {
                'base': {
                    admin_avatar: '管理员头像',
                    admin_name: '管理员昵称',
                    name: '网站名字',
                    address: '网站域名',
                    describe: '网站描述',
                    seo: 'SEO关键词',
                    upload_type: '文件上传',
                    email_type: '邮箱类型',
                    email_pass: '邮箱PASS'
                },
                'administrator': {
                    value: '前台管理',
                    email: '邮箱',
                    name: '昵称',
                    mark: '标识',
                    code: '验证',
                    comment: '评论通知',
                    subscribe: '订阅通知',
                    message: '留言页面'
                },
                'cover': {
                    value: '首屏效果',
                    image: '图片',
                    title: '标题',
                    describe: '描述',
                    date: '时间',
                    link: '链接',
                    color: '遮罩',
                },
                'page_music': {
                    value: '页面音乐',
                    mood: '文章列表',
                    letter: '短语列表',
                    subscribe: '订阅页面',
                    message: '留言页面',
                    about: '个人介绍'
                },
                'other': {
                    value: '其他操作',
                    icp_txt: '备案号',
                    icp_link: '备案链接',
                    password: '原密码',
                    password_new: '新密码'
                }
            },
            type: {
                upload_type: {
                    list: ['服务器', '阿里云'],
                    阿里云: {
                        bucket: 'bucket',
                        region: 'region',
                        accessKeySecret: 'accessKeySecret',
                        accessKeyId: 'accessKeyId',
                        domain: '自定义文件域名，非必填'
                    }
                },
                email_type: {
                    list: ['QQ', '163'],
                    pass: ''
                }
            },
            form: {
                base: {},
                administrator: {},
                cover: {},
                page_music: {},
                other: {},
                aliyun_oss: {}
            },
            uploadFile: {},
            fullscreenLoading: false,
        }
    },
    watch: {
        $info: {
            handler(val) {
                this.init()
            },
            immediate: true
        }
    },
    computed: {
        $info(){
            return this.$store.state.$data ? this.$store.state.$data.info : {}
        }
    },
    methods: {
        init() {
            for (let key in this.$info) {
                this.$set(this.form, key, this.$info[key])
            }
        },
        async onSubmit() {
            const upload_type = this.form['base']['upload_type']
            const aliyun_oss = this.form['aliyun_oss']
            
            if (upload_type == '阿里云') {
                for (let i in aliyun_oss) {
                    if (i != 'domain' && !aliyun_oss[i]) {
                        this.$message.error('请填写阿里云上传模式的必填信息！')
                        return
                    }
                }
            }

            /**
             * Password
             */ 
            const [p1, p2] = ['password', 'password_new'].map(i => this.form['other'][i])
            if (p1 && !p2) {
                this.$message.error('请填写新密码!')
                return
            } else if (p2 && !p1) {
                this.$message.error('请填写原密码!')
                return
            }

            if (p2 && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(p2)) {
                this.$message.error('请填写6~18位包含数字和字母的密码!')
                return
            }

            this.fullscreenLoading = true

            if (p1 && p2) {
                const result = await this.$http.post('/password', { p1, p2 })
                if(result.data.status === 2){
                    this.fullscreenLoading = false
                    this.$message.error('原密码输入有误!')
                    return;
                }
            }

            /**
             * Upload Image
             */
            const uploadList = []
            for (let key in this.uploadFile) {
                uploadList.push(new Promise((resolve, reject) => {
                    
                    const uploadRef = this.$refs.upload.filter(item => item.name === key)
                    const form = new FormData()
                    form.append('type', upload_type)
                    form.append('file', uploadRef[0].getFile())

                    if (upload_type == '阿里云') {
                        const oss = JSON.stringify(aliyun_oss)
                        form.append('oss', oss)
                    }

                    this.$http.post('/upload', form).then(res => {
                        if (res.data.status === 1) {
                            resolve({
                                type: key, 
                                url: res.data.body.url
                            })
                        } else {
                            reject(res.data.body)
                        }
                    }).catch(err => {
                        reject(err)
                    })
                }))
            }

            Promise.all(uploadList).then(res => {
                console.log(this.uploadFile)
                console.log(1)
                if (res.length > 0) {
                    res.map(item => {
                        if (item.type === 'avatar') {
                            this.form['base']['admin_avatar'] = item.url
                        } else {
                            this.form['cover']['image'] = item.url
                        }
                    })
                }

                // 提交信息
                this.$http.post('/info', this.form).then(res => {
                    if (res.data.status === 1) {
                        this.$message({
                            type: 'success',
                            message: 'success'
                        })
                        this.$store.commit('updataInfo', res.data.body)
                        this.fullscreenLoading = false
                        this.uploadFile = {}
                    } else {
                        this.$message.error(res.data.body.message)
                    }
                    document.querySelector('.content').scrollTop = 0
                })
            }).catch(err => {
                console.log(this.uploadFile)
                console.log(2)
                this.fullscreenLoading = false
                this.$message.error(err.message)
            })
        },
        uploadChange(type, file){
            console.log(file)
            this.uploadFile[type] = file
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form{
    max-width: 600px;
}
.avatar-uploader{
    height: 100px;
    ::v-deep .el-upload{
        height: 100px;
        width: 100px;
        overflow: hidden;
        border: 4px solid #dce7ff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        i{
            font-size: 30px;
            color: #dcdfe6;
        }
        img{
            width: 100%;
        }
    }
}
.cover{
    overflow: hidden;
    ::v-deep .el-upload{
        width: 300px;
        height: 170px;
        border-radius: 4px;
        overflow: hidden;
        border: 6px solid #dce7ff;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 100%;
            height: 100%;
            border-radius: 2px;
        }
        i{
            font-size: 30px;
            color: #dcdfe6;
            vertical-align: middle;
        }
    }
}
.oss-list .el-input{
    margin-top: 10px;
    position: relative;
    &.red::before{
        content: '*';
        color: red;
        position: absolute;
        top: 2px;
        left: -12px;
        font-size: 16px;
    }
}
.upload-image-size{
    position: absolute;
    top: 20px;
    font-size: 12px;
    right: calc(100% + 14px);
    color: #b3b3b3;
}
h2.tit{
    margin: 50px 0 30px;
    span{
        font-size: 12px;
        color: #b3b3b3;
    }
}

.el-popover {
    p{
        margin-bottom: 5px;
    }
    img{
        width: 100%;
        border-radius: 4px;
    }
}
.email-pass{
    position: absolute;
    left: -58px;
    top: 16px;
    font-size: 12px;
    color: #b3b3b3;
}
.submit:hover + .hint{
    opacity: 1;
}
.hint{
    font-size: 12px;
    color: #ff4444;
    margin-left: 10px;
    letter-spacing: 2px;
    opacity: 0;
    transition: all .3s;
}
@media screen and (max-width: 600px) {
    .cover{
        ::v-deep .el-upload{
            width: 100%;
        }
    }
    .hint{
        opacity: 1;
        display: block;
    }
    ::v-deep .el-form-item{
        label{
            width: 90px !important;
        }
        .el-form-item__content{
            margin-left: 90px !important;
        }
    }
}
</style>
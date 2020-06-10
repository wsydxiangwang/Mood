<template>
    <div>
        <div class="header">
            <h1>网站信息</h1>
        </div>
        <el-form ref="form" :model="form" label-width="100px">
            <template v-for="(item, index) in formList[0]">
                <el-form-item :label="item.value" v-if="!item.show" :key="index">
                    <template v-if="item.key == 'avatar'">
                        <el-upload
                            action=""
                            class="avatar-uploader"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="avatarUpload"
                        >
                            <img v-if="avatar['url'] || form.avatar" :src="avatar['url'] || form.avatar">
                            <i v-else class="el-icon-user"></i>
                        </el-upload>
                    </template>
                    <template v-else-if="item.key == 'upload_type'">
                        <el-radio-group v-model="form.upload_type">
                            <el-radio label="服务器"></el-radio>
                            <el-radio label="阿里云OSS"></el-radio>
                        </el-radio-group>
                        <template v-if="form.upload_type == '阿里云OSS'">
                            <template v-for="(item, index) in formList[2]">
                                <el-input 
                                    v-model="form['upload_oss'][item]" 
                                    :placeholder="item == 'domain' ? '自定义图片域名, 需解析至oss (http://img.baidu.com)' : item" 
                                    :key="index"
                                    style="margin-top:10px;"
                                ></el-input>
                            </template>
                        </template>
                    </template>
                    <template v-else-if="item.key == 'email_message'">
                        <el-switch @change="emailChange" v-model="form.email_message"></el-switch>
                    </template>
                    <template v-else>
                        <el-input v-model="form[item.key]"></el-input>
                    </template>
                </el-form-item> 
            </template>

            <h1 class="hint-tit">首屏效果 
                  <el-popover
                    placement="top-start"
                    width="300"
                    trigger="hover"
                >
                    <p>背景颜色请选择类似图片颜色的透明度</p>
                    <img src="../assets/cover.png">
                    <span slot="reference">(view)</span>
                </el-popover>
            </h1>
            <template v-for="(item, index) in formList[1]">
                <el-form-item :label="item.value" :key="index+22">
                    <template v-if="item.key == 'image'">
                        <el-upload
                            action=""
                            class="cover"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="coverUpload"
                        >
                            <img v-if="cover['url'] || form.cover['image']" :src="cover['url'] || form.cover['image']">
                            <i v-else class="el-icon-plus"></i>
                        </el-upload>
                    </template>
                    <template v-else-if="item.key == 'color'">
                        <el-color-picker v-model="form['cover']['color']" show-alpha></el-color-picker>
                    </template>
                    <template v-else>
                        <el-input v-model="form['cover'][item.key]"></el-input>
                    </template>
                </el-form-item>
            </template>
<!-- 
            <h1>修改密码</h1>
            <el-form-item label="原密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="form.passwords"></el-input>
            </el-form-item> -->

            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            avatar: {},
            cover: {},
            formList: [
                [
                    {
                        key: 'avatar',
                        value: '管理员头像'
                    },
                    {
                        key: 'name',
                        value: '管理员昵称'
                    },
                    {
                        key: 'address',
                        value: '网站地址'
                    },
                    {
                        key: 'email',
                        value: '邮箱地址'
                    },
                    {
                        key: 'email_name',
                        value: '邮箱昵称'
                    },
                    {
                        key: 'upload_type',
                        value: '文件上传'
                    },
                    {
                        key: 'email_message',
                        value: '评论通知'
                    },
                    {
                        key: 'email_pass',
                        value: '邮箱PASS',
                        show: true
                    },
                ],
                [
                    {
                        key: 'image',
                        value: '封面图'
                    },
                    {
                        key: 'describe',
                        value: '描述'
                    },
                    {
                        key: 'date',
                        value: '时间'
                    },
                    {
                        key: 'link',
                        value: '链接'
                    },
                    {
                        key: 'color',
                        value: '色调'
                    },
                    {
                        key: 'icp_txt',
                        value: '备案号'
                    },
                    {
                        key: 'icp_link',
                        value: '备案链接'
                    },
                ],
                ['bucket', 'region', 'endPoint', 'accessKeySecret', 'accessKeyId', 'domain']
            ],
            form: {
                cover: {},
                upload_oss: {},
                upload_type: '服务器',
            },
        }
    },
    mounted(){
        // 默认值
        if(Object.keys(this.$store.state.info).length > 0){
            const info = this.$store.state.info;
            for(let i in info){
                this.$set(this.form, i, info[i])
            }
            this.formList[0][7].show = !info.email_message
        }
    },
    methods: {
        onSubmit(){
            /**
             * 图片上传
             */
            const img = ['avatar', 'cover']
            const upload = img.reduce((total, item) => {
                if(this[item].url){
                    total.push(new Promise((resolve, reject) => {
                        
                        this[item]['formData'].append('type', this.form.upload_type)

                        this.$http.post('/upload', this[item].formData).then(res => {
                            if(res.data.status == 100){
                                this[item] = {};
                                resolve({
                                    type: item, 
                                    url: res.data.url
                                })
                            }else{
                                reject()
                            }
                        }).catch(err => {
                            reject(err)
                        })
                    }))
                }
                return total
            }, [])

            Promise.all(upload).then(res => {
                if(res.length > 0){
                    res.map(item => {
                        if(item.type === 'avatar'){
                            this.form['avatar'] = item.url
                        }else{
                            this.form.cover['image'] = item.url
                        }
                    })
                }

                console.log(this.form)

                // 提交信息
                this.$http.post('/info', this.form).then(res => {
                    if(res.data.status === 1){
                        // 成功
                        this.$store.commit('adminInfo', res.data.body)
                    }
                })
            }).catch(err => {

                this.$message.error('图片上传失败，请检查网络是否正常 or 文件上传信息是否填写正确!')
            })
        },
        emailChange(e){
            this.formList[0][7].show = !e
        },
        // 保存临时图片
        upload(type, file){
            if (!file.raw.type.includes('image')) {
                this.$message.error('请选择图片格式的文件!')
                return
            }
            const formData = new FormData();
            formData.append('file', file.raw);            
            this[type] = {
                url: URL.createObjectURL(file.raw),
                formData
            }
        },
        avatarUpload(file){
            this.upload('avatar', file)
        },
        coverUpload(file){
            this.upload('cover', file)
        },
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader{
    height: 100px;
    /deep/ .el-upload{
        height: 100px;
        width: 100px;
        overflow: hidden;
        border: 1px solid #dcdfe6;
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
    /deep/ .el-upload{
        width: 300px;
        height: 170px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #dcdfe6;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 100%;
        }
        i{
            font-size: 30px;
            color: #dcdfe6;
            vertical-align: middle;
        }
    }
}
h1{
    border-left: 2px solid #0084ff;
    padding-left: 16px;
    font-size: 18px;
    font-weight: 400;
    margin: 50px 0 30px;
    color: #0084ff;
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
</style>
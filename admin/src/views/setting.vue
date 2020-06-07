<template>
    <div>
        <div class="header">
            <h1>网站信息</h1>
        </div>
<img src="/uploads/image/1591522810649.jpg" alt="">
        <el-form ref="form" :model="form" label-width="100px">
            <template v-for="(item, index) in formList[0]">
                <el-form-item :label="item.value" v-if="!item.show" :key="index">
                    <!-- 头像 -->
                    <template v-if="item.key == 'avatar'">
                        <el-upload
                            action=""
                            class="avatar-uploader"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="avatar"
                        >
                            <img v-if="image[0].url" :src="form.avatar || image[0].url">
                            <i v-else class="el-icon-user"></i>
                        </el-upload>
                    </template>
                    <template v-else-if="item.key == 'upload_type'">
                        <el-radio-group v-model="form.upload_type">
                            <el-radio label="服务器"></el-radio>
                            <el-radio label="七牛云"></el-radio>
                            <el-radio label="阿里云OSS"></el-radio>
                        </el-radio-group>
                        <template v-if="form.resource == '阿里云OSS'">
                            <el-input v-model="form.email_pass" placeholder="bucket"></el-input>
                            <el-input v-model="form.email_pass" placeholder="region"></el-input>
                            <el-input v-model="form.email_pass" placeholder="endPoint"></el-input>
                            <el-input v-model="form.email_pass" placeholder="accessKeySecret"></el-input>
                            <el-input v-model="form.email_pass" placeholder="accessKeyId"></el-input>
                        </template>
                    </template>
                    <template v-else-if="item.key == 'email_message'">
                        <el-switch v-model="form.email_message"></el-switch>
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
                            :on-change="cover"
                        >
                            <img v-if="image[1].url" :src="form.cover['image'] || image[1].url">
                            <i v-else class="el-icon-plus"></i>
                        </el-upload>
                    </template>
                    <template v-else-if="item.key == 'color'">
                        <el-color-picker v-model="form.cover['color']" show-alpha></el-color-picker>
                    </template>
                    <template v-else>
                        <el-input v-model="form.cover[item.key]"></el-input>
                    </template>
                </el-form-item>
            </template>

            <h1>修改密码</h1>
            <el-form-item label="原密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="form.passwords"></el-input>
            </el-form-item>

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
            image: [{}, {}],
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
                ]
            ],
            form: {
                cover: {},
                upload_type: '服务器',
            },
            url: ''
        }
    },
    watch: {
        'form.email_message': {
            handler(val) {
                this.formList[0][7].show = !val
            },
        }
    },
    methods: {
        onSubmit(){
            this.image.map(item => Object.keys(item).length === 0)
            console.log(this.image.map(item => Object.keys(item).length === 0))
        },
        avatar(file){
            const formData = new FormData();
            formData.append('file', file.raw);

            const data = {
                type: 'avatar',
                url: URL.createObjectURL(file.raw),
                formData
            }
            this.$set(this.image, 0, data)

            this.$http.post('/upload', formData).then(res => {
                this.url = res.data.imageUrl
                console.log(this.url)
            })
        },
        cover(file){
            const formData = new FormData();
            formData.append('files', file.raw);

            const data = {
                type: 'cover',
                url: URL.createObjectURL(file.raw),
                formData
            }
            this.$set(this.image, 1, data)
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
    margin: 20px 0 30px;
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
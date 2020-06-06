<template>
    <div>
        <div class="header">
            <h1>网站信息</h1>
        </div>

        <!-- <div class="picture">
            <el-upload
                class="avatar-uploader"
                action="http://localhost:3000/admin/api/uploader"
                :on-success="handleAvatarSuccess"
                :on-change="fileChange"
                :auto-upload="false"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-els    e class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <el-button @click="submit">提交</el-button>
         -->
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="管理员昵称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="网站地址">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="邮箱昵称">
                <el-input v-model="form.email_name"></el-input>
            </el-form-item> 
            <el-form-item label="邮箱地址">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="评论通知">
                <el-switch v-model="form.delivery"></el-switch>
            </el-form-item> 
            <el-form-item label="邮箱PASS" v-if="form.delivery">
                <el-input v-model="form.email_pass"></el-input>
            </el-form-item> 

            <h1>首屏效果 
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover">
                    <p>背景颜色请选择类似图片颜色的透明度</p>
                    <img src="http://localhost:8082/img/logo.822cb23c.png" alt="">
                    <span slot="reference">(view)</span>
                </el-popover>
            </h1>
            <el-form-item label="背景图">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="简介">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="日期">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="链接">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker v-model="form.color" show-alpha></el-color-picker>
            </el-form-item>

            <h1>修改密码</h1>
            <el-form-item label="原密码">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="form.address"></el-input>
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
            imageUrl: '',
             form: {}
        }
    },
    created(){

    },
    methods: {
        onSubmit(){},
        fileChange(file){
            this.imageUrl = URL.createObjectURL(file.raw);
            let formData = new FormData();
            formData.append('files', file.raw);
            this.$http.post('/uploader', formData).then(res => {
              
            })
        },
   
    }
}
</script>

<style lang="scss" scoped>
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
.picture{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    img{
        width: 100%;
        height: 100%;
    }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
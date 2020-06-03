<template>
    <div>
        <div class="header">
            <h1>信息修改</h1>
        </div>

        <div class="picture">
            <el-upload
                class="avatar-uploader"
                action="123"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
 <img v-if="imageUrl" :src="imageUrl" class="avatar">
 <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
<!-- 

    首页（图片，颜色，地址，文字，简介）

    头像
    昵称
    管理员（昵称 && 邮箱 && 标识）

    邮件通知
    微信分享
    
    修改密码

    个人中心介绍（md）
 -->

    </div>
</template>

<script>
export default {
    data() {
        return {
            imageUrl: ''
        }
    },
    created(){

    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            console.log(this.imageUrl)
        },
        beforeAvatarUpload(file) {
            console.log(file)
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
    }
}
</script>

<style lang="scss" scoped>
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
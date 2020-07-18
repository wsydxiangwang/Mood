<template>
    <div v-loading.fullscreen.lock="loginLoading">
        
        <div class="form">
            <h2>Welcome Home!</h2>
            <div class="form-item">
                <div class="ipt user">
                    <input type="text" placeholder="Name" v-model="data.username">
                    <img src="../assets/login-1.png" alt="">
                </div>
                <div class="ipt pass">
                    <input type="password" placeholder="Password" v-model="data.password">
                    <img src="../assets/login-2.png" alt="">
                </div>
                <img src="../assets/login-0.png" alt="">
                <button @click="login" @keyup.enter="login">sign in</button>
                <span @click="isCreate" class="add">(sign up)</span>
            </div>
        </div>
        <ul class="bg-bubbles">
            <li v-for="i in 10" :key="i"></li>
        </ul>
        <div class="hint">永远相信美好的事情即将发生...</div>

        <transition name="fade">
            <section class="create" v-if="isShow">
                <div class="create-form">
                    <h3>创建账号</h3>

                    <input type="text" placeholder="用户名" v-model="create.username">
                    <input type="password" placeholder="密码" v-model="create.password">
                    <input type="password" placeholder="重复密码" v-model="create.passwords">
                    <button @click="createSubmit">sign in</button>

                    <p><span class="el-icon-warning"></span> 管理员账号只能创建一次, 请牢记账号和密码！ </p>

                    <span @click="isCreate" class="el-icon-circle-close"></span>
                </div>
            </section>
        </transition>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginLoading: false,
            data: {
                username: '',
                password: '',
            },
            create: {},
            isShow: false
        }
    },
    methods: {
        isCreate(){
            this.isShow = !this.isShow
        },
        createSubmit(){
            if(Object.keys(this.create).length != 3){
                this.$message.error('请填写完整信息');
                return;
            }
            if(this.create.password !== this.create.passwords){
                this.$message.error('密码不一致');
                return;
            }
            
            this.loginLoading = true;

            this.$http.post('/user', this.create).then(res => {
                setTimeout(() => {
                    if(res.data.status == 1){
                        this.$message({
                            message: '账号创建成功, 请登录！',
                            type: 'success'
                        });
                        this.create = {};
                        this.isCreate();
                    }else{
                        this.$alert(res.data.message, '注册失败', {confirmButtonText: '确定'});
                    }
                    this.loginLoading = false
                }, 1000)
            })
            
        },
        async login(){
            this.loginLoading = true;
            const res = await this.$http.post('/login', this.data);
            /**
             * 登录成功
             * 设置token
             * 去到首页
             */
            if(res.data.status === 1){
                localStorage.setItem("Authorization", res.data.token)
                this.$router.push('/')
                this.$message({
                    message: '登录成功',
                    type: 'success'
                });
            }else{
                this.$message.error(res.data.message);
            }
            this.loginLoading = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.create{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before{
        content: '';
        background: rgba(0, 0, 0, 0.5);
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
    }
    .create-form{
        background: #fff;
        width: 430px;
        z-index: 99;
        padding: 40px 50px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px #e6e6e6;
        position: relative;
        h3{
            text-align: center;
            color: #409eff;
            font-size: 20px;
            margin-bottom: 40px;
            font-weight: 400;
            letter-spacing: 2px;
        }
        p{
            font-size: 12px;
            color: #b5b5b5;
            margin-top: 40px;
            text-align: center;
        }
        input{
            width: 100%;
            height: 44px;
            border-radius: 4px;
            border: 1px solid #eee;
            margin-bottom: 12px;
            font-size: 14px;
            padding: 0 12px;
            color: #606060;
            transition: all .3s;
            outline: none;
            &:hover{
                border-color: #0b9aff;
            }
        }
        button{
            border: none;
            color: #fff;
            background: #0b9aff;
            height: 40px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all .3s;
            outline: none;
            margin-top: 10px;
            &:hover{
                background: #0486e2;
            }
        }
        .el-icon-circle-close{
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 18px;
            color: #d2d2d2;
            cursor: pointer;
            transition: all .3s;
            &:hover{
                color: #0486e2;
            }
        }
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
.form{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 380px;
    padding: 40px 0 24px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 10px #e6e6e6;
    z-index: 9;
    .form-item{
        padding: 0 50px;
        div img{
            display: none;
        }
        .ipt:focus-within{
            & ~ img{
                display: none;
            }
            img{
                display: block;
            }
            &.user img{
                width: 120px;
                height: 113px;
            }
            &.pass img{
                width: 103px;
                height: 84px;
                top: -60px;
            }
        }
        img{
            position: absolute;
            top: -80px;
            left: 50%;
            width: 120px;
            height: 95px;
            transform: translate(-50%, 0);
        }
        .add{
            font-size: 12px;
            color: #dad4d4;
            display: block;
            margin-top: 6px;
            cursor: pointer;
            transition: all .3s;
            text-transform: uppercase;
            &:hover{
                color: #0b9aff;
            }
        }
    }
    input{
        width: 100%;
        height: 44px;
        border-radius: 4px;
        border: 1px solid #eee;
        margin-bottom: 12px;
        font-size: 14px;
        padding: 0 12px;
        color: #606060;
        transition: all .3s;
        outline: none;
        &:hover{
            border-color: #0b9aff;
        }
        &:focus-within + img{
            display: block;
        }
    }
    button{
        border: none;
        color: #fff;
        background: #0b9aff;
        height: 40px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        display: block;
        width: 100%;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all .3s;
        outline: none;
        margin-top: 10px;
        &:hover{
            background: #0486e2;
        }
    }
    h2{
        font-size: 22px;
        color: #0b9aff;
        letter-spacing: 2px;
        margin: 10px 0 24px;
    }
}
.hint{
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 12px;
    text-align: center;
    letter-spacing: 1px;
    z-index: 99;
}
.bg-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(to bottom right, #50A3A2, #53E3A6);
    li {
        position: absolute;
        bottom: -160px;
        width: 60px;
        height: 60px;
        background-color: rgba(255, 255, 255, 0.15);
        list-style: none;
        animation: square 25s infinite;
        transition-timing-function: linear;
        &:nth-child(1) {
            left: 10%;
        }
        &:nth-child(2) {
            left: 20%;
            width: 90px;
            height: 90px;
            animation-delay: 2s;
            animation-duration: 7s;
            border-radius: 50%;
        }
        &:nth-child(3) {
            left: 25%;
            animation-delay: 4s;
        }
        &:nth-child(4) {
            left: 40%;
            width: 60px;
            height: 60px;
            animation-duration: 8s;
            background-color: rgba(255, 255, 255, 0.3);
        }
        &:nth-child(5) {
            left: 70%;
            border-radius: 50%;
        }
        &:nth-child(6) {
            left: 80%;
            width: 100px;
            height: 100px;
            animation-delay: 3s;
            background-color: rgba(255, 255, 255, 0.2);
        }
        &:nth-child(7) {
            left: 32%;
            width: 120px;
            height: 120px;
            animation-delay: 2s;
        }
        &:nth-child(8) {
            left: 55%;
            width: 40px;
            height: 40px;
            animation-delay: 4s;
            animation-duration: 15s;
            border-radius: 50%;
        }
        &:nth-child(9) {
            left: 25%;
            width: 20px;
            height: 20px;
            animation-delay: 2s;
            animation-duration: 12s;
            background-color: rgba(255, 255, 255, 0.3);
        }
        &:nth-child(10) {
            left: 85%;
            width: 120px;
            height: 120px;
            animation-delay: 5s;
            border-radius: 50%;
        }
    }
    // 自定义 square 动画；
    @keyframes square {
        0% {
            opacity: 0.5;
            transform: translateY(0px) rotate(0);
        }
        50%{
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-90vh) rotate(360deg);
        }
    }
}
input::-webkit-input-placeholder{
    color:#bbbbbb;
}
input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#bbbbbb;
}　　
input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#bbbbbb;
}
input:-ms-input-placeholder{  /* Internet Explorer 10-1*/
    color:#bbbbbb;
}

@media screen and (max-width: 600px) {
    .form{
        max-width: 90%;
        width: 400px;
        .form-item{
            padding: 0 40px
        }
    }
    .create .create-form{
        max-width: 90%;
        width: 400px;
        padding: 40px 30px 20px;
    }
}
</style>
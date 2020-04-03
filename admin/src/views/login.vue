<template>
    <div class="login" v-loading.fullscreen.lock="loginLoading">
        <input type="text" placeholder="用户名" v-model="data.username">
        <input type="password" placeholder="密码" v-model="data.password">
        <button @click="login">登录</button>
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
            }
        }
    },
    methods: {
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
                this.loginLoading = false;
            }else{
                this.$message.error(res.data.message);
                this.loginLoading = false;
            }
        }
    }
}
</script>
<style lang="scss">
.login{
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 300px;
    padding: 40px 0 30px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 10px #e6e6e6;
    input{
        width: 250px;
        height: 38px;
        border-radius: 4px;
        border: 1px solid #eee;
        margin-bottom: 15px;
        font-size: 12px;
        padding: 0 12px;
        color: #606060;
    }
    button{
        border: none;
        color: #fff;
        background: #0b9aff;
        height: 32px;
        font-size: 12px;
        width: 90px;
        border-radius: 4px;
        cursor: pointer;
    }
}
</style>
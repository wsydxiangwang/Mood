<template>
    <div>
        <input type="text" placeholder="用户名">
        <input type="password" placeholder="密码">
        <button @click="login">登录</button>
    </div>
</template>

<script>
export default {
    methods: {
        async login(){
            let data = {
                name: 'Libai',
                pass: '123456'
            }
            const res = await this.$http.post('/login', data);

            console.log(res.data)


        }
    }
}
</script>
<template>
    <div class="container">
        <Header 
            v-if="refresh" 
            :music="music" 
            title="嘿，你今天笑了么(≖ᴗ≖)✧"
        ></Header>

        <div class="content">
            <h1>[一日之计在于晨]</h1>
            <div class="main">
                <template v-if="resultInfo">
                    <div class="is-active" :class="resultInfo.icon">
                        <span class="iconfont" :class="'icon-'+resultInfo.icon"></span>
                        <p class="email" v-if="resultInfo.email">{{ result.email }}</p>
                        <p>{{ result.message }}</p>
				        <nuxt-link to="/" v-if="resultInfo.home">去到首页</nuxt-link>
                        <a href="/subscribe" v-if="resultInfo.reSubmit">重新提交</a>
                    </div>
                </template>

                <template v-else>
                    <h2>嘿，欢迎订阅心情小镇 ~~</h2>
                    <p>愿你雨天有伞，深夜有灯，一生温暖纯良，不舍爱与自由，与尘世的万千美好都能不期而遇。</p>
                    <input v-model="email" type="text" placeholder="Your email address">
                    <button type="submit" @click="submit">{{ count ? `${count}s后可重发` : 'subscribe' }}</button>   
                    <span class="hint" :class="[hintClass, hintResult]">
                        <span 
                            class="iconfont" 
                            :class="hintResult=='success'?'icon-success':'icon-close'"
                        ></span>{{ text }}
                    </span>
                </template>
            </div>
            <div class="waves-area">
                <svg class="waves-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z"></path>
                    </defs>
                    <g class="parallax">
                        <use xlink:href="#gentle-wave" x="48" y="0"></use>
                        <use xlink:href="#gentle-wave" x="48" y="3"></use>
                        <use xlink:href="#gentle-wave" x="48" y="5"></use>
                        <use xlink:href="#gentle-wave" x="48" y="7"></use>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'subscribe',
    data(){
        return {
            resultList: [
                {
                    icon: 'success',
                    reSubmit: false,
                    home: true,
                    email: true
                },
                {
                    icon: 'error',
                    reSubmit: true,
                    home: true,
                    email: false
                },
                {
                    icon: 'error',
                    reSubmit: true,
                    home: true,
                    email: true
                }
            ],
            music: '',
            email: '',
            refresh: true,
            hintClass: '',
            text: '',
            count: 0,
            time: null,
            hintResult: '',
            status: null
        }
    },
    computed: {
		info() {
			return this.$store.state.data
		},
        resultInfo() {
            const status = this.result.status
            if (!status) {
                return null
            }
            return [1,2,3].includes(status) ? this.resultList[status - 1] : null
        }
    },
    head () {
        return {
            title: `Subscribe | ${this.info.base.name}`
        }
    },
    mounted(){
        if (this.info.page_music.subscribe) {
            this.music = this.info.page_music.subscribe
            this.refresh = false
            this.$nextTick(() => this.refresh = true)
        }
    },
    async asyncData(context){
        const isOpenSubscribe = context.store.state.data.administrator.subscribe
        if (isOpenSubscribe) {
            const data = context.query
            if (Object.keys(data).length > 1) {
                const result = await context.$axios.post('subscribe_result', data)
                return { result: result.data.body }
            } else {
                return { result: 0 }
            }
        } else {
            context.error({ 
                statusCode: 404, 
                message: '页面未找到~~' 
            })
        }
    },
    beforeRouteUpdate(to, from, next){
        this.result = {}
        next()
    },
    methods: {
        hintError(){
            this.hintClass = ''
            this.hintResult = 'error'
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    this.hintClass = 'animation'
                })
            })
        },
        submit(){
            if (this.count) return

            if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.email)) {
                this.text = '请输入正确的邮箱地址哦~~'
                this.hintError()
                return
            }

            /**
             * 发送邮箱验证状态 24小时后过期
             */
            const data = {
                email: this.email,
                code: Math.random().toString(36).substr(2),
                time: new Date().setDate(new Date().getDate() + 1),
                active: false,
            }
            this.$axios.post('subscribe', data).then(res => {
                if (res.data.status === 1) {
                    this.count = 60
                    this.time = setInterval(() => {
                        this.count--
                        if (!this.count) {
                            clearInterval(this.time)
                        }
                    }, 1000)
                    this.hintResult = 'success'
                } else {
                    this.hintError()
                }
                this.text = res.data.body
                this.hint = true
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(+2px, 0, 0); }
    30%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(+4px, 0, 0); }
    50% { transform: translate3d(-4px, 0, 0); }
}
.container ::v-deep .header-content{
    background: rgb(255 255 255 / 13%);
    border-bottom: 1px solid rgba(246,247,248,.07);
    .icon{
        .iconfont{
            color: var(--color-bg-primary);
            &.logo{
                color: var(--color-bg-primary)
            }
        }
        .logo-img img{
            background: url(/image/logo/logo3.png) no-repeat center;
            filter: drop-shadow(rgb(255, 255, 255) 40px 0px);
            position: relative;
            left: -40px;
            border-right: 0px solid transparent;
            height: 30px;
            width: 30px;
            background-size: cover;
            overflow: hidden;
        }
    }
}
 
.content{
    width: 100vw;
    height: 100vh;
    background: url('~static/image/other/subscribe.png') no-repeat bottom right;
    background-size: cover;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before{
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        background: rgba(0, 0, 0, 0.15);
    }
    h1{
        position: absolute;
        top: 120px;
        color: var(--color-bg-primary);
        font-size: 24px;
        letter-spacing: 10px;
    }
    .hint{
        position: absolute;
        bottom: 18px;
        left: 50px;
        font-size: 12px;
        color: red;
        opacity: 0;
        transition: none;
        &.animation{
            animation: shake 800ms ease-in-out;
        }
        .iconfont{
            font-size: 14px;
            transition: none;
            vertical-align: text-top;
            &::before{
                transition: none;
            }
            &.icon-success{
                margin-right: 5px;
            }
        }
        &.success{
            opacity: 1;
            color: var(--color-active)
        }
        &.error{
            opacity: 1;
            color: red;
        }
    }
    .main{
        width: 500px;
        padding: 45px;
        margin-top: -100px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.8);
        position: relative;
        a{
            margin-top: 10px;
            display: inline-block;
            color: #0584ff;
        }
        .is-active{
            text-align: center;
            .iconfont{
                color: var(--color-active);
                font-size: 40px;
            }
            p{
                color: var(--color-active);
                font-size: 16px;
                margin: 10px 0 0;
            }
            &.error .iconfont, &.error p{
                color: red;
            }
            .email{
                font-weight: 600;
            }
        }
        h2{
            font-size: 22px;
            margin-bottom: 20px;
            color: var(--color-active)
        }
        p{
            color: #606060;
            line-height: 26px;
            font-size: 14px;
            margin-bottom: 20px;
        }
        button{
            background: var(--color-active);
            color: var(--color-bg-primary);
            border: none;
            height: 34px;
            line-height: 36px;
            padding: 0 30px;
            border-radius: 50px;
            font-size: 14px;
            outline: none;
            text-transform: uppercase;
            cursor: pointer;
            transition: all .3s;
            &:hover{
                background: #55adff;
            }
        }
        input{
            border-radius: 50px;
            background: var(--color-bg-primary);
            padding: 0 18px;
            width: 260px;
            height: 36px;
            font-size: 14px;
            padding-top: 1px;
            border: 1px solid #eaf5ff;
            outline: none;
        }
    }
}
.waves-area * {
    transition: none;
}
.waves-area{
    width: 100%;
    position: absolute;
    bottom: -5px;
    left: 0;
    z-index: 0;
    .waves-svg{
        width: 100%;
        height: 10rem;
    }
    .parallax > use{
        transition: none;
        animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        &:nth-child(1){
            animation-delay: -2s;
            animation-duration: 7s;
            fill: hsla(0,0%,100%,.7);
        }
        &:nth-child(2){
            animation-delay: -3s;
            animation-duration: 10s;
            fill: hsla(0,0%,100%,.5);
        }
        &:nth-child(3){
            animation-delay: -4s;
            animation-duration: 13s;
            fill: rgb(255 255 255 / 30%);
        }
        &:nth-child(4){
            animation-delay: -5s;
            animation-duration: 20s;
            fill: #fff;
        }
    }
}
@keyframes move-forever {
    0% {
        -webkit-transform:translate3d(-90px, 0, 0);
        transform:translate3d(-90px, 0, 0)
    }
    to {
        -webkit-transform:translate3d(85px, 0, 0);
        transform:translate3d(85px, 0, 0)
    }
}
@media screen and (max-width:500px) {
    .content{
        background-position: center center;
        h1{
            top: 100px;
            font-size: 20px;
        }
        .main{
            width: 90%;
            margin: 0;
            padding: 30px 20px 22px;
            button{
                margin: 10px 0
            }
            p{
                line-height: 22px;
                font-size: 13px;
            }
            h2{
                font-size: 20px;
            }
            .hint{
                position: static;
                display: block;
                padding: 0 10px;
                height: 0;
                transition: all .3s;
                &.show{
                    height: auto;
                }
            }
            input{
                width: 100%;
            }
        }
    }
    .waves-area .waves-svg{
        height: 70px;
    }
}
</style>
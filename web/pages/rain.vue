<template>
    <div class="rain">
        <div class="logo-img" @click="toIndex">
            <img src="/image/logo/logo1.png">
        </div>

        <!-- <span class="logo iconfont icon-logo4" @click="toIndex"></span> -->

        <img class="rain-bg" :src="img" draggable="false">
        <img class="words" src="/image/rain/words.png" draggable="false">

        <ul class="option">
            <li v-for="(item, index) in rainIcon" :key="index">
                <span @click="music(index, item.active)">
                    <img :src="item.on" draggable="false" v-if="item.active" />
                    <img :src="item.off" draggable="false" v-else/>
                </span>
                <!-- music -->
                <audio class="music" loop="loop" preload="auto">
                    <source type="audio/mpeg" :src="item.music">
                </audio>
            </li>
        </ul>

        <!-- loading -->
		<Loading v-if="loading"></Loading>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rainIcon: [
                {
                    on: '/image/rain/rain_on.png',
                    off: '/image/rain/rain_off.png',
                    music: '/image/rain/thunder.mp3',
                    active: false
                },
                {
                    on: '/image/rain/rain2_on.png',
                    off: '/image/rain/rain2_off.png',
                    music: '/image/rain/loudThunder.mp3',
                    active: false
                },
                {
                    on: '/image/rain/rain3_on.png',
                    off: '/image/rain/rain3_off.png',
                    music: '/image/rain/rain.mp3',
                    active: false
                }
            ],
            loading: true,
            img: null
        }
    },
    head () {
        return {
            title: 'Rainy Day',
            meta: [
                { hid: 'description', name: 'description', content: '下雨了，打湿心扉的，不是突如其来的雨点，是人情冷暖。一辆黑色的轿车，嘎然而止，一声亲切的呼唤，上车吧！' }
            ]
        }
    },
    mounted(){
        let img = new Image();
        img.src = '/image/rain/rain-bg.gif'
        img.onload = () => {
            this.loading = false
            this.img = img.src
        }
        this.$nextTick(() => {
            this.music(0, false)
        })
    },
    methods: {
        toIndex(){
            this.$router.push('/')
        },
        music(type, active){
            // icon
            this.$set(this.rainIcon[type], 'active', !active)
            let music = document.getElementsByClassName("music");
            if(!active){                    
                music[type].play();
            }else{
                music[type].pause();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.rain{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    .logo{
        color: var(--color-bg-primary);
        position: fixed;
        bottom: 20px;
        left: 30px;
        z-index: 9999;
        font-size: 30px;
        cursor: pointer;
    }
    .logo-img{
        color: var(--color-bg-primary);
        position: fixed;
        bottom: 20px;
        left: 30px;
        z-index: 9999;
        cursor: pointer;
        width: 80px;
        height: 34px;
        img{
            width: 100%;
        }
    }
    .rain-bg{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50% );
    }
    .words{
        position: fixed;
        top: 80px;
        right: 80px;
    }
    .option{
        width: 416px;
        height: 70px;
        position: fixed;
        bottom: 0;
        right: 0;
        text-align: center;
        li{
            display: inline-block;
            list-style-type: none;
            cursor: pointer;
            span{
                display: inline-block;
            }
        }
    }
}
@media screen and (max-width: 480px){
    .rain{
        .rain-bg{
            position: absolute;
            left: 60%;
            top: 50%;
            transform: translate(-50%, -50% );
        }
        .words{
            top: 30%;
            left: 50%;
            right: auto;
            transform: translate(-50%, -50% );
        }
        .option{
            width: auto;
            right: 20px;
            li{
                width: 60px;
                overflow: hidden;
                span{
                    display: flex;
                    justify-content: center;
                }
            }
        }
        .logo{
            left: 20px;
        }
    }
}
</style>
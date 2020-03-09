<template>
    <div class="rain">
        <span class="logo iconfont icon-logo4" @click="toIndex"></span>
        <img class="rain-bg" src="https://image.yeyucm.cn/Myself-Resources/rain/rain-bg.gif" draggable="false" @load="handleLoad">
        <img class="words" src="https://image.yeyucm.cn/Myself-Resources/rain/words.png" draggable="false" @load="handleLoad">
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

        <div class="loading" v-if="loading"><span></span></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rainIcon: [
                {
                    on: require('@/static/image/rain/rain_on.png'),
                    off: require('@/static/image/rain/rain_off.png'),
                    music: 'https://image.yeyucm.cn/Myself-Resources/rain/rain.mp3',
                    active: false
                },
                {
                    on: require('@/static/image/rain/rain2_on.png'),
                    off: require('@/static/image/rain/rain2_off.png'),
                    music: 'https://image.yeyucm.cn/Myself-Resources/rain/thunder.mp3',
                    active: false
                },
                {
                    on: require('@/static/image/rain/rain3_on.png'),
                    off: require('@/static/image/rain/rain3_off.png'),
                    music: 'https://image.yeyucm.cn/Myself-Resources/rain/loudThunder.mp3',
                    active: false
                }
            ],
            num: 0,
            loading: true,
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
    watch: {
        num(val){
            if(val == 2){
                setTimeout(() => {
                    this.loading = false;
                    // this.$nextTick(() => {
                    //     this.music(0, false)
                    // })
                }, 2000)
            }
        }
    },
    mounted(){
        this.loading = true;
    },
    methods: {
        toIndex(){
            this.$router.push('/')
        },
        handleLoad(e){
            this.num++;
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
@keyframes Loading{
    5% { transform: scale(1); } 
    10% { transform:scale(0.95); }
    15% { transform:scale(0.9); }
    20% { transform:scale(0.8); }
    25% { transform:scale(0.7); }
    30% { transform:scale(0.6); }
    35% { transform:scale(0.5); }
    40% { transform:scale(0.4); }
    50% { transform:scale(0.3); }
    60% { transform:scale(0.4); }
    65% { transform:scale(0.5); }
    70% { transform:scale(0.6); }
    75% { transform:scale(0.7); }
    80% { transform:scale(0.8); }
    85% { transform:scale(0.85); }
    90% { transform:scale(0.9); }
    95% { transform:scale(0.95); }
    100% { transform:scale(1); }
}
.rain{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    .loading{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        z-index: 9999;
        display: flex;
		align-items: center;
		justify-content: center;
		span{
			width: 15px;
			height: 15px;
			display: block;
			margin-top: -20px;
			border-radius: 50%;
			background: #808080;
			animation: Loading 2s both infinite;
		}
    }
    .logo{
        color: #fff;
        position: fixed;
        bottom: 20px;
        left: 30px;
        z-index: 9999;
        font-size: 30px;
        cursor: pointer;
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
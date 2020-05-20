<template>
    <header>
        <div class="l icon">
            <span class="iconfont icon-logo3 logo" @click="toIndex"></span>
            <span 
                class="iconfont" 
                :class="isStore ? 'icon-pause' : 'icon-play'" 
                @click="changeMusic"
            ></span>
        </div>
        <div class="title" :class="{active: isTitle}">{{title}}</div>
        <div class="r icon">
            <!-- <span class="iconfont icon-wechat" @click="wechat"></span> -->
            <a href="https://github.com/wsydxiangwang" target="_blank" v-if="github">
                <span class="iconfont icon-github"></span>
            </a>
            <span class="myself" @click="myself">
                <img src="../static/image/myself.png">
            </span>
        </div>
        <!-- 音乐进度条 -->
        <div class="musicBar" :style="{width: changeProgress}"></div>

        <!-- music -->
        <audio id="music" loop="loop" preload="auto">
            <source type="audio/mpeg" :src="music">
        </audio>
    </header>
</template>

<script>
export default {
    props: ['music', 'title', 'github'],
    data(){
        return{
            isStore: false,
            isTitle: false,
            timer: null,
            changeProgress: 0,

            scrollTop: 0
        }
    },
    destroyed(){
        // 销毁滚动条事件
        window.removeEventListener('scroll', this.handleScroll, true)
    },
    mounted(){
        // 监听滚动条事件
        window.addEventListener('scroll', this.handleScroll, true)
    },
    methods: {
        // 音乐播放
        changeMusic(){
            let music = document.getElementById("music");
            this.isStore = !this.isStore;
            // 播放
            if(this.isStore){
                music.play();
                // 进度条
                this.timer = setInterval(() => {
                    var n = (100 * (music.currentTime / music.duration)).toFixed(2);
                    // 循环
                    if(n >= 100) clearInterval(this.timer);
                    this.changeProgress = n + '%';
                }, 50)
            }
            // 暂停
            else{
                music.pause();
                clearInterval(this.timer);
            }
        },
        toIndex(){
            this.$router.push('/')
        }, 
        myself(){
            this.$router.push('/Libai')
        },
        // 滚动条位置
        handleScroll(){
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(this.scrollTop >= 100){
                this.isTitle = true;
            }else{
                this.isTitle = false;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #f6f7f8;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666;
    padding: 0 15px;
    background: #fff;
    z-index: 99999;
    .musicBar{
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 50px;
        z-index: -1;
        background: #eee;
    }
    .title{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        transition: all .8s;
        text-align: center;
        opacity: 0;
        &.active{
            opacity: 1;
        }
    }
    .iconfont{
        color: #888;
        font-size: 20px;
        cursor: pointer;
        margin: 4px 5px 0;
        transition: all .3s;
        vertical-align: middle;
        display: inline-block;
        &.logo{
            color: #444;
            font-size: 30px;
        }
        &.icon-github{
            font-size: 28px;
            position: absolute;
            right: 48px;
            top: 5px;
            &:hover{
                color: #000;
            }
        }
    }
    .myself{
        width: 26px;
        height: 26px;
        display: inline-block;
        border-radius: 50%;
        overflow: hidden;
        vertical-align: bottom;
        margin-left: 8px;
        cursor: pointer;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
@media screen and (max-width: 600px) {
    header{
        position: absolute;
        .scrollbar{
            position: fixed;
            height: 1px;
        }
        .iconfont.logo{
            font-size: 28px;
            margin: 4px 0 0;
        }
    }
}
</style>
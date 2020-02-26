<template>
    <div class="container">
        <header>
            <div class="l icon">
                <span class="logo" @click="toIndex">
                    <img src="../static/image/logo.png">
                </span>
                <span 
                    class="iconfont" 
                    :class="isStore ? 'iconpause' : 'iconplay'" 
                    @click="changeMusic"
                ></span>
            </div>
            <div class="title" :class="{active: title}">你好，我是李白！</div>
            <div class="r icon">
                <span class="iconfont icon-wechat" @click="wechat"></span>
                <span class="myself">
                    <img src="../static/image/myself.png">
                </span>
            </div>
            <!-- 音乐进度条 -->
            <div class="musicBar" :style="{width: changeProgress}"></div>

            <!-- music -->
            <audio id="music" loop="loop" preload="auto">
                <source type="audio/mpeg" src="https://image.yeyucm.cn/music/qianbaidu.mp3">
            </audio>
        </header>

        <div style="margin: 100px;text-align: center;font-size: 20px;">
        你好，我是李白！
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: false,
            comment: {},
            isLike: false,
            isStore: false,
            timer: null,
            changeProgress: 0,
        }
    },
    head () {
        return {
            title: '白茶 | Libai'
        }
    },
    mounted(){
        // 滚动条
        window.addEventListener('scroll', this.handleScroll)
        this.$nextTick(() => {
            this.changeMusic()
        })
    },
    methods: {
        wechat(){},
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
        // 滚动条位置
        handleScroll(){
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop >= 100){
                this.title = true;
            }else{
                this.title = false;
            }
        },
        toIndex(){
            this.$router.push('/')
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
        margin: 0 5px;
        transition: all .3s;
        &:hover{
            color: #555;
        }
        &.like, &.like:hover{
            color: #EF6D57;
        }
    }
    .logo{
        display: inline-block;
        height: 20px;
        width: 20px;
        vertical-align: top;
        margin-right: 15px;
        margin-left: 4px;
        cursor: pointer;
        img{
            width: 100%;
            height: 100%;
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
</style>
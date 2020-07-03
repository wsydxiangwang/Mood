<template>
    <div class="back-top" :class="{isBack}" @click="backTop">
        <span class="iconfont icon-top"></span>
    </div>
</template>

<script>
export default {
    data(){
        return{
            isBack: '',
            timerTop: null,
            scrollTop: 0,
            fnScroll: () => {}
        }
    },
    mounted(){
        this.handleScroll()
        this.fnScroll = this.$throttle(this.handleScroll, 100)
        window.addEventListener('scroll', this.fnScroll)
    },
    destroyed(){
        window.removeEventListener('scroll', this.fnScroll)
    },
    methods: {
		handleScroll(){
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;            
            this.isBack = this.scrollTop >= 2000 ? 'show' : '';
		},
        backTop(){
            let osTopCache = 0;
            this.timerTop = setInterval(() => {
                const osTop = document.documentElement.scrollTop || document.body.scrollTop;
                const ispeed = Math.floor(-osTop / 6);
                if(osTopCache && osTopCache < osTop){
                    clearInterval(this.timerTop)
                    return
                } else {
                    osTopCache = document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
                    if (osTop === 0) {
                        clearInterval(this.timerTop)
                    }
                }  
            }, 30)
        },
    }
}
</script>
<style lang="scss" scoped>
    .back-top{
        position: fixed;
        bottom: 20px;
        right: 30px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all .3s;
        z-index: 1;
        &.isBack{
            opacity: 1;
            visibility: visible;
        }
        span{
            font-size: 40px;
            color: #73aada;
            &:hover{
                color: var(--colorActive)
            }
        }
    }
    @media screen and (max-width: 600px) {
        .back-top{
            right: 20px;
            bottom: 10px;
            span{
                font-size: 30px;
            }
        }
    }
</style>
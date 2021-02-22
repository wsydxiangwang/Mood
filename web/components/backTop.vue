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
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            this.isBack = this.scrollTop >= 2000 ? 'show' : ''
		},
        backTop(){
            this.$setScroll('top')
        }
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
        z-index: 1;
        &.isBack{
            opacity: 1;
            visibility: visible;
        }
        span{
            font-size: 40px;
            color: #73aada;
            &:hover{
                color: var(--color-active)
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
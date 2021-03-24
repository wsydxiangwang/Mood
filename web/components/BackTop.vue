<template>
    <div class="back-top" :class="{ show: scroll_current >= 1000 }" @click="backTop">
        <span class="iconfont icon-top"></span>
    </div>
</template>

<script>
import scrollMixin from '~/mixin/scroll.js'
export default {
    mixins: [scrollMixin],
    methods: {
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
        &.show{
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
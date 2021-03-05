<template>
    <div class="bottom-loading">
        <div class="loader" v-if="status == 'loading'">
            <div class="dot" v-for="i in 5" :key="i"></div>
        </div>
        <div class="btn" v-else-if="status == 'nomore'">呜呜，没有更多了~~</div>
        <div class="btn more" v-else>加载更多</div>
    </div>
</template>

<script>
export default {
	computed: {
		status() {
			return this.$store.state.status
		}
	}
}
</script>

<style lang='scss' scoped>
.bottom-loading{
    text-align: center;
    .btn{
        height: 34px;
        line-height: 36px;
        padding: 0 36px;
        color: #909090;
        background: var(--color-bg-primary);
        z-index: 9;
        letter-spacing: 2px;
        border-radius: 4px;
        &.more{
            cursor: pointer;
            &:hover{
                color: #fff;
                background: var(--color-active);
                border-color: var(--color-active);
            }
        }
    }
}
.loader {
    height: 34px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto;
    z-index: 99;
}
.dot {
	width: 15px;
	height: 15px;
	background: #3ac;
	border-radius: 100%;
	display: inline-block;
	animation: slide 1s infinite;
}
.dot:nth-child(1) {
	animation-delay: 0.1s;
	background: #32aacc;
}
.dot:nth-child(2) {
	animation-delay: 0.2s;
	background: #64aacc;
}
.dot:nth-child(3) {
	animation-delay: 0.3s;
	background: #96aacc;
}
.dot:nth-child(4) {
	animation-delay: 0.4s;
	background: #c8aacc;
}
.dot:nth-child(5) {
	animation-delay: 0.5s;
	background: #faaacc;
}
@-moz-keyframes slide {
	0% {
		transform: scale(1);
	}
	50% {
		opacity: 0.3;
		transform: scale(2);
	}
	100% {
		transform: scale(1);
	}
}
@-webkit-keyframes slide {
	0% {
		transform: scale(1);
	}
	50% {
		opacity: 0.3;
		transform: scale(2);
	}
	100% {
		transform: scale(1);
	}
}
@-o-keyframes slide {
	0% {
		transform: scale(1);
	}
	50% {
		opacity: 0.3;
		transform: scale(2);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes slide {
	0% {
		transform: scale(1);
	}
	50% {
		opacity: 0.3;
		transform: scale(2);
	}
	100% {
		transform: scale(1);
	}
}
</style>
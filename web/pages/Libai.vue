<template>
    <div class="container">
        <Header :music="music" title="嘿，陌生人，你今天笑了么 (≖ᴗ≖)✧"></Header>

        <div style="margin: 100px 0;text-align: center;font-size: 20px;">
        你好，我是李白！ <br>
        <br>
        如果下雨了，请叫我出去！<br>
        <br>

        <!-- 北方的冬天看下雪，南方的冬天看下雨，幸福的人喜欢阳光，伤心的人偏爱风雨。 <br>
        然情不敢至深恐大梦一场，卦不敢算尽畏天道无常 。自古来，读书人大多是多愁善感的，亦或是我伤感的音乐听得多了，别离的文章读多了，身上也多少沾染，大抵是个阴郁的人。<br>
        心中总是会有很多的情绪，对文字也算是热爱吧，所以我也想有个地方来记录这些充满情绪的文字，留于往后，留于余生，慢慢品读，人生如逆旅，我亦是行人。<br>
        原本这个世界就有很多东西是并没有什么意义的，所以可能并没有什么值得去分析的理由。
        原本这个世界就有很多东西是并没有什么意义的

        世界上没有什么事情是不可能的
        
        没机会，就去努力争取机会、创造机会。
        不懂就投入心思、时间去学，深入钻研肯定会有好结果的。
        -->

        <!-- 不追热点，不关时政，不要喧哗，不惹纷争。 -->
        </div>

        <!-- loading -->
		<Loading v-if="loading"></Loading>
    </div>
</template>

<script>
import Header from "../components/header";
export default {
	components: {
		Header
    },
    data(){
        return{
            title: false,
            music: 'https://image.raindays.cn/Myself-Resources/music/qianbaidu.mp3',
            loading: true
        }
    },
    head () {
        return {
            title: 'Libai | 白茶'
        }
    },
    mounted() {
        //loading
        document.body.style.overflowY = 'hidden';
        setTimeout(() => {
            this.loading = false;
            document.body.style.overflowY = '';
        }, 800)

        this.$nextTick(() => {
			// 微信分享
            this.$wxShare(this, 6);
		})
    }
}
</script>

<style lang="scss" scoped>

</style>
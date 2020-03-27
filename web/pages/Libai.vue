<template>
    <div class="container">
        <Header :music="music" title="嘿，陌生人，你今天笑了么 (≖ᴗ≖)✧"></Header>

        <div style="margin: 100px 0;text-align: center;font-size: 20px;">
            你好，我是李白！ <br>

            结庐在人境，而无车马喧。<br>

            问君何能尔？心远地自偏。<br>

            采菊东篱下，悠然见南山。<br>

            山气日夕佳，飞鸟相与还。<br>

            如果下雨了，请叫我出去！<br>
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
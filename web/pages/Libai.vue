<template>
    <div class="container">
        <Header :music="music" :github="true" title="嘿，陌生人，你今天笑了么 (≖ᴗ≖)✧"></Header>

        <h2>你好，我是李白！</h2>

        <h3>PART 1</h3>

        <ul class="content">
            <li>生于南方 一九九九 羡雨慕雪</li>
            <li>李花怒放一树白，一个脱离了低级趣味的人，记录，为清醒的活着</li>
            <li>不刷网不追剧，不追热点不游戏，治愈心灵和空气</li>
            <li>在识字是书荒，专注学习寻自由，离群索居享清静</li>
            <li>倾听心灵治疗，轻触指尖黑白键，聆听在唯美纯音</li>
            <li>不择手段控制自己不浪费时间</li>
            <li>生活，是所有的理由和答案</li>
            <li>如果下雨了，请发邮件跟我说一声，Thank You.</li>
        </ul>
        <p>
            今天的大海很温顺，也许是因为吞没了夕阳，沉睡了一般，只留下海鸥的鸣叫~~  <br>
            陌生人，你好呀，承蒙遇见，三生有幸，永远年轻，永远热泪满盈，终身美丽~~    <br>
            有啥故事想分享的，或有困难需要帮助，或想倾诉，可以随时联系我哦~~       <br>
            我是你最陌生、最坚强的后盾，有我在，我不会让你孤单的~~                <br>
            邮箱：1915398623@qq.com
        </p>

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
.container{
    padding: 100px 20px;
    width: 100%;
    max-width: 800px;
    margin: auto;
    h2{
        font-size: 30px;
        margin-bottom: 25px;
    }
    h3{
        font-size: 16px;
        margin: 20px 0;
        color: #333;
        font-weight: 400;
        letter-spacing: 0;
    }
    p{
        font-size: 14px;
        line-height: 30px;
        margin-top: 30px;
        color: #111;
    }
    ul{
        padding-left: 15px;
        li{
            color: #333;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 14px;
        }
    }
	@media screen and (max-width: 480px){
        h2{
            font-size: 24px;
        }
        ul{
            padding: 0;
            li{
                list-style-type: none;
            }
        }
    }
}
</style>
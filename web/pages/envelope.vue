<template>
    <div class="container">
        <Header :music="music" title="原本这个世界就有很多东西是没有什么意义的！"></Header>
        <section class="content">
            <div v-for="(item, index) in newData" :key="index" class="item">
                <div class="text" v-html="item.contentHtml"></div>
                <div class="time">{{item.newTime}}</div>
            </div>
        </section>
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
            music: 'https://image.raindays.cn/Myself-Resources/music/jingxin.mp3',
            loading: true
        }
    },
    head () {
        return {
            title: 'Envelope | 白茶'
        }
    },
    computed: {
        newData(){
            if(this.data){
                // 添加时间
                this.data.forEach(item => {
                    let time = this.dateDiff(item.time);
                    item['newTime'] = time;
                })
                return this.data;
            }
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
            this.$wxShare(this, 4);
        })
        
    },
    methods: {
        dateDiff(time) {
            const timestemp = new Date(time).getTime();
 
            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const halfamonth = day * 15;
            const month = day * 30;
            const now = new Date().getTime();
            const diffValue = now - timestemp;

            // 如果本地时间反而小于变量时间
            if (diffValue < 0) {
                return 'Just Now';
            }

            // 计算差异时间的量级
            const monthC = diffValue / month;
            const weekC = diffValue / (7 * day);
            const dayC = diffValue / day;
            const hourC = diffValue / hour;
            const minC = diffValue / minute;

            if (monthC > 4) {
                const date = new Date(timestemp);
                const mon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return mon[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
            } else {
                const map = {
                    [monthC]: "months ago",
                    [weekC]: "weeks ago",
                    [dayC]: "days ago",
                    [hourC]: "hours ago",
                    [minC]: "minutes ago",
                }
                for(let i in map){
                    if(i >= 1){
                        return `${parseInt(i)} ${map[i]}`
                    }
                }
                return 'Just Now';
            }
        }
    },
    async asyncData(context){
        if (!process.server) { // 防止重复加载
			return;
		}
        let {data} = await context.$axios.get('envelope')
		return {data: data}
    },
}
</script>

<style lang="scss" scoped>
.container{
    min-height: 100vh;
    background: #eef5ff;
}
.content{
    width: 700px;
    margin: auto;
    padding: 90px 0 50px;
    .item{
        margin-bottom: 30px;
        background: #fff;
        padding: 30px 30px 20px;
        border-radius: 6px;
        .text{
            color: #333;
            /deep/ .hljs-right{
                text-align: right;
            }
        }
        .time{
            font-size: 13px;
            text-align: right;
            margin-top: 14px;
            color: #888;
        }
    }
}
@media screen and (max-width: 700px){
    .content{
        width: 100%;
        padding: 80px 20px 20px;
    }
}
@media screen and (max-width: 500px){
    .content{
        width: 100%;
        padding: 70px 20px 10px;
        .item{
            padding: 20px;
            margin-bottom: 18px;
        }
    }
}
</style>
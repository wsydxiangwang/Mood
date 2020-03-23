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
                    let time = this.dateDiff(item.time.date);
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
        dateDiff(timestamp) {
            
            var Time = new Date(timestamp);
            var timestemp = Time.getTime();
            
            // 补全为13位
            var arrTimestamp = (timestemp + '').split('');
            for (var start = 0; start < 13; start++) {
                if (!arrTimestamp[start]) {
                    arrTimestamp[start] = '0';
                }
            }
            timestemp = arrTimestamp.join('') * 1;
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - timestemp;

            // 如果本地时间反而小于变量时间
            if (diffValue < 0) {
                return '不久前';
            }
            // 计算差异时间的量级
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;

            // 数值补0方法
            var zero = function (value) {
                if (value < 10) {
                    return '0' + value;
                }
                return value;
            };

            // 使用
            if (monthC > 4) {
                return (function () {
                    var date = new Date(timestemp);
                    var mon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    return mon[date.getMonth()] + ' ' + zero(date.getDate()) + ', ' + date.getFullYear();
                })();
            } else if (monthC >= 1) {
                return parseInt(monthC) + " months ago";
            } else if (weekC >= 1) {
                return parseInt(weekC) + " weeks ago";
            } else if (dayC >= 1) {
                return parseInt(dayC) + " days ago";
            } else if (hourC >= 1) {
                return parseInt(hourC) + " hours ago";
            } else if (minC >= 1) {
                return parseInt(minC) + " minutes ago";
            } else {
                return 'Just';
            }   
        }
    },
    async asyncData(context){
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
<template>
    <div class="container">
        <header>
            <div class="l icon">
                <span class="logo" @click="toIndex">
                    <img src="../static/image/logo.png">
                </span>
            </div>
            <div class="r icon">
                <span class="myself" @click="myself">
                    <img src="../static/image/myself.png">
                </span>
            </div>
        </header>
        <section class="list">
            <div class="year-list" v-for="(val, key, idx) in newData" :key="idx">
                <h2 class="year">{{key}}年</h2>
                <ul class="mon-list" v-for="(vals, keys, idxs) in val" :key="idxs">
                    <li class="month">{{keys}}月 <span>（{{vals.length}}篇文章）</span></li>
                    <ul class="day-list">
                        <li v-for="(valss, keyss, idxss) in vals" :key="idxss">
                            <span>{{valss.time.day}}日:</span>
                            <span @click="viewArticle(valss.id)">{{valss.title}}</span>
                        </li>
                    </ul>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    // transition: 'article',
    data(){
        return{
            newData: ''
        }
    },
    head () {
        return {
            title: '白茶 | article'
        }
    },
    mounted(){
        this.newData = this.data.reduce((a,b)=>{
            var [ , year, date] = /(\d+)\/(\d+)/.exec(b.time.date);
            a[year] = a[year] || {};
            a[year][date] = a[year][date] || [];
            a[year][date].push(b);
            return a;
        }, {})
    },
    methods: {
        viewArticle(id){
            this.$router.push(`/${id}`)
        },
        myself(){
            this.$router.push('/myself')
        },
        toIndex(){
            this.$router.push('/')
        },
    },
    async asyncData(context){
		let {data} = await context.$axios.get('article')
		return {data: data}
	},
}
</script>

<style lang="scss" scoped> 
// .article-enter, .article-leave-active {
//   transition: all .3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
// }
// .article-enter, .article-leave-active {
//   transform: translateX(100%);
// }
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
.list{
    width: 700px;
    padding: 120px 0 80px;
    margin: auto;
    .year-list{
        padding: 10px 20px;
    }
    .year{
        color: #333;
        font-size: 22px;
        font-weight: 400;
        margin: 10px 0 15px;
    }
    .mon-list{
        padding-left: 20px;
        margin-top: 10px;
        .month{
            color: #333;
            font-weight: 400;
            span{
                color: #999;
                font-size: 13px;
                font-style: oblique;
            }
        }
        .day-list{
            margin-top: 10px;
            padding-left: 20px;
            li{
                margin: 18px 0;
                span:last-child{
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
} 
@media screen and (max-width: 700px){
    .list{
        width: 100%;
        padding: 80px 0 20px;
    }
}
</style>
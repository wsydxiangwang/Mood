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
                <!-- <h2 class="year">年</h2> -->
                <ul class="mon-list" v-for="(vals, keys, idxs) in val" :key="idxs">
                    <li class="month">{{key.slice(1, 5)}}-{{keys}}</li>
                    <ul class="day-list">
                        <li v-for="(valss, keyss, idxss) in vals" :key="idxss">
                            <div class="item-l">
                                <div class="img" @click="viewArticle(valss.id)"><img :src="valss.image"></div>
                                <div class="tit">
                                    <span @click="viewArticle(valss.id)">{{valss.title}}</span>
                                    <span>{{valss.like}} LIKE / {{valss.read}} READ</span>
                                </div>
                            </div>
                            <span class="item-r">{{valss.time.monthNum}}-{{valss.time.day}}</span>
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
            title: '白茶 | Article'
        }
    },
    mounted(){
        this.newData = this.data.reduce((a, b)=>{
            var [ , year, date] = /(\d+)\/(\d+)/.exec(b.time.date);
            a['_'+year] = a['_'+year] || {};
            a['_'+year][date] = a['_'+year][date] || [];
            a['_'+year][date].push(b);
            return a;
        }, {})
        console.log(this.newData)
    },
    methods: {
        viewArticle(id){
            this.$router.push(`/${id}`)
        },
        myself(){
            this.$router.push('/Libai')
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
    width: 640px;
    padding: 120px 0 0;
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
        .month{
            color: #6e7ab5;
            font-weight: 400;
            font-size: 18px;
            margin: 22px 0;
            list-style: none;
            position: relative;
            &:before{
                content: "";
                width: 12px;
                height: 12px;
                display: inline-block;
                background-color: #DCE8EC;
                border: 3px solid #AFCFFF;
                margin-right: 22px;
                border-radius: 50%;
                box-sizing: border-box;
            }
            span{
                color: #999;
                font-size: 13px;
                font-style: oblique;
            }
        }
        .day-list{
            padding-left: 30px;
            border-left: 1px solid #f3fafd;
            margin-left: 6px;
            li{
                margin: 0 0 25px;
                padding-bottom: 25px;
                border-bottom: 1px solid #F3FAFD;
                display: flex;
                justify-content: space-between;
                .item-l{
                    display: flex;
                    .img{
                        width: 42px;
                        height: 42px;
                        border-radius: 4px;
                        margin-right: 15px;
                        overflow: hidden;
                        cursor: pointer;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .tit{
                        display: flex;
                        flex-flow: column;
                        justify-content: space-around;
                        span:first-child{
                            color: #5b6773;
                            cursor: pointer;
                            transition: all .3s;
                            &:hover{
                                color: #024180;
                            }
                        }
                        span:last-child{
                            color: #a1a0d6;
                            font-size: 12px;
                            margin-top: 4px;
                            letter-spacing: 0;
                        }
                    }
                }
                .item-r{
                    color: #d2c6a3;
                    font-size: 13px;
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
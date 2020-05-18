<template>
    <div class="container">
        <Header :music="music" title="加油啦"></Header>
        <section class="list">
            <div class="year-list" v-for="(val, key, idx) in newData" :key="idx">

                <ul class="mon-list" v-for="(vals, keys, idxs) in val" :key="idxs">

                    <li class="month">{{keys.charAt(0) == 0 ? enMon[keys.slice(1, 2)] : enMon[keys]}}, {{key.slice(1, 5)}}</li>

                    <ul class="day-list">
                        <li v-for="(valss, keyss, idxss) in vals" :key="idxss">
                            <div class="item-l">
                                <div class="img" @click="viewArticle(valss.id)">
                                    <img :src="valss.image">
                                </div>
                                <div class="tit">
                                    <span @click="viewArticle(valss.id)">{{valss.title}}</span>
                                    <span>{{valss.like}} LIKE / {{valss.read}} READ</span>
                                </div>
                            </div>

                            <span class="item-r">{{valss.time.dayEn}}</span>
                            
                        </li>
                    </ul>
                </ul>
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
            newData: '',
            music: 'https://image.raindays.cn/music/shunjiandeyongheng.mp3',
            enMon: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            loading: true
        }
    },
    head () {
        return {
            title: 'Article | 白茶'
        }
    },
    mounted(){
        this.$nextTick(() => {
            // 微信分享
            this.$wxShare(this, 3);
        })
        
        this.newData = this.data.reduce((a, b)=>{
            var [ , year, date] = /(\d+)\/(\d+)/.exec(b.time.date);
            a['_'+year] = a['_'+year] || {};
            a['_'+year][date] = a['_'+year][date] || [];
            a['_'+year][date].push(b);
            return a;
        }, {})

        //loading
        document.body.style.overflowY = 'hidden';
        setTimeout(() => {
            this.loading = false;
            document.body.style.overflowY = '';
        }, 800)
    },
    methods: {
        viewArticle(id){
            this.$router.push(`/${id}`)
        },
    },
    async asyncData(context){
        let {data} = await context.$axios.get('article', {
                params: {
                    count: 100
                }
            })
        return {
            data: data
        }
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
                        width: 45px;
                        height: 45px;
                        border-radius: 4px;
                        margin-right: 15px;
                        overflow: hidden;
                        cursor: pointer;
                        img{
                            height: 100%;
                        }
                    }
                    .tit{
                        flex: 1;
                        display: flex;
                        flex-flow: column;
                        justify-content: space-around;
                        span:first-child{
                            color: #5b6773;
                            cursor: pointer;
                            font-size: 15px;
                            transition: all .3s;
                            &:hover{
                                color: #024180;
                            }
                        }
                        span:last-child{
                            color: #a1a0d6;
                            font-size: 13px;
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
        padding: 80px 20px 20px;
    }
}
@media screen and (max-width: 500px){
    .list{
        padding: 80px 10px 20px;
        .year-list{
            padding: 10px 10px 10px 6px;
        }
        .mon-list {
            .month{
                margin: 0 0 30px;
                &:before{
                    margin-right: 10px;
                }
            }
            .day-list{
                padding-left: 18px;
                li{
                    margin-bottom: 18px;
                    padding-bottom: 18px;
                    .item-l {
                        .img{
                            margin-right: 12px;
                        }
                        .tit span{
                            margin-bottom: 6px;
                        }
                    }
                    .item-r{
                        white-space: nowrap;
                        margin: 2px 0 0 10px;
                    }
                }
            } 
        }
        
    }
}
</style>
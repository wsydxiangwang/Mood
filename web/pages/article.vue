<template>
    <div class="container">
        <Header :music="music" title="加油啦" v-if="refresh"></Header>
        <section class="list">
            <div class="year-list" v-if="Object.keys(data.data).length == 0">
                空无一物，就像你我一样。
            </div>
            <div class="year-list" v-for="(val, key, idx) in data.data" :key="idx" v-else>

                <ul class="mon-list" v-for="(vals, keys, idxs) in val" :key="idxs">
                    <li class="month">{{enMon[Number(keys) - 1]}}, {{key.slice(1, 5)}}</li>

                    <ul class="day-list">
                        <li v-for="(child_val, child_key, child_idx) in vals" :key="child_idx">
                            <div class="item-l">
                                <div class="img" @click="viewArticle(child_val.id)">
                                    <img :src="child_val.image ? child_val.image.url : ''">
                                </div>
                                <div class="tit">
                                    <span @click="viewArticle(child_val.id)">{{child_val.title}}</span>
                                    <span>{{child_val.like}} LIKE / {{child_val.read}} READ</span>
                                </div>
                            </div>
                            <span class="item-r">{{child_val.time.day.en}}</span>
                        </li>
                    </ul>
                </ul>
            </div>
            <LoadMore :loadingType="loadingType"></LoadMore>
        </section>        
    </div>
</template>

<script>
export default {
    data(){
        return{
            newData: '',
            music: 'https://image.raindays.cn/music/shunjiandeyongheng.mp3',
            enMon: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            loadingType: 'more',
            refresh: true
        }
    },
    head () {
        return {
            title: `Article | ${this.info.web_name}`
        }
    },
    computed: {
		info(){
			return this.$store.state.data
		}
    },
    mounted(){
        // 背景音乐
        if(this.info.bg.bg_mood){
            this.music = this.info.bg.bg_mood
            this.refresh = false
            this.$nextTick(() => this.refresh = true )
        }

        if(this.data.totalPage > 1){
            window.addEventListener('scroll', this.load)
        }
    },
    destroyed(){
        this.$load('none')
        window.removeEventListener('scroll', this.load)
    },
    methods: {
        load(){
            const data = this.$load('article', { params: { from: 'list' }})

            if(typeof data === 'object'){
                this.loadingType = 'loading'
            }

            data && data.then(res => {
                if(res.status === 1){
                    const result = res.body.data;
                    // 合并数据
                    Object.keys(result).map(item => {
                        const [child_A, child_B] = [this.data.data[item], result[item]]
                        if(child_A){
                            Object.keys(child_B).map(i => this.data.data[item][i] = child_A[i] ? child_A[i].concat(child_B[i]) : child_B[i])
                        }else{
                            this.data.data[item] = child_B
                        }
                    })
                    // 最后一页
                    if(res.body.page == res.body.totalPage){
                        this.loadingType = 'nomore';
                        window.removeEventListener('scroll', this.load)
                    }else{
                        this.loadingType = 'more';
                    }
                    // 设置滚动条位置
                    this.$setScroll('.bottom-loading');
                }else{
                    this.loadingType = 'more';
                }
            }).catch(err => {
                this.loadingType = 'nomore';
            })
        },
        viewArticle(id){
            this.$router.push(`/${id}`)
        },
    },
    async asyncData(context){
        const {data} = await context.$axios.get('article', { 
            params: { from: 'list' }
        })
        return { data: data.status == 1 ? data.body : {}}
	}
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
    padding: 120px 0 40px;
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
                padding: 25px 0;
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
                        display: flex;
                        justify-content: center;
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
                            padding-bottom: 5px;
                            &:hover, &:focus{
                                color: #024180;
                                background: radial-gradient(circle at 10px -7px, transparent 8px, currentColor 8px, currentColor 9px, transparent 9px) repeat-x,
                                radial-gradient(circle at 10px 27px, transparent 8px, currentColor 8px, currentColor 9px, transparent 9px) repeat-x;
                                background-size: 20px 20px;
                                background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
                                animation: waveFlow 1s infinite linear;
                            }
                            @keyframes waveFlow {
                                from { background-position-x: -10px, 0; }
                                to { background-position-x: -30px, -20px; }
                            }
                        }
                        span:last-child{
                            color: #a1a0d6;
                            font-size: 13px;
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
<template>
    <div class="container">
        <Header :music="music" title="加油啦" v-if="refresh" />
        <section class="list">
            <div class="year-list" v-if="Object.keys(list.data).length == 0">
                空无一物，就像你我一样。
            </div>
            <template v-else>
                <div 
                    class="year-list" 
                    v-for="(val, key, idx) in list.data" 
                    :key="idx" 
                >
                    <ul 
                        class="month-list" 
                        v-for="(vals, keys, idxs) in val" 
                        :key="idxs"
                    >
                        <li class="month">{{ enMon[Number(keys) - 1] }}, {{ key.slice(1, 5) }}</li>
                        <ul class="day-list">
                            <li 
                                v-for="(child_val, child_key, child_idx) in vals" 
                                :key="child_idx"
                            >
                                <div class="item-l">
                                    <div class="img" @click="viewArticle(child_val.id)">
                                        <img :src="child_val.image.url || '/image/other/default.jpg'">
                                    </div>
                                    <div class="tit">
                                        <span @click="viewArticle(child_val.id)">{{ child_val.title }}</span>
                                        <span>{{ child_val.like }} LIKE / {{ child_val.read }} READ</span>
                                    </div>
                                </div>
                                <span class="item-r">{{ child_val.time.day.en }}</span>
                            </li>
                        </ul>
                    </ul>
                </div>
                <LoadMore />
            </template>
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
        if (this.info.page_music.mood) {
            this.music = this.info.page_music.mood
            this.refresh = false
            this.$nextTick(() => this.refresh = true )
        }
        this.$loadStatus(this.list)
    },
    methods: {
        load(){
            // const data = this.$load('article', { params: { from: 'list' }})

        },
        viewArticle(id){
            this.$router.push(`/${id}`)
        },
    },
    async asyncData(context){
        const { data } = await context.$axios.get('article', { 
            params: { from: 'list' }
        })
        return { list: data.status == 1 ? data.body : {}}
	}
}
</script>
<style lang="scss" scoped>
.list{
    width: 640px;
    padding: 80px 0 40px;
    margin: auto;
    .year-list{
        padding: 10px 20px;
    }
    .month-list{
        .month{
            color: #6e7ab5;
            font-weight: 400;
            font-size: 18px;
            margin: 30px 0 10px;
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
                color: var(--color-text-4);
                font-size: 13px;
                font-style: oblique;
            }
        }
        .day-list{
            padding-left: 30px;
            border-left: 1px solid var(--color-border-4);
            margin-left: 6px;
            li{
                padding: 25px 0;
                border-bottom: 1px solid var(--color-border-4);
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
                        border: 1px solid var(--color-border-4);
                        img{
                            height: 100%;
                        }
                    }
                    .tit{
                        flex: 1;
                        display: flex;
                        flex-flow: column;
                        align-items: start;
                        justify-content: space-around;
                        span:first-child{
                            color: var(--color-text-6);
                            cursor: pointer;
                            font-size: 15px;
                            padding-bottom: 5px;
                            transition: color .3s, backgroundColor .3s, backgroundPosition 0s;
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
        padding: 60px 10px 20px;
        .year-list{
            padding: 10px 10px 10px 6px;
        }
        .mon-list {
            .month:before{
                margin-right: 10px;
            }
            .day-list{
                padding-left: 18px;
                li{
                    padding: 18px 0;
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
<template>
    <div class="container">
        <Header 
            v-if="refresh" 
            :music="music" 
            :sticky="true" 
            title="予给你一封信"
        />
        <section class="content">
            <div v-if="!list.data || list.data.length == 0" class="data-null">
                空无一物，就像你我一样。
            </div>
            <template v-else>
                <div v-for="(item, index) in list.data" :key="index" class="item">
                    <div class="text" v-html="item.contentHtml"></div>
                    <div class="time">{{ item.time }}</div>
                </div>
                <LoadMore />
            </template>
        </section>
    </div>
</template>

<script>
import scrollMixin from '~/mixin/scroll.js'
export default {
    mixins: [scrollMixin],
    data(){
        return{
            music: '',
            refresh: true
        }
    },
    head () {
        return {
            title: `Hello ${this.info.base.name}`
        }
    },
    mounted(){
        if (this.info.page_music.letter) {
            this.music = this.info.page_music.letter
            this.refresh = false
            this.$nextTick(() => this.refresh = true)
        }
        this.$loadStatus(this.list)
        this.$watch('scroll_isBottom', (val) => {
            val && this.load()
        }, { immediate: true })
    },
    methods: {
        load() {
            this.$loadMore('envelope', (res) => {
                if (res.status === 1) {
                    this.list.data = this.list.data.concat(res.body.data)
                } else {
                    alert(JSON.stringify(res))
                }
            })
        }
    },
    computed: {
		info(){
			return this.$store.state.data
		}
    },
    async asyncData(context){
        let { data } = await context.$axios.get('envelope')
        return { list: data.status === 1 ? data.body : {} }
    }
}
</script>
<style lang="scss" scoped>
.data-null{
    text-align: center;
    font-size: 16px;
    letter-spacing: 4px;
    color: #313131;
}
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
        background: var(--color-bg-primary);
        padding: 30px 30px 20px;
        border-radius: 6px;
        transition: all .3s;
        &:hover{
            box-shadow: 0 1px 8px rgba(0, 132, 255, 0.3);
        }
        .text{
            color: #333;
            ::v-deep .hljs-right{
                text-align: right;
            }
        }
        .time{
            font-size: 13px;
            text-align: right;
            margin-top: 14px;
            color: var(--color-text-3);
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
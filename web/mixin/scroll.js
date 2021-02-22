// 滚动条事件
export default {
    data() {
        return {
            scrollFn: () => {}
        }
    },
    beforeMount() {
        this.scrollFn = this.$throttle(this.handleScroll, 100)
        window.addEventListener('scroll', this.scrollFn)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollFn)
    },
    methods: {
        handleScroll () {
            const t = this.getWin('scrollTop'),
                  h = this.getWin('scrollHeight'),
                  windwH = this.getWin('clientHeight');
            const data = {
                curScroll: t,
                isBottom: t + windwH >= h - 10
            }   
            this.$store.commit('scrollInfo', data)
        },
        getWin(type) {
            return document.documentElement[type] || document.body[type]
        }
    }
}

// 滚动条事件
export default {
    data() {
        return {
            curScroll: null,
            isScrollBottom: false,
            scrollFn: () => {}
        }
    },
    beforeMount() {
        this.scrollFn = this.$throttle(this.handleScroll, 100)
        window.addEventListener('scroll', this.scrollFn)
        this.handleScroll()
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollFn)
    },
    methods: {
        handleScroll () {
            const t = this.getWin('scrollTop'),
                  h = this.getWin('scrollHeight'),
                  windwH = this.getWin('clientHeight');
            this.curScroll = t
            this.isScrollBottom = t + windwH >= h - 10
        },
        getWin(type) {
            return document.documentElement[type] || document.body[type]
        }
    }
}

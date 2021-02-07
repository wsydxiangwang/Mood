<template>
    <div class="nav">
        <ul class="nav-list">
            <template v-for="(item, index) in list">
                <li 
                    :key="index"
                    v-if="show(item.url)"
                >
                    <a @click="toPage(item.url)">{{item.title}}</a>
                </li>
            </template>
        </ul>
        <div class="world">
            <span>Everywhere in the world has a similar life.</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Menu',
    props: {
        
    },
    data() {
        return {
            list: [
				{
					title: 'Article',
					url: 'article'
				},
				{
					title: 'Rainy',
					url: 'rain'
				},
				{
					title: 'Envelope',
					url: 'envelope'
				},
				{
					title: 'Subscribe',
                    url: 'subscribe',
				},
				{
					title: 'Message',
                    url: 'message',
				},
				{
					title: "About",
					url: 'about'
				}
			],
        }
    },
    methods: {
        show(type) {
            if (['subscribe', 'message'].includes(type)) {
                return this.$store.state.data.administrator[type]
            }
            return true
        },
		toPage(url){
			this.$router.push(`/${url}`)
		},
    }
}
</script>
<style lang="scss" scoped>
.nav{
    position: fixed;
    left: 0;
    top: -100%;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;	
    background: rgba(255, 255, 255, 0.96);
    transition: top 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    .world{
        width: 100%;
        position: absolute;
        bottom: 30px;
        display: block;
        text-align: center;
        color: var(--color-text-4);
        span{
            font-size: 16px;	
        }
    }
    .nav-list{
        width: 80%;
        display: block;
        text-align: center;
        margin-top: -120px;
        li{
            margin: 0 20px 20px;
            list-style: none;
            display: inline-block;
            a{
                font-size: 24px;
                cursor: pointer;
                color: var(--color-text-2);
                letter-spacing: 1px;
                &:hover{
                    color: var(--color-dark);
                }
            }
        }
    }
}
@media screen and (max-width: 780px){
    .nav .nav-list li a{
        font-size: 18px;
    }
}
@media screen and (max-width: 480px){
    .nav .world span{
        font-size: 14px;	
    }
}
</style>
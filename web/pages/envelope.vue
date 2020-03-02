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
        <section class="content">
            <div v-for="(item, index) in data" :key="index">
                <div v-html="item.contentHtml"></div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    head () {
        return {
            title: '白茶 | Envelope'
        }
    },
    async asyncData(context){
        let {data} = await context.$axios.get('envelope')
        console.log(data)
		return {data: data}
	},
}
</script>

<style lang="scss" scoped>
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
.content{
    width: 700px;
    margin: auto;
    padding: 120px 0 0;
}
</style>
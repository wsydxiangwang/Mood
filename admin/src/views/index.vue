<template>
    <div class="main">
		<sidebar></sidebar>
        <div class="container">
            <div class="content">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from "@/components/sidebar";
export default {
    components: { sidebar },
    created() {
        /**
         * 登录成功 无数据则获取
         */
        const data = this.$store.state.$data;
        if(Object.keys(data).length > 0){
            return
        }
        this.$http.get('/info').then(res => {
            const data = res.data.body;
            this.$store.commit('allData', data)
		})
    }
}
</script>

<style lang="scss" scoped>
.main{
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 5px 40px #d2eaff;
    max-width: 1200px;
    margin: auto;
    background: #0e8bff;
    .container{
        flex: 1;
        width: 100%;
        height: 100%;
        padding: 40px 0;
        border-radius: 20px;
        background: #fff;
        overflow: hidden;
        transition: all .3s;
        position: relative;
        .content{
            width: 100%;
            height: 100%;
            padding: 0 60px;
            overflow: auto;
            &::-webkit-scrollbar-track {
                background: #fff;
            }
            &::-webkit-scrollbar-thumb {
                background: #eef7ff;
            }
            &::-webkit-scrollbar {
                width: 6px;
            }
            /deep/ .el-pagination{
                position: absolute;
                bottom: 20px;
                left: 0;
                right: 0;
                background: white;
                z-index: 9;
                padding: 15px 0;
                text-align: center;
                font-weight: 400;
            }
        }
    }
}


@media screen and (max-width: 600px) {
.main{
    background: none;
    .container{
        padding: 10px 0;
        .content{
            padding: 20px;
        }
    }
}
}
</style>
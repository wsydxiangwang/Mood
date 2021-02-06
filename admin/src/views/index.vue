<template>
    <div class="main">
		<Sidebar></Sidebar>
        <div class="container">
            <div class="content">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
export default {
    components: { Sidebar }
}
</script>

<style lang="scss" scoped>
.main{
    display: flex;
    width: 100%;
    height: 800px;
    max-height: 90vh;
    max-width: 1200px;
    border-radius: 20px;
    margin: auto;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 5px 40px #d2eaff;
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
            padding: 0 80px;
            overflow: auto;
            &::-webkit-scrollbar-track {
                background: #fff;
            }
            &::-webkit-scrollbar-thumb {
                background: #eef7ff;
            }
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            ::v-deep .el-pagination{
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
        max-height: 100vh;
        .container{
            padding: 0;
            .content{
                padding: 20px;
            }
        }
    }
}
</style>
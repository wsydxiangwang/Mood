<template>
    <div class="main">
		<sidebar></sidebar>
        <div class="content">
            <router-view/>
        </div>
    </div>
</template>

<script>
import sidebar from "@/components/sidebar";
export default {
	components: {
		sidebar
	},
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
    box-shadow: 0 10px 30px #d9d9d9;
    max-width: 1400px;
    margin: auto;
    .content{
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 80px;
        &::-webkit-scrollbar-track {
            background: #fff;
        }
        &::-webkit-scrollbar-thumb {
            background: #eef7ff;
        }
        &::-webkit-scrollbar {
            width: 6px;
        }
    }
}


@media screen and (max-width: 600px) {
.main .content{
    padding: 0;
}
}
</style>
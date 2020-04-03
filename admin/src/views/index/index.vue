<template>
    <div>
		<h2>你好，我是李白！</h2>
        <br>
        <br>
        原本这个世界就有很多东西是并没有什么意义的。
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
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .content{
        width: 100%;
        height: 100vh;
        overflow: auto;
        padding: 20px;
    }
}
</style>
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
	components: {
		sidebar
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
    max-width: 1400px;
    margin: auto;
    background: #0e8bff;
    .container{
        width: 100%;
        height: 100%;
        padding: 40px 0;
        border-radius: 20px;
        background: #fff;
        overflow: hidden;
        transition: all .3s;
        .content{
            width: 100%;
            height: 100%;
            padding: 30px 60px;
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
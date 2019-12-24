<template>
    <!-- <div class="container">
        <h1 class="title">{{data.title}}</h1>
        <div class="stuff">
            <span>{{data.category}}</span>
            <span>{{data.like}}</span>
            <span>{{data.comment}}</span>
            <span>{{data.time}}</span>
            <span v-if="data.stick">置顶</span>
        </div>
        <div class="content">
            <div v-html="data.contentHtml"></div>
        </div>
        <div class="comment">
            <h2>评论列表</h2>
        </div>
    </div> -->
</template>

<script>
export default {
    data(){
        return{
            data: ''
        }
    },
    created() {
        console.log(this.$route.query.data)
        this.data = this.$route.query.data;
    }
}
</script>
<template>
    <div></div>
</template>

<script>
export default {
    data() {
        return {
            categoryList: ''
        }
    },
    methods: {
        async fetch(){
            const res = await this.$http.get('/category');
            this.categoryList = res.data;
        }
    }
}
</script>
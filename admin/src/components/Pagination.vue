<template>
    <el-pagination
        background
        :page-size="10"
        :pager-count="5"
        :total="data"
        :current-page="page"
        @current-change="load"
        layout="prev, pager, next"
        v-if="data > 0"
    >
    </el-pagination>
</template>

<script>
export default {
    props: {
        data: {
            type: Number,
            default: 0
        },
        page: {
            type: Number,
            default: 1
        }
    },
    methods: {
        load(num) {
            this.$emit('update', num)
        }
    }
}
</script>
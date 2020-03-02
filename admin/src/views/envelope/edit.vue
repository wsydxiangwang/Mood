<template>
    <div class="edit">

        <mavon-editor @change="change"  v-model="isData" ref="md" style="height: 70vh"/>

        <section>
            <date v-if="isReset" @getDate="getDate" :originalDate="originalDate"></date>
        </section>

        <button class="submit" @click="submit">提交</button>
    </div>
</template>

<script>
import date from '@/components/date'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        date,
        mavonEditor
    },
    data() {
        return {
            dataAll: '',
            originalDate: '',
            isReset: ''
        }
    },
    computed: {
        isData: {
            get(){
                if(this.dataAll){
                    return this.dataAll.content
                }else{
                    return ''
                }
            },
            set(v){}
        }
    },
    methods: {
        getDate(e){
            this.dataAll.time = e;
        },
        change(value, render){
            this.dataAll.content = value;              // 输入的内容
            this.dataAll.contentHtml = render;     // render 为 markdown 解析后的结果[html]
        },
        async submit(){
            const res = await this.$http.put(`/envelope/${this.dataAll._id}`, this.dataAll)
        },
        async loadData(){
            let id = this.$route.query.id;
            let res = await this.$http.get(`envelope/${id}`)

            this.dataAll = res.data;
            this.originalDate = res.data.time;

            this.isReset = false;
            this.$nextTick(() => {
                this.isReset = true;
            })
        },
    },
    created() {
        this.loadData()
    },
    
}
</script>

<style lang="scss" scoped>
section{
    padding: 10px;
    margin: 20px 0;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    input{
        width: 100%;
        height: 38px;
        padding: 0 10px;
        border: 1px solid #eee;
        margin: 10px 0;
    }
}
.submit{
    width: 200px;
    height: 40px;
    font-size: 14px;
    margin-top: 20px;
    border: none;
    background: #2196F3;
    color: #fff;
}
</style>
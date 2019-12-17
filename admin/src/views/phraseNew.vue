<template>
    <div class="phrase-new">
        <h1>标题</h1>
        <input type="text" placeholder="标题">

        <mavon-editor @change="change" v-model="content" ref="md" />



        <section>
            <div class="state">
                <div>时间</div>
            </div>
        </section>

        <section>
            <div class="category">

            </div>
        </section>

        <section>
            <div class="intro">
                <input type="text" placeholder="简介">
            </div>
        </section>

        <section>
            <div class="picture">
                <input type="text" placeholder="图片链接">
            </div>
        </section>


        <button @click="submit">提交</button>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        mavonEditor
    },
    data() {
        return {
            content: '',        // 输入的markdown
            html: '',           // 及时转的html
        }
    },
    methods: {
        change(value, render){
            this.html = render;     // render 为 markdown 解析后的结果[html]
        },
        submit(){
            let data = {
                content: this.html
            }
            this.$http.post('categories', data).then(res => {
                console.log(res)
            })
        }
    }
}
</script>

<style lang="scss">

</style>
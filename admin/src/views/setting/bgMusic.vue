<template>
  <section>
    <h2 class="tit">页面音乐</h2>
    <template v-for="(v, k, i) in list">
      <el-form-item :label="v" :key="i">
        <el-input v-model="form[k]"></el-input>
      </el-form-item>
    </template>
  </section>
</template>

<script>
export default {
  name: 'BgMusic',
  props: {
    data: {
      type: Object || null,
      default: () => {}
    }
  },
  data() {
    return {
      list: {
        mood: '文章列表',
        letter: '短语列表',
        subscribe: '订阅页面',
        message: '留言页面',
        about: '个人介绍',
      },
      form: {}
    }
  },
  watch: {
    data(val, originVal){
      if (originVal == null) {
        this.form = JSON.parse(JSON.stringify(val))
      }
    },
    form: {
      handler(data){
        this.$emit('updateForm', {
          type: 'bgMusic',
          data
        })
      },
      deep: true
    }
  }
}
</script>
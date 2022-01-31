<template>
  <section>
    <h2 class="tit">前台管理</h2>
    <template v-for="(v, k, i) in list">
      <el-form-item :label="v" :key="i">
        <el-input 
          v-if="['name', 'email', 'mark', 'verificationCode'].includes(k)"
          v-model="form[k]"
        ></el-input>
        <el-switch 
          v-else
          v-model="form[k]"
        ></el-switch>
      </el-form-item>
    </template>
  </section>
</template>
<script>
export default {
  name: 'Website',
  props: {
    data: {
      type: Object || null,
      default: () => {}
    }
  },
  data() {
    return {
      list: {
        email: '邮箱',
        name: '昵称',
        mark: '标识',
        verificationCode: '验证',
        comment: '评论通知',
        subscribe: '订阅通知',
        message: '留言页面',
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
          type: 'website',
          data
        })
      },
      deep: true
    }
  }
}
</script>
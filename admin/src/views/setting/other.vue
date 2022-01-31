<template>
  <section>
    <h2 class="tit">其他信息</h2>
    <template v-for="(v, k, i) in list">
      <el-form-item :label="v" :key="i">
        <el-input v-model="form[k]"></el-input>
      </el-form-item>
    </template>
  </section>
</template>
<script>
export default {
  name: 'Other',
  props: {
    data: {
      type: Object || null,
      default: () => {}
    }
  },
  data() {
    return {
      list: {
        icpNumber: '备案号',
        icpLink: '备案链接'
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
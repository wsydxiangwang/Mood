<template>
	<el-date-picker
		v-model="value"
		type="datetime"
		placeholder="选择日期时间"
		value-format="timestamp"
	>
	</el-date-picker>
</template>

<script>
export default {
	name: 'Date',
	props: ['originalDate'],
	data() {
		return {
			value: '',
		}
	},
	watch: {
		value(timestamp) {
			this.$emit('getDate', timestamp)
		},
		originalDate(val) {
			this.value = this.originalDate
		},
	},
}
</script>

<template>
	<div>
		<el-form>
			<el-input placeholder="Please enter your email" v-model="email"></el-input>
			<el-button @click="sendEmail" :loading="loading">SUBMIT</el-button>
		</el-form>
		<p>
			<span class="el-icon-warning"></span>
			邮箱必须填写对应的 Emali PASS，才能发送邮件！
		</p>
	</div>
</template>

<script>
export default {
	name: 'ForgotPassword',
	data() {
		return {
			email: '',
			loading: false
		}
	},
	methods: {
		sendEmail() {
			this.loading = true
			this.$request(() =>
				this.$http
					.post('/forgotPassword', { email: this.email })
					.then(res => {
						let text = '发送成功'
						if (res.data.status == 1) {
							this.$emit('handleOpenPopup', {})
						} else {
							text = '发送失败'
						}
						this.$alert(res.data.body, text, {
							confirmButtonText: '确定',
						})
						this.loading = false
					})
			)
		},
	},
}
</script>

<style scoped lang="scss">
.el-input {
		margin-bottom: 12px;
	}
	button {
		border: none;
		background: #0b9aff;
		width: 100%;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all 0.3s;
		color: #fff;
		&:hover {
			color: #fff;
			background: #0486e2;
		}
	}
</style>
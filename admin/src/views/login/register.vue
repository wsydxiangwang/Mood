<template>
	<div class="register">
		<el-form>
			<template v-for="(val, key, idx) in formType">
				<template v-if="val == 'Email Type'">
					<el-form-item :label="val" :key="idx">
						<el-radio-group v-model="form[key]">
							<el-radio label="QQ"></el-radio>
							<el-radio label="163"></el-radio>
						</el-radio-group>
					</el-form-item>
				</template>
				<template v-else-if="val == 'Email PASS'">
					<el-tooltip
						class="item"
						effect="dark"
						content="在邮箱设置开启SMTP服务器可获取PASS码"
						placement="top"
						:key="idx"
					>
						<el-input
							v-model="form[key]"
							:placeholder="val"
						></el-input>
					</el-tooltip>
				</template>
				<template v-else>
					<el-input
						show-password
						:placeholder="val"
						v-model="form[key]"
						:key="idx"
						type="password"
						v-if="key == 'password' || key == 'passwords'"
					></el-input>
					<el-input
						:placeholder="val"
						v-model="form[key]"
						:key="idx"
						v-else
					></el-input>
				</template>
			</template>
			<el-button @click="register" :loading="loading">register</el-button>
		</el-form>
		<p><span class="el-icon-warning"></span> 安全考虑，账号只可注册一次！</p>
	</div>
</template>

<script>
export default {
	name: 'Register',
	data() {
		return {
			form: {},
			formType: {
				name: 'Name',
				password: 'Password',
				passwords: 'Confirm Password',
				email: 'Email',
				pass: 'Email PASS',
				emailType: 'Email Type',
			},
			loading: false
		}
	},
	methods: {
		register() {
			if (Object.keys(this.form).length != 6) {
				this.$message.error('请填写完整信息')
				return
			}
			if (this.form.password !== this.form.passwords) {
				this.$message.error('密码不一致')
				return
			}
			this.loading = true
			this.$request(
				() =>
					this.$http.post('/user', this.form).then(res => {
						if (res.data.status == 1) {
							this.$message.success(res.data.body.message)
							this.form = {}
							this.$emit('handleOpenPopup', {})
						} else {
							this.$alert(res.data.body, '注册失败', {
								confirmButtonText: '确定',
							})
						}
						this.loading = false
					}),
				'#app',
				false
			)
		},
	},
}
</script>


<style lang="scss" scoped>
.register {
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
		margin-top: 10px;
		color: #fff;
		&:hover {
			background: #0486e2;
		}
	}
}
</style>

<template>
	<div class="login-form">
		<h2>Welcome Home!</h2>
		<div class="form-item">
			<div class="ipt user">
				<el-input placeholder="Name" v-model="form.username"></el-input>
				<img src="@/assets/login-1.png" />
			</div>
			<div class="ipt pass">
				<el-input
					placeholder="Password"
					v-model="form.password"
					show-password
				></el-input>
				<img src="@/assets/login-2.png" />
			</div>
			<img src="@/assets/login-0.png" />
			<el-button @click="login" type="primary" :loading="loading">sign in</el-button>
			<p class="options">
				<span @click="showPopup('Create Account')">- register</span>
				or
				<span @click="showPopup('Forgot Password')">Password -</span>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			form: {},
			loading: false
		}
	},
	methods: {
		showPopup(name) {
			this.$emit('handleOpenPopup', {
				popupTitle: name,
			})
		},
		login() {
			this.loading = true
			this.$request(
				() =>
					this.$http.post('/login', this.form).then(res => {
						if (res.data.status === 1) {
							localStorage.setItem(
								'Authorization',
								res.data.body.token
							)
							this.$message.success('success')
							this.$router.push('/')
							this.$infoUpdate()
						} else {
							this.$message.error(res.data.body)
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

<style scoped lang="scss">
.login-form {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 380px;
	padding: 40px 0 24px;
	background: #fff;
	border-radius: 10px;
	text-align: center;
	transform: translate(-50%, -50%);
	box-shadow: 0 2px 10px #e6e6e6;
	z-index: 9;
	.form-item {
		padding: 0 50px;
		div img {
			display: none;
		}
		.ipt:focus-within {
			& ~ img {
				display: none;
			}
			img {
				display: block;
			}
			&.user img {
				width: 120px;
				height: 113px;
			}
			&.pass img {
				width: 103px;
				height: 84px;
				top: -60px;
			}
		}
		img {
			position: absolute;
			top: -80px;
			left: 50%;
			width: 120px;
			height: 95px;
			transform: translate(-50%, 0);
		}
		.options {
			color: #ccc;
			span {
				font-size: 12px;
				display: inline-block;
				margin-top: 6px;
				cursor: pointer;
				transition: all 0.3s;
				text-transform: uppercase;
				&:hover {
					color: #0b9aff;
				}
				&:last-child:hover {
					color: red;
				}
			}
		}
	}
	.el-input{
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
		&:hover {
			background: #0486e2;
		}
	}
	h2 {
		font-size: 22px;
		color: #0b9aff;
		letter-spacing: 2px;
		margin: 10px 0 24px;
	}
}
</style>
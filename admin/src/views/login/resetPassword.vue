<template>
	<div>
		<div class="reset-page">
			<img class="login" src="@/assets/login-0.png" />
			<h2>新密码!</h2>
			<el-form>
				<el-input
						show-password
						placeholder="Password"
						v-model="password"
						type="password"
					></el-input>
					<el-input
						show-password
						placeholder="Confirm Password"
						v-model="passwords"
						type="password"
					></el-input>
				<el-button :loading="loading">SUBMIT</el-button>
			</el-form>
		</div>
		<ul class="bg-bubbles">
			<li v-for="i in 10" :key="i"></li>
		</ul>
		<div class="hint">永远相信美好的事情即将发生...</div>
	</div>
	
</template>

<script>
export default {
  name: 'resetPassword',
	data() {
		return {
			loading: false,
			password: '',
			passwords: '',
		}
	},
	mounted(){
		const id = this.$route.query.id
		console.log('id', id)
		
	},
	methods: {
	
	}
}
</script>

<style scoped lang="scss">
.reset-page{
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 99;
	background: #fff;
	transform: translate(-50%, -50%);
	width: 380px;
	padding: 40px 40px 34px;
	text-align: center;
	border-radius: 10px;
	box-shadow: 0 2px 10px #e6e6e6;
	.login{
		position: absolute;
    top: -80px;
    left: 50%;
    width: 120px;
    height: 95px;
    transform: translate(-50%);
	}
	h2 {
		font-size: 22px;
		color: #0b9aff;
		letter-spacing: 2px;
		margin: 10px 0 24px;
	}
}
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
.bg-bubbles {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: linear-gradient(to bottom right, #50a3a2, #53e3a6);
	li {
		position: absolute;
		bottom: -160px;
		width: 60px;
		height: 60px;
		background-color: rgba(255, 255, 255, 0.15);
		list-style: none;
		animation: square 25s infinite;
		transition-timing-function: linear;
		&:nth-child(1) {
			left: 10%;
		}
		&:nth-child(2) {
			left: 20%;
			width: 90px;
			height: 90px;
			animation-delay: 2s;
			animation-duration: 7s;
			border-radius: 50%;
		}
		&:nth-child(3) {
			left: 25%;
			animation-delay: 4s;
		}
		&:nth-child(4) {
			left: 40%;
			width: 60px;
			height: 60px;
			animation-duration: 8s;
			background-color: rgba(255, 255, 255, 0.3);
		}
		&:nth-child(5) {
			left: 70%;
			border-radius: 50%;
		}
		&:nth-child(6) {
			left: 80%;
			width: 100px;
			height: 100px;
			animation-delay: 3s;
			background-color: rgba(255, 255, 255, 0.2);
		}
		&:nth-child(7) {
			left: 32%;
			width: 120px;
			height: 120px;
			animation-delay: 2s;
		}
		&:nth-child(8) {
			left: 55%;
			width: 40px;
			height: 40px;
			animation-delay: 4s;
			animation-duration: 15s;
			border-radius: 50%;
		}
		&:nth-child(9) {
			left: 25%;
			width: 20px;
			height: 20px;
			animation-delay: 2s;
			animation-duration: 12s;
			background-color: rgba(255, 255, 255, 0.3);
		}
		&:nth-child(10) {
			left: 85%;
			width: 120px;
			height: 120px;
			animation-delay: 5s;
			border-radius: 50%;
		}
	}
	// 自定义 square 动画；
	@keyframes square {
		0% {
			opacity: 0.5;
			transform: translateY(0px) rotate(0);
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-90vh) rotate(360deg);
		}
	}
}
</style>
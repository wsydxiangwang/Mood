<template>
	<div class="login-page">
		<Login @handleOpenPopup="handleOpenPopup"></Login>
		<ul class="bg-bubbles">
			<li v-for="i in 10" :key="i"></li>
		</ul>

		<div class="hint">永远相信美好的事情即将发生...</div>

		<transition name="fade">
			<section class="create" v-if="popupTitle">
				<div class="create-form">
					<h3>{{ popupTitle }}</h3>
					<template v-if="popupTitle == 'Create Account'">
						<Register @handleOpenPopup="handleOpenPopup"></Register>
					</template>
					<template v-else>
						<ForgotPassword @handleOpenPopup="handleOpenPopup"></ForgotPassword>
					</template>
					<span
						@click="closePopup"
						class="el-icon-circle-close"
					></span>
				</div>
			</section>
		</transition>
	</div>
</template>

<script>
import Login from './login.vue'
import Register from './register.vue'
import ForgotPassword from './forgotPassword.vue'
export default {
	components: {
		Login,
		Register,
		ForgotPassword,
	},
	data() {
		return {
			popupTitle: '',
		}
	},
	methods: {
		handleOpenPopup({ popupTitle }) {
			this.popupTitle = popupTitle
		},
		closePopup() {
			this.popupTitle = ''
		},
	},
}
</script>
<style lang="scss" scoped>
.el-icon-circle-close {
	position: absolute;
	right: 15px;
	top: 15px;
	font-size: 18px;
	color: #d2d2d2;
	cursor: pointer;
	transition: all 0.3s;
	&:hover {
		color: #0486e2;
	}
}
.create {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: center;
	&::before {
		content: '';
		background: rgba(0, 0, 0, 0.5);
		display: block;
		height: 100%;
		width: 100%;
		position: absolute;
	}
	.create-form {
		background: #fff;
		width: 430px;
		z-index: 99;
		padding: 40px 50px 30px;
		border-radius: 10px;
		box-shadow: 0 2px 10px #e6e6e6;
		position: relative;
		h3 {
			text-align: center;
			color: #409eff;
			font-size: 20px;
			margin-bottom: 40px;
			font-weight: 400;
			letter-spacing: 2px;
		}
		::v-deep {
			p {
				font-size: 12px;
				color: #b5b5b5;
				margin-top: 10px;
				text-align: center;
			}
			// input {
			// 	width: 100%;
			// 	height: 44px;
			// 	border-radius: 4px;
			// 	border: 1px solid #eee;
			// 	font-size: 14px;
			// 	padding: 0 12px;
			// 	color: #606060;
			// 	transition: all 0.3s;
			// 	outline: none;
			// 	&:hover {
			// 		border-color: #0b9aff;
			// 	}
			// }
			// button {
			// 	border: none;
			// 	color: #fff;
			// 	background: #0b9aff;
			// 	height: 40px;
			// 	font-size: 16px;
			// 	border-radius: 4px;
			// 	cursor: pointer;
			// 	display: block;
			// 	width: 100%;
			// 	text-transform: uppercase;
			// 	letter-spacing: 1px;
			// 	transition: all 0.3s;
			// 	outline: none;
			// 	&:hover {
			// 		background: #0486e2;
			// 	}
			// }
			// .el-input {
			// 	margin-bottom: 12px;
			// 	input {
			// 		height: 44px;
			// 		line-height: 44px;
			// 		border-color: #eee;
			// 	}
			// }
			// .el-form-item {
			// 	margin-bottom: 20px;
			// }
		}
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.hint {
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%);
	color: #fff;
	font-size: 12px;
	text-align: center;
	letter-spacing: 1px;
	z-index: 99;
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
input::-webkit-input-placeholder {
	color: #bbbbbb;
}
input::-moz-placeholder {
	/* Mozilla Firefox 19+ */
	color: #bbbbbb;
}
　　 input:-moz-placeholder {
	/* Mozilla Firefox 4 to 18 */
	color: #bbbbbb;
}
input:-ms-input-placeholder {
	/* Internet Explorer 10-1*/
	color: #bbbbbb;
}

@media screen and (max-width: 600px) {
	.form {
		max-width: 90%;
		width: 400px;
		.form-item {
			padding: 0 40px;
		}
	}
	.create .create-form {
		max-width: 90%;
		width: 400px;
		padding: 40px 30px 20px;
	}
}
</style>

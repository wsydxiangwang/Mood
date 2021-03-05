<template>
	<div 
		class="puzzle-container"
		:class="status"
	>
		<div class="puzzle-header">
			<span class="puzzle-header-left">拖动下方滑块完成拼图</span>
			<div>
				<span class="re-btn iconfont icon-shuaxin2" @click="refreshImg"></span>
				<span class="close-btn iconfont icon-close2" @click="closeVerificationBox"></span>
			</div>
		</div>

		<div class="puzzle-content">
			<div class="puzzle-image">
				<img id="scream" ref="scream" :src="imgRandom" />
				<canvas id="puzzle-box" ref="puzzleBox"></canvas>
			</div>
			<div
				class="puzzle-lost-box"
				:style="'left:' + left_Num + 'px;'"
			>
				<canvas id="puzzle-lost" ref="puzzleShow"></canvas>
			</div>
			<p 
				class="ver-tips"
				:class="{'slider-tips': displayTips, 'success': verification}" 
			>
				<span class="iconfont" :class="verification ? 'icon-success' : 'icon-close'"></span>
				<span>{{ verification ? '验证通过' : '验证失败，请移动到正确位置！'}}</span>
			</p>
		</div>

		<div class="slider-container">
			<div class="slider-bar"></div>
			<div 
				class="slider-btn"
				ref="sliderBtn"
				@mousedown="startMove"
				@touchstart="startMove"
			>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "puzzleVerification",
	data() {
		return {
			isVerificationShow: 0,
			moveStart: "",
			displayTips: false,
			verification: false,
			randomX: null,
			randomY: null,
			imgRandom: "",
			left_Num: 0,

			refList: ['puzzleBox', 'puzzleShow']
		}
	},
	watch: {
		verificationShow(val) {
			this.isVerificationShow = val
		}
	},
	computed: {
		status() {
			const o = {
				0: '',
				1: 'show',
				2: 'exit'
			}
			return o[this.isVerificationShow]
		}
	},
	props: {
    	// 画布图片的尺寸
		width: {
			type: [String, Number],
			default: 260
		},
		height: {
			type: [String, Number],
			default: 160
		},
		// 滑块的大小
		blockSize: {
			type: [String, Number],
			default: 40
		},
		// 误差
		deviation: {
			type: [String, Number],
			default: 4
		},
		// 滑块随机出现的范围
		wraperPadding: {
			type: [String, Number],
			default: 100
		},
		onSuccess: {
			type: Function,
			default: () => {}
		},
		onError: {
			type: Function,
			default: () => {}
		},
		verificationShow: {
			type: Number,
			default: 0
		}
	},
	mounted() {
		this.refList.forEach(i => {
			this.$refs[i]['width'] = this.width
			this.$refs[i]['height'] = this.height
		})
		this.$nextTick(this.initCanvas)
	},
	created() {
    	this.imgRandom = this.$store.state.data.cover.image
	},
	methods: {
		initCanvas() {
			this.clearCanvas()

			let w = this.width,
				h = this.height,
				PL_Size = this.blockSize,
				padding = this.wraperPadding,
				MinN_X = padding + PL_Size,
				MaxN_X = w - padding - PL_Size - PL_Size / 6,
				MaxN_Y = padding,
				MinN_Y = h - padding - PL_Size - PL_Size / 6;

			this.randomX = Math.round(Math.random() * (MaxN_X - PL_Size) + MinN_X)
			this.randomY = Math.round(Math.random() * MaxN_Y + MinN_Y)

			let X = this.randomX,
				Y = this.randomY,
				d = PL_Size / 3;

			this.left_Num = -X + 10
			this.refList.forEach(i => this.render(i, X, Y, d))
		},
		render(type, X, Y, d) {
			let canvas = this.$refs[type].getContext("2d")
			if (type == 'puzzleBox') {
				canvas.globalCompositeOperation = "xor"
				canvas.fillStyle = "rgba(255,255,255)"
			} else if (type == 'puzzleShow') {
				let w = this.width,
					h = this.height;
				let img = new Image()
				img.src = this.imgRandom
				img.onload = function() {
					canvas.drawImage(img, 0, 0, w, h);
				}
			}
			canvas.beginPath()
			canvas.moveTo(X, Y)
			canvas.lineTo(X + d, Y)
			canvas.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
			canvas.lineTo(X + 3 * d, Y)
			canvas.lineTo(X + 3 * d, Y + d)
			canvas.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
			canvas.lineTo(X + 3 * d, Y + 3 * d)
			canvas.lineTo(X, Y + 3 * d)
			canvas.closePath()

			if (type == 'puzzleShow') {
				canvas.clip()
			} else {
				canvas.strokeStyle = "rgba(0,0,0,0)"
				canvas.stroke()
				canvas.fill()
			}
		},
		closeVerificationBox() {
			this.isVerificationShow = 2
			this.$emit('clone', 'slider', false)
		},
		refreshImg() {
			this.initCanvas()
		},
		// 清空画布
		clearCanvas() {
			let c = this.$refs.puzzleBox;
			let c_l = this.$refs.puzzleShow;
			// let c_s = this.$refs.puzzleShadow;
			c.setAttribute("height", c.getAttribute("height"))
			c_l.setAttribute("height", c.getAttribute("height"))
			// c_s.setAttribute("height", c.getAttribute("height"))
		},
		// 按住滑块
		startMove(e) {
			e = e || window.event;
			this.$refs.sliderBtn.style.backgroundPosition = "0 -216px";
			this.moveStart = e.pageX || e.targetTouches[0].pageX;
			this.addMouseMoveListener();
		},
		// 滑块移动中
		moving(e) {
			e = e || window.event;
			let moveX = e.pageX || e.targetTouches[0].pageX;
			let d = moveX - this.moveStart;
			let w = this.width;
			let PL_Size = this.blockSize;
			let padding = this.wraperPadding;

			if (this.moveStart === "" || (d < 0 || d > w - padding - PL_Size + 90)) {
				return
			}
			for (let i of ['sliderBtn', 'puzzleShow']) {
				this.$refs[i].style.left = d + "px"
				this.$refs[i].style.transition = "inherit"
			}
		},
		// 移动结束，验证并回调
		moveEnd(e) {
			e = e || window.event;
			let moveEnd_X = (e.pageX || e.changedTouches[0].pageX) - this.moveStart;
			let ver_Num = this.randomX - 10;
			let deviationValue = this.deviation;
			let Min_left = ver_Num - deviationValue;
			let Max_left = ver_Num + deviationValue;

			const verResult = Max_left > moveEnd_X && moveEnd_X > Min_left

			if (this.moveStart !== "") {
				this.displayTips = true
				this.verification = verResult									
				setTimeout(() => {
					this.displayTips = false
					if (verResult) {
						this.onSuccess('slider', true)
					} else {
						this.initCanvas()
						this.onError()
					}
				}, 1000)
			}

			const result = ['sliderBtn', 'puzzleShow']
			
			if (result.every(i => typeof i !== 'undefined') && !verResult) {
				setTimeout(() => {
					for (let i of result) {
						this.$refs[i].style.left = 0
						this.$refs[i].style.transition = "left 0.5s"
					}
				}, 400)
				this.$refs.sliderBtn.style.backgroundPosition = "0 -84px";
			}
			this.moveStart = "";
		},
		addMouseMoveListener() {
			document.addEventListener("mousemove", this.moving);
			document.addEventListener("touchmove", this.moving);
			document.addEventListener("mouseup", this.moveEnd);
			document.addEventListener("touchend", this.moveEnd);
		}
	},
	beforeRouteLeave(to,from,next){
        document.removeEventListener("mousemove", self.moving);
        document.removeEventListener("touchmove", self.moving);
        document.removeEventListener("mouseup", self.moveEnd);
		document.removeEventListener("touchend", self.moveEnd);
	}
};
</script>

<style lang="scss" scoped>
.puzzle-container {
    display: inline-block;
    padding: 15px 15px 28px;
    background: var(--color-bg-primary);
    border-radius: 12px;
    position: fixed;
    top: calc(50% - 105px);
    left: 50%;
	box-shadow: 0 0 10px #dbdbdb;
	margin: 0 0 0 -145px;
	z-index: 99999;
	opacity: 0;
	visibility: hidden;
	transition: none;	
	&.show{
		animation: fadeInTop 0.6s both;
	}
	&.exit{
		animation: fadeInDown 0.6s both;
	}
	.puzzle-header {
		display: flex;
		justify-content: space-between;
		margin: 0 0 10px;
		.puzzle-header-left {
			color: #333;
		}
		.re-btn,
		.close-btn {
			font-size: 16px;
			cursor: pointer;
			color: var(--color-text-4);
		}
		.re-btn:hover {
			color: #67c23a;
		}
		.close-btn:hover {
			color: #f56c6c;
		}
		.close-btn {
			margin-left: 5px;
		}
	}
	.puzzle-content{
		position: relative;
		overflow: hidden;
		width: 260px;
		.puzzle-image{
			position: relative;
			width: 260px;
			height: 160px;
			img{
				width: 260px;
				height: 160px;
			}
		}
		.puzzle-lost-box{
			width: 260px;
			height: 160px;
		}
		.ver-tips {
			position: absolute;
			left: 0;
			bottom: -28px;
			background: rgba(255, 255, 255, 0.9);
			height: 28px;
			line-height: 30px;
			font-size: 12px;
			width: 100%;
			margin: 0;
			text-align: left;
			padding: 0 8px;
			transition: all 0.4s;
			span{
				transition: all .4s;
				color: red;
				font-size: 13px;
				transition: none;
			}
			&.success span{
				color: #0081ff;
			}
			&.slider-tips {
				bottom: 0;
			}
		}
	}
	.slider-container {
		position: relative;
		margin: 10px auto 0;
		min-height: 15px;
		transition: none;
		width: 260px;
		.slider-btn {
			position: absolute;
			width: 46px;
			height: 26px;
			left: 0;
			top: 0;
			z-index: 12;
			cursor: pointer;
			background-position: 0 -84px;
			transition: inherit;
			background: #0084ff;
			border-radius: 36px;
			box-shadow: 0 0px 2px #0081ff;
			display: flex;
			justify-content: center;
			align-items: center;
			user-select: none;
			span{
				width: 2px;
				height: 12px;
				background: var(--color-bg-primary);
				display: inline-block;
				margin: 2.5px;
			}
		}
		.slider-bar {
			height: 10px;
			border: 1px solid #e9e9e9;
			border-radius: 5px;
			background: #efefef;
			box-shadow: 0 1px 1px #f8fcff inset;
			position: absolute;
			width: 100%;
			top: 7px;
		}
	}
}
@keyframes fadeInTop {
	from {
		opacity: 0;
		visibility: hidden;
		transform: translate(0, 80px);
	}
	to {
		opacity: 1;
		visibility: visible;
		transform: translate(0, 0);
	}
}
@keyframes fadeInDown {
	from {
		opacity:1;
		visibility: visible;
		transform: translate(0, 0);
	}
	to {
		opacity: 0;
		visibility: hidden;
		transform: translate(0,-80px);
	}
}
#puzzle-box {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 22;
}
#puzzle-shadow {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 22;
}
#puzzle-lost {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 33;
}
.puzzle-lost-box {
	position: absolute;
	width: 260px;
	height: 116px;
	left: 0;
	top: 0;
	z-index: 111;
	transition: none;
}
@media screen and (max-width: 600px) {
	.puzzle-container{
		margin-top: 0;
	}
}
</style>
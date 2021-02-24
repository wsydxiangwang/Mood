<template>
	<div 
		class="puzzle-container"
	>

		<div class="puzzle-header">
			<span class="puzzle-header-left">拖动下方滑块完成拼图</span>
			<div>
				<span class="re-btn iconfont icon-shuaxin2" @click="refreshImg"></span>
				<span class="close-btn iconfont icon-close2" @click="closeVerificationBox"></span>
			</div>
		</div>

		<div :style="'position:relative;overflow:hidden;width:'+ width +'px;'">
			<div :style="'position:relative;width:' + width + 'px;height:' + height + 'px;'">
				<img
					id="scream"
					ref="scream"
					:src="imgRandom"
					:style="'width:' + width + 'px;height:' + height + 'px;'"
				/>
				<canvas id="puzzle-box" ref="puzzleBox"></canvas>
			</div>
			<div
				class="puzzle-lost-box"
				:style="'left:' + left_Num + 'px;width:' + width + 'px;height:' + height + 'px;'"
			>
				<canvas id="puzzle-shadow" ref="puzzleShadow"></canvas>
				<canvas id="puzzle-lost" ref="puzzleLost"></canvas>
			</div>
			<p :class="'ver-tips'+ (displayTips ? ' slider-tips' : '')" ref="verTips">
				<template v-if="verification">
					<span style="color:#42ca6b;" class="iconfont icon-success"></span>
					<span style="color:#42ca6b;">验证通过</span>
				</template>
				<template v-if="!verification">
					<span class="iconfont icon-close"></span>
					<span>验证失败，请移动到正确位置！</span>
				</template>
			</p>
		</div>

		<div class="slider-container" :style="'width:' + width + 'px;'">
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
			isVerificationShow: '',
			moveStart: "",
			displayTips: false,
			verification: false,
			randomX: null,
			randomY: null,
			imgRandom: "",
			left_Num: 0,	
		}
	},
	model: {
		prop: 'verificationShow',
		event: 'setVisible'
	},
	watch: {
		isVerificationShow(val) {
			this.$emit('setVisible', val);
		},
		verificationShow(val) {
			// console.log(val)
			this.isVerificationShow = val;
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
		// 图集
		// 验证码图片，可自行替换
		puzzleImgList: {
			type: Array,
			default: () => [
				"https://image.raindays.cn/Myself-Resources/coverPictureOriginal.png",
				"https://image.raindays.cn/Myself-Resources/coverPictureOriginal.png",
				"https://image.raindays.cn/Myself-Resources/coverPictureOriginal.png"
			]
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
		// 成功的回调
		onSuccess: {
			type: Function,
			default: () => {}
		},
		//  
		onError: {
			type: Function,
			default: () => {}
		},
		verificationShow: {
			type: Boolean,
			default: false
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.initCanvas();
		});
		['puzzleBox', 'puzzleShadow', 'puzzleLost'].forEach(i => {
			this.$refs[i]['width'] = this.width
			this.$refs[i]['height'] = this.height
		})
	},
	created() {
    	// 随机显示一张图片
		let imgRandomIndex = Math.round(
			Math.random() * (this.puzzleImgList.length - 1)
		);
    	this.imgRandom = this.puzzleImgList[imgRandomIndex];

		
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

			this.render('puzzleBox', X, Y, d)
			this.render('puzzleLost', X, Y, d)
			this.render('puzzleShadow', X, Y, d)
		},
		render(type, X, Y, d) {
			let canvas = this.$refs[type].getContext("2d")
			if (type == 'puzzleBox') {
				canvas.globalCompositeOperation = "xor"
				canvas.fillStyle = "rgba(255,255,255)"
			} else if (type == 'puzzleLost') {
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

			if (type == 'puzzleLost') {
				canvas.clip()
			} else {
				canvas.strokeStyle = "rgba(0,0,0,0)"
				canvas.stroke()
				canvas.fill()
			}
		},
		closeVerificationBox() {
			this.isVerificationShow = false;
			this.$emit('clone', true)
		},
		/* 刷新 */
		refreshImg() {
			let imgRandomIndex = Math.round(
				Math.random() * (this.puzzleImgList.length - 1)
			);
			this.imgRandom = this.puzzleImgList[imgRandomIndex];
			this.initCanvas();
		},
		/* 通过重置画布尺寸清空画布，这种方式更彻底 */
		clearCanvas() {
			let c = this.$refs.puzzleBox;
			let c_l = this.$refs.puzzleLost;
			let c_s = this.$refs.puzzleShadow;
			c.setAttribute("height", c.getAttribute("height"));
			c_l.setAttribute("height", c.getAttribute("height"));
			c_s.setAttribute("height", c.getAttribute("height"));
		},
		/* 按住滑块后初始化移动监听，记录初始位置 */
		startMove(e) {
			e = e || window.event;
			this.$refs.sliderBtn.style.backgroundPosition = "0 -216px";
			this.moveStart = e.pageX || e.targetTouches[0].pageX;
			this.addMouseMoveListener();
		},
		/* 滑块移动 */
		moving(e) {
			e = e || window.event;
			let moveX = e.pageX || e.targetTouches[0].pageX;
			let d = moveX - this.moveStart;
			let w = this.width;
			let PL_Size = this.blockSize;
			let padding = this.wraperPadding;

			if (this.moveStart === "") {
				return "";
			}
			if (d < 0 || d > w - padding - PL_Size + 90) {
				return "";
			}
			for (let i of ['sliderBtn', 'puzzleLost', 'puzzleShadow']) {
				this.$refs[i].style.left = d + "px";
				this.$refs[i].style.transition = "inherit";
			}
		},
		/* 移动结束，验证并回调 */
		moveEnd(e) {
			e = e || window.event;
			let moveEnd_X = (e.pageX || e.changedTouches[0].pageX) - this.moveStart;
			let ver_Num = this.randomX - 10;
			let deviationValue = this.deviation;
			let Min_left = ver_Num - deviationValue;
			let Max_left = ver_Num + deviationValue;
			if (this.moveStart !== "") {
				if (Max_left > moveEnd_X && moveEnd_X > Min_left) {
					this.displayTips = true;
					this.verification = true;
					setTimeout(() => {
						this.displayTips = false;
						this.initCanvas();
						this.onSuccess();
					}, 500);
				} else {
					this.displayTips = true;
					this.verification = false;
					setTimeout(() => {
						this.displayTips = false;
						this.initCanvas();
						this.onError();
					}, 800);
				}
			}

			const result = ['sliderBtn', 'puzzleLost', 'puzzleShadow']
			
			if (result.every(i => typeof i !== 'undefined')) {
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
        // 销毁滚动条事件
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
	// opacity: 0;
	// visibility: hidden;
	&.show{
		animation: fadeInTop 0.6s both;
	}
	&.exit{
		animation: fadeInDown 0.6s both;
	}
}
@media screen and (max-width: 600px) {
	.puzzle-container{
		margin-top: 0;
	}
}
@keyframes fadeInTop
{
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
@keyframes fadeInDown
{
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
.slider-container {
	position: relative;
	margin: 10px auto 0;
	min-height: 15px;
	transition: none;
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
		-moz-user-select:none; /*火狐*/
		-webkit-user-select:none; /*webkit浏览器*/
		-ms-user-select:none; /*IE10*/
		-khtml-user-select:none; /*早期浏览器*/
		user-select:none;
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
}
.slider-tips {
	bottom: 0;
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

</style>
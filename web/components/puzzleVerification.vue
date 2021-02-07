<template>
	<!-- 避免初始化在页面显示，若有更好的方法，发我邮件，我想学习 /笑哭 -->
	<div 
		class="puzzle-container" 
		:class="[isVerificationShow === true?'show':'', isVerificationShow === false?'exit':'',]"
	>
		<div class="puzzle-header">
			<span class="puzzle-header-left">拖动下方滑块完成拼图</span>
			<div>
				<span class="re-btn iconfont icon-shuaxin2" @click="refreshImg"></span>
				<span class="close-btn iconfont icon-close2" @click="closeVerificationBox"></span>
			</div>
		</div>
		<div :style="'position:relative;overflow:hidden;width:'+ dataWidth +'px;'">
			<div :style="'position:relative;width:' + dataWidth + 'px;height:' + dataHeight + 'px;'">
				<img
					id="scream"
					ref="scream"
					:src="imgRandom"
					:style="'width:' + dataWidth + 'px;height:' + dataHeight + 'px;'"
				/>
				<canvas id="puzzle-box" ref="puzzleBox" :width="dataWidth" :height="dataHeight"></canvas>
			</div>
			<div
				class="puzzle-lost-box"
				:style="'left:' + left_Num + 'px;width:' + dataWidth + 'px;height:' + dataHeight + 'px;'"
			>
				<canvas id="puzzle-shadow" ref="puzzleShadow" :width="dataWidth" :height="dataHeight"></canvas>
				<canvas id="puzzle-lost" ref="puzzleLost" :width="dataWidth" :height="dataHeight"></canvas>
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

		<div class="slider-container" :style="'width:' + dataWidth + 'px;'">
			<div class="slider-bar"></div>
			<div class="slider-btn" ref="sliderBtn" @mousedown="startMove" @touchstart="startMove"><span></span><span></span><span></span></div>
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
			dataWidth: null,
			dataHeight: null,
			puzzleSize: null, // 滑块的大小
			deviationValue: null,
			radius: null,
			padding: null,
			time: null
		};
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
		// 滑块的圆角大小
		blockRadius: {
			type: [String, Number],
			default: 4
		},
		// 滑块随机出现的范围
		wraperPadding: {
			type: [String, Number],
			default: 100
		},
		// 滑块形状 square  puzzle
		blockType: {
			type: String,
			default: 'square'
		},
		// 成功的回调
		onSuccess: {
			type: Function,
			default: () => {
			}
		},
		// 失败的回调
		onError: {
			type: Function,
			default: () => {
			}
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
	},
	created() {
    	// 随机显示一张图片
		let imgRandomIndex = Math.round(
			Math.random() * (this.puzzleImgList.length - 1)
		);
    	this.imgRandom = this.puzzleImgList[imgRandomIndex];
    
		this.puzzleSize = Number(this.blockSize);
		this.deviationValue = Number(this.deviation);
		this.radius = Number(this.blockRadius);
		this.dataWidth = Number(this.width);
		this.dataHeight = Number(this.height);
		this.padding = Number(this.wraperPadding);
	},
	methods: {
		/* 关闭验证 */
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
		/* 画布初始化 */
		initCanvas() {
			this.clearCanvas();
			let w = this.dataWidth;
			let h = this.dataHeight;
			let PL_Size = this.puzzleSize;
			let padding = this.padding;
			let MinN_X = padding + PL_Size;
			let MaxN_X = w - padding - PL_Size - PL_Size / 6;
			let MaxN_Y = padding;
			let MinN_Y = h - padding - PL_Size - PL_Size / 6;
			this.randomX = Math.round(Math.random() * (MaxN_X - PL_Size) + MinN_X);
			this.randomY = Math.round(Math.random() * MaxN_Y + MinN_Y);
			let X = this.randomX;
			let Y = this.randomY;
			this.left_Num = -X + 10;
			let d = PL_Size / 3;
			let radius = Number(this.radius);

			let c = this.$refs.puzzleBox;
			let c_l = this.$refs.puzzleLost;
			let c_s = this.$refs.puzzleShadow;
			let ctx = c.getContext("2d");
			let ctx_l = c_l.getContext("2d");
			let ctx_s = c_s.getContext("2d");
			ctx.globalCompositeOperation = "xor";
			// ctx.shadowBlur = 10;
			// ctx.shadowColor = "var(--color-bg-primary)";
			// ctx.shadowOffsetX = 3;
			// ctx.shadowOffsetY = 3;
			ctx.fillStyle = "rgba(255,255,255)";
			ctx.beginPath();
			// ctx.lineWidth = "1";
			ctx.strokeStyle = "rgba(0,0,0,0)";
			if (this.blockType === 'square') {
				ctx.arc(X + radius, Y + radius, radius, Math.PI, (Math.PI * 3) / 2);
				ctx.lineTo(PL_Size - radius + X, Y);
				ctx.arc(
					PL_Size - radius + X,
					radius + Y,
					radius,
					(Math.PI * 3) / 2,
					Math.PI * 2
				);
				ctx.lineTo(PL_Size + X, PL_Size + Y - radius);
				ctx.arc(
					PL_Size - radius + X,
					PL_Size - radius + Y,
					radius,
					0,
					(Math.PI * 1) / 2
				);
				ctx.lineTo(radius + X, PL_Size + Y);
				ctx.arc(
					radius + X,
					PL_Size - radius + Y,
					radius,
					(Math.PI * 1) / 2,
					Math.PI
				);
			} else {
				ctx.moveTo(X, Y)
				ctx.lineTo(X + d, Y)
				ctx.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
				ctx.lineTo(X + 3 * d, Y)
				ctx.lineTo(X + 3 * d, Y + d)
				ctx.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
				ctx.lineTo(X + 3 * d, Y + 3 * d)
				ctx.lineTo(X, Y + 3 * d)
			}
			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			let img = new Image();
			img.src = this.imgRandom;

			img.onload = function() {
				ctx_l.drawImage(img, 0, 0, w, h);
			};
			ctx_l.beginPath();
      		// ctx_l.strokeStyle = "rgba(0,0,0,0)";
			if (this.blockType === 'square') {
				ctx_l.arc(X + radius, Y + radius, radius, Math.PI, (Math.PI * 3) / 2);
				ctx_l.lineTo(PL_Size - radius + X, Y);
				ctx_l.arc(
					PL_Size - radius + X,
					radius + Y,
					radius,
					(Math.PI * 3) / 2,
					Math.PI * 2
				);
				ctx_l.lineTo(PL_Size + X, PL_Size + Y - radius);
				ctx_l.arc(
					PL_Size - radius + X,
					PL_Size - radius + Y,
					radius,
					0,
					(Math.PI * 1) / 2
				);
				ctx_l.lineTo(radius + X, PL_Size + Y);
				ctx_l.arc(
					radius + X,
					PL_Size - radius + Y,
					radius,
					(Math.PI * 1) / 2,
					Math.PI
				);
			} else {
				ctx_l.moveTo(X, Y)
				ctx_l.lineTo(X + d, Y)
				ctx_l.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
				ctx_l.lineTo(X + 3 * d, Y)
				ctx_l.lineTo(X + 3 * d, Y + d)
				ctx_l.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
				ctx_l.lineTo(X + 3 * d, Y + 3 * d)
				ctx_l.lineTo(X, Y + 3 * d)
			}
			ctx_l.closePath();
			// ctx_l.stroke();
			// ctx_l.shadowBlur = 10;
			// ctx_l.shadowColor = "black";
			// ctx_l.shadowColor="rgba(0,0,0,0)"
			ctx_l.clip();
			ctx_s.beginPath();
			// ctx_s.lineWidth = "0";
      		ctx_s.strokeStyle = "rgba(0,0,0,0)";
			if (this.blockType === 'square') {
				ctx_s.arc(X + radius, Y + radius, radius, Math.PI, (Math.PI * 3) / 2);
				ctx_s.lineTo(PL_Size - radius + X, Y);
				ctx_s.arc(
					PL_Size - radius + X,
					radius + Y,
					radius,
					(Math.PI * 3) / 2,
					Math.PI * 2
				);
				ctx_s.lineTo(PL_Size + X, PL_Size + Y - radius);
				ctx_s.arc(
					PL_Size - radius + X,
					PL_Size - radius + Y,
					radius,
					0,
					(Math.PI * 1) / 2
				);
				ctx_s.lineTo(radius + X, PL_Size + Y);
				ctx_s.arc(
					radius + X,
					PL_Size - radius + Y,
					radius,
					(Math.PI * 1) / 2,
					Math.PI
				);
			} else {
				ctx_s.moveTo(X, Y)
				ctx_s.lineTo(X + d, Y)
				ctx_s.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
				ctx_s.lineTo(X + 3 * d, Y)
				ctx_s.lineTo(X + 3 * d, Y + d)
				ctx_s.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
				ctx_s.lineTo(X + 3 * d, Y + 3 * d)
				ctx_s.lineTo(X, Y + 3 * d)
			}
			ctx_s.closePath();
			ctx_s.stroke();
			// ctx_s.shadowBlur = 10;
			// ctx_s.shadowColor = "rgba(0,0,0,.3)";
			ctx_s.fill();
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
			// console.log(e);
			e = e || window.event;
			this.$refs.sliderBtn.style.backgroundPosition = "0 -216px";
			this.moveStart = e.pageX || e.targetTouches[0].pageX;
			this.addMouseMoveListener();
		},
		/* 滑块移动 */
		moving(e) {
			let self = this;
			e = e || window.event;
			let moveX = e.pageX || e.targetTouches[0].pageX;
			let d = moveX - self.moveStart;
			let w = self.dataWidth;
			let PL_Size = this.puzzleSize;
			let padding = this.padding;
			if (self.moveStart === "") {
				return "";
			}
			if (d < 0 || d > w - padding - PL_Size + 90) {
				return "";
			}
			self.$refs.sliderBtn.style.left = d + "px";
			self.$refs.sliderBtn.style.transition = "inherit";
			self.$refs.puzzleLost.style.left = d + "px";
			self.$refs.puzzleLost.style.transition = "inherit";
			self.$refs.puzzleShadow.style.left = d + "px";
			self.$refs.puzzleShadow.style.transition = "inherit";
		},
		/* 移动结束，验证并回调 */
		moveEnd(e) {
			let self = this;
			e = e || window.event;
			let moveEnd_X = (e.pageX || e.changedTouches[0].pageX) - self.moveStart;
			let ver_Num = self.randomX - 10;
			let deviationValue = this.deviationValue;
			let Min_left = ver_Num - deviationValue;
			let Max_left = ver_Num + deviationValue;
			if (self.moveStart !== "") {
				if (Max_left > moveEnd_X && moveEnd_X > Min_left) {
					self.displayTips = true;
					self.verification = true;
					setTimeout(function() {
						self.displayTips = false;
						self.initCanvas();
						/* 成功的回调函数 */
						self.onSuccess();
					}, 500);
				} else {
					self.displayTips = true;
					self.verification = false;
					setTimeout(function() {
						self.displayTips = false;
						self.initCanvas();
						/* 失败的回调函数 */
						self.onError();
					}, 800);
				}
			}
			if (
				typeof self.$refs.sliderBtn !== "undefined" &&
				typeof self.$refs.puzzleLost !== "undefined" &&
				typeof self.$refs.puzzleShadow !== "undefined"
			) {
				setTimeout(function() {
					self.$refs.sliderBtn.style.left = 0;
					self.$refs.sliderBtn.style.transition = "left 0.5s";
					self.$refs.puzzleLost.style.left = 0;
					self.$refs.puzzleLost.style.transition = "left 0.5s";
					self.$refs.puzzleShadow.style.left = 0;
					self.$refs.puzzleShadow.style.transition = "left 0.5s";
				}, 400);
				self.$refs.sliderBtn.style.backgroundPosition = "0 -84px";
			}
			self.moveStart = "";
		},
		/* 全局绑定滑块移动与滑动结束，移动过程中鼠标可在页面任何位置 */
		addMouseMoveListener() {
			let self = this;
			document.addEventListener("mousemove", self.moving);
			document.addEventListener("touchmove", self.moving);
			document.addEventListener("mouseup", self.moveEnd);
			document.addEventListener("touchend", self.moveEnd);
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
    background: var(--color-bg-primary)fff;
    border-radius: 12px;
    position: fixed;
    top: calc(50% - 105px);
    left: 50%;
	box-shadow: 0 0 10px #dbdbdb;
	margin: 0 0 0 -145px;
	z-index: 99999;
	opacity: 0;
	visibility: hidden;
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
		color: red;
		font-size: 13px;
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
}

</style>
<template>
	<div class="container index" :class="{navActive: isNav}">
		<div class="cover">
			<div id="scene" :style="{height:boxH}">
				<div class="layer" data-depth="0.4" :style="layerStyle">
					<img id="image" :style="imgStyle" src="https://image.yeyucm.cn/Myself-Resources/coverPictureOriginal.png" width="1920" height="1080" @load="coverImgLoad">
				</div>
			</div>
			<div class="head">
				<div class="logo"><span class="icon icon-_20200223094858"></span></div>
				<div class="menu" @click="menu">
					<span class="iconfont" :class="isNav ? 'iconsearchclose' : 'iconmenu--fill'"></span>
				</div>
			</div>
			<div class="misk"></div>
			<div class="post">
				<div class="time">二月 24, 2020</div>
				<div class="title"><a @click="article(1103)">你好，我是李白！</a></div>
				<div class="describe">愿所有的美好如约而至，愿所有黑暗都能看到希望，我们都能微笑前行，人生没有完美，有些遗憾才美...</div>
			</div>
			<!-- menu -->
			<div class="nav">
				<ul class="nav-list">
					<li v-for="(item, index) in navList" :key="index">
						<a @click="toPage(item.url)">{{item.title}}</a>
					</li>
				</ul>
				<div class="world">
					<!-- <span>©2020 白茶.</span> -->
					<span>Everywhere in the world has a similar life.</span>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="post" v-for="(item, index) in articleList" :key="index">
				<div class="img-box" @click="article(item.id)">
					<img :src="item.image || 'https://image.yeyucm.cn/img/mood-NationalDay/5.jpg'" alt="">
				</div>
				<div class="info">
					<div class="time">{{item.time.monthTxt}}月 {{item.time.day}}, {{item.time.year}}</div>
					<div class="title"><a @click="article(item.id)">{{item.title}}</a></div>
					<div class="describe">{{item.describe}}</div>
					<div class="stuff">
						<span><i class="iconfont iconwenzi1"></i> {{item.words}}</span>
						<span><i class="iconfont iconeye"></i> {{item.read}}</span>
						<span><i class="iconfont iconheart1"></i> {{item.like}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="foot">
			<a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备18132517号</a>
		</div>

		<div class="cover-loading" v-if="loading">
			<span></span>
		</div>
	</div>
</template>

<script>
import Parallax from 'parallax-js'
export default {
	data(){
		return{
			layerStyle: {},
			imgStyle: {},
			timer: null,
			boxH: '100%',
			boxW: '100%',
			navList: [
				{
					title: 'Article',
					url: 'article'
				},
				{
					title: 'Rainy',
					url: 'rain'
				},
				{
					title: 'Envelope',
					url: 'envelope'
				},
				{
					title: 'Myself',
					url: 'Libai'
				}
			],
			isNav: false,
			loading: false
		}
	},
    head () {
        return {
            title: '白茶'
        }
	},
	async asyncData(context){
		let {data} = await context.$axios.get('article')
		return {articleList: data}
	},
	created(){
		this.loading = true;
	},
	mounted(){
		// loading
		document.body.style.overflowY = 'hidden';
		/**
		 * Cover Picture Start
		 */
		var scene = document.getElementById('scene');
		var parallaxInstance = new Parallax(scene, {
			relativeInput: true,
			clipRelativeInput: true,
		});
		setTimeout(() => {
			this.boxH = document.documentElement.clientHeight + 'px';
			this.boxW = document.documentElement.clientWidth + 'px';
			this.coverLayer()
		}, 10)	
		/**
		 * Cover Picture End
		 */
		// Browser window event
		window.onresize = () => {
			if(this.timer) clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				setTimeout(() => {
					this.boxH = document.documentElement.clientHeight + 'px';
					this.boxW = document.documentElement.clientWidth + 'px';
					this.coverLayer()
				})
			}, 100)
		}
	},
	// 
	destroyed(){
		window.onresize = null;
		document.body.style.overflowY = '';
		document.removeEventListener('touchmove', this.on, {passive: false})
    },
	methods: {
		// Cover image loading is complete
		coverImgLoad(e){
			setTimeout(() => {
				this.loading = false,
				document.body.style.overflowY = '';
			}, 1000)
		},
		// Other pages
		toPage(url){
			this.$router.push(`/${url}`)
		},
		// Nav
		menu(){
			this.isNav = !this.isNav;
			if(this.isNav){
				document.body.style.overflowY = 'hidden';
				document.addEventListener('touchmove', this.on, {passive: false})
			}else{
				document.body.style.overflowY = '';
				document.removeEventListener('touchmove', this.on, {passive: false})
			}
		},
		on(e){
			e.preventDefault()
		},
		// Cover Picture
		coverLayer(){
			var id = document.getElementById('scene'),
				_w = parseInt(this.boxW), 
                _h = parseInt(this.boxH), 
				x, y, i, e;

			e = (_w >= 1000 || _h >= 1000) ? 1000 : 500;

            if (_w >= _h) {
                i = _w / e * 50;
                y = i;
                x = i * _w / _h;
            } else {
                i = _h / e * 50;
                x = i;
                y = i * _h / _w;
            }

			let style = {
                width: _w + x + 'px',
                height: _h + y + 'px',
                marginLeft: - 0.5 * x + 'px',
                marginTop: - 0.5 * y + 'px'
			}

			this.layerStyle = Object.assign({}, this.layerStyle, style);

            this.coverImg() // Cover image calculation
		},
		// Cover image calculation
		coverImg(){
			var _width = parseInt(this.layerStyle.width), 
                _height = parseInt(this.layerStyle.height), 
				ratio = 1080 / 1920,
				style = {};

			if (_height / _width > ratio) {
				style['height'] = _height + 'px';
				style['width'] = _height / ratio + 'px';
			} else {
				style['height'] = _width * ratio + 'px';
				style['width'] = _width + 'px';
			}

			style['left'] = (_width - parseInt(style.width)) / 2 +'px';
			style['top'] = (_height - parseInt(style.height)) / 2 +'px';

			this.imgStyle = Object.assign({}, this.imgStyle, style);
		},
		// To view the article
		article(id){
			this.$router.push(`/${id}`)
		},
	}
};
</script>
<style lang="scss" scoped>
.index{
	.cover-loading{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999999;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		span{
			width: 15px;
			height: 15px;
			display: block;
			margin-top: -20px;
			border-radius: 50%;
			background: #808080;
			animation: Loading 2s both infinite;
		}
	}
	@keyframes Loading{
		5% { transform: scale(1); } 
		10% { transform:scale(0.95); }
		15% { transform:scale(0.9); }
		20% { transform:scale(0.8); }
		25% { transform:scale(0.7); }
		30% { transform:scale(0.6); }
		35% { transform:scale(0.5); }
		40% { transform:scale(0.4); }
		50% { transform:scale(0.3); }
		60% { transform:scale(0.4); }
		65% { transform:scale(0.5); }
		70% { transform:scale(0.6); }
		75% { transform:scale(0.7); }
		80% { transform:scale(0.8); }
		85% { transform:scale(0.85); }
		90% { transform:scale(0.9); }
		95% { transform:scale(0.95); }
		100% { transform:scale(1); }
	}
	#scene{
		height: 100%;
		position: relative;
		overflow: hidden;
		#image{
			position: absolute;
			max-width: none;
			display: block;
		}
	}
	.cover{
		width: 100%;
		height: 100vh;
		position: relative;
		z-index: 9999;
		overflow: hidden;
		.head{
			position: absolute;
			top: 70px;
			width: 100%;
			color: #fff;
			z-index: 99999;
			padding: 0 30px 0 24px;
			display: flex;
			justify-content: space-between;
			.logo{
				transition: all .3s;
				.icon{
					font-size: 36px;
					cursor: pointer;
				}
			}
			.menu{
				width: 30px;
				height: 30px;
				line-height: 32px;
				border-radius: 2px;
				cursor: pointer;
				color: #c36a52;
				text-align: center;
				background: rgba(255, 255, 255, 0.9);
				span{
					font-size: 20px;
				}
			}
		}
		.cover-bg{
			width: 100%;
			height: 100%;
			img{
				position: absolute;
			}
		}
		.misk{
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background-color: rgba(176, 14, 37, 0.7);
			clip-path: polygon(0 0, 25% 0, 60% 100%, 0% 100%);
		}
		.post{
			position: absolute;
			top: 54%;
			left: 10%;
			color: #fff;
			width: 30%;
			transform: translateY(-50%);
			.time{
				font-size: 12px;
			}
			.title{
				margin: 15px 0 30px;
				a{
					font-size: 28px;
					cursor: pointer;
					transition: all .3s;
					&:hover{
						text-decoration: underline;
					}
				}
			}
			.describe{
				line-height: 22px;
			}
		}
	}
	.content{
		width: 1200px;
		margin: auto;
		position: relative;
		padding-bottom: 100px;
		&:after{
			content: '';
			width: 1px;
			height: calc(100% + 100px);
			position: absolute;
			top: -100px;
			left: 50%;
			background: #eaeaea;
			z-index: 0;
		}
		.post{
			position: relative;
			margin-top: 100px;
			z-index: 1;
			.img-box{
				width: 680px;
				height: 440px;
				font-size: 0;
				display: inline-block;
				position: relative;
				cursor: pointer;
				z-index: 3;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				width: 500px;
				height: 400px;
				position: absolute;
				top: 20px;
				padding: 80px 100px 0 80px;
				border: 1px solid #eaeaea;
				.time{
					color: #999;
					font-size: 12px;
				}
				.title{
					margin-top: 5px;
					a{
						font-size: 24px;
						cursor: pointer;
						display: inline;
						&:hover{
							text-decoration: underline;
						}
					}
				}
				.describe{
					color: #666;
					font-size: 14px;
					line-height: 22px;
					margin-top: 10px;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 3;    /* 指定行数*/
					-webkit-box-orient: vertical;
					overflow: hidden; 
				}
				.stuff{
					font-size: 12px;
					color: #999;
					position: absolute;
					bottom: 80px;
					left: 80px;
					span{
						font-size: 12px;
						margin-right: 10px;
					}
				}
			}
			&:nth-child(odd){
				text-align: left;
				.info{
					left: 660px;
				}
			}
			&:nth-child(even){
				text-align: right;
				.info{
					text-align: left;
					right: 660px;
				}
			}
		}
	}
	.foot{
		text-align: center;
		a{
			margin: 0 auto;
			font-size: 13px;
			color: #666;
			text-decoration: none;
			display: inline-block;
			padding: 1px 0 2px;
		}
	}
	.nav{
		position: fixed;
		left: 0;
		top: -100%;
		width: 100%;
		height: 100%;
		z-index: 9999;
		background: rgba(255, 255, 255, 0.96);
		transition: top 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		.world{
			width: 100%;
			position: absolute;
			bottom: 30px;
			display: block;
			text-align: center;
			color: #999;
		}
		.nav-list{
			width: 80%;
			display: block;
			text-align: center;
			margin: 260px auto 0;
			li{
				margin: 0 20px 20px;
				list-style: none;
				display: inline-block;
				a{
					font-size: 20px;
					cursor: pointer;
					color: #666;
					letter-spacing: 1px;
					&:hover{
						color: #222;
					}
				}
			}
		}
	}
	@media screen and (max-width: 1200px){
		.content{
			width: 900px;
			.post{
				.img-box{
					width: 480px;
					height: 310px;
				}
				.info{
					top: 10px;
					width: 420px;
					height: 290px;
					padding: 50px 60px 0 60px;
					.stuff{
						bottom: 50px;
						left: 60px;
					}
				}
				&:nth-child(odd) .info{
					left: 450px;
				}
				&:nth-child(even) .info{
					right: 450px;
				}
			}
		}
	}
	@media screen and (max-width: 900px){
		.cover{
			.misk{
				clip-path: polygon(0 0, 220px 0, 700px 100%, 0% 100%);
			}
			.post{
				width: 40%;
				.title a{
					font-size: 20px;
				}
			}
		}
		.content{
			width: 100%;
			.post{
				margin-top: 60px;
				background: #fff;
				border-bottom: 1px solid #eaeaea;
				.img-box{
					width: 100%;
					height: auto;
					display: block;
					text-align: center;
					img{
						width: 680px;
						max-width: 100%;
					}
				}
				.info{
					position: static;
					width: 96%;
					padding: 30px 20px 40px;
					margin: auto;
					border: none;
					background: #fff;
					height: auto;
					.stuff{
						position: static;
						margin: 20px 0 20px;
					}
				}
			}
		}
	}
	@media screen and (max-width: 780px){
		.cover{
			.head{
				top: 40px;
			}
			.misk{
				clip-path: none;
				background: rgba(176, 14, 37, 0.35);
			}
			.post{
				bottom: 60px;
				left: 5%;
				top: auto;
				width: 70%;
				transform: none;
			}
			.cover-bg{
				img{
					position: absolute;
					left: 50%;
					top: 0;
					height: 100%;
					width: auto;
					transform: translateX(-50%);
				}
			}
		}
		.content{
			width: 100%;
			.post{
				.img-box{
					width: 100%;
					height: auto;
				}
			}
		}
		.nav{
			.nav-list{
				margin-top: 200px;
				li{
					// margin: 0 12px;
					a{
						font-size: 16px;
					}
				}
			}
		}
	}
	@media screen and (max-width: 480px){
		.cover{
			.post {
				.time{
					display: none;
				}
				.title{
					margin-bottom: 10px;
				}
				.describe{
					font-size: 13px;
					line-height: 20px;
				}
			}
		}
	}
	@media screen and (max-width: 480px){
		// .nav{
		// 	.world{
		// 		display: flex;
		// 		flex-direction: column;
		// 		span:first-child{
		// 			margin-bottom: 8px;
		// 		}
		// 	}
		// }
	}
}
.container.navActive{
	.logo{
		color: #333;
	}
	.nav{
		top: 0;
	}
}
</style>
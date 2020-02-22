<template>
	<div class="container" :class="{navActive: isNav}">
		<div class="cover">
			<div id="scene" :style="{height:boxH}">
				<div class="layer" data-depth="0.4" :style="layerStyle">
					<img id="image" :style="imgStyle" src="../static/image/coverPicture.png" width="1920" height="1080">
				</div>
			</div>
			<div class="head">
				<div class="logo">2222</div>
				<div class="menu" @click="menu">
					<span class="iconfont" :class="isNav ? 'icon-searchclose' : 'icon-menu--fill'"></span>
				</div>
			</div>
			<div class="misk"></div>
			<div class="post">
				<div class="time">二月 24, 2020</div>
				<div class="title"><a>你好，我是李白！</a></div>
				<div class="describe">愿所有的美好如约而至，愿所有黑暗都能看到希望，我们都行微笑前行，人生没有完美，有些遗憾才美...</div>
			</div>
			<!-- menu -->
			<div class="nav">
				<ul class="nav-list">
					<li v-for="(item, index) in navList" :key="index">
						<a>{{item.title}}</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="content">
			<div class="post" v-for="(item, index) in articleList" :key="index">
				<div class="img-box" @click="article(item.id)">
					<img :src="item.image" alt="">
				</div>
				<div class="info">
					<div class="time">{{item.time.monthTxt}}月 {{item.time.day}}, {{item.time.year}}</div>
					<div class="title" @click="article(item.id)"><a>{{item.title}}</a></div>
					<div class="describe">{{item.describe}}</div>
					<div class="stuff">
						<span><i class="iconfont icon-wenzi1"></i> {{item.words}}</span>
						<span><i class="iconfont icon-eye"></i> {{item.read}}</span>
						<span><i class="iconfont icon-heart1"></i> {{item.like}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="foot">
			<a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备18132517号</a>
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
					title: 'Archive',
					url: ''
				},
				{
					title: 'Rainy',
					url: ''
				},
				{
					title: 'Envelope',
					url: ''
				},
				{
					title: 'Myself',
					url: ''
				}
			],
			isNav: false
		}
	},
	async asyncData(context){
		let {data} = await context.$axios.get('article')
		return {articleList: data}
	},
	mounted(){
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

		// 浏览器窗口事件
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
	destroyed(){
		window.onresize = null;
    },
	methods: {
		// nav
		menu(){
			this.isNav = !this.isNav;
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
						
            this.coverImg()
		},
		// Cover Picture Style
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
		article(id){
			this.$router.push({
				path: '/' + id
			})
		},
	}
};
</script>
<style lang="scss" scoped>
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
		padding: 0 30px;
		display: flex;
		justify-content: space-between;
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
		clip-path: polygon(0 0, 250px 0, 800px 100%, 0% 100%);
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
			.title a{
				font-size: 24px;
				cursor: pointer;
				margin-top: 5px;
				display: inline-block;
				&:hover{
					text-decoration: underline;
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
	.nav-list{
		display: block;
		text-align: center;
		margin-top: 25%;
		li{
			margin: 0 10px;
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
.container.navActive{
	.nav{
		top: 0;
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
</style>
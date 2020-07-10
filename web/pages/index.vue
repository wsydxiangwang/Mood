<template>
	<div class="container index" :class="{navActive: isNav}">
		<div class="cover">
			<div id="scene" :style="{height:boxH}">
				<div class="layer" data-depth="0.4" :style="layerStyle">
					<img id="image" :style="imgStyle" :src="image" width="1920" height="1080">
				</div>
			</div>
			<div class="head">
				<!-- <div class="logo"><span class="iconfont icon-logo4"></span></div> -->
				<div class="logo-img">
					<img src="/image/logo/logo1.png">
					<img src="/image/logo/logo2.png">
				</div>
				<div class="menu" @click="menu">
					<span class="iconfont" :class="isNav ? 'icon-close' : 'icon-menu'"></span>
				</div>
			</div>
			<div class="misk" :style="{backgroundColor: info.cover.color}"></div>
			<div class="post">
				<div class="time">{{info.cover.date}}</div>
				<div class="title"><nuxt-link :to="info.cover.link">{{info.cover.title}}</nuxt-link></div>
				<div class="describe">{{info.cover.describe}}</div>
			</div>
			<!-- menu -->
			<div class="nav">
				<ul class="nav-list">
					<template v-for="(item, index) in navList">
						<template v-if="item.url == 'subscribe'">
							<li v-if="$store.state.data.email_subscribe" :key="index">
								<a @click="toPage(item.url)">{{item.title}}</a>
							</li>
						</template>
						<li v-else :key="index">
							<a @click="toPage(item.url)">{{item.title}}</a>
						</li>
					</template>
				</ul>
				<div class="world">
					<span>Everywhere in the world has a similar life.</span>
				</div>
			</div>
		</div>

		<div class="content" v-if="Object.keys(articleList.data).length > 0">
			<div class="post" v-for="(item, index) in articleList.data" :key="index">
				<div class="img-box" @click="article(item.id)">
					<img v-lazy="item.image.url" src="/image/other/default.jpg" :alt="item.image.name">
				</div>
				<div class="info">
					<div class="time">{{item.time.month.cn}}月 {{item.time.day.on}}, {{item.time.year}}</div>
					<div class="title"><a @click="article(item.id)">{{item.title}}</a></div>
					<div class="describe">{{item.describe}}</div>
					<div class="stuff">
						<div><i class="iconfont icon-text"></i><span>{{item.words}}</span></div>
						<div><i class="iconfont icon-eye"></i><span>{{item.read}}</span></div>
						<div><i class="iconfont icon-like"></i><span>{{item.like}}</span></div>
					</div>
				</div>
			</div>
			<div @click="loadMoreData" class="more"><LoadMore :loadingType="loadingType"></LoadMore></div>
		</div>

		<div class="foot" v-if="info.cover.icp_txt">
			<a :href="info.cover.icp_link" target="_blank">{{info.cover.icp_txt}}</a>
		</div>

		<BackTop v-if="isBack"></BackTop>

		<!-- loading -->
		<Loading v-if="loading"></Loading>
	</div>
</template>

<script>
import Parallax from 'parallax-js'
export default {
	name: 'index',
	data(){
		return{
			layerStyle: {},
			imgStyle: {},
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
					title: 'Subscribe',
					url: 'subscribe'
				},
				{
					title: "About",
					url: 'about'
				}
			],
			isNav: false,
			loading: true,
			loadingType: 'more',
			page: 1,
			
			isBack: true,

			image: null,
            windowChange: () => {}
		}
	},
    head () {
        return {
			title: this.info.web_name,
			meta: [
                { hid: 'keywords', name: 'keywords', content: this.info.web_seo },
                { hid: 'description', name: 'description', content: this.info.web_describe },
            ]
		}
	},
	computed: {
		info(){
			return this.$store.state.data
		}
	},
	mounted(){
		document.body.style.overflowY = 'hidden';

		// Cover image loading is complete
		let img = new Image()
		img.src = this.info.cover.image
		img.onload = () => {
			setTimeout(() => {
				this.image = this.info.cover.image
				this.loading = false;
				document.body.style.overflowY = '';
			}, 1500)
		}

		// Homepage loaded
		this.$store.commit('isIndex')

		// Cover image init
		const scene = document.getElementById('scene');
		const parallaxInstance = new Parallax(scene, {
			relativeInput: true,
			clipRelativeInput: true,
		})

		if(this.articleList.page == this.articleList.totalPage){
			this.loadingType = 'nomore'
		}
	},
	async asyncData(context){
		if(context.store.state.index){ // 防止重复加载 
			return;
		}
		const {data} = await context.$axios.get('article')
		return { articleList: data.status == 1 ? data.body : {}}
	},
	beforeRouteEnter(to,from,next){
		next(vm => {
			vm.init()
			vm.windowChange = vm.$debounce(vm.init, 100)
			window.onresize = () => vm.windowChange()
			vm.isBack = true
		})
	},
	beforeRouteLeave(to,from,next){
		document.body.style.overflowY = ''
		window.onresize = null
		this.isBack = false
		setTimeout(() => this.isNav = false, 500)
		document.removeEventListener('touchmove', this.on, {passive: false})
        next()
    },
	methods: {
		// Cover image init
		init(){
			this.boxH = document.documentElement.clientHeight + 'px';
			this.boxW = document.documentElement.clientWidth + 'px';
			this.coverLayer()
		},
		// Cover image box calculation
		coverLayer(){
			let id = document.getElementById('scene'),
				_w = parseInt(this.boxW), 
                _h = parseInt(this.boxH), 
				x, y, i,
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
			const style = {
                width: _w + x + 'px',
                height: _h + y + 'px',
                marginLeft: - 0.5 * x + 'px',
                marginTop: - 0.5 * y + 'px'
			}
			this.layerStyle = Object.assign({}, this.layerStyle, style);
            this.coverImg()
		},
		// Cover image size calculation
		coverImg(){
			const width = parseInt(this.layerStyle.width), 
                  height = parseInt(this.layerStyle.height), 
				  ratio = 1080 / 1920,
				  style = {};

			const compute = height / width > ratio;

			style['width'] = compute ? (height / ratio + 'px') : `${width}px`;
			style['height'] = compute ? `${height}px` : (width * ratio + 'px');
			
			style['left'] = (width - parseInt(style.width)) / 2 +'px';
			style['top'] = (height - parseInt(style.height)) / 2 +'px';

			this.imgStyle = Object.assign({}, this.imgStyle, style);
		},
		loadMoreData(){
			if(this.loadingType == 'nomore' || this.loadingType == 'loading') return;

			this.page++;
			this.loadingType = 'loading';
			this.$axios.get(`article`, {
				params: {
					page: this.page
				}
			})
			.then(res => {
				const result = res.data.body;
				if(res.data.status == 1){
					setTimeout(() => {
						this.articleList.data = this.articleList.data.concat(result.data)

						this.$setScroll('.bottom-loading', 'index');

						this.loadingType = result.page == result.totalPage ? 'nomore' : 'more';
					}, 1000)
				}else{
					this.loadingType = 'more';
				}
			}).catch(err => {
				this.loadingType = 'more';
			})
		},
		// Other pages
		toPage(url){
			this.$router.push(`/${url}`)
		},
		// Nav
		menu(){
			this.isNav = !this.isNav;
			if(this.isNav){
				document.addEventListener('touchmove', this.on, {passive: false})
			}else{
				document.removeEventListener('touchmove', this.on, {passive: false})
			}
			document.body.style.overflowY = this.isNav ? 'hidden' : '';
		},
		on(e){
			e.preventDefault()
		},
		article(id){
			this.$router.push(`/${id}`)
		}
	}
};
</script>
<style lang="scss" scoped>
.index{
	position: absolute;
	width: 100%;
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
			padding: 0 40px 0 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.logo{
				transition: all .3s;
				.iconfont{
					font-size: 36px;
					cursor: pointer;
				}
			}
			.logo-img{
				width: 100px;
				height: 44px;
				position: relative;
				transition: all .3s;
				img{
					opacity: 1;
					width: 100%;
					position: absolute;
					transition: all .3s;
					cursor: pointer;
					&:last-child{
						opacity: 0;
					}
				}
			}
			.menu{
				width: 30px;
				height: 30px;
				line-height: 32px;
				border-radius: 2px;
				cursor: pointer;
				color: #ff3600;
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
				font-size: 14px;
			}
			.title{
				margin: 15px 0 30px;
				a{
					font-size: 28px;
					color: #fff;
					text-decoration: none;
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
		padding-bottom: 80px;
		text-align: center;
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
		.more{
			margin-top: 90px;
			display: inline-block;
		}
		/deep/ .bottom-loading{
			position: relative;
			z-index: 999;
			.btn{
				border-radius: 0;
				display: inline-block;
				border: 1px solid #eaeaea;
				border-radius: 4px;
			}
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
				overflow: hidden;
				border-radius: 6px;
				border: 1px solid #f3fafd;
				transition: all .3s;
				img{
					width: 100%;
					height: 100%;
				}
				&:hover img{
					opacity: 0.95;
				}
			}
			.info{
				width: 500px;
				height: 400px;
				position: absolute;
				top: 20px;
				padding: 80px 100px 0 80px;
				border: 1px solid #eaeaea;
				border-radius: 6px;
				.time{
					color: #999;
					font-size: 12px;
				}
				.title{
					margin-top: 8px;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					a{
						font-size: 24px;
						line-height: 30px;
						cursor: pointer;
						&:hover{
							background: radial-gradient(circle at 10px -7px, transparent 8px, currentColor 8px, currentColor 9px, transparent 9px) repeat-x,
							radial-gradient(circle at 10px 27px, transparent 8px, currentColor 8px, currentColor 9px, transparent 9px) repeat-x;
							background-size: 20px 20px;
							background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
							animation: waveFlow 1s infinite linear;
						}
						@keyframes waveFlow {
							from { background-position-x: -10px, 0; }
							to { background-position-x: -30px, -20px; }
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
					display: flex;
					div{
						padding: 6px;
						font-size: 12px;
						display: flex;
						align-items: center;
						position: relative;
						transition: all .3s;
						&:nth-of-type(1):hover{
							color: #EF6D57;
						}
						&:nth-of-type(2):hover{
							color: #50bcb6;
						}
						&:nth-of-type(3):hover{
							color: #ffa800;
						}
						.iconfont{
							margin-right: 4px;
							margin-top: -4px;
							display: inline-block;
							&.icon-like{
								font-size: 14px;
								margin-top: -1px;
							}
							&.icon-text{
								font-size: 17px;
								margin-top: -2px;
							}
						}
						span{
							display: inline-block;
						}
						&::before, &::after{
							position: absolute;
							bottom: 100%;
							left: 50%;
							transition: all .3s;
							opacity: 0;
							visibility: hidden;
						}
						&::before{
							content: '善良';
							transform: translate(-50%, -5px);
							background: #EF6D57;
							white-space: nowrap;
							color: #fff;
							font-size: 12px;
							border-radius: 10px;
							padding: 5px 14px;
						}
						&::after{
							content: '';
							border: 5px solid transparent;
							border-top-color: #EF6D57;
							transform: translate(-50%, 5px);
						}
						&:nth-of-type(2)::before{
							content: '勇敢';
							background: #50bcb6;
						}
						&:nth-of-type(3)::before{
							content: '坚持';
							background: #ffa800;
						}
						&:nth-of-type(2)::after{
							border-top-color: #50bcb6;
						}
						&:nth-of-type(3)::after{
							border-top-color: #ffa800;
						}
						&:hover::before, &:hover::after{
							opacity: 1;
							visibility: visible;
						}
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
		display: flex;
		justify-content: center;
		align-items: center;	
		background: rgba(255, 255, 255, 0.96);
		transition: top 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		.world{
			width: 100%;
			position: absolute;
			bottom: 30px;
			display: block;
			text-align: center;
			color: #999;
			span{
				font-size: 16px;	
			}
		}
		.nav-list{
			width: 80%;
			display: block;
			text-align: center;
			margin-top: -120px;
			li{
				margin: 0 20px 20px;
				list-style: none;
				display: inline-block;
				a{
					font-size: 24px;
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
					.title{
						margin-top: 10px;
						line-height: 25px;
					}
					.describe{
						-webkit-line-clamp: 2;
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
					font-size: 22px;
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
					border: none;
					img{
						width: 680px;
						max-width: 100%;
					}
				}
				.info{
					position: static;
					width: 96%;
					padding: 40px 20px 40px;
					margin: auto;
					border: none;
					background: #fff;
					height: auto;
					.stuff{
						position: static;
						margin: 20px 0 0 -6px;
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
				bottom: 8%;
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
					border-radius: 0;
				}
			}
		}
		.nav{
			.nav-list{
				li{
					// margin: 0 12px;
					a{
						font-size: 18px;
					}
				}
			}
		}
	}
	@media screen and (max-width: 480px){
		.cover{
			.head{
				padding: 0 24px 0 20px;
				.logo-img{
					width: 80px;
					img{
						top: 6px
					}
				}
			}
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
		.nav .world span{
			font-size: 14px;	
		}
	}
}
.container.navActive{
	.logo{
		color: #333;
	}
	.cover .head .logo-img img{
		opacity: 0;
		&:last-child{
			opacity: 1;
		}
	}
	.nav{
		top: 0;
	}
}
</style>
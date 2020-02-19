<template>
	<div class="container">
		<div class="cover">
			<div class="cover-box"><div class="cover-bg"><img src="https://isujin.com/wp-content/uploads/2018/11/wallhaven-672007-1.png">	 </div></div>
			<div class="misk"></div>
			<div class="post">
				<div class="time">十一月 24, 2018</div>
				<div class="title"><a>你走了真好，不然总担心你要走</a></div>
				<div class="describe">最近一次苏晴产生离婚的想法，是两个月以前，天桥下买煎饼的时候。 老公掏零钱，不小心从裤兜里掉落一...</div>
			</div>
		</div>
		<div class="content">
			<div class="post" v-for="(item, index) in articleList" :key="index">
				<div class="img-box" @click="article(item._id)">
					<img :src="item.image" alt="">
				</div>
				<div class="info">
					<div class="time">{{item.time.monthTxt}}月 {{item.time.day}}, {{item.time.year}}</div>
					<div class="title" @click="article(item._id)">{{item.title}}</div>
					<div class="describe">{{item.describe}}</div>
					<div class="stuff">
						<span><i class="iconfont icon-wenzi1"></i> {{item.words}}</span>
						<span><i class="iconfont icon-eye"></i> {{item.read}}</span>
						<span><i class="iconfont icon-heart1"></i> {{item.like}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
export default {
	async asyncData(context){
		let {data} = await context.$axios.get('article')
		return {articleList: data}
	},
	mounted(){
		// console.log(process.env.baseUrl)
	},
	methods: {
		article(id){
			this.$router.push({
                name: 'article',
                query: {
                    id: id
                }
            })
		},
	}
};
</script>
<style lang="scss" scoped>
.cover{
	width: 100%;
	height: 100vh;
	position: relative;
    z-index: 9999;
	overflow: hidden;
	.cover-bg{
		width: 100%;
		height: 100%;
	}
	.misk{
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(176, 14, 37, 0.65);
		clip-path: polygon(0 0, 380px 0, 1200px 100%, 0% 100%);
	}
	.post{
		position: absolute;
		top: 50%;
		left: 10%;
		color: #fff;
		width: 380px;
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
				font-size: 24px;
				cursor: pointer;
				margin-top: 10px;
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
		.post{
			bottom: 60px;
			top: auto;
			width: 70%;
			transform: none;
			.time{
				display: none;
			}
			.title{
				margin-bottom: 10px;
				a{
					font-size: 18px;
				}
			}
			.describe{
				font-size: 12px;
				line-height: 16px;
			}
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
</style>
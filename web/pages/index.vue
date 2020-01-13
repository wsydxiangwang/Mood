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
			<div v-for="(item, index) in articleList" class="post">
				<div class="img-box" @click="article(item._id)">
					<img src="https://isujin.com/wp-content/themes/Diaspora/timthumb/timthumb.php?src=https://isujin.com/wp-content/uploads/2017/01/wallhaven-435453.png" alt="">
				</div>
				<div class="info">
					<div class="time">十二月 18, 2018</div>
					<div class="title" @click="article(item._id)">{{item.title}}</div>
					<div class="describe">{{item.describe}}</div>
					<div class="stuff">
						<span>2813</span>
						<span>2813</span>
						<span>2813</span>
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
		console.log(process.env.baseUrl)
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
			display: inline-block;
			position: relative;
			cursor: pointer;
			z-index: 3;
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
			}
			.stuff{
				font-size: 12px;
				color: #999;
				position: absolute;
				bottom: 80px;
				left: 80px;
				span{
					font-size: 12px;
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
</style>
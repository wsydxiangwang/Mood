<template>
	<div class="container">
		<div>
			<div 
				v-for="(item, index) in articleList"
				@click="article(item)"
				class="list"
			>
				<div class="title">{{item.title}}</div>
				<div class="describe">{{item.describe}}</div>
				<div class="time">{{item.time}}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return{
			articleList: ''
		}
	},
	async asyncData(context){
		let {data} = await context.$axios.get('new')
		console.log(1)
		console.log({info: data})
		return {info: data}
	},
	mounted(){
		console.log(process.env.baseUrl)
		// this.$axios.get('new').then(res =>{
		// 	this.articleList = res.data;
		// }).catch(err => {
		// 	console.log(err)
		// })
	},
	methods: {
		// article(data){
		// 	console.log(data)
		// 	this.$router.push({
        //         path: '/article',
        //         query:{
		// 			data: data
		// 		}
        //     })
		// },
	}
};
</script>
<style lang="scss">
.list{
	border-radius: 4px;
	border: 1px solid #eee;
	.time{
		color: red
	}
}
</style>
<template>
	<div>
		<nuxt />
	</div>
</template>

<script>
export default {
	// async created(){

	// 	const data = await this.$axios.get('article')
	// },
	watch: {
		articleList(){
			console.log(this.articleList)
		}
	},

	async asyncData(context){
		const {data} = await context.$axios.get('article')
		console.log({data})
		return {articleList: data}
	},
}
</script>
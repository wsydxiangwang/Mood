<template>
	<div>
		<nuxt />
	</div>
</template>

<script>
export default {
	created(){
		/**
		 * cover
		 * avatar
		 * website_name
		 */
		// this.$axios.get('info').then(res => {
		// 	if(res.data.status == 1){
		// 		const data = {
		// 			cover: res.data.body.cover,
		// 			avatar: res.data.body.avatar,
		// 			website_name: res.data.body.website_name,
		// 		}
		// 		this.$store.commit('increment')
		// 	}
		// })
	},
}
</script>
<template>
	<div id="app" class="pc">
		<sidebar v-if="isShow"></sidebar>
		<div class="page-content">
			<router-view />
		</div>
	</div>
</template>
<script>
import sidebar from "./components/sidebar";
export default {
	components: {
		sidebar
	},
	data() {
		return {
			isShow: true
		}
	},
	watch: {
		/**
		 * 监听页面路由
		 * login'
		 * 则不显示全局组件
		 */
		$route(to, form){
			if(this.$route.path === '/login'){
				this.isShow = false;
			}else{
				this.isShow = true;
			}
		}
	}
};
</script>

<style>
#app.pc{
	height: 100vh;
	display: flex;
	overflow: hidden;
}
#app.pc .page-content{
	flex: 1;
	padding: 20px;
	overflow-y: auto;
}
* {
	margin: 0;
	padding: 0;
	list-style: none;
	box-sizing: border-box;
}
div, p, li, ol, span, a, input,textarea{
	font-size: 14px;
}
a{
	text-decoration: none;
}
</style>
<template>
	<div>
		<div class="btn">换肤</div>
		<nuxt class="page" keep-alive :keep-alive-props="{include: includeArr}"/>
	</div>
</template>

<script>
export default {
	data() {
		return {
			includeArr: ['index', 'about'] // 缓存页面
		}
	}
}
</script>

<style scoped>
.btn{
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 9999;
}
</style>
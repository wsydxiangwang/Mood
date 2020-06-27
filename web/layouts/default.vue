<template>
	<div>
		<nuxt class="page" keep-alive :keep-alive-props="{include: includeArr}"/>
	</div>
</template>

<script>
export default {
	data() {
		return {
			includeArr: ['index', 'about'] // 组件的 name
		}
	}
}
</script>
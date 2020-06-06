<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
	created(){
	}
}
</script>

<style>
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
#app{
    padding: 70px;
    border-radius: 10px;
    height: 100vh;
    width: 100vw;
}
@media screen and (max-width: 600px) {
	#app{
		padding: 0;
	}
}
</style>
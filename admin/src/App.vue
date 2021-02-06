<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
    created() {
        this.$infoUpdate()
    }	
}
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	list-style: none;
	box-sizing: border-box;
}
div, p, li, ol, span, a, input,textarea{
	font-size: 14px;
	font-family: "eafont", "Hiragino Sans GB","Hiragino Sans GB W3","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
}
@font-face{
	font-style: normal;
	font-family: 'eafont';
	src: url('./assets/eafont.ttf') format('truetype');
}
a{
	text-decoration: none;
}
body{
	overflow: hidden;
}
#app{
    padding: 0 15px;
    border-radius: 10px;
    height: 100vh;
    width: 100vw;
	display: flex;	
}
h2.tit{
    border-left: 2px solid var(--color-main);
    padding-left: 16px;
    font-size: 18px;
    font-weight: 400;
    margin: 20px 0 30px;
	color: var(--color-main);
	display: flex;
    align-items: center;
    justify-content: space-between;
	.add{
		height: 30px;
		line-height: 32px;
		font-size: 13px;
		border-radius: 4px;
		padding: 0 12px;
		color: var(--color-main);
		cursor: pointer;
		background: #e8f4ff;
		cursor: pointer;
		&:hover{
			color: #fff;
			background: var(--color-main);
		}
		.el-icon-plus{
			font-size: 12px;
			font-weight: 800;
		}
	}
}
.markdown-body *{
	list-style: initial;
}
:root{
	--color-main: #0084ff;
	--color-main-hover: #0279e9;
}
@media screen and (max-width: 600px) {
	#app{
		padding: 0;
	}
	.el-message-box__wrapper .el-message-box{
		width: 90%;
	}
	.el-tooltip__popper{
        display: none !important;
	}
	h2.tit{
		font-size: 16px;
		margin: 10px 0 20px;
	}
}
</style>
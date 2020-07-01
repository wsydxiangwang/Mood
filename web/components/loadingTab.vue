<template>
    <div class="loader"></div>    
</template>

<style lang="scss" scoped>
.loader{
    position: fixed;
    top: 0;
    width: 100%;
    height: 3px;
    z-index: 9999999;
    background-image: linear-gradient(to right, #F16F5C 0%, #F16F5C 12.5%, #5B56DD 12.5%, #5B56DD 25%, #E15CED 25%, #E15CED 37.5%, #27E559 37.5%, #27E559 50%, #18C8C9 50%, #18C8C9 62.5%, #DC8987 62.5%, #DC8987 75%, #BB83D6 75%, #BB83D6 87.5%, #E774BD 87.5%, #E774BD 100%);
    animation: loader 3s linear infinite;
}
@keyframes loader {
    100% {
        background-position: 930px 0
    }
}
</style>
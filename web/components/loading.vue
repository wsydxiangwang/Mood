<template>
    <div class="cover-loading">
        <span></span>
    </div>
</template>

<style lang="scss" scoped>
.cover-loading{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    background: var(--color-bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    span{
        width: 15px;
        height: 15px;
        display: block;
        margin-top: -20px;
        border-radius: 50%;
        background: var(--color-text-6);
        animation: Loading 2s both infinite;
    }
}
@keyframes Loading{
    5% { transform: scale(1); } 
    10% { transform:scale(0.95); }
    15% { transform:scale(0.9); }
    20% { transform:scale(0.8); }
    25% { transform:scale(0.7); }
    30% { transform:scale(0.6); }
    35% { transform:scale(0.5); }
    40% { transform:scale(0.4); }
    50% { transform:scale(0.3); }
    60% { transform:scale(0.4); }
    65% { transform:scale(0.5); }
    70% { transform:scale(0.6); }
    75% { transform:scale(0.7); }
    80% { transform:scale(0.8); }
    85% { transform:scale(0.85); }
    90% { transform:scale(0.9); }
    95% { transform:scale(0.95); }
    100% { transform:scale(1); }
}
</style>
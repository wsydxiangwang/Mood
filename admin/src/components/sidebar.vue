<template>
    <div>
        <div class="sidebar" :class="show?'show':''">
            <div class="info">
                <div class="photo">
                    <img :src="$store.state.info.avatar">
                </div>
                <p class="name">{{$store.state.info.name}}</p>
            </div>
            <el-menu 
                :default-active="activeIndex" 
                mode="horizontal" 
                router
            >
                <el-menu-item 
                    v-for="(item, index) in list" 
                    :index="item.path"
                    :key="index"
                    @click="toPage(item.title)"
                >
                    <i :class="item.icon"></i>
                    {{item.title}}
                    <span v-if="item.title == 'Comment'" class="unread">31</span>
                </el-menu-item>
            </el-menu>    
        </div>
        <span class="btn" :class="[show ? 'el-icon-close' : 'el-icon-heavy-rain']" @click="toggle"></span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    icon: 'el-icon-sunrise-1',
                    title: 'My world',
                    path: '/',
                },
                {
                    icon: 'el-icon-heavy-rain',
                    title: 'Small mood',
                    path: '/article',
                },
                {
                    icon: 'el-icon-light-rain',
                    title: 'New mood',
                    path: '/article/info',
                },
                {
                    icon: 'el-icon-lightning',
                    title: 'A letter',
                    path: '/envelope',
                },
                {
                    icon: 'el-icon-cloudy-and-sunny',
                    title: 'New letter',
                    path: '/envelope/info',
                },
                {
                    icon: 'el-icon-cloudy-and-sunny',
                    title: 'Comment',
                    path: '/comment',
                },
                {
                    icon: 'el-icon-cloudy-and-sunny',
                    title: 'Setting',
                    path: '/setting',
                },
                {
                    icon: 'el-icon-moon-night',
                    title: 'Leave',
                }
            ],
            activeIndex: '',
            show: false
        }
    },
    mounted(){
        this.activeIndex = this.$route.path;
    },
    methods: {
        toggle(){
            this.show = !this.show;
            if(this.show){
                document.getElementsByClassName('container')[0].style.filter = 'blur(1px)'
                document.getElementsByClassName('content')[0].style.overflowY = 'hidden'
            }else{
                document.getElementsByClassName('container')[0].style.filter = ''
                document.getElementsByClassName('content')[0].style.overflowY = ''
            }
        },
        toPage(data){
            this.show = false;
            document.getElementsByClassName('container')[0].style.filter = ''
            document.getElementsByClassName('content')[0].style.overflowY = ''
            /**
             * 清除token
             * 回到登录页
             */
            if(data == 'Leave'){
                this.$confirm('是否退出登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    localStorage.removeItem('Authorization');
                    this.$router.push('/login');
                }).catch(() => {})
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.sidebar{
    height: 100%;
    width: 240px;
    color: #fff;
    background: #0e8bff;
    .el-menu{
        border: none;
        margin-top: 40px;
        background: none;
        padding-left: 8px;
        .el-menu-item{
            height: 40px;
            line-height: 42px;
            text-align: center;
            float: none;
            border: none;
            color: #fff;
            font-size: 14px;
            margin-bottom: 5px;
            padding: 0 0  0 22px;
            text-align: left;
            border-radius: 20px 0 0 20px;
            i{
                color: #fff;
                vertical-align: text-bottom;
            }
            &:hover, &.is-active{
                color: #0084ff;
                background: #fff;
                position: relative;
                &:before{
                    content: '';
                }
                &:after{
                    content: '';
                }
                i{
                    color: #0084ff;
                }
            }
            .unread{
                background: #fff;
                color: #0e8bff;
                font-size: 12px;
                border-radius: 50%;
                display: inline-block;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                margin-left: 4px;
                transform: scale(0.9);
                vertical-align: super;
            }
        }
    }

    .info{
        margin: 40px 0;
        text-align: center;
        .photo{
            width: 60px;
            height: 60px;
            margin: auto;
            border-radius: 50%;
            background: #fff;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .name{
            margin-top: 15px;
            color: #fff;
        }
    }
}
.btn{
    position: fixed;
    bottom: 20px;
    right: 30px;
    background: #c6e1ff;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    color: #0084ff;
    font-size: 24px;
    z-index: 999999;
    display: none;
}
@media screen and (max-width: 600px) {
    .sidebar{
        position: fixed;
        left: 0;
        z-index: 9;
        transform: translateX(-100%);
        opacity: 0;
        width: 60%;
        max-width: 240px;
        transition: all .3s;
        border-radius: 0 20px 20px 0;
        &.show{
            opacity: 1;
            transform: translateX(0);
        }
    }
    .btn{
        display: block;
    }
}
</style>
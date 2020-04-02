<template>
    <div class="sidebar">
        <div class="info">
            <div class="photo">
                <img src="../assets/logo.png">
            </div>
            <p class="name">李白不吃茶</p>
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
            >
            {{item.title}}</el-menu-item>
        </el-menu>

        <!-- 
        <ul>
            <li v-for="(item, index) in list" :key="index" :class="index == indexTag ? 'active':''">
                <el-link type="primary" @click="toPage(item.link)">{{item.title}}</el-link>
            </li>
        </ul> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    icon: '',
                    title: '首页',
                    path: '/',
                },
                {
                    icon: '',
                    title: 'My Mood',
                    path: '/article',
                },
                {
                    icon: '',
                    title: 'Published Mood',
                    path: '/article/info',
                },
                {
                    icon: '',
                    title: 'A letter',
                    path: '/envelope',
                },
                {
                    icon: '',
                    title: 'New letter',
                    path: '/envelope/info',
                },
                {
                    icon: '',
                    title: 'Leave',
                }
            ],
            activeIndex: ''
        }
    },
    mounted(){
        console.log(this.$route.path)
        this.activeIndex = this.$route.path;
        console.log(this.activeIndex)
    },
    methods: {
        toPage(data){
            if(data){
                this.$router.push(data)
            }else{
                /**
                 * 清除token
                 * 回到登录页
                 */
                localStorage.removeItem('Authorization');
                this.$router.push('/login');
                console.log('退出登录')
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
            line-height: 40px;
            text-align: center;
            float: none;
            border: none;
            color: #fff;
            font-size: 14px;
            margin-bottom: 5px;
            padding-left: 35px;
            text-align: left;
            &.is-active{
                color: #0084ff;
                background: #fff;
                border-radius: 20px 0 0 20px;
                position: relative;
                &:before{
                    content: '';
                }
                &:after{
                    content: '';
                }
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

@media screen and (max-width: 600px) {
    .sidebar{
        position: fixed;
        left: 0;
        z-index: 9;
        background: #fff;
        transform: translateX(-100%);
        opacity: 0;
    }
}
</style>
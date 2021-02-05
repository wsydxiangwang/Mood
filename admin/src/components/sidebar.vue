<template>
    <div>
        <div class="sidebar" :class="{hide:scale, show:show}">
            <div class="info">
                <div class="photo">
                    <img v-if="$info" :src="$info.base.admin_avatar || ''">
                </div>
                <p class="name" v-if="$info">{{ $info.base.admin_name }}</p>
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
                    <span>{{ item.title }}</span>
                    <span v-if="item.title=='Comment' && $data.unread" class="unread">{{$data.unread}}</span>
                </el-menu-item>
            </el-menu> 

            <transition name="fade" mode="out-in">
                <span v-if="scale" @click="hide" class="el-icon-open"></span>
                <span v-else @click="hide" class="el-icon-turn-off"></span>
            </transition>
        </div>
        <div class="misk"></div>
        <span class="btn" :class="[show ? 'el-icon-close' : 'el-icon-heavy-rain']" @click="toggle"></span>
    </div>
</template>

<script>
import { mapState } from 'vuex'
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
                    title: 'Little mood',
                    path: '/article',
                },
                {
                    icon: 'el-icon-lightning',
                    title: 'A letter',
                    path: '/envelope',
                },
                {
                    icon: 'el-icon-sunrise-1',
                    title: 'Comment',
                    path: '/comment',
                },
                {
                    icon: 'el-icon-sunrise-1',
                    title: 'Myself',
                    path: '/myself',
                },
                {
                    icon: 'el-icon-sunrise-1',
                    title: 'Subscribe',
                    path: '/subscribe',
                },
                {
                    icon: 'el-icon-sunset',
                    title: 'Setting',
                    path: '/setting',
                },
                {
                    icon: 'el-icon-moon-night',
                    title: 'Leave',
                }
            ],
            activeIndex: '',
            show: false,
            scale: false
        }
    },
    watch: {
        /**
         * 激活菜单导航
         */
        '$store.state.menu': {
            handler(val) {
                this.activeIndex = val
            },
            immediate: true
        }
    },
    computed: {
        ...mapState(['$data']),
        $info(){
            return this.$data ? this.$data.info : {}
        }
    },
    methods: {
        hide(){
            this.scale = !this.scale
        },
        toggle(){
            this.show = !this.show;
            const i = this.show ? 'blur(1px)' : '';
            const t = this.show ? 'hidden' : '';
            this.filter(i, t)
        },
        toPage(data){
            this.show = false;
            this.filter('', '')
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
                })
            }
        },
        filter(i, t){
            document.getElementsByClassName('container')[0].style.filter = i
            document.getElementsByClassName('content')[0].style.overflowY = t
        }
    }
}
</script>


<style lang="scss" scoped>
.fade-enter-active {
  transition: all .3s ease;
}
.fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
.sidebar{
    height: 100%;
    width: 240px;
    color: #fff;
    padding-top: 40px;
    background: #0e8bff;
    transition: all .3s;
    position: relative;
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
            padding: 0 0  0 32px;
            text-align: left;
            border-radius: 20px 0 0 20px;
            transition: all .3s;
            i{
                color: #fff;
                vertical-align: middle;
            }
            &:focus{
                color: #fff;
                background-color: #0e8bff;
            }
            &:hover, &.is-active{
                color: #0084ff;
                background: #fff;
                position: static;
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
        text-align: center;
        .photo{
            width: 70px;
            height: 70px;
            margin: auto;
            border-radius: 50%;
            background: #fff;
            overflow: hidden;
            transition: all .3s;
            border: 5px solid #389fff;
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
    &.hide{
        width: 80px;
        .info{
            .photo{
                width: 50px;
                height: 50px;
            }
            .name{
                display: none;
            }
        }
        .el-menu{
            padding: 0 8px;
            text-align: center;
            .el-menu-item{
                border-radius: 6px;
                padding: 0;
                text-align: center;
                width: 48px;
                line-height: 42px;
                height: 42px;
                padding-left: 2px;
                display: inline-block;
                i{
                    font-size: 26px;
                }
                span{
                    display: none;
                }
                &.is-active::before{
                    content: '';
                    height: 24px;
                    width: 3px;
                    position: absolute;
                    left: 0;
                    z-index: 999;
                    background: #fff;
                    transform: translateY(8px);
                    border-radius: 0 15px 15px 0;
                }
            }
        }
    }
    .el-icon-open, .el-icon-turn-off{
        font-size: 20px;
        position: absolute;
        bottom: 10px;
        left: 30px;
        cursor: pointer;
        color: #83c3ff;
        &:hover{
            color: #fff;
        }
        &.el-icon-turn-off{
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
.misk{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 8;
    background: rgba(255, 255, 255, 0);
    display: none;
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
    &.el-icon-close{
        font-size: 20px;
        line-height: 42px;
    }
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
        &.show + .misk{
            display: block;
        }
    }
    .btn{
        display: block;
    }
}
</style>
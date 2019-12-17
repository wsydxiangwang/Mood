<template>
    <div class="sidebar">
        <div class="info">
            <div class="photo">
                <img src="../assets/logo.png">
            </div>
            <p class="name">李白不吃茶</p>
        </div>
        <ul>
            <li v-for="item in list">
                <router-link :to="item.link"><span>{{item.title}}</span></router-link>
            </li>
        </ul>
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
                    link: '/',
                },
                {
                    icon: '',
                    title: '文章',
                    link: 'article',
                },
                {
                    icon: '',
                    title: '新文章',
                    link: 'articleNew',
                },
                {
                    icon: '',
                    title: '细语',
                    link: 'phrase',
                },
                {
                    icon: '',
                    title: '新细语',
                    link: 'phraseNew',
                },
                {
                    icon: '',
                    title: '留言',
                    link: '',
                },
                {
                    icon: '',
                    title: '导航',
                    link: '',
                },
                {
                    icon: '',
                    title: '我的',
                    link: '',
                },
                {
                    icon: '',
                    title: '退出',
                    link: '',
                }
            ]
        }
    }
}
</script>


<style lang="scss" scoped>
.sidebar{
    height: 100%;
    width: 160px;
    color: #fff;
    background: #333;
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
            margin-top: 10px;
        }
    }
    ul{
        margin-top: 40px;
        li{
            height: 40px;
            line-height: 40px;
            text-align: center;
            a{
                display: block;
                color: #fff;
                padding: 0 10px;
                transition: all .3s;
                &:hover{
                    background: red;
                }
            }
        }
    }
}
</style>
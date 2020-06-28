<template>
    <div class="container">
        <template v-if="error.statusCode == 404">
            <img src="/image/other/404.png">
            <div class="content">
                <ul>
                    <li>世界上有什么不会失去的东西吗？我相信有，你最好也相信。</li>
                    <li>世上有可以挽回的和不可挽回的事，而时间经过就是一种不可挽回的事。</li>
                    <li>不必太纠结于当下，也不必太忧虑未来，当你经历过一些事情的时候，眼前的风景已经和从前不一样了。</li>
                    <li>我的人生是我的，你的人生是你的。只要你清楚自己在寻求什么，那就尽管按自己的意愿去生活。别人怎么说与你无关。</li>
                    <li>你要做一个不动声色的大人了。不准情绪化，不准偷偷想念，不准回头看。去过自己另外的生活。你要听话，不是所有的鱼都会生活在同一片海里。</li>
                </ul>
                <div>
                    <span class="red">{{number}}</span> 
                    <span class="pink">s</span> 后，请给我一个重新开始的机会。 
                    <span class="none" @click="on">({{isOn?'时间开始':'点我暂停时间'}})</span>
                </div>
            </div>
        </template>
        <template v-else>
            <img src="/image/other/404.png">
            <div class="content">
                <ul>
                    <li>世界上有什么不会失去的东西吗？我相信有，你也最好相信。</li>
                    <li>世上有可以挽回的和不可挽回的事，而时间经过就是一种不可挽回的事。</li>
                    <li>不必太纠结于当下，也不必太忧虑未来，当你经历过一些事情的时候，眼前的风景已经和从前不一样了。</li>
                    <li>我的人生是我的，你的人生是你的。只要你清楚自己在寻求什么，那就尽管按自己的意愿去生活。别人怎么说与你无关。</li>
                    <li>你要做一个不动声色的大人了。不准情绪化，不准偷偷想念，不准回头看。去过自己另外的生活。你要听话，不是所有的鱼都会生活在同一片海里。</li>
                </ul>
                <div>
                    <span class="red">{{number}}</span> 
                    <span class="pink">s</span> 后，请给我一个重新开始的机会。 
                    <span class="none" @click="on">({{isOn?'时间开始':'点我暂停时间'}})</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: ['error'],
    data(){
        return {
            number: 10,
            timer: null,
            isOn: false
        }
    },
    head () {
        return {
            title: `页面找不到了~~`
        }
    },
    mounted(){
        this.setTime();
    },
    methods: {
        on(){
            this.isOn = !this.isOn;
            clearInterval(this.timer);
            if(!this.isOn){
                this.setTime();
            }
        },
        setTime(){
            this.timer = setInterval(() => {
                this.number--;
                if(this.number == 0){
                    clearInterval(this.timer);
                    this.$router.push('/')
                }
            }, 1000);
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 100px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  .red{
    color: red;
    font-weight: 800;
  }
  .pink{
    color: #ff0090;
    font-weight: 800;
  }
  .none{
    color: #ff0090;
    font-size: 12px;
    cursor: pointer;
  }
  .content{
    width: 480px;
    text-align: left;
    margin-top: 40px;
    ul{
      li{
        color: #303030;
        line-height: 22px;
        margin-bottom: 15px;
        list-style: arabic-indic;
      }
    }
  }
}
@media screen and (max-width: 600px) {
    .container{
        padding: 40px;
        width: 100%;
        img{
            max-width: 100%;
        }
        .content{
            width: 100%;
        }
    }
}
</style>
<template>
    <div class="comment">
        <div :class="isVerification?'verify':''" style="transition:all .3s">
            <div class="comment-form">
                <div class="input-box">
                    <input type="text" placeholder="Name" v-model="form.name">
                    <input type="text" placeholder="Email" v-model="form.email">
                </div>
                <div class="reply-name" v-if="isReply">
                    <span class="">@{{replyObj.reply_name}}</span>
                    <span class="iconfont icon-close" @click="cancel"></span>
                </div>
                <textarea class="textarea" placeholder="What do you want to say..." v-model="form.content"></textarea>

                <!-- submit loading -->
                <div class="bottom">
                    <button type="button" @click="submitVerify" :class="status == 9?'active':''">SUBMIT</button>

                    <template v-if="status == 6">
                        <div class="hint loading">
                            <div class="sk-circle selected">
                                <div class="sk-circle1 sk-child"></div>
                                <div class="sk-circle2 sk-child"></div>
                                <div class="sk-circle3 sk-child"></div>
                                <div class="sk-circle4 sk-child"></div>
                                <div class="sk-circle5 sk-child"></div>
                                <div class="sk-circle6 sk-child"></div>
                                <div class="sk-circle7 sk-child"></div>
                                <div class="sk-circle8 sk-child"></div>
                                <div class="sk-circle9 sk-child"></div>
                                <div class="sk-circle10 sk-child"></div>
                                <div class="sk-circle11 sk-child"></div>
                                <div class="sk-circle12 sk-child"></div>
                            </div>
                            <span class="loading-text">{{hint[status]}}</span>
                        </div>
                    </template>

                    <template v-if="status == 7">
                        <div class="hint success">
                            <span class="iconfont icon-success"></span>
                            <span>{{hint[status]}}</span>
                        </div>
                    </template>

                    <template v-if="status!=7 && status!=6 && status!=10">
                        <div class="hint red">
                            <span class="iconfont icon-error"></span>
                            <span>{{hint[status]}}</span>
                        </div>
                    </template>

                </div>
            </div>

            <template v-if="comment.total > 0">
                <h2><span>Comment List</span><span>({{comment.total}})</span></h2>
                <div class="comment-list">

                    <transition-group name="move">
                        <!-- 评论列表 -->
                        <div 
                            class="comment-item" 
                            v-for="(item, index) in comment.data" 
                            :key="item.id"
                            :data-id="item.id"
                        >
                            <div class="comment-item-box">
                                <div class="head">
                                    <div class="img">
                                        <img :src="require('../static/image/comment/'+item.image+'.jpg')">
                                    </div>
                                    <div class="name">
                                        <a>{{item.name}}<span v-if="item.email==='1915398623@qq.com'">行人</span></a>
                                        <div class="r">
                                            <div class="reply" @click="reply(item, 1)">reply</div>
                                            <span class="time">{{item.time.time}} {{item.time.month.en}} {{item.time.day.on}}, {{item.time.year}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-content">{{item.content}}</div>
                            </div>

                            <!-- 回复评论 -->
                            <div class="comments" v-if="item.child.length > 0">
                                <div 
                                    class="item" 
                                    v-for="(items, indexs) in item.child" 
                                    :key="indexs"
                                    :data-id="items.id"
                                >
                                    <div class="head">
                                        <div class="img">
                                            <img :src="require('../static/image/comment/'+items.image+'.jpg')">
                                        </div>
                                        <div class="name">
                                            <a>{{items.name}}<span v-if="item.email==='1915398623@qq.com'">行人</span></a>
                                            <div class="r">
                                                <div class="reply" @click="reply(item, 2, items)">reply</div>
                                                <span class="time">{{items.time.time}} {{items.time.month.en}} {{items.time.day.on}}, {{items.time.year}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="comments-content"><span v-if="items.type===3" class="reply-name"> @{{items.reply_name}} </span>{{items.content}}</div>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </div>
            </template>
        </div>
        <!-- 验证 -->
        <div>
            <PuzzleVerification 
                blockType="puzzle" 
                :onSuccess="handleSuccess"
                :verificationShow="isVerification"
                @clone="isVerificationClone"
            ></PuzzleVerification>
        </div>
    </div>
</template>

<script>
import PuzzleVerification from '@/components/puzzleVerification'
export default {
    props: ['id', 'title'],
    components: { 
        PuzzleVerification 
    },
    data() {
        return {
            comment: {},        // 评论列表
            form: {},           // 表单数据

            status: 10,          // 提交状态
            hint: [              // 提示信息
                '您的名字是第一印象哦～',
                '胆敢冒充站长，来人，拉出去砍了！！',
                '请输入正确的邮箱，有惊喜的哦～',
                '偷偷告诉我，你作文是不是0分～',
                '哇哦！遇到错误，要不再试试',
                '完成验证才可以提交哦～',
                'Submitting...',
                '提交成功, Nice.'
            ],
            isVerification: false,      // 验证状态
            verificationSuccess: false, // 验证成功
            loading: true,              // 页面loading

            replyObj: {},       // 回复的信息
            isReply: false,     // 回复
        }
    },
    mounted(){
        // 获取评论
        this.$axios.get(`comment/${this.id}`).then(res => {
            if(res.data.status === 1){
                this.comment = res.data.body
                this.$emit('total', this.comment.total)
            }
        })
    },
    methods: {
        // 取消验证
        isVerificationClone(){
            this.status = 5;
            this.isVerification = false;
            ['header', 'section'].map(item => document.querySelector(item).classList.remove('verify'))
        },
        // 验证通过
        handleSuccess(){
            this.isVerification = false;
            this.verificationSuccess = true;
            ['header', 'section'].map(item => document.querySelector(item).classList.remove('verify'))
            // 提交评论
            setTimeout(() => {
                this.status = 6; // Submitting
                this.submit();
            }, 600)
        },
        //取消回复
        cancel(){
            this.replyObj = {};
            this.isReply = false;
        },
        // 开启回复
        reply(item, type, items){
            // 设置滚动条位置
            this.$setScroll('.comment', -200, true);

            this.isReply = true;
            this.replyObj = {
                parent_id: item.id,
                type: type == 1 ? 2 : 3,
                reply_name: type == 1 ? item.name : items.name,
                reply_email: type == 1 ? item.email : items.email,
            }
        },
        // 提交评论
        submit(){
            /**
             * 去掉前后空格
             * 过滤script
             * 添加当前时间
             * 添加随机头像
             */
            this.form = {
                name: this.form.name.trim(),
                time: this.dateFormat(),
                email: this.form.email.trim(),
                image: Math.floor(Math.random() * 10 + 1),
                content: this.form.content.trim().replace(/<script.*?>.*?<\/script>/ig, ''),
                topic_id: this.id,
            }
            /**
             * 指定管理员头像
             */
            if(this.form.email == '1915398623@qq.com') this.form.image = 1;

            const formData = {
                title: this.title,
                url: window.location.href,
                type: this.isReply ? 1 : 2,
                data: Object.assign({}, this.replyObj, this.form),
            }
            
            this.$axios.post('comment', formData)
                .then(res => {
                    if(res.data.status === 1){

                        /**
                         * 动态添加到页面
                         */
                        const data = res.data.body;
                        if(data.type === 1){
                            this.comment.data.unshift(data)
                        }else{
                            const id = data.parent_id;
                            this.comment.data.filter(i => i.id == id).forEach(item => item.child.push(data))
                        }

                        /**
                         * 恢复默认状态
                         */
                        this.form = {};
                        this.replyObj = {};
                        this.isReply = false;
                        this.status = 7;

                        setTimeout(() => {
                            this.status = 10;
                        }, 3000)
                    }else{
                        this.status = 4;
                    }
                    this.verificationSuccess = false;
                })
                .catch(err => {
                    this.verificationSuccess = false;
                    this.status = 4;
                })
        },
        // 提交验证
        submitVerify(){

            const data = {
                "status": 1,
                "type": 1,
                "_id": "5ed5ecdb849d0f5cac2bcd00",
                "name": "上百个啊",
                "time": {
                "date": "2020/06/02 14:08",
                "time": "14:08",
                "year": "2020",
                "month": {
                    "on": "06",
                    "cn": "六",
                    "en": "Jun"
                },
                "day": {
                    "on": "02",
                    "en": "2nd"
                },
                "week": {
                    "on": "二",
                    "en": "Tuesday"
                }
                },
                "email": "324253@qq.com",
                "image": 2,
                "content": "asf",
                "topic_id": 1125,
                "id": 333,
                "__v": 0,
                "child": []
            }

            this.comment.data.unshift(data)

            return
            // loading 状态
            if(this.status == 6) return;

            const map = {
                name: () => {
                    return {
                        code: 0,
                        type: !this.form.name
                    }
                },
                admin: () => {
                    return {
                        code: 1,
                        type: this.form.name == '李白' && this.form.email != '1915398623@qq.com'
                    }
                },
                email: ()=>{
                    return {
                        code: 2,
                        type: !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.form.email)
                    }
                },
                content: () => {
                    return {
                        code: 3,
                        type: !this.form.content
                    }
                }
            }

            // 验证
            for(let i in map){
                const result = map[i]();
                if(result.type){
                    this.status = result.code
                    return;
                }
            }

            // 滑动验证 最后一步验证
            if(!this.verificationSuccess){
                ['header', 'section'].map(item => document.querySelector(item).classList.add('verify'))
                this.isVerification = true;
            }
        },
        // 时间
        dateFormat(){
            const date = new Date();
            const opt = {
                "Y": date.getFullYear().toString(),        // 年
                "M": (date.getMonth() + 1).toString(),     // 月
                "D": date.getDate().toString(),            // 日
                "H": date.getHours().toString(),           // 时
                "m": date.getMinutes().toString(),         // 分
            }
            for(let i in opt){
                opt[i] = opt[i].length == 1 ? opt[i].padStart(2, "0") : opt[i]
            }
            const time = `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`
            return time
        }
    }
}
</script>


<style lang="scss" scoped>
.move-enter, .move-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  animation: bounce-in .5s;
}
.move-leave-to, .move-leave-active{
  animation: bounce-in .5s;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.comment{
    width: 800px;
    margin: auto;
    h2{
        color:#333;
        font-weight:400;
        margin-bottom:20px;
        font-style: oblique;
        display:inline-block;
        span{
            &:first-child{
                font-size:18px;
                margin-right: 8px;
                border-bottom:1px solid #666;
            }
        }
    }
    .verify{
        filter: blur(5px);
    }
    .comment-form{
        border:1px solid #eee;
        margin-bottom:60px;
        border-radius:6px;
        padding:15px 12px;
        transition: all .3s;
        .input-box{
            display:flex;
            input{
                width:50%;
                height:38px;
                font-size:14px;
                padding-left:10px;
                margin-right:12px;
                -webkit-transition:all .3s;
                transition:all .3s;
                border:none;
                border-bottom:1px dashed #f0f0f0;
                outline:none;
                &:focus{
                    border-color:#b9b9b9;
                }
                &:last-child{
                    margin: 0;
                }
            }
        }
        .reply-name{
            color: #fff;
            display: inline-block;
            background: var(--colorActive);
            border-radius: 21px;
            padding: 0 10px;
            height: 24px;
            line-height: 23px;
            margin-top: 10px;
            span{
                font-size: 13px;
                &.iconfont{
                    font-size: 12px;
                    cursor: pointer;
                }
            }
        }
        textarea{
            width:100%;
            height:200px;
            margin:10px 0;
            color: #333;
            border:1px dashed #eee;
            -webkit-transition:all .3s;
            transition:all .3s;
            border-radius:4px;
            font-size:14px;
            padding:15px;
            outline:none;
            resize:none;
            background: url('~static/image/plbj.png') no-repeat bottom right;
            &:focus{
                border-color: #b9b9b9;
            }
        }
    }
    .comment-list{
        padding:0 0 60px;
        .comment-item{
            padding:25px 0;
            border-bottom:1px solid #f6f7f8;
            .comment-item-box:hover{
                .head .name .r .reply{
                    opacity: 1;
                }
            }
            .head{
                display:-webkit-box;
                display:flex;
                position:relative;
                .img{
                    width:45px;
                    height:45px;
                    border-radius:50%;
                    margin-right:12px;
                    overflow:hidden;
                    border: 1px solid #f1f1f1;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .name{
                    flex:1;
                    display:-webkit-box;
                    display:flex;
                    -webkit-box-align:center;
                    align-items:center;
                    -webkit-box-pack:justify;
                    justify-content:space-between;
                    a{
                        font-weight:400;
                        color:#ef6d57;
                        font-size:16px;
                        height:20px;
                        -webkit-transition:all .3s;
                        transition:all .3s;
                        text-decoration:none;
                        position: relative;
                        &:hover{
                            color:#ef2f11;
                            text-decoration:underline;
                        }
                        span{
                            color: #fff;
                            position: absolute;
                            top: 50%;
                            font-size: 10px;
                            padding: 1px 6px 1px 8px;
                            margin-top: 2px;
                            white-space: nowrap;
                            background: #a9cff3;
                            border-radius: 0 20px 0;
                            transform: translateY(-50%) scale(0.9);
                        }
                    }
                    .r{
                        display: flex;
                        .time{
                            color:#999;
                            font-size:13px;
                            letter-spacing:0;
                        }
                        .reply{
                            opacity: 0;
                            font-size: 12px;
                            color: #ef6d57;
                            margin-right: 12px;
                            cursor: pointer;
                            transition: all .2s;
                            text-decoration: underline;
                            text-transform: capitalize;
                            &:hover{
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
            
            .comment-content{
                color:#303030;
                line-height:22px;
                padding:0 0 0 58px;
                white-space: pre-wrap;
            }
        }
        .comments{
            padding-left:45px;
            margin-top:38px;
            .item{
                margin-top:32px;
                &:hover{
                    .head .name .r .reply{
                        opacity: 1;
                    }
                }
                .head{
                    display:-webkit-box;
                    display:flex;
                    -webkit-box-align:center;
                    align-items:center;
                    position:relative;
                    .img{
                        width:40px;
                        height:40px;
                    }
                    .name{
                        position:relative;
                        &:after{
                            content:"";
                            width:100%;
                            border-top:1px solid #f6f7f8;
                            position:absolute;
                            top:-22px;
                            left:0
                        }
                    }
                }
                .comments-content{
                    color: #666;
                    padding: 0;
                    line-height: 22px;
                    margin: 0 0 0 50px;
                    white-space: pre-wrap;
                    span{
                        color: #fff;
                        background: #a9cff3;
                        display: inline-block;
                        height: 18px;
                        padding: 0 4px;
                        line-height: 20px;
                        border-radius: 10px;
                        margin-right: 4px;
                        font-size: 13px;
                    }
                }
            }
        }
    }
}

.bottom{
    display: flex;
    align-items: center;
    button{
        height:34px;
        line-height:36px;
        width:100px;
        font-size:14px;
        color:#5f5f5f;
        border-radius:6px;
        background:#eaeaea;
        cursor:pointer;
        outline:none;
        border:none;
        margin-right: 12px;
        transition:all .3s;
        &:hover, &.active{
            color: #fff;
            background: var(--colorActive);
        }
    }
    .hint{
        &.loading{
            display: flex;
            align-items: center;
            .loading-text{
                color: var(--colorActive);
                padding-top: 3px;
            }
        }
        &.red span{
            color: red;
            font-size: 13px;
            margin-right: -2px;
            display: inline-block;
        }
        &.success span{
            color: #2fc700;
            font-size: 13px;
            margin-right: 2px;
        }
    }
}

.sk-circle{
    height:20px;
    width:20px;
    z-index:10;
    margin-right:8px;
    display:inline-block;
    position:relative;
    -webkit-transition:all 0.3s ease-in-out 0;
    transition:all 0.3s ease-in-out 0
}
.sk-circle .sk-child {
    width:100%;
    height:100%;
    position:absolute;
    left:0;
    top:0
}
.sk-circle .sk-child:before {
    content:'';
    display:block;
    margin:0 auto;
    width:15%;
    height:15%;
    background-color:var(--colorActive);
    border-radius:100%;
    -webkit-animation:sk-circleBounceDelay 1.2s infinite ease-in-out both;
    animation:sk-circleBounceDelay 1.2s infinite ease-in-out both
}
.sk-circle .sk-circle2 {
    -webkit-transform:rotate(30deg);
    -ms-transform:rotate(30deg);
    transform:rotate(30deg)
}
.sk-circle .sk-circle3 {
    -webkit-transform:rotate(60deg);
    -ms-transform:rotate(60deg);
    transform:rotate(60deg)
}
.sk-circle .sk-circle4 {
    -webkit-transform:rotate(90deg);
    -ms-transform:rotate(90deg);
    transform:rotate(90deg)
}
.sk-circle .sk-circle5 {
    -webkit-transform:rotate(120deg);
    -ms-transform:rotate(120deg);
    transform:rotate(120deg)
}
.sk-circle .sk-circle6 {
    -webkit-transform:rotate(150deg);
    -ms-transform:rotate(150deg);
    transform:rotate(150deg)
}
.sk-circle .sk-circle7 {
    -webkit-transform:rotate(180deg);
    -ms-transform:rotate(180deg);
    transform:rotate(180deg)
}
.sk-circle .sk-circle8 {
    -webkit-transform:rotate(210deg);
    -ms-transform:rotate(210deg);
    transform:rotate(210deg)
}
.sk-circle .sk-circle9 {
    -webkit-transform:rotate(240deg);
    -ms-transform:rotate(240deg);
    transform:rotate(240deg)
}
.sk-circle .sk-circle10 {
    -webkit-transform:rotate(270deg);
    -ms-transform:rotate(270deg);
    transform:rotate(270deg)
}
.sk-circle .sk-circle11 {
    -webkit-transform:rotate(300deg);
    -ms-transform:rotate(300deg);
    transform:rotate(300deg)
}
.sk-circle .sk-circle12 {
    -webkit-transform:rotate(330deg);
    -ms-transform:rotate(330deg);
    transform:rotate(330deg)
}
.sk-circle .sk-circle2:before {
    -webkit-animation-delay:-1.1s;
    animation-delay:-1.1s
}
.sk-circle .sk-circle3:before {
    -webkit-animation-delay:-1s;
    animation-delay:-1s
}
.sk-circle .sk-circle4:before {
    -webkit-animation-delay:-0.9s;
    animation-delay:-0.9s
}
.sk-circle .sk-circle5:before {
    -webkit-animation-delay:-0.8s;
    animation-delay:-0.8s
}
.sk-circle .sk-circle6:before {
    -webkit-animation-delay:-0.7s;
    animation-delay:-0.7s
}
.sk-circle .sk-circle7:before {
    -webkit-animation-delay:-0.6s;
    animation-delay:-0.6s
}
.sk-circle .sk-circle8:before {
    -webkit-animation-delay:-0.5s;
    animation-delay:-0.5s
}
.sk-circle .sk-circle9:before {
    -webkit-animation-delay:-0.4s;
    animation-delay:-0.4s
}
.sk-circle .sk-circle10:before {
    -webkit-animation-delay:-0.3s;
    animation-delay:-0.3s
}
.sk-circle .sk-circle11:before {
    -webkit-animation-delay:-0.2s;
    animation-delay:-0.2s
}
.sk-circle .sk-circle12:before {
    -webkit-animation-delay:-0.1s;
    animation-delay:-0.1s
}
@-webkit-keyframes sk-circleBounceDelay {
    0%, 80%, 100% {
        -webkit-transform:scale(0);
        transform:scale(0)
    }
    40% {
        -webkit-transform:scale(1);
        transform:scale(1)
    }
}
@keyframes sk-circleBounceDelay {
    0%, 80%, 100% {
        -webkit-transform:scale(0);
        transform:scale(0)
    }
    40% {
        -webkit-transform:scale(1);
        transform:scale(1)
    }
}

@media screen and (max-width: 800px){
    .comment{
        width: 90%
    }   
}
@media screen and (max-width: 600px) {
    .comment .comment-list .comment-item{
        .head{
            .img{
                width: 40px;
                height: 40px;
                margin-right: 12px;
            }
            .name{
                flex-direction: column;
                align-items: baseline;
                justify-content: space-evenly;
                margin-top: 2px;
                a{
                    font-size: 13px;
                    span{
                        margin-top: -2px;
                    }
                }
                .r{
                    margin-top: 2px;
                    .time{
                        font-size: 12px;    
                    }
                    .reply{
                        opacity: 1;
                        font-size: 12px;
                        color: #ef6d57;
                        position: absolute;
                        right: 0;
                        top: 13px;
                        cursor: pointer;
                        text-decoration: underline;
                        text-transform: capitalize;
                    }
                }
            }
        }
        .comment-content{
            padding: 0;
            margin-top: 12px;
        }
        .comments{
            margin-top: 32px;
            padding-left: 24px;
            .comments-content{
                margin-top: 12px;
                line-height: 22px;
                margin-left: 0px;
            }
        }
    }
}

@media screen and (max-width: 500px) {
    .comment .comment-form{
        padding: 10px;
        textarea, .input-box input{
            font-size: 13px;
        }
        textarea{
            padding: 12px;
        }
    }
}
</style>
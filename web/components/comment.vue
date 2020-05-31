<template>
    <div class="comment">
        <div class="comment-form" :class="isVerification?'verify':''">
            <div class="input-box">
                <input type="text" placeholder="Name" v-model="form.name">
                <input type="text" placeholder="Email" v-model="form.email">
            </div>
            <div class="reply-name" v-if="isReply">
                <span class="">@{{replyObjs.name || replyObj.name}}</span>
                <span class="iconfont icon-close" @click="cancel"></span>
            </div>
            <textarea class="textarea" placeholder="What do you want to say..." v-model="form.content"></textarea>

            <!-- submit loading -->
            <div class="bottom">
                <button type="button" @click="submitVerify" :class="submitStatus == 9?'active':''">SUBMIT</button>

                <template v-if="submitStatus == 9">
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
                        <span class="loading-text">Submitting...</span>
                    </div>
                </template>

                <template v-else-if="submitStatus == 1">
                    <div class="hint success">
                        <span class="iconfont icon-success"></span>
                        <span>评论成功, Nice.</span>
                    </div>
                </template>

                <template v-if="submitStatus!=0 && submitStatus!=1 && submitStatus != 9 ">
                    <div class="hint red">
                        <span class="iconfont icon-error"></span>
                        <span v-if="submitStatus == 3">您的名字是第一印象哦～</span>
                        <span v-else-if="submitStatus == 4">胆敢冒充站长，来人，拉出去砍了！！</span>
                        <span v-else-if="submitStatus == 5">请输入正确的邮箱，有惊喜的哦～</span>
                        <span v-else-if="submitStatus == 6">偷偷告诉我，你作文是不是0分～</span>
                        <span v-else-if="submitStatus == 7">哇哦！遇到错误，要不再试试</span>
                        <span v-else-if="submitStatus == 8">完成验证才可以提交哦～</span>
                    </div>
                </template>

            </div>
        </div>

        <template v-if="comment.length > 0">
            <h2><span>Comment List</span><span>({{comment.length}})</span></h2>
            <div class="comment-list">
                <!-- 评论列表 -->
                <div 
                    class="comment-item" 
                    v-for="(item, index) in comment" 
                    :key="index"
                    :data-id="item.id"
                >
                    <div class="comment-item-box">
                        <div class="head">
                            <div class="img">
                                <img :src="require('../static/image/comment/'+item.image+'.jpg')">
                            </div>
                            <div class="name">
                                <a>{{item.name}}<span v-if="item.author == 'admin'">行人</span></a>
                                <div class="r">
                                    <div class="reply" @click="reply(item, 1)">reply</div>
                                    <span class="time">{{item.time.time}} {{item.time.month.en}} {{item.time.day.on}}, {{item.time.year}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="comment-content">{{item.content}}</div>
                    </div>

                    <!-- 回复评论 -->
                    <!-- <div class="comments" v-if="item.comments.length > 0">
                        <div 
                            class="item" 
                            v-for="(items, indexs) in item.comments" 
                            :key="indexs"
                            :data-id="items.id"
                        >
                            <div class="head">
                                <div class="img">
                                    <img :src="require('../static/image/comment/'+items.image+'.jpg')">
                                </div>
                                <div class="name">
                                    <a>{{items.name}}<span v-if="items.author == 'admin'">行人</span></a>
                                    <div class="r">
                                        <div class="reply" @click="reply(item, 2, items)">reply</div>
                                        <span class="time">{{items.time.time}} {{items.time.monthEn}} {{items.time.day}}, {{items.time.year}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="comments-content"><span v-if="items.type != 1" class="reply-name">{{items.reply}} </span>{{items.content}}</div>
                        </div>
                    </div> -->
                </div>
            </div>
        </template>

        <!-- 验证 -->
        <div>
            <PuzzleVerification 
                blockType="puzzle" 
                :onSuccess="handleSuccess"
                :verificationShow="isVerification"
                @clone="isVerificationClone"
                v-if="isPuzzle"
            ></PuzzleVerification>
        </div>
    </div>
</template>

<script>
import PuzzleVerification from '@/components/puzzleVerification'
export default {
    props: ['id'],
    components: { 
        PuzzleVerification 
    },
    data() {
        return {
            comment: [],        // 评论列表

            form: {},           // 表单数据

            isReply: '',        // 回复
            replyObj: {},       // 回复对象的信息
            replyObjs: {},      // 二级回复对象的信息

            loading: true,             // 页面loading
            submitStatus: 0,          // 提交状态
            isVerification: false,      // 验证状态
            verificationSuccess: false, // 验证成功
            isPuzzle: true
        }
    },
    mounted(){
        // 获取评论
        this.$axios.get(`comment/${this.id}`).then(res => {
            if(res.data.status === 1){
                this.comment = res.data.body
            }
        })
    },
    methods: {
        // 取消验证
        isVerificationClone(){
            this.submitStatus = 8;
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
                this.submitStatus = 9; // loading
                this.submit();
            }, 600)
        },
        //取消回复
        cancel(){
            this.isReply = '';
            this.replyObj = {};
            this.replyObjs = {};
        },
        reply(item, type, items){

            // 设置滚动条位置
            this.$setScroll('.comment', -200, true);

            // 一级回复
            if(type == 1){
                this.isReply = 1;
                this.replyObj = item;
                this.replyObjs = {};
            }
            // 二级回复
            else{
                this.isReply = 2;
                this.replyObj = item;
                this.replyObjs = items;
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
             * 添加管理员标志
             * 指定管理员头像
             */
            if(this.comment.email == '1915398623@qq.com') this.comment.image = 1;

            this.$axios.post('comment', this.form)
                .then(res => {
                    if(res.data.status === 1){
                        this.submitStatus = 1;
                        this.verificationSuccess = false;
                        setTimeout(() => {
                            this.submitStatus = 0;
                        }, 3000)
                    }else{
                        this.verificationSuccess = false;
                        this.submitStatus = 7;
                    }
                })
                .catch(err => {
                    this.verificationSuccess = false;
                    this.submitStatus = 7;
                })

return
            this.$axios.put(`article_comment/${this.data._id}`, data)
                .then(res => {
                    if(res.data.status == 1){
                        setTimeout(() => {
                            /**
                             * if 回复评论
                             * el 发表评论
                             */
                            if(res.data.type){
                                this.isReply = '';
                                this.comment = {};
                                this.replyObj = {};
                                this.replyObjs = {};
                            }else{
                                this.data.comment.unshift(data)
                                this.comment = {}
                            }
                            this.verificationSuccess = false;
                            this.submitStatus = 1;
                            setTimeout(() => {
                                this.submitStatus = 0;
                            }, 3000)
                        }, 1000)
                    }else{
                        this.verificationSuccess = false;
                        this.submitStatus = 7;
                    }                    
                })
                .catch(err => {
                    this.verificationSuccess = false;
                    this.submitStatus = 7;
                })

                
            var data = '';
            // 回复评论
            if(this.isReply){
                /**
                 * 根据当前评论id，和最新子评论的id，生成id
                 */
                let length = this.replyObj.comments.length;
                let count = 0;
                if(length == 0){
                    count = Number(this.replyObj.id + '001');
                }else{
                    count = this.replyObj.comments[length - 1].id;
                    count++;
                }
                /**
                 * id
                 * 回复对象名字
                 * 回复对象邮箱
                 */
                this.comment.id = count;

                // 一级回复
                if(this.isReply == 1){
                    this.comment.type = 1;
                    this.comment.reply = '@' + this.replyObj.name;
                    this.comment.replyEmail = this.replyObj.email;
                }else{
                    // 二级回复
                    this.comment.type = 2;
                    this.comment.reply = '@' + this.replyObjs.name;
                    this.comment.replyEmail = this.replyObjs.email;
                }

                /**
                 * 当前评论数组的索引
                 * 所有子评论集合
                 */
                let comment = this.data.comment;
                let index = comment.indexOf(this.replyObj);

                let replyIdx = comment.length - 1 - index;
                let newArr = this.data.comment[index].comments;

                newArr.push(this.comment)

                /**
                 * 评论数据
                 * 回复模式
                 * 评论索引
                 * email: 邮件通知的信息
                 */
                data = {
                    body: newArr,
                    email: {
                        name: this.comment.reply.slice(1),
                        email: this.comment.replyEmail,
                        title: this.data.title,
                        url: window.location.href
                    },
                    type: 'isReply',
                    index: replyIdx
                }
            }
            // 发表评论
            else{
            }

            
        },
        // 提交验证
        submitVerify(){
            // loading 状态
            if(this.submitStatus == 9) return;

            const map = {
                name: () => {
                    return {
                        code: 3,
                        type: !this.form.name
                    }
                },
                admin: () => {
                    return {
                        code: 4,
                        type: this.form.name == '李白' && this.form.email != '1915398623@qq.com'
                    }
                },
                email: ()=>{
                    return {
                        code: 5,
                        type: !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.form.email)
                    }
                },
                content: () => {
                    return {
                        code: 6,
                        type: !this.form.content
                    }
                }
            }

            // 验证
            for(let i in map){
                const result = map[i]();
                if(result.type){
                    this.submitStatus = result.code
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
        },
    }
}
</script>


<style lang="scss" scoped>
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
    .comment-form{
        border:1px solid #eee;
        margin-bottom:60px;
        border-radius:6px;
        padding:15px 12px;
        transition: all .3s;
        &.verify{
            filter: blur(5px);
        }
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
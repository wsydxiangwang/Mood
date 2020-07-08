<template>
    <div class="comment">
        <section class="comment-section" style="transition:all .3s">
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
                    <transition-group name="comment-item">
                        <!-- Comment List -->
                        <div 
                            class="comment-item" 
                            v-for="item in comment.data" 
                            :key="item.id"
                            :data-id="item.id"
                        >
                            <div class="comment-item-box">
                                <div class="head">
                                    <div class="img">
                                        <img :src="'/image/comment/'+item.image+'.jpg'">
                                    </div>
                                    <div class="name">
                                        <a>{{item.name}}<span v-if="item.admin">{{$store.state.data.admin_mark || '行人'}}</span></a>
                                        <div class="r">
                                            <div class="reply" @click="reply(item, 1)">reply</div>
                                            <span class="time">{{item.time.time}} {{item.time.month.en}} {{item.time.day.on}}, {{item.time.year}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-content">{{item.content}}</div>
                            </div>

                            <!-- Reply to list -->
                            <div class="comments" v-if="item.child.length > 0">
                                <transition-group name="comment-child">
                                    <div 
                                        class="item" 
                                        v-for="items in item.child" 
                                        :key="items.id"
                                        :data-id="items.id"
                                    >
                                        <div class="head">
                                            <div class="img">
                                                <img :src="'/image/comment/'+items.image+'.jpg'">
                                            </div>
                                            <div class="name">
                                                <a>{{items.name}}<span v-if="items.admin">{{$store.state.data.admin_mark || '行人'}}</span></a>
                                                <div class="r">
                                                    <div class="reply" @click="reply(item, 2, items)">reply</div>
                                                    <span class="time">{{items.time.time}} {{items.time.month.en}} {{items.time.day.on}}, {{items.time.year}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="comments-content"><span v-if="items.type===3" class="reply-name"> @{{items.reply_name}} </span>{{items.content}}</div>
                                    </div>
                                </transition-group>
                            </div>
                        </div>
                    </transition-group>
                </div>
            </template>
        </section>
        
        <div>
            <PuzzleVerification 
                blockType="puzzle" 
                :onSuccess="verifyResult"
                :verificationShow="isVerification"
                @clone="verifyResult"
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
            comment: {},
            form: {},

            status: 10,
            hint: [
                '您的名字是第一印象哦～',
                '胆敢冒充站长，来人，拉出去砍了！！',
                '请输入正确的邮箱～',
                '偷偷告诉我，你作文是不是0分～',
                '哇哦！遇到错误，要不再试试',
                '完成验证才可以提交哦～',
                'Submitting...',
                '提交成功, Nice.'
            ],

            isVerification: false,
            verificationSuccess: false,

            isReply: false,
            replyObj: {},
        }
    },
    mounted(){
        this.$axios.get(`comment/${this.id}`).then(res => {
            if(res.data.status === 1){
                this.comment = res.data.body
                this.$emit('total', this.comment.total)
            }
        })
    },
    methods: {
        // Validation results
        verifyResult(type){
            ['header', 'section', '.comment-section'].map(item => {
                document.querySelector(item).classList.remove('verify')
            })
            this.isVerification = false;
            setTimeout(() => {
                if(type){
                    this.status = 5;
                }else{
                    this.status = 6;
                    setTimeout(this.submit, 500) // start submit
                }
            }, 600)
        },
        // Cancel reply
        cancel(){
            this.replyObj = {};
            this.isReply = false;
        },
        // Reply Mode
        reply(item, type, items){
            this.$setScroll('.comment', 'comment');
            this.isReply = true;
            this.replyObj = {
                parent_id: item.id,
                type: type == 1 ? 2 : 3,
                reply_name: type == 1 ? item.name : items.name,
                reply_email: type == 1 ? item.email : items.email,
            }
        },
        // Verification
        submitVerify(){
            // loading
            if(this.status == 6) return;
            
            const data = this.$store.state.data
            const map = {
                name: () => {
                    return {
                        code: 0,
                        type: !this.form.name
                    }
                },
                // Administrator
                admin: () => {
                    return {
                        code: 1,
                        type: (this.form.name == data.email_name && this.form.email != data.email) || (this.form.name != data.email_name && this.form.email == data.email)
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

            // Content Verification
            for(let i in map){
                const result = map[i]();
                if(result.type){
                    this.status = result.code
                    return;
                }
            }

            // Puzzle Verification
            ['header', 'section', '.comment-section'].map(item => {
                document.querySelector(item).classList.add('verify')
            })
            this.isVerification = true;
        },
        // Submit Comment
        submit(){
            this.form = {
                name: this.form.name.trim(),
                time: this.dateFormat(),
                email: this.form.email.trim(),
                image: Math.floor(Math.random() * 10 + 1),
                content: this.form.content.trim().replace(/<script.*?>.*?<\/script>/ig, ''),
                topic_id: this.id,
            }

            /**
             * Administrator Mark
             */
            const data = this.$store.state.data
            if(this.form.email == data.email && this.form.name == data.email_name){
                this.form.image = 1;
                this.form.admin = true;
            }

            const formData = {
                title: this.title,
                url: window.location.href,
                type: this.isReply ? 1 : 2,
                data: Object.assign({}, this.replyObj, this.form),
                is_email: this.$store.state.data.email_comment
            }
            
            this.$axios.post('comment', formData)
                .then(res => {
                    if(res.data.status === 1){
                        /**
                         * To Append Data
                         */
                        const data = res.data.body;

                        if(data.type === 1){
                            this.comment.data.unshift(data)
                        }else{
                            const id = data.parent_id;
                            this.comment.data.filter(i => i.id == id).forEach(item => item.child.push(data))
                        }

                        // Comment total +1 
                        this.$set(this.comment, 'total', this.comment.total + 1)
                        this.$emit('total', this.comment.total)

                        /**
                         * Reset State
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
                })
                .catch(err => {
                    this.status = 4;
                })
        },
        // FormatTime
        dateFormat(){
            const date = new Date();
            const opt = {
                "Y": date.getFullYear().toString(),     
                "M": (date.getMonth() + 1).toString(),  
                "D": date.getDate().toString(),         
                "H": date.getHours().toString(),        
                "m": date.getMinutes().toString(),      
            }
            for(let i in opt){
                opt[i] = opt[i].length == 1 ? opt[i].padStart(2, "0") : opt[i]
            }
            return `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`
        }
    }
}
</script>


<style lang="scss" scoped>
/**
 * 过渡   
 */
.comment-item-enter, .comment-item-leave-to{
    opacity: 0;
    margin-top: -118px;
}
.comment-child-enter, .comment-child-leave-to{
    opacity: 0;
}

.verify{
    filter: blur(5px);
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
            background: url('~static/image/comment/plbj.png') no-repeat bottom right;
            &:focus{
                border-color: #b9b9b9;
            }
        }
    }
    .comment-list{
        padding: 0 0 60px;
        overflow: hidden;
        .comment-item{
            padding: 25px 0;
            border-bottom: 1px solid #f6f7f8;
            transition : margin 1s, opacity 2s;
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
                margin-top: 32px;
                transition: all 2s;
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
        display: flex;
        align-items: center;
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
            &:first-child{
                margin-right: 4px;
            }
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
    .comment .comment-list{
        padding: 0 0 40px;
        .comment-item{
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
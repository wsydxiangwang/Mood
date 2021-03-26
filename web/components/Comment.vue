<template>
    <div class="comment">
        <section class="comment-section">
            <div class="comment-form">
                <div class="input-box">
                    <input 
                        v-for="(val, key, index) in { name: 'Name', email: 'Email'}"
                        type    ="text" 
                        :placeholder="val" 
                        v-model="form[key]"
                        :key="index"
                    >
                </div>
                <div class="reply-name" v-if="isReply">
                    <span class="">@{{ replyObj.reply_name }}</span>
                    <span class="iconfont icon-close" @click="cancel"></span>
                </div>

                <textarea 
                    class="textarea" 
                    placeholder="What do you want to say..." 
                    v-model="form.content"
                ></textarea>

                <!-- submit button and loading -->
                <div class="bottom">
                    <button 
                        id="comment"
                        type="button" 
                        @click="submitVerify" 
                        :class="status == 9?'active':''"
                    >SUBMIT</button>

                    <template v-if="status == 7">
                        <div class="hint loading">
                            <div class="sk-circle selected">
                                <div 
                                    v-for="item in 12"
                                    class="sk-child"
                                    :class="'sk-circle' + item"
                                    :key="item"
                                ></div>
                            </div>
                            <span class="loading-text">{{ hint[status] }}</span>
                        </div>
                    </template>

                    <template v-else-if="status == 8">
                        <div class="hint success">
                            <span class="iconfont icon-success"></span>
                            <span>{{ hint[status] }}</span>
                        </div>
                    </template>

                    <template v-else-if="status!=7 && status!=8 && status!=10">
                        <div class="hint red">
                            <span class="iconfont icon-error"></span>
                            <span>{{ hint[status] }}</span>
                        </div>
                    </template>

                </div>
            </div>

            <!-- comment box -->
            <template v-if="comment.total > 0">
                <h2>
                    <span>Comment List</span>
                    <span>({{ comment.total }})</span>
                </h2>
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
                                        <a :class="{'admin-mark': item.admin}">{{ item.name }}<span class="mark-tit" v-if="item.admin">这里有我，并且不止有我</span></a>
                                        <div class="r">
                                            <div class="reply" @click="reply(item, 1)">reply</div>
                                            <span class="time">{{ getCommentDate(item.time) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-content">{{ item.content }}</div>
                            </div>

                            <!-- sub-comment to list -->
                            <div class="comment-child-list" v-if="item.child.length > 0">
                                <transition-group name="comment-child">
                                    <div 
                                        class="comment-child-item"
                                        v-for="items in item.child" 
                                        :key="items.id"
                                        :data-id="items.id"
                                    >
                                        <div class="head">
                                            <div class="img">
                                                <img :src="'/image/comment/'+items.image+'.jpg'">
                                            </div>
                                            <div class="name">
                                                <a :class="{'admin-mark': items.admin}">{{ items.name }}<span class="mark-tit" v-if="items.admin">这里有我，并且不止有我</span></a>
                                                <div class="r">
                                                    <div class="reply" @click="reply(item, 2, items)">reply</div>
                                                    <span class="time">{{ getCommentDate(items.time) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="comment-child-content">
                                            <span v-if="items.type===3" class="reply-name"> @{{ items.reply_name }} </span>
                                            <p>{{ items.content }}</p>
                                        </div>
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
                @clone="verifyResult"
                :onSuccess="verifyResult"
                :verificationShow="isVerification"
            />
        </div>

        <div class="admin-popup" :class="adminPopupStatus">
            <span class="iconfont icon-close2" @click="verifyPopup('admin', false)"></span>
            <img :src="data.base.admin_avatar">
            <div>
                哇哦～恭喜你，发现了一个小彩蛋～～
            </div>
            <input type="text" placeholder="请输入管理员身份标识码" v-model="adminCode">
            <p class="hint" v-if="status == 3">
                <span class="iconfont icon-error"></span>
                <span>{{ hint[status] }}</span>
            </p>
            <button @click="verifyResult('admin')">确定</button>
        </div>
    </div>
</template>

<script>
import PuzzleVerification from '@/components/PuzzleVerification'
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
                '请输入正确的邮箱，期待回信～',
                '偷偷告诉我，你作文是不是0分～',
                '胆敢冒充站长，来人，拉出去砍了！！',
                '多说一点儿吧，至少能成一句诗～',
                '哇哦！遇到错误，要不再试试',
                '完成验证才可以提交哦～',
                'Submitting...',
                '提交成功, Nice.'
            ],

            isVerification: 0,
            verificationSuccess: false,

            isReply: false,
            replyObj: {},

            adminPopup: 0,
            adminCode: '',
        }
    },
    mounted(){
        // get localStorage comment info
        const info = JSON.parse(localStorage.getItem('comment'))
        if (info) {
            for (let i of ['name', 'email', 'image']) {
                this.$set(this.form, i, info[i])
            }
        }
        // get comment data
        this.$axios.get(`comment/${this.id}`).then(res => {
            if (res.data.status === 1) {
                this.comment = res.data.body
                this.$emit('total', this.comment.total)
            }
        })
    },
    computed: {
        data() {
            return this.$store.state.data
        },
        adminPopupStatus() {
			const o = {
				0: '',
				1: 'show',
				2: 'exit'
			}
			return o[this.adminPopup]
        }
    },
    methods: {
        // 1. Verification
        submitVerify() {
            if (this.status == 7) {  // loading
                return
            }
            const list = [
                this.form.name,
                /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.form.email),
                this.form.content,
                !(this.form.name == this.getInfo('name') || this.form.email == this.getInfo('email')),
            ]
            for (let i in list) {
                if (i == 2 && (!list[i] || list[i].length < 5)) {
                    this.status = 4
                    return
                }
                if (!list[i]) {
                    if (i == 3) {
                        this.verifyPopup('admin', true)
                    } else {
                        this.status = i
                    }
                    return
                }
            }
            this.verifyPopup('slider', true)
        },
        // 2. toggle view        
        verifyPopup(type, result) {
            const css = result ? 'add' : 'remove'
            const status = result ? 1 : 2

            this.toggleClass(css)

            if (type == 'slider') {
                this.isVerification = status
            } else if (type == 'admin') {
                this.adminPopup = status
                this.adminCode = ''
            }
        },
        // 3. Validation results
        verifyResult(type, result) {
            if (type == 'slider') {
                this.verifyPopup('slider', false)
                setTimeout(() => {
                    if (result) {
                        setTimeout(this.submit)     // 4. submit data
                    } else {
                        this.status = 6
                    }
                }, 600)
            } else if (type == 'admin') {
                if (this.adminCode == this.getInfo('code')) {
                    this.verifyPopup('admin', false)
                    setTimeout(this.submit, 400) // 4. submit data
                } else {
                    this.status = 3
                }
            }
        },
        // Reply Mode
        reply(item, type, items) {
            this.isReply = true
            this.replyObj = {
                parent_id: item.id,
                type: type == 1 ? 2 : 3,
                reply_name: type == 1 ? item.name : items.name,
                reply_email: type == 1 ? item.email : items.email,
            }
            this.$nextTick(() => this.$setScroll('comment'))
        },
        // Cancel reply
        cancel(){
            this.replyObj = {}
            this.isReply = false
        },
        // 4. Submit Comment
        submit(){
            this.status = 7;    // loading

            const LoadingStartTime = new Date().getTime()

            // image
            const info = JSON.parse(localStorage.getItem('comment'))
            if (!this.form['image'] || (info && info['name'] != this.form['name'])) {
                this.form.image = Math.floor(Math.random() * 10 + 1)
            }

            /**
             * Administrator Mark
             */
            if (
                this.form.name == this.getInfo('name') ||
                this.form.email === this.getInfo('email')
            ){
                this.form.image = 1
                this.form.admin = true
            }

            const content = this.form.content.trim().replace(/<script.*?>.*?<\/script>/ig, '')
            const other = {
                time: this.dateFormat(),
                topic_id: this.id,
                content
            }
            
            const data = {
                ...this.replyObj,   // reply info
                ...this.form,       // form info
                ...other        
            }

            // send Email notification information
            const params = {
                data,
                title: this.title,
                url: window.location.href,
                type: this.isReply ? 2 : 1,
                isEmail: this.getInfo('comment')
            }

            this.$axios.post('comment', params).then(res => {
                if (res.data.status === 1) {
                    // loading 500ms
                    let timer = 500 - new Date().getTime() + LoadingStartTime
                    timer = timer < 0 ? 0 : timer

                    setTimeout(() => {
                        // To Append Data
                        const data = res.data.body
                        if (data.type === 1) {
                            this.comment.data.unshift(data)
                        } else {
                            const id = data.parent_id
                            this.comment.data.filter(i => i.id == id).forEach(item => item.child.push(data))
                        }
                        // Comment total +1 
                        this.$set(this.comment, 'total', this.comment.total + 1)
                        this.$emit('total', this.comment.total)

                        // form & local
                        const formInfo = ['name', 'email', 'image']
                        this.form = formInfo.reduce((t, i) => {
                            t[i] = this.form[i]
                            return t
                        }, {})

                        localStorage.setItem('comment', JSON.stringify(this.form))

                        /**
                         * Reset State
                         */
                        this.replyObj = {}
                        this.isReply = false
                        this.status = 8
                        setTimeout(() => this.status = 10, 3000)
                        
                    }, timer)
                } else {
                    this.status = 4
                }
            })
            .catch(err => {
                this.status = 4
            })
        },
        toggleClass(type) {
            ['header', 'section', '.comment-section'].forEach(item => {
                document.querySelector(item).classList[type]('verify')
            })
        },
        getCommentDate(time) {
            return `${time.time} ${time.month.en} ${time.day.on}, ${time.year}`
        },
        getInfo(type) {
            return this.data.administrator[type]
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
 * 新增评论 过渡效果
 */
.comment-item-enter, .comment-item-leave-to{
    opacity: 0;
    margin-top: -118px;
}
.comment-child-enter, .comment-child-leave-to{
    opacity: 0;
}

@keyframes fadeInTop
{
	from {
		opacity: 0;
		visibility: hidden;
        margin-top: 80px;
	}
	to {
		opacity:1;
		visibility: visible;
        margin-top: 0;
	}
}
@keyframes fadeInDown
{
	from {
		opacity:1;
		visibility: visible;
        margin-top: 0;
	}
	to {
		opacity: 0;
		visibility: hidden;
        margin-top: -80px;
	}
}
.comment{
    width: 800px;
    margin: auto;
    .comment-section{
        transition: none;
    }
    .admin-popup{
        position: fixed;
        top: 50%;
        left: 50%;
        width: 310px;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px #dbdbdb;
        padding: 40px 30px 30px;
        border-radius: 6px;
        background: rgb(255, 255, 255);
        z-index: 999999;
        text-align: center;
        opacity: 0;
        visibility: hidden;
        &.show{
            animation: fadeInTop 0.6s both;
        }
        &.exit{
            animation: fadeInDown 0.6s both;
        }
        .icon-close2{
            position: absolute;
            right: 15px;
            top: 15px;
            color: var(--color-text-4);
            cursor: pointer;
            &:hover{
                color: var(--colorComment)
            }
        }
        input{
            height: 34px;
            border: 1px solid var(--color-border-1);
            border-radius: 6px;
            padding: 2px 10px 0;
            text-align: left;
            outline: none;
            font-size: 12px;
            display: block;
            width: 100%;
            text-align: center;
            transition: all .3s;
            &::-webkit-input-placeholder{
                color:var(--color-text-4);
            }
            &::-moz-placeholder{   /* Mozilla Firefox 19+ */
                color:var(--color-text-4);
            }　　
            &:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                color:var(--color-text-4);
            }
            &:-ms-input-placeholder{  /* Internet Explorer 10-1*/
                color:var(--color-text-4);
            }
            &:hover{
                border-color: rgb(210, 210, 210);
            }
        }
        button{
            height: 34px;
            line-height: 36px;
            width: 100px;
            font-size: 14px;
            color: var(--color-bg-primary);
            border-radius: 6px;
            background: var(--color-active);
            cursor: pointer;
            outline: none;
            border: none;
            margin: 12px 0 0;
            transition: all .3s;
            border: none;
        }
        img{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: auto;
            display: inline-block;
            margin-bottom: 15px;
        }
        div{
            font-size: 14px;
            color: var(--color-text-1);
            margin-bottom: 14px;
        }
        p{
            color: var(--color-red);
            font-size: 12px;
            margin: 10px 0 0;
            span{
                font-size: 12px;
            }
        }
    }
    h2{
        color: var(--color-text-1);
        font-weight: 400;
        margin-bottom: 20px;
        display: inline-block;
        span{
            &:first-child{
                font-size: 18px;
                margin-right: 8px;
                border-bottom: 1px solid var(--color-text-2);
            }
        }
    }
    .comment-form{
        border: 1px solid var(--color-border-1);
        margin-bottom: 60px;
        border-radius: 6px;
        padding: 15px 12px;
        transition: all .3s;
        .input-box{
            display:flex;
            input{
                width: 50%;
                height: 38px;
                font-size: 14px;
                padding-left: 10px;
                margin-right: 12px;
                transition: border .3s;
                border: none;
                outline: none;
                color: var(--color-text-1);
                background: var(--color-bg-primary);
                border-bottom: 1px dashed var(--color-border-1);
                &:focus{
                    border-color: var(--color-border-3);
                }
                &:last-child{
                    margin: 0;
                }
            }
        }
        .reply-name{
            color: var(--color-bg-primary);
            display: inline-block;
            background: var(--color-active);
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
            width: 100%;
            height: 200px;
            margin: 10px 0;
            color: var(--color-text-1);
            border: 1px dashed var(--color-border-1);
            -webkit-transition: all .3s;
            transition: all .3s;
            border-radius: 4px;
            font-size: 14px;
            padding: 15px;
            outline: none;
            resize: none;
            background: url('~static/image/comment/plbj.png') no-repeat bottom right;
            &:focus{
                border-color: var(--color-border-3);
            }
        }
    }
    .comment-list{
        padding: 0 0 80px;
        overflow: hidden;
        .comment-item{
            border-bottom: 1px solid var(--color-border-2);
            transition : margin 1s, opacity 2s;
            .comment-item-box{
                padding: 25px 0;
                &:hover .head .name .r .reply{
                    opacity: 1;
                }
            }
            .head{
                display: flex;
                position: relative;
                .img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    margin-right: 12px;
                    overflow: hidden;
                    border: 1px solid #f1f1f1;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .name{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    a{
                        font-weight: 400;
                        color: #ef6d57;
                        font-size: 16px;
                        height: 20px;
                        -webkit-transition: all .3s;
                        transition: all .3s;
                        text-decoration: none;
                        position: relative;
                        &:hover{
                            color: #ef2f11;
                            text-decoration: underline;
                        }
                        &.admin-mark{
                            &:hover .mark-tit{
                                opacity: 1;
                                visibility: visible;
                                transform: scale(1);
                            }
                            .mark-tit{
                                position: absolute;
                                white-space: nowrap;
                                font-size: 12px;
                                background: #ef6d57;
                                color: #fff;
                                bottom: 100%;
                                left: 100%;
                                border-radius: 20px;
                                padding: 0 10px;
                                height: 24px;
                                line-height: 26px;
                                margin-bottom: 6px;
                                transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                                transform-origin: left bottom;
                                transform: scale(0);
                                opacity: 0;
                                visibility: hidden;
                                z-index: 999;
                                &::before{
                                    content: "";
                                    border: 10px solid transparent;
                                    border-right-width: 10px;
                                    border-right-color: #ef6d57;
                                    border-bottom-width: 0px;
                                    position: absolute;
                                    left: 10px;
                                    top: 22px;
                                    transform: rotate(188deg);
                                }
                            }
                            &::before{
                                content: "";
                                height: 6px;
                                width: 6px;
                                background: #f16339;
                                border-radius: 50%;
                                position: absolute;
                                left: 100%;
                                top: 50%;
                                transform: translateY(-50%);
                                box-shadow: 0 0 0 4px rgba(241, 99, 57, 0.1);
                                margin: 2px 8px;
                                animation: flash 8s infinite;
                            }
                        }
                        @keyframes flash {
                            0%, 50%, 100% {
                                opacity: 1;
                            }
                            25%, 75% {
                                opacity: 0;
                            }
                        }
                    }
                    .r{
                        display: flex;
                        .time{
                            color:var(--color-text-4);
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
                color: var(--color-text-1);
                line-height: 22px;
                padding: 0 0 0 58px;
                white-space: pre-wrap;
            }
        }
        .comment-child-list {
            padding-left: 45px;
            .comment-child-item {
                transition: all 2s;
                padding: 12px 0 18px;
                &:hover{
                    .head .name .r .reply{
                        opacity: 1;
                    }
                }
                .head{
                    display: flex;
                    align-items: center;
                    position: relative;
                    .img{
                        width: 40px;
                        height: 40px;
                    }
                    &:after{
                        content: "";
                        border-top: 1px solid var(--color-border-2);
                        position: absolute;
                        top: -12px;
                        right: 0;
                        left: 52px;
                    }
                }
                .comment-child-content{
                    color: var(--color-text-1);
                    padding: 0;
                    line-height: 22px;
                    margin: 0 0 0 50px;
                    white-space: pre-wrap;
                    span{
                        color: var(--color-bg-primary);
                        background: #a9cff3;
                        display: inline-block;
                        height: 18px;
                        padding: 0 4px;
                        line-height: 20px;
                        border-radius: 10px;
                        margin-right: 4px;
                        font-size: 13px;
                    }
                    p{
                        display: inline;
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
        color:var(--color-text-5);
        border-radius:6px;
        background:var(--color-border-1);
        cursor:pointer;
        outline:none;
        border:none;
        margin-right: 12px;
        transition:all .3s;
        &:hover, &.active{
            color: #fff;
            background: var(--color-active);
        }
    }
    .hint{
        display: flex;
        align-items: center;
        &.loading{
            display: flex;
            align-items: center;
            .loading-text{
                color: var(--color-active);
                padding-top: 3px;
            }
        }
        &.red span{
            color: var(--color-red);
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
    background-color:var(--color-active);
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

@media screen and (max-width: 820px){
    .comment{
        width: 86%;
        .comment-list{
            padding-bottom: 100px;
        }
    }   
}
@media screen and (max-width: 600px) {
    .comment .comment-list{
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
            .comment-child-list{
                padding-left: 24px;
                .comment-child-content{
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
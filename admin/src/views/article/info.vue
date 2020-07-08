<template>
    <div class="article-new" v-loading.fullscreen.lock="fullscreenLoading">

        <section>
            <h2 class="tit">无人问津的心情，在黑纸白字间游荡！</h2>
            <el-input
                placeholder="标题"
                v-model="data.title"
                clearable>
            </el-input>
        </section>

        <mavon-editor 
            :ishljs="true" 
            @change="change" 
            v-model="data.content" 
            :subfield="false"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
            ref="md" 
        />

        <section>
            <date 
                @getDate="getDate" 
                :originalDate="data.time" 
                v-if="isReset"
            ></date>
            <el-input
                placeholder="文章摘要"
                v-model="data.describe"
                prefix-icon="el-icon-document"
                clearable>
            </el-input>

            <div class="upload-box" v-if="!uploadToggle">
                <el-upload
                    class="upload-demo"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="musicUpload"
                    action=""
                    drag
                >
                    <template v-if="data.music && data.music.url">
                        <i class="el-icon-headset"></i>
                        <div class="el-upload__text">{{data['music'].name}}</div>
                    </template>
                    <template v-else>
                        <i class="el-icon-headset"></i>
                        <div class="el-upload__text">背景音乐</div>
                    </template>
                </el-upload>
                <el-upload
                    class="upload-demo"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="imgUpload"
                    action=""
                    drag
                >
                    <img v-if="data.image && data.image.url" :src="data.image.url">
                    <i class="el-icon-picture-outline-round"></i>
                    <div class="el-upload__text">封面图片 (680*440)</div>
                </el-upload>
            </div>
            <template v-else>
                <el-input
                    placeholder="音乐地址"
                    v-model="data.music.url"
                    prefix-icon="el-icon-headset"
                    clearable>
                </el-input>
                <el-input
                    placeholder="封面图片"
                    prefix-icon="el-icon-picture-outline-round"
                    v-model="data.image.url"
                    clearable>
                </el-input>
            </template>

            <el-switch
                v-model="uploadToggle"
                active-text="输入链接"
                inactive-text="文件上传"
            >
            </el-switch>

            <el-switch
                v-model="data.hide"
                inactive-text="发布文章"
                active-text="隐藏文章">
            </el-switch>
        </section>

        <el-button type="primary" class="submit" @click="submit">SUBMIT</el-button>
    </div>
</template>

<script>
import date from '@/components/date'
import { mapState } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        date,
        mavonEditor
    },
    data() {
        return {
            data: {
                title: '',              // 标题
                content: '',            // 内容
                contentHtml: '',        // 内容解析html
                describe: '',           // 文章摘要
                time: '',               // 时间
                image: {},              // 图片
                music: {},              // 音乐
                hide: false,            // 隐藏
            },
            isReset: true,
            id: '',                     // 当前文章id（编辑）

            upload: {},
            uploadToggle: false,

            fullscreenLoading: false,
            loading: ''
        }
    },
    created(){
        this.id = this.$route.query.id;
        if(this.id) this.loadData(this.id);
    },
    watch: {
        'data.image.url': {
            handler(val) {
                if(!val){
                    delete this.upload['image']
                }
            }
        },
        'data.music.url': {
            handler(val) {
                if(!val){
                    delete this.upload['music']
                }
            }
        }
    },
    computed: {
        ...mapState(['$data'])
    },
    methods: {
        musicUpload(file){
            this.uploads('music', file)
        },
        imgUpload(file){
            this.uploads('image', file)
        },
        // 保存临时文件
        uploads(type, file){
            const name = type == 'music' ? 'audio' : 'image';
            if (!file.raw.type.includes(name)) {
                this.$message.error(`请选择${name}格式的文件!`)
                return
            }
            const formData = new FormData();
            formData.append('file', file.raw);        
            formData.append('type', this.$data.info.upload_type);    

            this.$set(this.data, type, {
                url: URL.createObjectURL(file.raw),
                name: file.name
            })

            this.$set(this.upload, type, {
                url: URL.createObjectURL(file.raw),
                name: file.name,
                formData
            })
        },
        $imgAdd(pos, $file){
           var formdata = new FormData();
           formdata.append('file', $file);
           formdata.append('type', this.$data.info.upload_type);

           this.$http.post('/upload', formdata).then(res => {           
               this.$refs.md.$img2Url(pos, res.data.url);
            })
        },
        $imgDel(pos){
            const data = {
                url: pos[0],
                type: this.$data.info.upload_type
            }
            this.$http.post('/delete_file', data)
        },
        change(value, render){
            this.data.contentHtml = render;     // 解析的html
            this.data.content = value;          // 输入的内容
            this.data.words = value.length;     // 字数
        },
        async submit(){
            const map = {
                'title': '请输入标题',
                'content': '请输入内容',
                'time': '请选择时间',
            }
            for(let i in map){
                if(!this.data[i]){
                    this.$message.error(`${map[i]}`);
                    return;
                }
            }

            this.fullscreenLoading = true;
            
            // 上传文件
            if(!this.uploadToggle){
                for(let i in this.upload){
                    const result = await this.$http.post('/upload', this.upload[i].formData);
                    if(result.data.status == 100){
                        this.data[i].url = result.data.url;
                    }else{
                        // 错误
                        this.$message.error('图片上传失败, 请检查网络!');
                        this.fullscreenLoading = false;
                    }
                }
            }

            // 摘要默认内容
            const describe = this.data.describe;
            this.data.describe = !describe ? this.data.content.slice(0, 60) + '...' : describe;

            const type = this.id ? `article/${this.data._id}` : 'article';
            const mesg = this.id ? '更新' : '发表';

            // 网站和管理员的信息
            const email = this.$data.info['email']
            email.web_name = this.$data.info['web_name']
            email.web_address = this.$data.info['address']

            this.$http.post(type, {data: this.data, email}).then(res => {
                setTimeout(() => {
                    if(res.data.status === 1){
                        this.$message({
                            message: `${mesg}成功`,
                            type: 'success'
                        });
                        this.$router.push('/article')
                        this.$infoUpdate() // 刷新状态
                    }else{
                        this.$message.error(`${mesg}失败，请检查网络问题!`);
                    }
                    this.fullscreenLoading = false;
                }, 500)
            })
        },
        // 获取时间
        getDate(val){
            this.data.time = val;
        },
        // 获取当前文章的数据
        async loadData(id){

            this.loading = this.$loading({target: '.container'})

            const res = await this.$http.get(`article/${id}`)

            setTimeout(() => {
                this.data = res.data.body;
                this.isReset = false;
                this.$nextTick(() => { this.isReset = true; })
                this.loading.close()
            }, 500)
        },
    }
}
</script>

<style lang="scss" scoped>
section{
    margin: 15px 0;
    .el-switch, .el-input{
        width: 100%;
        height: 38px;
        margin: 8px 0;
    }
}
.markdown-body{
    height: 65vh;
    box-shadow: none !important;
    border: 1px solid #eee !important;
}
.submit{
    width: 200px;
    height: 40px;
    font-size: 14px;
    color: #fff;
}
.upload-box{
    display: flex;
    margin: 10px -7px 6px;
    .upload-demo{
        width: 50%;
        max-width: 360px;
        margin: 0 7px;
        /deep/ .el-upload{
            width: 100%;
            .el-upload-dragger{
                width: 100%;
                .el-icon-picture-outline-round,
                .el-icon-headset{
                    font-size: 46px;
                    color: #c0c4cc;
                    margin: 42px 0 14px;
                    line-height: 50px;
                    transition: all .3s;
                }
                .el-upload__text{
                    color: #98999c;
                    transition: all .3s;
                }
                &:hover{
                    .el-icon-picture-outline-round, 
                    .el-upload__text, 
                    .el-icon-headset{
                        color: #409EFF;
                    }
                }
            }
        }
    }
    img{
        width: 100%;
    }
}
/deep/ .el-switch__label{
    color: #98999c;
    font-weight: 400;
    &.is-active{
        color: #409EFF;
    }
}
@media screen and (max-width: 600px) {
    .markdown-body{
        height: 90vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 0 0 20px;
        line-height: 36px;
        padding: 0;
    }
    .upload-box .upload-demo /deep/ .el-upload .el-upload-dragger{
        height: 130px;
        .el-icon-picture-outline-round, .el-icon-headset{
            font-size: 36px;
            margin: 22px 0 10px;
        }
    }
}
</style>
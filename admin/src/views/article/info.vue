<template>
    <div class="article-new" v-loading.fullscreen.lock="fullscreenLoading">

        <section>
            <h2 class="tit">无人问津的心情，在黑纸白字间游荡！</h2>
            <el-input placeholder="标题" v-model="data.title" clearable></el-input>
        </section>

        <mavon-editor 
            v-model="data.content" 
            :subfield="false"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
            ref="markdown" 
        />

        <section>
            <Date @getDate="getDate" :originalDate="data.time" v-if="isReset" />

            <el-input placeholder="文章摘要" v-model="data.describe" prefix-icon="el-icon-document" clearable></el-input>

            <div class="upload-box" v-if="!uploadToggle">
                <el-upload
                    class="upload-item"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="uploadMusic"
                    action
                    drag
                >
                    <i class="el-icon-headset"></i>
                    <div class="el-upload__text">{{ data.music.url ? data['music'].name : '背景音乐' }}</div>
                </el-upload>
                <el-upload
                    class="upload-item"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="uploadImage"
                    action
                    drag
                >
                    <img v-if="data.image.url" :src="data.image.url">
                    <template v-else>
                        <i class="el-icon-picture-outline-round"></i>
                        <div class="el-upload__text">封面图片 (680*440)</div>
                    </template>
                </el-upload>
            </div>

            <template v-else>
                <el-input placeholder="音乐地址" v-model="data.music.url" prefix-icon="el-icon-headset" clearable></el-input>
                <el-input placeholder="封面图片" v-model="data.image.url" prefix-icon="el-icon-picture-outline-round" clearable></el-input>
            </template>

            <el-switch v-model="uploadToggle" active-text="输入链接" inactive-text="文件上传"></el-switch>
            <el-switch v-model="data.hide" inactive-text="发布文章" active-text="隐藏文章"></el-switch>
        </section>

        <el-button type="primary" class="submit" @click="submit">SUBMIT</el-button>
    </div>
</template>

<script>
import Date from '@/components/Date'
import { mapState } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        Date,
        mavonEditor
    },
    data() {
        return {
            id: '',                     // 当前文章id（编辑）
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

            markdownImage: [],          // 编辑器的图片集合

            upload: {},
            uploadToggle: false,

            fullscreenLoading: false,
            loading: ''
        }
    },
    created(){
        this.id = this.$route.query.id;
        if (this.id) {
            this.loadData(this.id)
        }
    },
    // watch: {
    //     'data.image.url': {
    //         handler(val) {
    //             if(!val){
    //                 delete this.upload['image']
    //             }
    //         }
    //     },
    //     'data.music.url': {
    //         handler(val) {
    //             if(!val){
    //                 delete this.upload['music']
    //             }
    //         }
    //     }
    // },
    computed: {
        ...mapState(['$data'])
    },
    methods: {
        uploadMusic(file) {
            this.uploads('music', file)
        },
        uploadImage(file) {
            this.uploads('image', file)
        },
        // 保存临时文件
        uploads(type, file){
            const name = type == 'music' ? 'audio' : 'image';
            if (!file.raw.type.includes(name)) {
                this.$message.error(`请选择${name}格式的文件!`)
                return
            }
            const form = new FormData()
            form.append('file', file.raw)
            form.append('type', this.$data.info.base.upload_type)

            this.$set(this.data, type, {
                url: URL.createObjectURL(file.raw),
                name: file.name,
                form
            })
        },
        $imgAdd(index, $file){
            var form = new FormData();
            form.append('file', $file);
            form.append('type', this.$data.info.base.upload_type);

            this.markdownImage.push({
                index,
                form
            })
        },
        $imgDel(index){
            this.markdownImage.splice(index, 1)
        },
        async submit(){
            const markdown = this.$refs.markdown
            this.data.content = markdown.d_value    // 内容

            const map = {
                'title': '请输入标题',
                'content': '请输入内容',
                'time': '请选择时间'
            }
            for (let i in map) {
                if (!this.data[i]) {
                    this.$message.error(`${map[i]}`)
                    return
                }
            }

            this.fullscreenLoading = true

            // 上传内容区图片
            const conImgList = this.markdownImage
            for (let i = 0; i< conImgList.length; i++) {
                const result = await this.$http.post('/upload', conImgList[i]['form'])
                if (result.data.status == 1) {
                    markdown.$img2Url(i, result.data.body.url)
                    console.log(3)
                } else {
                    this.$message.error(result.data.body.message)
                    break
                }
            }
            
            console.log(2)

            this.data.contentHtml = markdown.d_render;     // 解析的html
            this.data.content = markdown.d_value;          // 输入的内容
            this.data.words = markdown.d_value.length;     // 字数
            
            // 上传文件
            if (!this.uploadToggle) {
                for (let i in this.upload) {
                    const { status, body } = await this.$http.post('/upload', this.upload[i].formData)

                    console.log(status, body)

                    if (status == 1) {
                        this.data[i].url = body.url
                    } else {
                        this.$message.error(body.message)
                        this.fullscreenLoading = false
                    }
                }
            }
            
            // 摘要默认内容
            const describe = this.data.describe;
            this.data.describe = !describe ? this.data.content.slice(0, 60) + '...' : describe;

            const type = this.id ? `article/${this.data._id}` : 'article';
            const mesg = this.id ? '更新' : '发表';

            this.$http.post(type, { data: this.data })
                .then(res => {
                    if (res.data.status === 1) {
                        this.$message.success(`${mesg}成功`)
                        this.$router.push('/article')
                        this.$infoUpdate()
                    } else {
                        this.$message.error(`${mesg}失败，请检查网络问题!`);
                    }
                    this.fullscreenLoading = false
                })
        },
        // 获取时间
        getDate(val){
            this.data.time = val;
        },
        // 获取当前文章的数据
        loadData(id){
            this.loading = this.$loading({target: '.container'})
            this.$http.get(`article/${id}`).then(res => {
                this.data = res.data.body
                this.isReset = false
                this.$nextTick(() => { this.isReset = true })
                this.loading.close()
            })
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
    .upload-item{
        width: 50%;
        max-width: 360px;
        margin: 0 7px;
        ::v-deep .el-upload{
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
::v-deep .el-switch__label{
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
    .upload-box .upload-item ::v-deep .el-upload .el-upload-dragger{
        height: 130px;
        .el-icon-picture-outline-round, .el-icon-headset{
            font-size: 36px;
            margin: 22px 0 10px;
        }
    }
}
</style>
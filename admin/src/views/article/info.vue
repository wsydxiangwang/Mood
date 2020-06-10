<template>
    <div class="article-new">

        <section>
            <h2>无人问津的心情，在黑纸白字间游荡！</h2>
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
                clearable>
            </el-input>
            <!-- <el-input
                placeholder="音乐地址"
                v-model="data.music"
                clearable>
            </el-input> -->

            <div>
                <el-upload
                    class="upload-demo"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="musicUpload"
                    action=""
                    drag
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                <el-upload
                    class="upload-demo"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="imgUpload"
                    action=""
                    drag
                >
                    <img v-if="data.image" :src="data.image">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </div>

            <el-switch
                v-model="data.hide"
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
                image: '',              // 图片
                music: '',              // 音乐
                hide: false,            // 文章是否隐藏
            },
            isReset: true,
            id: '',                     // 当前文章id（编辑）

            upload: []
        }
    },
    computed: {
        ...mapState(['info'])
    },
    methods: {
        musicUpload(file){
            if (!file.raw.type.includes('audio')) {
                this.$message.error('请选择音频格式的文件!')
                return
            }
            const formData = new FormData();
            formData.append('file', file.raw);            
            this.data.music = URL.createObjectURL(file.raw)
            
            this.upload.push({
                image: URL.createObjectURL(file.raw),
                formData
            })
            console.log(file)
        },
        imgUpload(file){
            if (!file.raw.type.includes('image')) {
                this.$message.error('请选择图片格式的文件!')
                return
            }
            const formData = new FormData();
            formData.append('file', file.raw);            
            this.data.image = URL.createObjectURL(file.raw)
            
            this.upload.push({
                image: URL.createObjectURL(file.raw),
                formData
            })
            console.log(file)
        },
        $imgAdd(pos, $file){
           var formdata = new FormData();
           formdata.append('file', $file);
           formdata.append('type', this.info.upload_type);

           this.$http.post('/upload', formdata).then(res => {           
               this.$refs.md.$img2Url(pos, res.data.image);
            })
        },
        $imgDel(pos){
            const data = {
                url: pos[0],
                type: this.info.upload_type
            }
            this.$http.post('/delete_file', data)
        },
        change(value, render){
            this.data.contentHtml = render;     // 解析的html
            this.data.content = value;          // 输入的内容
            this.data.words = value.length;     // 字数
        },
        submit(){
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

            // 摘要默认内容
            const describe = this.data.describe;
            this.data.describe = !describe ? this.data.content.slice(0, 60) + '...' : describe;

            for(let key in this.data){
                if(this.data[key] === ''){
                    this.$delete(this.data, key)
                }
            }

            const type = this.id ? `article/${this.data._id}` : 'article';
            const mesg = this.id ? '更新' : '发表';

            this.$http.post(type, this.data).then(res => {
                setTimeout(() => {
                    if(res.data.status === 1){
                        this.$message({
                            message: `${mesg}成功`,
                            type: 'success'
                        });
                        this.$router.push('/article')
                    }else{
                        this.$message.error(`${mesg}失败，请检查网络问题!`);
                    }
                }, 500)
            })
        },
        // 获取时间
        getDate(val){
            this.data.time = val;
        },
        // 获取当前文章的数据
        async loadData(id){
            const res = await this.$http.get(`article/${id}`)
            this.data = res.data.body;
            this.isReset = false;
            this.$nextTick(() => { this.isReset = true; })
        },
    },
    created(){
        this.id = this.$route.query.id;
        if(this.id) this.loadData(this.id);
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
    height: 70vh;
    box-shadow: none !important;
    border: 1px solid #eee !important;
}
.submit{
    width: 200px;
    height: 40px;
    font-size: 14px;
    color: #fff;
}
h2{
    margin: 10px 0 15px;
    font-size: 16px;
    color: #606060;
}
.cover{
    // overflow: hidden;
    /deep/ .el-upload{
        width: 300px;
        height: 170px;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 100%;
        }
        i{
            font-size: 30px;
            color: #dcdfe6;
            vertical-align: middle;
        }
    }
}
@media screen and (max-width: 600px) {
    .markdown-body{
        height: 100vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 0;
    }
}
</style>
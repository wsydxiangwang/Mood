(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2365403e"],{"0de1":function(e,a,t){"use strict";var l=t("31cc"),s=t.n(l);s.a},"31cc":function(e,a,t){},"79d9":function(e,a,t){"use strict";t.r(a);var l=function(){var e=this,a=e.$createElement,l=e._self._c||a;return l("div",[e._m(0),l("img",{attrs:{src:"/uploads/image/1591522810649.jpg",alt:""}}),l("el-form",{ref:"form",attrs:{model:e.form,"label-width":"100px"}},[e._l(e.formList[0],(function(a,t){return[a.show?e._e():l("el-form-item",{key:t,attrs:{label:a.value}},["avatar"==a.key?[l("el-upload",{staticClass:"avatar-uploader",attrs:{action:"","auto-upload":!1,"show-file-list":!1,"on-change":e.avatar}},[e.image[0].url?l("img",{attrs:{src:e.form.avatar||e.image[0].url}}):l("i",{staticClass:"el-icon-user"})])]:"upload_type"==a.key?[l("el-radio-group",{model:{value:e.form.upload_type,callback:function(a){e.$set(e.form,"upload_type",a)},expression:"form.upload_type"}},[l("el-radio",{attrs:{label:"服务器"}}),l("el-radio",{attrs:{label:"七牛云"}}),l("el-radio",{attrs:{label:"阿里云OSS"}})],1),"阿里云OSS"==e.form.resource?[l("el-input",{attrs:{placeholder:"bucket"},model:{value:e.form.email_pass,callback:function(a){e.$set(e.form,"email_pass",a)},expression:"form.email_pass"}}),l("el-input",{attrs:{placeholder:"region"},model:{value:e.form.email_pass,callback:function(a){e.$set(e.form,"email_pass",a)},expression:"form.email_pass"}}),l("el-input",{attrs:{placeholder:"endPoint"},model:{value:e.form.email_pass,callback:function(a){e.$set(e.form,"email_pass",a)},expression:"form.email_pass"}}),l("el-input",{attrs:{placeholder:"accessKeySecret"},model:{value:e.form.email_pass,callback:function(a){e.$set(e.form,"email_pass",a)},expression:"form.email_pass"}}),l("el-input",{attrs:{placeholder:"accessKeyId"},model:{value:e.form.email_pass,callback:function(a){e.$set(e.form,"email_pass",a)},expression:"form.email_pass"}})]:e._e()]:"email_message"==a.key?[l("el-switch",{model:{value:e.form.email_message,callback:function(a){e.$set(e.form,"email_message",a)},expression:"form.email_message"}})]:[l("el-input",{model:{value:e.form[a.key],callback:function(t){e.$set(e.form,a.key,t)},expression:"form[item.key]"}})]],2)]})),l("h1",{staticClass:"hint-tit"},[e._v("首屏效果 "),l("el-popover",{attrs:{placement:"top-start",width:"300",trigger:"hover"}},[l("p",[e._v("背景颜色请选择类似图片颜色的透明度")]),l("img",{attrs:{src:t("f5a3")}}),l("span",{attrs:{slot:"reference"},slot:"reference"},[e._v("(view)")])])],1),e._l(e.formList[1],(function(a,t){return[l("el-form-item",{key:t+22,attrs:{label:a.value}},["image"==a.key?[l("el-upload",{staticClass:"cover",attrs:{action:"","auto-upload":!1,"show-file-list":!1,"on-change":e.cover}},[e.image[1].url?l("img",{attrs:{src:e.form.cover["image"]||e.image[1].url}}):l("i",{staticClass:"el-icon-plus"})])]:"color"==a.key?[l("el-color-picker",{attrs:{"show-alpha":""},model:{value:e.form.cover["color"],callback:function(a){e.$set(e.form.cover,"color",a)},expression:"form.cover['color']"}})]:[l("el-input",{model:{value:e.form.cover[a.key],callback:function(t){e.$set(e.form.cover,a.key,t)},expression:"form.cover[item.key]"}})]],2)]})),l("h1",[e._v("修改密码")]),l("el-form-item",{attrs:{label:"原密码"}},[l("el-input",{model:{value:e.form.password,callback:function(a){e.$set(e.form,"password",a)},expression:"form.password"}})],1),l("el-form-item",{attrs:{label:"新密码"}},[l("el-input",{model:{value:e.form.passwords,callback:function(a){e.$set(e.form,"passwords",a)},expression:"form.passwords"}})],1),l("el-form-item",[l("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("立即保存")])],1)],2)],1)},s=[function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"header"},[t("h1",[e._v("网站信息")])])}],o={data(){return{image:[{},{}],formList:[[{key:"avatar",value:"管理员头像"},{key:"name",value:"管理员昵称"},{key:"address",value:"网站地址"},{key:"email",value:"邮箱地址"},{key:"email_name",value:"邮箱昵称"},{key:"upload_type",value:"文件上传"},{key:"email_message",value:"评论通知"},{key:"email_pass",value:"邮箱PASS",show:!0}],[{key:"image",value:"封面图"},{key:"describe",value:"描述"},{key:"date",value:"时间"},{key:"link",value:"链接"},{key:"color",value:"色调"}]],form:{cover:{},upload_type:"服务器"},url:""}},watch:{"form.email_message":{handler(e){this.formList[0][7].show=!e}}},methods:{onSubmit(){this.image.map(e=>0===Object.keys(e).length),console.log(this.image.map(e=>0===Object.keys(e).length))},avatar(e){const a=new FormData;a.append("file",e.raw);const t={type:"avatar",url:URL.createObjectURL(e.raw),formData:a};this.$set(this.image,0,t),this.$http.post("/upload",a).then(e=>{this.url=e.data.imageUrl,console.log(this.url)})},cover(e){const a=new FormData;a.append("files",e.raw);const t={type:"cover",url:URL.createObjectURL(e.raw),formData:a};this.$set(this.image,1,t)}}},r=o,i=(t("0de1"),t("2877")),m=Object(i["a"])(r,l,s,!1,null,"568cffee",null);a["default"]=m.exports},f5a3:function(e,a,t){e.exports=t.p+"img/cover.b5d33f25.png"}}]);
//# sourceMappingURL=chunk-2365403e.2fe7087f.js.map
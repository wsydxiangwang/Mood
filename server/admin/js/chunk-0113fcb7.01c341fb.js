(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0113fcb7"],{"1c08":function(t,e,a){"use strict";var s=a("6c66"),i=a.n(s);i.a},4405:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}]},[a("h2",[t._v("无人问津的心情，在黑纸白字间游荡！")]),a("mavon-editor",{ref:"md",staticStyle:{height:"60vh"},attrs:{subfield:!1},on:{change:t.change},model:{value:t.data.content,callback:function(e){t.$set(t.data,"content",e)},expression:"data.content"}}),a("section",[t.isReset?a("date",{attrs:{originalDate:t.data.time},on:{getDate:t.getDate}}):t._e()],1),a("el-button",{staticClass:"submit",attrs:{type:"primary"},on:{click:t.submit}},[t._v("SUBMIT")])],1)},i=[],n=a("e12b"),o=a("b2d8"),c=(a("64e1"),{components:{date:n["a"],mavonEditor:o["mavonEditor"]},data(){return{data:{content:"",contentHtml:"",time:""},loading:!1,isReset:!0,id:""}},methods:{getDate(t){this.data.time=t},change(t,e){this.data.contentHtml=e,this.data.content=t},submit(){this.loading=!0,this.id?this.$http.put(`/envelope/${this.data._id}`,this.data).then(t=>{setTimeout(()=>{this.loading=!1,this.$message({message:"修改成功",type:"success"}),this.$router.push("/envelope")},1e3)}):this.$http.post("/envelope",this.data).then(t=>{setTimeout(()=>{this.loading=!1,this.$message({message:"添加成功",type:"success"}),this.$router.push("/envelope")},1e3)})},async loadData(t){let e=await this.$http.get(`envelope/${t}`);this.data=e.data,console.log(this.data),this.isReset=!1,this.$nextTick(()=>{this.isReset=!0})}},created(){this.id=this.$route.query.id,this.id&&this.loadData(this.id)}}),d=c,h=(a("1c08"),a("2877")),l=Object(h["a"])(d,s,i,!1,null,"30189fa9",null);e["default"]=l.exports},"6c66":function(t,e,a){}}]);
//# sourceMappingURL=chunk-0113fcb7.01c341fb.js.map
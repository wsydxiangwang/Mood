(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c2c408ea"],{"0944":function(t,e,a){},1799:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.data>0?a("el-pagination",{attrs:{background:"","page-size":10,"pager-count":5,total:t.data,"current-page":t.page,layout:"prev, pager, next"},on:{"current-change":t.load}}):t._e()},o=[],s={props:{data:{type:Number,default:0},page:{type:Number,default:1}},methods:{load(t){this.$emit("update",t)}}},l=s,i=a("2877"),c=Object(i["a"])(l,n,o,!1,null,null,null);e["a"]=c.exports},b2a6:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"phrase"},[a("h2",{staticClass:"tit"},[t._v(" 短语列表 ("+t._s(t.total)+") "),a("span",{staticClass:"add",on:{click:t.newEnvelope}},[a("span",{staticClass:"el-icon-plus"}),t._v(" 新短语")])]),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.data,height:"calc(800px - 240px)"}},[a("el-table-column",{attrs:{label:"Title"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",[t._v(t._s(e.row.content))])]}}])}),a("el-table-column",{attrs:{label:"Date",width:"140"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t.$getDate(e.row.time)))])]}}])}),a("el-table-column",{attrs:{label:"options",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(t.list,(function(n,o){return a("el-tooltip",{key:o,attrs:{effect:"dark",placement:"top",content:n.text}},[a("i",{class:n.icon,on:{click:function(a){return t.option(e.row,o)}}})])}))}}])})],1),a("Pagination",{attrs:{data:t.total,page:t.page},on:{update:t.load}})],1)},o=[],s=a("1799"),l={components:{Pagination:s["a"]},data(){return{data:[],total:0,page:1,list:[{text:"Edit",icon:"el-icon-edit"},{text:"Delete",icon:"el-icon-delete"}]}},created(){this.load()},methods:{newEnvelope(){this.$router.push("/envelope/info")},load(t){this.$request(()=>this.$http.get("/envelope",{params:{page:t}}).then(t=>{["data","total","page"].map(e=>this[e]=t.data.body[e])}))},option(t,e){const a={0:()=>{this.$router.push({name:"envelopeInfo",query:{id:t._id}})},1:()=>{this.$confirm("删除该信息, 是否继续?","",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{this.$http.delete(`envelope/${t._id}`).then(t=>{this.load(),this.$message.success("删除成功!"),this.$infoUpdate()})}).catch(()=>{this.$message({type:"info",message:"已取消删除"})})}};a[e]()}}},i=l,c=(a("eed9"),a("2877")),r=Object(c["a"])(i,n,o,!1,null,"7ac8d443",null);e["default"]=r.exports},eed9:function(t,e,a){"use strict";var n=a("0944"),o=a.n(n);o.a}}]);
//# sourceMappingURL=chunk-c2c408ea.26f16205.js.map
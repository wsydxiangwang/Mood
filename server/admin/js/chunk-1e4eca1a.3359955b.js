(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1e4eca1a"],{1799:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.data>0?a("el-pagination",{attrs:{background:"","page-size":10,"pager-count":5,total:t.data,"current-page":t.page,layout:"prev, pager, next"},on:{"current-change":t.load}}):t._e()},i=[],s={props:{data:{type:Number,default:0},page:{type:Number,default:1}},methods:{load(t){this.$emit("update",t)}}},o=s,l=a("2877"),c=Object(l["a"])(o,n,i,!1,null,null,null);e["a"]=c.exports},"92c1":function(t,e,a){"use strict";var n=a("a8ee"),i=a.n(n);i.a},a8ee:function(t,e,a){},eb84:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"article"},[a("h2",{staticClass:"tit"},[t._v(" 文章列表 ("+t._s(t.total)+") "),a("span",{staticClass:"add",on:{click:t.newArticle}},[a("span",{staticClass:"el-icon-plus"}),t._v(" 新文章")])]),a("el-table",{attrs:{data:t.data}},[a("el-table-column",{attrs:{label:"Title"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",[t._v(t._s(e.row.title))])]}}])}),a("el-table-column",{staticClass:"hidden",attrs:{label:"Date",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t.$getDate(e.row.time)))])]}}])}),a("el-table-column",{attrs:{label:"options",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(t.options,(function(n,i){return a("el-tooltip",{key:i,staticClass:"item",attrs:{effect:"dark",content:n.text,placement:"top"}},[a("i",{class:n.icon,on:{click:function(a){return t.option(e.row,i)}}})])}))}}])})],1),a("Pagination",{attrs:{data:t.total,page:t.page},on:{update:t.load}})],1)},i=[],s=a("1799"),o={components:{Pagination:s["a"]},data(){return{data:[],total:0,page:1,options:[{icon:"el-icon-view",text:"View Article"},{icon:"el-icon-edit",text:"Edit Article"},{icon:"el-icon-delete",text:"Delete"}]}},created(){this.load()},methods:{newArticle(){this.$router.push("/article/info")},load(t){this.$request(()=>this.$http.get("/article",{params:{page:t}}).then(t=>{["data","total","page"].map(e=>this[e]=t.data.body[e])}))},option(t,e){const a={0:()=>{window.open(`${window.location.origin}/${t.id}`)},1:()=>{this.$router.push({name:"info",query:{id:t.id}})},2:()=>{this.$confirm("删除该文章, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{this.$request(()=>this.$http.delete(`article/${t._id}`).then(t=>{1===t.data.status?(this.load(),this.$message.success("删除成功！")):this.$message.error(t.data.body.message)}))}).catch(()=>{this.$message({type:"info",message:"已取消删除"})})}};a[e]()}}},l=o,c=(a("92c1"),a("2877")),r=Object(c["a"])(l,n,i,!1,null,"94c98e3e",null);e["default"]=r.exports}}]);
//# sourceMappingURL=chunk-1e4eca1a.3359955b.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-70594658"],{"3cbb":function(t,a,i){},f2b4:function(t,a,i){"use strict";i.r(a);var s=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"article"},[t._m(0),i("table",{staticClass:"article-list"},[t._m(1),i("tbody",t._l(t.articleList,(function(a,s){return i("tr",{key:s},[i("td",{staticClass:"title"},[t._v(t._s(a.title))]),i("td",{staticClass:"classify"},[t._v(t._s(a.classify))]),i("td",{staticClass:"comment"},[t._v(t._s(a.comment))]),i("td",{staticClass:"date"},[t._v(t._s(a.time))]),i("td",{staticClass:"edit",on:{click:function(i){return t.edit(a._id)}}},[t._v("编辑")]),i("td",{staticClass:"edit",on:{click:function(i){return t.remove(a)}}},[t._v("删除")])])})),0)])])},e=[function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"header"},[i("h1",[t._v("文章列表")]),i("div",{staticClass:"info"},[i("div",[t._v("全部(2)")]),i("div",[t._v("全部(2)")]),i("div",[t._v("全部(2)")]),i("div",[t._v("全部(2)")])])])},function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("thead",[i("tr",[i("td",[t._v("标题")]),i("td",[t._v("分类")]),i("td",[t._v("评论")]),i("td",[t._v("日期")]),i("td",[t._v("操作")]),i("td",[t._v("操作")])])])}],c={data(){return{articleList:[]}},created(){this.loadData()},methods:{async loadData(){const t=await this.$http.get("article");t.data&&(this.articleList=t.data)},edit(t){this.$router.push({name:"articleEdit",query:{id:t}})},async remove(t){await this.$http.delete(`article/${t._id}`);this.loadData()}}},n=c,d=(i("f72d"),i("2877")),l=Object(d["a"])(n,s,e,!1,null,null,null);a["default"]=l.exports},f72d:function(t,a,i){"use strict";var s=i("3cbb"),e=i.n(s);e.a}}]);
//# sourceMappingURL=chunk-70594658.360334bf.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-322338bd"],{"46ea":function(a,t,e){"use strict";var s=e("e57d"),n=e.n(s);n.a},dd7b:function(a,t,e){"use strict";e.r(t);var s=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"login"},[e("input",{directives:[{name:"model",rawName:"v-model",value:a.data.username,expression:"data.username"}],attrs:{type:"text",placeholder:"用户名"},domProps:{value:a.data.username},on:{input:function(t){t.target.composing||a.$set(a.data,"username",t.target.value)}}}),e("input",{directives:[{name:"model",rawName:"v-model",value:a.data.password,expression:"data.password"}],attrs:{type:"password",placeholder:"密码"},domProps:{value:a.data.password},on:{input:function(t){t.target.composing||a.$set(a.data,"password",t.target.value)}}}),e("button",{on:{click:a.login}},[a._v("登录")])])},n=[],o={data(){return{data:{username:"",password:""}}},methods:{async login(){const a=await this.$http.post("/login",this.data);1===a.data.status?(localStorage.setItem("Authorization",a.data.token),this.$router.push("/")):alert(a.data.message)}}},r=o,d=(e("46ea"),e("2877")),i=Object(d["a"])(r,s,n,!1,null,null,null);t["default"]=i.exports},e57d:function(a,t,e){}}]);
//# sourceMappingURL=chunk-322338bd.869c33ff.js.map
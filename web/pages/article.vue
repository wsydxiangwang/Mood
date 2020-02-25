<template>
    <div class="container">
        <section class="list">
            <div v-for="(val, key, idx) in list" :key="idx">
                <h2 class="year">{{key}} 年</h2>
                <div class="mon-list" v-for="(vals, keys, idxs) in val">
                    <h3 class="month">{{keys}} 月</h3>
                    <ul>
                        <li v-for="(valss, keyss, idxss) in vals">
                            <span>{{valss.time.day}}日：</span>
                            <span>{{valss.title}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: ''
        }
    },
    mounted(){
        this.list = this.data.reduce((a,b)=>{
            var [,year,date] = /(\d+)\/(\d+)/.exec(b.time.date);
            a[year] = a[year] || {};
            a[year][date] = a[year][date] || [];
            a[year][date].push(b);
            return a;
        }, {})

        console.log(this.list)
    },
    async asyncData(context){
		let {data} = await context.$axios.get('article')
		return {data: data}
	},
}
</script>

<style lang="scss" scoped> 
.list{
    width: 800px;
    margin: 0 auto;
    .year{
        color: #333;
        font-size: 22px;
        font-weight: 400;
        margin-top: 20px;
    }
    .mon-list{
        margin-top: 10px;
        .month{
            color: #333;
            font-weight: 400;
        }
        ul{
            margin-top: 10px;
            padding-left: 25px;
            li{
                margin: 10px 0;
                span:last-child{
                    text-decoration: underline;
                }
            }
        }
    }
} 
</style>
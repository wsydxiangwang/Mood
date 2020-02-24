<template>
    <div class="container">
        <section class="list">
            <div v-for="(value, key, index) in datas" :key="index">
                <h2>{{key}}</h2>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data(){
        return{
            datas: {
                '2020': {
                    '11': [
                        {
                            time: '12',
                            name: '余生，我们一起吃饭'
                        },
                        {
                            time: '25',
                            name: '余生，我们一起吃饭'
                        }
                    ],
                    '08': [
                        {
                            time: '04',
                            name: '余生，我们一起吃饭'
                        },
                        {
                            time: '08',
                            name: '余生，我们一起吃饭'
                        }
                    ]
                },
                '1299': {
                    '11': [
                        {
                            time: '12',
                            name: '余生，我们一起吃饭'
                        },
                        {
                            time: '25',
                            name: '余生，我们一起吃饭'
                        }
                    ],
                    '08': [
                        {
                            time: '04',
                            name: '余生，我们一起吃饭'
                        },
                        {
                            time: '08',
                            name: '余生，我们一起吃饭'
                        }
                    ]
                },
                
            }
        }
    },
    mounted(){

        console.log(this.data)

        this.data.reduce((a,b)=>{
            console.log(a)
            console.log(b)
            var [,year,date] = /(\d+)\/(\d+\/\d+)/.exec(b.time.date);
            a[year] = a[year] || {};
            a[year][date] = a[year][date] || [];
            a[year][date].push(b);
            return a;
        }, {})

        console.log(this.data)

    },
    async asyncData(context){
		let {data} = await context.$axios.get('article')
		return {data: data}
	},
}
</script>

<style lang="scss" scoped> 
    
</style>
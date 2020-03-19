<template>
    <div>
        <input type="number" oninput="if(value.length>4)value=value.slice(0,4)" v-model="data.year">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.monthNum">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.day">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.time">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.min">
    </div>
</template>

<script>
export default {
    props: ['originalDate'],
    data(){
        return{
            data: {},
            timer: null
        }
    },
    watch: {
        data: {
            handler(val, oldVal){
                if(Object.keys(oldVal).length != 0){
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() =>{
                        this.dateFormat()
                    }, 800)
                }
            },
            deep: true
        }
    },
    mounted(){
        if(this.originalDate){
            this.data = this.originalDate;
        }else{
            this.data = this.dateFormat();
        }
    },
    methods: {
        // 时间
        dateFormat(){
            let date = new Date();
            let opt = {
                "Y": date.getFullYear().toString(),        // 年
                "M": (date.getMonth() + 1).toString(),     // 月
                "D": date.getDate().toString(),            // 日
                "H": date.getHours().toString(),           // 时
                "m": date.getMinutes().toString(),         // 分
                "w": date.getDay()                   // 周
            };

            // 月
            let mArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
            let enArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let weekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let week = ['日', '一', '二', '三', '四', '五', '六'];
            let time = {};

            if(Object.keys(this.data).length > 0){
                opt = {
                    "Y": this.data.year,
                    "M": this.data.monthNum,
                    "D": this.data.day,
                    "H": this.data.time,
                    "m": this.data.min,
                    "w": new Date(Date.parse(`${this.data.year}/${this.data.monthNum}/${this.data.day}`)).getDay(),
                };
            }

            // 日
            let day = opt.D,
                one = 'st',
                two = 'nd',
                three = 'rd',
                four = 'th',
                obj = {
                    1: one,
                    2: two,
                    3: three,
                    21: one,
                    22: two,
                    23: three,
                    31: one
                };
            if(obj[opt.D]){
                day += obj[day];
            }else{
                day += four;
            }

            for(let k in opt){
                opt[k] = opt[k].length == 1 ? (opt[k].padStart(2, "0")) : opt[k];
            }

            time = {
                date: `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`,
                monthNum: opt.M,
                monthTxt: mArr[Number(opt.M) - 1],
                monthEn: enArr[Number(opt.M) - 1],
                year: opt.Y,
                day: opt.D,
                dayEn: day,
                week: week[opt.w],
                weekEn: weekEn[opt.w],
                hour: `${opt.H}:${opt.m}`,
                time: opt.H,
                min: opt.m,
            }

            this.$emit('getDate', time)

            return time;
        }
    }
}
</script>
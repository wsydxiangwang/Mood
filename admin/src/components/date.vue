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
            };
            let mArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
            let time = {};

            if(Object.keys(this.data).length > 0){
                opt = {
                    "Y": this.data.year,
                    "M": this.data.monthNum,
                    "D": this.data.day,
                    "H": this.data.time,
                    "m": this.data.min,
                };
            }

            for(let k in opt){
                opt[k] = opt[k].length == 1 ? (opt[k].padStart(2, "0")) : opt[k];
            }

            time = {
                date: `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`,
                monthNum: opt.M,
                monthTxt: mArr[Number(opt.M) - 1],
                year: opt.Y,
                day: opt.D,
                hour: `${opt.H}:${opt.m}`,
                time: `${opt.H}`,
                min: `${opt.m}`,
            }

            this.$emit('getDate', time)

            return time
        }
    }
}
</script>
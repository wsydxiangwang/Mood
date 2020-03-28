<template>
    <div>
        <!-- <input type="number" oninput="if(value.length>4)value=value.slice(0,4)" v-model="data.year">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.monthNum">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.day">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.time">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.min"> -->
        <el-date-picker
            v-model="value"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
        >
        </el-date-picker>
    </div>
</template>

<script>
export default {
    props: ['originalDate'],
    data(){
        return{
            data: {},
            value: '',
            timer: null,
        }
    },
    watch: {
        value(val){
            let date = val.split(' ');
            let dateArr = date.map((item) => {  
                if(item.indexOf('-') != -1){
                    return item.split('-') 
                }else{ 
                    return item.split(':')
                }  
            })
            let dateNew = [].concat.apply([], dateArr)

            this.dateFormat(dateNew)
        },
        data: {
            handler(val, oldVal){
                if(Object.keys(oldVal).length != 0){
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() =>{
                        // this.dateFormat()
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
            // this.data = this.dateFormat();
            console.log(this.data.date)
        }
    },
    methods: {
        dateChange(val){
            console.log(val)
        },
        // 时间
        dateFormat(date){
            // date == ['2020', '12', '14', '08', '58']

            let week = ['日', '一', '二', '三', '四', '五', '六'];
            let mArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
            let weekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let enArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

            let opt = {
                "Y": date[0],
                "M": date[1],
                "D": date[2],
                "H": date[3],
                "m": date[4],
                "w": new Date(Date.parse(`${date[0]}/${date[1]}/${date[2]}`)).getDay(),
            }

            // 日
            let day = opt.D,
                st = 'st',
                nd = 'nd',
                rd = 'rd',
                th = 'th',
                obj = {
                    1: st,
                    2: nd,
                    3: rd,
                    21: st,
                    22: nd,
                    23: rd,
                    31: st
                };
            if(obj[opt.D]){
                day += obj[day];
            }else{
                day += th;
            }

            for(let k in opt){
                opt[k] = opt[k].length == 1 ? (opt[k].padStart(2, "0")) : opt[k];
            }

            let time = {
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
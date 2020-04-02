<template>
    <el-date-picker
        v-model="value"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm"
        placeholder="选择日期时间"
    >
    </el-date-picker>
</template>

<script>
export default {
    props: ['originalDate'],
    data(){
        return{
            value: '',
        }
    },
    watch: {
        value(val){
            if(val){
                // 解析时间格式
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
            }else{
                this.$emit('getDate', null)
            }
        }
    },
    mounted(){
        // 默认时间
        if(this.originalDate && JSON.stringify(this.originalDate) != '{}'){
            let date = this.originalDate.date.replace(/\//g,"-")
            this.value = date
        }
    },
    methods: {
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

            for(let k in opt){
                opt[k] = opt[k].length == 1 ? (opt[k].padStart(2, "0")) : opt[k];
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
            // 去除第一个0
            day = day.slice(0, 1) == 0 ? day.slice(1) : day;

            let time = {
                date: `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`,
                year: opt.Y,
                month: opt.M,
                monthCn: mArr[Number(opt.M) - 1],
                monthEn: enArr[Number(opt.M) - 1],
                day: opt.D,
                dayEn: day,
                week: week[opt.w],
                weekEn: weekEn[opt.w],
                time: `${opt.H}:${opt.m}`,
                hour: opt.H,
                min: opt.m,
            }

            this.$emit('getDate', time)
            
            return time;
        }
    }
}
</script>
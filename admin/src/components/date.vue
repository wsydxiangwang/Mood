<template>
    <div>
        <input type="number" oninput="if(value.length>4)value=value.slice(0,4)" v-model="data.year">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.month">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.day">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.hour">
        <input type="number" oninput="if(value.length>2)value=value.slice(0,2)" v-model="data.min">
    </div>
</template>

<script>
export default {
    data(){
        return{
            data: {}
        }
    },
    watch: {
        data: {
            handler(val, oldVal){
                console.log(val)
            },
            deep: true
        }
    },
    methods: {
        // 时间
        dateFormat(fmt, mm){
            let date = new Date();
            let opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "M+": (date.getMonth() + 1).toString(),     // 月
                "D+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "m+": date.getMinutes().toString(),         // 分
                "s+": date.getSeconds().toString()          // 秒
            };
            for(let k in opt) {
                let ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            if(mm){
                let mArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
                fmt = mArr[Number(fmt) - 1];
            }
            return fmt;
        }
    }
}
</script>
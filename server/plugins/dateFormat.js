// 时间戳 转换
function dateFormat(timestamp) {
    const w = new Date(timestamp).getDay()

    timestamp = timestamp.toString().replace(/-|\:|\/|\ /g, ',').split(',')
    
    const week = ['日', '一', '二', '三', '四', '五', '六']
    const month = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    const weekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const monthEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const opt = ['Y', 'M', 'D', 'h', 'm', 'W'].reduce((t, v, i) => {
        t[v] = v === 'W' ? w : timestamp[i]
        return t
    }, {})

    // 日
    let st = 'st',
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

    let day = opt.D + (obj[opt.D] ? obj[opt.D] : th)
    day = day.startsWith(0) ? day.slice(1) : day    // 去除前面的0

    const time = {
        date: `${opt.Y}/${opt.M}/${opt.D} ${opt.h}:${opt.m}`,
        time: `${opt.h}:${opt.m}`,
        year: opt.Y,
        month: {
            on: opt.M,
            cn: month[Number(opt.M) - 1],
            en: monthEn[Number(opt.M) - 1]
        },
        day: {
            on: opt.D,
            en: day
        },
        week: {
            on: week[opt.W],
            en: weekEn[opt.W]
        }
    }
    return time
}

module.exports = dateFormat
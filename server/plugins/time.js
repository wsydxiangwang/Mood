const time = (time) => {

    const timestemp = new Date(time).getTime();
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const halfamonth = day * 15;
    const month = day * 30;
    const now = new Date().getTime();
    const diffValue = now - timestemp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return 'Just Now';
    }

    // 计算差异时间的量级
    const monthC = diffValue / month;
    const weekC = diffValue / (7 * day);
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;

    if (monthC > 4) {
        const date = new Date(timestemp);
        const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return mon[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    } else {
        const map = {
            [monthC]: "months ago",
            [weekC]: "weeks ago",
            [dayC]: "days ago",
            [hourC]: "hours ago",
            [minC]: "minutes ago",
        }
        for(let i in map){
            if(i >= 1){
                return `${parseInt(i)} ${map[i]}`
            }
        }
        return 'Just Now';
    }
}

module.exports = time
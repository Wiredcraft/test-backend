/**
 * @Author: Frank Xiang<github.com/Liyoh>
 */
import moment = require("moment")

// 返回月份日期时间段工具
function getMonthOfYear() {
    const January = new Date(moment().startOf('year').startOf('month').format('YYYY-MM-DD'))
    const February = new Date(moment().startOf('year').startOf('month').add(1, 'month').format('YYYY-MM-DD'))
    const March = new Date(moment().startOf('year').startOf('month').add(2, 'month').format('YYYY-MM-DD'))
    const April = new Date(moment().startOf('year').startOf('month').add(3, 'month').format('YYYY-MM-DD'))
    const May = new Date(moment().startOf('year').startOf('month').add(4, 'month').format('YYYY-MM-DD'))
    const June = new Date(moment().startOf('year').startOf('month').add(5, 'month').format('YYYY-MM-DD'))
    const July = new Date(moment().startOf('year').startOf('month').add(6, 'month').format('YYYY-MM-DD'))
    const August = new Date(moment().startOf('year').startOf('month').add(7, 'month').format('YYYY-MM-DD'))
    const September = new Date(moment().startOf('year').startOf('month').add(8, 'month').format('YYYY-MM-DD'))
    const October = new Date(moment().startOf('year').startOf('month').add(9, 'month').format('YYYY-MM-DD'))
    const November = new Date(moment().startOf('year').startOf('month').add(10, 'month').format('YYYY-MM-DD'))
    const December = new Date(moment().startOf('year').startOf('month').add(11, 'month').format('YYYY-MM-DD'))
    const LastDate = new Date(moment().startOf('year').startOf('month').add(12, 'month').format('YYYY-MM-DD'))

    return {
        January,
        February,
        March,
        April,
        May,
        June,
        July,
        August,
        September,
        October,
        November,
        December,
        LastDate
    }
}

// 返回week日期时间段工具
function getWeekOfToday() {
    const Monday = new Date(moment().startOf('isoWeek').format('YYYY-MM-DD'))
    const Tuesday = new Date(moment().startOf('isoWeek').add(1, 'days').format('YYYY-MM-DD'))
    const Wednesday = new Date(moment().startOf('isoWeek').add(2, 'days').format('YYYY-MM-DD'))
    const Thursday = new Date(moment().startOf('isoWeek').add(3, 'days').format('YYYY-MM-DD'))
    const Friday = new Date(moment().startOf('isoWeek').add(4, 'days').format('YYYY-MM-DD'))
    const Saturday = new Date(moment().startOf('isoWeek').add(5, 'days').format('YYYY-MM-DD'))
    const Sunday = new Date(moment().startOf('isoWeek').add(6, 'days').format('YYYY-MM-DD'))
    // 最后一个日期只起到统计作用
    const LastDate = new Date(moment().startOf('isoWeek').add(7, 'days').format('YYYY-MM-DD'))
    return {
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday,
        LastDate
    }
}
// 返回当前月是第几周
function getMonthWeek(date: Date) {
    const w = date.getDay()
    const d = date.getDate()
    return Math.ceil(
        (d + 6 - w) / 7
    )
}

// 获取当天和当前月的时间段
function getTodayAndCurrentMonth() {
    // 获取当天的开始和结束时刻
    const todayStartTime = new Date(moment().startOf('day').format('YYYY-MM-DD'))
    const todayEndTime = new Date(moment().add(1, 'day').startOf('day').format('YYYY-MM-DD'))

    // 获取当前月的开始和结束
    const currentMonthStartTime = new Date(moment().startOf('month').format('YYYY-MM-DD'))
    const currentMonthEndTime = new Date(moment().startOf('month').add(1, 'month').format('YYYY-MM-DD'))
    return {
        todayStartTime,
        todayEndTime,
        currentMonthStartTime,
        currentMonthEndTime
    }

}

//  获取当天和同比上周的时间范围
function getTodayAndPrevOfWeek() {
    // 获取当天的开始和结束时刻
    const startTime = new Date(moment().startOf('day').format('YYYY-MM-DD'))
    const endTime = new Date(moment().add(1, 'day').startOf('day').format('YYYY-MM-DD'))

    // 获取上周的开始和结束时刻
    const prevStartTime = new Date(moment().startOf('day').add(-7, 'days').format('YYYY-MM-DD'))
    const prevEndTime = new Date(moment().add(-6, 'days').startOf('day').format('YYYY-MM-DD'))


    return { startTime, endTime, prevStartTime, prevEndTime }
}

// 获取当天月的时间段以及上个月时间段和去年同比月份时间段
/**
 * 如果想获取当前月到下个月1号的时间段：即从本月1号到下个月1号，就不用填写任何参数
 * @param isMinsM 如果想加减月份，此字段必须为true，那么则isMinsYear字段必须为fasle
 * @param isMinsYear 如果想加减年份，此字段必须为true，则isMinsM必须为false
 * @param diff 默认是0，可以指定正负值来前后计算日期
 */
function getMonthPrevMonthAndPrevYearToMonth(isMinsM?: boolean, isMinsYear?: boolean, diff: number = 0) {

    // tslint:disable-next-line: triple-equals
    if (isMinsM == undefined && isMinsYear == undefined && diff == 0) {

        // 获取当前月的开始和结束时刻
        const momentMonthStartTime = new Date(moment().startOf('month').format('YYYY-MM-DD'))
        const momentMonthEndTime = new Date(moment().endOf('month').add(1, 'day').format('YYYY-MM-DD'))

        return {
            momentMonthStartTime, momentMonthEndTime
        }
    }

    // tslint:disable-next-line: triple-equals
    if (isMinsM == true) {
        // 获取相隔N个月的开始和结束时刻
        const prevMonthStartTime = new Date(moment().add(diff, 'month').startOf('month').format('YYYY-MM-DD'))
        const prevMonthEndTime = new Date(moment().add(diff, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD'))

        return {
            prevMonthStartTime, prevMonthEndTime
        }
    }

    // tslint:disable-next-line: triple-equals
    if (isMinsYear == true) {
        // 获取相隔N年同月的开始和结束时刻
        const prevYearToMonthStartTime = new Date(moment().add(diff, 'year').startOf('month').format('YYYY-MM-DD'))
        const prevYearToMonthEndTime = new Date(moment().add(diff, 'year').endOf('month').add(1, 'day').format('YYYY-MM-DD'))

        return {
            prevYearToMonthStartTime, prevYearToMonthEndTime
        }
    }


}

export default {
    getWeekOfToday,
    getMonthWeek,
    getMonthOfYear,
    getTodayAndPrevOfWeek,
    getMonthPrevMonthAndPrevYearToMonth,
    getTodayAndCurrentMonth
}
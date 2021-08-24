/**
 * 是否是合法的经度（-180~180），支持6位小数
 * @param longitude 经度值
 * @returns true/false
 */
const isLongitude = (longitude: string) => (/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(longitude));


/**
 * 是否是合法的纬度（-90~90），支持6位小数
 * @param latitude 纬度值
 * @returns true/false
 */
const isLatitude = (latitude: string) => (/^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/.test(latitude));


/**
 * 是否是符合YYYY-MM-DD格式的日期
 * @param date 日期
 * @returns true/false
 */
const isFormatDate = (date: string) => (new Date(date).toString() !== 'Invalid Date' || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(date));


export { isLongitude, isLatitude, isFormatDate };

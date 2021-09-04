import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import colors = require("colors");
import config from "@/config";

dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * 延时一段时间
 *
 * @author CaoMeiYouRen
 * @date 2019-08-26
 * @export
 * @param {number} time
 * @returns
 */
export async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
/**
 * 要格式化的时间戳、字符串或日期对象
 *
 * @author CaoMeiYouRen
 * @date 2019-08-22
 * @export
 * @param {(number | string | Date)} [date=Date.now()]
 * @param {string} [pattern='YYYY-MM-DD HH:mm:ss']
 * @returns {string}
 */
export function timeFormat(
    date: number | string | Date = Date.now(),
    pattern: string = "YYYY-MM-DD HH:mm:ss"
): string {
    return dayjs(date).tz().format(pattern);
}
/**
 *
 * @param {*} str 打印当前时间，可以附加文字
 */
export function printTime(str: any) {
    console.log(
        `${timeFormat(
            Date.now(),
            "YYYY-MM-DD HH:mm:ss.SSS"
        )} : ${JSON.stringify(str)}`
    );
}
/**
 * 日志模块
 */
export const Log = {
    log(msg: any) {
        if (config.IS_DEBUG) {
            console.log(
                `${colors.yellow(
                    timeFormat(Date.now(), "HH:mm:ss.SSS")
                )}: ${colors.green(
                    typeof msg === "string" ? msg : JSON.stringify(msg, null, 4)
                )}`
            );
        }
    },
    info(msg: any) {
        console.info(
            `${colors.yellow(
                timeFormat(Date.now(), "HH:mm:ss.SSS")
            )}: ${colors.green(
                typeof msg === "string" ? msg : JSON.stringify(msg, null, 4)
            )}`
        );
    },
    /**
     * 打印错误到控制台
     *
     * @author CaoMeiYouRen
     * @date 2020-05-26
     * @param {*} msg
     */
    error(msg: any) {
        console.error(
            `${colors.yellow(timeFormat(Date.now(), "HH:mm:ss.SSS"))}:`,
            colors.red(msg)
        );
    },
};

/**
 * 格式化时间
 *
 * @author CaoMeiYouRen
 * @date 2020-05-29
 * @export
 * @param {number} time
 * @returns
 */
export function timeFromNow(time: number) {
    const arr = [
        { name: "ms", len: 1000 },
        { name: "s", len: 60 },
        { name: "min", len: 60 },
        { name: "h", len: 24 },
        { name: "day", len: Infinity },
    ];
    for (let i = 0; i < arr.length; i++) {
        if (time < arr[i].len) {
            return `${time.toFixed(2)} ${arr[i].name}`;
        }
        time /= arr[i].len;
    }
    return `${time.toFixed(2)} day`;
}

/**
 * 格式化流量数据
 *
 * @author CaoMeiYouRen
 * @date 2019-07-25
 * @export
 * @param {number} data 单位B
 * @returns {string}
 */
export function dataFormat(data: number): string {
    const arr = ["B", "KB", "MB", "GB", "TB", "PB"];
    for (let i = 0; i < arr.length; i++) {
        if (data < 1024) {
            return `${data.toFixed(2)} ${arr[i]}`;
        }
        data /= 1024;
    }
    return `${data.toFixed(2)} PB`;
}

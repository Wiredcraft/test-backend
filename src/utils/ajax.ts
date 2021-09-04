import axios, { AxiosResponse, Method } from "axios";
// import { UA } from '@/config'
import { HttpError, HttpStatusCode } from "@/helpers";
import { Log } from "./helper";

class AjaxConfig {
    url: string;
    query?: Record<string, unknown> = {};
    data?: Record<string, unknown> = {};
    method?: Method = "GET";
    headers?: Record<string, unknown> = {};
    /**
     * 编码方式
     * @deprecated 暂时弃用
     * @type {string}
     */
    charset?: string;
}
/**
 * axios 封装，可满足大部分情况下的需求，若无法满足则重新封装 axios。
 *
 * @author CaoMeiYouRen
 * @date 2020-11-13
 * @export
 * @param {AjaxConfig} option
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function ajax(
    option: AjaxConfig = new AjaxConfig()
): Promise<AxiosResponse<any>> {
    const { url, query, data, method } = option;
    let { headers } = option;
    try {
        headers = Object.assign({ Referer: url }, headers);
        const result = await axios(url, {
            method,
            headers,
            params: query,
            data,
            timeout: 10000,
        });
        return result;
    } catch (error: any) {
        if (error instanceof HttpError) {
            throw error;
        }
        if (error.toJSON) {
            Log.error(error.toJSON());
        }
        throw error; // 将错误向上抛出
    }
}

/**
 * 获取本机外网IP
 *
 * @author CaoMeiYouRen
 * @date 2019-07-24
 * @export
 * @returns {Promise<string>}
 */
export async function getPublicIP(): Promise<string> {
    try {
        const res = await axios.get("https://ipv4.icanhazip.com/");
        let ip: string = res.data;
        ip = ip.replace(/\n/g, "");
        return ip;
    } catch (error) {
        console.log(error);
        return "";
    }
}

/**
 * 是否为URL
 *
 * @author CaoMeiYouRen
 * @date 2020-06-15
 * @export
 * @param {string} text
 * @returns {boolean}
 */
export function isURL(text: string): boolean {
    return /^((https?):\/\/)?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/.test(text)
}

export function isBittorrent(text: string) {
    return /^(magnet:\?xt=urn:btih:)[0-9a-zA-Z]{32,40}([-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])?$/.test(text)
}
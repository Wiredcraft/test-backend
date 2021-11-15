const kRemindKey = '$reminded'
const $reminded = JSONStorage(kRemindKey, [])

window.Prompt = {
    tip (title, duration = 2) {
        const div = document.createHTMLElement(`<div class="prompt-tip">${title}</div>`)
        div.cssVar('--duration', `${duration}s`)
        div.endAnimated('prompt-out', () => div.remove())
        div.appendTo(document.body)
    },

    async confirm (title) {
        const mask = document.createHTMLElement(`
    <mask>
        <div class="pop-box">
            <h2>${title}</h2>
            <div class="operation">
                <button class="form cancel">取消</button>
                <button class="form ok">确定</button>
            </div>
        </div>
    </mask>`)
        mask.appendTo(document.body)
        return new Promise(resolve => {
            mask.querySelector('.ok').on('click', () => {
                mask.fadeOut()
                resolve(true)
            })
            mask.querySelector('.cancel').on('click', () => mask.fadeOut())
        })
    },
    alert (text, titleButton = '确定') {       // Need user to click OK
        const mask = document.createHTMLElement(`
        <mask>
            <div class="pop-box">
                <h2>${text}</h2>
                <div class="operation">
                    <button class="form alert">${titleButton}</button>
                </div>
            </div>
        </mask>`)
            mask.appendTo(document.body)
            return new Promise(resolve => {
                mask.querySelector('.alert').on('click', () => {
                    mask.fadeOut()
                    resolve(true)
                })
            })
    },
    read ({ title, content, readonly, saveButton = '保存' }) {       // Need user to click OK
        const mask = document.createHTMLElement(`
        <mask>
            <div class="pop-box">
                <h3>${title}</h3>
                <textarea ${readonly ? 'readonly' : ''}></textarea>
                <div class="operation">
                    <button class="form cancel">取消</button>
                    <button class="form ok">${saveButton}</button>
                </div>
            </div>
        </mask>`)
            window.assign({ mask })
            mask.appendTo(document.body)
            const textarea = mask.querySelector('textarea')
            textarea.value = content ?? ''
            textarea.focus()
            return new Promise(resolve => {
                const finish = () => {
                    mask.fadeOut()
                    resolve(textarea.value.trim())
                }
                const cancel = () => {
                    mask.querySelector('.pop-box').addClass('quiet')
                    mask.fadeOut()
                }
                mask.querySelector('.ok' ).on('click', finish)
                textarea.ctrlEnter(finish)
                mask.querySelector('.cancel').on('click', cancel)
                textarea.esc(cancel)
            })
    },
    async chooseImage (placeholder, uploadLinkCover = uploadLink) {  // Implement when needed later
        const mask = document.createHTMLElement(`
        <mask>
            <div class="pop-box choose-image-box">
                <img src="/src/svg/add-outline.svg" class="upload" />
                <input-box placeholder="${placeholder.replace(/"/g, "'")}"></input-box>
                <div class="operation">
                    <button class="form cancel">取消</button>
                    <button class="form ok">确定</button>
                </div>
            </div>
        </mask>`)
            mask.appendTo(document.body)
            return new Promise(resolve => {
                let src, 
                    input = mask.querySelector('input-box'), 
                    submit = mask.querySelector('.ok'), 
                    uploading = false  
                mask.querySelector('img').on('click', async function () {
                    ({ src } = await document.uploadImage({ multiple: false }))                    
                    this.addClass('selected')
                    this.src = src 
                    if (!input.value) {
                        input.focus()
                    }
                })
                submit.on('click', async () => {
                    if (uploading) return;

                    let title = input.value
                    if (!src) {
                        return Prompt.tip('请上传图片')
                    }
                    if (!title) {
                        input.focus()
                        return Prompt.tip(`请输入${placeholder}`)
                    }
                    submit.innerHTML = '上传中'
                    uploading = true 
                    src = await uploadLinkCover(src)
                    submit.innerHTML = '完成'
                    mask.fadeOut()
                    resolve({ src, title })
                })
                mask.querySelector('.cancel').on('click', () => mask.fadeOut())
            })
    },
    remindOnce (title, key = location.pathname.split('/')[1]) {
        if ($reminded.includes(key)) {
//             console.log('Reminded already', key)
        } else {
            this.alert(title, '知道了')
            $reminded.push(key)
            $reminded.saveStorage(kRemindKey)
        }
    },
    clearReminded () {
        delete localStorage[kRemindKey]
        $reminded.length = 0
    }
}
async function uploadLink (cover) {
    const postData = { platform: Browser().toLowerCase(), cover0: cover.dataURLtoFile('course') }

    const result = await $once('/-/admin/upload/images', postData)
    console.log({ result })
    return result.cover0
}

function Browser () {
    const userAgent = navigator.userAgent
    let list = 'Opera/MSIE/Edge/Firefox/Chrome'.split('/')
    for (let i = 0; i < list.length; i++) {
        if (userAgent.includes(list[i])) {
            return list[i]
        }
    }
    if (userAgent.includes('Safari')) {
        return 'Safari'
    } else {
        return 'Unknown'
    }
}
Object.extendMethods({
    require (fieldNames, cannotEmpty = '不能为空', and = '和') {
        const missing = []
        fieldNames.loop((key, value) => {
            if (!this[key]) {
                missing.push(value)
            }
        })
        if (missing.length) {
            const front = missing.slice(0, missing.length - 1)
            let message = `${missing.last()}${cannotEmpty}`
            if (front.length) {
                message = `${front.join('、')}${and}${message}`
            }

            message.tip()
        }

        return missing.length === 0
    },
    parseJsonFields (...fields) {
        if (this.isList) {
            console.log('Array')
            this.each(item => item.parseJsonFields(...fields))
        } else {
            console.log('item')
            fields.each(field => this[field] = JSON.parse(this[field]))
        }
        return this;
    },
    saveStorage (key) {
        localStorage[key] = JSON.stringify(this)
    }
})

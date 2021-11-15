const kRemindKey = '$reminded'
const $reminded = JSONStorage(kRemindKey, [])

window.Prompt = {
    tip (title, duration = 2) {
        const div = document.createHTMLElement(html`<div class="prompt-tip">${title}</div>`)
        div.cssVar('--duration', `${duration}s`)
        div.endAnimated('prompt-out', () => div.remove())
        div.appendTo(document.body)
    },

    async confirm (title) {
        const mask = document.createHTMLElement(html`
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
            mask.querySelector('.cancel').on('click', () => {
                mask.querySelector('.pop-box').$leave()
                mask.fadeOut(0.1)
            })
        })
    },
    alert (text, titleButton = '确定') {       // Need user to click OK
        const mask = document.createHTMLElement(html`
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
    input ({ title }) {
        return Prompt.read({ title, saveButton: '确定', tag: 'input', classes: 'one-line' })
    },
    read ({ title, content, readonly, classes = '', saveButton = '保存', tag = 'textarea' }) {       // Need user to click OK
        const mask = document.createHTMLElement(html`
        <mask>
            <div class="pop-box ${classes}">
                <h3>${title}</h3>
                <${tag} ${readonly ? 'readonly' : ''}></${tag}>
                <div class="operation">
                    <button class="form cancel">${readonly ? '完成' : '取消'}</button>
                    <button class="form ok" ${readonly ? 'none' : ''}>${saveButton}</button>
                </div>
            </div>
        </mask>`)
            window.assign({ mask })
            mask.appendTo(document.body)
            const inputArea = mask.querySelector(tag)
            // const pop = mask.querySelector('.pop-box')
            inputArea.value = content ?? ''
            inputArea.focus()
            return new Promise(resolve => {
                const finish = () => {
                    mask.fadeOut()
                    resolve(inputArea.value.trim())
                }
                const cancel = () => {
                    mask.querySelector('.pop-box').$leave()
                    mask.fadeOut(0.1)
                }
                mask.querySelector('.ok' ).on('click', finish)
                if (tag === 'textarea') {
                    inputArea.ctrlEnter(finish)
                } else if (tag === 'input') {
                    inputArea.enter(finish)
                }

                mask.querySelector('.cancel').on('click', cancel)
                inputArea.esc(cancel)
            })
    },
    async chooseImage (placeholder, uploadLinkCover = uploadLink) {  // Implement when needed later
        const mask = document.createHTMLElement(html`
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
    const postData = { platform, cover0: cover.dataURLtoFile('room') }

    const result = await $upload('/-/admin/upload/images', postData)
    console.log({ result })
    return result.cover0
}

window.platform = (() => {
    const userAgent = navigator.userAgentData?.brands[2]?.brand ?? navigator.userAgent  // navigator.userAgentData only for HTTPS
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
})().toLowerCase()

Object.extendMethods({
    saveStorage (key) {
        localStorage[key] = JSON.stringify(this)
    }
})
